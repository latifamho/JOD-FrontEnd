"use client";

import * as React from "react";

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
import { formatUtcDateTime } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import { orgNotificationCategoryLabels } from "@/components/pages/organization-notifications/static-data";
import { PaginationControls } from "@/components/shared";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { usePagination } from "@/hooks/use-pagination";
import {
  useOrgNotifications,
  useUpdateOrgNotificationReadState,
} from "@/features/org/notifications/org.notifications.query";

type Filter = "all" | "unread" | "read";

const filterLabels: Record<Filter, string> = {
  all: "الكل",
  unread: "غير مقروء",
  read: "مقروء",
};

export function OrganizationNotificationsPage() {
  const [filter, setFilter] = React.useState<Filter>("all");
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [apiTotal, setApiTotal] = React.useState(0);

  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;

  const { data, isError, refetch } = useOrgNotifications({
    page: pagination.currentPage,
    perPage: pageSize,
    filter: {
      status: filter !== "all" ? filter : undefined,
    },
  });

  React.useEffect(() => {
    if (data?.meta.total !== undefined) {
      setApiTotal(data.meta.total);
    }
  }, [data?.meta.total]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter, pageSize, setCurrentPage]);

  const updateReadState = useUpdateOrgNotificationReadState();

  const rows = data?.data ?? [];
  const selected = rows.find((n) => n.id === openId) ?? null;
  const unreadCount = rows.filter((n) => !n.read).length;

  function toggleRead(id: string, currentlyRead: boolean) {
    updateReadState.mutate({
      notificationId: id,
      body: { status: currentlyRead ? "unread" : "read" },
    });
  }

  return (
    <section className="flex flex-col flex-1 gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">الإشعارات</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            تنبيهات الحملات والتبرعات والموظفين والمنشورات.{" "}
            {unreadCount > 0 ? (
              <span className="text-sky-600 dark:text-sky-400">
                {unreadCount} غير مقروء
              </span>
            ) : (
              <span>لا توجد إشعارات غير مقروءة</span>
            )}
          </p>
        </div>

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
      </div>

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

      <div className="overflow-auto flex flex-1 rounded-md border border-border shadow-xs">
        <Table className="min-w-[min(100%,720px)] bg-background">
          <TableHeader className="bg-muted/35">
            <TableRow>
              <TableHead className="w-10" />
              <TableHead>الإشعار</TableHead>
              <TableHead>النوع</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead className="w-40">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className={row.read ? "" : "bg-sky-500/5"}>
                <TableCell className="align-top">
                  {!row.read ? (
                    <span
                      className="inline-block size-2 rounded-full bg-sky-500"
                      title="غير مقروء"
                    />
                  ) : (
                    <span className="inline-block size-2 rounded-full bg-muted-foreground/25" />
                  )}
                </TableCell>
                <TableCell>
                  <p className="font-semibold text-foreground">
                    {displayOrDash(row.title)}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {displayOrDash(row.body)}
                  </p>
                  {row.referenceLabel ? (
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {row.referenceLabel}
                    </p>
                  ) : null}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {orgNotificationCategoryLabels[row.category]}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {formatUtcDateTime(row.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => setOpenId(row.id)}
                    >
                      التفاصيل
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      disabled={updateReadState.isPending}
                      onClick={() => toggleRead(row.id, row.read)}
                    >
                      {row.read ? "تعيين غير مقروء" : "تعيين مقروء"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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

      <Sheet open={openId !== null} onOpenChange={(o) => !o && setOpenId(null)}>
        <SheetContent side="right" dir="rtl" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{selected?.title}</SheetTitle>
            <SheetDescription asChild>
              <div className="space-y-3 pt-2 text-start">
                {selected ? (
                  <>
                    <p className="text-sm text-foreground">
                      {displayOrDash(selected.body)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {orgNotificationCategoryLabels[selected.category]}
                      </Badge>
                      <Badge variant="secondary">
                        {selected.read ? "مقروء" : "غير مقروء"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatUtcDateTime(selected.createdAt)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      مرجع: {displayOrDash(selected.referenceLabel)}
                    </p>
                    <Button
                      type="button"
                      className="mt-2"
                      disabled={updateReadState.isPending}
                      onClick={() => {
                        if (selected) toggleRead(selected.id, selected.read);
                        setOpenId(null);
                      }}
                    >
                      {selected?.read ? "إعادة كغير مقروء" : "تعيين كمقروء وإغلاق"}
                    </Button>
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
