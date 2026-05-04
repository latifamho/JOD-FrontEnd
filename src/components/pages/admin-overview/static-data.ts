import type { AppIconName } from "@/constant/icons";

export type StatCardItem = {
  id: string;
  label: string;
  value: number;
  subLabel?: string;
  icon: AppIconName;
};

export const adminOverviewStaticStats: StatCardItem[] = [
  {
    id: "users",
    label: "المستخدمون",
    value: 1247,
    subLabel: "نشط هذا الشهر · متبرعون 312",
    icon: "users",
  },
  {
    id: "organizations",
    label: "المنظمات",
    value: 89,
    subLabel: "موثّقة: 64 · قيد التحقق: 7",
    icon: "organizations",
  },
  {
    id: "posts",
    label: "المنشورات",
    value: 389,
    subLabel: "قيد المراجعة: 12 · منشور: 301",
    icon: "posts",
  },
  {
    id: "campaigns",
    label: "الحملات",
    value: 56,
    subLabel: "نشطة: 23 · مسودات: 8",
    icon: "campaigns",
  },
  {
    id: "reports",
    label: "البلاغات",
    value: 18,
    subLabel: "جديدة: 5 · قيد المعالجة: 4",
    icon: "reports",
  },
  {
    id: "notifications",
    label: "إشعارات مُرسلة (30 يوماً)",
    value: 2140,
    subLabel: "متوسط يومي · 71",
    icon: "notifications",
  },
];

export type AdminOverviewActivityItem = {
  id: string;
  title: string;
  detail: string;
  at: string;
};

/** أحداث تجريبية للوحة الأدمن */
export const adminOverviewActivityData: AdminOverviewActivityItem[] = [
  {
    id: "a1",
    title: "منظمة جديدة طلبت التحقق",
    detail: "مؤسسة عطاء الأثر — مستندات مرفوعة",
    at: "2026-03-24T09:15:00",
  },
  {
    id: "a2",
    title: "بلاغ بحالة «جديد»",
    detail: "RPT-502 · اشتباه احتيال في رابط حملة",
    at: "2026-03-24T08:40:00",
  },
  {
    id: "a3",
    title: "منشوران انتظار المراجعة",
    detail: "PST-901، PST-903 — تصنيف عام",
    at: "2026-03-23T17:22:00",
  },
  {
    id: "a4",
    title: "حملة وافقت على النشر",
    detail: "CMP-441 · جمعية الخير الطبية",
    at: "2026-03-23T14:05:00",
  },
  {
    id: "a5",
    title: "مستخدم موقوف مؤقتاً",
    detail: "USR-8821 — 7 أيام بسبب بلاغات متكررة",
    at: "2026-03-22T11:30:00",
  },
  {
    id: "a6",
    title: "تقرير أسبوعي للمنصة",
    detail: "تم إنشاء ملخص التبرعات والزيارات تلقائياً",
    at: "2026-03-22T06:00:00",
  },
  {
    id: "a7",
    title: "تحديث سياسة المحتوى",
    detail: "مسودة مراجعة قانونية — بانتظار الاعتماد",
    at: "2026-03-21T10:00:00",
  },
];
