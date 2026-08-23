"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { EmptyState, FormLoadingSkeleton, MediaUploadField } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toDateInputValue, toDateTimeFromInput } from "@/components/pages/organization-campaigns/helpers";
import {
  organizationCampaignCategoryLabels,
  organizationCampaignStatusLabels,
  syrianGovernorateOptions,
} from "@/components/pages/organization-campaigns/static-data";
import { routePaths } from "@/constant/routes";
import { mediaServices } from "@/features/shared/media/media.services";
import { useOrgCampaign, useUpdateOrgCampaign } from "@/features/org/campaigns/org.campaigns.query";
import { useMediaUploadQueue } from "@/hooks/use-media-upload-queue";
import { toast } from "@/lib/toast";
import { useAuth } from "@/providers/AuthProvider";

const schema = z.object({
  title: z.string().trim().min(1, "عنوان الحملة مطلوب"),
  summary: z.string().trim().min(1, "ملخص الحملة مطلوب"),
  category: z.enum(["health", "education", "food", "shelter", "employment", "emergency", "donation", "volunteer", "community"]),
  status: z.enum(["draft", "active"]),
  location: z.string().refine((value) => syrianGovernorateOptions.some((item) => item.value === value), "اختر محافظة سورية صحيحة"),
  goalAmount: z.coerce.number().min(0),
  beneficiariesCount: z.coerce.number().int().min(0),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
}).refine((values) => values.endDate >= values.startDate, { path: ["endDate"], message: "تاريخ النهاية يجب ألا يسبق البداية" });

type FormValues = z.infer<typeof schema>;

type Props = { campaignId: string; scope: "owner" | "staff" };

export function OrganizationCampaignEditPage({ campaignId, scope }: Props) {
  const { can } = useAuth();
  const query = useOrgCampaign(campaignId);
  const campaign = query.data?.data;
  const detailsRoute = scope === "staff" ? routePaths.organizationStaffScope.campaignDetails(campaignId) : routePaths.organizationOwnerScope.campaignDetails(campaignId);
  const listRoute = scope === "staff" ? routePaths.organizationStaffScope.campaigns : routePaths.organizationOwnerScope.campaigns;

  if (query.isLoading) return <FormLoadingSkeleton count={10} className="rounded-xl border border-border bg-card p-4 sm:p-6" />;
  if (!can("org.campaigns.update")) return <section className="space-y-4"><EmptyState icon="ShieldOff" title="لا تملك صلاحية تعديل الحملات" description="يمكنك الرجوع إلى تفاصيل الحملة." /><Button asChild variant="outline"><Link href={detailsRoute}>الرجوع</Link></Button></section>;
  if (!campaign || query.isError) return <section className="space-y-4"><EmptyState icon="campaigns" title="تعذر تحميل الحملة" description="حاول إعادة تحميل البيانات." /><Button asChild variant="outline"><Link href={listRoute}>الرجوع إلى الحملات</Link></Button></section>;
  if (campaign.status === "closed") return <section className="space-y-4"><EmptyState icon="campaigns" title="لا يمكن تعديل حملة مغلقة" description="الحملة متاحة للعرض فقط." /><Button asChild variant="outline"><Link href={detailsRoute}>الرجوع</Link></Button></section>;

  return <CampaignEditForm campaign={campaign} detailsRoute={detailsRoute} refetch={query.refetch} />;
}

