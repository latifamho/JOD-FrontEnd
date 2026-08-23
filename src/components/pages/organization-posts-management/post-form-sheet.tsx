"use client";

import * as React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
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
import { syrianGovernorateOptions } from "@/components/pages/organization-campaigns/static-data";
import { isCampaignRelatedPostType } from "@/components/pages/organization-posts-management/helpers";
import {
  organizationPostStatusLabels,
  organizationPostTypeLabels,
  type OrganizationPostStatus,
  type OrganizationPostType,
} from "@/components/pages/organization-posts-management/static-data";
import { useQueryDisclosure } from "@/hooks/use-query-modal";

const postFormSchema = z
  .object({
    title: z
      .string()
      .min(1, "عنوان البوست مطلوب")
      .max(255, "عنوان البوست يجب ألا يتجاوز 255 حرفًا")
      .refine((value) => value.trim().length > 0, "عنوان البوست مطلوب"),
    summary: z
      .string()
      .min(1, "محتوى البوست مطلوب")
      .refine((value) => value.trim().length > 0, "محتوى البوست مطلوب"),
    type: z.enum([
      "general",
      "job_opportunity",
      "campaign_teaser",
      "campaign_update",
      "campaign_summary",
    ]),
    status: z.enum(["draft", "published", "archived"]),
    location: z
      .string()
      .min(1, "المحافظة مطلوبة")
      .refine(
        (value) => syrianGovernorateOptions.some((option) => option.value === value),
        "اختر محافظة سورية صحيحة",
      ),
    campaignTitle: z.string(),
  })
  .superRefine((values, context) => {
    if (
      isCampaignRelatedPostType(values.type) &&
      values.campaignTitle.trim().length === 0
    ) {
      context.addIssue({
        code: "custom",
        path: ["campaignTitle"],
        message: "الحملة المرتبطة مطلوبة لهذا النوع من البوستات",
      });
    }
  });

type PostFormFields = z.infer<typeof postFormSchema>;

export type PostFormValues = {
  title: string;
  summary: string;
  type: OrganizationPostType;
  status: OrganizationPostStatus;
  location: string;
  campaignTitle: string;
};

export const EMPTY_POST_FORM_VALUES: PostFormValues = {
  title: "",
  summary: "",
  type: "general",
  status: "published",
  location: "",
  campaignTitle: "",
};

type PostFormSheetProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues: PostFormValues;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PostFormValues) => void;
};

function toPostFormFields(values: PostFormValues): PostFormFields {
  return {
    title: values.title,
    summary: values.summary,
    type: values.type,
    status: values.status,
    location: values.location,
    campaignTitle: values.campaignTitle,
  };
}

export function PostFormSheet({
  open,
  mode,
  initialValues,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
}: PostFormSheetProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PostFormFields>({
    resolver: zodResolver(postFormSchema),
    defaultValues: toPostFormFields(initialValues),
  });
  const [discardDialogOpen, setDiscardDialogOpen] = useQueryDisclosure(
    "post-discard-changes",
    { queryKey: "dialog", permission: "org.posts.create" },
  );

  React.useEffect(() => {
    if (open) {
      reset(toPostFormFields(initialValues));
    }
  }, [initialValues, open, reset]);

  const selectedType = useWatch({ control, name: "type" });
  const campaignRelated = isCampaignRelatedPostType(selectedType);
  const hasUnsavedEditChanges = mode === "edit" && isDirty;

  const closeSheetSafely = React.useCallback(() => {
    if (isSubmitting) {
      return;
    }

    if (hasUnsavedEditChanges) {
      setDiscardDialogOpen(true);
      return;
    }

    onOpenChange(false);
  }, [hasUnsavedEditChanges, isSubmitting, onOpenChange, setDiscardDialogOpen]);

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
            noValidate
            className="flex h-full flex-col"
            onSubmit={handleSubmit((values) => {
              onSubmit({
                title: values.title.trim(),
                summary: values.summary.trim(),
                type: values.type,
                status: values.status,
                location: values.location,
                campaignTitle: isCampaignRelatedPostType(values.type)
                  ? values.campaignTitle.trim()
                  : "",
              });
            })}
          >
            <SheetHeader className="border-b border-border pe-12 text-right">
              <SheetTitle className="text-right text-lg">
                {mode === "create" ? "إضافة بوست جديد" : "تعديل البوست"}
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <div className="space-y-2">
                <Label htmlFor="post-title">عنوان البوست</Label>
                <Input
                  id="post-title"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.title)}
                  placeholder="أدخل عنوان البوست"
                  {...register("title")}
                />
                {errors.title ? (
                  <p className="text-xs text-destructive">{errors.title.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="post-summary">محتوى مختصر</Label>
                <Textarea
                  id="post-summary"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.summary)}
                  placeholder="اكتب ملخص محتوى البوست"
                  className="min-h-30 text-sm"
                  {...register("summary")}
                />
                {errors.summary ? (
                  <p className="text-xs text-destructive">{errors.summary.message}</p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>نوع البوست</Label>
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <Select
                        dir="rtl"
                        disabled={isSubmitting}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className="w-full text-right"
                          aria-invalid={Boolean(errors.type)}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="start" position="popper" className="text-right">
                          {Object.entries(organizationPostTypeLabels).map(([type, label]) => (
                            <SelectItem key={type} value={type} className="text-right text-xs">
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>الحالة</Label>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        dir="rtl"
                        disabled={isSubmitting}
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
                          {Object.entries(organizationPostStatusLabels)
                            .filter(([status]) => mode === "edit" || status !== "archived")
                            .map(([status, label]) => (
                              <SelectItem key={status} value={status} className="text-right text-xs">
                                {label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>المحافظة</Label>
                <Controller
                  control={control}
                  name="location"
                  render={({ field }) => (
                    <Select
                      dir="rtl"
                      disabled={isSubmitting}
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className="w-full text-right"
                        aria-invalid={Boolean(errors.location)}
                      >
                        <SelectValue placeholder="اختر المحافظة" />
                      </SelectTrigger>
                      <SelectContent align="start" position="popper" className="text-right">
                        {syrianGovernorateOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-right text-xs"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.location ? (
                  <p className="text-xs text-destructive">{errors.location.message}</p>
                ) : null}
              </div>

              {campaignRelated ? (
                <div className="space-y-2">
                  <Label htmlFor="post-campaign">الحملة المرتبطة</Label>
                  <Input
                    id="post-campaign"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.campaignTitle)}
                    placeholder="اسم الحملة المرتبطة"
                    {...register("campaignTitle")}
                  />
                  {errors.campaignTitle ? (
                    <p className="text-xs text-destructive">{errors.campaignTitle.message}</p>
                  ) : null}
                </div>
              ) : null}
            </div>

            <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={closeSheetSafely}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
                {isSubmitting
                  ? "جاري الحفظ..."
                  : mode === "create"
                    ? "إضافة البوست"
                    : "حفظ التعديلات"}
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
              لديك تغييرات غير محفوظة، هل تريد إغلاق نموذج التعديل دون حفظ؟
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
