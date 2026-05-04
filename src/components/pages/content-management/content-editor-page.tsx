"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  type ArticleItem,
  type ArticleStatus,
} from "@/components/pages/content-management/static-data";
import {
  createArticleSlug,
  createNextArticleId,
  readStoredArticles,
  writeStoredArticles,
} from "@/components/pages/content-management/helpers";

type ContentEditorPageProps = {
  mode: "create" | "edit";
  articleId?: string;
};

type ArticleFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  authorName: string;
  status: ArticleStatus;
};

const EMPTY_FORM_VALUES: ArticleFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  authorName: "فريق جود",
  status: "draft",
};

function toFormValues(article: ArticleItem): ArticleFormValues {
  return {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    authorName: article.authorName,
    status: article.status,
  };
}

export function ContentEditorPage({ mode, articleId }: ContentEditorPageProps) {
  const router = useRouter();

  const [isReady, setIsReady] = React.useState(mode === "create");
  const [hasNotFoundArticle, setHasNotFoundArticle] = React.useState(false);
  const [formValues, setFormValues] = React.useState<ArticleFormValues>(
    EMPTY_FORM_VALUES,
  );
  const [isSlugDirty, setIsSlugDirty] = React.useState(false);

  React.useEffect(() => {
    if (mode === "create") {
      setFormValues(EMPTY_FORM_VALUES);
      setHasNotFoundArticle(false);
      setIsReady(true);
      return;
    }

    const articles = readStoredArticles();
    const article = articleId
      ? articles.find((candidate) => candidate.id === articleId)
      : null;

    if (!article) {
      setHasNotFoundArticle(true);
      setIsReady(true);
      return;
    }

    setFormValues(toFormValues(article));
    setHasNotFoundArticle(false);
    setIsSlugDirty(true);
    setIsReady(true);
  }, [articleId, mode]);

  if (!isReady) {
    return <section className="flex flex-1" />;
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
        onSubmit={(event) => {
          event.preventDefault();

          const normalizedSlug =
            formValues.slug.trim() || createArticleSlug(formValues.title);
          if (!normalizedSlug) {
            return;
          }

          const articles = readStoredArticles();
          const now = new Date().toISOString();

          let nextArticles: ArticleItem[];
          if (mode === "create") {
            const nextArticle: ArticleItem = {
              id: createNextArticleId(articles),
              title: formValues.title.trim(),
              slug: normalizedSlug,
              excerpt: formValues.excerpt.trim(),
              authorName: formValues.authorName.trim(),
              status: formValues.status,
              createdAt: now,
              publishedAt: formValues.status === "published" ? now : undefined,
            };
            nextArticles = [nextArticle, ...articles];
          } else {
            nextArticles = articles.map((article) =>
              article.id === articleId
                ? {
                    ...article,
                    title: formValues.title.trim(),
                    slug: normalizedSlug,
                    excerpt: formValues.excerpt.trim(),
                    authorName: formValues.authorName.trim(),
                    status: formValues.status,
                    publishedAt:
                      formValues.status === "published"
                        ? article.publishedAt ?? now
                        : undefined,
                  }
                : article,
            );
          }

          writeStoredArticles(nextArticles);
          router.push(routePaths.adminScope.content);
        }}
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="article-title">العنوان</Label>
            <Input
              id="article-title"
              required
              value={formValues.title}
              onChange={(event) =>
                setFormValues((currentValues) => {
                  const nextTitle = event.target.value;
                  const nextSlug = isSlugDirty
                    ? currentValues.slug
                    : createArticleSlug(nextTitle);

                  return {
                    ...currentValues,
                    title: nextTitle,
                    slug: nextSlug,
                  };
                })
              }
              placeholder="اكتب عنوان المقال"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="article-slug">الرابط المختصر (slug)</Label>
            <Input
              id="article-slug"
              required
              value={formValues.slug}
              onChange={(event) => {
                setIsSlugDirty(true);
                setFormValues((currentValues) => ({
                  ...currentValues,
                  slug: createArticleSlug(event.target.value),
                }));
              }}
              placeholder="example-article-slug"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="article-excerpt">الملخص</Label>
            <Textarea
              id="article-excerpt"
              required
              rows={4}
              value={formValues.excerpt}
              onChange={(event) =>
                setFormValues((currentValues) => ({
                  ...currentValues,
                  excerpt: event.target.value,
                }))
              }
              placeholder="اكتب وصفا مختصرا للمقال"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="article-author">الكاتب</Label>
              <Input
                id="article-author"
                required
                value={formValues.authorName}
                onChange={(event) =>
                  setFormValues((currentValues) => ({
                    ...currentValues,
                    authorName: event.target.value,
                  }))
                }
                placeholder="اسم الكاتب"
              />
            </div>

            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select
                dir="rtl"
                value={formValues.status}
                onValueChange={(value) =>
                  setFormValues((currentValues) => ({
                    ...currentValues,
                    status: value as ArticleStatus,
                  }))
                }
              >
                <SelectTrigger className="w-full text-right">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start" position="popper" className="text-right">
                  {(Object.keys(articleStatusLabels) as ArticleStatus[]).map((status) => (
                    <SelectItem key={status} value={status} className="text-right text-xs">
                      {articleStatusLabels[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-start gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(routePaths.adminScope.content)}>
            إلغاء
          </Button>
          <Button type="submit">
            {mode === "create" ? "إضافة المقال" : "حفظ التعديلات"}
          </Button>
        </div>
      </form>
    </section>
  );
}
