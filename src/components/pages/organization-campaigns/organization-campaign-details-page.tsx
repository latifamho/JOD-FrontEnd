"use client";

import * as React from "react";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DetailsLoadingSkeleton, EmptyState, ListLoadingSkeleton } from "@/components/shared";
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
import { organizationCampaignStatusLabels } from "@/components/pages/organization-campaigns/static-data";
import { useOrgCategoriesBrief } from "@/features/org/categories/org.categories.query";
import { useOrgCampaign } from "@/features/org/campaigns/org.campaigns.query";
import { useOrgDonations } from "@/features/org/donations/org.donations.query";
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
  const categoriesBrief = useOrgCategoriesBrief();
  const canViewDonors = can("org.donors.view");
  const [donationsPage, setDonationsPage] = React.useState(1);
  const donationsQuery = useOrgDonations(
    {
      page: donationsPage,
      perPage: 10,
      status: "completed",
      campaignId,
    },
    Boolean(campaign) && canViewDonors,
  );
  const completedDonations = donationsQuery.data?.data ?? [];
  const donationsLastPage = Math.max(1, donationsQuery.data?.meta.lastPage ?? 1);
  const donationsCurrentPage = Math.min(
    Math.max(1, donationsQuery.data?.meta.currentPage ?? donationsPage),
    donationsLastPage,
  );

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
  const categoryName = (categoriesBrief.data?.data ?? []).find((category) => category.id === campaign.categoryId)?.name;
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
                {displayOrDash(categoryName)}
              </Badge>
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

      {(campaign.images?.length ?? 0) > 0 ? (
        <div className="rounded-md border border-border bg-background p-4 shadow-xs">
          <h3 className="text-sm font-semibold text-foreground">صور الحملة</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {(campaign.images ?? []).map((image, index) => (
              <img key={`${image}-${index}`} src={image} alt={`صورة الحملة ${index + 1}`} className="aspect-square w-full rounded-lg border border-border object-cover" />
            ))}
          </div>
        </div>
      ) : null}

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

      {canViewDonors ? (
        <div className="rounded-md border border-border bg-background p-4 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground">المتبرعون بالحملة</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                تظهر هنا التبرعات المكتملة والمحتسبة ضمن المبلغ المحصّل للحملة.
              </p>
            </div>
            <Badge variant="outline">
              {campaign.donorsCount} متبرع
            </Badge>
          </div>

          {donationsQuery.isError ? (
            <div className="mt-4 flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
              <p className="flex-1 text-sm text-destructive">تعذّر تحميل متبرعي الحملة.</p>
              <Button type="button" size="sm" variant="outline" onClick={() => donationsQuery.refetch()}>
                إعادة المحاولة
              </Button>
            </div>
          ) : donationsQuery.isLoading ? (
            <div className="mt-4">
              <ListLoadingSkeleton />
            </div>
          ) : completedDonations.length > 0 ? (
            <>
              <div className="mt-4 overflow-auto rounded-md border border-border">
                <Table className="min-w-[640px] bg-background">
                  <TableHeader className="bg-muted/35">
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>المتبرع</TableHead>
                      <TableHead>مبلغ التبرع</TableHead>
                      <TableHead>تاريخ التبرع</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedDonations.map((donation, index) => (
                      <TableRow key={donation.id}>
                        <TableCell className="text-sm text-muted-foreground">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium text-foreground">{donation.name}</span>
                            {donation.isAnonymous ? (
                              <Badge variant="secondary">مجهول علنًا</Badge>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatAmount(Number(donation.amount))} ر.س
                        </TableCell>
                        <TableCell>
                          {formatUtcDateTimeOrDash(donation.completedAt ?? donation.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {donationsLastPage > 1 ? (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">
                    الصفحة {donationsCurrentPage} من {donationsLastPage}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={donationsCurrentPage <= 1 || donationsQuery.isFetching}
                      onClick={() => setDonationsPage((page) => Math.max(1, page - 1))}
                    >
                      السابق
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={donationsCurrentPage >= donationsLastPage || donationsQuery.isFetching}
                      onClick={() => setDonationsPage((page) => Math.min(donationsLastPage, page + 1))}
                    >
                      التالي
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="mt-4 rounded-md border border-dashed border-border px-4 py-8 text-center">
              <p className="text-sm font-medium text-foreground">لا توجد تبرعات مكتملة بعد</p>
              <p className="mt-1 text-xs text-muted-foreground">
                ستظهر بيانات المتبرعين هنا بعد تأكيد استلام التبرعات.
              </p>
            </div>
          )}
        </div>
      ) : null}

      {campaign.closedReason && (
        <div className="rounded-md border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-700 dark:border-slate-500/40 dark:bg-slate-500/10 dark:text-slate-100">
          <p className="font-semibold">سبب الإغلاق</p>
          <p className="mt-2">{campaign.closedReason}</p>
        </div>
      )}
    </section>
  );
}
