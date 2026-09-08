"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { EmptyState, MediaUploadField } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toDateTimeFromInput } from "@/components/pages/organization-campaigns/helpers";
import {
  organizationCampaignAudienceLabels,
  organizationCampaignStatusLabels,
  syrianGovernorateOptions,
} from "@/components/pages/organization-campaigns/static-data";
import { routePaths } from "@/constant/routes";
import { useOrgCategoriesBrief } from "@/features/org/categories/org.categories.query";
import { useCreateOrgCampaign } from "@/features/org/campaigns/org.campaigns.query";
import { useMediaUploadQueue } from "@/hooks/use-media-upload-queue";
import { normalizeApiError } from "@/lib/api-errors";
import { toast } from "@/lib/toast";
import { useAuth } from "@/providers/AuthProvider";

function getLocalDateInputValue(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const schema = z
  .object({
    title: z.string().trim().min(1, "عنوان الحملة مطلوب").max(255, "عنوان الحملة يجب ألا يتجاوز 255 حرفاً"),
    summary: z.string().trim().min(1, "ملخص الحملة مطلوب").max(10000, "ملخص الحملة يجب ألا يتجاوز 10000 حرف"),
    categoryId: z.string().min(1, "تصنيف الحملة مطلوب"),
    audience: z.enum(["general", "student"]),
    status: z.enum(["draft", "active"]),
    location: z.string().min(1, "المحافظة مطلوبة").refine(
      (value) => syrianGovernorateOptions.some((option) => option.value === value),
      "اختر محافظة سورية صحيحة",
    ),
    goalAmount: z.coerce.number().min(0, "الهدف المالي يجب أن يكون صفرًا أو أكثر"),
    beneficiariesCount: z.coerce.number().int("عدد المستفيدين يجب أن يكون عدداً صحيحاً").min(0, "عدد المستفيدين يجب أن يكون صفرًا أو أكثر"),
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

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;
type Props = { scope: "owner" | "staff" };

export function OrganizationCampaignCreatePage({ scope }: Props) {
  const router = useRouter();
  const { can } = useAuth();
  const createMutation = useCreateOrgCampaign();
  const categoriesBrief = useOrgCategoriesBrief();
  const mediaQueue = useMediaUploadQueue(10);
  const listRoute = scope === "staff" ? routePaths.organizationStaffScope.campaigns : routePaths.organizationOwnerScope.campaigns;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
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
    },
  });

  const isBusy = createMutation.isPending || mediaQueue.isUploading;

  if (!can("org.campaigns.create")) {
    return (
      <section className="space-y-4">
        <EmptyState icon="ShieldOff" title="لا تملك صلاحية إنشاء الحملات" description="يمكنك الرجوع إلى قائمة الحملات." />
        <Button asChild variant="outline"><Link href={listRoute}>الرجوع إلى الحملات</Link></Button>
      </section>
    );
  }

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">إضافة حملة جديدة</h2>
        <p className="mt-1 text-sm text-muted-foreground">أدخل بيانات الحملة وصورها ثم احفظها.</p>
      </div>

      <form
        noValidate
        className="space-y-5 rounded-xl border border-border bg-card p-4 sm:p-6"
        onSubmit={handleSubmit(async (values) => {
          let campaignId: string | null = null;
          try {
            const response = await createMutation.mutateAsync({
              title: values.title.trim(),
              summary: values.summary.trim(),
              categoryId: values.categoryId,
              audience: values.audience,
              status: values.status,
              location: values.location,
              goalAmount: values.goalAmount,
              beneficiariesCount: values.beneficiariesCount,
              startDate: toDateTimeFromInput(values.startDate),
              endDate: toDateTimeFromInput(values.endDate),
            });
            campaignId = response.data?.id ?? null;
          } catch (error) {
            toast.error(normalizeApiError(error).message);
            return;
          }

          if (!campaignId) {
            toast.error("تم إرسال الطلب لكن لم يتم العثور على معرف الحملة الجديدة.");
            return;
          }

          if (mediaQueue.hasQueued) {
            const result = await mediaQueue.uploadAll({ model: "campaign", modelId: campaignId, prop: "images" });
            if (result.failed > 0) {
              toast.error(`تم إنشاء الحملة، لكن فشل رفع: ${result.failedFileNames.join("، ")}. يمكنك إعادة رفع الصور من صفحة التعديل.`);
              const editRoute = scope === "staff"
                ? routePaths.organizationStaffScope.campaignEdit(campaignId)
                : routePaths.organizationOwnerScope.campaignEdit(campaignId);
              router.push(editRoute);
              return;
            }
          }

          const detailsRoute = scope === "staff"
            ? routePaths.organizationStaffScope.campaignDetails(campaignId)
            : routePaths.organizationOwnerScope.campaignDetails(campaignId);
          router.push(detailsRoute);
        })}
      >
        <Field label="عنوان الحملة" error={errors.title?.message}>
          <Input placeholder="أدخل عنوان الحملة" disabled={isBusy} aria-invalid={Boolean(errors.title)} {...register("title")} />
        </Field>
        <Field label="ملخص الحملة" error={errors.summary?.message}>
          <Textarea placeholder="اكتب وصفاً مختصراً وواضحاً للحملة" disabled={isBusy} aria-invalid={Boolean(errors.summary)} className="min-h-32" {...register("summary")} />
        </Field>
        <Field label="الفئة المستهدفة" error={errors.audience?.message}>
          <Controller control={control} name="audience" render={({ field }) => <Select value={field.value} onValueChange={field.onChange} disabled={isBusy}><SelectTrigger aria-invalid={Boolean(errors.audience)}><SelectValue placeholder="اختر الفئة المستهدفة" /></SelectTrigger><SelectContent>{Object.entries(organizationCampaignAudienceLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select>} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="تصنيف الحملة" error={errors.categoryId?.message}>
            <Controller control={control} name="categoryId" render={({ field }) => <Select value={field.value || undefined} onValueChange={field.onChange} disabled={isBusy || categoriesBrief.isLoading}><SelectTrigger aria-invalid={Boolean(errors.categoryId)}><SelectValue placeholder={categoriesBrief.isLoading ? "جاري تحميل التصنيفات..." : "اختر التصنيف"} /></SelectTrigger><SelectContent>{(categoriesBrief.data?.data ?? []).map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}</SelectContent></Select>} />
            {categoriesBrief.isError ? <p className="text-xs text-destructive">تعذر تحميل التصنيفات المتاحة.</p> : null}
          </Field>
          <Field label="حالة الحملة" error={errors.status?.message}>
            <Controller control={control} name="status" render={({ field }) => <Select value={field.value} onValueChange={field.onChange} disabled={isBusy}><SelectTrigger aria-invalid={Boolean(errors.status)}><SelectValue /></SelectTrigger><SelectContent>{Object.entries(organizationCampaignStatusLabels).filter(([value]) => value !== "closed").map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select>} />
          </Field>
        </div>
        <Field label="المحافظة" error={errors.location?.message}>
          <Controller control={control} name="location" render={({ field }) => <Select value={field.value || undefined} onValueChange={field.onChange} disabled={isBusy}><SelectTrigger aria-invalid={Boolean(errors.location)}><SelectValue placeholder="اختر المحافظة" /></SelectTrigger><SelectContent>{syrianGovernorateOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select>} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="الهدف المالي" error={errors.goalAmount?.message}><Input type="number" min={0} step="0.01" disabled={isBusy} aria-invalid={Boolean(errors.goalAmount)} {...register("goalAmount")} /></Field>
          <Field label="عدد المستفيدين" error={errors.beneficiariesCount?.message}><Input type="number" min={0} step={1} disabled={isBusy} aria-invalid={Boolean(errors.beneficiariesCount)} {...register("beneficiariesCount")} /></Field>
          <Field label="تاريخ البداية" error={errors.startDate?.message}><Input type="date" min={getLocalDateInputValue()} disabled={isBusy} aria-invalid={Boolean(errors.startDate)} {...register("startDate")} /></Field>
          <Field label="تاريخ النهاية" error={errors.endDate?.message}><Input type="date" disabled={isBusy} aria-invalid={Boolean(errors.endDate)} {...register("endDate")} /></Field>
        </div>
        <MediaUploadField label="صور الحملة - اختياري" items={mediaQueue.items} maxItems={10} disabled={isBusy} onFilesSelected={mediaQueue.addFiles} onRemoveQueued={mediaQueue.removeItem} />
        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          <Button type="submit" disabled={isBusy}>{isBusy ? <Loader2 className="size-4 animate-spin" /> : null}{isBusy ? "جاري إنشاء الحملة..." : "إضافة الحملة"}</Button>
          <Button type="button" variant="outline" disabled={isBusy} onClick={() => router.push(listRoute)}>إلغاء</Button>
        </div>
      </form>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}{error ? <p className="text-xs text-destructive">{error}</p> : null}</div>;
}
