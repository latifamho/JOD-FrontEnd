"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { MediaUploadField } from "@/components/shared";
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
  organizationCampaignAudienceLabels,
  organizationCampaignStatusLabels,
  syrianGovernorateOptions,
  type OrganizationCampaignAudience,
  type OrganizationCampaignStatus,
} from "@/components/pages/organization-campaigns/static-data";
import { useOrgCategoriesBrief } from "@/features/org/categories/org.categories.query";
import { useMediaUploadQueue } from "@/hooks/use-media-upload-queue";
import { useQueryDisclosure } from "@/hooks/use-query-modal";
import { toast } from "@/lib/toast";
import { normalizeApiError } from "@/lib/api-errors";

function getLocalDateInputValue(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const campaignFormSchema = z
  .object({
    title: z.string().min(1, "عنوان الحملة مطلوب").max(255, "عنوان الحملة يجب ألا يتجاوز 255 حرفًا").refine((value) => value.trim().length > 0, "عنوان الحملة مطلوب"),
    summary: z.string().min(1, "ملخص الحملة مطلوب").refine((value) => value.trim().length > 0, "ملخص الحملة مطلوب"),
    categoryId: z.string().min(1, "تصنيف الحملة مطلوب"),
    audience: z.enum(["general", "student"]),
    status: z.enum(["draft", "active", "closed"]),
    location: z.string().min(1, "المحافظة مطلوبة").refine(
      (value) => syrianGovernorateOptions.some((option) => option.value === value),
      "اختر محافظة سورية صحيحة",
    ),
    goalAmount: z.string().min(1, "الهدف المالي مطلوب").refine(
      (value) => Number.isFinite(Number(value)) && Number(value) >= 0,
      "الهدف المالي يجب أن يكون صفرًا أو أكثر",
    ),
    beneficiariesCount: z.string().min(1, "عدد المستفيدين مطلوب").refine(
      (value) => Number.isInteger(Number(value)) && Number(value) >= 0,
      "عدد المستفيدين يجب أن يكون عددًا صحيحًا صفرًا أو أكثر",
    ),
    startDate: z.string().min(1, "تاريخ البداية مطلوب"),
    endDate: z.string().min(1, "تاريخ النهاية مطلوب"),
  })
  .superRefine((values, context) => {
    if (values.startDate && values.startDate < getLocalDateInputValue()) {
      context.addIssue({ code: "custom", path: ["startDate"], message: "تاريخ البداية لا يمكن أن يكون قبل تاريخ اليوم" });
    }
    if (values.startDate && values.endDate && values.endDate < values.startDate) {
      context.addIssue({ code: "custom", path: ["endDate"], message: "تاريخ النهاية لا يمكن أن يكون قبل تاريخ البداية" });
    }
  });

type CampaignFormFields = z.infer<typeof campaignFormSchema>;

export type CampaignFormValues = {
  title: string;
  summary: string;
  categoryId: string;
  audience: OrganizationCampaignAudience;
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
  categoryId: "",
  audience: "general",
  status: "active",
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
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CampaignFormValues) => Promise<string | null | undefined>;
};

function toCampaignFormFields(values: CampaignFormValues): CampaignFormFields {
  return {
    title: values.title,
    summary: values.summary,
    categoryId: values.categoryId,
    audience: values.audience,
    status: values.status,
    location: values.location,
    goalAmount: String(values.goalAmount),
    beneficiariesCount: String(values.beneficiariesCount),
    startDate: values.startDate,
    endDate: values.endDate,
  };
}

