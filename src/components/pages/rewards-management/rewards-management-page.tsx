"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RewardsTable } from "@/components/pages/rewards-management/rewards-table";
import {
  EMPTY_REWARD_FORM_VALUES,
  normalizeRewardIconName,
  RewardFormSheet,
  type RewardFormValues,
} from "@/components/pages/rewards-management/reward-form-sheet";
import { AppIcons } from "@/constant/icons";
import { EmptyState, PaginationControls } from "@/components/shared";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { usePagination } from "@/hooks/use-pagination";
import {
  useAdminBadges,
  useCreateBadge,
  useUpdateBadge,
  useToggleBadgeStatus,
} from "@/features/admin/badges/admin.badges.query";
import { adminBadgesServices } from "@/features/admin/badges/admin.badges.services";
import { adminBadgesKeys } from "@/features/admin/badges/admin.badges.query-keys";

export function RewardsManagementPage() {
  const queryClient = useQueryClient();

  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [apiTotal, setApiTotal] = React.useState(0);
  const [searchFilter, setSearchFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "inactive">("all");
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [formInitialValues, setFormInitialValues] =
    React.useState<RewardFormValues>(EMPTY_REWARD_FORM_VALUES);
  const [editingBadgeId, setEditingBadgeId] = React.useState<string | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = React.useState(false);
  const [loadingRowIds, setLoadingRowIds] = React.useState<Set<string>>(new Set());

  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;

  const { data, isLoading, isFetching, isError, refetch } = useAdminBadges({
    page: pagination.currentPage,
    perPage: pageSize,
    sort: "-createdAt",
    filter: {
      search: searchFilter.trim() || undefined,
      isActive:
        statusFilter === "all" ? undefined : statusFilter === "active",
    },
  });

  React.useEffect(() => {
    if (data?.meta.total !== undefined) {
      setApiTotal(data.meta.total);
    }
  }, [data?.meta.total]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, searchFilter, statusFilter, setCurrentPage]);

  const badges = data?.data ?? [];
  const showTableLoading = isLoading || (isFetching && !isLoading);

  const createMutation = useCreateBadge();
  const updateMutation = useUpdateBadge();
  const toggleMutation = useToggleBadgeStatus();

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
  }, []);

  const openCreateSheet = React.useCallback(() => {
    setFormMode("create");
    setEditingBadgeId(null);
    setFormInitialValues(EMPTY_REWARD_FORM_VALUES);
    setIsLoadingDetails(false);
    setFormOpen(true);
  }, []);

  const openEditSheet = React.useCallback(
    async (rewardId: string) => {
      setFormMode("edit");
      setEditingBadgeId(rewardId);
      setFormInitialValues(EMPTY_REWARD_FORM_VALUES);
      setIsLoadingDetails(true);
      setFormOpen(true);

      try {
        const response = await queryClient.fetchQuery({
          queryKey: adminBadgesKeys.detail(rewardId),
          queryFn: () => adminBadgesServices.getBadgeById(rewardId),
          staleTime: 0,
        });
        const badge = response.data;
        setFormInitialValues({
          name: badge.name ?? "",
          description: badge.description ?? "",
          criteria: badge.criteria ?? "",
          iconName: normalizeRewardIconName(badge.iconName),
          isActive: Boolean(badge.isActive),
        });
      } catch {
        setFormOpen(false);
        setEditingBadgeId(null);
      } finally {
        setIsLoadingDetails(false);
      }
    },
    [queryClient],
  );

  const handleSaveForm = React.useCallback(
    (values: RewardFormValues) => {
      const body = {
        name: values.name,
        description: values.description ?? "",
        criteria: values.criteria ?? "",
        iconName: values.iconName,
        isActive: values.isActive,
      };

      if (formMode === "create") {
        createMutation.mutate(body, {
          onSuccess: () => setFormOpen(false),
        });
        return;
      }

      if (!editingBadgeId) return;

      updateMutation.mutate(
        { badgeId: editingBadgeId, body },
        {
          onSuccess: () => {
            setFormOpen(false);
            setEditingBadgeId(null);
          },
        },
      );
    },
    [formMode, editingBadgeId, createMutation, updateMutation],
  );

  const handleToggleRewardStatus = React.useCallback(
    (rewardId: string) => {
      const badge = badges.find((b) => b.id === rewardId);
      if (!badge) return;
      addLoadingRow(rewardId);
      toggleMutation.mutate(
        { badgeId: rewardId, isActive: !badge.isActive },
        { onSettled: () => removeLoadingRow(rewardId) },
      );
    },
    [badges, toggleMutation, addLoadingRow, removeLoadingRow],
  );

  const isFormSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <section className="flex flex-col flex-1 gap-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            إدارة الشارات والمكافآت
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {apiTotal} شارة
          </p>
        </div>
        <Button
          size="sm"
          className="w-fit"
          disabled={showTableLoading}
          onClick={openCreateSheet}
        >
          <AppIcons.rewards className="size-4" />
          إضافة شارة
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          dir="rtl"
          autoComplete="off"
          disabled={showTableLoading}
          placeholder="بحث بالاسم..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="min-w-[160px] flex-1 text-right text-xs sm:max-w-xs"
        />
        <Select
          dir="rtl"
          disabled={showTableLoading}
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as "all" | "active" | "inactive")
          }
        >
          <SelectTrigger className="w-full min-w-[140px] flex-1 text-right text-xs sm:max-w-[180px]">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent align="start" position="popper" className="text-right">
            <SelectItem value="all" className="text-right text-xs">
              كل الحالات
            </SelectItem>
            <SelectItem value="active" className="text-right text-xs">
              نشط
            </SelectItem>
            <SelectItem value="inactive" className="text-right text-xs">
              معطّل
            </SelectItem>
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ms-auto h-8 shrink-0 px-3 text-xs"
          disabled={showTableLoading}
          onClick={handleResetFilters}
        >
          إعادة تعيين
        </Button>
      </div>

      {isError && (
        <div className="flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="flex-1 text-sm text-destructive">
            تعذّر تحميل الشارات. حاول مرة أخرى.
          </p>
          <Button type="button" size="sm" variant="outline" onClick={() => refetch()}>
            إعادة المحاولة
          </Button>
        </div>
      )}

      {!showTableLoading && badges.length === 0 ? (
        <EmptyState
          icon="rewards"
          title="لا توجد شارات حتى الآن"
          description="أضف شارة جديدة من الزر أعلاه"
        />
      ) : (
        <RewardsTable
          rows={badges}
          isLoading={showTableLoading}
          loadingRowIds={loadingRowIds}
          onEditReward={openEditSheet}
          onToggleRewardStatus={handleToggleRewardStatus}
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

      <RewardFormSheet
        open={formOpen}
        mode={formMode}
        initialValues={formInitialValues}
        isSubmitting={isFormSubmitting}
        isLoadingDetails={isLoadingDetails}
        onOpenChange={(nextOpen) => {
          if (isFormSubmitting || isLoadingDetails) return;
          setFormOpen(nextOpen);
          if (!nextOpen) setEditingBadgeId(null);
        }}
        onSubmit={handleSaveForm}
      />
    </section>
  );
}
