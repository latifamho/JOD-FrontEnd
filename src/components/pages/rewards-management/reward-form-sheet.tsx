"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { AppIcons } from "@/constant/icons";
import {
  rewardIconOptions,
  rewardStatusLabels,
  type RewardIconName,
  type RewardStatus,
} from "@/components/pages/rewards-management/static-data";

export type RewardFormValues = {
  name: string;
  description: string;
  criteria: string;
  iconName: RewardIconName;
  isActive: boolean;
};

export const EMPTY_REWARD_FORM_VALUES: RewardFormValues = {
  name: "",
  description: "",
  criteria: "",
  iconName: "rewards",
  isActive: true,
};

type RewardFormSheetProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues: RewardFormValues;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: RewardFormValues) => void;
};

function areValuesEqual(
  first: RewardFormValues,
  second: RewardFormValues,
): boolean {
  return (
    first.name === second.name &&
    first.description === second.description &&
    first.criteria === second.criteria &&
    first.iconName === second.iconName &&
    first.isActive === second.isActive
  );
}

export function RewardFormSheet({
  open,
  mode,
  initialValues,
  onOpenChange,
  onSubmit,
}: RewardFormSheetProps) {
  const [formValues, setFormValues] = React.useState<RewardFormValues>(
    initialValues,
  );
  const [discardDialogOpen, setDiscardDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setFormValues(initialValues);
    }
  }, [initialValues, open]);

  const isDirty = mode === "edit" && !areValuesEqual(formValues, initialValues);
  const SelectedIcon = AppIcons[formValues.iconName];

  const closeSheetSafely = React.useCallback(() => {
    if (isDirty) {
      setDiscardDialogOpen(true);
      return;
    }
    onOpenChange(false);
  }, [isDirty, onOpenChange]);

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            onOpenChange(true);
            return;
          }
          closeSheetSafely();
        }}
      >
        <SheetContent
          side="right"
          dir="rtl"
          className="w-[95vw] border-border p-0 sm:max-w-lg"
        >
          <form
            className="flex h-full flex-col"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit({
                name: formValues.name.trim(),
                description: formValues.description.trim(),
                criteria: formValues.criteria.trim(),
                iconName: formValues.iconName,
                isActive: formValues.isActive,
              });
              onOpenChange(false);
            }}
          >
            <SheetHeader className="border-b border-border pe-12 text-right">
              <SheetTitle className="text-right text-lg">
                {mode === "create" ? "إضافة شارة جديدة" : "تعديل الشارة"}
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <div className="space-y-2">
                <Label htmlFor="reward-name">اسم الشارة</Label>
                <Input
                  id="reward-name"
                  required
                  value={formValues.name}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      name: event.target.value,
                    }))
                  }
                  placeholder="مثال: متبرع نشط"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reward-description">الوصف</Label>
                <Textarea
                  id="reward-description"
                  required
                  rows={3}
                  value={formValues.description}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      description: event.target.value,
                    }))
                  }
                  placeholder="اكتب وصف الشارة"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reward-criteria">المعايير</Label>
                <Input
                  id="reward-criteria"
                  required
                  value={formValues.criteria}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      criteria: event.target.value,
                    }))
                  }
                  placeholder="مثال: 10 منشورات مقبولة"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>الأيقونة</Label>
                  <Select
                    dir="rtl"
                    value={formValues.iconName}
                    onValueChange={(value) =>
                      setFormValues((currentValues) => ({
                        ...currentValues,
                        iconName: value as RewardIconName,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full text-right">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      align="start"
                      position="popper"
                      className="text-right"
                    >
                      {rewardIconOptions.map((option) => {
                        const OptionIcon = AppIcons[option.value];

                        return (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-right text-xs"
                          >
                            <span className="inline-flex items-center gap-2">
                              <OptionIcon className="size-4 text-muted-foreground" />
                              {option.label}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>الحالة</Label>
                  <Select
                    dir="rtl"
                    value={formValues.isActive ? "active" : "inactive"}
                    onValueChange={(value) =>
                      setFormValues((currentValues) => ({
                        ...currentValues,
                        isActive: value === "active",
                      }))
                    }
                  >
                    <SelectTrigger className="w-full text-right">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      align="start"
                      position="popper"
                      className="text-right"
                    >
                      {(Object.keys(rewardStatusLabels) as RewardStatus[]).map(
                        (status) => (
                          <SelectItem
                            key={status}
                            value={status}
                            className="text-right text-xs"
                          >
                            {rewardStatusLabels[status]}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground">معاينة الأيقونة</p>
                <div className="mt-2 inline-flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <SelectedIcon className="size-5" />
                </div>
              </div>
            </div>

            <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
              <Button type="button" variant="outline" onClick={closeSheetSafely}>
                إلغاء
              </Button>
              <Button type="submit">
                {mode === "create" ? "إضافة الشارة" : "حفظ التعديلات"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <Dialog open={discardDialogOpen} onOpenChange={setDiscardDialogOpen}>
        <DialogContent dir="rtl" className="sm:max-w-md">
          <DialogHeader className="pe-12 text-right sm:text-right">
            <DialogTitle>تجاهل التعديلات؟</DialogTitle>
            <DialogDescription>
              لديك تغييرات غير محفوظة. هل تريد إغلاق نافذة التعديل بدون حفظ؟
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="outline" onClick={() => setDiscardDialogOpen(false)}>
              متابعة التعديل
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setDiscardDialogOpen(false);
                onOpenChange(false);
              }}
            >
              تجاهل التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
