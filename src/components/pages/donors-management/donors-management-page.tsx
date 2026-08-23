"use client";

import * as React from "react";
import { useQueryDisclosure, useQueryModal } from "@/hooks/use-query-modal";

import { EmptyState, ListLoadingSkeleton, PaginationControls } from "@/components/shared";
import { DonorEntryDetailsSheet } from "@/components/pages/donors-management/donor-entry-details-sheet";
import { DonorEntryDeleteDialog } from "@/components/pages/donors-management/donor-entry-delete-dialog";
import {
  DonorEntryFormSheet,
  donorEntryToFormValues,
  EMPTY_DONOR_ENTRY_FORM_VALUES,
  type DonorEntryFormValues,
} from "@/components/pages/donors-management/donor-entry-form-sheet";
import { DonorsTable } from "@/components/pages/donors-management/donors-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppIcons } from "@/constant/icons";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { useAuth } from "@/providers/AuthProvider";
import type { DonorEntryItem } from "@/components/pages/donors-management/static-data";
import {
  useOrgDonors,
  useCreateOrgDonor,
  useUpdateOrgDonor,
  useDeleteOrgDonor,
  useOrgApplicants,
  useCreateOrgApplicant,
  useUpdateOrgApplicant,
  useDeleteOrgApplicant,
} from "@/features/org/donors/org.donors.query";

type DonorsManagementPageProps = {
  view?: "donors" | "applicants";
};

type DonorSortOption = "date_newest" | "date_oldest" | "name_asc" | "name_desc";

const sortToApiSort: Record<DonorSortOption, string> = {
  date_newest: "-donatedAt",
  date_oldest: "donatedAt",
  name_asc: "name",
  name_desc: "-name",
};

