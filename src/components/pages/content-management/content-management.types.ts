export type ArticleStatus = "draft" | "published";

export type ArticleItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string | null;
  status: ArticleStatus;
  publishedAt?: string;
  createdAt: string;
  authorName: string;
  images?: string[];
};

export const articleStatusLabels: Record<ArticleStatus, string> = {
  draft: "مسودة",
  published: "منشور",
};
