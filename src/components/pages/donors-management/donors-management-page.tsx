"use client";

import * as React from "react";

import { EmptyState, PaginationControls } from "@/components/shared";
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

  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [detailsEntry, setDetailsEntry] = React.useState<DonorEntryItem | null>(null);
  const [detailsView, setDetailsView] = React.useState<"donors" | "applicants">(view);

  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [formInitialValues, setFormInitialValues] =
    React.useState<DonorEntryFormValues>(EMPTY_DONOR_ENTRY_FORM_VALUES);
  const [editingEntryId, setEditingEntryId] = React.useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteEntryId, setDeleteEntryId] = React.useState<string | null>(null);
  const [deleteEntryName, setDeleteEntryName] = React.useState("");

  React.useEffect(() => {
    setDetailsView(view);
  }, [view]);

  React.useEffect(() => {
    setSortBy("date_newest");
    setApiTotal(0);
  }, [view]);

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
    setFormMode("create");
    setEditingEntryId(null);
    setFormInitialValues({
      ...EMPTY_DONOR_ENTRY_FORM_VALUES,
      donatedAt: new Date().toISOString(),
    });
    setFormOpen(true);
  }, []);

  const openEdit = React.useCallback((row: DonorEntryItem) => {
    setFormMode("edit");
    setEditingEntryId(row.id);
    setFormInitialValues(donorEntryToFormValues(row));
    setFormOpen(true);
  }, []);

  const openDelete = React.useCallback((row: DonorEntryItem) => {
    setDeleteEntryId(row.id);
    setDeleteEntryName(row.name);
    setDeleteDialogOpen(true);
  }, []);

  const handleDetailsOpenChange = React.useCallback((open: boolean) => {
    setDetailsOpen(open);
    if (!open) setDetailsEntry(null);
  }, []);

  const handleFormSubmit = React.useCallback(
    (values: DonorEntryFormValues) => {
      const body = {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        campaignTitle: values.campaignTitle.trim(),
        amountOrType: values.amountOrType.trim(),
        city: values.city.trim() || undefined,
        paymentMethod: values.paymentMethod.trim() || undefined,
        assignedTo: values.assignedTo.trim() || undefined,
        internalNotes: values.internalNotes.trim() || undefined,
      };

      if (view === "donors") {
        if (formMode === "create") {
          createDonorMutation.mutate(body, {
            onSuccess: () => setFormOpen(false),
          });
        } else if (editingEntryId) {
          updateDonorMutation.mutate(
            { donorId: editingEntryId, body },
            {
              onSuccess: () => {
                setFormOpen(false);
                setEditingEntryId(null);
              },
            },
          );
        }
        return;
      }

      const applicantBody = {
        ...body,
        requestType: values.requestType.trim() || undefined,
      };

      if (formMode === "create") {
        createApplicantMutation.mutate(applicantBody, {
          onSuccess: () => setFormOpen(false),
        });
      } else if (editingEntryId) {
        updateApplicantMutation.mutate(
          { applicantId: editingEntryId, body: applicantBody },
          {
            onSuccess: () => {
              setFormOpen(false);
              setEditingEntryId(null);
            },
          },
        );
      }
    },
    [
      view,
      formMode,
      editingEntryId,
      createDonorMutation,
      updateDonorMutation,
      createApplicantMutation,
      updateApplicantMutation,
    ],
  );

  const handleConfirmDelete = React.useCallback(() => {
    if (!deleteEntryId) {
      setDeleteDialogOpen(false);
      return;
    }

    if (view === "donors") {
      deleteDonorMutation.mutate(deleteEntryId, {
        onSuccess: () => {
          if (detailsEntry?.id === deleteEntryId) {
            setDetailsOpen(false);
            setDetailsEntry(null);
          }
          setDeleteDialogOpen(false);
          setDeleteEntryId(null);
          setDeleteEntryName("");
        },
      });
    } else {
      deleteApplicantMutation.mutate(deleteEntryId, {
        onSuccess: () => {
          if (detailsEntry?.id === deleteEntryId) {
            setDetailsOpen(false);
            setDetailsEntry(null);
          }
          setDeleteDialogOpen(false);
          setDeleteEntryId(null);
          setDeleteEntryName("");
        },
      });
    }
  }, [
    deleteEntryId,
    detailsEntry?.id,
    view,
    deleteDonorMutation,
    deleteApplicantMutation,
  ]);

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

      {rows.length === 0 ? (
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
        view={detailsView}
      />

      <DonorEntryFormSheet
        open={formOpen}
        mode={formMode}
        view={view}
        initialValues={formInitialValues}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
      />

      <DonorEntryDeleteDialog
        open={deleteDialogOpen}
        entryName={deleteEntryName}
        view={view}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}
