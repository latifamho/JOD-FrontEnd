"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { EmptyState, FormLoadingSkeleton } from "@/components/shared";
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
import { Textarea } from "@/components/ui/textarea";
import {
  toDateInputValue,
  toDateTimeFromInput,
} from "@/components/pages/organization-campaigns/helpers";
import {
  organizationCampaignCategoryLabels,
  organizationCampaignStatusLabels,
  type OrganizationCampaignCategory,
  type OrganizationCampaignStatus,
} from "@/components/pages/organization-campaigns/static-data";
import { routePaths } from "@/constant/routes";
import {
  useOrgCampaign,
  useUpdateOrgCampaign,
} from "@/features/org/campaigns/org.campaigns.query";
import { useAuth } from "@/providers/AuthProvider";

type OrganizationCampaignEditPageProps = {
  campaignId: string;
  scope: "owner" | "staff";
};

type CampaignEditValues = {
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

export function OrganizationCampaignEditPage({
  campaignId,
  scope,
}: OrganizationCampaignEditPageProps) {
  const { can } = useAuth();
  const campaignQuery = useOrgCampaign(campaignId);
  const campaign = campaignQuery.data?.data;
  const detailsRoute =
    scope === "staff"
      ? routePaths.organizationStaffScope.campaignDetails(campaignId)
      : routePaths.organizationOwnerScope.campaignDetails(campaignId);
  const campaignsRoute =
    scope === "staff"
      ? routePaths.organizationStaffScope.campaigns
      : routePaths.organizationOwnerScope.campaigns;

  if (campaignQuery.isLoading) {
    return (
      <FormLoadingSkeleton
        count={9}
        className="rounded-xl border border-border bg-card p-4 sm:p-6"
      />
    );
  }

  if (!can("org.campaigns.update")) {
    return (
      <section className="flex flex-1 flex-col gap-4">
        <EmptyState
          icon="ShieldOff"
          title="لا تملك صلاحية تعديل الحملات"
          description="يمكنك الرجوع إلى تفاصيل الحملة أو قائمة الحملات."
        />
        <Button asChild variant="outline" className="w-fit">
          <Link href={detailsRoute}>الرجوع إلى تفاصيل الحملة</Link>
        </Button>
      </section>
    );
  }

  if (!campaign || campaignQuery.isError) {
    return (
      <section className="flex flex-1 flex-col gap-4">
        <EmptyState
          icon="campaigns"
          title="تعذّر تحميل الحملة"
          description="تأكد من معرّف الحملة أو حاول إعادة تحميل البيانات."
        />
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => campaignQuery.refetch()}>
            إعادة المحاولة
          </Button>
          <Button asChild variant="outline">
            <Link href={campaignsRoute}>الرجوع إلى الحملات</Link>
          </Button>
        </div>
      </section>
    );
  }

  if (campaign.status === "closed") {
    return (
      <section className="flex flex-1 flex-col gap-4">
        <EmptyState
          icon="campaigns"
          title="لا يمكن تعديل حملة مغلقة"
          description="الحملات المغلقة متاحة للعرض فقط."
        />
        <Button asChild variant="outline" className="w-fit">
          <Link href={detailsRoute}>الرجوع إلى تفاصيل الحملة</Link>
        </Button>
      </section>
    );
  }

  const initialValues: CampaignEditValues = {
    title: campaign.title,
    summary: campaign.summary,
    category: campaign.category,
    status: campaign.status,
    location: campaign.location,
    goalAmount: campaign.goalAmount,
    beneficiariesCount: campaign.beneficiariesCount,
    startDate: toDateInputValue(campaign.startDate),
    endDate: toDateInputValue(campaign.endDate),
  };

  return (
    <CampaignEditForm
      key={`${campaign.id}-${campaign.updatedAt}`}
      campaignId={campaign.id}
      detailsRoute={detailsRoute}
      initialValues={initialValues}
    />
  );
}

