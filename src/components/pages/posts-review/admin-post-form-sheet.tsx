"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { FormLoadingSkeleton, MediaUploadField } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useAdminPostDetail, useCreateAdminPost, useUpdateAdminPost } from "@/features/admin/posts/admin.posts.query";
import { mediaServices } from "@/features/shared/media/media.services";
import type { MediaItem, MediaTarget } from "@/features/shared/media/media.types";
import { useMediaUploadQueue } from "@/hooks/use-media-upload-queue";
import { applyApiFieldErrorsToForm, normalizeApiError } from "@/lib/api-errors";
import { toast } from "@/lib/toast";

const schema = z.object({
  title: z.string().trim().min(1, "العنوان مطلوب").max(255, "العنوان يجب ألا يتجاوز 255 حرفًا"),
  description: z.string().trim().min(1, "الوصف مطلوب"),
});

type FormValues = z.infer<typeof schema>;

type AdminPostFormSheetProps = {
  open: boolean;
  mode: "create" | "edit";
  postId?: string;
  onOpenChange: (open: boolean) => void;
};

const EMPTY_VALUES: FormValues = { title: "", description: "" };

function target(postId: string, prop: "images" | "videos"): MediaTarget {
  return { model: "post", modelId: postId, prop };
}

export function AdminPostFormSheet({ open, mode, postId, onOpenChange }: AdminPostFormSheetProps) {
  const detailQuery = useAdminPostDetail(open && mode === "edit" ? postId ?? null : null);
  const createMutation = useCreateAdminPost();
  const updateMutation = useUpdateAdminPost();
  const imageQueue = useMediaUploadQueue(10, "image");
  const videoQueue = useMediaUploadQueue(10, "video");
  const [createdPostId, setCreatedPostId] = React.useState<string | null>(null);
  const [busyMediaIds, setBusyMediaIds] = React.useState<Set<string>>(new Set());

  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
  });

  React.useEffect(() => {
    if (!open) return;
    if (mode === "create") {
      reset(EMPTY_VALUES);
      return;
    }
    const post = detailQuery.data?.data;
    if (!post) return;
    reset({
      title: post.title ?? "",
      description: post.description ?? post.content ?? post.body ?? post.summary ?? "",
    });
  }, [detailQuery.data?.data, mode, open, reset]);

  const post = detailQuery.data?.data;
  const existingImages = (post?.media ?? []).filter((item) => item.prop === "images");
  const existingVideos = (post?.media ?? []).filter((item) => item.prop === "videos");
  const activePostId = mode === "edit" ? postId : createdPostId;
  const isBusy = createMutation.isPending || updateMutation.isPending || imageQueue.isUploading || videoQueue.isUploading || busyMediaIds.size > 0;
  const formLocked = isBusy || Boolean(createdPostId);

  const refreshDetail = React.useCallback(async () => {
    if (mode === "edit") await detailQuery.refetch();
  }, [detailQuery, mode]);

  const deleteExisting = React.useCallback(async (media: MediaItem) => {
    if (!postId || (media.prop !== "images" && media.prop !== "videos")) return;
    setBusyMediaIds((current) => new Set(current).add(media.id));
    try {
      await mediaServices.remove(target(postId, media.prop), media.id);
      await refreshDetail();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setBusyMediaIds((current) => {
        const next = new Set(current);
        next.delete(media.id);
        return next;
      });
    }
  }, [postId, refreshDetail]);

  const replaceExisting = React.useCallback(async (media: MediaItem, file: File) => {
    if (!postId || (media.prop !== "images" && media.prop !== "videos")) return;
    setBusyMediaIds((current) => new Set(current).add(media.id));
    try {
      await mediaServices.replace(target(postId, media.prop), media.id, file);
      await refreshDetail();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setBusyMediaIds((current) => {
        const next = new Set(current);
        next.delete(media.id);
        return next;
      });
    }
  }, [postId, refreshDetail]);

  const handleOpenChange = React.useCallback((nextOpen: boolean) => {
    if (!nextOpen && isBusy) return;
    if (!nextOpen) {
      imageQueue.reset();
      videoQueue.reset();
      setCreatedPostId(null);
      setBusyMediaIds(new Set());
    }
    onOpenChange(nextOpen);
  }, [imageQueue, isBusy, onOpenChange, videoQueue]);

  const submit = handleSubmit(async (values) => {
    try {
      let id = postId;
      if (mode === "create") {
        const response = await createMutation.mutateAsync({
          title: values.title.trim(),
          description: values.description.trim(),
        });
        const newPostId = response.data?.id;
        if (!newPostId) throw new Error("لم يُرجع الخادم معرّف المنشور بعد الإنشاء.");
        id = newPostId;
        setCreatedPostId(newPostId);
      } else if (postId) {
        await updateMutation.mutateAsync({
          postId,
          body: { title: values.title.trim(), description: values.description.trim() },
        });
      }

      if (!id) return;
      const [imagesResult, videosResult] = await Promise.all([
        imageQueue.uploadAll(target(id, "images")),
        videoQueue.uploadAll(target(id, "videos")),
      ]);
      const failedFileNames = [...imagesResult.failedFileNames, ...videosResult.failedFileNames];
      if (failedFileNames.length > 0) {
        toast.error(`تم حفظ المنشور، لكن تعذر رفع: ${failedFileNames.join("، ")}`);
        return;
      }
      handleOpenChange(false);
    } catch (error) {
      applyApiFieldErrorsToForm(error, setError);
    }
  });

  const retryImage = activePostId ? async (id: string) => { await imageQueue.retryItem(target(activePostId, "images"), id); } : undefined;
  const retryVideo = activePostId ? async (id: string) => { await videoQueue.retryItem(target(activePostId, "videos"), id); } : undefined;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" dir="rtl" className="w-[95vw] border-border p-0 sm:max-w-2xl">
        <form noValidate className="flex h-full flex-col" onSubmit={submit}>
          <SheetHeader className="border-b border-border pe-12 text-right">
            <SheetTitle className="text-right text-lg">{mode === "create" ? "إضافة منشور" : "تعديل المنشور"}</SheetTitle>
          </SheetHeader>
          <div className="flex-1 space-y-5 overflow-y-auto p-4">
            {mode === "edit" && detailQuery.isLoading ? (
              <FormLoadingSkeleton count={5} />
            ) : mode === "edit" && (detailQuery.isError || !post) ? (
              <p className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">تعذر تحميل المنشور.</p>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="admin-post-title">العنوان</Label>
                  <Input id="admin-post-title" disabled={formLocked} aria-invalid={Boolean(errors.title)} {...register("title")} />
                  {errors.title ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-post-description">الوصف</Label>
                  <Textarea id="admin-post-description" className="min-h-44" disabled={formLocked} aria-invalid={Boolean(errors.description)} {...register("description")} />
                  {errors.description ? <p className="text-xs text-destructive">{errors.description.message}</p> : null}
                </div>
                <MediaUploadField
                  label="صور المنشور - اختياري"
                  items={imageQueue.items}
                  existingMedia={existingImages}
                  busyMediaIds={busyMediaIds}
                  maxItems={10}
                  disabled={formLocked}
                  onFilesSelected={imageQueue.addFiles}
                  onRemoveQueued={imageQueue.removeItem}
                  onRetry={retryImage}
                  onDeleteExisting={mode === "edit" ? deleteExisting : undefined}
                  onReplaceExisting={mode === "edit" ? replaceExisting : undefined}
                />
                <MediaUploadField
                  label="فيديوهات المنشور - اختياري"
                  mediaKind="video"
                  items={videoQueue.items}
                  existingMedia={existingVideos}
                  busyMediaIds={busyMediaIds}
                  maxItems={10}
                  disabled={formLocked}
                  onFilesSelected={videoQueue.addFiles}
                  onRemoveQueued={videoQueue.removeItem}
                  onRetry={retryVideo}
                  onDeleteExisting={mode === "edit" ? deleteExisting : undefined}
                  onReplaceExisting={mode === "edit" ? replaceExisting : undefined}
                />
              </>
            )}
          </div>
          <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
            <Button type="button" variant="outline" disabled={isBusy} onClick={() => handleOpenChange(false)}>{createdPostId ? "إنهاء" : "إلغاء"}</Button>
            {!createdPostId && !(mode === "edit" && (detailQuery.isLoading || detailQuery.isError || !post)) ? (
              <Button type="submit" disabled={isBusy}>
                {isBusy ? <Loader2 className="size-4 animate-spin" /> : null}
                {mode === "create" ? "نشر المنشور" : "حفظ التعديلات"}
              </Button>
            ) : null}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
