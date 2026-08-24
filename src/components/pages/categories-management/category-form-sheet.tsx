"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  categoryStatusLabels,
  type CategoryStatus,
} from "@/components/pages/categories-management/categories-management.types";

const categoryFormSchema = z.object({
  name: z.string().min(1, "اسم التصنيف مطلوب"),
  description: z
    .string()
    .min(1, "وصف التصنيف مطلوب")
    .max(1000, "وصف التصنيف يجب ألا يتجاوز 1000 حرف"),
  status: z.enum(["active", "inactive"]),
});

export type CategoryFormValues = {
  name: string;
  description: string;
  status: CategoryStatus;
};

export const EMPTY_CATEGORY_FORM_VALUES: CategoryFormValues = {
  name: "",
  description: "",
  status: "active",
};

type CategoryFormSheetProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues: CategoryFormValues;
  isSubmitting: boolean;
  isLoadingDetails?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CategoryFormValues) => void;
};

export function CategoryFormSheet({
  open,
  mode,
  initialValues,
  isSubmitting,
  isLoadingDetails = false,
  onOpenChange,
  onSubmit,
}: CategoryFormSheetProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialValues.name,
      description: initialValues.description,
      status: initialValues.status,
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        name: initialValues.name,
        description: initialValues.description,
          status: initialValues.status,
      });
    }
  }, [initialValues, open, reset]);

  const isFormLocked = isSubmitting || isLoadingDetails;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" dir="rtl" className="w-[95vw] border-border p-0 sm:max-w-lg">
        <form
          className="flex h-full flex-col"
          noValidate
          onSubmit={handleSubmit((values) => {
            onSubmit({
              name: values.name.trim(),
              description: values.description.trim(),
              status: values.status,
            });
          })}
        >
          <SheetHeader className="border-b border-border pe-12 text-right">
            <SheetTitle className="text-right text-lg">
              {mode === "create" ? "إضافة تصنيف جديد" : "تعديل التصنيف"}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {isLoadingDetails ? (
              <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="size-6 animate-spin" />
                <p className="text-sm">جاري تحميل بيانات التصنيف...</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="category-name">اسم التصنيف</Label>
                  <Input
                    id="category-name"
                    disabled={isFormLocked}
                    aria-invalid={Boolean(errors.name)}
                    placeholder="مثال: أخبار المنظمة"
                    {...register("name")}
                  />
                  {errors.name ? (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category-description">وصف التصنيف</Label>
                  <Textarea
                    id="category-description"
                    disabled={isFormLocked}
                    rows={5}
                    maxLength={1000}
                    aria-invalid={Boolean(errors.description)}
                    placeholder="اكتب وصفًا واضحًا للتصنيف"
                    {...register("description")}
                  />
                  {errors.description ? (
                    <p className="text-xs text-destructive">
                      {errors.description.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label>الحالة</Label>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        dir="rtl"
                        disabled={isFormLocked}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className="w-full text-right"
                          aria-invalid={Boolean(errors.status)}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="start" position="popper" className="text-right">
                          {Object.entries(categoryStatusLabels).map(([status, label]) => (
                            <SelectItem key={status} value={status} className="text-right text-xs">
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </>
            )}
          </div>

          <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
            <Button
              type="button"
              variant="outline"
              disabled={isFormLocked}
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isFormLocked}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {mode === "create" ? "إضافة" : "حفظ"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
