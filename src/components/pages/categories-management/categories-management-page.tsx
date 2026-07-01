"use client";

import * as React from "react";

import { PaginationControls } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { AppIcons } from "@/constant/icons";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { usePagination } from "@/hooks/use-pagination";
import {
  type CategoryStatus,
  type CategoryTarget,
} from "@/components/pages/categories-management/static-data";
import {
  CategoryFormSheet,
  EMPTY_CATEGORY_FORM_VALUES,
  type CategoryFormValues,
} from "@/components/pages/categories-management/category-form-sheet";
import { CategoriesTable } from "@/components/pages/categories-management/categories-table";
import { CategoryDeleteDialog } from "@/components/pages/categories-management/category-delete-dialog";
import { CategoriesFilters } from "@/components/pages/categories-management/categories-filters";
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useToggleCategoryStatus,
  useDeleteCategory,
} from "@/features/admin/categories/admin.categories.query";
import { adminCategoriesServices } from "@/features/admin/categories/admin.categories.services";
import { adminCategoriesKeys } from "@/features/admin/categories/admin.categories.query-keys";
import { useQueryClient } from "@tanstack/react-query";

export function CategoriesManagementPage() {
  const queryClient = useQueryClient();

  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [apiTotal, setApiTotal] = React.useState(0);
  const [targetFilter, setTargetFilter] = React.useState<"all" | CategoryTarget>("all");
  const [statusFilter, setStatusFilter] = React.useState<"all" | CategoryStatus>("all");
  const [searchFilter, setSearchFilter] = React.useState("");

  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;

  const { data, isLoading, isError, refetch } = useAdminCategories({
    page: pagination.currentPage,
    perPage: pageSize,
    sort: "-createdAt",
    filter: {
      target: targetFilter !== "all" ? targetFilter : undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      search: searchFilter.trim() || undefined,
    },
  });

  React.useEffect(() => {
    if (data?.meta.total !== undefined) {
      setApiTotal(data.meta.total);
    }
  }, [data?.meta.total]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, targetFilter, statusFilter, searchFilter, setCurrentPage]);

  const categories = data?.data ?? [];

  // Form sheet state
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [formInitialValues, setFormInitialValues] =
    React.useState<CategoryFormValues>(EMPTY_CATEGORY_FORM_VALUES);
  const [editingCategoryId, setEditingCategoryId] = React.useState<string | null>(null);

  // Per-row loading
  const [loadingRowIds, setLoadingRowIds] = React.useState<Set<string>>(new Set());

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteTargetCategoryId, setDeleteTargetCategoryId] = React.useState<string | null>(null);

  // Mutations
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const toggleStatusMutation = useToggleCategoryStatus();
  const deleteMutation = useDeleteCategory();

  const deleteTargetCategory = deleteTargetCategoryId
    ? (categories.find((c) => c.id === deleteTargetCategoryId) ?? null)
    : null;

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

  const openCreateSheet = React.useCallback(() => {
    setFormMode("create");
    setEditingCategoryId(null);
    setFormInitialValues(EMPTY_CATEGORY_FORM_VALUES);
    setFormOpen(true);
  }, []);

  const openEditSheet = React.useCallback(
    async (categoryId: string) => {
      addLoadingRow(categoryId);
      try {
        const response = await queryClient.fetchQuery({
          queryKey: adminCategoriesKeys.detail(categoryId),
          queryFn: () => adminCategoriesServices.getCategoryById(categoryId),
          staleTime: 0,
        });
        const category = response.data;
        setFormMode("edit");
        setEditingCategoryId(categoryId);
        setFormInitialValues({
          name: category.name,
          target: category.target,
          description: category.description,
          status: category.status,
        });
        setFormOpen(true);
      } catch {
        // toast already shown by the api interceptor
      } finally {
        removeLoadingRow(categoryId);
      }
    },
    [queryClient, addLoadingRow, removeLoadingRow],
  );

  const handleSaveForm = React.useCallback(
    (values: CategoryFormValues) => {
      if (formMode === "create") {
        createMutation.mutate(values, {
          onSuccess: () => {
            setFormOpen(false);
          },
        });
        return;
      }

      if (!editingCategoryId) return;

      updateMutation.mutate(
        { categoryId: editingCategoryId, body: values },
        {
          onSuccess: () => {
            setFormOpen(false);
            setEditingCategoryId(null);
          },
        },
      );
    },
    [formMode, editingCategoryId, createMutation, updateMutation],
  );

  const handleToggleCategoryStatus = React.useCallback(
    (categoryId: string) => {
      const category = categories.find((c) => c.id === categoryId);
      if (!category) return;
      const nextStatus: CategoryStatus =
        category.status === "active" ? "inactive" : "active";
      addLoadingRow(categoryId);
      toggleStatusMutation.mutate(
        { categoryId, status: nextStatus },
        { onSettled: () => removeLoadingRow(categoryId) },
      );
    },
    [categories, toggleStatusMutation, addLoadingRow, removeLoadingRow],
  );

  const openDeleteDialog = React.useCallback((categoryId: string) => {
    setDeleteTargetCategoryId(categoryId);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteCategory = React.useCallback(() => {
    if (!deleteTargetCategoryId) return;
    deleteMutation.mutate(deleteTargetCategoryId, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setDeleteTargetCategoryId(null);
      },
    });
  }, [deleteTargetCategoryId, deleteMutation]);

  const isFormSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">إدارة التصنيفات</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            تخصيص تصنيفات المنشورات والحملات لتسهيل التنظيم والإدارة.
          </p>
        </div>

        <Button size="sm" className="w-fit" disabled={isLoading} onClick={openCreateSheet}>
          <AppIcons.categories className="size-4" />
          إضافة تصنيف
        </Button>
      </div>

      <CategoriesFilters
        targetFilter={targetFilter}
        statusFilter={statusFilter}
        searchFilter={searchFilter}
        onTargetFilterChange={setTargetFilter}
        onStatusFilterChange={setStatusFilter}
        onSearchFilterChange={setSearchFilter}
      />

      {isError && (
        <div className="flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="flex-1 text-sm text-destructive">
            تعذّر تحميل التصنيفات. حاول مرة أخرى.
          </p>
          <Button type="button" size="sm" variant="outline" onClick={() => refetch()}>
            إعادة المحاولة
          </Button>
        </div>
      )}

      <CategoriesTable
        rows={categories}
        isLoading={isLoading}
        loadingRowIds={loadingRowIds}
        onEditCategory={openEditSheet}
        onToggleCategoryStatus={handleToggleCategoryStatus}
        onDeleteCategory={openDeleteDialog}
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

      <CategoryFormSheet
        open={formOpen}
        mode={formMode}
        initialValues={formInitialValues}
        isSubmitting={isFormSubmitting}
        onOpenChange={(nextOpen) => {
          if (isFormSubmitting) return;
          setFormOpen(nextOpen);
          if (!nextOpen) setEditingCategoryId(null);
        }}
        onSubmit={handleSaveForm}
      />

      <CategoryDeleteDialog
        open={deleteDialogOpen}
        categoryName={deleteTargetCategory?.name ?? "-"}
        isDeleting={deleteMutation.isPending}
        onOpenChange={(nextOpen) => {
          if (!deleteMutation.isPending) {
            setDeleteDialogOpen(nextOpen);
            if (!nextOpen) setDeleteTargetCategoryId(null);
          }
        }}
        onConfirm={handleDeleteCategory}
      />
    </section>
  );
}
