/** بيانات تجريبية — نظرة عامة موظف المنظمة */

export type OrgStaffOverviewStat = {
  id: string;
  label: string;
  value: number;
  hint: string;
};

export const orgStaffOverviewStatsData: OrgStaffOverviewStat[] = [
  { id: "campaigns", label: "الحملات النشطة", value: 12, hint: "ضمن صلاحياتك" },
  { id: "posts", label: "المنشورات", value: 28, hint: "قيد المتابعة أو المنشورة" },
  {
    id: "donors",
    label: "تفاعلات المتبرعين",
    value: 41,
    hint: "ردود ورسائل هذا الشهر",
  },
  {
    id: "notifications",
    label: "إشعارات جديدة",
    value: 6,
    hint: "لم تُفتح بعد",
  },
];

export type OrgStaffActivityItem = {
  id: string;
  title: string;
  detail: string;
  category: "campaigns" | "posts" | "donors" | "reports" | "tasks" | "general";
  priority: "high" | "medium" | "low";
  at: string;
};

export const orgStaffOverviewActivityData: OrgStaffActivityItem[] = [
  {
    id: "s1",
    title: "طُلب منك مراجعة منشور",
    detail: "مسودة «حملة إفطار صائم» — قبل النشر",
    category: "posts",
    priority: "high",
    at: "2026-03-24T07:45:00",
  },
  {
    id: "s2",
    title: "رد متبرع على رسالة الشكر",
    detail: "حملة الكسوة — «شكراً لكم»",
    category: "donors",
    priority: "medium",
    at: "2026-03-23T18:10:00",
  },
  {
    id: "s3",
    title: "تحديث هدف حملة",
    detail: "CMP-104 — تم تعديل الهدف من قبل المالك",
    category: "campaigns",
    priority: "medium",
    at: "2026-03-23T11:00:00",
  },
  {
    id: "s4",
    title: "مهمة: رفع صور النشاط",
    detail: "موعد أقصى غداً — ألبوم التوزيع",
    category: "tasks",
    priority: "high",
    at: "2026-03-22T09:30:00",
  },
  {
    id: "s5",
    title: "بلاغ جديد للمنظمة",
    detail: "RPT-502 — تم إسناده لفريق الدعم",
    category: "reports",
    priority: "medium",
    at: "2026-03-21T15:00:00",
  },
  {
    id: "s6",
    title: "تدريب داخلي مسجل",
    detail: "«سياسة المحتوى» — الخميس 10:00",
    category: "general",
    priority: "low",
    at: "2026-03-20T08:00:00",
  },
];
