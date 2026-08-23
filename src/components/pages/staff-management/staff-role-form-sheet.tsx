"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { FormLoadingSkeleton } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { OrgPermissionCatalogItem } from "@/features/org/staff/org.staff.types";

const staffRoleFormSchema = z.object({
  name: z
    .string()
    .min(1, "اسم الدور مطلوب")
    .max(255, "اسم الدور يجب ألا يتجاوز 255 حرفًا")
    .refine((value) => value.trim().length > 0, "اسم الدور مطلوب"),
  description: z.string().max(1000, "الوصف يجب ألا يتجاوز 1000 حرف"),
  permissions: z.array(z.string()),
  isActive: z.boolean(),
});

export type StaffRoleFormValues = z.infer<typeof staffRoleFormSchema>;

export const EMPTY_STAFF_ROLE_FORM_VALUES: StaffRoleFormValues = {
  name: "",
  description: "",
  permissions: [],
  isActive: true,
};

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initialValues: StaffRoleFormValues;
  permissionOptions: OrgPermissionCatalogItem[];
  isLoadingDetails?: boolean;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: StaffRoleFormValues) => void;
};

export function StaffRoleFormSheet({
  open,
  mode,
  initialValues,
  permissionOptions,
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
  } = useForm<StaffRoleFormValues>({
    resolver: zodResolver(staffRoleFormSchema),
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
      <SheetContent side="right" dir="rtl" className="w-[95vw] border-border p-0 sm:max-w-2xl">
        <form
          noValidate
          className="flex h-full flex-col"
          onSubmit={handleSubmit((values) =>
            onSubmit({
              name: values.name.trim(),
              description: values.description?.trim() ?? "",
              permissions: values.permissions,
              isActive: values.isActive,
            }),
          )}
        >
          <SheetHeader className="border-b border-border pe-12 text-right">
            <SheetTitle className="text-right text-lg">
              {mode === "create" ? "إضافة دور" : "تعديل الدور"}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {isLoadingDetails ? (
              <FormLoadingSkeleton count={5} />
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="role-name">اسم الدور</Label>
                  <Input
                    id="role-name"
                    disabled={isFormLocked}
                    aria-invalid={Boolean(errors.name)}
                    placeholder="أدخل اسم الدور"
                    {...register("name")}
                  />
                  {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
                </div>

                <div className="flex items-center justify-between gap-4 rounded-md border border-border p-3">
                  <div className="space-y-1">
                    <Label htmlFor="role-active">الحالة</Label>
                    <p className="text-xs text-muted-foreground">فعّل أو أوقف هذا الدور.</p>
                  </div>
                  <Controller
                    control={control}
                    name="isActive"
                    render={({ field }) => (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {field.value ? "مفعّل" : "موقّف"}
                        </span>
                        <Switch
                          id="role-active"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isFormLocked}
                        />
                      </div>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role-description">الوصف</Label>
                  <Textarea
                    id="role-description"
                    disabled={isFormLocked}
                    aria-invalid={Boolean(errors.description)}
                    placeholder="وصف مختصر للدور"
                    {...register("description")}
                  />
                  {errors.description ? (
                    <p className="text-xs text-destructive">{errors.description.message}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label>الصلاحيات</Label>
                  <Controller
                    control={control}
                    name="permissions"
                    render={({ field }) => (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-16 text-right">اختيار</TableHead>
                              <TableHead className="text-right">الصلاحية</TableHead>
                              <TableHead className="text-right">الوصف</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {permissionOptions.map((option) => {
                              const checked = field.value.includes(option.id);
                              return (
                                <TableRow key={option.id}>
                                  <TableCell>
                                    <Checkbox
                                      disabled={isFormLocked}
                                      checked={checked}
                                      onCheckedChange={(nextChecked) => {
                                        if (nextChecked === true) {
                                          field.onChange(Array.from(new Set([...field.value, option.id])));
                                        } else {
                                          field.onChange(field.value.filter((permission) => permission !== option.id));
                                        }
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>{option.label}</TableCell>
                                  <TableCell className="text-xs text-muted-foreground">
                                    {option.description}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  />
                  {errors.permissions ? (
                    <p className="text-xs text-destructive">{errors.permissions.message}</p>
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
