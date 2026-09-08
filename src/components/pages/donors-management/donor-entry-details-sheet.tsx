"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatUtcDateTimeOrDash } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import { syrianGovernorateLabel } from "@/components/pages/organization-campaigns/static-data";
import { toast } from "@/lib/toast";
import {
  applicantStatusLabels,
  type DonorEntryItem,
} from "@/components/pages/donors-management/static-data";
import { useOrgApplicant, useOrgApplicantWorkflowAction, useOrgDonationWorkflowAction, useOrgDonor } from "@/features/org/donors/org.donors.query";

const donorStatusLabels: Record<string, string> = {
  pending: "بانتظار الموافقة",
  accepted: "تم قبول الطلب",
  contacting: "جاري التواصل",
  agreed: "تم الاتفاق",
  completed: "تم التبرع",
  cancelled: "ملغي",
};

const contactMethodLabels: Record<string, string> = {
  phone: "اتصال هاتفي",
  whatsapp: "واتساب",
  email: "بريد إلكتروني",
  other: "طريقة أخرى",
};

const paymentMethodLabels: Record<string, string> = {
  bank_transfer: "تحويل بنكي",
  cash: "نقداً",
  other: "طريقة أخرى",
};

type DonorEntryDetailsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: DonorEntryItem | null;
  view: "donors" | "applicants";
  canManage?: boolean;
};

function Field({ label, value, dir }: { label: string; value: React.ReactNode; dir?: "ltr" | "rtl" }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="text-sm font-medium text-foreground" dir={dir}>{value}</div>
    </div>
  );
}

function Step({ label, date, active }: { label: string; date?: string | null; active: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 text-xs">
      <span className={active ? "font-medium text-primary" : "text-muted-foreground"}>{active ? "✓" : "○"} {label}</span>
      <span className="text-muted-foreground">{date ? formatUtcDateTimeOrDash(date) : ""}</span>
    </div>
  );
}

function formatAmount(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return "—";
  const number = Number(value);
  return Number.isFinite(number) ? `${number.toLocaleString("en-US")} ل.س` : String(value);
}

