"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { EmptyState, ListLoadingSkeleton, PaginationControls } from "@/components/shared";
import { AppIcons } from "@/constant/icons";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { displayOrDash } from "@/lib/text";
import { useAuth } from "@/providers/AuthProvider";
import {
  CampaignFormSheet,
  EMPTY_CAMPAIGN_FORM_VALUES,
  type CampaignFormValues,
} from "@/components/pages/organization-campaigns/campaign-form-sheet";
import { CloseCampaignDialog } from "@/components/pages/organization-campaigns/close-campaign-dialog";
import { DeleteCampaignDialog } from "@/components/pages/organization-campaigns/delete-campaign-dialog";
import { toDateTimeFromInput } from "@/components/pages/organization-campaigns/helpers";
import {
  type CampaignSortOption,
  OrganizationCampaignsFilters,
} from "@/components/pages/organization-campaigns/organization-campaigns-filters";
import { OrganizationCampaignsTable } from "@/components/pages/organization-campaigns/organization-campaigns-table";
import {
  organizationCampaignStatusLabels,
  type OrganizationCampaignCategory,
  type OrganizationCampaignStatus,
} from "@/components/pages/organization-campaigns/static-data";
import {
  useOrgCampaigns,
  useCreateOrgCampaign,
  useCloseOrgCampaign,
  useDeleteOrgCampaign,
} from "@/features/org/campaigns/org.campaigns.query";

type OrganizationCampaignsPageProps = {
  status: "all" | OrganizationCampaignStatus;
};

const sortToApiSort: Record<CampaignSortOption, string> = {
  updated_newest: "-updatedAt",
  updated_oldest: "updatedAt",
  progress_highest: "-raisedAmount",
  progress_lowest: "raisedAmount",
};

export function OrganizationCampaignsPage({
  status,
}: OrganizationCampaignsPageProps) {
  const { can } = useAuth();
  const canCreate = can("org.campaigns.create");
  const canClose = can("org.campaigns.close");
  const canDelete = can("org.campaigns.delete");
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [apiTotal, setApiTotal] = React.useState(0);

  const [categoryFilter, setCategoryFilter] = React.useState<
    "all" | OrganizationCampaignCategory
  >("all");
  const [sortBy, setSortBy] = React.useState<CampaignSortOption>("updated_newest");

  const [formOpen, setFormOpen] = React.useState(false);

  const [closeDialogOpen, setCloseDialogOpen] = React.useState(false);
  const [closeTargetCampaignId, setCloseTargetCampaignId] = React.useState<string | null>(null);
  const [closeTargetTitle, setCloseTargetTitle] = React.useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteTargetCampaignId, setDeleteTargetCampaignId] = React.useState<string | null>(null);
  const [deleteTargetTitle, setDeleteTargetTitle] = React.useState("");

  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;

  const { data, isLoading, isError, refetch } = useOrgCampaigns({
    page: pagination.currentPage,
    perPage: pageSize,
    sort: sortToApiSort[sortBy],
    filter: {
      status: status !== "all" ? status : undefined,
      category: categoryFilter !== "all" ? categoryFilter : undefined,
    },
  });

  React.useEffect(() => {
    if (data?.meta.total !== undefined) {
      setApiTotal(data.meta.total);
    }
  }, [data?.meta.total]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, pageSize, sortBy, status, setCurrentPage]);

  const campaigns = data?.data ?? [];

  const createMutation = useCreateOrgCampaign();
  const closeMutation = useCloseOrgCampaign();
  const deleteMutation = useDeleteOrgCampaign();

  const openCreateSheet = React.useCallback(() => {
    setFormOpen(true);
  }, []);


  const handleSaveForm = React.useCallback(
    (values: CampaignFormValues) => {
      createMutation.mutate(
        {
          title: values.title,
          summary: values.summary,
          category: values.category,
          status: values.status,
          location: values.location,
          goalAmount: values.goalAmount,
          beneficiariesCount: values.beneficiariesCount,
          startDate: toDateTimeFromInput(values.startDate),
          endDate: toDateTimeFromInput(values.endDate),
        },
        { onSuccess: () => setFormOpen(false) },
      );
    },
    [createMutation],
  );

  const openCloseDialog = React.useCallback(
    (campaignId: string) => {
      const campaign = campaigns.find((c) => c.id === campaignId);
      setCloseTargetCampaignId(campaignId);
      setCloseTargetTitle(displayOrDash(campaign?.title));
      setCloseDialogOpen(true);
    },
    [campaigns],
  );

  const handleCloseCampaign = React.useCallback(
    (reason: string) => {
      if (!closeTargetCampaignId) return;
      closeMutation.mutate(
        { campaignId: closeTargetCampaignId, body: { reason } },
        {
          onSuccess: () => {
            setCloseDialogOpen(false);
            setCloseTargetCampaignId(null);
          },
        },
      );
    },
    [closeTargetCampaignId, closeMutation],
  );

  const openDeleteDialog = React.useCallback(
    (campaignId: string) => {
      const campaign = campaigns.find((c) => c.id === campaignId);
      setDeleteTargetCampaignId(campaignId);
      setDeleteTargetTitle(displayOrDash(campaign?.title));
      setDeleteDialogOpen(true);
    },
    [campaigns],
  );

  const handleDeleteCampaign = React.useCallback(() => {
    if (!deleteTargetCampaignId) return;
    deleteMutation.mutate(deleteTargetCampaignId, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setDeleteTargetCampaignId(null);
      },
    });
  }, [deleteTargetCampaignId, deleteMutation]);

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
            النتائج الحالية: {apiTotal} حملة
          </p>
        </div>
        {canCreate ? (
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={openCreateSheet}>
              إضافة حملة جديدة
              <AppIcons.campaigns className="size-4" />
            </Button>
          </div>
        ) : null}
      </div>

      <OrganizationCampaignsFilters
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        locationFilter="all"
        locationOptions={[]}
        onLocationFilterChange={() => undefined}
        sortBy={sortBy}
        onSortByChange={setSortBy}
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

      {isLoading ? (
        <ListLoadingSkeleton />
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon="campaigns"
          title="لا توجد حملات مطابقة"
          description="جرّب تغيير الفلاتر لعرض نتائج إضافية."
        />
      ) : (
        <OrganizationCampaignsTable
          rows={campaigns}
          onCloseCampaign={openCloseDialog}
          onDeleteCampaign={openDeleteDialog}
          canClose={canClose}
          canDelete={canDelete}
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
        mode="create"
        initialValues={EMPTY_CAMPAIGN_FORM_VALUES}
        onOpenChange={setFormOpen}
        onSubmit={handleSaveForm}
      />

      <CloseCampaignDialog
        open={closeDialogOpen}
        campaignTitle={closeTargetTitle}
        onOpenChange={(nextOpen) => {
          setCloseDialogOpen(nextOpen);
          if (!nextOpen) setCloseTargetCampaignId(null);
        }}
        onConfirm={handleCloseCampaign}
      />

      <DeleteCampaignDialog
        open={deleteDialogOpen}
        campaignTitle={deleteTargetTitle}
        onOpenChange={(nextOpen) => {
          setDeleteDialogOpen(nextOpen);
          if (!nextOpen) setDeleteTargetCampaignId(null);
        }}
        onConfirm={handleDeleteCampaign}
      />
    </section>
  );
}
