"use client";

import * as React from "react";

import { PaginationControls } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { AppIcons } from "@/constant/icons";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import {
  categoriesStaticData,
  type AdminCategoryItem,
} from "@/components/pages/categories-management/static-data";
import { createNextCategoryId } from "@/components/pages/categories-management/helpers";
import {
  CategoryFormSheet,
  EMPTY_CATEGORY_FORM_VALUES,
  type CategoryFormValues,
} from "@/components/pages/categories-management/category-form-sheet";
import { CategoriesTable } from "@/components/pages/categories-management/categories-table";
import { CategoryDeleteDialog } from "@/components/pages/categories-management/category-delete-dialog";
import { usePagination } from "@/hooks/use-pagination";

export function CategoriesManagementPage() {
  const [categories, setCategories] = React.useState<AdminCategoryItem[]>(categoriesStaticData);
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);

  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [editingCategoryId, setEditingCategoryId] = React.useState<string | null>(null);
  const [formInitialValues, setFormInitialValues] =
    React.useState<CategoryFormValues>(EMPTY_CATEGORY_FORM_VALUES);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteTargetCategoryId, setDeleteTargetCategoryId] = React.useState<string | null>(null);

  const deleteTargetCategory = React.useMemo(
    () =>
      deleteTargetCategoryId
        ? (categories.find((category) => category.id === deleteTargetCategoryId) ?? null)
        : null,
    [categories, deleteTargetCategoryId],
  );

  const pagination = usePagination({
    totalItems: categories.length,
    pageSize,
  });

  const currentPageCategories = React.useMemo(
    () => categories.slice(pagination.startIndex, pagination.endIndex),
    [categories, pagination.endIndex, pagination.startIndex],
  );

  const openCreateSheet = React.useCallback(() => {
    setFormMode("create");
    setEditingCategoryId(null);
    setFormInitialValues(EMPTY_CATEGORY_FORM_VALUES);
    setFormOpen(true);
  }, []);

  const openEditSheet = React.useCallback(
    (categoryId: string) => {
      const category = categories.find((candidate) => candidate.id === categoryId);
      if (!category) {
        return;
      }

      setFormMode("edit");
      setEditingCategoryId(category.id);
      setFormInitialValues({
        name: category.name,
        target: category.target,
        description: category.description,
        status: category.status,
      });
      setFormOpen(true);
    },
    [categories],
  );

  const handleSaveForm = React.useCallback(
    (values: CategoryFormValues) => {
      const now = new Date().toISOString();

      setCategories((currentCategories) => {
        if (formMode === "create") {
          const nextCategory: AdminCategoryItem = {
            id: createNextCategoryId(currentCategories.map((category) => category.id)),
            name: values.name,
            target: values.target,
            description: values.description,
            usageCount: 0,
            status: values.status,
            createdAt: now,
            updatedAt: now,
          };

          return [nextCategory, ...currentCategories];
        }

        if (!editingCategoryId) {
          return currentCategories;
        }

        return currentCategories.map((category) =>
          category.id === editingCategoryId
            ? {
                ...category,
                name: values.name,
                target: values.target,
                description: values.description,
                status: values.status,
                updatedAt: now,
              }
            : category,
        );
      });
    },
    [editingCategoryId, formMode],
  );

  const handleToggleCategoryStatus = React.useCallback((categoryId: string) => {
    const now = new Date().toISOString();

    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              status: category.status === "active" ? "inactive" : "active",
              updatedAt: now,
            }
          : category,
      ),
    );
  }, []);

  const openDeleteDialog = React.useCallback((categoryId: string) => {
    setDeleteTargetCategoryId(categoryId);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteCategory = React.useCallback(() => {
    if (!deleteTargetCategoryId) {
      return;
    }

    setCategories((currentCategories) =>
      currentCategories.filter((category) => category.id !== deleteTargetCategoryId),
    );
    setDeleteDialogOpen(false);
    setDeleteTargetCategoryId(null);
  }, [deleteTargetCategoryId]);

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">إدارة التصنيفات</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            تخصيص تصنيفات المنشورات والحملات لتسهيل التنظيم والإدارة.
          </p>
        </div>

        <Button size="sm" className="w-fit" onClick={openCreateSheet}>
          <AppIcons.categories className="size-4" />
          إضافة تصنيف
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-6 text-center">
          <p className="text-sm font-medium text-foreground">لا توجد تصنيفات حالياً</p>
          <p className="mt-1 text-xs text-muted-foreground">يمكنك إضافة تصنيف جديد من الزر أعلاه</p>
        </div>
      ) : (
        <>
          <CategoriesTable
            rows={currentPageCategories}
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
        </>
      )}

      <CategoryFormSheet
        open={formOpen}
        mode={formMode}
        initialValues={formInitialValues}
        onOpenChange={(nextOpen) => {
          setFormOpen(nextOpen);
          if (!nextOpen) {
            setEditingCategoryId(null);
          }
        }}
        onSubmit={handleSaveForm}
      />

      <CategoryDeleteDialog
        open={deleteDialogOpen}
        categoryName={deleteTargetCategory?.name ?? "-"}
        onOpenChange={(nextOpen) => {
          setDeleteDialogOpen(nextOpen);
          if (!nextOpen) {
            setDeleteTargetCategoryId(null);
          }
        }}
        onConfirm={handleDeleteCategory}
      />
    </section>
  );
}
