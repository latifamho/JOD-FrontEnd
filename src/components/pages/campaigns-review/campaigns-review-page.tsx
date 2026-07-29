"use client";

import * as React from "react";

import { EmptyState, PaginationControls } from "@/components/shared";
import type { ModerationStatus } from "@/components/shared";
import { usePagination } from "@/hooks/use-pagination";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { Button } from "@/components/ui/button";
import { ReviewCampaignCard } from "@/components/pages/campaigns-review/review-campaign-card";
import {
  CampaignReviewToolbar,
  type ReviewSortOption,
} from "@/components/pages/campaigns-review/review-toolbar";
import {
  reviewStatusLabels,
  type ReviewCampaignCategory,
} from "@/components/pages/campaigns-review/campaigns-review.types";
import {
  useAdminReviewCampaigns,
  useApproveReviewCampaign,
  useRejectReviewCampaign,
} from "@/features/admin/review-campaigns/admin.review-campaigns.query";
import { useAdminOrganizations } from "@/features/admin/organizations/admin.organizations.query";

type CampaignsReviewPageProps = {
  status: ModerationStatus;
};

const sortToApiSort: Record<ReviewSortOption, string> = {
  created_at_newest: "-submittedAt",
  created_at_oldest: "submittedAt",
  title_asc: "title",
  title_desc: "-title",
};

export function CampaignsReviewPage({ status }: CampaignsReviewPageProps) {
  const [sortBy, setSortBy] = React.useState<ReviewSortOption>("created_at_newest");
  const [organizationFilter, setOrganizationFilter] = React.useState("all");
  const [categoryFilter, setCategoryFilter] = React.useState<"all" | ReviewCampaignCategory>("all");
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [apiTotal, setApiTotal] = React.useState(0);

  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;

  const { data, isError, refetch } = useAdminReviewCampaigns({
    page: pagination.currentPage,
    perPage: pageSize,
    sort: sortToApiSort[sortBy],
    filter: {
      status,
      organizationId: organizationFilter !== "all" ? organizationFilter : undefined,
      category: categoryFilter !== "all" ? categoryFilter : undefined,
    },
  });

  const { data: organizationsData } = useAdminOrganizations({
    page: 1,
    perPage: 100,
    sort: "name",
  });

  React.useEffect(() => {
    if (data?.meta.total !== undefined) {
      setApiTotal(data.meta.total);
    }
  }, [data?.meta.total]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, sortBy, status, organizationFilter, categoryFilter, setCurrentPage]);

  const campaigns = data?.data ?? [];

  const organizationOptions = React.useMemo(
    () =>
      (organizationsData?.data ?? [])
        .map((organization) => ({ id: organization.id, name: organization.name }))
        .sort((a, b) => a.name.localeCompare(b.name, "ar", { sensitivity: "base" })),
    [organizationsData?.data],
  );

  const approveMutation = useApproveReviewCampaign();
  const rejectMutation = useRejectReviewCampaign();

  const handleApprove = React.useCallback(
    (campaignId: string) => {
      approveMutation.mutate({ campaignId });
    },
    [approveMutation],
  );

  const handleReject = React.useCallback(
    (campaignId: string, reason: string) => {
      rejectMutation.mutate({ campaignId, body: { reason } });
    },
    [rejectMutation],
  );

  return (
    <section className="flex flex-1 flex-col gap-4">
      <CampaignReviewToolbar
        status={status}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        organizationFilter={organizationFilter}
        organizations={organizationOptions}
        onOrganizationFilterChange={setOrganizationFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        totalResults={apiTotal}
      />

      {isError && (
        <div className="flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="flex-1 text-sm text-destructive">
            تعذّر تحميل الحملات. حاول مرة أخرى.
          </p>
          <Button type="button" size="sm" variant="outline" onClick={() => refetch()}>
            إعادة المحاولة
          </Button>
        </div>
      )}

      {campaigns.length === 0 ? (
        <EmptyState
          icon="campaigns"
          title={`لا توجد حملات ضمن حالة ${reviewStatusLabels[status]}`}
          description="جرّب تغيير الفلتر أو طريقة الفرز لعرض نتائج إضافية."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign) => (
            <ReviewCampaignCard
              key={campaign.id}
              campaign={campaign}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}

      <PaginationControls
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        hasPreviousPage={pagination.hasPreviousPage}
        hasNextPage={pagination.hasNextPage}
        paginationRange={pagination.paginationRange}
        onPageChange={pagination.goToPage}
        onPreviousPage={pagination.goToPreviousPage}
        onNextPage={pagination.goToNextPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
      />
    </section>
  );
}
