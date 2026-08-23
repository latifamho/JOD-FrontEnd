"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { routePaths } from "@/constant/routes";
import { useCreateArticle } from "@/features/admin/articles/admin.articles.query";
import { adminArticlesServices } from "@/features/admin/articles/admin.articles.services";
import { useAuth } from "@/providers/AuthProvider";

const contentCreateSchema = z.object({
  title: z.string().trim().min(1, "العنوان مطلوب"),
  description: z.string().trim().min(1, "الوصف مطلوب"),
  images: z.array(z.unknown()).min(1, "أضف صورة واحدة على الأقل").max(10, "يمكن إضافة 10 صور كحد أقصى"),
});

type ContentCreateFormValues = z.infer<typeof contentCreateSchema>;

export function ContentCreatePage() {
  const router = useRouter();
  const { user } = useAuth();
  const createMutation = useCreateArticle();
  const [isUploadingImages, setIsUploadingImages] = React.useState(false);
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContentCreateFormValues>({
    resolver: zodResolver(contentCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      images: [],
    },
  });

  const images = watch("images");

  React.useEffect(() => {
    return () => imagePreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [imagePreviews]);

  const updateImages = React.useCallback(
    (files: File[]) => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      setImagePreviews(files.map((file) => URL.createObjectURL(file)));
      setValue("images", files, { shouldDirty: true, shouldValidate: true });
    },
    [imagePreviews, setValue],
  );

  const removeImage = React.useCallback(
    (index: number) => {
      const nextFiles = (images as File[]).filter((_, imageIndex) => imageIndex !== index);
      updateImages(nextFiles);
    },
    [images, updateImages],
  );

  const isSubmitting = createMutation.isPending || isUploadingImages;

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">إضافة مقال جديد</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          أضف عنوان المقال ووصفه والصور المرفقة.
        </p>
      </div>

      <form
        className="space-y-5 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6"
        noValidate
        onSubmit={handleSubmit(({ title, description, images }) => {
          createMutation.mutate(
            {
              title: title.trim(),
              excerpt: description.trim(),
              content: description.trim(),
              authorName: user?.name?.trim() || "مدير النظام",
              status: "draft",
            },
            {
              onSuccess: async (response) => {
                const articleId = response.data?.id;
                if (!articleId) return;

                setIsUploadingImages(true);
                try {
                  for (const file of images as File[]) {
                    await adminArticlesServices.uploadArticleImage(articleId, file);
                  }
                  router.push(routePaths.adminScope.content);
                } finally {
                  setIsUploadingImages(false);
                }
              },
            },
          );
        })}
      >
        <div className="space-y-2">
          <Label htmlFor="article-title">العنوان</Label>
          <Input
            id="article-title"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.title)}
            placeholder="اكتب عنوان المقال"
            {...register("title")}
          />
          {errors.title ? (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="article-description">الوصف</Label>
          <Textarea
            id="article-description"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.description)}
            rows={8}
            placeholder="اكتب وصف المقال"
            {...register("description")}
          />
          {errors.description ? (
            <p className="text-xs text-destructive">{errors.description.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="article-images">الصور</Label>
          <Input
            id="article-images"
            type="file"
            accept="image/*"
            multiple
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.images)}
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []).slice(0, 10);
              updateImages(files);
            }}
          />
          {errors.images ? (
            <p className="text-xs text-destructive">{errors.images.message as string}</p>
          ) : (
            <p className="text-[11px] text-muted-foreground">يمكن إضافة حتى 10 صور.</p>
          )}

          {imagePreviews.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3">
              {imagePreviews.map((preview, index) => (
                <div key={preview} className="group relative overflow-hidden rounded-lg border border-border">
                  <img
                    src={preview}
                    alt={`معاينة الصورة ${index + 1}`}
                    className="aspect-video w-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute end-2 top-2 size-7"
                    disabled={isSubmitting}
                    onClick={() => removeImage(index)}
                  >
                    <X className="size-4" />
                    <span className="sr-only">حذف الصورة</span>
                  </Button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => router.push(routePaths.adminScope.content)}
          >
            إلغاء
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
            إضافة المقال
          </Button>
        </div>
      </form>
    </section>
  );
}
