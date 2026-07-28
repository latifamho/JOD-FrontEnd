"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, X } from "lucide-react";

import { EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { routePaths } from "@/constant/routes";
import {
  articleStatusLabels,
  type ArticleStatus,
} from "@/components/pages/content-management/content-management.types";
import { createArticleSlug } from "@/components/pages/content-management/helpers";
import {
  useCreateArticle,
  useUpdateArticle,
} from "@/features/admin/articles/admin.articles.query";
import { adminArticlesServices } from "@/features/admin/articles/admin.articles.services";
import { adminArticlesKeys } from "@/features/admin/articles/admin.articles.query-keys";
import { applyApiFieldErrorsToForm } from "@/lib/api-errors";

type ContentEditorPageProps = {
  mode: "create" | "edit";
  articleId?: string;
};

const articleFormSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  slug: z.string().min(1, "الرابط المختصر مطلوب"),
  excerpt: z.string().min(1, "الملخص مطلوب"),
  content: z.string().min(1, "محتوى المقال مطلوب"),
  authorName: z.string().min(1, "اسم الكاتب مطلوب"),
  status: z.enum(["draft", "published"]),
  images: z.array(z.string()),
});

type ArticleFormValues = z.infer<typeof articleFormSchema>;

const EMPTY_FORM_VALUES: ArticleFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  authorName: "فريق جود",
  status: "draft",
  images: [],
};

