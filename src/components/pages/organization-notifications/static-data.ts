export type OrgNotificationCategory =
  | "donation"
  | "applicant"
  | "campaign"
  | "post"
  | "staff"
  | "system";

export type OrgNotificationItem = {
  id: string;
  title: string;
  body: string;
  category: OrgNotificationCategory;
  status: "unread" | "read" | "sent";
  createdAt: string;
  readAt?: string | null;
  referenceLabel?: string | null;
  referencePath?: string | null;
};

export const orgNotificationCategoryLabels: Record<
  OrgNotificationCategory,
  string
> = {
  donation: "تبرع",
  applicant: "متقدم",
  campaign: "حملة",
  post: "منشور",
  staff: "موظف",
  system: "نظام",
};

export const organizationNotificationsStaticData: OrgNotificationItem[] = [
  {
    id: "ON-2401",
    title: "تبرع جديد على حملة «إفطار صائم»",
    body: "تم تسجيل تبرع بقيمة 500 ر.س من المتبرع أحمد المالكي.",
    category: "donation",
    status: "unread",
    createdAt: "2026-03-24T08:15:00",
    referenceLabel: "CMP-104",
  },
  {
    id: "ON-2402",
    title: "طلب تطوع جديد",
    body: "تقدّمت فاطمة السعيد للمشاركة في نشاط التوزيع الميداني يوم الجمعة.",
    category: "applicant",
    status: "unread",
    createdAt: "2026-03-23T19:40:00",
    referenceLabel: "VOL-88",
  },
  {
    id: "ON-2403",
    title: "تمت الموافقة على حملتكم",
    body: "حملة «كسوة الشتاء» أصبحت نشطة ويمكنكم مشاركة الرابط مع الداعمين.",
    category: "campaign",
    status: "read",
    createdAt: "2026-03-22T11:05:00",
    referenceLabel: "CMP-101",
  },
  {
    id: "ON-2404",
    title: "منشور بانتظار المراجعة",
    body: "أرسل أحد الموظفين مسودة منشور مرتبط بحملة الكسوة للمراجعة قبل النشر.",
    category: "post",
    status: "read",
    createdAt: "2026-03-21T14:22:00",
    referenceLabel: "PST-902",
  },
  {
    id: "ON-2405",
    title: "دعوة موظف جديد",
    body: "قبل المستخدم سارة العتيبي دعوة الانضمام كمنسّق حملات.",
    category: "staff",
    status: "read",
    createdAt: "2026-03-20T09:00:00",
    referenceLabel: "STF-12",
  },
  {
    id: "ON-2406",
    title: "تذكير: نهاية تقرير الربع",
    body: "سيتم إغلاق نافذة التقارير المالية للربع الأول خلال 5 أيام.",
    category: "system",
    status: "read",
    createdAt: "2026-03-19T07:30:00",
  },
];
