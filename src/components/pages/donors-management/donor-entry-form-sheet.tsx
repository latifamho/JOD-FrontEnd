"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { syrianGovernorateOptions } from "@/components/pages/organization-campaigns/static-data";
import {
  applicantStatusOptions,
  type DonorEntryItem,
} from "@/components/pages/donors-management/static-data";

export type DonorEntryFormValues = {
  name: string;
  email: string;
  phone: string;
  city: string;
  campaignTitle: string;
  applicantStatus: string;
  appliedAt: string;
};

export const EMPTY_DONOR_ENTRY_FORM_VALUES: DonorEntryFormValues = {
  name: "",
  email: "",
  phone: "",
  city: "",
  campaignTitle: "",
  applicantStatus: "pending",
  appliedAt: "",
};

type DonorEntryFormSheetProps = {
  open: boolean;
  mode: "create" | "edit";
  view: "donors" | "applicants";
  initialValues: DonorEntryFormValues;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DonorEntryFormValues) => void;
};

const phonePattern = /^09\d{8}$/;

function createSchema(view: "donors" | "applicants") {
  return z
    .object({
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      city: z.string(),
      campaignTitle: z.string(),
      applicantStatus: z.string(),
      appliedAt: z.string(),
    })
    .superRefine((values, context) => {
      if (!values.name.trim()) {
        context.addIssue({ code: "custom", path: ["name"], message: "الاسم الكامل مطلوب" });
      }

      if (!phonePattern.test(values.phone.trim())) {
        context.addIssue({
          code: "custom",
          path: ["phone"],
          message: "رقم الهاتف يجب أن يكون 10 أرقام ويبدأ بـ 09",
        });
      }

      if (view === "donors") {
        if (!values.email.trim()) {
          context.addIssue({ code: "custom", path: ["email"], message: "البريد الإلكتروني مطلوب" });
        } else if (!z.string().email().safeParse(values.email.trim()).success) {
          context.addIssue({ code: "custom", path: ["email"], message: "أدخل بريدًا إلكترونيًا صحيحًا" });
        }

        if (!syrianGovernorateOptions.some((option) => option.value === values.city)) {
          context.addIssue({ code: "custom", path: ["city"], message: "المحافظة مطلوبة" });
        }
        return;
      }

      if (!values.campaignTitle.trim()) {
        context.addIssue({ code: "custom", path: ["campaignTitle"], message: "اسم الحملة مطلوب" });
      }
      if (!values.applicantStatus) {
        context.addIssue({ code: "custom", path: ["applicantStatus"], message: "حالة المتقدم مطلوبة" });
      }
      if (!values.appliedAt) {
        context.addIssue({ code: "custom", path: ["appliedAt"], message: "تاريخ التقديم مطلوب" });
      }
    });
}

function toDatetimeLocalValue(isoString: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromDatetimeLocalValue(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

export function donorEntryToFormValues(entry: DonorEntryItem): DonorEntryFormValues {
  return {
    name: entry.name ?? "",
    email: entry.email ?? "",
    phone: entry.phone ?? "",
    city: entry.city ?? "",
    campaignTitle: entry.campaignTitle ?? "",
    applicantStatus: entry.applicantStatus ?? "pending",
    appliedAt: entry.appliedAt ?? "",
  };
}

export function DonorEntryFormSheet({
  open,
  mode,
  view,
  initialValues,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
}: DonorEntryFormSheetProps) {
  const schema = React.useMemo(() => createSchema(view), [view]);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DonorEntryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  React.useEffect(() => {
    if (open) reset(initialValues);
  }, [initialValues, open, reset]);

  const isApplicants = view === "applicants";
  const title = mode === "create"
    ? isApplicants ? "إضافة متقدم" : "إضافة متبرع"
    : isApplicants ? "تعديل بيانات المتقدم" : "تعديل بيانات المتبرع";

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isSubmitting) onOpenChange(nextOpen);
      }}
    >
      <SheetContent side="right" dir="rtl" className="w-[95vw] border-border p-0 sm:max-w-lg">
        <form
          noValidate
          className="flex h-full flex-col"
          onSubmit={handleSubmit((values) => onSubmit({
            ...values,
            name: values.name.trim(),
            email: values.email.trim(),
            phone: values.phone.trim(),
            campaignTitle: values.campaignTitle.trim(),
          }))}
        >
          <SheetHeader className="border-b border-border pe-12 text-right">
            <SheetTitle className="text-right text-lg">{title}</SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="space-y-2">
              <Label htmlFor="entry-name">الاسم الكامل</Label>
              <Input id="entry-name" disabled={isSubmitting} aria-invalid={Boolean(errors.name)} {...register("name")} />
              {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
            </div>

            {isApplicants ? null : (
              <div className="space-y-2">
                <Label htmlFor="entry-email">البريد الإلكتروني</Label>
                <Input id="entry-email" type="email" disabled={isSubmitting} aria-invalid={Boolean(errors.email)} {...register("email")} />
                {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="entry-phone">رقم الهاتف</Label>
              <Input
                id="entry-phone"
                inputMode="numeric"
                maxLength={10}
                dir="ltr"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.phone)}
                placeholder="09XXXXXXXX"
                {...register("phone")}
              />
              {errors.phone ? <p className="text-xs text-destructive">{errors.phone.message}</p> : null}
            </div>

            {isApplicants ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="entry-campaign">اسم الحملة</Label>
                  <Input id="entry-campaign" disabled={isSubmitting} aria-invalid={Boolean(errors.campaignTitle)} {...register("campaignTitle")} />
                  {errors.campaignTitle ? <p className="text-xs text-destructive">{errors.campaignTitle.message}</p> : null}
                </div>

                <div className="space-y-2">
                  <Label>الحالة</Label>
                  <Controller
                    control={control}
                    name="applicantStatus"
                    render={({ field }) => (
                      <Select dir="rtl" value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                        <SelectTrigger className="w-full text-right" aria-invalid={Boolean(errors.applicantStatus)}>
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                        <SelectContent align="start" className="text-right">
                          {applicantStatusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-right">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.applicantStatus ? <p className="text-xs text-destructive">{errors.applicantStatus.message}</p> : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entry-applied-at">تاريخ التقديم</Label>
                  <Controller
                    control={control}
                    name="appliedAt"
                    render={({ field }) => (
                      <Input
                        id="entry-applied-at"
                        type="datetime-local"
                        disabled={isSubmitting}
                        aria-invalid={Boolean(errors.appliedAt)}
                        value={toDatetimeLocalValue(field.value)}
                        onChange={(event) => field.onChange(fromDatetimeLocalValue(event.target.value))}
                      />
                    )}
                  />
                  {errors.appliedAt ? <p className="text-xs text-destructive">{errors.appliedAt.message}</p> : null}
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label>المحافظة</Label>
                <Controller
                  control={control}
                  name="city"
                  render={({ field }) => (
                    <Select dir="rtl" value={field.value || undefined} onValueChange={field.onChange} disabled={isSubmitting}>
                      <SelectTrigger className="w-full text-right" aria-invalid={Boolean(errors.city)}>
                        <SelectValue placeholder="اختر المحافظة" />
                      </SelectTrigger>
                      <SelectContent align="start" className="text-right">
                        {syrianGovernorateOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-right">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.city ? <p className="text-xs text-destructive">{errors.city.message}</p> : null}
              </div>
            )}
          </div>

          <SheetFooter className="flex-row-reverse gap-2 border-t border-border p-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {isSubmitting ? "جاري الحفظ..." : mode === "create" ? "إضافة" : "حفظ التعديلات"}
            </Button>
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
