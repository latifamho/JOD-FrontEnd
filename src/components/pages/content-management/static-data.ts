export type ArticleStatus = "draft" | "published";

export type ArticleItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: ArticleStatus;
  publishedAt?: string;
  createdAt: string;
  authorName: string;
};

export const articleStatusLabels: Record<ArticleStatus, string> = {
  draft: "مسودة",
  published: "منشور",
};

export const articlesStaticData: ArticleItem[] = [
  {
    id: "ART-001",
    title: "كيف تتبرع بأمان عبر المنصة",
    slug: "how-to-donate-safely",
    excerpt: "إرشادات للتأكد من صحة الحملات قبل التبرع.",
    status: "published",
    publishedAt: "2026-02-20T10:00:00",
    createdAt: "2026-02-18T14:00:00",
    authorName: "فريق جود",
  },
  {
    id: "ART-002",
    title: "قصص نجاح: حملة كسوة الشتاء",
    slug: "winter-clothing-campaign-success",
    excerpt: "ملخص نتائج حملة كسوة الشتاء وتأثيرها على الأسر.",
    status: "published",
    publishedAt: "2026-02-22T09:00:00",
    createdAt: "2026-02-21T11:00:00",
    authorName: "فريق جود",
  },
  {
    id: "ART-003",
    title: "دليل التوثيق للمؤسسات",
    slug: "organization-verification-guide",
    excerpt: "خطوات توثيق المؤسسات وعرض الحساب البنكي.",
    status: "draft",
    createdAt: "2026-02-24T16:00:00",
    authorName: "فريق جود",
  },
  {
    id: "ART-004",
    title: "مساعدة الطالب: كيف تطلب الدعم",
    excerpt: "فئة خاصة لطلبات الطلاب مع متطلبات المستندات.",
    slug: "student-help-intro",
    status: "published",
    publishedAt: "2026-02-26T12:00:00",
    createdAt: "2026-02-25T10:00:00",
    authorName: "فريق جود",
  },
];
