import type { ModerationStatus } from "@/components/shared";

export type ReviewCampaignCategory =
  | "health"
  | "education"
  | "shelter"
  | "food"
  | "emergency";

export type ReviewCampaignItem = {
  id: string;
  title: string;
  summary: string;
  organizationName: string;
  campaignManagerName: string;
  location: string;
  submittedAt: string;
  startDate: string;
  endDate: string;
  status: ModerationStatus;
  category: ReviewCampaignCategory;
  goalAmount: number;
  raisedAmount: number;
  beneficiariesCount: number;
  reviewedBy?: string;
  rejectionReason?: string;
};

export const reviewCampaignCategoryLabels: Record<
  ReviewCampaignCategory,
  string
> = {
  health: "صحية",
  education: "تعليمية",
  shelter: "إسكان",
  food: "غذائية",
  emergency: "طوارئ",
};

export const reviewStatusLabels: Record<ModerationStatus, string> = {
  pending: "قيد المراجعة",
  approved: "مقبولة",
  rejected: "مرفوضة",
};

export const reviewCampaignsStaticData: ReviewCampaignItem[] = [
  {
    id: "CAM-2001",
    title: "حملة دعم جلسات الغسيل الكلوي المنزلي",
    summary:
      "توفير أجهزة ومستهلكات شهرية لمرضى القصور الكلوي غير القادرين على تغطية التكاليف.",
    organizationName: "جمعية الخير الطبية",
    campaignManagerName: "د. آية منصور",
    location: "الرياض",
    submittedAt: "2026-02-25T08:30:00",
    startDate: "2026-03-01T09:00:00",
    endDate: "2026-05-30T18:00:00",
    status: "pending",
    category: "health",
    goalAmount: 480000,
    raisedAmount: 92000,
    beneficiariesCount: 75,
  },
  {
    id: "CAM-2002",
    title: "حملة تدريب مهني للشباب الباحثين عن عمل",
    summary:
      "برنامج تدريبي مكثف في المهارات المهنية وربط المتدربين بفرص عمل داخل المدينة.",
    organizationName: "مؤسسة عطاء الأثر",
    campaignManagerName: "خالد علي",
    location: "جدة",
    submittedAt: "2026-02-24T11:00:00",
    startDate: "2026-02-20T10:00:00",
    endDate: "2026-06-15T18:00:00",
    status: "pending",
    category: "education",
    goalAmount: 320000,
    raisedAmount: 45000,
    beneficiariesCount: 120,
  },
  {
    id: "CAM-2003",
    title: "حملة ترميم منازل الأسر المتضررة",
    summary:
      "تنفيذ أعمال الصيانة الأساسية والعزل وتأمين الاحتياجات الطارئة للأسر المتضررة.",
    organizationName: "مؤسسة سكن آمن",
    campaignManagerName: "أحمد الخالدي",
    location: "أبها",
    submittedAt: "2026-02-24T14:20:00",
    startDate: "2026-03-10T08:30:00",
    endDate: "2026-07-25T18:00:00",
    status: "pending",
    category: "shelter",
    goalAmount: 560000,
    raisedAmount: 168000,
    beneficiariesCount: 58,
  },
  {
    id: "CAM-2004",
    title: "مشروع السلال الغذائية الموسمية",
    summary:
      "تجهيز وتوزيع سلال غذائية شهرية للأسر الأشد حاجة مع تتبع نسبة الاستفادة.",
    organizationName: "جمعية أمن غذائي",
    campaignManagerName: "ليان مصطفى",
    location: "الدمام",
    submittedAt: "2026-02-23T16:30:00",
    startDate: "2026-03-20T09:00:00",
    endDate: "2026-06-30T18:00:00",
    status: "pending",
    category: "food",
    goalAmount: 260000,
    raisedAmount: 0,
    beneficiariesCount: 340,
  },
  {
    id: "CAM-2005",
    title: "حملة إغاثة طارئة لمتضرري الأمطار",
    summary:
      "توفير مأوى مؤقت وسلال غذائية وملابس للأسر المتضررة في المناطق الأكثر تضررًا.",
    organizationName: "مبادرة إغاثة سريعة",
    campaignManagerName: "يزن العطار",
    location: "الطائف",
    submittedAt: "2026-02-22T09:40:00",
    startDate: "2026-02-22T08:00:00",
    endDate: "2026-04-30T18:00:00",
    status: "pending",
    category: "emergency",
    goalAmount: 400000,
    raisedAmount: 125000,
    beneficiariesCount: 210,
  },
  {
    id: "CAM-2006",
    title: "حملة دعم أجهزة سمعية للأطفال",
    summary:
      "تأمين أجهزة سمعية لعدد من الأطفال بعد الانتهاء من التقييم الطبي المعتمد.",
    organizationName: "جمعية أمل السمع",
    campaignManagerName: "ميس العتيبي",
    location: "القصيم",
    submittedAt: "2026-02-21T18:00:00",
    startDate: "2026-03-05T09:00:00",
    endDate: "2026-06-01T18:00:00",
    status: "pending",
    category: "health",
    goalAmount: 180000,
    raisedAmount: 22000,
    beneficiariesCount: 42,
  },
  {
    id: "CAM-2007",
    title: "حملة كسوة الشتاء للقرى البعيدة",
    summary:
      "توزيع ملابس شتوية وبطانيات على الأسر في القرى ذات الأولوية قبل موسم الأمطار.",
    organizationName: "منظمة دفء",
    campaignManagerName: "محمد الراشد",
    location: "حائل",
    submittedAt: "2026-02-20T09:25:00",
    startDate: "2026-02-15T08:00:00",
    endDate: "2026-04-15T18:00:00",
    status: "approved",
    category: "emergency",
    goalAmount: 350000,
    raisedAmount: 259000,
    beneficiariesCount: 180,
    reviewedBy: "فريق مراجعة الحملات",
  },
  {
    id: "CAM-2008",
    title: "حملة تعليم رقمي للطلاب المحتاجين",
    summary:
      "توفير أجهزة لوحية واتصال إنترنت لطلاب المرحلة الثانوية في الأسر المستفيدة.",
    organizationName: "مؤسسة نمو",
    campaignManagerName: "فاطمة سليمان",
    location: "الرياض",
    submittedAt: "2026-02-19T11:45:00",
    startDate: "2026-02-18T10:00:00",
    endDate: "2026-07-01T18:00:00",
    status: "approved",
    category: "education",
    goalAmount: 290000,
    raisedAmount: 198000,
    beneficiariesCount: 95,
    reviewedBy: "فريق مراجعة الحملات",
  },
  {
    id: "CAM-2009",
    title: "حملة دعم غذائي لمرضى السرطان",
    summary:
      "توفير وجبات مغذية ومتكاملة للمرضى خلال فترات العلاج في المراكز الطبية.",
    organizationName: "جمعية رحمة",
    campaignManagerName: "سهى إبراهيم",
    location: "المدينة المنورة",
    submittedAt: "2026-02-21T09:00:00",
    startDate: "2026-02-20T09:00:00",
    endDate: "2026-05-20T18:00:00",
    status: "rejected",
    category: "food",
    goalAmount: 220000,
    raisedAmount: 0,
    beneficiariesCount: 60,
    reviewedBy: "فريق مراجعة الحملات",
    rejectionReason:
      "يرجى إرفاق التقارير الطبية والموافقة الرسمية قبل إعادة إرسال الحملة.",
  },
  {
    id: "CAM-2010",
    title: "حملة إسكان بأهداف تمويل غير واقعية",
    summary:
      "الحملة تتضمن أهدافًا مالية مبالغًا فيها دون خطة تنفيذ واضحة أو جدول زمني.",
    organizationName: "منظمة البناء",
    campaignManagerName: "يزن العطار",
    location: "جدة",
    submittedAt: "2026-02-20T17:40:00",
    startDate: "2026-02-20T09:30:00",
    endDate: "2026-08-30T18:00:00",
    status: "rejected",
    category: "shelter",
    goalAmount: 2000000,
    raisedAmount: 0,
    beneficiariesCount: 30,
    reviewedBy: "فريق مراجعة الحملات",
    rejectionReason:
      "الرجاء تعديل الهدف المالي وإرفاق خطة تنفيذ مفصلة قبل إعادة الإرسال.",
  },
];