function CampaignEditForm({
  campaignId,
  detailsRoute,
  initialValues,
}: {
  campaignId: string;
  detailsRoute: string;
  initialValues: CampaignEditValues;
}) {
  const router = useRouter();
  const updateMutation = useUpdateOrgCampaign();
  const [values, setValues] = React.useState<CampaignEditValues>(initialValues);

  function parseNumberInput(value: string): number {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? 0 : Math.max(parsed, 0);
  }

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">تعديل الحملة</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          حدّث بيانات الحملة ثم احفظ التغييرات.
        </p>
      </div>

      <form
        className="space-y-5 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          updateMutation.mutate(
            {
              campaignId,
              body: {
                title: values.title.trim(),
                summary: values.summary.trim(),
                category: values.category,
                status: values.status,
                location: values.location.trim(),
                goalAmount: values.goalAmount,
                beneficiariesCount: values.beneficiariesCount,
                startDate: toDateTimeFromInput(values.startDate),
                endDate: toDateTimeFromInput(values.endDate),
              },
            },
            { onSuccess: () => router.push(detailsRoute) },
          );
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="campaign-edit-title">عنوان الحملة</Label>
          <Input
            id="campaign-edit-title"
            required
            value={values.title}
            disabled={updateMutation.isPending}
            onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="campaign-edit-summary">ملخص الحملة</Label>
          <Textarea
            id="campaign-edit-summary"
            required
            className="min-h-32"
            value={values.summary}
            disabled={updateMutation.isPending}
            onChange={(event) =>
              setValues((current) => ({ ...current, summary: event.target.value }))
            }
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>فئة الحملة</Label>
            <Select
              dir="rtl"
              value={values.category}
              disabled={updateMutation.isPending}
              onValueChange={(value) =>
                setValues((current) => ({
                  ...current,
                  category: value as OrganizationCampaignCategory,
                }))
              }
            >
              <SelectTrigger className="w-full text-right"><SelectValue /></SelectTrigger>
              <SelectContent align="start">
                {Object.entries(organizationCampaignCategoryLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>حالة الحملة</Label>
            <Select
              dir="rtl"
              value={values.status}
              disabled={updateMutation.isPending}
              onValueChange={(value) =>
                setValues((current) => ({
                  ...current,
                  status: value as OrganizationCampaignStatus,
                }))
              }
            >
              <SelectTrigger className="w-full text-right"><SelectValue /></SelectTrigger>
              <SelectContent align="start">
                {Object.entries(organizationCampaignStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="campaign-edit-location">الموقع</Label>
          <Input
            id="campaign-edit-location"
            required
            value={values.location}
            disabled={updateMutation.isPending}
            onChange={(event) =>
              setValues((current) => ({ ...current, location: event.target.value }))
            }
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="campaign-edit-goal">الهدف المالي (ر.س)</Label>
            <Input
              id="campaign-edit-goal"
              type="number"
              min={0}
              required
              value={String(values.goalAmount)}
              disabled={updateMutation.isPending}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  goalAmount: parseNumberInput(event.target.value),
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaign-edit-beneficiaries">عدد المستفيدين</Label>
            <Input
              id="campaign-edit-beneficiaries"
              type="number"
              min={0}
              required
              value={String(values.beneficiariesCount)}
              disabled={updateMutation.isPending}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  beneficiariesCount: parseNumberInput(event.target.value),
                }))
              }
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="campaign-edit-start">تاريخ البداية</Label>
            <Input
              id="campaign-edit-start"
              type="date"
              required
              value={values.startDate}
              disabled={updateMutation.isPending}
              onChange={(event) =>
                setValues((current) => ({ ...current, startDate: event.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaign-edit-end">تاريخ النهاية</Label>
            <Input
              id="campaign-edit-end"
              type="date"
              min={values.startDate || undefined}
              required
              value={values.endDate}
              disabled={updateMutation.isPending}
              onChange={(event) =>
                setValues((current) => ({ ...current, endDate: event.target.value }))
              }
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
          </Button>
          <Button asChild type="button" variant="outline">
            <Link href={detailsRoute}>إلغاء</Link>
          </Button>
        </div>
      </form>
    </section>
  );
}
