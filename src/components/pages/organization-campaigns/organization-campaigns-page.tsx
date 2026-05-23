"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { EmptyState, PaginationControls } from "@/components/shared";
import { AppIcons } from "@/constant/icons";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { toUtcTimestamp } from "@/lib/date";
import {
  CampaignFormSheet,
  EMPTY_CAMPAIGN_FORM_VALUES,
  type CampaignFormValues,
} from "@/components/pages/organization-campaigns/campaign-form-sheet";
import { CloseCampaignDialog } from "@/components/pages/organization-campaigns/close-campaign-dialog";
import { DeleteCampaignDialog } from "@/components/pages/organization-campaigns/delete-campaign-dialog";
import {
  createNextCampaignId,
  getProgress,
  toDateInputValue,
  toDateTimeFromInput,
} from "@/components/pages/organization-campaigns/helpers";
import {
  type CampaignSortOption,
  OrganizationCampaignsFilters,
} from "@/components/pages/organization-campaigns/organization-campaigns-filters";
import { OrganizationCampaignsTable } from "@/components/pages/organization-campaigns/organization-campaigns-table";
import {
  organizationCampaignStatusLabels,
  organizationCampaignsStaticData,
  type OrganizationCampaignCategory,
  type OrganizationCampaignItem,
  type OrganizationCampaignStatus,
} from "@/components/pages/organization-campaigns/static-data";

type OrganizationCampaignsPageProps = {
  status: "all" | OrganizationCampaignStatus;
};