export function ContentEditorPage({ mode, articleId }: ContentEditorPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isReady, setIsReady] = React.useState(mode === "create");
  const [hasNotFoundArticle, setHasNotFoundArticle] = React.useState(false);
  const [isSlugDirty, setIsSlugDirty] = React.useState(false);
  const [imageDraft, setImageDraft] = React.useState("");

  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: EMPTY_FORM_VALUES,
  });

  const images = watch("images");

  React.useEffect(() => {
    if (mode === "create") {
      reset(EMPTY_FORM_VALUES);
      setHasNotFoundArticle(false);
      setIsReady(true);
      return;
    }

    if (!articleId) {
      setHasNotFoundArticle(true);
      setIsReady(true);
      return;
    }

    queryClient
      .fetchQuery({
        queryKey: adminArticlesKeys.detail(articleId),
        queryFn: () => adminArticlesServices.getArticleById(articleId),
        staleTime: 0,
      })
      .then((response) => {
        const article = response.data;
        reset({
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content ?? "",
          authorName: article.authorName,
          status: article.status,
          images: article.images ?? [],
        });
        setIsSlugDirty(true);
        setHasNotFoundArticle(false);
        setIsReady(true);
      })
      .catch(() => {
        setHasNotFoundArticle(true);
        setIsReady(true);
      });
  }, [articleId, mode, queryClient, reset]);

  if (!isReady) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
        <p className="text-sm">جاري تحميل المقال...</p>
      </section>
    );
  }

  if (mode === "edit" && hasNotFoundArticle) {
    return (
      <section className="flex flex-1 flex-col gap-4">
        <EmptyState
          icon="content"
          title="المقال غير موجود"
          description="لا يمكن العثور على المقال المطلوب تعديله."
        />
        <div className="flex justify-start">
          <Button asChild variant="outline">
            <Link href={routePaths.adminScope.content}>الرجوع إلى المقالات</Link>
          </Button>
        </div>
      </section>
    );
  }

  const onSubmit = (values: ArticleFormValues) => {
    const normalizedSlug = values.slug.trim() || createArticleSlug(values.title);
    if (!normalizedSlug) return;

    const body = {
      title: values.title.trim(),
      slug: normalizedSlug,
      excerpt: values.excerpt.trim(),
      content: values.content.trim(),
      authorName: values.authorName.trim(),
      status: values.status,
      images: values.images.filter(Boolean),
    };

    if (mode === "create") {
      createMutation.mutate(body, {
        onSuccess: () => router.push(routePaths.adminScope.content),
        onError: (error) => applyApiFieldErrorsToForm(error, setError),
      });
      return;
    }

    if (!articleId) return;

    updateMutation.mutate(
      { articleId, body },
      {
        onSuccess: () => router.push(routePaths.adminScope.content),
        onError: (error) => applyApiFieldErrorsToForm(error, setError),
      },
    );
  };

  const addImage = () => {
    const next = imageDraft.trim();
    if (!next) return;
    setValue("images", [...images, next], { shouldDirty: true });
    setImageDraft("");
  };

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div className="rounded-md border border-border bg-background p-4 shadow-xs">
        <h2 className="text-base font-semibold text-foreground">
          {mode === "create" ? "إضافة مقال جديد" : "تعديل المقال"}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {mode === "create"
            ? "أنشئ مقالا جديدا للمحتوى والمدونة."
            : "حدّث بيانات المقال الحالية ثم احفظ التعديلات."}
        </p>
      </div>

      <form
        className="rounded-md border border-border bg-background p-4 shadow-xs"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="article-title">العنوان</Label>
            <Input
              id="article-title"
              disabled={isSubmitting}
              placeholder="اكتب عنوان المقال"
              {...register("title", {
                onChange: (event) => {
                  if (!isSlugDirty) {
                    setValue("slug", createArticleSlug(event.target.value), {
                      shouldValidate: true,
                    });
                  }
                },
              })}
            />
            {errors.title ? (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="article-slug">الرابط المختصر (slug)</Label>
            <Input
              id="article-slug"
              disabled={isSubmitting}
              placeholder="example-article-slug"
              {...register("slug", {
                onChange: (event) => {
                  setIsSlugDirty(true);
                  setValue("slug", createArticleSlug(event.target.value), {
                    shouldValidate: true,
                  });
                },
              })}
            />
            {errors.slug ? (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="article-excerpt">الملخص</Label>
            <Textarea
              id="article-excerpt"
              disabled={isSubmitting}
              rows={4}
              placeholder="اكتب وصفا مختصرا للمقال"
              {...register("excerpt")}
            />
            {errors.excerpt ? (
              <p className="text-xs text-destructive">{errors.excerpt.message}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="article-content">محتوى المقال</Label>
            <Textarea
              id="article-content"
              disabled={isSubmitting}
              rows={10}
              placeholder="اكتب محتوى المقال الكامل"
              {...register("content")}
            />
            {errors.content ? (
              <p className="text-xs text-destructive">{errors.content.message}</p>
            ) : null}
          </div>

            <div className="space-y-2">
              <Label htmlFor="article-author">الكاتب</Label>
              <Input
                id="article-author"
                disabled={isSubmitting}
                placeholder="اسم الكاتب"
                {...register("authorName")}
              />
              {errors.authorName ? (
                <p className="text-xs text-destructive">
                  {errors.authorName.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>الحالة</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    dir="rtl"
                    disabled={isSubmitting}
                    value={field.value}
                    onValueChange={(value) =>
                      field.onChange(value as ArticleStatus)
                    }
                  >
                    <SelectTrigger className="w-full text-right">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start" position="popper" className="text-right">
                      {(Object.keys(articleStatusLabels) as ArticleStatus[]).map(
                        (status) => (
                          <SelectItem
                            key={status}
                            value={status}
                            className="text-right text-xs"
                          >
                            {articleStatusLabels[status]}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="article-image">صور المقال</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="article-image"
                disabled={isSubmitting}
                value={imageDraft}
                onChange={(e) => setImageDraft(e.target.value)}
                placeholder="أضف رابط صورة ثم اضغط إضافة"
                className="text-left"
                dir="ltr"
              />
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting || !imageDraft.trim()}
                onClick={addImage}
              >
                إضافة صورة
              </Button>
            </div>
            {images.length > 0 ? (
              <ul className="space-y-2">
                {images.map((imageUrl, index) => (
                  <li
                    key={`${imageUrl}-${index}`}
                    className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-xs"
                  >
                    <span className="flex-1 break-all text-muted-foreground">
                      {imageUrl}
                    </span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      disabled={isSubmitting}
                      onClick={() =>
                        setValue(
                          "images",
                          images.filter((_, i) => i !== index),
                          { shouldDirty: true },
                        )
                      }
                    >
                      <X className="size-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                يمكنك إضافة صورة واحدة أو أكثر عبر روابط الصور.
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-start gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => router.push(routePaths.adminScope.content)}
          >
            إلغاء
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {mode === "create" ? "إضافة المقال" : "حفظ التعديلات"}
          </Button>
        </div>
      </form>
    </section>
  );
}
