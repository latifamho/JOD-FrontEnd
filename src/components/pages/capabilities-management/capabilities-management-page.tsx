"use client";

import * as React from "react";
import { PaginationControls } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { AppIcons } from "@/constant/icons";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { CapabilitiesFilters } from "./capabilities-filters";
import { CapabilitiesTable } from "./capabilities-table";
import { CapabilityFormSheet, EMPTY_CAPABILITY_FORM_VALUES, type CapabilityFormValues } from "./capability-form-sheet";
import { CapabilityDeleteDialog } from "./capability-delete-dialog";
import { useAdminCapabilities, useCreateCapability, useDeleteCapability, useUpdateCapability, useUpdateCapabilityStatus } from "@/features/admin/capabilities/admin.capabilities.query";
import type { AdminCapabilityItem, CapabilityStatus } from "@/features/admin/capabilities/admin.capabilities.types";

export function CapabilitiesManagementPage() {
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [apiTotal, setApiTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<"all" | CapabilityStatus>("all");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<AdminCapabilityItem | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<AdminCapabilityItem | null>(null);
  const [togglingId, setTogglingId] = React.useState<string>();
  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;
  const query = useAdminCapabilities({ page: pagination.currentPage, perPage: pageSize, filter: { search: search.trim() || undefined, status: status === "all" ? undefined : status } });
  // Keep the pagination helper synchronized with server-reported totals, matching the other admin list pages.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => { if (query.data?.meta.total !== undefined) setApiTotal(query.data.meta.total); }, [query.data?.meta.total]);
  React.useEffect(() => { setCurrentPage(1); }, [pageSize, search, status, setCurrentPage]);

  const createMutation = useCreateCapability();
  const updateMutation = useUpdateCapability();
  const statusMutation = useUpdateCapabilityStatus();
  const deleteMutation = useDeleteCapability();
  const isFormSubmitting = createMutation.isPending || updateMutation.isPending;
  const rows = query.data?.data ?? [];
  const initialValues: CapabilityFormValues = editing ? { name: editing.name, slug: editing.slug, status: editing.status, sortOrder: editing.sortOrder } : EMPTY_CAPABILITY_FORM_VALUES;

  const handleSubmit = (values: CapabilityFormValues) => {
    if (editing) updateMutation.mutate({ id: editing.id, body: values }, { onSuccess: () => setFormOpen(false) });
    else createMutation.mutate(values, { onSuccess: () => setFormOpen(false) });
  };
  const handleToggle = (row: AdminCapabilityItem) => { setTogglingId(row.id); statusMutation.mutate({ id: row.id, status: row.status === "active" ? "inactive" : "active" }, { onSettled: () => setTogglingId(undefined) }); };
  const handleDelete = () => { if (deleteTarget) deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) }); };

  return <section className="flex flex-1 flex-col gap-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-base font-semibold text-foreground">إدارة طرق المساعدة</h2><p className="mt-0.5 text-xs text-muted-foreground">إدارة أنواع المساعدة والمهارات المستخدمة في التخصيص والمطابقة. النتائج الحالية: {apiTotal}</p></div><Button type="button" size="sm" className="w-fit" onClick={() => { setEditing(null); setFormOpen(true); }} disabled={query.isLoading}><AppIcons.categories className="size-4" />إضافة طريقة مساعدة</Button></div>
    <CapabilitiesFilters search={search} status={status} onSearchChange={setSearch} onStatusChange={setStatus} onReset={() => { setSearch(""); setStatus("all"); }} />
    {query.isError ? <div className="flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3"><p className="flex-1 text-sm text-destructive">تعذّر تحميل طرق المساعدة. حاول مرة أخرى.</p><Button type="button" size="sm" variant="outline" onClick={() => query.refetch()}>إعادة المحاولة</Button></div> : null}
    <CapabilitiesTable rows={rows} isLoading={query.isLoading} togglingId={togglingId} onEdit={(row) => { setEditing(row); setFormOpen(true); }} onToggle={handleToggle} onDelete={setDeleteTarget} />
    <PaginationControls currentPage={pagination.currentPage} totalPages={pagination.totalPages} hasPreviousPage={pagination.hasPreviousPage} hasNextPage={pagination.hasNextPage} paginationRange={pagination.paginationRange} onPageChange={pagination.goToPage} onPreviousPage={pagination.goToPreviousPage} onNextPage={pagination.goToNextPage} pageSize={pageSize} onPageSizeChange={setPageSize} pageSizeOptions={PAGE_SIZE_OPTIONS} />
    <CapabilityFormSheet open={formOpen} mode={editing ? "edit" : "create"} initialValues={initialValues} isSubmitting={isFormSubmitting} onOpenChange={(next) => { setFormOpen(next); if (!next) setEditing(null); }} onSubmit={handleSubmit} />
    <CapabilityDeleteDialog open={Boolean(deleteTarget)} name={deleteTarget?.name ?? "-"} usersCount={deleteTarget?.usersCount ?? 0} isDeleting={deleteMutation.isPending} onOpenChange={(next) => { if (!next) setDeleteTarget(null); }} onConfirm={handleDelete} />
  </section>;
}
