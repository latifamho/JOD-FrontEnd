export type NotificationMailbox = "inbox" | "sent";
export type NotificationStatus = "unread" | "read" | "sent";
export type NotificationCategory =
  | "campaign"
  | "post"
  | "account"
  | "report"
  | "system";
export type NotificationRecipientScope = "all" | "users" | "organizations";
export type NotificationPriority = "normal" | "high";
export type NotificationDateFilter = "all" | "today" | "last_7_days";

export type AdminNotificationItem = {
  id: string;
  mailbox: NotificationMailbox;
  title: string;
  body: string;
  category: NotificationCategory;
  recipientScope: NotificationRecipientScope;
  recipientLabel: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  createdAt: string;
  sentAt: string;
  readAt?: string;
  referenceLabel: string;
  referencePath: string;
  createdBy: string;
};

export const notificationMailboxLabels: Record<NotificationMailbox, string> = {
  inbox: "الوارد",
  sent: "المرسل",
};

export const notificationStatusLabels: Record<NotificationStatus, string> = {
  unread: "غير مقروء",
  read: "مقروء",
  sent: "مرسل",
};

export const notificationCategoryLabels: Record<NotificationCategory, string> =
  {
    campaign: "حملة",
    post: "منشور",
    account: "حساب",
    report: "بلاغ",
    system: "نظام",
  };

export const notificationRecipientScopeLabels: Record<
  NotificationRecipientScope,
  string
> = {
  all: "الكل",
  users: "المستخدمون",
  organizations: "المنظمات",
};

export const notificationPriorityLabels: Record<NotificationPriority, string> =
  {
    normal: "عادية",
    high: "عالية",
  };

export const notificationDateFilterLabels: Record<
  NotificationDateFilter,
  string
> = {
  all: "كل الفترات",
  today: "اليوم",
  last_7_days: "آخر 7 أيام",
};

export const notificationsStaticData: AdminNotificationItem[] = [
  {
    id: "NTF-1001",
    mailbox: "inbox",
    title: "تم قبول حملة المنظمة",
    body: "تمت الموافقة على حملة تجهيز وحدات غسيل كلوي منزلية ويمكنكم المتابعة.",
    category: "campaign",
    recipientScope: "organizations",
    recipientLabel: "جمعية الخير الطبية",
    priority: "high",
    status: "read",
    createdAt: "2026-02-28T10:20:00",
    sentAt: "2026-02-28T10:22:00",
    referenceLabel: "CAM-2001",
    referencePath: "/dashboard/admin/campaigns/approved",
    createdBy: "النظام",
  },
  {
    id: "NTF-1002",
    mailbox: "inbox",
    title: "منشور جديد بانتظار المراجعة",
    body: "هناك منشور جديد من مؤسسة عطاء الأثر ضمن قائمة المراجعة.",
    category: "post",
    recipientScope: "organizations",
    recipientLabel: "مؤسسة عطاء الأثر",
    priority: "normal",
    status: "read",
    createdAt: "2026-02-28T09:45:00",
    sentAt: "2026-02-28T09:46:00",
    readAt: "2026-02-28T10:00:00",
    referenceLabel: "POST-1009",
    referencePath: "/dashboard/admin/posts/review",
    createdBy: "النظام",
  },
  {
    id: "NTF-1003",
    mailbox: "inbox",
    title: "تنبيه على حساب مستخدم",
    body: "تم رصد نشاط غير اعتيادي على حساب المستخدم #4421 ويتطلب متابعة.",
    category: "account",
    recipientScope: "users",
    recipientLabel: "مستخدم #4421",
    priority: "high",
    createdAt: "2026-02-27T13:10:00",
    sentAt: "2026-02-27T13:12:00",
    readAt: "2026-02-27T13:30:00",
    referenceLabel: "USR-4421",
    referencePath: "/dashboard/admin/users",
    createdBy: "فريق الإشعارات",
    status: "sent",
  },
  {
    id: "NTF-1004",
    mailbox: "inbox",
    title: "تحديث على بلاغ بانتظار الرد",
    body: "تم نقل البلاغ REP-3004 إلى حالة بانتظار الرد من الجهة المعنية.",
    category: "report",
    recipientScope: "organizations",
    recipientLabel: "منظمة دفء",
    priority: "normal",
    status: "unread",
    createdAt: "2026-02-27T08:00:00",
    sentAt: "2026-02-27T08:03:00",
    referenceLabel: "REP-3004",
    referencePath: "/dashboard/admin/reports/waiting-response",
    createdBy: "النظام",
  },
  {
    id: "NTF-1005",
    mailbox: "sent",
    title: "تنبيه إكمال التوثيق",
    body: "يرجى استكمال متطلبات التوثيق خلال 72 ساعة لتجنب تعليق النشر.",
    category: "account",
    recipientScope: "organizations",
    recipientLabel: "مبادرة إنقاذ",
    priority: "high",
    status: "sent",
    createdAt: "2026-02-28T08:20:00",
    sentAt: "2026-02-28T08:21:00",
    referenceLabel: "ORG-1005",
    referencePath: "/dashboard/admin/organizations",
    createdBy: "فريق الإدارة",
  },
  {
    id: "NTF-1006",
    mailbox: "sent",
    title: "إشعار قبول منشور",
    body: "تمت الموافقة على المنشور POST-1012 وسيظهر الآن في التطبيق.",
    category: "post",
    recipientScope: "organizations",
    recipientLabel: "جمعية خطوة",
    priority: "normal",
    status: "read",
    createdAt: "2026-02-27T17:40:00",
    sentAt: "2026-02-27T17:41:00",
    readAt: "2026-02-27T18:10:00",
    referenceLabel: "POST-1012",
    referencePath: "/dashboard/admin/posts/approved",
    createdBy: "فريق المحتوى",
  },
  {
    id: "NTF-1007",
    mailbox: "sent",
    title: "إشعار إغلاق حملة",
    body: "تم إغلاق الحملة CAM-2010 بعد تحقيق الهدف الكامل بنجاح.",
    category: "campaign",
    recipientScope: "organizations",
    recipientLabel: "مؤسسة نبض الحياة",
    priority: "normal",
    status: "sent",
    createdAt: "2026-02-26T15:12:00",
    sentAt: "2026-02-26T15:13:00",
    referenceLabel: "CAM-2010",
    referencePath: "/dashboard/admin/campaigns/approved",
    createdBy: "فريق الحملات",
  },
  {
    id: "NTF-1008",
    mailbox: "sent",
    title: "إشعار نظام: تحديث سياسة الاستخدام",
    body: "تم نشر تحديث جديد على سياسة الاستخدام وسيظهر لجميع المستخدمين.",
    category: "system",
    recipientScope: "all",
    recipientLabel: "جميع المستخدمين",
    priority: "high",
    status: "sent",
    createdAt: "2026-02-25T11:05:00",
    sentAt: "2026-02-25T11:06:00",
    referenceLabel: "POL-2026-02",
    referencePath: "/dashboard/admin/notifications",
    createdBy: "فريق الإدارة",
  },
];
