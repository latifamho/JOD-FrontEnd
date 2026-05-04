"use client";

import * as React from "react";

import { EmptyState, PaginationControls } from "@/components/shared";
import { ReportCard } from "@/components/pages/reports-management/report-card";
import { ReportsToolbar } from "@/components/pages/reports-management/reports-toolbar";
import {
  reportsStaticData,
  reportStatusLabels,
  type ReportEntityType,
  type ReportItem,
  type ReportSeverity,
  type ReportStatus,
} from "@/components/pages/reports-management/static-data";
import { usePagination } from "@/hooks/use-pagination";
import { toUtcTimestamp } from "@/lib/date";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";

type ReportsManagementPageProps = {
  status: ReportStatus;
};

export function ReportsManagementPage({ status }: ReportsManagementPageProps) {
  const [reports, setReports] = React.useState<ReportItem[]>(reportsStaticData);
  const [severityFilter, setSeverityFilter] = React.useState<
    "all" | ReportSeverity
  >("all");
  const [entityTypeFilter, setEntityTypeFilter] = React.useState<
    "all" | ReportEntityType
  >("all");
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);

  const filteredReports = React.useMemo(() => {
    const filtered = reports.filter((report) => {
      if (report.status !== status) {
        return false;
      }

      if (severityFilter !== "all" && report.severity !== severityFilter) {
        return false;
      }

      if (
        entityTypeFilter !== "all" &&
        report.entityType !== entityTypeFilter
      ) {
        return false;
      }

      return true;
    });

    return filtered.sort(
      (firstReport, secondReport) =>
        toUtcTimestamp(secondReport.createdAt) -
        toUtcTimestamp(firstReport.createdAt),
    );
  }, [entityTypeFilter, reports, severityFilter, status]);

  const pagination = usePagination({
    totalItems: filteredReports.length,
    pageSize,
  });
  const { setCurrentPage } = pagination;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [entityTypeFilter, pageSize, setCurrentPage, severityFilter, status]);

  const currentPageReports = React.useMemo(
    () => filteredReports.slice(pagination.startIndex, pagination.endIndex),
    [filteredReports, pagination.endIndex, pagination.startIndex],
  );

  const updateReportInState = React.useCallback(
    (reportId: string, updater: (currentReport: ReportItem) => ReportItem) => {
      setReports((currentReports) =>
        currentReports.map((report) =>
          report.id === reportId ? updater(report) : report,
        ),
      );
    },
    [],
  );

  const handleClaim = React.useCallback(
    (reportId: string) => {
      updateReportInState(reportId, (report) => ({
        ...report,
        status: "in_progress",
        assignee: "فريق البلاغات - 1",
        timeline: [
          ...report.timeline,
          {
            id: `TL-${report.timeline.length + 1}`,
            action: "استلام البلاغ",
            actor: "فريق البلاغات - 1",
            at: "2026-02-27T10:00:00",
          },
        ],
      }));
    },
    [updateReportInState],
  );

  const handleMoveToWaiting = React.useCallback(
    (reportId: string) => {
      updateReportInState(reportId, (report) => ({
        ...report,
        status: "waiting_response",
        timeline: [
          ...report.timeline,
          {
            id: `TL-${report.timeline.length + 1}`,
            action: "طلب معلومات إضافية",
            actor: report.assignee ?? "فريق البلاغات",
            at: "2026-02-27T10:30:00",
          },
        ],
      }));
    },
    [updateReportInState],
  );

  const handleCloseReport = React.useCallback(
    (reportId: string) => {
      updateReportInState(reportId, (report) => ({
        ...report,
        status: "closed",
        timeline: [
          ...report.timeline,
          {
            id: `TL-${report.timeline.length + 1}`,
            action: "إغلاق البلاغ",
            actor: report.assignee ?? "فريق البلاغات",
            at: "2026-02-27T11:00:00",
            note: "تم الإغلاق بعد استكمال المراجعة.",
          },
        ],
      }));
    },
    [updateReportInState],
  );

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground sm:text-base">
          إدارة البلاغات - {reportStatusLabels[status]}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          النتائج الحالية: {filteredReports.length} بلاغ
        </p>
      </div>

      <ReportsToolbar
        severityFilter={severityFilter}
        onSeverityFilterChange={setSeverityFilter}
        entityTypeFilter={entityTypeFilter}
        onEntityTypeFilterChange={setEntityTypeFilter}
      />

      {currentPageReports.length === 0 ? (
        <EmptyState
          icon="reports"
          title="لا توجد بلاغات مطابقة"
          description="جرّب تغيير الفلاتر لعرض نتائج إضافية."
        />
      ) : (
        <div className="flex-1 content-start items-start grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {currentPageReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onClaim={handleClaim}
              onMoveToWaiting={handleMoveToWaiting}
              onCloseReport={handleCloseReport}
            />
          ))}
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
    </section>
  );
}
