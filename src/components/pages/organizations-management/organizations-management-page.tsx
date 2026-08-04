"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { PaginationControls } from "@/components/shared";
import { usePagination } from "@/hooks/use-pagination";
import { useQueryModal } from "@/hooks/use-query-modal";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { Button } from "@/components/ui/button";
import { OrganizationsTable } from "@/components/pages/organizations-management/organizations-table";
import { OrganizationDeleteDialog } from "@/components/pages/organizations-management/organization-delete-dialog";
import {
  type OrganizationsSortOption,
  OrganizationsFilters,
} from "@/components/pages/organizations-management/organizations-filters";
import {
  type OrganizationStatus,
  type OrganizationVerificationStatus,
} from "@/components/pages/organizations-management/organizations-management.types";
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
  const [searchFilter, setSearchFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | OrganizationStatus>("all");
  const [locationFilter, setLocationFilter] = React.useState("all");

  const [verificationFilter, setVerificationFilter] = React.useState<
    "all" | OrganizationVerificationStatus
  >("all");
  const [sortBy, setSortBy] = React.useState<OrganizationsSortOption>("created_newest");

  const deleteModal = useQueryModal("organization-delete");
  const deleteTargetOrganizationId = deleteModal.id;
  const [loadingRowIds, setLoadingRowIds] = React.useState<Set<string>>(new Set());

  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;

  const { data, isLoading, isFetching, isError, refetch } = useAdminOrganizations({
    page: pagination.currentPage,
    perPage: pageSize,
    sort: sortToApiSort[sortBy],
    filter: {
      search: searchFilter.trim() || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      verificationStatus: verificationFilter !== "all" ? verificationFilter : undefined,
      location: locationFilter !== "all" ? locationFilter : undefined,
    },
  });

  React.useEffect(() => {
    if (data?.meta.total !== undefined) {
      setApiTotal(data.meta.total);
    }
  }, [data?.meta.total]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, searchFilter, statusFilter, verificationFilter, locationFilter, sortBy, setCurrentPage]);

  const organizations = data?.data ?? [];
  const locationOptions = React.useMemo(
    () => Array.from(new Set(organizations.map((organization) => organization.location).filter(Boolean))).sort(),
    [organizations],
  );
  const showTableLoading = isLoading;

  const deleteTargetOrganization = deleteTargetOrganizationId
    ? (organizations.find((o) => o.id === deleteTargetOrganizationId) ?? null)
    : null;

  const toggleStatusMutation = useToggleOrganizationStatus();
  const toggleVerificationMutation = useToggleOrganizationVerification();
  const deleteMutation = useDeleteOrganization();

  const addLoadingRow = React.useCallback((id: string) => {
    setLoadingRowIds((prev) => new Set([...prev, id]));
  }, []);

  const removeLoadingRow = React.useCallback((id: string) => {
    setLoadingRowIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleResetFilters = React.useCallback(() => {
    setSearchFilter("");
    setStatusFilter("all");
    setVerificationFilter("all");
    setLocationFilter("all");
    setSortBy("created_newest");
  }, []);

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
      const nextActive = org.status !== "active";
      addLoadingRow(organizationId);
      toggleStatusMutation.mutate(
        {
          organizationId,
          body: { status: nextActive ? "active" : "inactive" },
        },
        { onSettled: () => removeLoadingRow(organizationId) },
      );
    },
    [
      organizations,
      toggleStatusMutation,
      addLoadingRow,
      removeLoadingRow,
    ],
  );

  const handleToggleOrganizationVerification = React.useCallback(
    (organizationId: string) => {
      const org = organizations.find((o) => o.id === organizationId);
      if (!org) return;
      const nextVerified = org.verificationStatus !== "verified";
      addLoadingRow(organizationId);
      toggleVerificationMutation.mutate(
        {
          organizationId,
          body: {
            verificationStatus: nextVerified ? "verified" : "unverified",
          },
        },
        { onSettled: () => removeLoadingRow(organizationId) },
      );
    },
    [
      organizations,
      toggleVerificationMutation,
      addLoadingRow,
      removeLoadingRow,
    ],
  );

  const openDeleteDialog = React.useCallback(
    (organizationId: string) => deleteModal.open({ id: organizationId }),
    [deleteModal],
  );

  const handleDeleteOrganization = React.useCallback(() => {
    if (!deleteTargetOrganizationId) return;
    deleteMutation.mutate(deleteTargetOrganizationId, {
      onSuccess: () => deleteModal.close(),
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
            مراجعة المنظمات وإدارة حالة التفعيل والتوثيق عبر الجدول.
          </p>
        </div>
      </div>

      <OrganizationsFilters
        searchFilter={searchFilter}
        onSearchFilterChange={setSearchFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        verificationFilter={verificationFilter}
        onVerificationFilterChange={setVerificationFilter}
        locationFilter={locationFilter}
        locationOptions={locationOptions}
        onLocationFilterChange={setLocationFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onResetFilters={handleResetFilters}
        isLoading={isLoading || isFetching}
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
        isLoading={showTableLoading}
        loadingRowIds={loadingRowIds}
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
        open={deleteModal.isOpen}
        organizationName={deleteTargetOrganization?.name ?? "-"}
        onOpenChange={deleteModal.onOpenChange}
        onConfirm={handleDeleteOrganization}
      />
    </section>
  );
}
