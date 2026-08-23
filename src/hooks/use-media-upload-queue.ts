"use client";

import * as React from "react";

import { normalizeApiError } from "@/lib/api-errors";
import { mediaServices } from "@/features/shared/media/media.services";
import type { MediaItem, MediaTarget } from "@/features/shared/media/media.types";

export type MediaUploadStatus = "queued" | "uploading" | "success" | "error";

export interface MediaUploadQueueItem {
  id: string;
  file: File;
  previewUrl: string;
  status: MediaUploadStatus;
  media?: MediaItem;
  error?: string;
}

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function createLocalId(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`;
}

function validateImage(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "نوع الملف غير مدعوم. استخدم JPG أو PNG أو WEBP.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "حجم الصورة يجب ألا يتجاوز 5 ميجابايت.";
  }
  return null;
}

export function useMediaUploadQueue(maxItems: number) {
  const [items, setItems] = React.useState<MediaUploadQueueItem[]>([]);
  const itemsRef = React.useRef(items);

  React.useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const updateItem = React.useCallback((id: string, patch: Partial<MediaUploadQueueItem>) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }, []);

  const addFiles = React.useCallback(
    (files: File[]) => {
      setItems((current) => {
        const available = Math.max(0, maxItems - current.length);
        const accepted = files.slice(0, available);
        return [
          ...current,
          ...accepted.map((file) => {
            const validationError = validateImage(file);
            return {
              id: createLocalId(file),
              file,
              previewUrl: URL.createObjectURL(file),
              status: validationError ? ("error" as const) : ("queued" as const),
              error: validationError ?? undefined,
            };
          }),
        ];
      });
    },
    [maxItems],
  );

  const removeItem = React.useCallback((id: string) => {
    setItems((current) => {
      const target = current.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  }, []);

  const uploadOne = React.useCallback(
    async (target: MediaTarget, item: MediaUploadQueueItem): Promise<boolean> => {
      const validationError = validateImage(item.file);
      if (validationError) {
        updateItem(item.id, { status: "error", error: validationError });
        return false;
      }

      updateItem(item.id, { status: "uploading", error: undefined });
      try {
        const media = await mediaServices.upload(target, item.file);
        updateItem(item.id, { status: "success", media, error: undefined });
        return true;
      } catch (error) {
        updateItem(item.id, {
          status: "error",
          error: normalizeApiError(error).message || "تعذر رفع الصورة.",
        });
        return false;
      }
    },
    [updateItem],
  );

  const uploadAll = React.useCallback(
    async (target: MediaTarget) => {
      const currentItems = itemsRef.current;
      const queue = currentItems.filter((item) => item.status === "queued");
      const validationFailures = currentItems.filter((item) => item.status === "error" && !item.media);
      let uploaded = 0;
      let failed = validationFailures.length;
      const failedFileNames: string[] = validationFailures.map((item) => item.file.name);

      for (const item of queue) {
        const succeeded = await uploadOne(target, item);
        if (succeeded) uploaded += 1;
        else {
          failed += 1;
          failedFileNames.push(item.file.name);
        }
      }

      return { uploaded, failed, failedFileNames };
    },
    [uploadOne],
  );

  const retryItem = React.useCallback(
    async (target: MediaTarget, id: string) => {
      const item = itemsRef.current.find((candidate) => candidate.id === id);
      if (!item) return false;
      return uploadOne(target, item);
    },
    [uploadOne],
  );

  const retryFailed = React.useCallback(
    async (target: MediaTarget) => {
      const failed = itemsRef.current.filter((item) => item.status === "error");
      let uploaded = 0;
      const failedFileNames: string[] = [];

      for (const item of failed) {
        const succeeded = await uploadOne(target, item);
        if (succeeded) uploaded += 1;
        else failedFileNames.push(item.file.name);
      }

      return { uploaded, failed: failedFileNames.length, failedFileNames };
    },
    [uploadOne],
  );

  const reset = React.useCallback(() => {
    setItems((current) => {
      current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return [];
    });
  }, []);

  React.useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  return {
    items,
    addFiles,
    removeItem,
    uploadAll,
    retryItem,
    retryFailed,
    reset,
    isUploading: items.some((item) => item.status === "uploading"),
    hasQueued: items.some((item) => item.status === "queued"),
    failedItems: items.filter((item) => item.status === "error"),
    successfulMedia: items.flatMap((item) => (item.media ? [item.media] : [])),
  };
}
