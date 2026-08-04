"use client";

import * as React from "react";
import { useQueryDisclosure } from "@/hooks/use-query-modal";

import { Loader2 } from "lucide-react";

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
} from "@/components/pages/reports-management/reports-management.types";
import {
  getSeverityBadgeClass,
  getStatusBadgeClass,
  toDisplayName,
} from "@/components/pages/reports-management/helpers";
import { formatUtcDateTime } from "@/lib/date";
import {
  useAdminReportDetail,
  useWaitReport,
} from "@/features/admin/reports.services/admin.reports.query";
import { RequestInfoDialog } from "@/components/pages/reports-management/request-info-dialog";
import { CloseReportDialog } from "@/components/pages/reports-management/close-report-dialog";

type ReportDetailsSheetProps = {
  report: ReportItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClaim: (reportId: string) => void;
  onCloseReport: (reportId: string, note: string) => Promise<void>;
  isClaiming: boolean;
  claimingReportId?: string;
  isClosing: boolean;
  closingReportId?: string;
};

export function ReportDetailsSheet({
  report,
  open,
  onOpenChange,
  onClaim,
  onCloseReport,
  isClaiming,
  claimingReportId,
  isClosing,
  closingReportId,
}: ReportDetailsSheetProps) {
  const [requestInfoOpen, setRequestInfoOpen] = useQueryDisclosure(
    "report-request-info",
    { queryKey: "dialog" },
  );
  const [closeDialogOpen, setCloseDialogOpen] = useQueryDisclosure(
    "report-close",
    { queryKey: "dialog" },
  );
  const { data: detailData } = useAdminReportDetail(open ? report?.id ?? null : null);
  const activeReport = detailData?.data ?? report;
  const waitMutation = useWaitReport();
  const isClaimingThis =
    !!activeReport && isClaiming && claimingReportId === activeReport.id;
  const isClosingThis =
    !!activeReport && isClosing && closingReportId === activeReport.id;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        dir="rtl"
        className="w-[95vw] border-border p-0 sm:max-w-2xl"
      >
        {activeReport ? (
          <>
            <SheetHeader className="border-b border-border pe-12 text-right">
              <div className="mb-2 flex flex-wrap items-center justify-start gap-2">
                <Badge variant="outline" className={getStatusBadgeClass(activeReport.status)}>
                  {reportStatusLabels[activeReport.status]}
                </Badge>
                <Badge
                  variant="outline"
                  className={getSeverityBadgeClass(activeReport.severity)}
                >
                  {reportSeverityLabels[activeReport.severity]}
                </Badge>
                <Badge variant="outline">{reportEntityTypeLabels[activeReport.entityType]}</Badge>
                <Badge variant="outline">{activeReport.id}</Badge>
              </div>
              <SheetTitle className="text-right text-lg">{activeReport.title}</SheetTitle>
              <SheetDescription className="text-right">
                {activeReport.description}
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
                      {activeReport.entityId}
                    </span>
                  </p>
                  <p>
                    المنظمة:{" "}
                    <span className="font-semibold text-foreground">
                      {toDisplayName(activeReport.organizationName)}
                    </span>
                  </p>
                  <p>
                    المبلغ:{" "}
                    <span className="font-semibold text-foreground">
                      {toDisplayName(activeReport.reporterName)}
                    </span>
                  </p>
                  <p>
                    تاريخ الإنشاء:{" "}
                    <span className="font-semibold text-foreground">
                      {formatUtcDateTime(activeReport.createdAt)}
                    </span>
                  </p>
                  <p>
                    المكلّف الحالي:{" "}
                    <span className="font-semibold text-foreground">
                      {toDisplayName(activeReport.assignee)}
                    </span>
                  </p>
                </div>
              </section>

              <section className="rounded-lg border border-border p-3">
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  الأدلة المرفقة
                </h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {(Array.isArray(activeReport.evidence) ? activeReport.evidence : []).map((evidenceItem) => (
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
                      {/^https?:\/\//i.test(evidenceItem.value) ? (
                        <a
                          href={evidenceItem.value}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 block break-all text-primary underline-offset-4 hover:underline"
                        >
                          فتح الدليل
                        </a>
                      ) : (
                        <p className="mt-1 break-all">{evidenceItem.value}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-lg border border-border p-3">
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  سجل الإجراءات
                </h3>
                <ul className="space-y-2">
                  {(Array.isArray(activeReport.timeline) ? activeReport.timeline : []).map(
                    (entry, index) => (
                      <li
                        key={entry.id ?? `${entry.action}-${entry.at}-${index}`}
                        className="rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground"
                      >
                        <p className="font-semibold text-foreground">
                          {entry.label ?? entry.action}
                        </p>
                        <p className="mt-1">
                          المنفذ: {entry.by ?? entry.actor ?? "-"}
                        </p>
                        <p className="mt-1">الوقت: {formatUtcDateTime(entry.at)}</p>
                        {entry.note && <p className="mt-1">ملاحظة: {entry.note}</p>}
                      </li>
                    ),
                  )}
                </ul>
              </section>
            </div>

            <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
              {activeReport.status === "new" && (
                <Button
                  disabled={isClaimingThis}
                  onClick={() => onClaim(activeReport.id)}
                >
                  {isClaimingThis && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  استلام البلاغ
                </Button>
              )}
              {activeReport.status === "in_progress" && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={waitMutation.isPending}
                  onClick={() => setRequestInfoOpen(true)}
                >
                  طلب معلومات إضافية
                </Button>
              )}
              {(activeReport.status === "in_progress" ||
                activeReport.status === "waiting_response") && (
                <Button
                  disabled={isClosingThis}
                  onClick={() => setCloseDialogOpen(true)}
                >
                  {isClosingThis && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  إغلاق البلاغ
                </Button>
              )}
            </SheetFooter>
            <RequestInfoDialog
              open={requestInfoOpen}
              onOpenChange={setRequestInfoOpen}
              reportTitle={activeReport.title}
              onConfirm={async (note) => {
                await waitMutation.mutateAsync({
                  reportId: activeReport.id,
                  body: { note },
                });
              }}
            />
            <CloseReportDialog
              open={closeDialogOpen}
              onOpenChange={setCloseDialogOpen}
              reportTitle={activeReport.title}
              onConfirm={(note) => onCloseReport(activeReport.id, note)}
            />
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
