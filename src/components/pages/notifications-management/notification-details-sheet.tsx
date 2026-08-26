"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatUtcDateTimeOrDash } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import {
  getNotificationPriorityBadgeClass,
  getNotificationStatusBadgeClass,
} from "@/components/pages/notifications-management/helpers";
import {
  notificationCategoryLabels,
  notificationPriorityLabels,
  notificationStatusLabels,
  type AdminNotificationItem,
  type NotificationMailbox,
} from "@/components/pages/notifications-management/notifications-management.types";

type NotificationDetailsSheetProps = {
  mailbox: NotificationMailbox;
  notification: AdminNotificationItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleReadStatus: (notificationId: string) => void;
  onResend: (notificationId: string) => void;
  onDelete: (notificationId: string) => void;
};

export function NotificationDetailsSheet({
  mailbox,
  notification,
  open,
  onOpenChange,
  onToggleReadStatus,
  onResend,
  onDelete,
}: NotificationDetailsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        dir="rtl"
        className="w-[95vw] border-border p-0 sm:max-w-2xl"
      >
        {notification ? (
          <>
            <SheetHeader className="border-b border-border pe-12 text-right">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={getNotificationStatusBadgeClass(
                    notification.status,
                  )}
                >
                  {notificationStatusLabels[notification.status]}
                </Badge>
                <Badge
                  variant="outline"
                  className={getNotificationPriorityBadgeClass(
                    notification.priority,
                  )}
                >
                  {notificationPriorityLabels[notification.priority]}
                </Badge>
                <Badge variant="outline">
                  {notificationCategoryLabels[notification.category]}
                </Badge>

              </div>
              <SheetTitle className="text-right text-lg">
                {notification.title}
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-4 overflow-y-auto p-4">
              <section className="rounded-lg border border-border bg-muted/30 p-3">
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  تفاصيل الإشعار
                </h3>
                <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                  <p>
                    المستلم:{" "}
                    <span className="font-semibold text-foreground">
                      {displayOrDash(notification.recipientLabel)}
                    </span>
                  </p>
                  <p>
                    أنشئ بواسطة:{" "}
                    <span className="font-semibold text-foreground">
                      {displayOrDash(notification.createdBy)}
                    </span>
                  </p>
                  <p>
                    تاريخ الإنشاء:{" "}
                    <span className="font-semibold text-foreground">
                      {formatUtcDateTimeOrDash(notification.createdAt)}
                    </span>
                  </p>
                  <p>
                    تاريخ الإرسال:{" "}
                    <span className="font-semibold text-foreground">
                      {formatUtcDateTimeOrDash(notification.sentAt)}
                    </span>
                  </p>
                  <p>
                    وقت القراءة:{" "}
                    <span className="font-semibold text-foreground">
                      {formatUtcDateTimeOrDash(notification.readAt)}
                    </span>
                  </p>
                  <p>
                    المرجع:{" "}
                    <span className="font-semibold text-foreground">
                      {displayOrDash(notification.referenceLabel)}
                    </span>
                  </p>
                </div>
              </section>

              <section className="rounded-lg border border-border p-3">
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  المحتوى
                </h3>
                <p className="text-sm leading-7 text-foreground">
                  {notification.body}
                </p>
              </section>
            </div>

            <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
              {mailbox === "inbox" ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onToggleReadStatus(notification.id)}
                  >
                    {notification.status === "unread"
                      ? "تعليم كمقروء"
                      : "تعليم كغير مقروء"}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onResend(notification.id)}
                >
                  إعادة إرسال
                </Button>
              )}
              <Button
                type="button"
                variant="destructive"
                onClick={() => onDelete(notification.id)}
              >
                حذف
              </Button>
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
