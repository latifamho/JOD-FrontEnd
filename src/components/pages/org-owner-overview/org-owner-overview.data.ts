/** بيانات تجريبية — نظرة عامة مالك المنظمة */

export type OrgOwnerOverviewStat = {
  id: string;
  label: string;
  value: number;
  hint: string;
};

export const orgOwnerOverviewStatsData: OrgOwnerOverviewStat[] = [
  { id: "campaigns", label: "الحملات", value: 8, hint: "نشطة ومسودة ومغلقة" },
  { id: "posts", label: "المنشورات", value: 24, hint: "شاملة المسودات والمنشورة" },
  { id: "donors", label: "المتبرعون", value: 15, hint: "تسجيلات تبرع أو اهتمام" },
  { id: "staff", label: "الموظفون", value: 3, hint: "بصلاحيات مختلفة" },
  {
    id: "notifications",
    label: "إشعارات غير مقروءة",
    value: 4,
    hint: "تبرعات وطلبات وتحديثات",
  },
  {
    id: "reports",
    label: "بلاغات مفتوحة",
    value: 2,
    hint: "تحتاج متابعة من فريقكم",
  },
];

export type OrgOwnerActivityItem = {
  id: string;
  title: string;
  detail: string;
  at: string;
};

export const orgOwnerOverviewActivityData: OrgOwnerActivityItem[] = [
  {
    id: "o1",
    title: "تبرع جديد على «إفطار صائم»",
    detail: "500 ر.س — أحمد المالكي",
    at: "2026-03-24T08:15:00",
  },
  {
    id: "o2",
    title: "مسودة منشور جاهزة للمراجعة",
    detail: "مرتبطة بحملة الكسوة — الموظف: سارة",
    at: "2026-03-23T19:40:00",
  },
  {
    id: "o3",
    title: "انتهاء حملة «كسوة الشتاء»",
    detail: "تم تحصيل 92% من الهدف — يمكن إغلاق الحملة",
    at: "2026-03-23T12:00:00",
  },
  {
    id: "o4",
    title: "متطوع جديد",
    detail: "فاطمة السعيد — نشاط التوزيع الميداني",
    at: "2026-03-22T16:20:00",
  },
  {
    id: "o5",
    title: "تذكير: تقرير ربع سنوي",
    detail: "نافذة الرفع تغلق خلال 5 أيام",
    at: "2026-03-21T07:30:00",
  },
  {
    id: "o6",
    title: "بلاغ محتوى — قيد المراجعة",
    detail: "RPT-501 — تعليق تحت منشور",
    at: "2026-03-20T14:10:00",
  },
];
