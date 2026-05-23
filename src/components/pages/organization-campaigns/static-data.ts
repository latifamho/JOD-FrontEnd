export type OrganizationCampaignStatus = "draft" | "active" | "closed";

export type OrganizationCampaignCategory =
  | "health"
  | "education"
  | "food"
  | "shelter"
  | "employment";

export type OrganizationCampaignItem = {
  id: string;
  title: string;
  summary: string;
  category: OrganizationCampaignCategory;
  status: OrganizationCampaignStatus;
  location: string;
  goalAmount: number;
  raisedAmount: number;
  beneficiariesCount: number;
  donorsCount: number;
  applicantsCount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  closedReason?: string;
};

export const organizationCampaignStatusLabels: Record<
  OrganizationCampaignStatus,
  string
> = {
  draft: "مسودة",
  active: "نشطة",
  closed: "مغلقة",
};

export const organizationCampaignCategoryLabels: Record<
  OrganizationCampaignCategory,
  string
> = {
  health: "صحية",
  education: "تعليمية",
  food: "غذائية",
  shelter: "إسكان",
  employment: "تمكين وفرص",
};

export const organizationCampaignsStaticData: OrganizationCampaignItem[] = [
  {
    id: "OCM-3001",
    title: "حملة دعم جلسات الغسيل الكلوي المنزلي",
    summary:
      "توفير أجهزة ومستهلكات شهرية لمرضى القصور الكلوي غير القادرين على تغطية التكاليف.",
    category: "health",
    status: "active",
    location: "الرياض",
    goalAmount: 480000,
    raisedAmount: 121000,
    beneficiariesCount: 75,
    donorsCount: 148,
    applicantsCount: 34,
    startDate: "2026-03-01T09:00:00",
    endDate: "2026-05-30T18:00:00",
    createdAt: "2026-02-12T11:20:00",
    updatedAt: "2026-03-04T09:30:00",
  },
  {
    id: "OCM-3002",
    title: "حملة تدريب مهني للشباب الباحثين عن عمل",
    summary:
      "برنامج تدريبي مكثف في المهارات المهنية وربط المتدربين بفرص عمل داخل المدينة.",
    category: "employment",
    status: "active",
    location: "جدة",
    goalAmount: 320000,
    raisedAmount: 209000,
    beneficiariesCount: 120,
    donorsCount: 96,
    applicantsCount: 211,
    startDate: "2026-02-20T10:00:00",
    endDate: "2026-06-15T18:00:00",
    createdAt: "2026-02-05T10:10:00",
    updatedAt: "2026-03-03T15:45:00",
  },
  {
    id: "OCM-3003",
    title: "حملة ترميم منازل الأسر المتضررة",
    summary:
      "تنفيذ أعمال الصيانة الأساسية والعزل وتأمين الاحتياجات الطارئة للأسر المتضررة.",
    category: "shelter",
    status: "active",
    location: "أبها",
    goalAmount: 560000,
    raisedAmount: 168000,
    beneficiariesCount: 58,
    donorsCount: 83,
    applicantsCount: 26,
    startDate: "2026-03-10T08:30:00",
    endDate: "2026-07-25T18:00:00",
    createdAt: "2026-02-18T08:50:00",
    updatedAt: "2026-03-01T18:15:00",
  },
  {
    id: "OCM-3004",
    title: "مشروع السلال الغذائية الموسمية",
    summary:
      "تجهيز وتوزيع سلال غذائية شهرية للأسر الأشد حاجة مع تتبع نسبة الاستفادة.",
    category: "food",
    status: "draft",
    location: "الدمام",
    goalAmount: 260000,
    raisedAmount: 0,
    beneficiariesCount: 340,
    donorsCount: 0,
    applicantsCount: 17,
    startDate: "2026-03-20T09:00:00",
    endDate: "2026-06-30T18:00:00",
    createdAt: "2026-02-27T12:30:00",
    updatedAt: "2026-03-05T08:20:00",
  },
  {
    id: "OCM-3005",
    title: "مبادرة دعم الرسوم الدراسية للطلاب",
    summary:
      "تغطية الرسوم والمواد التعليمية للطلاب من الأسر المتعففة خلال الفصل القادم.",
    category: "education",
    status: "draft",
    location: "المدينة المنورة",
    goalAmount: 390000,
    raisedAmount: 0,
    beneficiariesCount: 210,
    donorsCount: 0,
    applicantsCount: 49,
    startDate: "2026-04-01T08:00:00",
    endDate: "2026-08-01T18:00:00",
    createdAt: "2026-02-28T09:40:00",
    updatedAt: "2026-03-04T11:10:00",
  },
  {
    id: "OCM-3006",
    title: "حملة تجهيز وحدات إسعاف أولي مجتمعية",
    summary:
      "تجهيز نقاط إسعاف أولي في الأحياء ذات الكثافة العالية مع تدريب متطوعين محليين.",
    category: "health",
    status: "closed",
    location: "الرياض",
    goalAmount: 220000,
    raisedAmount: 220000,
    beneficiariesCount: 450,
    donorsCount: 201,
    applicantsCount: 12,
    startDate: "2025-12-15T10:00:00",
    endDate: "2026-02-15T18:00:00",
    createdAt: "2025-12-01T14:00:00",
    updatedAt: "2026-02-16T12:20:00",
    closedAt: "2026-02-16T12:20:00",
    closedReason: "تم إغلاق الحملة بعد تحقيق الهدف كاملًا.",
  },
  {
    id: "OCM-3007",
    title: "حملة تأهيل مختبرات مدرسية متنقلة",
    summary:
      "تجهيز مختبرات متنقلة لدعم المدارس الأقل جاهزية في القرى البعيدة.",
    category: "education",
    status: "closed",
    location: "حائل",
    goalAmount: 510000,
    raisedAmount: 372000,
    beneficiariesCount: 620,
    donorsCount: 174,
    applicantsCount: 40,
    startDate: "2025-11-20T09:00:00",
    endDate: "2026-02-20T18:00:00",
    createdAt: "2025-11-10T10:15:00",
    updatedAt: "2026-02-20T19:00:00",
    closedAt: "2026-02-20T19:00:00",
    closedReason: "إغلاق يدوي بعد انتهاء المدة المحددة للحملة.",
  },
  {
    id: "OCM-3008",
    title: "حملة دعم الوجبات الساخنة للأسر",
    summary:
      "تشغيل مطبخ ميداني وتوزيع وجبات يومية للأسر المحتاجة خلال موسم الشتاء.",
    category: "food",
    status: "active",
    location: "مكة",
    goalAmount: 280000,
    raisedAmount: 74000,
    beneficiariesCount: 280,
    donorsCount: 67,
    applicantsCount: 23,
    startDate: "2026-02-28T09:30:00",
    endDate: "2026-04-25T18:00:00",
    createdAt: "2026-02-17T08:40:00",
    updatedAt: "2026-03-05T09:05:00",
  },
  {
    id: "OCM-3009",
    title: "مبادرة فرص عمل للمتطوعين السابقين",
    summary:
      "تأهيل المتطوعين ذوي الخبرة وربطهم بفرص توظيف لدى شركاء المنظمة.",
    category: "employment",
    status: "draft",
    location: "جدة",
    goalAmount: 180000,
    raisedAmount: 0,
    beneficiariesCount: 90,
    donorsCount: 0,
    applicantsCount: 61,
    startDate: "2026-04-05T09:00:00",
    endDate: "2026-07-15T18:00:00",
    createdAt: "2026-03-01T12:00:00",
    updatedAt: "2026-03-05T14:35:00",
  },
];
