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
