"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { EmptyState, PaginationControls } from "@/components/shared";
import { AppIcons } from "@/constant/icons";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { toUtcTimestamp } from "@/lib/date";
import {
  type CreateNotificationValues,
  CreateNotificationSheet,
} from "@/components/pages/notifications-management/create-notification-sheet";
import { NotificationDetailsSheet } from "@/components/pages/notifications-management/notification-details-sheet";
import { NotificationsFilters } from "@/components/pages/notifications-management/notifications-filters";
import { NotificationsTable } from "@/components/pages/notifications-management/notifications-table";
import {
  createNextNotificationId,
  matchesDateFilter,
} from "@/components/pages/notifications-management/helpers";
import {
  notificationMailboxLabels,
  notificationsStaticData,
  type AdminNotificationItem,
  type NotificationCategory,
  type NotificationDateFilter,
  type NotificationMailbox,
  type NotificationRecipientScope,
  type NotificationStatus,
} from "@/components/pages/notifications-management/static-data";

type NotificationsManagementPageProps = {
  mailbox?: NotificationMailbox;
};

export function NotificationsManagementPage({
  mailbox,
}: NotificationsManagementPageProps) {
  const [notifications, setNotifications] = React.useState<
    AdminNotificationItem[]
  >(notificationsStaticData);
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);

  const [statusFilter, setStatusFilter] = React.useState<
    "all" | NotificationStatus
  >("all");
  const [categoryFilter, setCategoryFilter] = React.useState<
    "all" | NotificationCategory
  >("all");
  const [recipientFilter, setRecipientFilter] =
    React.useState<NotificationRecipientScope>("all");
  const [dateFilter, setDateFilter] =
    React.useState<NotificationDateFilter>("all");

  const [detailsSheetOpen, setDetailsSheetOpen] = React.useState(false);
  const [detailsNotificationId, setDetailsNotificationId] = React.useState<
    string | null
  >(null);
  const [createSheetOpen, setCreateSheetOpen] = React.useState(false);
  const activeMailbox = mailbox ?? "inbox";

  const mailboxNotifications = React.useMemo(
    () =>
      notifications.filter(
        (notification) => notification.mailbox === activeMailbox,
      ),
    [activeMailbox, notifications],
  );

  const filteredNotifications = React.useMemo(() => {
    const filtered = mailboxNotifications.filter((notification) => {
      if (statusFilter !== "all" && notification.status !== statusFilter) {
        return false;
      }

      if (
        categoryFilter !== "all" &&
        notification.category !== categoryFilter
      ) {
        return false;
      }

      if (
        recipientFilter !== "all" &&
        notification.recipientScope !== recipientFilter
      ) {
        return false;
      }

      if (!matchesDateFilter(notification.sentAt, dateFilter)) {
        return false;
      }

      return true;
    });

    return filtered.sort(
      (firstNotification, secondNotification) =>
        toUtcTimestamp(secondNotification.sentAt) -
        toUtcTimestamp(firstNotification.sentAt),
    );
  }, [
    categoryFilter,
    dateFilter,
    mailboxNotifications,
    recipientFilter,
    statusFilter,
  ]);

  const pagination = usePagination({
    totalItems: filteredNotifications.length,
    pageSize,
  });
  const { setCurrentPage } = pagination;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    activeMailbox,
    categoryFilter,
    dateFilter,
    pageSize,
    recipientFilter,
    setCurrentPage,
    statusFilter,
  ]);

  React.useEffect(() => {
    setStatusFilter("all");
  }, [activeMailbox]);

  const currentPageNotifications = React.useMemo(
    () =>
      filteredNotifications.slice(pagination.startIndex, pagination.endIndex),
    [filteredNotifications, pagination.endIndex, pagination.startIndex],
  );

  const detailsNotification = React.useMemo(
    () =>
      detailsNotificationId
        ? (notifications.find(
            (notification) => notification.id === detailsNotificationId,
          ) ?? null)
        : null,
    [detailsNotificationId, notifications],
  );

  const openDetails = React.useCallback((notificationId: string) => {
    setDetailsNotificationId(notificationId);
    setDetailsSheetOpen(true);
  }, []);

  const handleToggleReadStatus = React.useCallback((notificationId: string) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              status: notification.status === "unread" ? "read" : "unread",
              readAt:
                notification.status === "unread"
                  ? new Date().toISOString()
                  : undefined,
            }
          : notification,
      ),
    );
  }, []);

  const handleResend = React.useCallback((notificationId: string) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              status: "sent",
              sentAt: new Date().toISOString(),
            }
          : notification,
      ),
    );
  }, []);

  const handleDelete = React.useCallback(
    (notificationId: string) => {
      setNotifications((currentNotifications) =>
        currentNotifications.filter(
          (notification) => notification.id !== notificationId,
        ),
      );
      if (detailsNotificationId === notificationId) {
        setDetailsSheetOpen(false);
        setDetailsNotificationId(null);
      }
    },
    [detailsNotificationId],
  );

  const handleCreateNotification = React.useCallback(
    (values: CreateNotificationValues) => {
      const now = new Date().toISOString();
      const nextNotification: AdminNotificationItem = {
        id: createNextNotificationId(notifications),
        mailbox: "sent",
        title: values.title,
        body: values.body,
        category: values.category,
        recipientScope: values.recipientScope,
        recipientLabel: values.recipientLabel,
        priority: "normal",
        status: "sent",
        createdAt: now,
        sentAt: now,
        referenceLabel: "-",
        referencePath: "/dashboard/admin/notifications",
        createdBy: "فريق الإدارة",
      };

      setNotifications((currentNotifications) => [
        nextNotification,
        ...currentNotifications,
      ]);
    },
    [notifications],
  );

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row md:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground sm:text-base">
            إدارة الإشعارات - {notificationMailboxLabels[activeMailbox]}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            إدارة الإشعارات الواردة والمرسلة داخل النظام.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={() => setCreateSheetOpen(true)}>
            إرسال إشعار جديد
            <AppIcons.send className="size-4" />
          </Button>
        </div>
      </div>

      <NotificationsFilters
        mailbox={activeMailbox}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        recipientFilter={recipientFilter}
        onRecipientFilterChange={setRecipientFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
      />

      {currentPageNotifications.length === 0 ? (
        <EmptyState
          icon="notifications"
          title={`لا توجد إشعارات ضمن ${notificationMailboxLabels[activeMailbox]}`}
          description="جرّب تغيير الفلاتر لعرض نتائج إضافية."
        />
      ) : (
        <NotificationsTable
          mailbox={activeMailbox}
          rows={currentPageNotifications}
          onOpenDetails={openDetails}
          onToggleReadStatus={handleToggleReadStatus}
          onResend={handleResend}
          onDelete={handleDelete}
        />
      )}

      <PaginationControls
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        hasPreviousPage={pagination.hasPreviousPage}
        hasNextPage={pagination.hasNextPage}
        paginationRange={pagination.paginationRange}
        onPageChange={pagination.goToPage}
        onPreviousPage={pagination.goToPreviousPage}
        onNextPage={pagination.goToNextPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
      />

      <NotificationDetailsSheet
        mailbox={activeMailbox}
        notification={detailsNotification}
        open={detailsSheetOpen}
        onOpenChange={(nextOpen) => {
          setDetailsSheetOpen(nextOpen);
          if (!nextOpen) {
            setDetailsNotificationId(null);
          }
        }}
        onToggleReadStatus={handleToggleReadStatus}
        onResend={handleResend}
        onDelete={handleDelete}
      />

      <CreateNotificationSheet
        open={createSheetOpen}
        onOpenChange={setCreateSheetOpen}
        onSubmit={handleCreateNotification}
      />
    </section>
  );
}
