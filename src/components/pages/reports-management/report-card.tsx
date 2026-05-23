"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReportDetailsSheet } from "@/components/pages/reports-management/report-details-sheet";
import { AppIcons } from "@/constant/icons";
import { formatUtcDateTime } from "@/lib/date";
import {
  reportEntityTypeLabels,
  reportSeverityLabels,
  reportStatusLabels,
  type ReportItem,
} from "@/components/pages/reports-management/static-data";
import {
  getSeverityBadgeClass,
  getStatusBadgeClass,
} from "@/components/pages/reports-management/helpers";

type ReportCardProps = {
  report: ReportItem;
  onClaim: (reportId: string) => void;
  onMoveToWaiting: (reportId: string) => void;
  onCloseReport: (reportId: string) => void;
};

export function ReportCard({
  report,
  onClaim,
  onMoveToWaiting,
  onCloseReport,
}: ReportCardProps) {
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  return (
    <>
      <article className="self-start flex min-h-65 flex-col rounded-xl border border-border bg-background p-4 shadow-xs">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={getStatusBadgeClass(report.status)}
            >
              {reportStatusLabels[report.status]}
            </Badge>
            <Badge
              variant="outline"
              className={getSeverityBadgeClass(report.severity)}
            >
              {reportSeverityLabels[report.severity]}
            </Badge>
            <Badge variant="outline">
              {reportEntityTypeLabels[report.entityType]}
            </Badge>
            <Badge variant="outline">{report.id}</Badge>
          </div>

          <p className="text-xs text-muted-foreground">
            {formatUtcDateTime(report.createdAt)}
          </p>
        </div>

        <h3 className="mb-2 text-base font-semibold text-foreground">
          {report.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {report.description}
        </p>

        <div className="mt-4 grid gap-2 rounded-lg border border-border/70 bg-muted/30 p-3 text-xs text-muted-foreground sm:grid-cols-4">
          <p>
            المنظمة:{" "}
            <span className="font-semibold text-foreground">
              {report.organizationName}
            </span>
          </p>
          <p>
            المبلّغ:{" "}
            <span className="font-semibold text-foreground">
              {report.reporterName}
            </span>
          </p>
          <p>
            الكيان:{" "}
            <span className="font-semibold text-foreground">
              {report.entityId}
            </span>
          </p>
          <p>
            المكلّف:{" "}
            <span className="font-semibold text-foreground">
              {report.assignee ?? "غير مكلّف"}
            </span>
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDetailsOpen(true)}
          >
            <AppIcons.profile className="size-4" />
            تفاصيل البلاغ
          </Button>
          {report.status === "new" && (
            <Button size="sm" onClick={() => onClaim(report.id)}>
              استلام
            </Button>
          )}
          {report.status === "in_progress" && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMoveToWaiting(report.id)}
              >
                بانتظار الرد
              </Button>
              <Button size="sm" onClick={() => onCloseReport(report.id)}>
                إغلاق
              </Button>
            </>
          )}
          {report.status === "waiting_response" && (
            <Button size="sm" onClick={() => onCloseReport(report.id)}>
              إغلاق
            </Button>
          )}
        </div>
      </article>

      <ReportDetailsSheet
        report={report}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onClaim={onClaim}
        onMoveToWaiting={onMoveToWaiting}
        onCloseReport={onCloseReport}
      />
    </>
  );
}
