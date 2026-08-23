"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { EmptyState, ListLoadingSkeleton, PaginationControls } from "@/components/shared";
import { AppIcons } from "@/constant/icons";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { useQueryModal } from "@/hooks/use-query-modal";
import {
  type CreateNotificationValues,
  CreateNotificationSheet,
} from "@/components/pages/notifications-management/create-notification-sheet";
import { NotificationDetailsSheet } from "@/components/pages/notifications-management/notification-details-sheet";
import { NotificationsFilters } from "@/components/pages/notifications-management/notifications-filters";
import { NotificationsTable } from "@/components/pages/notifications-management/notifications-table";
import {
  notificationMailboxLabels,
  type NotificationCategory,
  type NotificationDateFilter,
  type NotificationMailbox,
  type NotificationRecipientScope,
  type NotificationStatus,
} from "@/components/pages/notifications-management/notifications-management.types";
import {
  useAdminNotifications,
  useCreateAdminNotification,
  useUpdateAdminNotificationReadState,
  useResendAdminNotification,
  useDeleteAdminNotification,
} from "@/features/admin/notifications/admin.notifications.query";

type NotificationsManagementPageProps = {
  mailbox?: NotificationMailbox;
};

export function NotificationsManagementPage({
  mailbox,
}: NotificationsManagementPageProps) {
  const activeMailbox = mailbox ?? "inbox";

  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [apiTotal, setApiTotal] = React.useState(0);

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

  const detailsModal = useQueryModal("notification-details");
  const createModal = useQueryModal("notification-create");
  const detailsNotificationId = detailsModal.id;

  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;

  const { data, isLoading, isError, refetch } = useAdminNotifications({
    page: pagination.currentPage,
    perPage: pageSize,
    sort: "-sentAt",
    filter: {
      mailbox: activeMailbox,
      status: statusFilter !== "all" ? statusFilter : undefined,
      category: categoryFilter !== "all" ? categoryFilter : undefined,
      recipientScope: recipientFilter !== "all" ? recipientFilter : undefined,
      date: dateFilter !== "all" ? dateFilter : undefined,
    },
  });

  React.useEffect(() => {
    if (data?.meta.total !== undefined) {
      setApiTotal(data.meta.total);
    }
  }, [data?.meta.total]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    activeMailbox,
    categoryFilter,
    dateFilter,
    pageSize,
    recipientFilter,
    statusFilter,
    setCurrentPage,
  ]);

  React.useEffect(() => {
    setStatusFilter("all");
  }, [activeMailbox]);

  const notifications = data?.data ?? [];

  const detailsNotification = React.useMemo(
    () =>
      detailsNotificationId
        ? (notifications.find((n) => n.id === detailsNotificationId) ?? null)
        : null,
    [detailsNotificationId, notifications],
  );

  const createMutation = useCreateAdminNotification();
  const toggleReadMutation = useUpdateAdminNotificationReadState();
  const resendMutation = useResendAdminNotification();
  const deleteMutation = useDeleteAdminNotification();

  const openDetails = React.useCallback(
    (notificationId: string) => detailsModal.open({ id: notificationId }),
    [detailsModal],
  );

  const handleToggleReadStatus = React.useCallback(
    (notificationId: string) => {
      const notification = notifications.find((n) => n.id === notificationId);
      if (!notification) return;
      const nextStatus =
        notification.status === "unread" ? "read" : "unread";
      toggleReadMutation.mutate({ notificationId, body: { status: nextStatus } });
    },
    [notifications, toggleReadMutation],
  );

  const handleResend = React.useCallback(
    (notificationId: string) => {
      resendMutation.mutate(notificationId);
    },
    [resendMutation],
  );

  const handleDelete = React.useCallback(
    (notificationId: string) => {
      deleteMutation.mutate(notificationId, {
        onSuccess: () => {
          if (detailsNotificationId === notificationId) detailsModal.close();
        },
      });
    },
    [deleteMutation, detailsNotificationId],
  );

  const handleCreateNotification = React.useCallback(
    (values: CreateNotificationValues) => {
      createMutation.mutate(
        {
          title: values.title,
          body: values.body,
          category: values.category,
          recipientScope: values.recipientScope,
          recipientLabel: values.recipientLabel,
        },
        { onSuccess: () => createModal.close() },
      );
    },
    [createMutation],
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
          <Button type="button" onClick={() => createModal.open()}>
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

      {isError && (
        <div className="flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="flex-1 text-sm text-destructive">
            تعذّر تحميل الإشعارات. حاول مرة أخرى.
          </p>
          <Button type="button" size="sm" variant="outline" onClick={() => refetch()}>
            إعادة المحاولة
          </Button>
        </div>
      )}

      {isLoading ? (
        <ListLoadingSkeleton />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon="notifications"
          title={`لا توجد إشعارات ضمن ${notificationMailboxLabels[activeMailbox]}`}
          description="جرّب تغيير الفلاتر لعرض نتائج إضافية."
        />
      ) : (
        <NotificationsTable
          mailbox={activeMailbox}
          rows={notifications}
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
        open={detailsModal.isOpen}
        onOpenChange={detailsModal.onOpenChange}
        onToggleReadStatus={handleToggleReadStatus}
        onResend={handleResend}
        onDelete={handleDelete}
      />

      <CreateNotificationSheet
        open={createModal.isOpen}
        onOpenChange={createModal.onOpenChange}
        onSubmit={handleCreateNotification}
        isSubmitting={createMutation.isPending}
      />
    </section>
  );
}
