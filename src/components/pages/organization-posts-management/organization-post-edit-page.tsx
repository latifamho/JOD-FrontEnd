"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { EmptyState, FormLoadingSkeleton, MediaUploadField } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { syrianGovernorateOptions } from "@/components/pages/organization-campaigns/static-data";
import { isCampaignRelatedPostType } from "@/components/pages/organization-posts-management/helpers";
import { organizationPostTypeLabels, type OrganizationPostItem } from "@/components/pages/organization-posts-management/static-data";
import { routePaths } from "@/constant/routes";
import { useOrgCampaignsBrief } from "@/features/org/campaigns/org.campaigns.query";
import { useOrgCategoriesBrief } from "@/features/org/categories/org.categories.query";
import { useOrgCapabilitiesBrief } from "@/features/org/capabilities/org.capabilities.query";
import { useOrgPost, useUpdateOrgPost } from "@/features/org/posts/org.posts.query";
import { mediaServices } from "@/features/shared/media/media.services";
import { useMediaUploadQueue } from "@/hooks/use-media-upload-queue";
import { toast } from "@/lib/toast";
import { normalizeApiError } from "@/lib/api-errors";
import { useAuth } from "@/providers/AuthProvider";

const schema = z.object({
  title: z.string().trim().min(1, "عنوان المنشور مطلوب"),
  summary: z.string().trim().min(1, "محتوى المنشور مطلوب"),
  categoryId: z.string().min(1, "تصنيف المنشور مطلوب"),
  type: z.enum(["general", "job_opportunity", "campaign_teaser", "campaign_update", "campaign_summary", "service_offer", "volunteer_opportunity", "awareness", "help_request"]),
  location: z.string().refine((value) => syrianGovernorateOptions.some((option) => option.value === value), "اختر محافظة سورية صحيحة"),
  campaignTitle: z.string(),
  urgency: z.enum(["normal", "important", "urgent"]),
  urgencyReason: z.string(),
  expiresAt: z.string(),
  requiredCapabilityIds: z.array(z.string()).max(20),
}).superRefine((values, context) => {
  if (isCampaignRelatedPostType(values.type) && !values.campaignTitle.trim()) {
    context.addIssue({ code: "custom", path: ["campaignTitle"], message: "الحملة المرتبطة مطلوبة" });
  }
  if (values.type === "help_request" && values.urgency === "urgent" && values.urgencyReason.trim().length < 8) {
    context.addIssue({ code: "custom", path: ["urgencyReason"], message: "سبب الاستعجال مطلوب للحالة العاجلة وبحد أدنى 8 أحرف" });
  }
  if (values.type === "help_request" && values.expiresAt && new Date(values.expiresAt).getTime() <= Date.now()) {
    context.addIssue({ code: "custom", path: ["expiresAt"], message: "يجب أن يكون الموعد في المستقبل" });
  }
});

type FormValues = z.infer<typeof schema>;
type Props = { postId: string; scope: "owner" | "staff" };

export function OrganizationPostEditPage({ postId, scope }: Props) {
  const { can } = useAuth();
  const query = useOrgPost(postId);
  const post = query.data?.data;
  const detailsRoute = scope === "staff" ? routePaths.organizationStaffScope.postDetails(postId) : routePaths.organizationOwnerScope.postDetails(postId);
  const listRoute = scope === "staff" ? routePaths.organizationStaffScope.posts : routePaths.organizationOwnerScope.posts;

  if (query.isLoading) return <FormLoadingSkeleton count={7} className="rounded-xl border border-border bg-card p-4 sm:p-6" />;
  if (!can("org.posts.update")) return <section className="space-y-4"><EmptyState icon="ShieldOff" title="لا تملك صلاحية تعديل المنشورات" description="يمكنك الرجوع إلى تفاصيل المنشور." /><Button asChild variant="outline"><Link href={detailsRoute}>الرجوع</Link></Button></section>;
  if (!post || query.isError) return <section className="space-y-4"><EmptyState icon="posts" title="تعذر تحميل المنشور" description="حاول إعادة تحميل البيانات." /><Button asChild variant="outline"><Link href={listRoute}>الرجوع إلى المنشورات</Link></Button></section>;

  return <PostEditForm post={post} detailsRoute={detailsRoute} refetch={query.refetch} />;
}

