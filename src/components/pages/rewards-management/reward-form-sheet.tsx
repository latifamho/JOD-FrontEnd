"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

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
} from "@/components/pages/rewards-management/rewards-management.types";

const rewardIconValues = rewardIconOptions.map((o) => o.value) as [
  RewardIconName,
  ...RewardIconName[],
];

const rewardFormSchema = z.object({
  name: z.string().min(1, "اسم الشارة مطلوب"),
  description: z.string().optional(),
  criteria: z.string().optional(),
  iconName: z.enum(rewardIconValues),
  isActive: z.boolean(),
});

export type RewardFormValues = z.infer<typeof rewardFormSchema>;

export const EMPTY_REWARD_FORM_VALUES: RewardFormValues = {
  name: "",
  description: "",
  criteria: "",
  iconName: "rewards",
  isActive: true,
};

export function normalizeRewardIconName(iconName: string | undefined | null): RewardIconName {
  if (iconName && rewardIconValues.includes(iconName as RewardIconName)) {
    return iconName as RewardIconName;
  }
  return "rewards";
}

type RewardFormSheetProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues: RewardFormValues;
  isSubmitting?: boolean;
  isLoadingDetails?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: RewardFormValues) => void;
};

export function RewardFormSheet({
  open,
  mode,
  initialValues,
  isSubmitting = false,
  isLoadingDetails = false,
  onOpenChange,
  onSubmit,
}: RewardFormSheetProps) {
  const [discardDialogOpen, setDiscardDialogOpen] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<RewardFormValues>({
    resolver: zodResolver(rewardFormSchema),
    defaultValues: initialValues,
  });

  React.useEffect(() => {
    if (open) {
      reset(initialValues);
    }
  }, [initialValues, open, reset]);

  const iconName = watch("iconName");
  const SelectedIcon = AppIcons[normalizeRewardIconName(iconName)];
  const isFormLocked = isSubmitting || isLoadingDetails;

  const closeSheetSafely = React.useCallback(() => {
    if (isFormLocked) return;
    if (mode === "edit" && isDirty) {
      setDiscardDialogOpen(true);
      return;
    }
    onOpenChange(false);
  }, [isDirty, isFormLocked, mode, onOpenChange]);

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
            onSubmit={handleSubmit((values) => {
              onSubmit({
                name: values.name.trim(),
                description: values.description?.trim() ?? "",
                criteria: values.criteria?.trim() ?? "",
                iconName: normalizeRewardIconName(values.iconName),
                isActive: values.isActive,
              });
            })}
          >
            <SheetHeader className="border-b border-border pe-12 text-right">
              <SheetTitle className="text-right text-lg">
                {mode === "create" ? "إضافة شارة جديدة" : "تعديل الشارة"}
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {isLoadingDetails ? (
                <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="size-6 animate-spin" />
                  <p className="text-sm">جاري تحميل بيانات الشارة...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="reward-name">اسم الشارة</Label>
                    <Input
                      id="reward-name"
                      disabled={isFormLocked}
                      placeholder="مثال: متبرع نشط"
                      {...register("name")}
                    />
                    {errors.name ? (
                      <p className="text-xs text-destructive">{errors.name.message}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reward-description">الوصف</Label>
                    <Textarea
                      id="reward-description"
                      disabled={isFormLocked}
                      rows={3}
                      placeholder="اكتب وصف الشارة (اختياري)"
                      {...register("description")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reward-criteria">المعايير</Label>
                    <Input
                      id="reward-criteria"
                      disabled={isFormLocked}
                      placeholder="مثال: 10 منشورات مقبولة (اختياري)"
                      {...register("criteria")}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>الأيقونة</Label>
                      <Controller
                        control={control}
                        name="iconName"
                        render={({ field }) => (
                          <Select
                            dir="rtl"
                            disabled={isFormLocked}
                            value={field.value}
                            onValueChange={field.onChange}
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
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>الحالة</Label>
                      <Controller
                        control={control}
                        name="isActive"
                        render={({ field }) => (
                          <Select
                            dir="rtl"
                            disabled={isFormLocked}
                            value={field.value ? "active" : "inactive"}
                            onValueChange={(value) =>
                              field.onChange(value === "active")
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
                        )}
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">معاينة الأيقونة</p>
                    <div className="mt-2 inline-flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <SelectedIcon className="size-5" />
                    </div>
                  </div>
                </>
              )}
            </div>

            <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
              <Button
                type="button"
                variant="outline"
                disabled={isFormLocked}
                onClick={closeSheetSafely}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isFormLocked}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
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
