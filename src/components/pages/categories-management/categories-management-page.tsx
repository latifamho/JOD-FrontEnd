"use client";

import * as React from "react";

import { PaginationControls } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { AppIcons } from "@/constant/icons";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { useQueryModal } from "@/hooks/use-query-modal";
import {
  type CategoryStatus,
  type CategoryTarget,
} from "@/components/pages/categories-management/categories-management.types";
import {
  CategoryFormSheet,
  EMPTY_CATEGORY_FORM_VALUES,
  type CategoryFormValues,
} from "@/components/pages/categories-management/category-form-sheet";
import { CategoriesTable } from "@/components/pages/categories-management/categories-table";
import { CategoryDeleteDialog } from "@/components/pages/categories-management/category-delete-dialog";
import { CategoriesFilters } from "@/components/pages/categories-management/categories-filters";
import { displayOrDash } from "@/lib/text";
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
  const [searchFilter, setSearchFilter] = React.useState("");
  const [targetFilter, setTargetFilter] = React.useState<"all" | CategoryTarget>("all");
  const [statusFilter, setStatusFilter] = React.useState<"all" | CategoryStatus>("all");

  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;

  const { data, isLoading, isError, refetch } = useAdminCategories({
    page: pagination.currentPage,
    perPage: pageSize,
    sort: "-createdAt",
    filter: {
      search: searchFilter.trim() || undefined,
      target: targetFilter !== "all" ? targetFilter : undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
    },
  });

  React.useEffect(() => {
    if (data?.meta.total !== undefined) {
      setApiTotal(data.meta.total);
    }
  }, [data?.meta.total]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, searchFilter, targetFilter, statusFilter, setCurrentPage]);

  const categories = data?.data ?? [];

  const formModal = useQueryModal("category-form");
  const deleteModal = useQueryModal("category-delete");
  const formMode = formModal.mode === "edit" ? "edit" : "create";
  const [formInitialValues, setFormInitialValues] =
    React.useState<CategoryFormValues>(EMPTY_CATEGORY_FORM_VALUES);
  const editingCategoryId = formMode === "edit" ? formModal.id : null;
  const [isLoadingDetails, setIsLoadingDetails] = React.useState(false);

  // Per-row toggle loading
  const [togglingRowIds, setTogglingRowIds] = React.useState<Set<string>>(new Set());

  const deleteTargetCategoryId = deleteModal.id;

  // Mutations
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const toggleStatusMutation = useToggleCategoryStatus();
  const deleteMutation = useDeleteCategory();

  const deleteTargetCategory = deleteTargetCategoryId
    ? (categories.find((c) => c.id === deleteTargetCategoryId) ?? null)
    : null;

  const addTogglingRow = React.useCallback((id: string) => {
    setTogglingRowIds((prev) => new Set([...prev, id]));
  }, []);

  const removeTogglingRow = React.useCallback((id: string) => {
    setTogglingRowIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const resetFilters = React.useCallback(() => {
    setSearchFilter("");
    setTargetFilter("all");
    setStatusFilter("all");
  }, []);

  const openCreateSheet = React.useCallback(() => {

    setFormInitialValues(EMPTY_CATEGORY_FORM_VALUES);
    setIsLoadingDetails(false);
    formModal.open({ mode: "create" });
  }, []);

  const openEditSheet = React.useCallback(
    async (categoryId: string) => {

      setFormInitialValues(EMPTY_CATEGORY_FORM_VALUES);
      setIsLoadingDetails(true);
      formModal.open({ id: categoryId, mode: "edit" });

      try {
        const response = await queryClient.fetchQuery({
          queryKey: adminCategoriesKeys.detail(categoryId),
          queryFn: () => adminCategoriesServices.getCategoryById(categoryId),
          staleTime: 0,
        });
        const category = response.data;
        setFormInitialValues({
          name: category.name,
          description: category.description,
          target: category.target,
          status: category.status,
        });
      } catch {
        // toast already shown by the api interceptor
        formModal.close();
      } finally {
        setIsLoadingDetails(false);
      }
    },
    [queryClient],
  );

  const handleSaveForm = React.useCallback(
    (values: CategoryFormValues) => {
      const body = {
        name: values.name,
        description: values.description,
        target: values.target,
        status: values.status,
      };

      if (formMode === "create") {
        createMutation.mutate(body, {
          onSuccess: () => {
            formModal.close();
          },
        });
        return;
      }

      if (!editingCategoryId) return;

      updateMutation.mutate(
        { categoryId: editingCategoryId, body },
        {
          onSuccess: () => {
            formModal.close();
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
      addTogglingRow(categoryId);
      toggleStatusMutation.mutate(
        { categoryId, status: nextStatus },
        { onSettled: () => removeTogglingRow(categoryId) },
      );
    },
    [categories, toggleStatusMutation, addTogglingRow, removeTogglingRow],
  );

  const openDeleteDialog = React.useCallback(
    (categoryId: string) => deleteModal.open({ id: categoryId }),
    [deleteModal],
  );

  const handleDeleteCategory = React.useCallback(() => {
    if (!deleteTargetCategoryId) return;
    deleteMutation.mutate(deleteTargetCategoryId, {
      onSuccess: () => deleteModal.close(),
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
        searchFilter={searchFilter}
        targetFilter={targetFilter}
        statusFilter={statusFilter}
        onSearchFilterChange={setSearchFilter}
        onTargetFilterChange={setTargetFilter}
        onStatusFilterChange={setStatusFilter}
        onResetFilters={resetFilters}
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
        togglingRowIds={togglingRowIds}
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
        open={formModal.isOpen}
        mode={formMode}
        initialValues={formInitialValues}
        isSubmitting={isFormSubmitting}
        isLoadingDetails={isLoadingDetails}
        onOpenChange={(nextOpen) => {
          if (isFormSubmitting || isLoadingDetails) return;
          if (!nextOpen) {
            formModal.close();
            setIsLoadingDetails(false);
          }
        }}
        onSubmit={handleSaveForm}
      />

      <CategoryDeleteDialog
        open={deleteModal.isOpen}
        categoryName={displayOrDash(deleteTargetCategory?.name)}
        isDeleting={deleteMutation.isPending}
        onOpenChange={(nextOpen) => {
          if (!deleteMutation.isPending) {
            if (!nextOpen) deleteModal.close();
          }
        }}
        onConfirm={handleDeleteCategory}
      />
    </section>
  );
}
