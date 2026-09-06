"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableRowActions } from "@/components/shared";
import { AppIcons } from "@/constant/icons";
import { formatUtcDateTimeOrDash } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import { getNotificationStatusBadgeClass } from "@/components/pages/notifications-management/helpers";
import {
  notificationCategoryLabels,
  notificationStatusLabels,
  type AdminNotificationItem,
  type NotificationMailbox,
} from "@/components/pages/notifications-management/notifications-management.types";

type NotificationsTableProps = {
  mailbox: NotificationMailbox;
  rows: AdminNotificationItem[];
  onOpenDetails: (notificationId: string) => void;
  onToggleReadStatus: (notificationId: string) => void;
  onResend: (notificationId: string) => void;
  onDelete: (notificationId: string) => void;
};

export function NotificationsTable({
  mailbox,
  rows,
  onOpenDetails,
  onToggleReadStatus,
  onResend,
  onDelete,
}: NotificationsTableProps) {
  return (
    <div className="overflow-auto flex flex-1 rounded-md border border-border shadow-xs">
      <Table className="min-w-260 bg-background">
        <TableHeader className="bg-muted/35">
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>الإشعار</TableHead>
            <TableHead>النوع</TableHead>
            <TableHead>المستلم</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>تاريخ الإرسال</TableHead>
            <TableHead className="w-14">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((notification, index) => (
              <TableRow key={notification.id}>
                <TableCell className="text-sm text-muted-foreground">
                  {index + 1}
                </TableCell>

                <TableCell>
                  <p className="font-semibold text-foreground">
                    {notification.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {notification.body}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {notification.id}
                  </p>
                </TableCell>

                <TableCell>
                  <Badge variant="outline">
                    {notificationCategoryLabels[notification.category]}
                  </Badge>
                </TableCell>

                <TableCell>
                  <p className="text-xs text-foreground">
                    {displayOrDash(notification.recipientLabel)}
                  </p>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={getNotificationStatusBadgeClass(
                      notification.status,
                    )}
                  >
                    {notificationStatusLabels[notification.status]}
                  </Badge>
                </TableCell>

                <TableCell>
                  <p className="text-xs text-muted-foreground">
                    {formatUtcDateTimeOrDash(notification.sentAt)}
                  </p>
                </TableCell>

                <TableCell>
                  <TableRowActions
                    actions={[
                      {
                        id: "details",
                        label: "عرض التفاصيل",
                        icon: <AppIcons.eye className="size-4" />,
                        onSelect: () => onOpenDetails(notification.id),
                      },
                      {
                        id: "toggle-read",
                        label:
                          notification.status === "unread"
                            ? "تعليم كمقروء"
                            : "تعليم كغير مقروء",
                        icon:
                          notification.status === "unread" ? (
                            <AppIcons.mailOpen className="size-4" />
                          ) : (
                            <AppIcons.mail className="size-4" />
                          ),
                        onSelect: () => onToggleReadStatus(notification.id),
                        hidden: mailbox !== "inbox",
                      },
                      {
                        id: "resend",
                        label: "إعادة إرسال",
                        icon: <AppIcons.rotateCw className="size-4" />,
                        onSelect: () => onResend(notification.id),
                        hidden: mailbox === "inbox",
                      },
                      {
                        id: "delete",
                        label: "حذف الإشعار",
                        icon: <AppIcons.Trash className="size-4" />,
                        onSelect: () => onDelete(notification.id),
                        destructive: true,
                        separatorBefore: true,
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                لا توجد إشعارات مطابقة.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