export function DonorsManagementPage({
  view = "donors",
}: DonorsManagementPageProps) {
  const { can } = useAuth();
  const permissionPrefix = view === "donors" ? "org.donors" : "org.applicants";
  const canView = can(`${permissionPrefix}.view`);
  const canCreate = can(`${permissionPrefix}.create`);
  const canEdit = can(`${permissionPrefix}.update`);
  const canDelete = can(`${permissionPrefix}.delete`);
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [apiTotal, setApiTotal] = React.useState(0);
  const [sortBy, setSortBy] = React.useState<DonorSortOption>("date_newest");

  const [detailsOpen, setDetailsOpen] = useQueryDisclosure("donor-details", {
    permission: `${permissionPrefix}.view`,
  });
  const [detailsEntry, setDetailsEntry] = React.useState<DonorEntryItem | null>(null);

  const formModal = useQueryModal("donor-form", {
    permissionsByMode: {
      create: `${permissionPrefix}.create`,
      edit: `${permissionPrefix}.update`,
    },
  });
  const formOpen = formModal.isOpen;
  const formMode = formModal.mode === "edit" ? "edit" : "create";
  const editingEntryId = formMode === "edit" ? formModal.id : null;
  const [formInitialValues, setFormInitialValues] =
    React.useState<DonorEntryFormValues>(EMPTY_DONOR_ENTRY_FORM_VALUES);

  const deleteModal = useQueryModal("donor-delete", {
    permission: `${permissionPrefix}.delete`,
  });
  const deleteDialogOpen = deleteModal.isOpen;
  const deleteEntryId = deleteModal.id;

  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, sortBy, view, setCurrentPage]);

  const donorsQuery = useOrgDonors({
    page: pagination.currentPage,
    perPage: pageSize,
    sort: sortToApiSort[sortBy],
  }, view === "donors" && canView);

  const applicantsQuery = useOrgApplicants({
    page: pagination.currentPage,
    perPage: pageSize,
    sort: sortToApiSort[sortBy],
  }, view === "applicants" && canView);

  const activeQuery = view === "donors" ? donorsQuery : applicantsQuery;

  React.useEffect(() => {
    if (activeQuery.data?.meta.total !== undefined) {
      setApiTotal(activeQuery.data.meta.total);
    }
  }, [activeQuery.data?.meta.total]);

  const rows = activeQuery.data?.data ?? [];

  const createDonorMutation = useCreateOrgDonor();
  const updateDonorMutation = useUpdateOrgDonor();
  const deleteDonorMutation = useDeleteOrgDonor();
  const createApplicantMutation = useCreateOrgApplicant();
  const updateApplicantMutation = useUpdateOrgApplicant();
  const deleteApplicantMutation = useDeleteOrgApplicant();

  const openCreate = React.useCallback(() => {
    setFormInitialValues({
      ...EMPTY_DONOR_ENTRY_FORM_VALUES,
      applicantStatus: "pending",
      appliedAt: view === "applicants" ? new Date().toISOString() : "",
    });
    formModal.open({ mode: "create" });
  }, [formModal, view]);

  const openEdit = React.useCallback((row: DonorEntryItem) => {
    setFormInitialValues(donorEntryToFormValues(row));
    formModal.open({ id: row.id, mode: "edit" });
  }, [formModal]);

  const openDelete = React.useCallback((row: DonorEntryItem) => {
    deleteModal.open({ id: row.id });
  }, [deleteModal]);

  const handleDetailsOpenChange = React.useCallback((open: boolean) => {
    setDetailsOpen(open);
    if (!open) setDetailsEntry(null);
  }, [setDetailsOpen]);

  const handleFormSubmit = React.useCallback(
    (values: DonorEntryFormValues) => {
      if (view === "donors") {
        const body = {
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
        };

        if (formMode === "create") {
          createDonorMutation.mutate(body, {
            onSuccess: () => formModal.close(),
          });
        } else if (editingEntryId) {
          updateDonorMutation.mutate(
            { donorId: editingEntryId, body },
            { onSuccess: () => formModal.close() },
          );
        }
        return;
      }

      const applicantBody = {
        name: values.name.trim(),
        phone: values.phone.trim(),
        campaignTitle: values.campaignTitle.trim(),
        applicantStatus: values.applicantStatus,
        appliedAt: values.appliedAt,
      };

      if (formMode === "create") {
        createApplicantMutation.mutate(applicantBody, {
          onSuccess: () => formModal.close(),
        });
      } else if (editingEntryId) {
        updateApplicantMutation.mutate(
          { applicantId: editingEntryId, body: applicantBody },
          { onSuccess: () => formModal.close() },
        );
      }
    },
    [
      view,
      formMode,
      editingEntryId,
      formModal,
      createDonorMutation,
      updateDonorMutation,
      createApplicantMutation,
      updateApplicantMutation,
    ],
  );

  const handleConfirmDelete = React.useCallback(() => {
    if (!deleteEntryId) {
      deleteModal.close();
      return;
    }

    if (view === "donors") {
      deleteDonorMutation.mutate(deleteEntryId, {
        onSuccess: () => {
          if (detailsEntry?.id === deleteEntryId) {
            setDetailsOpen(false);
            setDetailsEntry(null);
          }
          deleteModal.close();
        },
      });
    } else {
      deleteApplicantMutation.mutate(deleteEntryId, {
        onSuccess: () => {
          if (detailsEntry?.id === deleteEntryId) {
            setDetailsOpen(false);
            setDetailsEntry(null);
          }
          deleteModal.close();
        },
      });
    }
  }, [
    deleteEntryId,
    detailsEntry?.id,
    view,
    deleteDonorMutation,
    deleteApplicantMutation,
    deleteModal,
    setDetailsOpen,
  ]);

  const isFormSubmitting =
    view === "donors"
      ? formMode === "create"
        ? createDonorMutation.isPending
        : updateDonorMutation.isPending
      : formMode === "create"
        ? createApplicantMutation.isPending
        : updateApplicantMutation.isPending;

  const isDeleting =
    view === "donors" ? deleteDonorMutation.isPending : deleteApplicantMutation.isPending;

  const pageTitle = view === "applicants" ? "إدارة المتقدمين" : "إدارة المتبرعين";
  const pageDescription =
    view === "applicants"
      ? `إدارة طلبات المتقدمين المرتبطة بالحملات والفرص. النتائج الحالية: ${apiTotal}`
      : `إدارة سجلات المتبرعين المرتبطة بالحملات والفرص. النتائج الحالية: ${apiTotal}`;

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row md:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground sm:text-base">
            {pageTitle}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">{pageDescription}</p>
        </div>

        {canCreate ? (
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={openCreate}>
            {view === "applicants" ? "إضافة متقدم" : "إضافة متبرع"}
            <AppIcons.UserPlus className="size-4" />
          </Button>
        </div>
        ) : null}
      </div>

      <div className="flex justify-end">
        <Select
          dir="rtl"
          value={sortBy}
          onValueChange={(value) => setSortBy(value as DonorSortOption)}
        >
          <SelectTrigger className="w-48 text-right text-xs">
            <SelectValue placeholder="الترتيب" />
          </SelectTrigger>
          <SelectContent align="start" position="popper" className="text-right">
            <SelectItem value="date_newest" className="text-right text-xs">
              الأحدث تاريخاً
            </SelectItem>
            <SelectItem value="date_oldest" className="text-right text-xs">
              الأقدم تاريخاً
            </SelectItem>
            <SelectItem value="name_asc" className="text-right text-xs">
              الاسم (أ-ي)
            </SelectItem>
            <SelectItem value="name_desc" className="text-right text-xs">
              الاسم (ي-أ)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activeQuery.isError && (
        <div className="flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="flex-1 text-sm text-destructive">
            تعذّر تحميل البيانات. حاول مرة أخرى.
          </p>
          <Button type="button" size="sm" variant="outline" onClick={() => activeQuery.refetch()}>
            إعادة المحاولة
          </Button>
        </div>
      )}

      {activeQuery.isLoading ? (
        <ListLoadingSkeleton />
      ) : rows.length === 0 ? (
        <EmptyState
          icon="donors"
          title={view === "donors" ? "لا يوجد متبرعون حتى الآن" : "لا يوجد متقدمون"}
          description={
            view === "donors"
              ? "ستظهر هنا سجلات التبرعات والمتقدمين للحملات."
              : "ستظهر هنا طلبات التطوع والفرص والتقديم على الأنشطة."
          }
        />
      ) : (
        <DonorsTable
          rows={rows}
          view={view}
          onEditRow={canEdit ? (row) => openEdit(row) : undefined}
          onDeleteRow={canDelete ? (row) => openDelete(row) : undefined}
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

      <DonorEntryDetailsSheet
        open={detailsOpen}
        onOpenChange={handleDetailsOpenChange}
        entry={detailsEntry}
        view={view}
      />

      <DonorEntryFormSheet
        open={formOpen}
        mode={formMode}
        view={view}
        initialValues={formInitialValues}
        isSubmitting={isFormSubmitting}
        onOpenChange={formModal.onOpenChange}
        onSubmit={handleFormSubmit}
      />

      <DonorEntryDeleteDialog
        open={deleteDialogOpen}
        entryName={rows.find((row) => row.id === deleteEntryId)?.name ?? ""}
        view={view}
        isDeleting={isDeleting}
        onOpenChange={deleteModal.onOpenChange}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}
