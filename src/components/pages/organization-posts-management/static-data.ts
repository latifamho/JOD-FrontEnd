export type OrganizationPostStatus =
  | "draft"
  | "published"
  | "archived";

export type OrganizationPostType =
  | "general"
  | "job_opportunity"
  | "campaign_teaser"
  | "campaign_update"
  | "campaign_summary";

export type OrganizationPostItem = {
  id: string;
  title: string;
  summary: string;
  type: OrganizationPostType;
  status: OrganizationPostStatus;
  location: string;
  campaignTitle?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  viewsCount: number;
  reactionsCount: number;
  applicationsCount: number;
  body?: string | null;
  images?: string[] | null;
};

export const organizationPostStatusLabels: Record<OrganizationPostStatus, string> =
  {
    draft: "مسودة",
    published: "نشط",
    archived: "مؤرشف",
  };

export const organizationPostTypeLabels: Record<OrganizationPostType, string> = {
  general: "بوست عادي",
  job_opportunity: "فرصة",
  campaign_teaser: "تمهيد حملة",
  campaign_update: "تحديث حملة",
  campaign_summary: "ملخص حملة",
};

export const organizationPostsStaticData: OrganizationPostItem[] = [
  {
    id: "ORG-POST-2001",
    title: "انطلاق حملة تجهيز وحدات الغسيل الكلوي",
    summary:
      "نعلن بدء حملة جديدة لدعم مرضى القصور الكلوي عبر توفير الأجهزة والمستلزمات المنزلية.",
    type: "campaign_teaser",
    status: "published",
    location: "الرياض",
    campaignTitle: "حملة دعم جلسات الغسيل الكلوي المنزلي",
    createdAt: "2026-02-24T09:20:00",
    updatedAt: "2026-02-25T13:10:00",
    publishedAt: "2026-02-25T13:10:00",
    viewsCount: 2840,
    reactionsCount: 427,
    applicationsCount: 0,
  },
  {
    id: "ORG-POST-2002",
    title: "فرصة عمل: منسق برامج ميدانية",
    summary:
      "مطلوب منسق برامج ميدانية بخبرة سنة على الأقل لمتابعة تنفيذ الأنشطة المجتمعية.",
    type: "job_opportunity",
    status: "published",
    location: "جدة",
    createdAt: "2026-02-20T10:00:00",
    updatedAt: "2026-02-21T14:05:00",
    publishedAt: "2026-02-21T14:05:00",
    viewsCount: 1915,
    reactionsCount: 219,
    applicationsCount: 74,
  },
  {
    id: "ORG-POST-2003",
    title: "تحديث الحملة: الوصول إلى 45% من الهدف",
    summary:
      "وصلت حملة دعم الغسيل الكلوي إلى 45% من الهدف مع استمرار استقبال التبرعات.",
    type: "campaign_update",
    status: "draft",
    location: "الرياض",
    campaignTitle: "حملة دعم جلسات الغسيل الكلوي المنزلي",
    createdAt: "2026-03-02T08:10:00",
    updatedAt: "2026-03-03T11:30:00",
    viewsCount: 0,
    reactionsCount: 0,
    applicationsCount: 0,
  },
  {
    id: "ORG-POST-2004",
    title: "ملخص حملة السلال الغذائية - الشهر الأول",
    summary:
      "ملخص نتائج الشهر الأول من الحملة وعدد الأسر المستفيدة ونسب التوزيع الجغرافي.",
    type: "campaign_summary",
    status: "draft",
    location: "الدمام",
    campaignTitle: "مشروع السلال الغذائية الموسمية",
    createdAt: "2026-03-01T12:00:00",
    updatedAt: "2026-03-05T09:40:00",
    viewsCount: 0,
    reactionsCount: 0,
    applicationsCount: 0,
  },
  {
    id: "ORG-POST-2005",
    title: "إرشادات التسجيل للمتطوعين الجدد",
    summary:
      "دليل مبسط لخطوات التسجيل والمتطلبات الأساسية للانضمام إلى فرق التطوع.",
    type: "general",
    status: "published",
    location: "مكة",
    createdAt: "2026-02-15T16:15:00",
    updatedAt: "2026-02-16T08:30:00",
    publishedAt: "2026-02-16T08:30:00",
    viewsCount: 1370,
    reactionsCount: 166,
    applicationsCount: 0,
  },
  {
    id: "ORG-POST-2006",
    title: "فرصة تطوع ميداني للحملة الصحية",
    summary:
      "نبحث عن متطوعين للمساعدة في تنظيم المواعيد واستقبال المستفيدين خلال الفعالية الصحية.",
    type: "job_opportunity",
    status: "draft",
    location: "الرياض",
    createdAt: "2026-02-28T09:35:00",
    updatedAt: "2026-03-01T10:50:00",
    viewsCount: 0,
    reactionsCount: 0,
    applicationsCount: 0,
  },
  {
    id: "ORG-POST-2007",
    title: "تمهيد لحملة تدريب مهني للشباب",
    summary:
      "إطلاق محتوى تمهيدي يوضح أهداف حملة التدريب المهني وخطة التنفيذ القادمة.",
    type: "campaign_teaser",
    status: "published",
    location: "جدة",
    campaignTitle: "حملة تدريب مهني للشباب الباحثين عن عمل",
    createdAt: "2026-02-12T11:40:00",
    updatedAt: "2026-02-13T12:10:00",
    publishedAt: "2026-02-13T12:10:00",
    viewsCount: 2230,
    reactionsCount: 312,
    applicationsCount: 0,
  },
  {
    id: "ORG-POST-2008",
    title: "تحديث شهري عن الحملة الإسكانية",
    summary:
      "عرض نسبة الإنجاز الحالية وأبرز الأعمال المنفذة في مشروع ترميم منازل الأسر المتضررة.",
    type: "campaign_update",
    status: "archived",
    location: "أبها",
    campaignTitle: "حملة ترميم منازل الأسر المتضررة",
    createdAt: "2026-01-20T10:05:00",
    updatedAt: "2026-02-10T18:15:00",
    publishedAt: "2026-01-21T09:00:00",
    viewsCount: 1640,
    reactionsCount: 201,
    applicationsCount: 0,
  },
  {
    id: "ORG-POST-2009",
    title: "ملخص نتائج حملة فرص العمل",
    summary:
      "مراجعة شاملة لنتائج حملة فرص العمل مع عرض عدد المقبولين والتحديات والدروس المستفادة.",
    type: "campaign_summary",
    status: "draft",
    location: "جدة",
    campaignTitle: "حملة تدريب مهني للشباب الباحثين عن عمل",
    createdAt: "2026-03-04T08:30:00",
    updatedAt: "2026-03-05T10:00:00",
    viewsCount: 0,
    reactionsCount: 0,
    applicationsCount: 0,
  },
];