export function DonorEntryDetailsSheet({ open, onOpenChange, entry, view, canManage = false }: DonorEntryDetailsSheetProps) {
  const isApplicants = view === "applicants";
  const donorDetailQuery = useOrgDonor(!isApplicants && open ? entry?.id ?? null : null);
  const applicantDetailQuery = useOrgApplicant(isApplicants && open ? entry?.id ?? null : null);
  const workflow = useOrgDonationWorkflowAction();
  const applicantWorkflow = useOrgApplicantWorkflowAction();
  const donor = (isApplicants ? applicantDetailQuery.data?.data : donorDetailQuery.data?.data) ?? entry;
  const [confirmedAmount, setConfirmedAmount] = React.useState("");
  const [cancelReason, setCancelReason] = React.useState("");

  React.useEffect(() => {
    if (open && donor) {
      setConfirmedAmount(String(donor.confirmedAmount ?? donor.requestedAmount ?? donor.amount ?? ""));
      setCancelReason("");
    }
  }, [open, donor?.id, donor?.confirmedAmount, donor?.requestedAmount, donor?.amount]);

  if (!entry || !donor) return null;

  const run = async (
    action: "accept" | "contact" | "agree" | "complete" | "cancel",
    options?: { amount?: number; reason?: string },
  ) => {
    try {
      await workflow.mutateAsync({ donorId: donor.id, action, ...options });
      toast.success(
        action === "accept" ? "تم قبول طلب التبرع." :
        action === "contact" ? "تم تسجيل بدء التواصل." :
        action === "agree" ? "تم تسجيل الاتفاق على التبرع." :
        action === "complete" ? "تم تأكيد استلام التبرع واحتساب المبلغ." :
        "تم إلغاء طلب التبرع.",
      );
    } catch {
      toast.error("تعذر تنفيذ الإجراء. حدّث البيانات وحاول مرة أخرى.");
    }
  };

  const runApplicant = async (action: "accept" | "contact" | "complete" | "reject") => {
    try {
      await applicantWorkflow.mutateAsync({ applicantId: donor.id, action });
      toast.success(
        action === "accept" ? "تم قبول طلب التطوع." :
        action === "contact" ? "تم تسجيل بدء التواصل مع المتطوع." :
        action === "complete" ? "تم تأكيد اكتمال المشاركة التطوعية." :
        "تم رفض طلب التطوع.",
      );
    } catch {
      toast.error("تعذر تنفيذ الإجراء. حدّث البيانات وحاول مرة أخرى.");
    }
  };

  const amountNumber = Number(confirmedAmount);
  const canCompleteAmount = Number.isFinite(amountNumber) && amountNumber > 0;
  const applicantStatus = donor.applicantStatus ?? "pending";
  const applicantProgress = ["pending", "under_review", "accepted", "approved", "contacting", "completed"];
  const applicantRank = Math.max(0, applicantProgress.indexOf(applicantStatus));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" dir="rtl" className="w-[95vw] border-border p-0 sm:max-w-xl">
        <SheetHeader className="border-b border-border pe-12 text-right">
          <SheetTitle className="text-right text-xl">{isApplicants ? "بيانات المتقدم" : "تفاصيل طلب التبرع"}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-6 pt-4 sm:px-5">
        <div className="grid gap-5 rounded-lg border border-border p-4 sm:grid-cols-2">
          <Field label="الاسم الكامل" value={displayOrDash(donor.name)} />
          <Field label="رقم الهاتف" value={displayOrDash(donor.phone)} dir="ltr" />
          {isApplicants ? (
            <>
              <Field label="اسم الحملة" value={displayOrDash(donor.campaignTitle)} />
              <Field label="الحالة" value={donor.applicantStatus ? applicantStatusLabels[donor.applicantStatus] ?? donor.applicantStatus : "—"} />
              <Field label="تاريخ التقديم" value={formatUtcDateTimeOrDash(donor.appliedAt)} />
            </>
          ) : (
            <>
              <Field label="البريد الإلكتروني" value={displayOrDash(donor.email)} dir="ltr" />
              <Field label="الحملة" value={displayOrDash(donor.campaignTitle)} />
              <Field label="الحالة" value={<Badge variant={donor.status === "completed" ? "default" : donor.status === "cancelled" ? "destructive" : "outline"}>{donor.status ? donorStatusLabels[donor.status] ?? donor.status : "—"}</Badge>} />
              <Field label="المبلغ الذي طلب المستخدم التبرع به" value={formatAmount(donor.requestedAmount ?? donor.amount)} />
              <Field label="المبلغ المؤكد استلامه" value={formatAmount(donor.confirmedAmount)} />
              <Field label="طريقة التواصل" value={donor.contactMethod ? contactMethodLabels[donor.contactMethod] ?? donor.contactMethod : "—"} />
              <Field label="طريقة الدفع" value={donor.paymentMethod ? paymentMethodLabels[donor.paymentMethod] ?? donor.paymentMethod : "—"} />
              <Field label="المحافظة" value={displayOrDash(syrianGovernorateLabel(donor.city))} />
            </>
          )}
        </div>

        {isApplicants ? (
          <>
            <div className="mt-4 space-y-3 rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold">مسار طلب التطوع</h3>
              <Step label="تم إرسال طلب التطوع" date={donor.appliedAt} active />
              <Step label="تم قبول الطلب من المنظمة" active={applicantRank >= 2 && !["rejected", "withdrawn"].includes(applicantStatus)} />
              <Step label="تم بدء التواصل" active={applicantRank >= 4 && !["rejected", "withdrawn"].includes(applicantStatus)} />
              <Step label="اكتملت المشاركة التطوعية" active={applicantStatus === "completed"} />
              {applicantStatus === "rejected" ? <p className="text-xs text-destructive">تم رفض طلب التطوع.</p> : null}
              {applicantStatus === "withdrawn" ? <p className="text-xs text-muted-foreground">انسحب المستخدم من طلب التطوع.</p> : null}
            </div>

            <div className="mt-4 space-y-2 rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold">إجراءات المنظمة</h3>
              {canManage && donor.can?.accept ? <Button className="w-full" disabled={applicantWorkflow.isPending} onClick={() => void runApplicant("accept")}>قبول طلب التطوع</Button> : null}
              {canManage && donor.can?.contact ? <Button className="w-full" disabled={applicantWorkflow.isPending} onClick={() => void runApplicant("contact")}>بدء التواصل مع المتطوع</Button> : null}
              {canManage && donor.can?.complete ? <Button className="w-full" disabled={applicantWorkflow.isPending} onClick={() => void runApplicant("complete")}>تأكيد اكتمال التطوع</Button> : null}
              {canManage && donor.can?.reject ? <Button className="w-full" variant="destructive" disabled={applicantWorkflow.isPending} onClick={() => void runApplicant("reject")}>رفض الطلب</Button> : null}
              {!canManage ? <p className="text-xs text-muted-foreground">يمكنك عرض التفاصيل فقط حسب صلاحياتك الحالية.</p> : !donor.can?.accept && !donor.can?.contact && !donor.can?.complete && !donor.can?.reject ? <p className="text-xs text-muted-foreground">لا توجد إجراءات مطلوبة لهذه الحالة.</p> : null}
            </div>
          </>
        ) : null}

        {!isApplicants && donor.targetType === "campaign" ? (
          <>
            <div className="mt-4 space-y-3 rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold">مسار طلب التبرع</h3>
              <Step label="تم إرسال طلب التبرع" date={donor.createdAt} active={Boolean(donor.createdAt)} />
              <Step label="تم قبول الطلب من المنظمة" date={donor.acceptedAt} active={Boolean(donor.acceptedAt)} />
              <Step label="تم بدء التواصل" date={donor.contactedAt} active={Boolean(donor.contactedAt)} />
              <Step label="تم الاتفاق" date={donor.agreedAt} active={Boolean(donor.agreedAt)} />
              <Step label="تم تأكيد استلام التبرع" date={donor.completedAt} active={Boolean(donor.completedAt)} />
              {donor.cancelledAt ? <Step label={`تم الإلغاء${donor.cancelReason ? `: ${donor.cancelReason}` : ""}`} date={donor.cancelledAt} active /> : null}
            </div>

            <div className="mt-4 space-y-3 rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold">الإجراءات</h3>
              {canManage && donor.can?.accept ? <Button className="w-full" disabled={workflow.isPending} onClick={() => void run("accept")}>قبول طلب التبرع</Button> : null}
              {canManage && donor.can?.contact ? <Button className="w-full" disabled={workflow.isPending} onClick={() => void run("contact")}>تم بدء التواصل</Button> : null}
              {canManage && donor.can?.agree ? <Button className="w-full" disabled={workflow.isPending} onClick={() => void run("agree")}>تم التوصل لاتفاق</Button> : null}
              {canManage && donor.can?.complete ? (
                <div className="space-y-2 rounded-md bg-muted/30 p-3">
                  <label className="text-xs font-medium">المبلغ الذي استلمته المنظمة فعلياً</label>
                  <Input dir="ltr" inputMode="decimal" value={confirmedAmount} onChange={(event) => setConfirmedAmount(event.target.value)} placeholder="0" />
                  <Button className="w-full" disabled={workflow.isPending || !canCompleteAmount} onClick={() => void run("complete", { amount: amountNumber })}>تأكيد استلام التبرع</Button>
                </div>
              ) : null}
              {canManage && donor.can?.cancel ? (
                <div className="space-y-2 border-t border-border pt-3">
                  <Input value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} placeholder="سبب الإلغاء" />
                  <Button className="w-full" variant="destructive" disabled={workflow.isPending || cancelReason.trim().length === 0} onClick={() => void run("cancel", { reason: cancelReason.trim() })}>إلغاء طلب التبرع</Button>
                </div>
              ) : null}
              {!canManage ? (
                <p className="text-xs text-muted-foreground">يمكنك عرض التفاصيل فقط حسب صلاحياتك الحالية.</p>
              ) : !donor.can?.accept && !donor.can?.contact && !donor.can?.agree && !donor.can?.complete && !donor.can?.cancel ? (
                <p className="text-xs text-muted-foreground">لا توجد إجراءات مطلوبة لهذه الحالة.</p>
              ) : null}
            </div>
          </>
        ) : null}

        {!isApplicants && donor.isAnonymous ? (
          <div className="mt-4 space-y-1 rounded-lg border border-dashed border-border p-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">الخصوصية العامة</span>
              <Badge variant="secondary">مجهول علنًا</Badge>
            </div>
            <p className="text-xs text-muted-foreground">بيانات المتبرع متاحة لكم للتواصل وإدارة الطلب، لكن لا يجب إظهار هويته في أي محتوى عام.</p>
          </div>
        ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
