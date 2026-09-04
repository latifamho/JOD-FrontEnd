"use client";

import * as React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { MediaUploadField } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { syrianGovernorateOptions } from "@/components/pages/organization-campaigns/static-data";
import { isCampaignRelatedPostType } from "@/components/pages/organization-posts-management/helpers";
import {
  organizationPostStatusLabels,
  organizationPostTypeLabels,
  type OrganizationPostStatus,
  type OrganizationPostType,
} from "@/components/pages/organization-posts-management/static-data";
import { useOrgCampaignsBrief } from "@/features/org/campaigns/org.campaigns.query";
import { useOrgCategoriesBrief } from "@/features/org/categories/org.categories.query";
import { useOrgCapabilitiesBrief } from "@/features/org/capabilities/org.capabilities.query";
import { useMediaUploadQueue } from "@/hooks/use-media-upload-queue";
import { useQueryDisclosure } from "@/hooks/use-query-modal";
import { toast } from "@/lib/toast";
import { normalizeApiError } from "@/lib/api-errors";

const postFormSchema = z
  .object({
    title: z.string().min(1, "عنوان البوست مطلوب").max(255, "عنوان البوست يجب ألا يتجاوز 255 حرفًا").refine((value) => value.trim().length > 0, "عنوان البوست مطلوب"),
    summary: z.string().min(1, "محتوى البوست مطلوب").refine((value) => value.trim().length > 0, "محتوى البوست مطلوب"),
    categoryId: z.string().min(1, "تصنيف البوست مطلوب"),
    type: z.enum(["general", "job_opportunity", "campaign_teaser", "campaign_update", "campaign_summary", "service_offer", "volunteer_opportunity", "awareness", "help_request"]),
    status: z.enum(["draft", "published"]),
    location: z.string().min(1, "المحافظة مطلوبة").refine(
      (value) => syrianGovernorateOptions.some((option) => option.value === value),
      "اختر محافظة سورية صحيحة",
    ),
    campaignTitle: z.string(),
    urgency: z.enum(["normal", "important", "urgent"]),
    urgencyReason: z.string(),
    expiresAt: z.string(),
    requiredCapabilityIds: z.array(z.string()).max(20),
  })
  .superRefine((values, context) => {
    if (isCampaignRelatedPostType(values.type) && values.campaignTitle.trim().length === 0) {
      context.addIssue({ code: "custom", path: ["campaignTitle"], message: "الحملة المرتبطة مطلوبة لهذا النوع من البوستات" });
    }
    if (values.type === "help_request" && values.urgency === "urgent" && values.urgencyReason.trim().length < 8) {
      context.addIssue({ code: "custom", path: ["urgencyReason"], message: "سبب الاستعجال مطلوب للحالة العاجلة وبحد أدنى 8 أحرف" });
    }
    if (values.type === "help_request" && values.expiresAt && new Date(values.expiresAt).getTime() <= Date.now()) {
      context.addIssue({ code: "custom", path: ["expiresAt"], message: "يجب أن يكون الموعد في المستقبل" });
    }
  });

type PostFormFields = z.infer<typeof postFormSchema>;

export type PostFormValues = {
  title: string;
  summary: string;
  categoryId: string;
  type: OrganizationPostType;
  status: OrganizationPostStatus;
  location: string;
  campaignTitle: string;
  urgency: "normal" | "important" | "urgent";
  urgencyReason: string;
  expiresAt: string;
  requiredCapabilityIds: string[];
};

export const EMPTY_POST_FORM_VALUES: PostFormValues = {
  title: "",
  summary: "",
  categoryId: "",
  type: "general",
  status: "published",
  location: "",
  campaignTitle: "",
  urgency: "normal",
  urgencyReason: "",
  expiresAt: "",
  requiredCapabilityIds: [],
};

type PostFormSheetProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues: PostFormValues;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PostFormValues) => Promise<string | null | undefined>;
};

function toPostFormFields(values: PostFormValues): PostFormFields {
  return { ...values };
}

