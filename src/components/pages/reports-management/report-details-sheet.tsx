"use client";

/* eslint-disable @next/next/no-img-element */
import * as React from "react";
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
import { formatUtcDateTime } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import { useAdminReportDetail } from "@/features/admin/reports.services/admin.reports.query";
import {
  reportEntityTypeLabels,
  reportSeverityLabels,
  reportStatusLabels,
  type ReportItem,
} from "./reports-management.types";
import { getSeverityBadgeClass, getStatusBadgeClass, toDisplayName } from "./helpers";
import { CloseReportDialog } from "./close-report-dialog";

const SOURCE_LABELS: Record<string, string> = {
  mobile: "تطبيق الجوال",
  dashboard: "لوحة التحكم",
  web: "الموقع الإلكتروني",
};

const REASON_LABELS: Record<string, string> = {
  misleading: "محتوى مضلل",
  spam: "محتوى مزعج أو متكرر",
  inappropriate: "محتوى غير مناسب",
  harassment: "إساءة أو مضايقة",
  fraud: "احتيال أو تضليل مالي",
  other: "سبب آخر",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  return null;
}

function DetailField({ label, value, dir }: { label: string; value: React.ReactNode; dir?: "rtl" | "ltr" }) {
  return (
    <div className="rounded-lg border border-border/70 bg-muted/20 px-3 py-2.5">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <div dir={dir} className="mt-1 text-sm font-medium text-foreground">
        {value || "—"}
      </div>
    </div>
  );
}

