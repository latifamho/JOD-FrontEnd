"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
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
import { adminArticlesKeys } from "@/features/admin/articles/admin.articles.query-keys";
import { useCreateArticle, useUpdateArticle } from "@/features/admin/articles/admin.articles.query";
import { adminArticlesServices } from "@/features/admin/articles/admin.articles.services";
import { mediaServices } from "@/features/shared/media/media.services";
import type { MediaItem, MediaTarget } from "@/features/shared/media/media.types";
import { useMediaUploadQueue } from "@/hooks/use-media-upload-queue";
import { applyApiFieldErrorsToForm, normalizeApiError } from "@/lib/api-errors";
import { toast } from "@/lib/toast";

const formSchema = z.object({
  title: z.string().trim().min(1, "العنوان مطلوب").max(255, "العنوان يجب ألا يتجاوز 255 حرفًا"),
  description: z.string().trim().min(1, "الوصف مطلوب"),
});

type FormValues = z.infer<typeof formSchema>;

type ContentFormSheetProps = {
  open: boolean;
  mode: "create" | "edit";
  articleId?: string;
  onOpenChange: (open: boolean) => void;
};

const EMPTY_VALUES: FormValues = { title: "", description: "" };

function target(articleId: string, prop: "images" | "videos"): MediaTarget {
  return { model: "article", modelId: articleId, prop };
}