export function PostFormSheet({ open, mode, initialValues, isSubmitting = false, onOpenChange, onSubmit }: PostFormSheetProps) {
  const { register, control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<PostFormFields>({
    resolver: zodResolver(postFormSchema),
    defaultValues: toPostFormFields(initialValues),
  });
  const selectedType = useWatch({ control, name: "type" });
  const campaignRelated = isCampaignRelatedPostType(selectedType);
  const helpRequest = selectedType === "help_request";
  const campaignsBrief = useOrgCampaignsBrief(open && campaignRelated);
  const categoriesBrief = useOrgCategoriesBrief(open);
  const capabilitiesBrief = useOrgCapabilitiesBrief(open && helpRequest);
  const mediaQueue = useMediaUploadQueue(10);
  const videoQueue = useMediaUploadQueue(10, "video");
  const [createdPostId, setCreatedPostId] = React.useState<string | null>(null);
  const [discardDialogOpen, setDiscardDialogOpen] = useQueryDisclosure(
    "post-discard-changes",
    { queryKey: "dialog", permission: "org.posts.create" },
  );

  React.useEffect(() => {
    if (open) {
      reset(toPostFormFields(initialValues));
      mediaQueue.reset();
      videoQueue.reset();
      setCreatedPostId(null);
    }
  }, [initialValues, open, reset]);

  const isBusy = isSubmitting || mediaQueue.isUploading || videoQueue.isUploading;
  const formLocked = isBusy || Boolean(createdPostId);
  const hasUnsavedEditChanges = mode === "edit" && isDirty;
  const imageTarget = createdPostId ? { model: "post" as const, modelId: createdPostId, prop: "images" as const } : null;
  const videoTarget = createdPostId ? { model: "post" as const, modelId: createdPostId, prop: "videos" as const } : null;

  const closeSheetSafely = React.useCallback(() => {
    if (isBusy) return;
    if (hasUnsavedEditChanges) {
      setDiscardDialogOpen(true);
      return;
    }
    onOpenChange(false);
  }, [hasUnsavedEditChanges, isBusy, onOpenChange, setDiscardDialogOpen]);

  return (
    <>
      <Sheet open={open} onOpenChange={(nextOpen) => {
        if (!nextOpen && isBusy) return;
        if (nextOpen) onOpenChange(true);
        else closeSheetSafely();
      }}>
        <SheetContent side="right" dir="rtl" className="w-[95vw] border-border p-0 sm:max-w-xl">
          <form
            noValidate
            className="flex h-full flex-col"
            onSubmit={handleSubmit(async (values) => {
              if (createdPostId) return;
              let postId: string | null | undefined;
              try {
                postId = await onSubmit({
                  title: values.title.trim(),
                  summary: values.summary.trim(),
                  categoryId: values.categoryId,
                  type: values.type,
                  status: values.status,
                  location: values.location,
                  campaignTitle: isCampaignRelatedPostType(values.type) ? values.campaignTitle.trim() : "",
                  urgency: values.type === "help_request" ? values.urgency : "normal",
                  urgencyReason: values.type === "help_request" ? values.urgencyReason.trim() : "",
                  expiresAt: values.type === "help_request" ? values.expiresAt : "",
                  requiredCapabilityIds: values.type === "help_request" ? values.requiredCapabilityIds : [],
                });
              } catch (error) {
                toast.error(normalizeApiError(error).message);
                return;
              }
              if (!postId) return;
              setCreatedPostId(postId);

              if (!mediaQueue.hasQueued && !videoQueue.hasQueued) {
                onOpenChange(false);
                return;
              }

              const [imagesResult, videosResult] = await Promise.all([
                mediaQueue.uploadAll({ model: "post", modelId: postId, prop: "images" }),
                videoQueue.uploadAll({ model: "post", modelId: postId, prop: "videos" }),
              ]);
              const failedFileNames = [...imagesResult.failedFileNames, ...videosResult.failedFileNames];
              if (failedFileNames.length === 0) {
                onOpenChange(false);
                return;
              }
              toast.error(`تم إنشاء البوست، لكن فشل رفع: ${failedFileNames.join("، ")}`);
            })}
          >
            <SheetHeader className="border-b border-border pe-12 text-right">
              <SheetTitle className="text-right text-lg">{mode === "create" ? "إضافة بوست جديد" : "تعديل البوست"}</SheetTitle>
            </SheetHeader>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <div className="space-y-2">
                <Label htmlFor="post-title">عنوان البوست</Label>
                <Input id="post-title" disabled={formLocked} aria-invalid={Boolean(errors.title)} placeholder="أدخل عنوان البوست" {...register("title")} />
                {errors.title ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="post-summary">محتوى مختصر</Label>
                <Textarea id="post-summary" disabled={formLocked} aria-invalid={Boolean(errors.summary)} placeholder="اكتب ملخص محتوى البوست" className="min-h-30 text-sm" {...register("summary")} />
                {errors.summary ? <p className="text-xs text-destructive">{errors.summary.message}</p> : null}
              </div>

              <div className="space-y-2">
                <Label>تصنيف البوست</Label>
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>نوع البوست</Label>
                  <Controller control={control} name="type" render={({ field }) => (
                    <Select dir="rtl" disabled={formLocked} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full text-right" aria-invalid={Boolean(errors.type)}><SelectValue /></SelectTrigger>
                      <SelectContent align="start" position="popper" className="text-right">
                        {Object.entries(organizationPostTypeLabels).map(([type, label]) => <SelectItem key={type} value={type} className="text-right text-xs">{label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )} />
                </div>
                <div className="space-y-2">
                  <Label>الحالة</Label>
                  <Controller control={control} name="status" render={({ field }) => (
                    <Select dir="rtl" disabled={formLocked} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full text-right" aria-invalid={Boolean(errors.status)}><SelectValue /></SelectTrigger>
                      <SelectContent align="start" position="popper" className="text-right">
                        {Object.entries(organizationPostStatusLabels)
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

              {campaignRelated ? (
                <div className="space-y-2">
                  <Label>الحملة المرتبطة</Label>
                  <Controller control={control} name="campaignTitle" render={({ field }) => (
                    <Select dir="rtl" disabled={formLocked || campaignsBrief.isLoading} value={field.value || undefined} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full text-right" aria-invalid={Boolean(errors.campaignTitle)}>
                        <SelectValue placeholder={campaignsBrief.isLoading ? "جاري تحميل الحملات..." : "اختر الحملة"} />
                      </SelectTrigger>
                      <SelectContent align="start" position="popper" className="text-right">
                        {(campaignsBrief.data?.data ?? []).map((campaign) => <SelectItem key={campaign.id} value={campaign.name} className="text-right text-xs">{campaign.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )} />
                  {errors.campaignTitle ? <p className="text-xs text-destructive">{errors.campaignTitle.message}</p> : null}
                  {campaignsBrief.isError ? <p className="text-xs text-destructive">تعذر تحميل الحملات المتاحة.</p> : null}
                </div>
              ) : null}

              {helpRequest ? (
                <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-4">
                  <div>
                    <h3 className="text-sm font-semibold">تفاصيل طلب المساعدة</h3>
                    <p className="mt-1 text-xs text-muted-foreground">حدد درجة الاستعجال والموعد والقدرات المطلوبة لتحسين المطابقة.</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>الاستعجال</Label>
                      <Controller control={control} name="urgency" render={({ field }) => (
                        <Select dir="rtl" disabled={formLocked} value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full text-right"><SelectValue /></SelectTrigger>
                          <SelectContent align="start"><SelectItem value="normal">عادي</SelectItem><SelectItem value="important">مهم</SelectItem><SelectItem value="urgent">عاجل</SelectItem></SelectContent>
                        </Select>
                      )} />
                      <p className="text-[11px] text-muted-foreground">الحالات الحرجة يتم اعتمادها من إدارة المنصة.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="post-expires-at">مطلوب حتى</Label>
                      <Input id="post-expires-at" type="datetime-local" disabled={formLocked} aria-invalid={Boolean(errors.expiresAt)} {...register("expiresAt")} />
                      {errors.expiresAt ? <p className="text-xs text-destructive">{errors.expiresAt.message}</p> : <p className="text-[11px] text-muted-foreground">بعد انتهاء الموعد لن يظهر الطلب ضمن المطابقة النشطة.</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="post-urgency-reason">سبب الاستعجال</Label>
                    <Textarea id="post-urgency-reason" disabled={formLocked} aria-invalid={Boolean(errors.urgencyReason)} placeholder="اشرح سبب الاستعجال عند اختيار عاجل" {...register("urgencyReason")} />
                    {errors.urgencyReason ? <p className="text-xs text-destructive">{errors.urgencyReason.message}</p> : null}
                  </div>
                  <div className="space-y-2">
                    <Label>نوع المساعدة المطلوبة</Label>
                    <Controller control={control} name="requiredCapabilityIds" render={({ field }) => (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {(capabilitiesBrief.data?.data ?? []).map((capability) => {
                          const checked = field.value.includes(capability.id);
                          return <label key={capability.id} className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm"><Checkbox checked={checked} disabled={formLocked} onCheckedChange={(next) => field.onChange(Boolean(next) ? [...field.value, capability.id] : field.value.filter((id) => id !== capability.id))} /><span>{capability.name}</span></label>;
                        })}
                      </div>
                    )} />
                    {capabilitiesBrief.isError ? <p className="text-xs text-destructive">تعذر تحميل أنواع المساعدة.</p> : null}
                  </div>
                </div>
              ) : null}

              <MediaUploadField
                label="صور البوست - اختياري"
                items={mediaQueue.items}
                maxItems={10}
                disabled={isBusy || Boolean(createdPostId && mediaQueue.failedItems.length === 0)}
                onFilesSelected={mediaQueue.addFiles}
                onRemoveQueued={mediaQueue.removeItem}
                onRetry={imageTarget ? async (id) => {
                  const item = mediaQueue.items.find((candidate) => candidate.id === id);
                  const succeeded = await mediaQueue.retryItem(imageTarget, id);
                  if (!succeeded) toast.error(`تعذر رفع الصورة ${item?.file.name ?? ""}`);
                } : undefined}
              />

              <MediaUploadField
                label="فيديوهات البوست - اختياري"
                mediaKind="video"
                items={videoQueue.items}
                maxItems={10}
                disabled={isBusy || Boolean(createdPostId && videoQueue.failedItems.length === 0)}
                onFilesSelected={videoQueue.addFiles}
                onRemoveQueued={videoQueue.removeItem}
                onRetry={videoTarget ? async (id) => {
                  const item = videoQueue.items.find((candidate) => candidate.id === id);
                  const succeeded = await videoQueue.retryItem(videoTarget, id);
                  if (!succeeded) toast.error(`تعذر رفع الفيديو ${item?.file.name ?? ""}`);
                } : undefined}
              />

              {createdPostId && (mediaQueue.failedItems.length > 0 || videoQueue.failedItems.length > 0) ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                  تم إنشاء البوست. أعد محاولة الصور الفاشلة أو أغلق النافذة للمتابعة بالصور التي نجحت.
                </p>
              ) : null}
            </div>

            <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
              <Button type="button" variant="outline" disabled={isBusy} onClick={closeSheetSafely}>{createdPostId ? "إنهاء" : "إلغاء"}</Button>
              {!createdPostId ? (
                <Button type="submit" disabled={isBusy}>
                  {isBusy ? <Loader2 className="size-4 animate-spin" /> : null}
                  {isBusy ? "جاري الحفظ والرفع..." : mode === "create" ? "إضافة البوست" : "حفظ التعديلات"}
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
            <DialogDescription>لديك تغييرات غير محفوظة، هل تريد إغلاق نموذج التعديل دون حفظ؟</DialogDescription>
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
