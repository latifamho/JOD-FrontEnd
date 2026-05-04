import { formatUtcDate, toUtcTimestamp } from "@/lib/date";
import type {
  AdminNotificationItem,
  NotificationDateFilter,
  NotificationPriority,
  NotificationStatus,
} from "@/components/pages/notifications-management/static-data";

const LAST_7_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;
const REFERENCE_NOW_UTC = "2026-02-28T12:00:00Z";

export function getNotificationStatusBadgeClass(
  status: NotificationStatus,
): string {
  if (status === "unread") {
    return "border-sky-200/70 bg-sky-100 text-sky-800 dark:border-sky-500/40 dark:bg-sky-500/20 dark:text-sky-100";
  }

  if (status === "read") {
    return "border-emerald-200/70 bg-emerald-100 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-100";
  }

  return "border-violet-200/70 bg-violet-100 text-violet-800 dark:border-violet-500/40 dark:bg-violet-500/20 dark:text-violet-100";
}

export function getNotificationPriorityBadgeClass(
  priority: NotificationPriority,
): string {
  if (priority === "high") {
    return "border-rose-200/70 bg-rose-100 text-rose-800 dark:border-rose-500/40 dark:bg-rose-500/20 dark:text-rose-100";
  }

  return "border-amber-200/70 bg-amber-100 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-100";
}

export function matchesDateFilter(
  sentAt: string,
  dateFilter: NotificationDateFilter,
): boolean {
  if (dateFilter === "all") {
    return true;
  }

  if (dateFilter === "today") {
    return formatUtcDate(sentAt) === formatUtcDate(REFERENCE_NOW_UTC);
  }

  const sentAtTimestamp = toUtcTimestamp(sentAt);
  const referenceTimestamp = toUtcTimestamp(REFERENCE_NOW_UTC);
  return referenceTimestamp - sentAtTimestamp <= LAST_7_DAYS_IN_MS;
}

export function getNotificationCounters(
  notifications: AdminNotificationItem[],
) {
  const unreadCount = notifications.filter(
    (notification) => notification.status === "unread",
  ).length;

  const todayCount = notifications.filter((notification) =>
    matchesDateFilter(notification.sentAt, "today"),
  ).length;

  const highPriorityCount = notifications.filter(
    (notification) => notification.priority === "high",
  ).length;

  return {
    unreadCount,
    todayCount,
    highPriorityCount,
  };
}

export function createNextNotificationId(
  notifications: AdminNotificationItem[],
): string {
  const maxId = notifications.reduce((currentMax, notification) => {
    const numericPart = Number.parseInt(notification.id.replace(/\D/g, ""), 10);
    if (Number.isNaN(numericPart)) {
      return currentMax;
    }
    return Math.max(currentMax, numericPart);
  }, 1000);

  return `NTF-${maxId + 1}`;
}