export function CampaignFormSheet({ open, mode, initialValues, isSubmitting = false, onOpenChange, onSubmit }: CampaignFormSheetProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CampaignFormFields>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: toCampaignFormFields(initialValues),
  });
  const mediaQueue = useMediaUploadQueue(10);
  const categoriesBrief = useOrgCategoriesBrief(open);
  const [createdCampaignId, setCreatedCampaignId] = React.useState<string | null>(null);
  const [discardDialogOpen, setDiscardDialogOpen] = useQueryDisclosure(
    "campaign-discard-changes",
    { queryKey: "dialog", permission: "org.campaigns.create" },
  );

  React.useEffect(() => {
    if (open) {
      reset(toCampaignFormFields(initialValues));
      mediaQueue.reset();
      setCreatedCampaignId(null);
    }
  }, [initialValues, open, reset]);

  const isBusy = isSubmitting || mediaQueue.isUploading;
  const formLocked = isBusy || Boolean(createdCampaignId);
  const hasUnsavedEditChanges = mode === "edit" && isDirty;

  const closeSheetSafely = React.useCallback(() => {
    if (isBusy) return;
    if (hasUnsavedEditChanges) {
      setDiscardDialogOpen(true);
      return;
    }
    onOpenChange(false);
  }, [hasUnsavedEditChanges, isBusy, onOpenChange, setDiscardDialogOpen]);

  const target = createdCampaignId
    ? { model: "campaign" as const, modelId: createdCampaignId, prop: "images" as const }
    : null;

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && isBusy) return;
          if (nextOpen) onOpenChange(true);
          else closeSheetSafely();
        }}
      >
        <SheetContent side="right" dir="rtl" className="w-[95vw] border-border p-0 sm:max-w-xl">
          <form
            noValidate
            className="flex h-full flex-col"
            onSubmit={handleSubmit(async (values) => {
              if (createdCampaignId) return;
              let campaignId: string | null | undefined;
              try {
                campaignId = await onSubmit({
                  title: values.title.trim(),
                  summary: values.summary.trim(),
                  categoryId: values.categoryId,
                  audience: values.audience,
                  status: values.status,
                  location: values.location,
                  goalAmount: Number(values.goalAmount),
                  beneficiariesCount: Number(values.beneficiariesCount),
                  startDate: values.startDate,
                  endDate: values.endDate,
                });
              } catch (error) {
                toast.error(normalizeApiError(error).message);
                return;
              }
              if (!campaignId) return;

              setCreatedCampaignId(campaignId);
              if (!mediaQueue.hasQueued) {
                onOpenChange(false);
                return;
              }

              const result = await mediaQueue.uploadAll({ model: "campaign", modelId: campaignId, prop: "images" });
              if (result.failed === 0) {
                onOpenChange(false);
                return;
              }

              toast.error(`تم إنشاء الحملة، لكن فشل رفع: ${result.failedFileNames.join("، ")}`);
            })}
          >
            <SheetHeader className="border-b border-border pe-12 text-right">
              <SheetTitle className="text-right text-lg">{mode === "create" ? "إضافة حملة جديدة" : "تعديل الحملة"}</SheetTitle>
            </SheetHeader>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-title">عنوان الحملة</Label>
                <Input id="campaign-title" disabled={formLocked} aria-invalid={Boolean(errors.title)} placeholder="أدخل عنوان الحملة" {...register("title")} />
                {errors.title ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-summary">ملخص الحملة</Label>
                <Textarea id="campaign-summary" disabled={formLocked} aria-invalid={Boolean(errors.summary)} placeholder="وصف مختصر للحملة" className="min-h-28 text-sm" {...register("summary")} />
                {errors.summary ? <p className="text-xs text-destructive">{errors.summary.message}</p> : null}
              </div>

              <div className="space-y-2">
                <Label>الفئة المستهدفة</Label>
                <Controller control={control} name="audience" render={({ field }) => (
                  <Select dir="rtl" disabled={formLocked} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full text-right" aria-invalid={Boolean(errors.audience)}>
                      <SelectValue placeholder="اختر الفئة المستهدفة" />
                    </SelectTrigger>
                    <SelectContent align="start" position="popper" className="text-right">
                      {Object.entries(organizationCampaignAudienceLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value} className="text-right text-xs">{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )} />
                {errors.audience ? <p className="text-xs text-destructive">{errors.audience.message}</p> : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>تصنيف الحملة</Label>
                  <Controller control={control} name="categoryId" render={({ field }) => (
                    <Select dir="rtl" disabled={formLocked || categoriesBrief.isLoading} value={field.value || undefined} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full text-right" aria-invalid={Boolean(errors.categoryId)}>
                        <SelectValue placeholder={categoriesBrief.isLoading ? "جاري تحميل التصنيفات..." : "اختر التصنيف"} />
                      </SelectTrigger>
                      <SelectContent align="start" position="popper" className="text-right">
                        {(categoriesBrief.data?.data ?? []).map((category) => (
                          <SelectItem key={category.id} value={category.id} className="text-right text-xs">{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )} />
                  {errors.categoryId ? <p className="text-xs text-destructive">{errors.categoryId.message}</p> : null}
                  {categoriesBrief.isError ? <p className="text-xs text-destructive">تعذر تحميل التصنيفات المتاحة.</p> : null}
                </div>

                <div className="space-y-2">
                  <Label>حالة الحملة</Label>
                  <Controller control={control} name="status" render={({ field }) => (
                    <Select dir="rtl" disabled={formLocked} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full text-right" aria-invalid={Boolean(errors.status)}><SelectValue /></SelectTrigger>
                      <SelectContent align="start" position="popper" className="text-right">
                        {Object.entries(organizationCampaignStatusLabels)
                          .filter(([status]) => mode === "edit" || status !== "closed")
                          .map(([status, label]) => <SelectItem key={status} value={status} className="text-right text-xs">{label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>المحافظة</Label>
                <Controller control={control} name="location" render={({ field }) => (
                  <Select dir="rtl" disabled={formLocked} value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full text-right" aria-invalid={Boolean(errors.location)}><SelectValue placeholder="اختر المحافظة" /></SelectTrigger>
                    <SelectContent align="start" position="popper" className="text-right">
                      {syrianGovernorateOptions.map((option) => <SelectItem key={option.value} value={option.value} className="text-right text-xs">{option.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
                {errors.location ? <p className="text-xs text-destructive">{errors.location.message}</p> : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="campaign-goal-amount">الهدف المالي</Label>
                  <Input id="campaign-goal-amount" type="number" min={0} step="0.01" disabled={formLocked} aria-invalid={Boolean(errors.goalAmount)} {...register("goalAmount")} />
                  {errors.goalAmount ? <p className="text-xs text-destructive">{errors.goalAmount.message}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-beneficiaries">عدد المستفيدين</Label>
                  <Input id="campaign-beneficiaries" type="number" min={0} step={1} disabled={formLocked} aria-invalid={Boolean(errors.beneficiariesCount)} {...register("beneficiariesCount")} />
                  {errors.beneficiariesCount ? <p className="text-xs text-destructive">{errors.beneficiariesCount.message}</p> : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="campaign-start-date">تاريخ البداية</Label>
                  <Input id="campaign-start-date" type="date" disabled={formLocked} aria-invalid={Boolean(errors.startDate)} {...register("startDate")} />
                  {errors.startDate ? <p className="text-xs text-destructive">{errors.startDate.message}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-end-date">تاريخ النهاية</Label>
                  <Input id="campaign-end-date" type="date" disabled={formLocked} aria-invalid={Boolean(errors.endDate)} {...register("endDate")} />
                  {errors.endDate ? <p className="text-xs text-destructive">{errors.endDate.message}</p> : null}
                </div>
              </div>

              <MediaUploadField
                label="صور الحملة - اختياري"
                items={mediaQueue.items}
                maxItems={10}
                disabled={isBusy || Boolean(createdCampaignId && mediaQueue.failedItems.length === 0)}
                onFilesSelected={mediaQueue.addFiles}
                onRemoveQueued={mediaQueue.removeItem}
                onRetry={target ? async (id) => {
                  const succeeded = await mediaQueue.retryItem(target, id);
                  if (!succeeded) {
                    const failed = mediaQueue.items.find((item) => item.id === id);
                    toast.error(`تعذر رفع الصورة ${failed?.file.name ?? ""}`);
                  }
                } : undefined}
              />

              {createdCampaignId && mediaQueue.failedItems.length > 0 ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                  تم إنشاء الحملة. أعد محاولة الصور الفاشلة أو أغلق النافذة للمتابعة بالصور التي نجحت.
                </p>
              ) : null}
            </div>

            <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
              <Button type="button" variant="outline" disabled={isBusy} onClick={closeSheetSafely}>
                {createdCampaignId ? "إنهاء" : "إلغاء"}
              </Button>
              {!createdCampaignId ? (
                <Button type="submit" disabled={isBusy}>
                  {isBusy ? <Loader2 className="size-4 animate-spin" /> : null}
                  {isBusy ? "جاري الحفظ والرفع..." : mode === "create" ? "إضافة الحملة" : "حفظ التعديلات"}
                </Button>
              ) : null}
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <Dialog open={discardDialogOpen} onOpenChange={setDiscardDialogOpen}>
        <DialogContent dir="rtl" className="sm:max-w-md">
          <DialogHeader className="pe-12 text-right sm:text-right">
            <DialogTitle>تجاهل التعديلات؟</DialogTitle>
            <DialogDescription>لديك تغييرات غير محفوظة. هل تريد إغلاق نموذج التعديل دون حفظ؟</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="outline" onClick={() => setDiscardDialogOpen(false)}>متابعة التعديل</Button>
            <Button type="button" variant="destructive" onClick={() => { setDiscardDialogOpen(false); onOpenChange(false); }}>تجاهل التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
