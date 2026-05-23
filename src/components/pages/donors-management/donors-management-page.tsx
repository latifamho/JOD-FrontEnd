"use client";

import * as React from "react";

import { EmptyState, PaginationControls } from "@/components/shared";
import { DonorEntryDetailsSheet } from "@/components/pages/donors-management/donor-entry-details-sheet";
import { DonorEntryDeleteDialog } from "@/components/pages/donors-management/donor-entry-delete-dialog";
import {
  DonorEntryFormSheet,
  donorEntryFromFormValues,
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
import { toUtcTimestamp } from "@/lib/date";
import {
  applicantsStaticData,
  donorsStaticData,
  type DonorEntryItem,
} from "@/components/pages/donors-management/static-data";

type DonorsManagementPageProps = {
  view?: "donors" | "applicants";
};

type DonorSortOption = "date_newest" | "date_oldest" | "name_asc" | "name_desc";

function createNextEntryId(
  entries: DonorEntryItem[],
  view: "donors" | "applicants",
): string {
  const prefix = view === "applicants" ? "APP" : "DNR";
  const matches = entries
    .map((entry) => entry.id)
    .filter((id) => id.startsWith(`${prefix}-`));

  const max = matches.reduce((acc, id) => {
    const suffix = id.split("-")[1];
    const parsed = suffix ? Number.parseInt(suffix, 10) : Number.NaN;
    return Number.isFinite(parsed) ? Math.max(acc, parsed) : acc;
  }, 0);

  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
}

export function DonorsManagementPage({
  view = "donors",
}: DonorsManagementPageProps) {
  const [donors, setDonors] = React.useState(donorsStaticData);
  const [applicants, setApplicants] = React.useState(applicantsStaticData);
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [campaignFilter, setCampaignFilter] = React.useState("all");
  const [cityFilter, setCityFilter] = React.useState("all");
  const [applicantStatusFilter, setApplicantStatusFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState<DonorSortOption>("date_newest");

  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [detailsEntry, setDetailsEntry] = React.useState<DonorEntryItem | null>(
    null,
  );
  const [detailsView, setDetailsView] =
    React.useState<"donors" | "applicants">(view);

  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [formInitialValues, setFormInitialValues] =
    React.useState<DonorEntryFormValues>(EMPTY_DONOR_ENTRY_FORM_VALUES);
  const [editingEntryId, setEditingEntryId] = React.useState<string | null>(
    null,
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteEntryId, setDeleteEntryId] = React.useState<string | null>(null);
  const [deleteEntryName, setDeleteEntryName] = React.useState("");

  React.useEffect(() => {
    setDetailsView(view);
  }, [view]);

  React.useEffect(() => {
    setCampaignFilter("all");
    setCityFilter("all");
    setApplicantStatusFilter("all");
    setSortBy("date_newest");
  }, [view]);

  const rows = view === "donors" ? donors : applicants;
  const campaignOptions = React.useMemo(
    () =>
      Array.from(new Set(rows.map((row) => row.campaignTitle))).sort((first, second) =>
        first.localeCompare(second, "ar", { sensitivity: "base" }),
      ),
    [rows],
  );
  const cityOptions = React.useMemo(
    () =>
      Array.from(
        new Set(
          rows
            .map((row) => row.city?.trim())
            .filter((city): city is string => Boolean(city)),
        ),
      ).sort((first, second) =>
        first.localeCompare(second, "ar", { sensitivity: "base" }),
      ),
    [rows],
  );
  const applicantStatusOptions = React.useMemo(
    () =>
      Array.from(new Set(rows.map((row) => row.amountOrType))).sort((first, second) =>
        first.localeCompare(second, "ar", { sensitivity: "base" }),
      ),
    [rows],
  );

  const filteredRows = React.useMemo(() => {
    const filtered = rows.filter((row) => {
      if (campaignFilter !== "all" && row.campaignTitle !== campaignFilter) {
        return false;
      }

      if (view === "donors" && cityFilter !== "all" && row.city !== cityFilter) {
        return false;
      }

      if (
        view === "applicants" &&
        applicantStatusFilter !== "all" &&
        row.amountOrType !== applicantStatusFilter
      ) {
        return false;
      }

      return true;
    });

    return filtered.sort((firstRow, secondRow) => {
      if (sortBy === "date_oldest") {
        return toUtcTimestamp(firstRow.donatedAt) - toUtcTimestamp(secondRow.donatedAt);
      }

      if (sortBy === "name_asc") {
        return firstRow.name.localeCompare(secondRow.name, "ar", { sensitivity: "base" });
      }

      if (sortBy === "name_desc") {
        return secondRow.name.localeCompare(firstRow.name, "ar", { sensitivity: "base" });
      }

      return toUtcTimestamp(secondRow.donatedAt) - toUtcTimestamp(firstRow.donatedAt);
    });
  }, [applicantStatusFilter, campaignFilter, cityFilter, rows, sortBy, view]);

  const pagination = usePagination({
    totalItems: filteredRows.length,
    pageSize,
  });
  const { setCurrentPage } = pagination;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    applicantStatusFilter,
    campaignFilter,
    cityFilter,
    pageSize,
    setCurrentPage,
    sortBy,
    view,
  ]);

  const paginatedRows = React.useMemo(
    () => filteredRows.slice(pagination.startIndex, pagination.endIndex),
    [filteredRows, pagination.endIndex, pagination.startIndex],
  );

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
    if (!open) {
      setDetailsEntry(null);
    }
  }, []);

  const handleFormSubmit = React.useCallback(
    (values: DonorEntryFormValues) => {
      if (view === "donors") {
        setDonors((current) => {
          const nextId =
            formMode === "create"
              ? createNextEntryId(current, "donors")
              : (editingEntryId ?? createNextEntryId(current, "donors"));

          const nextEntry = donorEntryFromFormValues({
            id: nextId,
            view: "donors",
            values,
          });

          if (formMode === "edit") {
            return current.map((entry) =>
              entry.id === nextId ? nextEntry : entry,
            );
          }

          return [nextEntry, ...current];
        });
        return;
      }

      setApplicants((current) => {
        const nextId =
          formMode === "create"
            ? createNextEntryId(current, "applicants")
            : (editingEntryId ?? createNextEntryId(current, "applicants"));

        const nextEntry = donorEntryFromFormValues({
          id: nextId,
          view: "applicants",
          values,
        });

        if (formMode === "edit") {
          return current.map((entry) => (entry.id === nextId ? nextEntry : entry));
        }

        return [nextEntry, ...current];
      });
    },
    [editingEntryId, formMode, view],
  );

  const handleConfirmDelete = React.useCallback(() => {
    if (!deleteEntryId) {
      setDeleteDialogOpen(false);
      return;
    }

    if (view === "donors") {
      setDonors((current) =>
        current.filter((entry) => entry.id !== deleteEntryId),
      );
    } else {
      setApplicants((current) =>
        current.filter((entry) => entry.id !== deleteEntryId),
      );
    }

    if (detailsEntry?.id === deleteEntryId) {
      setDetailsOpen(false);
      setDetailsEntry(null);
    }

    setDeleteDialogOpen(false);
    setDeleteEntryId(null);
    setDeleteEntryName("");
  }, [deleteEntryId, detailsEntry?.id, view]);

  const pageTitle = view === "applicants" ? "إدارة المتقدمين" : "إدارة المتبرعين";
  const pageDescription =
    view === "applicants"
      ? `إدارة طلبات المتقدمين المرتبطة بالحملات والفرص. النتائج الحالية: ${filteredRows.length}`
      : `إدارة سجلات المتبرعين المرتبطة بالحملات والفرص. النتائج الحالية: ${filteredRows.length}`;

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row md:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground sm:text-base">
            {pageTitle}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">{pageDescription}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={openCreate}>
            {view === "applicants" ? "إضافة متقدم" : "إضافة متبرع"}
            <AppIcons.UserPlus className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Select dir="rtl" value={campaignFilter} onValueChange={setCampaignFilter}>
          <SelectTrigger className="w-full text-right text-xs">
            <SelectValue placeholder="كل الحملات" />
          </SelectTrigger>
          <SelectContent align="start" position="popper" className="text-right">
            <SelectItem value="all" className="text-right text-xs">
              كل الحملات
            </SelectItem>
            {campaignOptions.map((campaign) => (
              <SelectItem key={campaign} value={campaign} className="text-right text-xs">
                {campaign}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {view === "donors" ? (
          <Select dir="rtl" value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-full text-right text-xs">
              <SelectValue placeholder="كل المدن" />
            </SelectTrigger>
            <SelectContent align="start" position="popper" className="text-right">
              <SelectItem value="all" className="text-right text-xs">
                كل المدن
              </SelectItem>
              {cityOptions.map((city) => (
                <SelectItem key={city} value={city} className="text-right text-xs">
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Select
            dir="rtl"
            value={applicantStatusFilter}
            onValueChange={setApplicantStatusFilter}
          >
            <SelectTrigger className="w-full text-right text-xs">
              <SelectValue placeholder="كل الحالات" />
            </SelectTrigger>
            <SelectContent align="start" position="popper" className="text-right">
              <SelectItem value="all" className="text-right text-xs">
                كل الحالات
              </SelectItem>
              {applicantStatusOptions.map((status) => (
                <SelectItem key={status} value={status} className="text-right text-xs">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select
          dir="rtl"
          value={sortBy}
          onValueChange={(value) => setSortBy(value as DonorSortOption)}
        >
          <SelectTrigger className="w-full text-right text-xs">
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

      {filteredRows.length === 0 ? (
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
          rows={paginatedRows}
          view={view}
          onEditRow={(row) => openEdit(row)}
          onDeleteRow={(row) => openDelete(row)}
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
