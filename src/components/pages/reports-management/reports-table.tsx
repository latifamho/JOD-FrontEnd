"use client";

import { useQueryDisclosure } from "@/hooks/use-query-modal";

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
import { formatUtcDateTime } from "@/lib/date";
import { ReportDetailsSheet } from "@/components/pages/reports-management/report-details-sheet";
import {
  reportEntityTypeLabels,
  reportSeverityLabels,
  reportStatusLabels,
  type ReportItem,
} from "@/components/pages/reports-management/reports-management.types";
import {
  getSeverityBadgeClass,
  getStatusBadgeClass,
  toDisplayName,
} from "@/components/pages/reports-management/helpers";

type ReportsTableProps = {
  reports: ReportItem[];
  onClaim: (reportId: string) => void;
  onCloseReport: (reportId: string, note: string) => Promise<void>;
  isClaiming: boolean;
  claimingReportId?: string;
  isClosing: boolean;
  closingReportId?: string;
};

export function ReportsTable({
  reports,
  onClaim,
  onCloseReport,
  isClaiming,
  claimingReportId,
  isClosing,
  closingReportId,
}: ReportsTableProps) {
  return (
    <div className="rounded-md border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px] text-right font-semibold text-muted-foreground">
              الحالة
            </TableHead>
            <TableHead className="hidden w-[100px] text-right font-semibold text-muted-foreground sm:table-cell">
              الخطورة
            </TableHead>
            <TableHead className="min-w-[220px] text-right font-semibold text-muted-foreground">
              البلاغ
            </TableHead>
            <TableHead className="hidden min-w-[120px] text-right font-semibold text-muted-foreground md:table-cell">
              المبلّغ
            </TableHead>
            <TableHead className="hidden min-w-[120px] text-right font-semibold text-muted-foreground xl:table-cell">
              المكلّف
            </TableHead>
            <TableHead className="w-[110px] text-left font-semibold text-muted-foreground">
              التاريخ
            </TableHead>
            <TableHead className="w-14 text-center font-semibold text-muted-foreground">
              إجراءات
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <ReportRow
              key={report.id}
              report={report}
              onClaim={onClaim}
              onCloseReport={onCloseReport}
              isClaiming={isClaiming}
              claimingReportId={claimingReportId}
              isClosing={isClosing}
              closingReportId={closingReportId}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

type ReportRowProps = {
  report: ReportItem;
  onClaim: (reportId: string) => void;
  onCloseReport: (reportId: string, note: string) => Promise<void>;
  isClaiming: boolean;
  claimingReportId?: string;
  isClosing: boolean;
  closingReportId?: string;
};

function ReportRow({
  report,
  onClaim,
  onCloseReport,
  isClaiming,
  claimingReportId,
  isClosing,
  closingReportId,
}: ReportRowProps) {
  const [detailsOpen, setDetailsOpen] = useQueryDisclosure(`report-details-${report.id}`);
  const isClaimingThis = isClaiming && claimingReportId === report.id;

  return (
    <>
      <TableRow className="group">
        <TableCell className="align-middle text-right">
          <Badge variant="outline" className={getStatusBadgeClass(report.status)}>
            {reportStatusLabels[report.status]}
          </Badge>
        </TableCell>
        <TableCell className="hidden align-middle text-right sm:table-cell">
          <Badge
            variant="outline"
            className={getSeverityBadgeClass(report.severity)}
          >
            {reportSeverityLabels[report.severity]}
          </Badge>
        </TableCell>
        <TableCell className="align-middle text-right">
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-foreground">{report.title}</span>
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {report.description}
            </p>
            <span className="text-xs text-muted-foreground">
              {reportEntityTypeLabels[report.entityType]}
            </span>
          </div>
        </TableCell>
        <TableCell className="hidden align-middle text-right text-sm md:table-cell">
          {toDisplayName(report.reporterName)}
        </TableCell>
        <TableCell className="hidden align-middle text-right text-sm text-muted-foreground xl:table-cell">
          {toDisplayName(report.assignee)}
        </TableCell>
        <TableCell className="align-middle text-left text-xs text-muted-foreground">
          {formatUtcDateTime(report.createdAt)}
        </TableCell>
        <TableCell className="align-middle">
          <TableRowActions
            loading={isClaimingThis}
            actions={[
              {
                id: "details",
                label: "عرض التفاصيل",
                icon: <AppIcons.profile className="size-4" />,
                onSelect: () => setDetailsOpen(true),
              },
              {
                id: "claim",
                label: "استلام",
                icon: <AppIcons.posts className="size-4" />,
                onSelect: () => onClaim(report.id),
                hidden: report.status !== "new",
              },
            ]}
          />
        </TableCell>
      </TableRow>

      <ReportDetailsSheet
        report={detailsOpen ? report : null}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onClaim={onClaim}
        onCloseReport={onCloseReport}
        isClaiming={isClaiming}
        claimingReportId={claimingReportId}
        isClosing={isClosing}
        closingReportId={closingReportId}
      />
    </>
  );
}
