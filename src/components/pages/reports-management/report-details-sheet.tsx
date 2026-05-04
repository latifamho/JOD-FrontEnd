"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { formatUtcDateTime } from "@/lib/date";

type ReportDetailsSheetProps = {
  report: ReportItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClaim: (reportId: string) => void;
  onMoveToWaiting: (reportId: string) => void;
  onCloseReport: (reportId: string) => void;
};

export function ReportDetailsSheet({
  report,
  open,
  onOpenChange,
  onClaim,
  onMoveToWaiting,
  onCloseReport,
}: ReportDetailsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        dir="rtl"
        className="w-[95vw] border-border p-0 sm:max-w-2xl"
      >
        {report ? (
          <>
            <SheetHeader className="border-b border-border pe-12 text-right">
              <div className="mb-2 flex flex-wrap items-center justify-start gap-2">
                <Badge variant="outline" className={getStatusBadgeClass(report.status)}>
                  {reportStatusLabels[report.status]}
                </Badge>
                <Badge
                  variant="outline"
                  className={getSeverityBadgeClass(report.severity)}
                >
                  {reportSeverityLabels[report.severity]}
                </Badge>
                <Badge variant="outline">{reportEntityTypeLabels[report.entityType]}</Badge>
                <Badge variant="outline">{report.id}</Badge>
              </div>
              <SheetTitle className="text-right text-lg">{report.title}</SheetTitle>
              <SheetDescription className="text-right">
                {report.description}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-4 overflow-y-auto p-4">
              <section className="rounded-lg border border-border bg-muted/30 p-3">
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  تفاصيل البلاغ
                </h3>
                <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                  <p>
                    الكيان المبلغ عنه:{" "}
                    <span className="font-semibold text-foreground">
                      {report.entityId}
                    </span>
                  </p>
                  <p>
                    المنظمة:{" "}
                    <span className="font-semibold text-foreground">
                      {report.organizationName}
                    </span>
                  </p>
                  <p>
                    المبلغ:{" "}
                    <span className="font-semibold text-foreground">
                      {report.reporterName}
                    </span>
                  </p>
                  <p>
                    تاريخ الإنشاء:{" "}
                    <span className="font-semibold text-foreground">
                      {formatUtcDateTime(report.createdAt)}
                    </span>
                  </p>
                  <p>
                    المكلّف الحالي:{" "}
                    <span className="font-semibold text-foreground">
                      {report.assignee ?? "غير مكلّف"}
                    </span>
                  </p>
                </div>
              </section>

              <section className="rounded-lg border border-border p-3">
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  الأدلة المرفقة
                </h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {report.evidence.map((evidenceItem) => (
                    <li
                      key={evidenceItem.id}
                      className="rounded-md border border-border bg-muted/30 px-3 py-2"
                    >
                      <p className="font-semibold text-foreground">
                        {evidenceItem.label}
                      </p>
                      <p className="mt-1">
                        النوع:{" "}
                        <span className="font-medium text-foreground">
                          {evidenceItem.type}
                        </span>
                      </p>
                      <p className="mt-1 break-all">{evidenceItem.value}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-lg border border-border p-3">
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  سجل الإجراءات
                </h3>
                <ul className="space-y-2">
                  {report.timeline.map((entry) => (
                    <li
                      key={entry.id}
                      className="rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground"
                    >
                      <p className="font-semibold text-foreground">{entry.action}</p>
                      <p className="mt-1">المنفذ: {entry.actor}</p>
                      <p className="mt-1">الوقت: {formatUtcDateTime(entry.at)}</p>
                      {entry.note && <p className="mt-1">ملاحظة: {entry.note}</p>}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
              {report.status === "new" && (
                <Button onClick={() => onClaim(report.id)}>استلام البلاغ</Button>
              )}
              {report.status === "in_progress" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => onMoveToWaiting(report.id)}
                  >
                    بانتظار الرد
                  </Button>
                  <Button onClick={() => onCloseReport(report.id)}>إغلاق البلاغ</Button>
                </>
              )}
              {report.status === "waiting_response" && (
                <Button onClick={() => onCloseReport(report.id)}>إغلاق البلاغ</Button>
              )}
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
