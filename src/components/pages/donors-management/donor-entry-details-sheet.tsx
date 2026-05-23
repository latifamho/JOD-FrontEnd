"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AppIcons } from "@/constant/icons";
import { formatUtcDateTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { DonorEntryItem } from "@/components/pages/donors-management/static-data";

type DonorEntryDetailsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: DonorEntryItem | null;
  view: "donors" | "applicants";
};

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <h3 className="mb-3 flex items-center gap-2 border-b border-border pb-2 text-sm font-semibold text-foreground">
      <Icon className="size-4 shrink-0 text-primary" />
      {children}
    </h3>
  );
}

function Field({
  label,
  value,
  className,
  dir,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div
        className="text-sm font-medium leading-relaxed text-foreground"
        dir={dir}
      >
        {value}
      </div>
    </div>
  );
}

export function DonorEntryDetailsSheet({
  open,
  onOpenChange,
  entry,
  view,
}: DonorEntryDetailsSheetProps) {
  if (!entry) {
    return null;
  }

  const isApplicants = view === "applicants";
  const amountLabel = isApplicants ? "حالة الطلب" : "المبلغ أو نوع التبرع";
  const dateLabel = isApplicants ? "تاريخ التقديم" : "تاريخ التبرع";
  const midLabel = isApplicants ? "نوع الطلب" : "وسيلة الدفع";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        dir="rtl"
        className="flex w-[95vw] flex-col border-border p-0 sm:max-w-xl"
      >
        <SheetHeader className="border-b border-border bg-muted/20 px-4 py-5 pe-14 text-right sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <div
              className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-2xl font-bold text-primary"
              aria-hidden
            >
              {entry.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {entry.id}
                </Badge>
                <Badge
                  variant="secondary"
                  className={cn(
                    isApplicants
                      ? "bg-sky-500/15 text-sky-700 dark:text-sky-300"
                      : "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
                  )}
                >
                  {isApplicants ? "متقدم" : "متبرع"}
                </Badge>
                {entry.campaignRef ? (
                  <Badge variant="outline" className="text-xs">
                    حملة {entry.campaignRef}
                  </Badge>
                ) : null}
              </div>
              <SheetTitle className="text-right text-xl leading-snug sm:text-2xl">
                {entry.name}
              </SheetTitle>
              <SheetDescription className="text-right text-sm text-muted-foreground">
                {entry.email}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5 sm:px-6">
          {/* تواصل */}
          <section className="rounded-xl border border-border bg-card/60 p-4 shadow-sm">
            <SectionTitle icon={AppIcons.mail}>بيانات التواصل</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="البريد الإلكتروني" value={entry.email} />
              <Field
                label="رقم الجوال"
                value={entry.phone}
                dir="ltr"
                className="sm:text-end"
              />
              {entry.city ? (
                <Field label="المدينة / المنطقة" value={entry.city} />
              ) : null}
              {entry.source ? (
                <Field
                  className="sm:col-span-2"
                  label="مصدر التسجيل"
                  value={entry.source}
                />
              ) : null}
            </div>
          </section>

          {/* حملة ومساهمة */}
          <section className="rounded-xl border border-border bg-card/60 p-4 shadow-sm">
            <SectionTitle icon={AppIcons.campaigns}>
              {isApplicants ? "الفرصة والطلب" : "الحملة والمساهمة"}
            </SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                className="sm:col-span-2"
                label="اسم الحملة أو الفرصة"
                value={entry.campaignTitle}
              />
              <Field label={amountLabel} value={entry.amountOrType} />
              <Field
                label={dateLabel}
                value={formatUtcDateTime(entry.donatedAt)}
              />
              {!isApplicants ? (
                <Field
                  label={midLabel}
                  value={entry.paymentMethod ?? "—"}
                />
              ) : (
                <Field
                  label={midLabel}
                  value={entry.requestType ?? "—"}
                />
              )}
            </div>
          </section>

          {/* تتبع داخلي */}
          <section className="rounded-xl border border-dashed border-border bg-muted/25 p-4">
            <SectionTitle icon={AppIcons.staff}>تتبع داخلي</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {entry.assignedTo ? (
                <Field label="مسؤول المتابعة" value={entry.assignedTo} />
              ) : (
                <Field label="مسؤول المتابعة" value="—" />
              )}
            </div>
          </section>

          {/* ملاحظات */}
          {entry.internalNotes ? (
            <section className="rounded-xl border border-border bg-amber-500/5 p-4 dark:bg-amber-500/10">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <AppIcons.content className="size-4 text-amber-700 dark:text-amber-400" />
                ملاحظات للفريق
              </div>
              <p className="text-sm leading-7 text-foreground/90">
                {entry.internalNotes}
              </p>
            </section>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
