import type { ArticleItem } from "@/components/pages/content-management/content-management.types";

export function getArticleStatusBadgeClass(status: ArticleItem["status"]): string {
  if (status === "published") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-100";
  }

  return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-100";
}

export function createArticleSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
