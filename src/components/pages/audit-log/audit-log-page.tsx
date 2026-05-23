"use client";

import * as React from "react";

import { EmptyState, PaginationControls } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  auditLogStaticData,
  type AuditLogActionType,
} from "@/components/pages/audit-log/audit-log.data";
import { usePagination } from "@/hooks/use-pagination";
import { formatUtcDateTime, toUtcTimestamp } from "@/lib/date";

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

  const sortedRows = React.useMemo(() => {
    return [...auditLogStaticData].sort((firstRow, secondRow) => {
      return toUtcTimestamp(secondRow.at) - toUtcTimestamp(firstRow.at);
    });
  }, []);

  const summary = React.useMemo(() => {
    const totalEntries = sortedRows.length;
    const totalUsers = new Set(sortedRows.map((row) => row.user)).size;
    const latestTimestamp = sortedRows[0]?.at;
    const recentEntries =
      latestTimestamp === undefined
        ? 0
        : sortedRows.filter((row) => {
            const differenceMs =
              toUtcTimestamp(latestTimestamp) - toUtcTimestamp(row.at);
            return differenceMs <= 24 * 60 * 60 * 1000;
          }).length;

    return {
      totalEntries,
      totalUsers,
      recentEntries,
      latestTimestamp,
    };
  }, [sortedRows]);

  const pagination = usePagination({
    totalItems: sortedRows.length,
    pageSize,
  });

  const currentPageRows = React.useMemo(
    () => sortedRows.slice(pagination.startIndex, pagination.endIndex),
    [sortedRows, pagination.endIndex, pagination.startIndex],
  );

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">سجل النشاط</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          تتبع عمليات الأدمن والفِرق بترتيب زمني واضح.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">إجمالي الأحداث</p>
          <p className="mt-1 text-xl font-semibold text-foreground">
            {summary.totalEntries}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">مستخدمون ظاهرون</p>
          <p className="mt-1 text-xl font-semibold text-foreground">
            {summary.totalUsers}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">آخر 24 ساعة (نسبيًا)</p>
          <p className="mt-1 text-xl font-semibold text-foreground">
            {summary.recentEntries}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">أحدث تحديث</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {summary.latestTimestamp
              ? formatUtcDateTime(summary.latestTimestamp)
              : "—"}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        {sortedRows.length === 0 ? (
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
              {currentPageRows.map((row) => (
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

      {sortedRows.length > 0 ? (
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
      ) : null}
    </section>
  );
}
