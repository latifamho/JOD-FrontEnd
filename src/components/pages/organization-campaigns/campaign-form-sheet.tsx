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
import {
  organizationCampaignCategoryLabels,
  organizationCampaignStatusLabels,
  type OrganizationCampaignCategory,
  type OrganizationCampaignStatus,
} from "@/components/pages/organization-campaigns/static-data";

export type CampaignFormValues = {
  title: string;
  summary: string;
  category: OrganizationCampaignCategory;
  status: OrganizationCampaignStatus;
  location: string;
  goalAmount: number;
  beneficiariesCount: number;
  startDate: string;
  endDate: string;
};

export const EMPTY_CAMPAIGN_FORM_VALUES: CampaignFormValues = {
  title: "",
  summary: "",
  category: "health",
  status: "draft",
  location: "",
  goalAmount: 0,
  beneficiariesCount: 0,
  startDate: "",
  endDate: "",
};

type CampaignFormSheetProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues: CampaignFormValues;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CampaignFormValues) => void;
};

function areValuesEqual(
  first: CampaignFormValues,
  second: CampaignFormValues,
): boolean {
  return (
    first.title === second.title &&
    first.summary === second.summary &&
    first.category === second.category &&
    first.status === second.status &&
    first.location === second.location &&
    first.goalAmount === second.goalAmount &&
    first.beneficiariesCount === second.beneficiariesCount &&
    first.startDate === second.startDate &&
    first.endDate === second.endDate
  );
}

function parseNumberInput(value: string): number {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return 0;
  }

  return Math.max(parsed, 0);
}

export function CampaignFormSheet({
  open,
  mode,
  initialValues,
  onOpenChange,
  onSubmit,
}: CampaignFormSheetProps) {
  const [formValues, setFormValues] =
    React.useState<CampaignFormValues>(initialValues);
  const [discardDialogOpen, setDiscardDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setFormValues(initialValues);
    }
  }, [initialValues, open]);

  const isDirty = mode === "edit" && !areValuesEqual(formValues, initialValues);

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
        <SheetContent side="right" dir="rtl" className="w-[95vw] border-border p-0 sm:max-w-xl">
          <form
            className="flex h-full flex-col"
            onSubmit={(event) => {
              event.preventDefault();

              onSubmit({
                title: formValues.title.trim(),
                summary: formValues.summary.trim(),
                category: formValues.category,
                status: formValues.status,
                location: formValues.location.trim(),
                goalAmount: Math.max(formValues.goalAmount, 0),
                beneficiariesCount: Math.max(formValues.beneficiariesCount, 0),
                startDate: formValues.startDate,
                endDate: formValues.endDate,
              });

              onOpenChange(false);
            }}
          >
            <SheetHeader className="border-b border-border pe-12 text-right">
              <SheetTitle className="text-right text-lg">
                {mode === "create" ? "إضافة حملة جديدة" : "تعديل الحملة"}
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-title">عنوان الحملة</Label>
                <Input
                  id="campaign-title"
                  required
                  value={formValues.title}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      title: event.target.value,
                    }))
                  }
                  placeholder="أدخل عنوان الحملة"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-summary">ملخص الحملة</Label>
                <Textarea
                  id="campaign-summary"
                  required
                  value={formValues.summary}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      summary: event.target.value,
                    }))
                  }
                  placeholder="وصف مختصر للحملة"
                  className="min-h-28 text-sm"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>فئة الحملة</Label>
                  <Select
                    dir="rtl"
                    value={formValues.category}
                    onValueChange={(value) =>
                      setFormValues((currentValues) => ({
                        ...currentValues,
                        category: value as OrganizationCampaignCategory,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full text-right">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start" position="popper" className="text-right">
                      {Object.entries(organizationCampaignCategoryLabels).map(
                        ([category, label]) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="text-right text-xs"
                          >
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>حالة الحملة</Label>
                  <Select
                    dir="rtl"
                    value={formValues.status}
                    onValueChange={(value) =>
                      setFormValues((currentValues) => ({
                        ...currentValues,
                        status: value as OrganizationCampaignStatus,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full text-right">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start" position="popper" className="text-right">
                      {Object.entries(organizationCampaignStatusLabels).map(
                        ([status, label]) => (
                          <SelectItem
                            key={status}
                            value={status}
                            className="text-right text-xs"
                          >
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-location">الموقع</Label>
                <Input
                  id="campaign-location"
                  required
                  value={formValues.location}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      location: event.target.value,
                    }))
                  }
                  placeholder="المدينة أو المنطقة"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="campaign-goal-amount">الهدف المالي (ر.س)</Label>
                  <Input
                    id="campaign-goal-amount"
                    type="number"
                    min={0}
                    required
                    value={String(formValues.goalAmount)}
                    onChange={(event) =>
                      setFormValues((currentValues) => ({
                        ...currentValues,
                        goalAmount: parseNumberInput(event.target.value),
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campaign-beneficiaries">عدد المستفيدين</Label>
                  <Input
                    id="campaign-beneficiaries"
                    type="number"
                    min={0}
                    required
                    value={String(formValues.beneficiariesCount)}
                    onChange={(event) =>
                      setFormValues((currentValues) => ({
                        ...currentValues,
                        beneficiariesCount: parseNumberInput(event.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="campaign-start-date">تاريخ البداية</Label>
                  <Input
                    id="campaign-start-date"
                    type="date"
                    required
                    value={formValues.startDate}
                    onChange={(event) =>
                      setFormValues((currentValues) => ({
                        ...currentValues,
                        startDate: event.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campaign-end-date">تاريخ النهاية</Label>
                  <Input
                    id="campaign-end-date"
                    type="date"
                    min={formValues.startDate || undefined}
                    required
                    value={formValues.endDate}
                    onChange={(event) =>
                      setFormValues((currentValues) => ({
                        ...currentValues,
                        endDate: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
              <Button type="button" variant="outline" onClick={closeSheetSafely}>
                إلغاء
              </Button>
              <Button type="submit">
                {mode === "create" ? "إضافة الحملة" : "حفظ التعديلات"}
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
              لديك تغييرات غير محفوظة. هل تريد إغلاق نموذج التعديل دون حفظ؟
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