function PostEditForm({ post, detailsRoute, refetch }: { post: OrganizationPostItem; detailsRoute: string; refetch: () => Promise<unknown> }) {
  const router = useRouter();
  const updateMutation = useUpdateOrgPost();
  const categoriesBrief = useOrgCategoriesBrief();
  const mediaQueue = useMediaUploadQueue(10);
  const videoQueue = useMediaUploadQueue(10, "video");
  const [pendingDeleteIds, setPendingDeleteIds] = React.useState<Set<string>>(new Set());
  const [pendingReplacements, setPendingReplacements] = React.useState<Map<string, File>>(new Map());
  const [processingMedia, setProcessingMedia] = React.useState(false);
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: post.title, summary: post.summary, categoryId: post.categoryId ?? "", type: post.type, location: post.location, campaignTitle: post.campaignTitle ?? "", urgency: post.urgency === "important" || post.urgency === "urgent" ? post.urgency : "normal", urgencyReason: post.urgencyReason ?? "", expiresAt: post.expiresAt ? new Date(new Date(post.expiresAt).getTime() - new Date(post.expiresAt).getTimezoneOffset() * 60000).toISOString().slice(0,16) : "", requiredCapabilityIds: post.requiredCapabilities?.map((item) => item.id) ?? [] },
  });
  const selectedType = useWatch({ control, name: "type" });
  const campaignRelated = isCampaignRelatedPostType(selectedType);
  const helpRequest = selectedType === "help_request";
  const capabilitiesBrief = useOrgCapabilitiesBrief(helpRequest);
  const campaignsBrief = useOrgCampaignsBrief(campaignRelated);
  const imageTarget = { model: "post" as const, modelId: post.id, prop: "images" as const };
  const videoTarget = { model: "post" as const, modelId: post.id, prop: "videos" as const };
  const visibleMedia = (post.media ?? []).filter((media) => !pendingDeleteIds.has(media.id));
  const existingImages = visibleMedia.filter((media) => media.prop === "images");
  const existingVideos = visibleMedia.filter((media) => media.prop === "videos");
  const pendingMediaIds = new Set([...pendingDeleteIds, ...pendingReplacements.keys()]);
  const isBusy = updateMutation.isPending || mediaQueue.isUploading || videoQueue.isUploading || processingMedia;

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div><h2 className="text-lg font-semibold">تعديل المنشور</h2><p className="mt-1 text-sm text-muted-foreground">حدّث بيانات المنشور والصور ثم احفظ التغييرات.</p></div>
      <form noValidate className="space-y-5 rounded-xl border bg-card p-4 sm:p-6" onSubmit={handleSubmit(async (values) => {
        try {
          await updateMutation.mutateAsync({ postId: post.id, body: {
            title: values.title.trim(), summary: values.summary.trim(), categoryId: values.categoryId, type: values.type, location: values.location,
            campaignTitle: isCampaignRelatedPostType(values.type) ? values.campaignTitle.trim() : undefined,
            urgency: values.type === "help_request" ? values.urgency : undefined,
            urgencyReason: values.type === "help_request" && values.urgencyReason.trim() ? values.urgencyReason.trim() : undefined,
            expiresAt: values.type === "help_request" && values.expiresAt ? new Date(values.expiresAt).toISOString() : undefined,
            requiredCapabilityIds: values.type === "help_request" ? values.requiredCapabilityIds : undefined,
          }});
        } catch (error) {
          toast.error(normalizeApiError(error).message);
          return;
        }
        setProcessingMedia(true);
        const failedOperations: string[] = [];
        try {
          for (const mediaId of pendingDeleteIds) {
            try {
              const media = (post.media ?? []).find((item) => item.id === mediaId);
              const mediaTarget = media?.prop === "videos" ? videoTarget : imageTarget;
              await mediaServices.remove(mediaTarget, mediaId);
              setPendingDeleteIds((current) => { const next = new Set(current); next.delete(mediaId); return next; });
            } catch {
              failedOperations.push(`حذف صورة ${mediaId}`);
            }
          }

          for (const [mediaId, file] of pendingReplacements) {
            try {
              const media = (post.media ?? []).find((item) => item.id === mediaId);
              const mediaTarget = media?.prop === "videos" ? videoTarget : imageTarget;
              await mediaServices.replace(mediaTarget, mediaId, file);
              setPendingReplacements((current) => { const next = new Map(current); next.delete(mediaId); return next; });
            } catch {
              failedOperations.push(`استبدال ${file.name}`);
            }
          }

          if (mediaQueue.hasQueued) {
            const result = await mediaQueue.uploadAll(imageTarget);
            failedOperations.push(...result.failedFileNames.map((name) => `رفع ${name}`));
          }
          if (videoQueue.hasQueued) {
            const result = await videoQueue.uploadAll(videoTarget);
            failedOperations.push(...result.failedFileNames.map((name) => `رفع ${name}`));
          }
        } finally {
          setProcessingMedia(false);
        }

        if (failedOperations.length > 0) {
          await refetch();
          toast.error(`تم حفظ المنشور، لكن تعذر: ${failedOperations.join("، ")}. يمكنك إعادة الحفظ للمحاولة مجددًا.`);
          return;
        }
        router.push(detailsRoute);
      })}>
        <Field label="عنوان المنشور" error={errors.title?.message}><Input disabled={isBusy} aria-invalid={Boolean(errors.title)} {...register("title")} /></Field>
        <Field label="محتوى مختصر" error={errors.summary?.message}><Textarea className="min-h-32" disabled={isBusy} aria-invalid={Boolean(errors.summary)} {...register("summary")} /></Field>
        <Field label="التصنيف" error={errors.categoryId?.message}>
          <Controller control={control} name="categoryId" render={({ field }) => (
            <Select value={field.value || undefined} onValueChange={field.onChange} disabled={isBusy || categoriesBrief.isLoading}>
              <SelectTrigger aria-invalid={Boolean(errors.categoryId)}><SelectValue placeholder={categoriesBrief.isLoading ? "جاري تحميل التصنيفات..." : "اختر التصنيف"} /></SelectTrigger>
              <SelectContent>{(categoriesBrief.data?.data ?? []).map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}</SelectContent>
            </Select>
          )} />
          {categoriesBrief.isError ? <p className="text-xs text-destructive">تعذر تحميل التصنيفات المتاحة.</p> : null}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="نوع المنشور"><Controller control={control} name="type" render={({ field }) => <Select value={field.value} onValueChange={field.onChange} disabled={isBusy}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(organizationPostTypeLabels).map(([value,label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select>} /></Field>
          <Field label="المحافظة" error={errors.location?.message}><Controller control={control} name="location" render={({ field }) => <Select value={field.value} onValueChange={field.onChange} disabled={isBusy}><SelectTrigger aria-invalid={Boolean(errors.location)}><SelectValue placeholder="اختر المحافظة" /></SelectTrigger><SelectContent>{syrianGovernorateOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select>} /></Field>
        </div>
        {campaignRelated ? (
          <Field label="الحملة المرتبطة" error={errors.campaignTitle?.message}>
            <Controller control={control} name="campaignTitle" render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange} disabled={isBusy || campaignsBrief.isLoading}>
                <SelectTrigger aria-invalid={Boolean(errors.campaignTitle)}><SelectValue placeholder={campaignsBrief.isLoading ? "جاري تحميل الحملات..." : "اختر الحملة"} /></SelectTrigger>
                <SelectContent>{(campaignsBrief.data?.data ?? []).map((campaign) => <SelectItem key={campaign.id} value={campaign.name}>{campaign.name}</SelectItem>)}</SelectContent>
              </Select>
            )} />
          </Field>
        ) : null}
        {helpRequest ? (
          <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
            <div><h3 className="font-semibold">تفاصيل طلب المساعدة</h3><p className="text-xs text-muted-foreground">يمكن تحديث الاستعجال والموعد والقدرات المطلوبة.</p></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="الاستعجال"><Controller control={control} name="urgency" render={({ field }) => <Select value={field.value} onValueChange={field.onChange} disabled={isBusy}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="normal">عادي</SelectItem><SelectItem value="important">مهم</SelectItem><SelectItem value="urgent">عاجل</SelectItem></SelectContent></Select>} /><p className="text-[11px] text-muted-foreground">الحالات الحرجة تعتمدها إدارة المنصة فقط.</p></Field>
              <Field label="مطلوب حتى" error={errors.expiresAt?.message}><Input type="datetime-local" disabled={isBusy} {...register("expiresAt")} /></Field>
            </div>
            <Field label="سبب الاستعجال" error={errors.urgencyReason?.message}><Textarea disabled={isBusy} placeholder="اشرح سبب الاستعجال عند اختيار عاجل" {...register("urgencyReason")} /></Field>
            <Field label="نوع المساعدة المطلوبة">
              <Controller control={control} name="requiredCapabilityIds" render={({ field }) => <div className="grid gap-2 sm:grid-cols-2">{(capabilitiesBrief.data?.data ?? []).map((capability) => { const checked = field.value.includes(capability.id); return <label key={capability.id} className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm"><Checkbox checked={checked} disabled={isBusy} onCheckedChange={(next) => field.onChange(Boolean(next) ? [...field.value, capability.id] : field.value.filter((id) => id !== capability.id))} /><span>{capability.name}</span></label> })}</div>} />
            </Field>
          </div>
        ) : null}
        <MediaUploadField
          label="صور المنشور"
          items={mediaQueue.items}
          existingMedia={existingImages}
          busyMediaIds={pendingMediaIds}
          maxItems={10}
          disabled={isBusy}
          onFilesSelected={mediaQueue.addFiles}
          onRemoveQueued={mediaQueue.removeItem}
          onRetry={(id) => void mediaQueue.retryItem(imageTarget, id)}
          onDeleteExisting={(media) => {
            setPendingReplacements((current) => { const next = new Map(current); next.delete(media.id); return next; });
            setPendingDeleteIds((current) => new Set(current).add(media.id));
          }}
          onReplaceExisting={(media, file) => {
            setPendingDeleteIds((current) => { const next = new Set(current); next.delete(media.id); return next; });
            setPendingReplacements((current) => new Map(current).set(media.id, file));
          }}
        />
        <div className="flex gap-2 border-t pt-4">
        <MediaUploadField
          label="فيديوهات المنشور"
          mediaKind="video"
          items={videoQueue.items}
          existingMedia={existingVideos}
          busyMediaIds={pendingMediaIds}
          maxItems={10}
          disabled={isBusy}
          onFilesSelected={videoQueue.addFiles}
          onRemoveQueued={videoQueue.removeItem}
          onRetry={(id) => void videoQueue.retryItem(videoTarget, id)}
          onDeleteExisting={(media) => {
            setPendingReplacements((current) => { const next = new Map(current); next.delete(media.id); return next; });
            setPendingDeleteIds((current) => new Set(current).add(media.id));
          }}
          onReplaceExisting={(media, file) => {
            setPendingDeleteIds((current) => { const next = new Set(current); next.delete(media.id); return next; });
            setPendingReplacements((current) => new Map(current).set(media.id, file));
          }}
        />
          <Button type="submit" disabled={isBusy}>{updateMutation.isPending || mediaQueue.isUploading ? <Loader2 className="size-4 animate-spin" /> : null}حفظ التعديلات</Button>
          <Button type="button" variant="outline" disabled={isBusy} onClick={() => router.push(detailsRoute)}>إلغاء</Button>
        </div>
      </form>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}{error ? <p className="text-xs text-destructive">{error}</p> : null}</div>;
}
