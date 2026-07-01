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
import {
  getOrgReportStatusBadgeClass,
  orgReportCategoryLabels,
  orgReportStatusLabels,
} from "@/components/pages/organization-reports/static-data";
import { PaginationControls } from "@/components/shared";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { useOrgReports } from "@/features/org/reports/org.reports.query";

export function OrganizationReportsPage() {
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [apiTotal, setApiTotal] = React.useState(0);
  const [openId, setOpenId] = React.useState<string | null>(null);

  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;

  const { data, isError, refetch } = useOrgReports({
    page: pagination.currentPage,
    perPage: pageSize,
    sort: "-submittedAt",
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
  const selected = rows.find((r) => r.id === openId) ?? null;

  return (
    <section className="flex flex-col flex-1 gap-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">البلاغات</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          بلاغات وردت عن المحتوى أو السلوك المرتبط بحساب منظمتكم. {apiTotal} سجل
        </p>
      </div>

      {isError && (
        <div className="flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="flex-1 text-sm text-destructive">
            تعذّر تحميل البلاغات. حاول مرة أخرى.
          </p>
          <Button type="button" size="sm" variant="outline" onClick={() => refetch()}>
            إعادة المحاولة
          </Button>
        </div>
      )}

      <div className="overflow-auto flex flex-1 rounded-md border border-border shadow-xs">
        <Table className="min-w-[min(100%,880px)] bg-background">
          <TableHeader className="bg-muted/35">
            <TableRow>
              <TableHead>البلاغ</TableHead>
              <TableHead>التصنيف</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>المرسل</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead className="w-28">إجراء</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <p className="font-semibold text-foreground">{row.subject}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {row.summary}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {row.id}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {orgReportCategoryLabels[row.category]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getOrgReportStatusBadgeClass(row.status)}
                  >
                    {orgReportStatusLabels[row.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-foreground">
                  {row.reporterLabel}
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {formatUtcDateTime(row.submittedAt)}
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setOpenId(row.id)}
                  >
                    التفاصيل
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={openId !== null} onOpenChange={(o) => !o && setOpenId(null)}>
        <SheetContent side="right" dir="rtl" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{selected?.subject}</SheetTitle>
            <SheetDescription asChild>
              <div className="space-y-3 pt-2 text-start">
                {selected ? (
                  <>
                    <p className="text-sm leading-relaxed text-foreground">
                      {selected.summary}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {orgReportCategoryLabels[selected.category]}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={getOrgReportStatusBadgeClass(selected.status)}
                      >
                        {orgReportStatusLabels[selected.status]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      المرسل: {selected.reporterLabel}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatUtcDateTime(selected.submittedAt)}
                    </p>
                  </>
                ) : null}
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

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
