"use client";

import * as React from "react";

import { EmptyState, PaginationControls } from "@/components/shared";
import { ReportsTable } from "@/components/pages/reports-management/reports-table";
import { ReportsToolbar } from "@/components/pages/reports-management/reports-toolbar";
import {
  reportStatusLabels,
  type ReportEntityType,
  type ReportSeverity,
  type ReportStatus,
} from "@/components/pages/reports-management/reports-management.types";
import { usePagination } from "@/hooks/use-pagination";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import {
  useAdminReports,
  useClaimReport,
  useCloseReport,
  useWaitReport,
} from "@/features/admin/reports.services/admin.reports.query";

type ReportsManagementPageProps = {
  status: ReportStatus;
};

export function ReportsManagementPage({ status }: ReportsManagementPageProps) {
  const [severityFilter, setSeverityFilter] = React.useState<
    "all" | ReportSeverity
  >("all");
  const [entityTypeFilter, setEntityTypeFilter] = React.useState<
    "all" | ReportEntityType
  >("all");
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [apiTotal, setApiTotal] = React.useState(0);

  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;

  const { data, isLoading, isError } = useAdminReports({
    page: pagination.currentPage,
    perPage: pageSize,
    filter: {
      status,
      severity: severityFilter !== "all" ? severityFilter : undefined,
      entityType: entityTypeFilter !== "all" ? entityTypeFilter : undefined,
    },
  });

  React.useEffect(() => {
    if (data?.meta.total !== undefined) {
      setApiTotal(data.meta.total);
    }
  }, [data?.meta.total]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [status, severityFilter, entityTypeFilter, pageSize, setCurrentPage]);

  const claimMutation = useClaimReport();
  const waitMutation = useWaitReport();
  const closeMutation = useCloseReport();

  const reports = data?.data ?? [];

  const handleClaim = React.useCallback(
    (reportId: string) => {
      claimMutation.mutate(reportId);
    },
    [claimMutation],
  );

  const handleMoveToWaiting = React.useCallback(
    (reportId: string, note: string) => {
      waitMutation.mutate({ reportId, body: { note } });
    },
    [waitMutation],
  );

  const handleCloseReport = React.useCallback(
    (reportId: string) => {
      closeMutation.mutate(reportId);
    },
    [closeMutation],
  );

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground sm:text-base">
          إدارة البلاغات - {reportStatusLabels[status]}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          النتائج الحالية: {apiTotal} بلاغ
        </p>
      </div>

      <ReportsToolbar
        severityFilter={severityFilter}
        onSeverityFilterChange={setSeverityFilter}
        entityTypeFilter={entityTypeFilter}
        onEntityTypeFilterChange={setEntityTypeFilter}
      />

      {isError && (
        <p className="text-sm text-destructive">
          تعذّر تحميل البلاغات. حاول مرة أخرى.
        </p>
      )}

      {isLoading ? (
        <div className="rounded-md border border-border bg-card shadow-sm divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <div className="h-4 w-16 rounded bg-muted animate-pulse" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-48 rounded bg-muted animate-pulse" />
                <div className="h-3 w-72 rounded bg-muted animate-pulse" />
              </div>
              <div className="h-3 w-20 rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          icon="reports"
          title="لا توجد بلاغات مطابقة"
          description="جرّب تغيير الفلاتر لعرض نتائج إضافية."
        />
      ) : (
        <ReportsTable
          reports={reports}
          onClaim={handleClaim}
          onMoveToWaiting={handleMoveToWaiting}
          onCloseReport={handleCloseReport}
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
    </section>
  );
}