export function ContentFormSheet({ open, mode, articleId, onOpenChange }: ContentFormSheetProps) {
  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();
  const imageQueue = useMediaUploadQueue(10, "image");
  const videoQueue = useMediaUploadQueue(10, "video");
  const [createdArticleId, setCreatedArticleId] = React.useState<string | null>(null);
  const [busyMediaIds, setBusyMediaIds] = React.useState<Set<string>>(new Set());

  const detailQuery = useQuery({
    queryKey: articleId ? adminArticlesKeys.detail(articleId) : [...adminArticlesKeys.all, "new"],
    queryFn: () => adminArticlesServices.getArticleById(articleId!),
    enabled: open && mode === "edit" && Boolean(articleId),
    staleTime: 0,
  });

  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY_VALUES,
  });

  React.useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      reset(EMPTY_VALUES);
      return;
    }

    const article = detailQuery.data?.data;
    if (!article) return;
    reset({
      title: article.title ?? "",
      description: article.description ?? article.content ?? article.excerpt ?? "",
    });
  }, [detailQuery.data?.data, mode, open, reset]);

  const article = detailQuery.data?.data;
  const existingImages = (article?.media ?? []).filter((item) => item.prop === "images");
  const existingVideos = (article?.media ?? []).filter((item) => item.prop === "videos");
  const activeArticleId = mode === "edit" ? articleId : createdArticleId;
  const isBusy = createMutation.isPending || updateMutation.isPending || imageQueue.isUploading || videoQueue.isUploading || busyMediaIds.size > 0;
  const formLocked = isBusy || Boolean(createdArticleId);

  const refreshDetail = React.useCallback(async () => {
    if (mode === "edit") await detailQuery.refetch();
  }, [detailQuery, mode]);

  const deleteExisting = React.useCallback(async (media: MediaItem) => {
    if (!articleId || (media.prop !== "images" && media.prop !== "videos")) return;
    setBusyMediaIds((current) => new Set(current).add(media.id));
    try {
      await mediaServices.remove(target(articleId, media.prop), media.id);
      await refreshDetail();
      toast.success(media.prop === "videos" ? "تم حذف الفيديو." : "تم حذف الصورة.");
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setBusyMediaIds((current) => {
        const next = new Set(current);
        next.delete(media.id);
        return next;
      });
    }
  }, [articleId, refreshDetail]);

  const replaceExisting = React.useCallback(async (media: MediaItem, file: File) => {
    if (!articleId || (media.prop !== "images" && media.prop !== "videos")) return;
    setBusyMediaIds((current) => new Set(current).add(media.id));
    try {
      await mediaServices.replace(target(articleId, media.prop), media.id, file);
      await refreshDetail();
      toast.success(media.prop === "videos" ? "تم استبدال الفيديو." : "تم استبدال الصورة.");
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setBusyMediaIds((current) => {
        const next = new Set(current);
        next.delete(media.id);
        return next;
      });
    }
  }, [articleId, refreshDetail]);

  const uploadQueuedMedia = React.useCallback(async (id: string) => {
    const [imagesResult, videosResult] = await Promise.all([
      imageQueue.uploadAll(target(id, "images")),
      videoQueue.uploadAll(target(id, "videos")),
    ]);
    return {
      failed: imagesResult.failed + videosResult.failed,
      failedFileNames: [...imagesResult.failedFileNames, ...videosResult.failedFileNames],
    };
  }, [imageQueue, videoQueue]);

  const submit = handleSubmit(async (values) => {
    try {
      let id = articleId;
      if (mode === "create") {
        const response = await createMutation.mutateAsync({
          title: values.title.trim(),
          description: values.description.trim(),
        });
        const newArticleId = response.data?.id;
        if (!newArticleId) throw new Error("لم يُرجع الخادم معرّف المقال بعد الإنشاء.");
        id = newArticleId;
        setCreatedArticleId(newArticleId);
      } else if (articleId) {
        await updateMutation.mutateAsync({
          articleId,
          body: {
            title: values.title.trim(),
            description: values.description.trim(),
          },
        });
      }

      if (!id) return;
      const result = await uploadQueuedMedia(id);
      if (result.failed > 0) {
        toast.error(`تم حفظ المقال، لكن تعذر رفع: ${result.failedFileNames.join("، ")}`);
        return;
      }

      handleOpenChange(false);
    } catch (error) {
      applyApiFieldErrorsToForm(error, setError);
    }
  });

  const retryImage = activeArticleId
    ? async (id: string) => { await imageQueue.retryItem(target(activeArticleId, "images"), id); }
    : undefined;
  const retryVideo = activeArticleId
    ? async (id: string) => { await videoQueue.retryItem(target(activeArticleId, "videos"), id); }
    : undefined;

  const handleOpenChange = React.useCallback((nextOpen: boolean) => {
    if (!nextOpen && isBusy) return;
    if (!nextOpen) {
      imageQueue.reset();
      videoQueue.reset();
      setCreatedArticleId(null);
      setBusyMediaIds(new Set());
    }
    onOpenChange(nextOpen);
  }, [imageQueue, isBusy, onOpenChange, videoQueue]);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" dir="rtl" className="w-[95vw] border-border p-0 sm:max-w-2xl">
        <form noValidate className="flex h-full flex-col" onSubmit={submit}>
          <SheetHeader className="border-b border-border pe-12 text-right">
            <SheetTitle className="text-right text-lg">
              {mode === "create" ? "إضافة مقال جديد" : "تعديل المقال"}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-5 overflow-y-auto p-4">
            {mode === "edit" && detailQuery.isLoading ? (
              <FormLoadingSkeleton count={5} />
            ) : mode === "edit" && (detailQuery.isError || !article) ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                تعذر تحميل المقال المطلوب.
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="content-title">العنوان</Label>
                  <Input
                    id="content-title"
                    disabled={formLocked}
                    aria-invalid={Boolean(errors.title)}
                    placeholder="اكتب عنوان المقال"
                    {...register("title")}
                  />
                  {errors.title ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content-description">الوصف</Label>
                  <Textarea
                    id="content-description"
                    disabled={formLocked}
                    aria-invalid={Boolean(errors.description)}
                    className="min-h-44"
                    placeholder="اكتب محتوى المقال"
                    {...register("description")}
                  />
                  {errors.description ? <p className="text-xs text-destructive">{errors.description.message}</p> : null}
                </div>

                <MediaUploadField
                  label="صور المقال - اختياري"
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
                  label="فيديوهات المقال - اختياري"
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

                {createdArticleId && (imageQueue.failedItems.length > 0 || videoQueue.failedItems.length > 0) ? (
                  <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                    تم إنشاء المقال. أعد محاولة الملفات الفاشلة أو أنهِ العملية للاحتفاظ بما تم رفعه بنجاح.
                  </p>
                ) : null}
              </>
            )}
          </div>

          <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
            <Button type="button" variant="outline" disabled={isBusy} onClick={() => onOpenChange(false)}>
              {createdArticleId ? "إنهاء" : "إلغاء"}
            </Button>
            {!createdArticleId && !(mode === "edit" && (detailQuery.isLoading || detailQuery.isError || !article)) ? (
              <Button type="submit" disabled={isBusy}>
                {isBusy ? <Loader2 className="size-4 animate-spin" /> : null}
                {mode === "create" ? "نشر المقال" : "حفظ التعديلات"}
              </Button>
            ) : null}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
