"use client";

import { AlertCircle, CheckCircle2, Clock3, Loader2, RotateCw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MediaItem } from "@/features/shared/media/media.types";
import type { MediaUploadQueueItem } from "@/hooks/use-media-upload-queue";

type MediaUploadFieldProps = {
  label?: string;
  items: MediaUploadQueueItem[];
  maxItems: number;
  disabled?: boolean;
  multiple?: boolean;
  existingMedia?: MediaItem[];
  busyMediaIds?: Set<string>;
  onFilesSelected: (files: File[]) => void;
  onRemoveQueued: (id: string) => void;
  onRetry?: (id: string) => void;
  onDeleteExisting?: (media: MediaItem) => void;
  onReplaceExisting?: (media: MediaItem, file: File) => void;
};

function StatusIcon({ item }: { item: MediaUploadQueueItem }) {
  if (item.status === "uploading") return <Loader2 className="size-4 animate-spin text-primary" />;
  if (item.status === "success") return <CheckCircle2 className="size-4 text-emerald-600" />;
  if (item.status === "error") return <AlertCircle className="size-4 text-destructive" />;
  return <Clock3 className="size-4 text-muted-foreground" />;
}

export function MediaUploadField({
  label = "الصور",
  items,
  maxItems,
  disabled = false,
  multiple = true,
  existingMedia = [],
  busyMediaIds = new Set(),
  onFilesSelected,
  onRemoveQueued,
  onRetry,
  onDeleteExisting,
  onReplaceExisting,
}: MediaUploadFieldProps) {
  const totalCount = existingMedia.length + items.filter((item) => item.status !== "error" || item.media).length;
  const canAdd = !disabled && totalCount < maxItems;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="media-upload-input">{label}</Label>
        <span className="text-[11px] text-muted-foreground">{totalCount}/{maxItems}</span>
      </div>

      <Input
        id="media-upload-input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        disabled={!canAdd}
        onChange={(event) => {
          const remaining = Math.max(0, maxItems - totalCount);
          const files = Array.from(event.target.files ?? []).slice(0, remaining);
          if (files.length) onFilesSelected(files);
          event.target.value = "";
        }}
      />
      <p className="text-[11px] leading-5 text-muted-foreground">
        JPG أو PNG أو WEBP، وبحد أقصى 5 ميجابايت لكل صورة. يتم رفع الصور واحدة تلو الأخرى.
      </p>

      {(existingMedia.length > 0 || items.length > 0) ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {existingMedia.map((media) => {
            const busy = busyMediaIds.has(media.id);
            return (
              <div key={media.id} className="space-y-2 rounded-lg border border-border p-2">
                <div className="relative overflow-hidden rounded-md bg-muted">
                  <img src={media.url} alt={media.originalName} className="aspect-square w-full object-cover" />
                  {busy ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                      <Loader2 className="size-5 animate-spin" />
                    </div>
                  ) : null}
                </div>
                <p className="truncate text-[11px]" title={media.originalName}>{media.originalName}</p>
                <div className="flex gap-1">
                  {onReplaceExisting ? (
                    <label className="flex-1 cursor-pointer rounded-md border border-input px-2 py-1 text-center text-[11px] hover:bg-accent">
                      استبدال
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="sr-only"
                        disabled={disabled || busy}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) onReplaceExisting(media, file);
                          event.target.value = "";
                        }}
                      />
                    </label>
                  ) : null}
                  {onDeleteExisting ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-8"
                      disabled={disabled || busy}
                      onClick={() => onDeleteExisting(media)}
                    >
                      <Trash2 className="size-3.5" />
                      <span className="sr-only">حذف الصورة</span>
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}

          {items.map((item) => (
            <div key={item.id} className="space-y-2 rounded-lg border border-border p-2">
              <div className="relative overflow-hidden rounded-md bg-muted">
                <img src={item.previewUrl} alt={item.file.name} className="aspect-square w-full object-cover" />
                <div className="absolute end-1 top-1 rounded-full bg-background/90 p-1 shadow-sm">
                  <StatusIcon item={item} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="truncate text-[11px]" title={item.file.name}>{item.file.name}</p>
                {item.error ? <p className="text-[10px] leading-4 text-destructive">{item.error}</p> : null}
              </div>
              <div className="flex gap-1">
                {item.status === "error" && onRetry ? (
                  <Button type="button" variant="outline" size="sm" className="h-7 flex-1 text-[11px]" onClick={() => onRetry(item.id)}>
                    <RotateCw className="size-3" />
                    إعادة المحاولة
                  </Button>
                ) : null}
                {item.status !== "uploading" ? (
                  <Button type="button" variant="outline" size="icon" className="size-7" onClick={() => onRemoveQueued(item.id)}>
                    <Trash2 className="size-3" />
                    <span className="sr-only">إزالة</span>
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
