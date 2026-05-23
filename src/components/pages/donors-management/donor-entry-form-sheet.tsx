"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { DonorEntryItem } from "@/components/pages/donors-management/static-data";

export type DonorEntryFormValues = {
  name: string;
  email: string;
  phone: string;
  campaignTitle: string;
  amountOrType: string;
  donatedAt: string;
  city: string;
  source: string;
  paymentMethod: string;
  requestType: string;
  assignedTo: string;
  internalNotes: string;
};

export const EMPTY_DONOR_ENTRY_FORM_VALUES: DonorEntryFormValues = {
  name: "",
  email: "",
  phone: "",
  campaignTitle: "",
  amountOrType: "",
  donatedAt: "",
  city: "",
  source: "",
  paymentMethod: "",
  requestType: "",
  assignedTo: "",
  internalNotes: "",
};

type DonorEntryFormSheetProps = {
  open: boolean;
  mode: "create" | "edit";
  view: "donors" | "applicants";
  initialValues: DonorEntryFormValues;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DonorEntryFormValues) => void;
};

function toDatetimeLocalValue(isoString: string): string {
  if (!isoString) {
    return "";
  }

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (value: number) => String(value).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function fromDatetimeLocalValue(value: string): string {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString();
}

export function donorEntryToFormValues(
  entry: DonorEntryItem,
): DonorEntryFormValues {
  return {
    name: entry.name ?? "",
    email: entry.email ?? "",
    phone: entry.phone ?? "",
    campaignTitle: entry.campaignTitle ?? "",
    amountOrType: entry.amountOrType ?? "",
    donatedAt: entry.donatedAt ?? "",
    city: entry.city ?? "",
    source: entry.source ?? "",
    paymentMethod: entry.paymentMethod ?? "",
    requestType: entry.requestType ?? "",
    assignedTo: entry.assignedTo ?? "",
    internalNotes: entry.internalNotes ?? "",
  };
}

export function donorEntryFromFormValues({
  id,
  view,
  values,
}: {
  id: string;
  view: "donors" | "applicants";
  values: DonorEntryFormValues;
}): DonorEntryItem {
  const isApplicants = view === "applicants";

  const clean = (value: string): string => value.trim();
  const optional = (value: string): string | undefined => {
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  };

  return {
    id,
    name: clean(values.name),
    email: clean(values.email),
    phone: clean(values.phone),
    campaignTitle: clean(values.campaignTitle),
    amountOrType: clean(values.amountOrType),
    donatedAt: values.donatedAt,
    city: optional(values.city),
    source: optional(values.source),
    paymentMethod: isApplicants ? undefined : optional(values.paymentMethod),
    requestType: isApplicants ? optional(values.requestType) : undefined,
    assignedTo: optional(values.assignedTo),
    internalNotes: optional(values.internalNotes),
  };
}

export function DonorEntryFormSheet({
  open,
  mode,
  view,
  initialValues,
  onOpenChange,
  onSubmit,
}: DonorEntryFormSheetProps) {
  const [formValues, setFormValues] =
    React.useState<DonorEntryFormValues>(initialValues);

  React.useEffect(() => {
    if (open) {
      setFormValues(initialValues);
    }
  }, [initialValues, open]);

  const isApplicants = view === "applicants";
  const title =
    mode === "create"
      ? isApplicants
        ? "إضافة متقدم"
        : "إضافة متبرع"
      : isApplicants
        ? "تعديل بيانات المتقدم"
        : "تعديل بيانات المتبرع";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" dir="rtl" className="w-[95vw] border-border p-0 sm:max-w-lg">
        <form
          className="flex h-full flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit({
              ...formValues,
              donatedAt: formValues.donatedAt,
              name: formValues.name.trim(),
              email: formValues.email.trim(),
              phone: formValues.phone.trim(),
              campaignTitle: formValues.campaignTitle.trim(),
              amountOrType: formValues.amountOrType.trim(),
              city: formValues.city.trim(),
              source: formValues.source.trim(),
              paymentMethod: formValues.paymentMethod.trim(),
              requestType: formValues.requestType.trim(),
              assignedTo: formValues.assignedTo.trim(),
              internalNotes: formValues.internalNotes.trim(),
            });
            onOpenChange(false);
          }}
        >
          <SheetHeader className="border-b border-border pe-12 text-right">
            <SheetTitle className="text-right text-lg">{title}</SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="space-y-2">
              <Label htmlFor="entry-name">الاسم الكامل</Label>
              <Input
                id="entry-name"
                required
                value={formValues.name}
                onChange={(event) =>
                  setFormValues((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="أدخل الاسم"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="entry-email">البريد الإلكتروني</Label>
                <Input
                  id="entry-email"
                  type="email"
                  required
                  value={formValues.email}
                  onChange={(event) =>
                    setFormValues((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry-phone">رقم الهاتف</Label>
                <Input
                  id="entry-phone"
                  required
                  value={formValues.phone}
                  onChange={(event) =>
                    setFormValues((current) => ({ ...current, phone: event.target.value }))
                  }
                  placeholder="+9665XXXXXXXX"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entry-campaign">اسم الحملة / الفرصة</Label>
              <Input
                id="entry-campaign"
                required
                value={formValues.campaignTitle}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    campaignTitle: event.target.value,
                  }))
                }
                placeholder="مثال: كسوة الشتاء"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="entry-amount">
                  {isApplicants ? "الحالة" : "المبلغ / النوع"}
                </Label>
                <Input
                  id="entry-amount"
                  required
                  value={formValues.amountOrType}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      amountOrType: event.target.value,
                    }))
                  }
                  placeholder={isApplicants ? "قيد المراجعة" : "500 ر.س أو تبرع عيني"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry-date">
                  {isApplicants ? "تاريخ التقديم" : "تاريخ التبرع"}
                </Label>
                <Input
                  id="entry-date"
                  type="datetime-local"
                  required
                  value={toDatetimeLocalValue(formValues.donatedAt)}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      donatedAt: fromDatetimeLocalValue(event.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="entry-city">المدينة / المنطقة</Label>
                <Input
                  id="entry-city"
                  value={formValues.city}
                  onChange={(event) =>
                    setFormValues((current) => ({ ...current, city: event.target.value }))
                  }
                  placeholder="اختياري"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry-assigned">مسؤول المتابعة</Label>
                <Input
                  id="entry-assigned"
                  value={formValues.assignedTo}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      assignedTo: event.target.value,
                    }))
                  }
                  placeholder="اختياري"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entry-source">مصدر التسجيل</Label>
              <Input
                id="entry-source"
                value={formValues.source}
                onChange={(event) =>
                  setFormValues((current) => ({ ...current, source: event.target.value }))
                }
                placeholder="اختياري"
              />
            </div>

            {isApplicants ? (
              <div className="space-y-2">
                <Label htmlFor="entry-request">نوع الطلب</Label>
                <Input
                  id="entry-request"
                  value={formValues.requestType}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      requestType: event.target.value,
                    }))
                  }
                  placeholder="اختياري"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="entry-payment">وسيلة الدفع</Label>
                <Input
                  id="entry-payment"
                  value={formValues.paymentMethod}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      paymentMethod: event.target.value,
                    }))
                  }
                  placeholder="اختياري"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="entry-notes">ملاحظات داخلية</Label>
              <Textarea
                id="entry-notes"
                value={formValues.internalNotes}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    internalNotes: event.target.value,
                  }))
                }
                placeholder="اختياري"
              />
            </div>
          </div>

          <SheetFooter className="flex-row-reverse gap-2 border-t border-border p-4">
            <Button type="submit">{mode === "create" ? "إضافة" : "حفظ التعديلات"}</Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

