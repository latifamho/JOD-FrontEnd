import {
  articlesStaticData,
  type ArticleItem,
} from "@/components/pages/content-management/static-data";

const CONTENT_ARTICLES_STORAGE_KEY = "jod-admin-content-articles";

export function createNextArticleId(articles: ArticleItem[]): string {
  const maxId = articles.reduce((currentMax, article) => {
    const numericPart = Number.parseInt(article.id.replace(/\D/g, ""), 10);
    if (Number.isNaN(numericPart)) {
      return currentMax;
    }
    return Math.max(currentMax, numericPart);
  }, 0);

  return `ART-${String(maxId + 1).padStart(3, "0")}`;
}

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

export function readStoredArticles(): ArticleItem[] {
  if (typeof window === "undefined") {
    return articlesStaticData;
  }

  const rawArticles = window.localStorage.getItem(CONTENT_ARTICLES_STORAGE_KEY);
  if (!rawArticles) {
    return articlesStaticData;
  }

  try {
    const parsedArticles = JSON.parse(rawArticles) as unknown;
    if (!Array.isArray(parsedArticles)) {
      return articlesStaticData;
    }

    const normalizedArticles = parsedArticles.filter(
      (article): article is ArticleItem =>
        typeof article === "object" &&
        article !== null &&
        typeof article.id === "string" &&
        typeof article.title === "string" &&
        typeof article.slug === "string" &&
        typeof article.excerpt === "string" &&
        (article.status === "draft" || article.status === "published") &&
        (typeof article.publishedAt === "string" ||
          typeof article.publishedAt === "undefined") &&
        typeof article.createdAt === "string" &&
        typeof article.authorName === "string",
    );

    return normalizedArticles.length > 0 ? normalizedArticles : articlesStaticData;
  } catch {
    return articlesStaticData;
  }
}

export function writeStoredArticles(articles: ArticleItem[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    CONTENT_ARTICLES_STORAGE_KEY,
    JSON.stringify(articles),
  );
}
