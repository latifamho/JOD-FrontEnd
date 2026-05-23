"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  notificationCategoryLabels,
  notificationDateFilterLabels,
  notificationRecipientScopeLabels,
  notificationStatusLabels,
  type NotificationCategory,
  type NotificationDateFilter,
  type NotificationMailbox,
  type NotificationRecipientScope,
  type NotificationStatus,
} from "@/components/pages/notifications-management/static-data";

type NotificationsFiltersProps = {
  mailbox: NotificationMailbox;
  statusFilter: "all" | NotificationStatus;
  onStatusFilterChange: (value: "all" | NotificationStatus) => void;
  categoryFilter: "all" | NotificationCategory;
  onCategoryFilterChange: (value: "all" | NotificationCategory) => void;
  recipientFilter: NotificationRecipientScope;
  onRecipientFilterChange: (value: NotificationRecipientScope) => void;
  dateFilter: NotificationDateFilter;
  onDateFilterChange: (value: NotificationDateFilter) => void;
};

export function NotificationsFilters({
  mailbox,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  recipientFilter,
  onRecipientFilterChange,
  dateFilter,
  onDateFilterChange,
}: NotificationsFiltersProps) {
  const statusOptions: NotificationStatus[] =
    mailbox === "inbox" ? ["unread", "read"] : ["sent", "read"];

  return (
    <div className="grid gap-3 md:grid-cols-4">
      <Select
        dir="rtl"
        value={statusFilter}
        onValueChange={(value) =>
          onStatusFilterChange(value as "all" | NotificationStatus)
        }
      >
        <SelectTrigger className="w-full text-right text-xs">
          <SelectValue placeholder="حالة الإشعار" />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="text-right">
          <SelectItem value="all" className="text-right text-xs">
            كل الحالات
          </SelectItem>
          {statusOptions.map((status) => (
            <SelectItem
              key={status}
              value={status}
              className="text-right text-xs"
            >
              {notificationStatusLabels[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        dir="rtl"
        value={categoryFilter}
        onValueChange={(value) =>
          onCategoryFilterChange(value as "all" | NotificationCategory)
        }
      >
        <SelectTrigger className="w-full text-right text-xs">
          <SelectValue placeholder="نوع الإشعار" />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="text-right">
          <SelectItem value="all" className="text-right text-xs">
            كل الأنواع
          </SelectItem>
          {Object.entries(notificationCategoryLabels).map(
            ([category, label]) => (
              <SelectItem
                key={category}
                value={category}
                className="text-right text-xs"
              >
                {label}
              </SelectItem>
            ),
          )}
        </SelectContent>
      </Select>

      <Select
        dir="rtl"
        value={recipientFilter}
        onValueChange={(value) =>
          onRecipientFilterChange(value as NotificationRecipientScope)
        }
      >
        <SelectTrigger className="w-full text-right text-xs">
          <SelectValue placeholder="نوع المستلم" />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="text-right">
          {Object.entries(notificationRecipientScopeLabels).map(
            ([scope, label]) => (
              <SelectItem
                key={scope}
                value={scope}
                className="text-right text-xs"
              >
                {label}
              </SelectItem>
            ),
          )}
        </SelectContent>
      </Select>

      <Select
        dir="rtl"
        value={dateFilter}
        onValueChange={(value) =>
          onDateFilterChange(value as NotificationDateFilter)
        }
      >
        <SelectTrigger className="w-full text-right text-xs">
          <SelectValue placeholder="تاريخ الإرسال" />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="text-right">
          {Object.entries(notificationDateFilterLabels).map(
            ([dateValue, label]) => (
              <SelectItem
                key={dateValue}
                value={dateValue}
                className="text-right text-xs"
              >
                {label}
              </SelectItem>
            ),
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
