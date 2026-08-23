"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { FormLoadingSkeleton } from "@/components/shared";
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

export type StaffRoleOption = { id: string; name: string };

const staffMemberFormSchema = z.object({
  name: z
    .string()
    .min(1, "اسم الموظف مطلوب")
    .max(255, "اسم الموظف يجب ألا يتجاوز 255 حرفًا")
    .refine((value) => value.trim().length > 0, "اسم الموظف مطلوب"),
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("أدخل بريدًا إلكترونيًا صحيحًا")
    .max(255, "البريد الإلكتروني يجب ألا يتجاوز 255 حرفًا"),
  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^09\d{8}$/, "رقم الهاتف يجب أن يكون 10 أرقام ويبدأ بـ 09"),
  organizationRoleId: z.string().min(1, "الدور مطلوب"),
});

export type StaffMemberFormValues = z.infer<typeof staffMemberFormSchema>;

export const EMPTY_STAFF_MEMBER_FORM_VALUES: StaffMemberFormValues = {
  name: "",
  email: "",
  phone: "",
  organizationRoleId: "",
};

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initialValues: StaffMemberFormValues;
  roleOptions: StaffRoleOption[];
  isLoadingDetails?: boolean;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: StaffMemberFormValues) => void;
};

export function StaffMemberFormSheet({
  open,
  mode,
  initialValues,
  roleOptions,
  isLoadingDetails = false,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
}: Props) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StaffMemberFormValues>({
    resolver: zodResolver(staffMemberFormSchema),
    defaultValues: initialValues,
  });

  React.useEffect(() => {
    if (open && !isLoadingDetails) {
      reset(initialValues);
    }
  }, [initialValues, isLoadingDetails, open, reset]);

  const isFormLocked = isLoadingDetails || isSubmitting;

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (isSubmitting) return;
        onOpenChange(nextOpen);
      }}
    >
      <SheetContent side="right" dir="rtl" className="w-[95vw] border-border p-0 sm:max-w-lg">
        <form
          noValidate
          className="flex h-full flex-col"
          onSubmit={handleSubmit((values) =>
            onSubmit({
              name: values.name.trim(),
              email: values.email.trim(),
              phone: values.phone.trim(),
              organizationRoleId: values.organizationRoleId,
            }),
          )}
        >
          <SheetHeader className="border-b border-border pe-12 text-right">
            <SheetTitle className="text-right text-lg">
              {mode === "create" ? "إضافة موظف" : "تعديل الموظف"}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {isLoadingDetails ? (
              <FormLoadingSkeleton count={4} />
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="staff-name">الاسم</Label>
                  <Input
                    id="staff-name"
                    disabled={isFormLocked}
                    aria-invalid={Boolean(errors.name)}
                    placeholder="أدخل اسم الموظف"
                    {...register("name")}
                  />
                  {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="staff-email">البريد الإلكتروني</Label>
                  <Input
                    id="staff-email"
                    type="email"
                    disabled={isFormLocked}
                    aria-invalid={Boolean(errors.email)}
                    placeholder="name@example.com"
                    {...register("email")}
                  />
                  {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="staff-phone">رقم الهاتف</Label>
                  <Input
                    id="staff-phone"
                    inputMode="numeric"
                    maxLength={10}
                    disabled={isFormLocked}
                    aria-invalid={Boolean(errors.phone)}
                    placeholder="09XXXXXXXX"
                    dir="ltr"
                    {...register("phone")}
                  />
                  {errors.phone ? <p className="text-xs text-destructive">{errors.phone.message}</p> : null}
                </div>

                <div className="space-y-2">
                  <Label>الدور</Label>
                  <Controller
                    control={control}
                    name="organizationRoleId"
                    render={({ field }) => (
                      <Select
                        dir="rtl"
                        disabled={isFormLocked}
                        value={field.value || undefined}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className="w-full text-right"
                          aria-invalid={Boolean(errors.organizationRoleId)}
                        >
                          <SelectValue placeholder="اختر الدور" />
                        </SelectTrigger>
                        <SelectContent align="start" position="popper" className="text-right">
                          {roleOptions.map((role) => (
                            <SelectItem key={role.id} value={role.id} className="text-right">
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.organizationRoleId ? (
                    <p className="text-xs text-destructive">{errors.organizationRoleId.message}</p>
                  ) : null}
                </div>
              </>
            )}
          </div>

          <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isFormLocked}>
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {isSubmitting ? "جاري الحفظ..." : mode === "create" ? "إضافة" : "حفظ"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
