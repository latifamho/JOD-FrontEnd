"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DetailsLoadingSkeleton, EmptyState } from "@/components/shared";
import { routePaths } from "@/constant/routes";
import {
  formatUtcDate,
  formatUtcDateTime,
  formatUtcDateTimeOrDash,
} from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import {
  formatAmount,
  getCampaignStatusBadgeClass,
  getProgress,
} from "@/components/pages/organization-campaigns/helpers";
import {
  organizationCampaignCategoryLabels,
  organizationCampaignStatusLabels,
} from "@/components/pages/organization-campaigns/static-data";
import { useOrgCampaign } from "@/features/org/campaigns/org.campaigns.query";
import { useAuth } from "@/providers/AuthProvider";

type OrganizationCampaignDetailsPageProps = {
  campaignId: string;
  scope: "owner" | "staff";
};

export function OrganizationCampaignDetailsPage({
  campaignId,
  scope,
}: OrganizationCampaignDetailsPageProps) {
  const { can } = useAuth();
  const campaignQuery = useOrgCampaign(campaignId);
  const campaign = campaignQuery.data?.data;

  if (campaignQuery.isLoading) {
    return <DetailsLoadingSkeleton className="rounded-xl border border-border bg-card" />;
  }

  if (!campaign || campaignQuery.isError) {
    return (
      <section className="flex flex-1 flex-col gap-4">
        <EmptyState
          icon="campaigns"
          title="الحملة غير موجودة"
          description="تأكد من معرف الحملة أو ارجع إلى قائمة الحملات."
        />
        <div className="flex justify-start">
          <Button asChild variant="outline">
            <Link href={routePaths.organizationOwnerScope.campaigns}>
              الرجوع إلى الحملات
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  const progress = getProgress(campaign.goalAmount, campaign.raisedAmount);
  const editRoute =
    scope === "staff"
      ? routePaths.organizationStaffScope.campaignEdit(campaign.id)
      : routePaths.organizationOwnerScope.campaignEdit(campaign.id);

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div className="rounded-md border border-border bg-background p-4 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={getCampaignStatusBadgeClass(campaign.status)}
              >
                {organizationCampaignStatusLabels[campaign.status]}
              </Badge>
              <Badge variant="outline">
                {organizationCampaignCategoryLabels[campaign.category]}
              </Badge>
              <Badge variant="outline">{campaign.id}</Badge>
            </div>
            <h2 className="text-xl font-semibold text-foreground">{campaign.title}</h2>
            <p className="text-sm text-muted-foreground">{campaign.summary}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {can("org.campaigns.update") && campaign.status !== "closed" ? (
              <Button asChild>
                <Link href={editRoute}>تعديل الحملة</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-md border border-border bg-background p-4 shadow-xs">
          <p className="text-xs text-muted-foreground">الهدف المالي</p>
          <p className="mt-2 text-xl font-semibold text-foreground">
            {formatAmount(campaign.goalAmount)} ر.س
          </p>
        </div>

        <div className="rounded-md border border-border bg-background p-4 shadow-xs">
          <p className="text-xs text-muted-foreground">المحصّل</p>
          <p className="mt-2 text-xl font-semibold text-foreground">
            {formatAmount(campaign.raisedAmount)} ر.س
          </p>
        </div>

        <div className="rounded-md border border-border bg-background p-4 shadow-xs">
          <p className="text-xs text-muted-foreground">نسبة التقدم</p>
          <p className="mt-2 text-xl font-semibold text-foreground">{progress}%</p>
          <div className="mt-3 h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-border bg-background p-4 shadow-xs">
          <h3 className="text-sm font-semibold text-foreground">بيانات الحملة</h3>
          <div className="mt-3 grid gap-3 text-sm">
            <p className="text-muted-foreground">
              المدينة:{" "}
              <span className="font-semibold text-foreground">
                {displayOrDash(campaign.location)}
              </span>
            </p>
            <p className="text-muted-foreground">
              تاريخ البداية:{" "}
              <span className="font-semibold text-foreground">
                {formatUtcDate(campaign.startDate)}
              </span>
            </p>
            <p className="text-muted-foreground">
              تاريخ النهاية:{" "}
              <span className="font-semibold text-foreground">
                {formatUtcDate(campaign.endDate)}
              </span>
            </p>
            <p className="text-muted-foreground">
              تاريخ الإنشاء:{" "}
              <span className="font-semibold text-foreground">
                {formatUtcDateTime(campaign.createdAt)}
              </span>
            </p>
            <p className="text-muted-foreground">
              آخر تحديث:{" "}
              <span className="font-semibold text-foreground">
                {formatUtcDateTime(campaign.updatedAt)}
              </span>
            </p>
          </div>
        </div>

        <div className="rounded-md border border-border bg-background p-4 shadow-xs">
          <h3 className="text-sm font-semibold text-foreground">مؤشرات المشاركة</h3>
          <div className="mt-3 grid gap-3 text-sm">
            <p className="text-muted-foreground">
              عدد المتبرعين:{" "}
              <span className="font-semibold text-foreground">{campaign.donorsCount}</span>
            </p>
            <p className="text-muted-foreground">
              عدد المتقدمين:{" "}
              <span className="font-semibold text-foreground">{campaign.applicantsCount}</span>
            </p>
            <p className="text-muted-foreground">
              عدد المستفيدين:{" "}
              <span className="font-semibold text-foreground">
                {campaign.beneficiariesCount}
              </span>
            </p>
            <p className="text-muted-foreground">
              تاريخ الإغلاق:{" "}
              <span className="font-semibold text-foreground">
                {formatUtcDateTimeOrDash(campaign.closedAt)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {campaign.closedReason && (
        <div className="rounded-md border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-700 dark:border-slate-500/40 dark:bg-slate-500/10 dark:text-slate-100">
          <p className="font-semibold">سبب الإغلاق</p>
          <p className="mt-2">{campaign.closedReason}</p>
        </div>
      )}
    </section>
  );
}
