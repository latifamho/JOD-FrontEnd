"use client";

import * as React from "react";

import { ListLoadingSkeleton, PaginationControls, TableRowActions } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { orgNotificationCategoryLabels } from "@/components/pages/organization-notifications/static-data";
import { AppIcons } from "@/constant/icons";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import {
  useOrgNotifications,
  useUpdateOrgNotificationReadState,
} from "@/features/org/notifications/org.notifications.query";
import { usePagination } from "@/hooks/use-pagination";
import { useQueryModal } from "@/hooks/use-query-modal";
import { formatUtcDateTime } from "@/lib/date";
import { displayOrDash } from "@/lib/text";

type Filter = "all" | "unread" | "read";
type Mailbox = "inbox" | "sent";

const filterLabels: Record<Filter, string> = {
  all: "الكل",
  unread: "غير مقروء",
  read: "مقروء",
};

export function OrganizationNotificationsPage({ mailbox = "inbox" }: { mailbox?: Mailbox }) {
  const [filter, setFilter] = React.useState<Filter>("all");
  const detailsModal = useQueryModal("notification-details", {
    permission: "org.notifications.view",
  });
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [apiTotal, setApiTotal] = React.useState(0);
  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;

  const query = useOrgNotifications({
    page: pagination.currentPage,
    perPage: pageSize,
    sort: "-createdAt",
    filter: {
      mailbox,
      status: mailbox === "sent" ? "sent" : filter !== "all" ? filter : undefined,
    },
  });

  React.useEffect(() => {
    if (query.data?.meta.total !== undefined) setApiTotal(query.data.meta.total);
  }, [query.data?.meta.total]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter, mailbox, pageSize, setCurrentPage]);

  React.useEffect(() => {
    setFilter("all");
    detailsModal.close();
  }, [mailbox, detailsModal.close]);

  const updateReadState = useUpdateOrgNotificationReadState();
  const rows = query.data?.data ?? [];
  const selected = rows.find((row) => row.id === detailsModal.id) ?? null;
  const unreadCount = mailbox === "inbox" ? rows.filter((row) => !row.read).length : 0;

  const toggleRead = (id: string, currentlyRead: boolean) => {
    updateReadState.mutate({
      notificationId: id,
      body: { status: currentlyRead ? "unread" : "read" },
    });
  };

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            الإشعارات - {mailbox === "inbox" ? "الوارد" : "المرسل"}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {mailbox === "sent"
              ? "الإشعارات المرسلة من حساب المنظمة."
              : unreadCount > 0
                ? `${unreadCount} غير مقروء`
                : "لا توجد إشعارات غير مقروءة"}
          </p>
        </div>

        {mailbox === "inbox" ? (
          <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/25 p-1">
            {(Object.keys(filterLabels) as Filter[]).map((key) => (
              <Button
                key={key}
                type="button"
                variant={filter === key ? "secondary" : "ghost"}
                size="sm"
                className="h-8 text-xs"
                onClick={() => setFilter(key)}
              >
                {filterLabels[key]}
              </Button>
            ))}
          </div>
        ) : null}
      </div>

      {query.isError ? (
        <div className="flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="flex-1 text-sm text-destructive">تعذّر تحميل الإشعارات. حاول مرة أخرى.</p>
          <Button type="button" size="sm" variant="outline" onClick={() => query.refetch()}>
            إعادة المحاولة
          </Button>
        </div>
      ) : null}

      {query.isLoading ? (
        <ListLoadingSkeleton />
      ) : (
        <div className="flex flex-1 overflow-auto rounded-md border border-border shadow-xs">
          <Table className="min-w-[min(100%,720px)] bg-background">
            <TableHeader className="bg-muted/35">
              <TableRow>
                <TableHead className="w-10" />
                <TableHead>الإشعار</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead className="w-14">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} className={row.read ? "" : "bg-sky-500/5"}>
                  <TableCell>
                    <span className={row.read ? "inline-block size-2 rounded-full bg-muted-foreground/25" : "inline-block size-2 rounded-full bg-sky-500"} />
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-foreground">{displayOrDash(row.title)}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{displayOrDash(row.body)}</p>
                  </TableCell>
                  <TableCell><Badge variant="outline">{orgNotificationCategoryLabels[row.category]}</Badge></TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{formatUtcDateTime(row.createdAt)}</TableCell>
                  <TableCell>
                    <TableRowActions
                      loading={updateReadState.isPending}
                      actions={[
                        {
                          id: "details",
                          label: "التفاصيل",
                          icon: <AppIcons.eye className="size-4" />,
                          onSelect: () => detailsModal.open({ id: row.id }),
                        },
                        {
                          id: "toggle-read",
                          label: row.read ? "تعيين غير مقروء" : "تعيين مقروء",
                          icon: row.read ? (
                            <AppIcons.mail className="size-4" />
                          ) : (
                            <AppIcons.mailOpen className="size-4" />
                          ),
                          onSelect: () => toggleRead(row.id, row.read),
                          hidden: mailbox !== "inbox",
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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

      <Sheet open={detailsModal.isOpen} onOpenChange={detailsModal.onOpenChange}>
        <SheetContent side="right" dir="rtl" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{selected?.title}</SheetTitle>
            <SheetDescription asChild>
              <div className="space-y-3 pt-2 text-start">
                {selected ? (
                  <>
                    <p className="text-sm text-foreground">{displayOrDash(selected.body)}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{orgNotificationCategoryLabels[selected.category]}</Badge>
                      <Badge variant="secondary">{selected.read ? "مقروء" : "غير مقروء"}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatUtcDateTime(selected.createdAt)}</p>
                    {mailbox === "inbox" ? (
                      <Button type="button" disabled={updateReadState.isPending} onClick={() => { toggleRead(selected.id, selected.read); detailsModal.close(); }}>
                        {selected.read ? "إعادة كغير مقروء" : "تعيين كمقروء وإغلاق"}
                      </Button>
                    ) : null}
                  </>
                ) : null}
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </section>
  );
}
