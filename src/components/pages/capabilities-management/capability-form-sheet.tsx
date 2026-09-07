"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { CapabilityStatus } from "@/features/admin/capabilities/admin.capabilities.types";

const schema = z.object({
  name: z.string().trim().min(1, "اسم طريقة المساعدة مطلوب").max(150),
  slug: z.string().trim().min(1, "المعرّف مطلوب").max(150).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "استخدم أحرفًا إنجليزية صغيرة وأرقامًا وشرطة - فقط"),
  status: z.enum(["active", "inactive"]),
  sortOrder: z.number().int().min(0, "الترتيب لا يمكن أن يكون سالبًا").max(10000),
});

export type CapabilityFormValues = { name: string; slug: string; status: CapabilityStatus; sortOrder: number };
export const EMPTY_CAPABILITY_FORM_VALUES: CapabilityFormValues = { name: "", slug: "", status: "active", sortOrder: 0 };

type Props = { open: boolean; mode: "create" | "edit"; initialValues: CapabilityFormValues; isSubmitting: boolean; onOpenChange: (open: boolean) => void; onSubmit: (values: CapabilityFormValues) => void };

export function CapabilityFormSheet({ open, mode, initialValues, isSubmitting, onOpenChange, onSubmit }: Props) {
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: initialValues });
  React.useEffect(() => { if (open) reset(initialValues); }, [initialValues, open, reset]);
  return <Sheet open={open} onOpenChange={(next) => !isSubmitting && onOpenChange(next)}><SheetContent side="right" dir="rtl" className="w-[95vw] border-border p-0 sm:max-w-lg"><form className="flex h-full flex-col" noValidate onSubmit={handleSubmit((values) => onSubmit({ ...values, name: values.name.trim(), slug: values.slug.trim() }))}>
    <SheetHeader className="border-b border-border pe-12 text-right"><SheetTitle className="text-right text-lg">{mode === "create" ? "إضافة طريقة مساعدة" : "تعديل طريقة المساعدة"}</SheetTitle></SheetHeader>
    <div className="flex-1 space-y-5 overflow-y-auto p-4">
      <div className="space-y-2"><Label htmlFor="capability-name">الاسم</Label><Input id="capability-name" disabled={isSubmitting} aria-invalid={Boolean(errors.name)} placeholder="مثال: دعم تقني" {...register("name")} />{errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}</div>
      <div className="space-y-2"><Label htmlFor="capability-slug">المعرّف</Label><Input id="capability-slug" dir="ltr" disabled={isSubmitting} aria-invalid={Boolean(errors.slug)} placeholder="technical-support" className="text-left" {...register("slug")} /><p className="text-xs text-muted-foreground">معرّف ثابت بالإنجليزية يُستخدم داخل النظام.</p>{errors.slug ? <p className="text-xs text-destructive">{errors.slug.message}</p> : null}</div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="capability-sort">الترتيب</Label><Input id="capability-sort" type="number" min={0} max={10000} disabled={isSubmitting} {...register("sortOrder", { valueAsNumber: true })} />{errors.sortOrder ? <p className="text-xs text-destructive">{errors.sortOrder.message}</p> : null}</div>
        <div className="space-y-2"><Label>الحالة</Label><Controller control={control} name="status" render={({ field }) => <Select dir="rtl" disabled={isSubmitting} value={field.value} onValueChange={field.onChange}><SelectTrigger className="w-full text-right"><SelectValue /></SelectTrigger><SelectContent align="start"><SelectItem value="active">نشط</SelectItem><SelectItem value="inactive">غير نشط</SelectItem></SelectContent></Select>} /></div>
      </div>
    </div>
    <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start"><Button type="button" variant="outline" disabled={isSubmitting} onClick={() => onOpenChange(false)}>إلغاء</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}{mode === "create" ? "إضافة" : "حفظ التعديلات"}</Button></SheetFooter>
  </form></SheetContent></Sheet>;
}