export function OrganizationCampaignsPage({
  status,
}: OrganizationCampaignsPageProps) {
  const [campaigns, setCampaigns] = React.useState<OrganizationCampaignItem[]>(
    organizationCampaignsStaticData,
  );
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);

  const [categoryFilter, setCategoryFilter] = React.useState<
    "all" | OrganizationCampaignCategory
  >("all");
  const [locationFilter, setLocationFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState<CampaignSortOption>("updated_newest");

  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [formInitialValues, setFormInitialValues] =
    React.useState<CampaignFormValues>(EMPTY_CAMPAIGN_FORM_VALUES);
  const [editingCampaignId, setEditingCampaignId] = React.useState<string | null>(
    null,
  );

  const [closeDialogOpen, setCloseDialogOpen] = React.useState(false);
  const [closeTargetCampaignId, setCloseTargetCampaignId] = React.useState<
    string | null
  >(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteTargetCampaignId, setDeleteTargetCampaignId] = React.useState<
    string | null
  >(null);

  const scopedCampaigns = React.useMemo(
    () =>
      campaigns.filter((campaign) =>
        status === "all" ? true : campaign.status === status,
      ),
    [campaigns, status],
  );

  const locationOptions = React.useMemo(() => {
    const uniqueLocations = Array.from(
      new Set(scopedCampaigns.map((campaign) => campaign.location)),
    );

    return uniqueLocations.sort((firstLocation, secondLocation) =>
      firstLocation.localeCompare(secondLocation, "ar", {
        sensitivity: "base",
      }),
    );
  }, [scopedCampaigns]);

  React.useEffect(() => {
    if (locationFilter !== "all" && !locationOptions.includes(locationFilter)) {
      setLocationFilter("all");
    }
  }, [locationFilter, locationOptions]);

  const filteredCampaigns = React.useMemo(() => {
    const filtered = scopedCampaigns.filter((campaign) => {
      if (categoryFilter !== "all" && campaign.category !== categoryFilter) {
        return false;
      }

      if (locationFilter !== "all" && campaign.location !== locationFilter) {
        return false;
      }

      return true;
    });

    return filtered.sort((firstCampaign, secondCampaign) => {
      if (sortBy === "updated_oldest") {
        return (
          toUtcTimestamp(firstCampaign.updatedAt) -
          toUtcTimestamp(secondCampaign.updatedAt)
        );
      }

      if (sortBy === "progress_highest") {
        return (
          getProgress(secondCampaign.goalAmount, secondCampaign.raisedAmount) -
          getProgress(firstCampaign.goalAmount, firstCampaign.raisedAmount)
        );
      }

      if (sortBy === "progress_lowest") {
        return (
          getProgress(firstCampaign.goalAmount, firstCampaign.raisedAmount) -
          getProgress(secondCampaign.goalAmount, secondCampaign.raisedAmount)
        );
      }

      return (
        toUtcTimestamp(secondCampaign.updatedAt) -
        toUtcTimestamp(firstCampaign.updatedAt)
      );
    });
  }, [categoryFilter, locationFilter, scopedCampaigns, sortBy]);

  const pagination = usePagination({
    totalItems: filteredCampaigns.length,
    pageSize,
  });
  const { setCurrentPage } = pagination;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, locationFilter, pageSize, setCurrentPage, sortBy, status]);

  const currentPageCampaigns = React.useMemo(
    () => filteredCampaigns.slice(pagination.startIndex, pagination.endIndex),
    [filteredCampaigns, pagination.endIndex, pagination.startIndex],
  );

  const closeTargetCampaign = React.useMemo(
    () =>
      closeTargetCampaignId
        ? (campaigns.find((campaign) => campaign.id === closeTargetCampaignId) ??
          null)
        : null,
    [campaigns, closeTargetCampaignId],
  );

  const deleteTargetCampaign = React.useMemo(
    () =>
      deleteTargetCampaignId
        ? (campaigns.find((campaign) => campaign.id === deleteTargetCampaignId) ??
          null)
        : null,
    [campaigns, deleteTargetCampaignId],
  );

  const openCreateSheet = React.useCallback(() => {
    setFormMode("create");
    setEditingCampaignId(null);
    setFormInitialValues(EMPTY_CAMPAIGN_FORM_VALUES);
    setFormOpen(true);
  }, []);

  const openEditSheet = React.useCallback(
    (campaignId: string) => {
      const campaign = campaigns.find((candidate) => candidate.id === campaignId);
      if (!campaign) {
        return;
      }

      setFormMode("edit");
      setEditingCampaignId(campaign.id);
      setFormInitialValues({
        title: campaign.title,
        summary: campaign.summary,
        category: campaign.category,
        status: campaign.status,
        location: campaign.location,
        goalAmount: campaign.goalAmount,
        beneficiariesCount: campaign.beneficiariesCount,
        startDate: toDateInputValue(campaign.startDate),
        endDate: toDateInputValue(campaign.endDate),
      });
      setFormOpen(true);
    },
    [campaigns],
  );

  const handleSaveForm = React.useCallback(
    (values: CampaignFormValues) => {
      const now = new Date().toISOString();

      if (formMode === "create") {
        const nextCampaign: OrganizationCampaignItem = {
          id: createNextCampaignId(campaigns),
          title: values.title,
          summary: values.summary,
          category: values.category,
          status: values.status,
          location: values.location,
          goalAmount: values.goalAmount,
          raisedAmount: 0,
          beneficiariesCount: values.beneficiariesCount,
          donorsCount: 0,
          applicantsCount: 0,
          startDate: toDateTimeFromInput(values.startDate),
          endDate: toDateTimeFromInput(values.endDate),
          createdAt: now,
          updatedAt: now,
          closedAt: values.status === "closed" ? now : undefined,
          closedReason:
            values.status === "closed"
              ? "تم إغلاق الحملة عند الإنشاء."
              : undefined,
        };

        setCampaigns((currentCampaigns) => [nextCampaign, ...currentCampaigns]);
        return;
      }

      if (!editingCampaignId) {
        return;
      }

      setCampaigns((currentCampaigns) =>
        currentCampaigns.map((campaign) => {
          if (campaign.id !== editingCampaignId) {
            return campaign;
          }

          return {
            ...campaign,
            title: values.title,
            summary: values.summary,
            category: values.category,
            status: values.status,
            location: values.location,
            goalAmount: values.goalAmount,
            beneficiariesCount: values.beneficiariesCount,
            startDate: toDateTimeFromInput(values.startDate),
            endDate: toDateTimeFromInput(values.endDate),
            updatedAt: now,
            closedAt:
              values.status === "closed" ? campaign.closedAt ?? now : undefined,
            closedReason:
              values.status === "closed"
                ? campaign.closedReason ?? "تم إغلاق الحملة يدويًا."
                : undefined,
          };
        }),
      );
    },
    [campaigns, editingCampaignId, formMode],
  );

  const openCloseDialog = React.useCallback((campaignId: string) => {
    setCloseTargetCampaignId(campaignId);
    setCloseDialogOpen(true);
  }, []);

  const handleCloseCampaign = React.useCallback(
    (reason: string) => {
      if (!closeTargetCampaignId) {
        return;
      }

      const now = new Date().toISOString();

      setCampaigns((currentCampaigns) =>
        currentCampaigns.map((campaign) =>
          campaign.id === closeTargetCampaignId
            ? {
                ...campaign,
                status: "closed",
                updatedAt: now,
                closedAt: now,
                closedReason: reason,
              }
            : campaign,
        ),
      );
      setCloseTargetCampaignId(null);
    },
    [closeTargetCampaignId],
  );

  const openDeleteDialog = React.useCallback((campaignId: string) => {
    setDeleteTargetCampaignId(campaignId);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteCampaign = React.useCallback(() => {
    if (!deleteTargetCampaignId) {
      return;
    }

    setCampaigns((currentCampaigns) =>
      currentCampaigns.filter((campaign) => campaign.id !== deleteTargetCampaignId),
    );
    setDeleteTargetCampaignId(null);
  }, [deleteTargetCampaignId]);

  const pageTitle =
    status === "all"
      ? "إدارة الحملات"
      : `إدارة الحملات - ${organizationCampaignStatusLabels[status]}`;

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row md:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground sm:text-base">
            {pageTitle}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            النتائج الحالية: {filteredCampaigns.length} حملة
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={openCreateSheet}>
            إضافة حملة جديدة
            <AppIcons.campaigns className="size-4" />
          </Button>
        </div>
      </div>

      <OrganizationCampaignsFilters
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        locationFilter={locationFilter}
        locationOptions={locationOptions}
        onLocationFilterChange={setLocationFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {currentPageCampaigns.length === 0 ? (
        <EmptyState
          icon="campaigns"
          title="لا توجد حملات مطابقة"
          description="جرّب تغيير الفلاتر لعرض نتائج إضافية."
        />
      ) : (
        <OrganizationCampaignsTable
          rows={currentPageCampaigns}
          onEditCampaign={openEditSheet}
          onCloseCampaign={openCloseDialog}
          onDeleteCampaign={openDeleteDialog}
        />
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

      <CampaignFormSheet
        open={formOpen}
        mode={formMode}
        initialValues={formInitialValues}
        onOpenChange={(nextOpen) => {
          setFormOpen(nextOpen);
          if (!nextOpen) {
            setEditingCampaignId(null);
          }
        }}
        onSubmit={handleSaveForm}
      />

      <CloseCampaignDialog
        open={closeDialogOpen}
        campaignTitle={closeTargetCampaign?.title ?? "-"}
        onOpenChange={(nextOpen) => {
          setCloseDialogOpen(nextOpen);
          if (!nextOpen) {
            setCloseTargetCampaignId(null);
          }
        }}
        onConfirm={handleCloseCampaign}
      />

      <DeleteCampaignDialog
        open={deleteDialogOpen}
        campaignTitle={deleteTargetCampaign?.title ?? "-"}
        onOpenChange={(nextOpen) => {
          setDeleteDialogOpen(nextOpen);
          if (!nextOpen) {
            setDeleteTargetCampaignId(null);
          }
        }}
        onConfirm={handleDeleteCampaign}
      />
    </section>
  );
}
