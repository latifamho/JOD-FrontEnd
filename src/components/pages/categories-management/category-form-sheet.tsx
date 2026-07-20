"use client";

import * as React from "react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  categoryStatusLabels,
  categoryTargetLabels,
  type CategoryStatus,
  type CategoryTarget,
} from "@/components/pages/categories-management/categories-management.types";

export type CategoryFormValues = {
  name: string;
  target: CategoryTarget;
  description: string;
  status: CategoryStatus;
};

export const EMPTY_CATEGORY_FORM_VALUES: CategoryFormValues = {
  name: "",
  target: "post",
  description: "",
  status: "active",
};

type CategoryFormSheetProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues: CategoryFormValues;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CategoryFormValues) => void;
};

export function CategoryFormSheet({
  open,
  mode,
  initialValues,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: CategoryFormSheetProps) {
  const [formValues, setFormValues] = React.useState<CategoryFormValues>(initialValues);

  React.useEffect(() => {
    if (open) {
      setFormValues(initialValues);
    }
  }, [initialValues, open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" dir="rtl" className="w-[95vw] border-border p-0 sm:max-w-lg">
        <form
          className="flex h-full flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit({
              name: formValues.name.trim(),
              target: formValues.target,
              description: formValues.description.trim(),
              status: formValues.status,
            });
          }}
        >
          <SheetHeader className="border-b border-border pe-12 text-right">
            <SheetTitle className="text-right text-lg">
              {mode === "create" ? "إضافة تصنيف جديد" : "تعديل التصنيف"}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">اسم التصنيف</Label>
              <Input
                id="category-name"
                required
                disabled={isSubmitting}
                value={formValues.name}
                onChange={(event) =>
                  setFormValues((currentValues) => ({
                    ...currentValues,
                    name: event.target.value,
                  }))
                }
                placeholder="مثال: أخبار المنظمة"
              />
            </div>

            <div className="space-y-2">
              <Label>نوع التصنيف</Label>
              <Select
                dir="rtl"
                disabled={isSubmitting}
                value={formValues.target}
                onValueChange={(value) =>
                  setFormValues((currentValues) => ({
                    ...currentValues,
                    target: value as CategoryTarget,
                  }))
                }
              >
                <SelectTrigger className="w-full text-right">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start" position="popper" className="text-right">
                  {Object.entries(categoryTargetLabels).map(([target, label]) => (
                    <SelectItem key={target} value={target} className="text-right text-xs">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-description">الوصف</Label>
              <Textarea
                id="category-description"
                required
                disabled={isSubmitting}
                value={formValues.description}
                onChange={(event) =>
                  setFormValues((currentValues) => ({
                    ...currentValues,
                    description: event.target.value,
                  }))
                }
                placeholder="وصف مختصر لفائدة هذا التصنيف"
                className="min-h-28 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select
                dir="rtl"
                disabled={isSubmitting}
                value={formValues.status}
                onValueChange={(value) =>
                  setFormValues((currentValues) => ({
                    ...currentValues,
                    status: value as CategoryStatus,
                  }))
                }
              >
                <SelectTrigger className="w-full text-right">
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
            </div>
          </div>

          <SheetFooter className="border-t border-border px-4 py-3 sm:justify-start">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {mode === "create" ? "إضافة" : "حفظ"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