function CampaignEditForm({ campaign, detailsRoute, refetch }: { campaign: NonNullable<ReturnType<typeof useOrgCampaign>["data"]>["data"]; detailsRoute: string; refetch: () => Promise<unknown> }) {
  const router = useRouter();
  const updateMutation = useUpdateOrgCampaign();
  const mediaQueue = useMediaUploadQueue(10);
  const [pendingDeleteIds, setPendingDeleteIds] = React.useState<Set<string>>(new Set());
  const [pendingReplacements, setPendingReplacements] = React.useState<Map<string, File>>(new Map());
  const [processingMedia, setProcessingMedia] = React.useState(false);
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: campaign.title,
      summary: campaign.summary,
      category: campaign.category,
      status: campaign.status as "draft" | "active",
      location: campaign.location,
      goalAmount: campaign.goalAmount,
      beneficiariesCount: campaign.beneficiariesCount,
      startDate: toDateInputValue(campaign.startDate),
      endDate: toDateInputValue(campaign.endDate),
    },
  });

  const target = { model: "campaign" as const, modelId: campaign.id, prop: "images" as const };
  const existingMedia = (campaign.media ?? []).filter((media) => !pendingDeleteIds.has(media.id));
  const pendingMediaIds = new Set([...pendingDeleteIds, ...pendingReplacements.keys()]);
  const isBusy = updateMutation.isPending || mediaQueue.isUploading || processingMedia;

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div><h2 className="text-lg font-semibold">تعديل الحملة</h2><p className="mt-1 text-sm text-muted-foreground">حدّث البيانات والصور ثم احفظ التغييرات.</p></div>
      <form noValidate className="space-y-5 rounded-xl border bg-card p-4 sm:p-6" onSubmit={handleSubmit(async (values) => {
        await updateMutation.mutateAsync({ campaignId: campaign.id, body: {
          title: values.title.trim(), summary: values.summary.trim(), category: values.category, status: values.status,
          location: values.location, goalAmount: values.goalAmount, beneficiariesCount: values.beneficiariesCount,
          startDate: toDateTimeFromInput(values.startDate), endDate: toDateTimeFromInput(values.endDate),
        }});
        setProcessingMedia(true);
        const failedOperations: string[] = [];
        try {
          for (const mediaId of pendingDeleteIds) {
            try {
              await mediaServices.remove(target, mediaId);
              setPendingDeleteIds((current) => { const next = new Set(current); next.delete(mediaId); return next; });
            } catch {
              failedOperations.push(`حذف صورة ${mediaId}`);
            }
          }

          for (const [mediaId, file] of pendingReplacements) {
            try {
              await mediaServices.replace(target, mediaId, file);
              setPendingReplacements((current) => { const next = new Map(current); next.delete(mediaId); return next; });
            } catch {
              failedOperations.push(`استبدال ${file.name}`);
            }
          }

          if (mediaQueue.hasQueued) {
            const result = await mediaQueue.uploadAll(target);
            failedOperations.push(...result.failedFileNames.map((name) => `رفع ${name}`));
          }
        } finally {
          setProcessingMedia(false);
        }

        if (failedOperations.length > 0) {
          await refetch();
          toast.error(`تم حفظ الحملة، لكن تعذر: ${failedOperations.join("، ")}. يمكنك إعادة الحفظ للمحاولة مجددًا.`);
          return;
        }
        router.push(detailsRoute);
      })}>
        <Field label="عنوان الحملة" error={errors.title?.message}><Input disabled={isBusy} aria-invalid={Boolean(errors.title)} {...register("title")} /></Field>
        <Field label="ملخص الحملة" error={errors.summary?.message}><Textarea disabled={isBusy} aria-invalid={Boolean(errors.summary)} className="min-h-32" {...register("summary")} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="الفئة"><Controller control={control} name="category" render={({ field }) => <Select value={field.value} onValueChange={field.onChange} disabled={isBusy}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(organizationCampaignCategoryLabels).map(([value,label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select>} /></Field>
          <Field label="الحالة"><Controller control={control} name="status" render={({ field }) => <Select value={field.value} onValueChange={field.onChange} disabled={isBusy}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(organizationCampaignStatusLabels).filter(([value]) => value !== "closed").map(([value,label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select>} /></Field>
        </div>
        <Field label="المحافظة" error={errors.location?.message}><Controller control={control} name="location" render={({ field }) => <Select value={field.value} onValueChange={field.onChange} disabled={isBusy}><SelectTrigger aria-invalid={Boolean(errors.location)}><SelectValue placeholder="اختر المحافظة" /></SelectTrigger><SelectContent>{syrianGovernorateOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select>} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="الهدف المالي"><Input type="number" min={0} disabled={isBusy} {...register("goalAmount")} /></Field>
          <Field label="عدد المستفيدين"><Input type="number" min={0} disabled={isBusy} {...register("beneficiariesCount")} /></Field>
          <Field label="تاريخ البداية"><Input type="date" disabled={isBusy} {...register("startDate")} /></Field>
          <Field label="تاريخ النهاية" error={errors.endDate?.message}><Input type="date" disabled={isBusy} aria-invalid={Boolean(errors.endDate)} {...register("endDate")} /></Field>
        </div>
        <MediaUploadField
          label="صور الحملة"
          items={mediaQueue.items}
          existingMedia={existingMedia}
          busyMediaIds={pendingMediaIds}
          maxItems={10}
          disabled={isBusy}
          onFilesSelected={mediaQueue.addFiles}
          onRemoveQueued={mediaQueue.removeItem}
          onRetry={(id) => void mediaQueue.retryItem(target, id)}
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