function ReportedEntity({ report }: { report: ReportItem }) {
  const entity = report.entity;
  if (!entity) {
    return <p className="text-xs text-muted-foreground">المحتوى المبلّغ عنه غير متاح حاليًا.</p>;
  }

  const data = entity.data ?? {};
  const images = Array.isArray(data.images)
    ? data.images.filter((value): value is string => typeof value === "string" && value.length > 0)
    : [];
  const body = text(data.content) ?? text(data.description) ?? text(data.body);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {text(data.title) ? <DetailField label="العنوان" value={text(data.title)} /> : null}
        {text(data.name) ? <DetailField label="الاسم" value={text(data.name)} /> : null}
        {text(data.authorName) ? <DetailField label="صاحب المحتوى" value={text(data.authorName)} /> : null}
        {text(data.organizationName) ? <DetailField label="المنظمة" value={text(data.organizationName)} /> : null}
      </div>

      {text(data.summary) ? (
        <div className="rounded-lg border border-border/70 bg-background p-3">
          <p className="mb-1 text-[11px] font-medium text-muted-foreground">الملخص</p>
          <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">{text(data.summary)}</p>
        </div>
      ) : null}

      {body ? (
        <div className="rounded-lg border border-border/70 bg-background p-3">
          <p className="mb-1 text-[11px] font-medium text-muted-foreground">المحتوى</p>
          <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">{body}</p>
        </div>
      ) : null}

      {images.length > 0 ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {images.map((src) => (
            <a key={src} href={src} target="_blank" rel="noreferrer" className="overflow-hidden rounded-lg border border-border bg-muted/20">
              <img src={src} alt="المحتوى المبلّغ عنه" className="h-36 w-full object-cover transition-transform hover:scale-[1.02]" />
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ReportReason({ report }: { report: ReportItem }) {
  const evidence = isRecord(report.evidence) ? report.evidence : null;
  const reasonCode = evidence ? text(evidence.reason) : null;
  const reasonLabel = (evidence ? text(evidence.reasonLabel) : null)
    ?? (reasonCode ? REASON_LABELS[reasonCode] : null)
    ?? report.description
    ?? "—";
  const details = evidence ? text(evidence.details) : null;
  const sourceCode = evidence ? text(evidence.source) : null;
  const sourceLabel = sourceCode ? (SOURCE_LABELS[sourceCode] ?? sourceCode) : null;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <DetailField label="سبب البلاغ" value={reasonLabel} />
        {sourceLabel ? <DetailField label="مصدر البلاغ" value={sourceLabel} /> : null}
      </div>

      {details ? (
        <div className="rounded-lg border border-border/70 bg-background p-3">
          <p className="mb-1 text-[11px] font-medium text-muted-foreground">تفاصيل إضافية من المبلّغ</p>
          <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">{details}</p>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-3 py-3 text-xs text-muted-foreground">
          لم يضف المبلّغ تفاصيل إضافية لهذا البلاغ.
        </p>
      )}
    </div>
  );
}

type Props = {
  report: ReportItem | null;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onClaim: (id: string) => void;
  onCloseReport: (id: string, note: string) => Promise<void>;
  isClaiming: boolean;
  claimingReportId?: string;
  isClosing: boolean;
  closingReportId?: string;
};

export function ReportDetailsSheet(props: Props) {
  const [closeDialogOpen, setCloseDialogOpen] = React.useState(false);
  const query = useAdminReportDetail(props.open ? props.report?.id ?? null : null);
  const report = query.data?.data ?? props.report;

  return (
    <>
      <Sheet open={props.open} onOpenChange={props.onOpenChange}>
        <SheetContent side="right" dir="rtl" className="w-[96vw] overflow-y-auto border-border p-0 sm:max-w-3xl">
          {report ? (
            <div className="flex min-h-full flex-col">
              <SheetHeader className="border-b border-border pe-12 text-right">
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge className={getStatusBadgeClass(report.status)}>{reportStatusLabels[report.status]}</Badge>
                  <Badge className={getSeverityBadgeClass(report.severity)}>{reportSeverityLabels[report.severity]}</Badge>
                  <Badge variant="outline">{reportEntityTypeLabels[report.entityType]}</Badge>
                </div>
                <SheetTitle className="text-right text-lg">{report.title}</SheetTitle>
                <SheetDescription className="text-right leading-6">راجع الأطراف والمحتوى وسبب البلاغ قبل اتخاذ الإجراء المناسب.</SheetDescription>
              </SheetHeader>

              <div className="flex-1 space-y-4 p-4">
                {query.isLoading ? (
                  <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
                    <Loader2 className="me-2 size-4 animate-spin" />
                    جارٍ تحميل تفاصيل البلاغ...
                  </div>
                ) : query.isError ? (
                  <div className="flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
                    <p className="flex-1 text-sm text-destructive">تعذّر تحميل التفاصيل الكاملة للبلاغ.</p>
                    <Button type="button" size="sm" variant="outline" onClick={() => query.refetch()}>إعادة المحاولة</Button>
                  </div>
                ) : null}

                <section className="rounded-xl border border-border bg-card p-4 shadow-xs">
                  <h3 className="mb-3 text-sm font-semibold text-foreground">أطراف البلاغ</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <DetailField label="المبلّغ" value={report.reporter?.name ?? toDisplayName(report.reporterName)} />
                    <DetailField label="المبلّغ عليه" value={report.reportedTarget?.name ?? "—"} />
                    <DetailField label="نوع المبلّغ عليه" value={report.reportedTarget?.type === "organization" ? "منظمة" : report.reportedTarget?.type === "user" ? "مستخدم" : "—"} />
                    <DetailField label="المكلّف بالمعالجة" value={toDisplayName(report.assignee)} />
                    <DetailField label="تاريخ البلاغ" value={formatUtcDateTime(report.createdAt)} />
                    <DetailField label="رقم البلاغ" value={report.id} dir="ltr" />
                  </div>
                </section>

                <section className="rounded-xl border border-border bg-card p-4 shadow-xs">
                  <h3 className="mb-3 text-sm font-semibold text-foreground">المحتوى المبلّغ عنه</h3>
                  <ReportedEntity report={report} />
                </section>

                <section className="rounded-xl border border-border bg-card p-4 shadow-xs">
                  <h3 className="mb-3 text-sm font-semibold text-foreground">سبب وتفاصيل البلاغ</h3>
                  <ReportReason report={report} />
                </section>

                <section className="rounded-xl border border-border bg-card p-4 shadow-xs">
                  <h3 className="mb-3 text-sm font-semibold text-foreground">سجل الإجراءات</h3>
                  {report.timeline?.length ? (
                    <div className="space-y-2">
                      {report.timeline.map((entry, index) => (
                        <div key={entry.id ?? index} className="rounded-lg border border-border/70 bg-muted/20 px-3 py-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-medium text-foreground">{entry.label ?? entry.action ?? entry.status ?? "إجراء"}</p>
                            {entry.at || entry.timestamp ? <p className="text-[11px] text-muted-foreground">{formatUtcDateTime(entry.at ?? entry.timestamp!)}</p> : null}
                          </div>
                          {entry.note ? <p className="mt-1 text-xs leading-6 text-muted-foreground">{entry.note}</p> : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">لا توجد إجراءات إضافية مسجلة بعد.</p>
                  )}
                </section>
              </div>

              <SheetFooter className="sticky bottom-0 border-t border-border bg-background/95 pt-4 backdrop-blur sm:flex-row sm:justify-start">
                {report.status === "new" ? (
                  <Button disabled={props.isClaiming && props.claimingReportId === report.id} onClick={() => props.onClaim(report.id)}>
                    {props.isClaiming && props.claimingReportId === report.id ? <Loader2 className="size-4 animate-spin" /> : null}
                    استلام البلاغ
                  </Button>
                ) : null}
                {report.status === "in_progress" ? (
                  <Button disabled={props.isClosing && props.closingReportId === report.id} onClick={() => setCloseDialogOpen(true)}>
                    إغلاق البلاغ
                  </Button>
                ) : null}
              </SheetFooter>
            </div>
          ) : (
            <div className="flex min-h-60 items-center justify-center p-6 text-sm text-muted-foreground">لا توجد تفاصيل للعرض.</div>
          )}
        </SheetContent>
      </Sheet>

      {report ? (
        <CloseReportDialog
          open={closeDialogOpen}
          onOpenChange={setCloseDialogOpen}
          reportTitle={displayOrDash(report.title)}
          onConfirm={(note) => props.onCloseReport(report.id, note)}
        />
      ) : null}
    </>
  );
}
