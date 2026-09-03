"use client";

import * as React from "react";

import { EmptyState, PaginationControls } from "@/components/shared";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { usePagination } from "@/hooks/use-pagination";
import { useQueryDisclosure, useQueryModal } from "@/hooks/use-query-modal";
import {
  useAdminGroups,
  useApproveGroup,
  useDeleteGroup,
  useRejectGroup,
} from "@/features/admin/groups/admin.groups.query";
import type { AdminGroupSortOption } from "@/features/admin/groups/admin.groups.types";
import { GroupDetailsSheet } from "@/components/pages/groups-management/group-details-sheet";
import { GroupsTable } from "@/components/pages/groups-management/groups-table";
import { GroupsToolbar } from "@/components/pages/groups-management/groups-toolbar";
import {
  groupStatusLabels,
  type AdminGroupStatus,
} from "@/components/pages/groups-management/groups-management.types";

const ALL_OPTION = "all";

const sortToApiSort: Record<AdminGroupSortOption, string> = {
  name_asc: "name",
  name_desc: "-name",
  created_at_newest: "-submittedAt",
  created_at_oldest: "submittedAt",
  members_desc: "-membersCount",
};

const emptyStateDescriptions: Record<AdminGroupStatus, string> = {
  pending: "لا توجد طلبات إنشاء فرق تطوعية بانتظار المراجعة حالياً.",
  active: "لا توجد فرق تطوعية مقبولة تطابق البحث أو الفلاتر المختارة.",
  rejected: "لا توجد فرق تطوعية مرفوضة تطابق البحث أو الفلاتر المختارة.",
};

type GroupsManagementPageProps = {
  status: AdminGroupStatus;
};

export function GroupsManagementPage({ status }: GroupsManagementPageProps) {
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>(ALL_OPTION);
  const [sortBy, setSortBy] = React.useState<AdminGroupSortOption>("created_at_newest");
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [apiTotal, setApiTotal] = React.useState(0);

  const detailsModal = useQueryModal("group-details");
  const debouncedSearch = useDebounce(search, 400);
  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;

  const { data, isLoading, isError } = useAdminGroups({
    page: pagination.currentPage,
    perPage: pageSize,
    status,
    category: categoryFilter !== ALL_OPTION ? categoryFilter : undefined,
    search: debouncedSearch || undefined,
    sort: sortToApiSort[sortBy],
  });

  React.useEffect(() => {
    if (data?.meta.total === undefined) return;
    const timer = window.setTimeout(() => setApiTotal(data.meta.total), 0);
    return () => window.clearTimeout(timer);
  }, [data?.meta.total]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [status, debouncedSearch, categoryFilter, sortBy, pageSize, setCurrentPage]);

  const approveMutation = useApproveGroup();
  const rejectMutation = useRejectGroup();
  const deleteMutation = useDeleteGroup();

  const groups = data?.data ?? [];
  const selected = groups.find((group) => group.id === detailsModal.id) ?? null;

  // The reject dialog is owned by the table row, so the sheet reopens it through
  // the same query param instead of rendering a second copy of the dialog.
  const [, setRejectDialogOpen] = useQueryDisclosure(
    `group-reject-${detailsModal.id ?? ""}`,
  );

  const busyMutation = [
    approveMutation,
    rejectMutation,
    deleteMutation,
  ].find((mutation) => mutation.isPending);

  const busyGroupId = busyMutation?.variables?.groupId;
  const deletingGroupId = deleteMutation.isPending
    ? deleteMutation.variables?.groupId
    : undefined;

  return (
    <section className="flex flex-1 flex-col gap-4">
      <GroupsToolbar
        status={status}
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        totalResults={apiTotal}
      />

      {isError ? (
        <p className="text-sm text-destructive">تعذّر تحميل المجموعات. حاول مرة أخرى.</p>
      ) : null}

      {isLoading ? (
        <div className="h-48 animate-pulse rounded-md border bg-muted/30" />
      ) : null}

      {!isLoading && groups.length === 0 ? (
        <EmptyState
          icon="groups"
          title={`لا توجد فرق تطوعية ضمن حالة ${groupStatusLabels[status]}`}
          description={emptyStateDescriptions[status]}
        />
      ) : null}

      {!isLoading && groups.length > 0 ? (
        <GroupsTable
          groups={groups}
          busyGroupId={busyGroupId}
          deletingGroupId={deletingGroupId}
          onOpenDetails={(group) => detailsModal.open({ id: group.id })}
          onApprove={(groupId) => approveMutation.mutate({ groupId })}
          onReject={(groupId, rejectionReason) =>
            rejectMutation.mutate({ groupId, rejectionReason })
          }
          onDelete={(groupId) =>
            deleteMutation.mutate({ groupId }, { onSuccess: () => detailsModal.close() })
          }
        />
      ) : null}

      {selected ? (
        <GroupDetailsSheet
          open={detailsModal.isOpen}
          onOpenChange={detailsModal.onOpenChange}
          group={selected}
          isDeciding={approveMutation.isPending || rejectMutation.isPending}
          onApprove={(groupId) =>
            approveMutation.mutate({ groupId }, { onSuccess: () => detailsModal.close() })
          }
          onReject={() => setRejectDialogOpen(true)}
        />
      ) : null}

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
