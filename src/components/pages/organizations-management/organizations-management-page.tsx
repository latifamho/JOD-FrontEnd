"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { PaginationControls } from "@/components/shared";
import { usePagination } from "@/hooks/use-pagination";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { Button } from "@/components/ui/button";
import { OrganizationsTable } from "@/components/pages/organizations-management/organizations-table";
import { OrganizationDeleteDialog } from "@/components/pages/organizations-management/organization-delete-dialog";
import {
  type OrganizationsSortOption,
  OrganizationsFilters,
} from "@/components/pages/organizations-management/organizations-filters";
import {
  type OrganizationVerificationStatus,
} from "@/components/pages/organizations-management/static-data";
import { routePaths } from "@/constant/routes";
import {
  useAdminOrganizations,
  useToggleOrganizationStatus,
  useToggleOrganizationVerification,
  useDeleteOrganization,
} from "@/features/admin/organizations/admin.organizations.query";

const sortToApiSort: Record<OrganizationsSortOption, string> = {
  created_newest: "-createdAt",
  created_oldest: "createdAt",
  name_asc: "name",
  name_desc: "-name",
};

export function OrganizationsManagementPage() {
  const router = useRouter();

  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [apiTotal, setApiTotal] = React.useState(0);

  const [verificationFilter, setVerificationFilter] = React.useState<
    "all" | OrganizationVerificationStatus
  >("all");
  const [sortBy, setSortBy] = React.useState<OrganizationsSortOption>("created_newest");

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteTargetOrganizationId, setDeleteTargetOrganizationId] =
    React.useState<string | null>(null);

  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;

  const { data, isError, refetch } = useAdminOrganizations({
    page: pagination.currentPage,
    perPage: pageSize,
    sort: sortToApiSort[sortBy],
    filter: {
      verificationStatus: verificationFilter !== "all" ? verificationFilter : undefined,
    },
  });

  React.useEffect(() => {
    if (data?.meta.total !== undefined) {
      setApiTotal(data.meta.total);
    }
  }, [data?.meta.total]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, verificationFilter, sortBy, setCurrentPage]);

  const organizations = data?.data ?? [];

  const deleteTargetOrganization = deleteTargetOrganizationId
    ? (organizations.find((o) => o.id === deleteTargetOrganizationId) ?? null)
    : null;

  const toggleStatusMutation = useToggleOrganizationStatus();
  const toggleVerificationMutation = useToggleOrganizationVerification();
  const deleteMutation = useDeleteOrganization();

  const openOrganizationDetails = React.useCallback(
    (organizationId: string) => {
      router.push(routePaths.adminScope.organizationDetails(organizationId));
    },
    [router],
  );

  const handleToggleOrganizationStatus = React.useCallback(
    (organizationId: string) => {
      const org = organizations.find((o) => o.id === organizationId);
      if (!org) return;
      const nextStatus = org.status === "active" ? "inactive" : "active";
      toggleStatusMutation.mutate({ organizationId, body: { status: nextStatus } });
    },
    [organizations, toggleStatusMutation],
  );

  const handleToggleOrganizationVerification = React.useCallback(
    (organizationId: string) => {
      const org = organizations.find((o) => o.id === organizationId);
      if (!org) return;
      const nextStatus =
        org.verificationStatus === "verified" ? "unverified" : "verified";
      toggleVerificationMutation.mutate({ organizationId, body: { verificationStatus: nextStatus } });
    },
    [organizations, toggleVerificationMutation],
  );

  const openDeleteDialog = React.useCallback((organizationId: string) => {
    setDeleteTargetOrganizationId(organizationId);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteOrganization = React.useCallback(() => {
    if (!deleteTargetOrganizationId) return;
    deleteMutation.mutate(deleteTargetOrganizationId, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setDeleteTargetOrganizationId(null);
      },
    });
  }, [deleteTargetOrganizationId, deleteMutation]);

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row md:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground sm:text-base">
            إدارة المنظمات
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            إدارة بيانات المنظمات والتوثيق والحالة عبر الجدول.
          </p>
        </div>
      </div>

      <OrganizationsFilters
        verificationFilter={verificationFilter}
        onVerificationFilterChange={setVerificationFilter}
        locationFilter="all"
        locationOptions={[]}
        onLocationFilterChange={() => undefined}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {isError && (
        <div className="flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="flex-1 text-sm text-destructive">
            تعذّر تحميل المنظمات. حاول مرة أخرى.
          </p>
          <Button type="button" size="sm" variant="outline" onClick={() => refetch()}>
            إعادة المحاولة
          </Button>
        </div>
      )}

      <OrganizationsTable
        rows={organizations}
        onViewOrganization={openOrganizationDetails}
        onToggleOrganizationStatus={handleToggleOrganizationStatus}
        onToggleOrganizationVerification={handleToggleOrganizationVerification}
        onDeleteOrganization={openDeleteDialog}
      />

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

      <OrganizationDeleteDialog
        open={deleteDialogOpen}
        organizationName={deleteTargetOrganization?.name ?? "-"}
        onOpenChange={(nextOpen) => {
          setDeleteDialogOpen(nextOpen);
          if (!nextOpen) setDeleteTargetOrganizationId(null);
        }}
        onConfirm={handleDeleteOrganization}
      />
    </section>
  );
}
