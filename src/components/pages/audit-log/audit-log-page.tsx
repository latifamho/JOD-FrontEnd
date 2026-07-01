"use client";

import * as React from "react";

import { EmptyState, PaginationControls } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type AuditLogActionType } from "@/components/pages/audit-log/audit-log.data";
import { usePagination } from "@/hooks/use-pagination";
import { formatUtcDateTime } from "@/lib/date";
import { useAdminAuditLogs } from "@/features/admin/audit-logs/admin.audit-logs.query";

const actionTypeLabels: Record<AuditLogActionType, string> = {
  authentication: "مصادقة",
  moderation: "مراجعة",
  verification: "توثيق",
  security: "أمان",
  content: "محتوى",
};

const actionTypeBadgeClassNames: Record<AuditLogActionType, string> = {
  authentication: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-100",
  moderation: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-100",
  verification: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100",
  security: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-100",
  content: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-100",
};

export function AuditLogPage() {
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [apiTotal, setApiTotal] = React.useState(0);

  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;

  const { data, isLoading, isError, refetch } = useAdminAuditLogs({
    page: pagination.currentPage,
    perPage: pageSize,
    sort: "-at",
  });

  React.useEffect(() => {
    if (data?.meta.total !== undefined) {
      setApiTotal(data.meta.total);
    }
  }, [data?.meta.total]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, setCurrentPage]);

  const rows = data?.data ?? [];
  const latestTimestamp = rows[0]?.at;

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">سجل النشاط</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          تتبع عمليات الأدمن والفِرق بترتيب زمني واضح.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">إجمالي الأحداث</p>
          <p className="mt-1 text-xl font-semibold text-foreground">{apiTotal}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">أحدث تحديث</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {latestTimestamp ? formatUtcDateTime(latestTimestamp) : "—"}
          </p>
        </div>
      </div>

      {isError && (
        <div className="flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="flex-1 text-sm text-destructive">
            تعذّر تحميل السجل. حاول مرة أخرى.
          </p>
          <Button type="button" size="sm" variant="outline" onClick={() => refetch()}>
            إعادة المحاولة
          </Button>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card shadow-sm">
        {!isLoading && rows.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon="auditLog"
              title="لا توجد سجلات نشاط"
              description="لا يوجد أي نشاط مسجل حالياً."
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-right font-semibold text-muted-foreground">
                  الإجراء
                </TableHead>
                <TableHead className="text-right font-semibold text-muted-foreground">
                  النوع
                </TableHead>
                <TableHead className="text-right font-semibold text-muted-foreground">
                  المستخدم
                </TableHead>
                <TableHead className="text-right font-semibold text-muted-foreground">
                  المرجع
                </TableHead>
                <TableHead className="text-right font-semibold text-muted-foreground">
                  التاريخ
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-right">{row.action}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="secondary"
                      className={actionTypeBadgeClassNames[row.type]}
                    >
                      {actionTypeLabels[row.type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {row.user}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {row.reference ?? "—"}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {formatUtcDateTime(row.at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
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
    </section>
  );
}
