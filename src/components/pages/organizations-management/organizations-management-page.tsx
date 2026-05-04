"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { PaginationControls } from "@/components/shared";
import { usePagination } from "@/hooks/use-pagination";
import { toUtcTimestamp } from "@/lib/date";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { OrganizationsTable } from "@/components/pages/organizations-management/organizations-table";
import { OrganizationDeleteDialog } from "@/components/pages/organizations-management/organization-delete-dialog";
import {
  type OrganizationsSortOption,
  OrganizationsFilters,
} from "@/components/pages/organizations-management/organizations-filters";
import {
  organizationsStaticData,
  type AdminOrganizationItem,
  type OrganizationStatus,
  type OrganizationVerificationStatus,
} from "@/components/pages/organizations-management/static-data";
import { routePaths } from "@/constant/routes";

export function OrganizationsManagementPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = React.useState<
    AdminOrganizationItem[]
  >(organizationsStaticData);
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);

  const [verificationFilter, setVerificationFilter] = React.useState<
    "all" | OrganizationVerificationStatus
  >("all");
  const [locationFilter, setLocationFilter] = React.useState("all");
  const [sortBy, setSortBy] =
    React.useState<OrganizationsSortOption>("created_newest");

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteTargetOrganizationId, setDeleteTargetOrganizationId] =
    React.useState<string | null>(null);

  const locationOptions = React.useMemo(() => {
    const uniqueLocations = Array.from(
      new Set(organizations.map((organization) => organization.location)),
    );

    return uniqueLocations.sort((firstLocation, secondLocation) =>
      firstLocation.localeCompare(secondLocation, "ar", {
        sensitivity: "base",
      }),
    );
  }, [organizations]);

  React.useEffect(() => {
    if (locationFilter !== "all" && !locationOptions.includes(locationFilter)) {
      setLocationFilter("all");
    }
  }, [locationFilter, locationOptions]);

  const filteredOrganizations = React.useMemo(() => {
    const filtered = organizations.filter((organization) => {
      if (
        verificationFilter !== "all" &&
        organization.verificationStatus !== verificationFilter
      ) {
        return false;
      }

      if (
        locationFilter !== "all" &&
        organization.location !== locationFilter
      ) {
        return false;
      }

      return true;
    });

    return filtered.sort((firstOrganization, secondOrganization) => {
      if (sortBy === "name_asc") {
        return firstOrganization.name.localeCompare(
          secondOrganization.name,
          "ar",
          {
            sensitivity: "base",
          },
        );
      }

      if (sortBy === "name_desc") {
        return secondOrganization.name.localeCompare(
          firstOrganization.name,
          "ar",
          {
            sensitivity: "base",
          },
        );
      }

      if (sortBy === "created_oldest") {
        return (
          toUtcTimestamp(firstOrganization.createdAt) -
          toUtcTimestamp(secondOrganization.createdAt)
        );
      }

      return (
        toUtcTimestamp(secondOrganization.createdAt) -
        toUtcTimestamp(firstOrganization.createdAt)
      );
    });
  }, [locationFilter, organizations, sortBy, verificationFilter]);

  const pagination = usePagination({
    totalItems: filteredOrganizations.length,
    pageSize,
  });
  const { setCurrentPage } = pagination;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [locationFilter, pageSize, setCurrentPage, sortBy, verificationFilter]);

  const currentPageOrganizations = React.useMemo(
    () =>
      filteredOrganizations.slice(pagination.startIndex, pagination.endIndex),
    [filteredOrganizations, pagination.endIndex, pagination.startIndex],
  );

  const deleteTargetOrganization = React.useMemo(
    () =>
      deleteTargetOrganizationId
        ? (organizations.find(
            (organization) => organization.id === deleteTargetOrganizationId,
          ) ?? null)
        : null,
    [deleteTargetOrganizationId, organizations],
  );

  const openOrganizationDetails = React.useCallback(
    (organizationId: string) => {
      router.push(routePaths.adminScope.organizationDetails(organizationId));
    },
    [router],
  );

  const handleToggleOrganizationStatus = React.useCallback(
    (organizationId: string) => {
      setOrganizations((currentOrganizations) =>
        currentOrganizations.map((organization) =>
          organization.id === organizationId
            ? {
                ...organization,
                status: (organization.status === "active"
                  ? "inactive"
                  : "active") as OrganizationStatus,
              }
            : organization,
        ),
      );
    },
    [],
  );

  const handleToggleOrganizationVerification = React.useCallback(
    (organizationId: string) => {
      setOrganizations((currentOrganizations) =>
        currentOrganizations.map((organization) =>
          organization.id === organizationId
            ? {
                ...organization,
                verificationStatus:
                  organization.verificationStatus === "verified"
                    ? "unverified"
                    : "verified",
              }
            : organization,
        ),
      );
    },
    [],
  );

  const openDeleteDialog = React.useCallback((organizationId: string) => {
    setDeleteTargetOrganizationId(organizationId);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteOrganization = React.useCallback(() => {
    if (!deleteTargetOrganizationId) {
      return;
    }

    setOrganizations((currentOrganizations) =>
      currentOrganizations.filter(
        (organization) => organization.id !== deleteTargetOrganizationId,
      ),
    );
    setDeleteDialogOpen(false);
    setDeleteTargetOrganizationId(null);
  }, [deleteTargetOrganizationId]);

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
        locationFilter={locationFilter}
        locationOptions={locationOptions}
        onLocationFilterChange={setLocationFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      <OrganizationsTable
        rows={currentPageOrganizations}
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
          if (!nextOpen) {
            setDeleteTargetOrganizationId(null);
          }
        }}
        onConfirm={handleDeleteOrganization}
      />
    </section>
  );
}
