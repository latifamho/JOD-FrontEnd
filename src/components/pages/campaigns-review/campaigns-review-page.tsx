"use client";

import * as React from "react";

import { EmptyState, PaginationControls } from "@/components/shared";
import type { ModerationStatus } from "@/components/shared";
import { usePagination } from "@/hooks/use-pagination";
import { toUtcTimestamp } from "@/lib/date";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { ReviewCampaignCard } from "@/components/pages/campaigns-review/review-campaign-card";
import {
  CampaignReviewToolbar,
  type ReviewSortOption,
} from "@/components/pages/campaigns-review/review-toolbar";
import {
  reviewCampaignsStaticData,
  reviewStatusLabels,
  type ReviewCampaignItem,
} from "@/components/pages/campaigns-review/static-data";

type CampaignsReviewPageProps = {
  status: ModerationStatus;
};

export function CampaignsReviewPage({ status }: CampaignsReviewPageProps) {
  const [campaigns, setCampaigns] = React.useState<ReviewCampaignItem[]>(
    reviewCampaignsStaticData,
  );
  const [organizationFilter, setOrganizationFilter] = React.useState("all");
  const [sortBy, setSortBy] =
    React.useState<ReviewSortOption>("created_at_newest");
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);

  const organizationOptions = React.useMemo(() => {
    const scopedOrganizations = campaigns
      .filter((campaign) => campaign.status === status)
      .map((campaign) => campaign.organizationName);
    const uniqueOrganizations = Array.from(new Set(scopedOrganizations));

    return uniqueOrganizations.sort((firstOrg, secondOrg) =>
      firstOrg.localeCompare(secondOrg, "ar", { sensitivity: "base" }),
    );
  }, [campaigns, status]);

  React.useEffect(() => {
    if (
      organizationFilter !== "all" &&
      !organizationOptions.includes(organizationFilter)
    ) {
      setOrganizationFilter("all");
    }
  }, [organizationFilter, organizationOptions]);

  const filteredCampaigns = React.useMemo(() => {
    const filtered = campaigns.filter((campaign) => {
      if (campaign.status !== status) {
        return false;
      }

      if (
        organizationFilter !== "all" &&
        campaign.organizationName !== organizationFilter
      ) {
        return false;
      }

      return true;
    });

    return filtered.sort((firstCampaign, secondCampaign) => {
      if (sortBy === "title_asc") {
        return firstCampaign.title.localeCompare(secondCampaign.title, "ar", {
          sensitivity: "base",
        });
      }

      if (sortBy === "title_desc") {
        return secondCampaign.title.localeCompare(firstCampaign.title, "ar", {
          sensitivity: "base",
        });
      }

      const firstDate = toUtcTimestamp(firstCampaign.submittedAt);
      const secondDate = toUtcTimestamp(secondCampaign.submittedAt);

      return sortBy === "created_at_oldest"
        ? firstDate - secondDate
        : secondDate - firstDate;
    });
  }, [campaigns, organizationFilter, sortBy, status]);

  const pagination = usePagination({
    totalItems: filteredCampaigns.length,
    pageSize,
  });
  const { setCurrentPage } = pagination;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [organizationFilter, pageSize, setCurrentPage, sortBy, status]);

  const currentPageCampaigns = React.useMemo(
    () =>
      filteredCampaigns.slice(pagination.startIndex, pagination.endIndex),
    [filteredCampaigns, pagination.endIndex, pagination.startIndex],
  );

  const handleApprove = React.useCallback((campaignId: string) => {
    setCampaigns((currentCampaigns) =>
      currentCampaigns.map((campaign) =>
        campaign.id === campaignId
          ? {
              ...campaign,
              status: "approved",
              reviewedBy: "فريق مراجعة الحملات",
              rejectionReason: undefined,
            }
          : campaign,
      ),
    );
  }, []);

  const handleReject = React.useCallback(
    (campaignId: string, reason: string) => {
      setCampaigns((currentCampaigns) =>
        currentCampaigns.map((campaign) =>
          campaign.id === campaignId
            ? {
                ...campaign,
                status: "rejected",
                reviewedBy: "فريق مراجعة الحملات",
                rejectionReason: reason,
              }
            : campaign,
        ),
      );
    },
    [],
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
        totalResults={filteredCampaigns.length}
      />

      {currentPageCampaigns.length === 0 ? (
        <EmptyState
          icon="campaigns"
          title={`لا توجد حملات ضمن حالة ${reviewStatusLabels[status]}`}
          description="جرّب تغيير الفلتر أو طريقة الفرز لعرض نتائج إضافية."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {currentPageCampaigns.map((campaign) => (
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
