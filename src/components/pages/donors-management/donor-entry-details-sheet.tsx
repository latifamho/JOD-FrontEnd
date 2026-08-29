"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { formatUtcDateTimeOrDash } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import {
  applicantStatusLabels,
  type DonorEntryItem,
} from "@/components/pages/donors-management/static-data";

type DonorEntryDetailsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: DonorEntryItem | null;
  view: "donors" | "applicants";
};

function Field({ label, value, dir }: { label: string; value: React.ReactNode; dir?: "ltr" | "rtl" }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground" dir={dir}>{value}</p>
    </div>
  );
}

export function DonorEntryDetailsSheet({ open, onOpenChange, entry, view }: DonorEntryDetailsSheetProps) {
  if (!entry) return null;
  const isApplicants = view === "applicants";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" dir="rtl" className="w-[95vw] border-border sm:max-w-lg">
        <SheetHeader className="text-right">
          <SheetTitle className="text-right">{isApplicants ? "بيانات المتقدم" : "بيانات المتبرع"}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 grid gap-5 rounded-lg border border-border p-4 sm:grid-cols-2">
          <Field label="الاسم الكامل" value={displayOrDash(entry.name)} />
          <Field label="رقم الهاتف" value={displayOrDash(entry.phone)} dir="ltr" />
          {isApplicants ? (
            <>
              <Field label="اسم الحملة" value={displayOrDash(entry.campaignTitle)} />
              <Field label="الحالة" value={entry.applicantStatus ? applicantStatusLabels[entry.applicantStatus] ?? entry.applicantStatus : "—"} />
              <Field label="تاريخ التقديم" value={formatUtcDateTimeOrDash(entry.appliedAt)} />
            </>
          ) : (
            <>
              <Field label="البريد الإلكتروني" value={displayOrDash(entry.email)} dir="ltr" />
              <Field label="المحافظة" value={displayOrDash(entry.city)} />
            </>
          )}
        </div>
        {!isApplicants && entry.isAnonymous ? (
          <div className="mt-4 space-y-1 rounded-lg border border-dashed border-border p-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">الخصوصية العامة</span>
              <Badge variant="secondary">مجهول علنًا</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              بيانات المتبرع أعلاه متاحة لكم لإدارة التبرع والتواصل معه، لكن لا يجب إظهار هويته في
              أي محتوى عام.
            </p>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
