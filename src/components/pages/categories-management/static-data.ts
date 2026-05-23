export type CategoryTarget = "post" | "campaign";

export type CategoryStatus = "active" | "inactive";

export type AdminCategoryItem = {
  id: string;
  name: string;
  target: CategoryTarget;
  description: string;
  usageCount: number;
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
};

export const categoryTargetLabels: Record<CategoryTarget, string> = {
  post: "تصنيفات المنشورات",
  campaign: "تصنيفات الحملات",
};

export const categoryStatusLabels: Record<CategoryStatus, string> = {
  active: "مفعلة",
  inactive: "متوقفة",
};

export const categoriesStaticData: AdminCategoryItem[] = [
  {
    id: "cat-1001",
    name: "أخبار المنظمة",
    target: "post",
    description: "تصنيف للأخبار والتحديثات الرسمية الخاصة بالمنظمة.",
    usageCount: 18,
    status: "active",
    createdAt: "2026-02-01T09:00:00.000Z",
    updatedAt: "2026-05-10T08:30:00.000Z",
  },
  {
    id: "cat-1002",
    name: "قصص نجاح",
    target: "post",
    description: "يستخدم لعرض قصص المستفيدين والنتائج الإيجابية.",
    usageCount: 11,
    status: "active",
    createdAt: "2026-02-11T11:15:00.000Z",
    updatedAt: "2026-05-03T10:20:00.000Z",
  },
  {
    id: "cat-1003",
    name: "تحديثات ميدانية",
    target: "post",
    description: "منشورات يومية مرتبطة بالنشاطات الميدانية للفرق.",
    usageCount: 7,
    status: "inactive",
    createdAt: "2026-03-05T13:40:00.000Z",
    updatedAt: "2026-04-18T09:00:00.000Z",
  },
  {
    id: "cat-2001",
    name: "إغاثة عاجلة",
    target: "campaign",
    description: "تصنيف حملات الاستجابة السريعة للحالات الطارئة.",
    usageCount: 6,
    status: "active",
    createdAt: "2026-01-24T10:30:00.000Z",
    updatedAt: "2026-05-12T14:00:00.000Z",
  },
  {
    id: "cat-2002",
    name: "تمكين تعليمي",
    target: "campaign",
    description: "حملات دعم التعليم والمنح والأنشطة التعليمية.",
    usageCount: 4,
    status: "active",
    createdAt: "2026-02-16T08:45:00.000Z",
    updatedAt: "2026-04-28T11:10:00.000Z",
  },
  {
    id: "cat-2003",
    name: "دعم صحي",
    target: "campaign",
    description: "حملات الدعم الصحي والأدوية والفحوصات.",
    usageCount: 5,
    status: "inactive",
    createdAt: "2026-03-01T07:20:00.000Z",
    updatedAt: "2026-04-14T15:35:00.000Z",
  },
];
