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
  managerName: string;
  location: string;
  category: ReviewCampaignCategory;
  goalAmount: number;
  raisedAmount: number;
  beneficiariesCount: number;
  startDate: string;
  endDate: string;
  submittedAt: string;
  status: ModerationStatus;
  reviewedBy?: string;
  rejectionReason?: string;
};

export const campaignCategoryLabels: Record<ReviewCampaignCategory, string> = {
  health: "صحية",
  education: "تعليمية",
  shelter: "إسكان",
  food: "غذائية",
  emergency: "طارئة",
};

export const reviewStatusLabels: Record<ModerationStatus, string> = {
  pending: "قيد المراجعة",
  approved: "مقبولة",
  rejected: "مرفوضة",
};

export const reviewCampaignsStaticData: ReviewCampaignItem[] = [
  {
    id: "CAM-2001",
    title: "حملة تجهيز وحدات غسيل كلوي منزلية",
    summary:
      "توفير أجهزة ومستلزمات متابعة شهرية لمرضى القصور الكلوي غير القادرين على تغطية التكلفة.",
    organizationName: "جمعية نبض الحياة",
    managerName: "ليان منصور",
    location: "الرياض",
    category: "health",
    goalAmount: 480000,
    raisedAmount: 92000,
    beneficiariesCount: 75,
    startDate: "2026-03-01T08:00:00",
    endDate: "2026-05-30T18:00:00",
    submittedAt: "2026-02-25T10:30:00",
    status: "pending",
  },
  {
    id: "CAM-2002",
    title: "حملة منح تعليمية لطلاب الأسر المتعففة",
    summary:
      "تغطية الرسوم الدراسية والقرطاسية لطلبة المرحلة الثانوية لضمان استمرارهم في التعليم.",
    organizationName: "مؤسسة عطاء الأثر",
    managerName: "عمر السالم",
    location: "جدة",
    category: "education",
    goalAmount: 350000,
    raisedAmount: 120000,
    beneficiariesCount: 120,
    startDate: "2026-03-05T09:00:00",
    endDate: "2026-06-20T18:00:00",
    submittedAt: "2026-02-24T14:10:00",
    status: "pending",
  },
  {
    id: "CAM-2003",
    title: "حملة سلال غذائية للأسر الأشد حاجة",
    summary:
      "توزيع سلال غذائية شهرية على الأسر المسجلة لدى الجمعية مع تتبع الاستفادة الفعلية.",
    organizationName: "جمعية أمن غذائي",
    managerName: "نهى بدر",
    location: "الدمام",
    category: "food",
    goalAmount: 240000,
    raisedAmount: 46000,
    beneficiariesCount: 300,
    startDate: "2026-03-02T10:00:00",
    endDate: "2026-04-30T18:00:00",
    submittedAt: "2026-02-23T08:20:00",
    status: "pending",
  },
  {
    id: "CAM-2004",
    title: "حملة ترميم منازل المتضررين من الأمطار",
    summary:
      "إعادة تأهيل منازل الأسر المتضررة في المناطق الجنوبية وتأمين أعمال العزل الأساسية.",
    organizationName: "مؤسسة سكن آمن",
    managerName: "أحمد الخالدي",
    location: "أبها",
    category: "shelter",
    goalAmount: 620000,
    raisedAmount: 188000,
    beneficiariesCount: 52,
    startDate: "2026-03-08T08:30:00",
    endDate: "2026-07-15T18:00:00",
    submittedAt: "2026-02-22T12:55:00",
    status: "pending",
  },
  {
    id: "CAM-2005",
    title: "حملة دعم العمليات الجراحية الطارئة",
    summary:
      "دعم الحالات الطبية العاجلة عبر تغطية العمليات المنقذة للحياة بالتنسيق مع المستشفيات.",
    organizationName: "جمعية الخير الطبية",
    managerName: "مها الرفاعي",
    location: "مكة",
    category: "emergency",
    goalAmount: 780000,
    raisedAmount: 265000,
    beneficiariesCount: 40,
    startDate: "2026-03-10T09:00:00",
    endDate: "2026-08-01T18:00:00",
    submittedAt: "2026-02-21T16:25:00",
    status: "pending",
  },
  {
    id: "CAM-2006",
    title: "حملة تأهيل مدارس المناطق النائية",
    summary:
      "تحسين البيئة التعليمية في المدارس الأقل جاهزية من خلال تجهيز مختبرات وأثاث أساسي.",
    organizationName: "جمعية تمكين",
    managerName: "هدى الشريف",
    location: "المدينة المنورة",
    category: "education",
    goalAmount: 540000,
    raisedAmount: 97000,
    beneficiariesCount: 420,
    startDate: "2026-03-11T10:00:00",
    endDate: "2026-09-01T18:00:00",
    submittedAt: "2026-02-20T11:40:00",
    status: "pending",
  },
  {
    id: "CAM-2007",
    title: "حملة تجهيز عيادات متنقلة",
    summary:
      "توفير عيادات متنقلة للوصول إلى القرى البعيدة وتقديم خدمات الفحص الأولي بشكل دوري.",
    organizationName: "جمعية نبض الحياة",
    managerName: "سارة القحطاني",
    location: "حائل",
    category: "health",
    goalAmount: 690000,
    raisedAmount: 420000,
    beneficiariesCount: 900,
    startDate: "2026-02-01T08:00:00",
    endDate: "2026-06-01T18:00:00",
    submittedAt: "2026-02-18T09:05:00",
    status: "approved",
    reviewedBy: "فريق مراجعة الحملات",
  },
  {
    id: "CAM-2008",
    title: "حملة كسوة شتاء للأسر المحتاجة",
    summary:
      "توزيع كسوة شتوية متكاملة للأطفال وكبار السن قبل دخول موجات البرد الشديدة.",
    organizationName: "منظمة دفء",
    managerName: "محمد الراشد",
    location: "الطائف",
    category: "emergency",
    goalAmount: 300000,
    raisedAmount: 300000,
    beneficiariesCount: 1500,
    startDate: "2026-01-05T09:00:00",
    endDate: "2026-03-01T18:00:00",
    submittedAt: "2026-02-17T10:15:00",
    status: "approved",
    reviewedBy: "فريق مراجعة الحملات",
  },
  {
    id: "CAM-2009",
    title: "حملة بناء مساكن انتقالية",
    summary:
      "إنشاء وحدات سكنية انتقالية للأسر التي فقدت مساكنها حتى اكتمال مشاريع الإعمار.",
    organizationName: "مؤسسة سكن آمن",
    managerName: "يوسف المحمد",
    location: "تبوك",
    category: "shelter",
    goalAmount: 820000,
    raisedAmount: 510000,
    beneficiariesCount: 90,
    startDate: "2026-01-20T08:00:00",
    endDate: "2026-07-10T18:00:00",
    submittedAt: "2026-02-16T15:30:00",
    status: "approved",
    reviewedBy: "فريق مراجعة الحملات",
  },
  {
    id: "CAM-2010",
    title: "حملة دعم الأمن الغذائي للنازحين",
    summary:
      "تأمين وجبات جاهزة وسلال غذائية أسبوعية للأسر النازحة في مراكز الإيواء.",
    organizationName: "جمعية أمن غذائي",
    managerName: "رائد الغامدي",
    location: "جازان",
    category: "food",
    goalAmount: 410000,
    raisedAmount: 210000,
    beneficiariesCount: 780,
    startDate: "2026-01-25T10:00:00",
    endDate: "2026-05-30T18:00:00",
    submittedAt: "2026-02-15T13:40:00",
    status: "approved",
    reviewedBy: "فريق مراجعة الحملات",
  },
  {
    id: "CAM-2011",
    title: "حملة تأمين أدوية الأمراض المزمنة",
    summary:
      "تغطية تكلفة الأدوية الشهرية للمرضى ذوي الدخل المحدود عبر برنامج متابعة دوائي.",
    organizationName: "جمعية الخير الطبية",
    managerName: "ريم العتيبي",
    location: "القصيم",
    category: "health",
    goalAmount: 460000,
    raisedAmount: 275000,
    beneficiariesCount: 230,
    startDate: "2026-02-10T08:00:00",
    endDate: "2026-06-20T18:00:00",
    submittedAt: "2026-02-14T09:20:00",
    status: "approved",
    reviewedBy: "فريق مراجعة الحملات",
  },
  {
    id: "CAM-2012",
    title: "حملة تجهيز مختبرات مدرسية متنقلة",
    summary:
      "توفير مختبرات متنقلة للمدارس الصغيرة لرفع جودة التطبيق العملي للمواد العلمية.",
    organizationName: "مؤسسة عطاء الأثر",
    managerName: "سلمان الحربي",
    location: "الخبر",
    category: "education",
    goalAmount: 500000,
    raisedAmount: 180000,
    beneficiariesCount: 620,
    startDate: "2026-02-12T09:00:00",
    endDate: "2026-08-15T18:00:00",
    submittedAt: "2026-02-13T11:45:00",
    status: "approved",
    reviewedBy: "فريق مراجعة الحملات",
  },
  {
    id: "CAM-2013",
    title: "حملة إسعاف مجتمعي دون مرفقات توثيق",
    summary:
      "الحملة تتضمن طلب تمويل مرتفع دون إرفاق الخطة التشغيلية وموافقات الجهات الصحية.",
    organizationName: "مبادرة إنقاذ",
    managerName: "علي شريف",
    location: "الرياض",
    category: "emergency",
    goalAmount: 910000,
    raisedAmount: 0,
    beneficiariesCount: 300,
    startDate: "2026-03-01T08:00:00",
    endDate: "2026-08-30T18:00:00",
    submittedAt: "2026-02-21T10:00:00",
    status: "rejected",
    reviewedBy: "فريق مراجعة الحملات",
    rejectionReason: "يرجى رفع الخطة التشغيلية والموافقات الرسمية قبل إعادة الإرسال.",
  },
  {
    id: "CAM-2014",
    title: "حملة تعليمية بأهداف غير قابلة للقياس",
    summary:
      "الوصف الحالي لا يوضح مخرجات الحملة التعليمية أو مؤشرات قياس أثر واضحة.",
    organizationName: "جمعية تعليم للجميع",
    managerName: "هند فواز",
    location: "جدة",
    category: "education",
    goalAmount: 390000,
    raisedAmount: 50000,
    beneficiariesCount: 260,
    startDate: "2026-03-10T09:00:00",
    endDate: "2026-07-20T18:00:00",
    submittedAt: "2026-02-20T09:40:00",
    status: "rejected",
    reviewedBy: "فريق مراجعة الحملات",
    rejectionReason: "أضف مؤشرات قياس أثر واضحة وخطة متابعة دورية قبل النشر.",
  },
  {
    id: "CAM-2015",
    title: "حملة غذائية بميزانية غير مفصلة",
    summary:
      "الميزانية الإجمالية موجودة لكن بدون تفصيل بنود الصرف ونسب التوزيع لكل نشاط.",
    organizationName: "جمعية أمن غذائي",
    managerName: "سارة حلمي",
    location: "الدمام",
    category: "food",
    goalAmount: 270000,
    raisedAmount: 30000,
    beneficiariesCount: 340,
    startDate: "2026-03-06T10:00:00",
    endDate: "2026-06-25T18:00:00",
    submittedAt: "2026-02-19T15:15:00",
    status: "rejected",
    reviewedBy: "فريق مراجعة الحملات",
    rejectionReason: "الرجاء إضافة تفصيل بنود الميزانية ونسب الصرف المعتمدة.",
  },
  {
    id: "CAM-2016",
    title: "حملة إسكان بمعلومات مستفيدين ناقصة",
    summary:
      "ملف الحملة لا يحتوي على آلية تحقق واضحة من حالة الأسر المرشحة للاستفادة.",
    organizationName: "مؤسسة سكن آمن",
    managerName: "مازن علي",
    location: "أبها",
    category: "shelter",
    goalAmount: 640000,
    raisedAmount: 120000,
    beneficiariesCount: 75,
    startDate: "2026-03-15T08:00:00",
    endDate: "2026-09-01T18:00:00",
    submittedAt: "2026-02-18T08:40:00",
    status: "rejected",
    reviewedBy: "فريق مراجعة الحملات",
    rejectionReason: "يرجى توضيح آلية التحقق من أهلية المستفيدين مع المرفقات الداعمة.",
  },
];

