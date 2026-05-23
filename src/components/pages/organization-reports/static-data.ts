export type OrgReportStatus = "open" | "in_review" | "closed";

export type OrgReportItem = {
  id: string;
  subject: string;
  summary: string;
  category: "content" | "harassment" | "fraud" | "other";
  status: OrgReportStatus;
  submittedAt: string;
  reporterLabel: string;
};

export const orgReportStatusLabels: Record<OrgReportStatus, string> = {
  open: "مفتوح",
  in_review: "قيد المراجعة",
  closed: "مغلق",
};

export const orgReportCategoryLabels: Record<OrgReportItem["category"], string> =
  {
    content: "محتوى",
    harassment: "مضايقة",
    fraud: "احتيال",
    other: "أخرى",
};

export function getOrgReportStatusBadgeClass(status: OrgReportStatus) {
  switch (status) {
    case "open":
      return "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300";
    case "in_review":
      return "border-sky-500/50 bg-sky-500/10 text-sky-700 dark:text-sky-300";
    case "closed":
      return "border-muted-foreground/30 bg-muted/50 text-muted-foreground";
    default:
      return "";
  }
}

export const organizationReportsStaticData: OrgReportItem[] = [
  {
    id: "RPT-501",
    subject: "بلاغ عن تعليق مسيء في منشور",
    summary: "أبلغ متبرع عن تعليق يحتوي على لفظ غير لائق تحت منشور الحملة الأسبوعية.",
    category: "harassment",
    status: "in_review",
    submittedAt: "2026-03-23T16:10:00",
    reporterLabel: "متبرع (مُخفّى)",
  },
  {
    id: "RPT-502",
    subject: "اشتباه في رابط خارجي مضلّل",
    summary: "تم الإبلاغ عن رابط في صفحة الحملة يوجّه لموقع غير تابع للمنظمة.",
    category: "fraud",
    status: "open",
    submittedAt: "2026-03-22T10:45:00",
    reporterLabel: "زائر",
  },
  {
    id: "RPT-503",
    subject: "صورة غير مناسبة في المعرض",
    summary: "طلب مراجعة صورة مرفوعة في ألبوم الحملة.",
    category: "content",
    status: "closed",
    submittedAt: "2026-03-18T13:20:00",
    reporterLabel: "متطوع",
  },
  {
    id: "RPT-504",
    subject: "طلب توضيح حول استخدام التبرعات",
    summary: "استفسار عام عن آلية التقارير المالية — لا يتطلب إجراءً تأديبياً.",
    category: "other",
    status: "closed",
    submittedAt: "2026-03-10T08:00:00",
    reporterLabel: "داعم",
  },
];
