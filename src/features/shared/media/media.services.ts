import { api } from "@/services/api";
import type { MediaItem, MediaTarget, MediaUploadResponse } from "./media.types";

function mediaBasePath(target: MediaTarget): string {
  return `/media/${target.model}/${target.modelId}/${target.prop}`;
}

function fileBody(file: File): FormData {
  const formData = new FormData();
  formData.append("file", file);
  return formData;
}

export const mediaServices = {
  async upload(target: MediaTarget, file: File): Promise<MediaItem> {
    const response = await api.post<MediaUploadResponse>(mediaBasePath(target), fileBody(file), {
      skipSuccessToast: true,
      skipErrorToast: true,
    });
    return response.data.data;
  },

  async replace(target: MediaTarget, mediaId: string, file: File): Promise<MediaItem> {
    const response = await api.post<MediaUploadResponse>(
      `${mediaBasePath(target)}/${mediaId}/replace`,
      fileBody(file),
      {
        skipSuccessToast: true,
        skipErrorToast: true,
      },
    );
    return response.data.data;
  },

  async remove(target: MediaTarget, mediaId: string): Promise<void> {
    await api.delete(`${mediaBasePath(target)}/${mediaId}`, {
      skipSuccessToast: true,
      skipErrorToast: true,
    });
  },
};
