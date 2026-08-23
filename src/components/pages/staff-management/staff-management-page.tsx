"use client";

import * as React from "react";
import { useQueryModal } from "@/hooks/use-query-modal";

import { RolesTable } from "@/components/pages/staff-management/roles-table";
import { StaffMemberDeleteDialog } from "@/components/pages/staff-management/staff-member-delete-dialog";
import {
  EMPTY_STAFF_MEMBER_FORM_VALUES,
  StaffMemberFormSheet,
  type StaffMemberFormValues,
} from "@/components/pages/staff-management/staff-member-form-sheet";
import { StaffRoleDeleteDialog } from "@/components/pages/staff-management/staff-role-delete-dialog";
import {
  EMPTY_STAFF_ROLE_FORM_VALUES,
  StaffRoleFormSheet,
  type StaffRoleFormValues,
} from "@/components/pages/staff-management/staff-role-form-sheet";
import { StaffTable } from "@/components/pages/staff-management/staff-table";
import { EmptyState, ListLoadingSkeleton, PaginationControls } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { AppIcons } from "@/constant/icons";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import {
  useCreateOrgRole,
  useCreateOrgStaff,
  useDeleteOrgRole,
  useDeleteOrgStaff,
  useOrgPermissionsCatalog,
  useOrgRole,
  useOrgRoles,
  useOrgStaff,
  useOrgStaffMember,
  useUpdateOrgRole,
  useUpdateOrgStaff,
} from "@/features/org/staff/org.staff.query";
import { usePagination } from "@/hooks/use-pagination";
import { normalizeApiError } from "@/lib/api-errors";
import { toast } from "@/lib/toast";
import { useAuth } from "@/providers/AuthProvider";

export function StaffManagementPage({ view = "employees" }: { view?: "employees" | "roles" }) {
  const { user: currentUser, can } = useAuth();
  const canCreateMember = can("org.staff.create");
  const canUpdateMember = can("org.staff.update");
  const canDeleteMember = can("org.staff.delete");
  const canCreateRole = can("org.roles.create");
  const canUpdateRole = can("org.roles.update");
  const canDeleteRole = can("org.roles.delete");
  const isEmployeesView = view === "employees";

  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = React.useState(0);
  const pagination = usePagination({ totalItems: total, pageSize });

  const staffQuery = useOrgStaff(
    { page: pagination.currentPage, perPage: pageSize, sort: "-invitedAt" },
    isEmployeesView,
  );
  const rolesQuery = useOrgRoles(
    { page: pagination.currentPage, perPage: pageSize, sort: "-updatedAt" },
    !isEmployeesView,
  );
  const roleOptionsQuery = useOrgRoles(
    { page: 1, perPage: 100, sort: "name", filter: { status: "active" } },
    isEmployeesView,
  );
  const catalogQuery = useOrgPermissionsCatalog(!isEmployeesView);

  const activeQuery = isEmployeesView ? staffQuery : rolesQuery;
  React.useEffect(() => {
    setTotal(activeQuery.data?.meta.total ?? 0);
  }, [activeQuery.data?.meta.total]);

  const staffRows = React.useMemo(() => staffQuery.data?.data ?? [], [staffQuery.data?.data]);
  const roleRows = React.useMemo(() => rolesQuery.data?.data ?? [], [rolesQuery.data?.data]);
  const roleOptions = React.useMemo(
    () =>
      (roleOptionsQuery.data?.data ?? []).map((role) => ({
        id: role.id,
        name: role.role,
      })),
    [roleOptionsQuery.data?.data],
  );
  const permissionOptions = catalogQuery.data?.data ?? [];

  const createStaff = useCreateOrgStaff();
  const updateStaff = useUpdateOrgStaff();
  const deleteStaff = useDeleteOrgStaff();
  const createRole = useCreateOrgRole();
  const updateRole = useUpdateOrgRole();
  const deleteRole = useDeleteOrgRole();

  const memberModal = useQueryModal("staff-member-form", {
    permissionsByMode: {
      create: "org.staff.create",
      edit: "org.staff.update",
    },
  });
  const memberOpen = memberModal.isOpen;
  const memberMode = memberModal.mode === "edit" ? "edit" : "create";
  const memberId = memberMode === "edit" ? memberModal.id : null;
  const memberDeleteModal = useQueryModal("staff-member-delete", {
    permission: "org.staff.delete",
  });
  const memberDeleteOpen = memberDeleteModal.isOpen;
  const memberDeleteId = memberDeleteModal.id;

  const roleModal = useQueryModal("staff-role-form", {
    permissionsByMode: {
      create: "org.roles.create",
      edit: "org.roles.update",
    },
  });
  const roleOpen = roleModal.isOpen;
  const roleMode = roleModal.mode === "edit" ? "edit" : "create";
  const roleId = roleMode === "edit" ? roleModal.id : null;
  const roleDeleteModal = useQueryModal("staff-role-delete", {
    permission: "org.roles.delete",
  });
  const roleDeleteOpen = roleDeleteModal.isOpen;
  const roleDeleteId = roleDeleteModal.id;

  const memberDetailQuery = useOrgStaffMember(
    memberOpen && memberMode === "edit" ? memberId : null,
  );
  const roleDetailQuery = useOrgRole(roleOpen && roleMode === "edit" ? roleId : null);

  const memberDetail = memberDetailQuery.data?.data;
  const memberValues = React.useMemo<StaffMemberFormValues>(
    () =>
      memberMode === "edit" && memberDetail
        ? {
            name: memberDetail.name,
            email: memberDetail.email,
            phone: memberDetail.phone ?? "",
            organizationRoleId: memberDetail.roleId,
          }
        : EMPTY_STAFF_MEMBER_FORM_VALUES,
    [memberDetail, memberMode],
  );

  const roleDetail = roleDetailQuery.data?.data;
  const roleValues = React.useMemo<StaffRoleFormValues>(
    () =>
      roleMode === "edit" && roleDetail
        ? {
            name: roleDetail.role,
            description: roleDetail.description ?? "",
            permissions: roleDetail.permissions,
            isActive: roleDetail.isActive,
          }
        : EMPTY_STAFF_ROLE_FORM_VALUES,
    [roleDetail, roleMode],
  );

  const openCreateMember = React.useCallback(() => {
    memberModal.open({ mode: "create" });
  }, [memberModal]);

  const openEditMember = React.useCallback(
    (id: string) => {
      memberModal.open({ id, mode: "edit" });
    },
    [memberModal],
  );

  const submitMember = React.useCallback(
    (values: StaffMemberFormValues) => {
      const body = {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        organizationRoleId: values.organizationRoleId,
      };

      if (memberMode === "create") {
        createStaff.mutate(body, {
          onSuccess: () => memberModal.close(),
        });
        return;
      }

      if (!memberId) return;
      updateStaff.mutate(
        { staffId: memberId, body },
        { onSuccess: () => memberModal.close() },
      );
    },
    [createStaff, memberId, memberModal, memberMode, updateStaff],
  );

  const requestDeleteMember = React.useCallback(
    (id: string) => {
      const member = staffRows.find((item) => item.id === id);
      const isCurrentUser =
        id === currentUser?.id ||
        member?.email.trim().toLowerCase() === currentUser?.email.trim().toLowerCase();
      if (!member || isCurrentUser) return;
      memberDeleteModal.open({ id });
    },
    [currentUser?.email, currentUser?.id, memberDeleteModal, staffRows],
  );

  const openCreateRole = React.useCallback(() => {
    roleModal.open({ mode: "create" });
  }, [roleModal]);

  const openEditRole = React.useCallback(
    (id: string) => {
      const role = roleRows.find((item) => item.id === id);
      if (!role || role.isSystem) return;

      roleModal.open({ id, mode: "edit" });
    },
    [roleModal, roleRows],
  );

  const submitRole = React.useCallback(
    (values: StaffRoleFormValues) => {
      if (roleMode === "create") {
        createRole.mutate(values, { onSuccess: () => roleModal.close() });
        return;
      }

      if (!roleId) return;
      updateRole.mutate(
        { roleId, body: values },
        { onSuccess: () => roleModal.close() },
      );
    },
    [createRole, roleId, roleModal, roleMode, updateRole],
  );

  const requestDeleteRole = React.useCallback(
    (id: string) => {
      const role = roleRows.find((item) => item.id === id);
      if (!role || role.isSystem) return;
      roleDeleteModal.open({ id });
    },
    [roleDeleteModal, roleRows],
  );

  const isMemberFormSubmitting =
    memberMode === "create" ? createStaff.isPending : updateStaff.isPending;
  const isRoleFormSubmitting =
    roleMode === "create" ? createRole.isPending : updateRole.isPending;
  const isMemberDetailsLoading =
    roleOptionsQuery.isLoading ||
    (memberMode === "edit" && memberOpen && memberDetailQuery.isLoading);
  const isRoleDetailsLoading =
    catalogQuery.isLoading || (roleMode === "edit" && roleOpen && roleDetailQuery.isLoading);

  const memberDeleteTarget = staffRows.find((item) => item.id === memberDeleteId);
  const roleDeleteTarget = roleRows.find((item) => item.id === roleDeleteId);

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold">
            {isEmployeesView ? "إدارة موظفي المنظمة" : "إدارة الأدوار والصلاحيات"}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {isEmployeesView
              ? "إدارة الموظفين وربطهم بالأدوار المناسبة."
              : "إنشاء أدوار مخصصة وتحديد صلاحيات كل دور."}
          </p>
        </div>
        {(isEmployeesView ? canCreateMember : canCreateRole) ? (
          <Button size="sm" onClick={isEmployeesView ? openCreateMember : openCreateRole}>
            {isEmployeesView ? (
              <AppIcons.UserPlus className="size-4" />
            ) : (
              <AppIcons.settings className="size-4" />
            )}
            {isEmployeesView ? "إضافة موظف" : "إضافة دور"}
          </Button>
        ) : null}
      </div>

      {activeQuery.isLoading ? (
        <ListLoadingSkeleton />
      ) : activeQuery.isError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          تعذّر تحميل البيانات. حاول مرة أخرى.
        </div>
      ) : isEmployeesView ? (
        staffRows.length ? (
          <StaffTable
            rows={staffRows}
            currentUserId={currentUser?.id ?? null}
            currentUserEmail={currentUser?.email ?? null}
            onEdit={canUpdateMember ? openEditMember : undefined}
            onDelete={canDeleteMember ? requestDeleteMember : undefined}
          />
        ) : (
          <EmptyState
            icon="staff"
            title="لا يوجد موظفون"
            description="ابدأ بإضافة أول موظف إلى المنظمة."
          />
        )
      ) : roleRows.length ? (
        <RolesTable
          rows={roleRows}
          onEditRole={canUpdateRole ? openEditRole : undefined}
          onDeleteRole={canDeleteRole ? requestDeleteRole : undefined}
        />
      ) : (
        <EmptyState
          icon="settings"
          title="لا توجد أدوار"
          description="ابدأ بإضافة دور وتحديد صلاحياته."
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

      <StaffMemberFormSheet
        key={`${memberMode}-${memberId ?? "new"}`}
        open={memberOpen}
        mode={memberMode}
        initialValues={memberValues}
        roleOptions={roleOptions}
        isLoadingDetails={isMemberDetailsLoading}
        isSubmitting={isMemberFormSubmitting}
        onOpenChange={memberModal.onOpenChange}
        onSubmit={submitMember}
      />

      <StaffMemberDeleteDialog
        open={memberDeleteOpen}
        staffName={memberDeleteTarget?.name ?? ""}
        isDeleting={deleteStaff.isPending}
        onOpenChange={memberDeleteModal.onOpenChange}
        onConfirm={() => {
          if (!memberDeleteId || deleteStaff.isPending) return;
          const isCurrentUser =
            memberDeleteId === currentUser?.id ||
            memberDeleteTarget?.email.trim().toLowerCase() ===
              currentUser?.email.trim().toLowerCase();
          if (isCurrentUser) return;

          deleteStaff.mutate(memberDeleteId, {
            onSuccess: () => memberDeleteModal.close(),
          });
        }}
      />

      <StaffRoleFormSheet
        key={`${roleMode}-${roleId ?? "new"}`}
        open={roleOpen}
        mode={roleMode}
        initialValues={roleValues}
        permissionOptions={permissionOptions}
        isLoadingDetails={isRoleDetailsLoading}
        isSubmitting={isRoleFormSubmitting}
        onOpenChange={roleModal.onOpenChange}
        onSubmit={submitRole}
      />

      <StaffRoleDeleteDialog
        open={roleDeleteOpen}
        roleName={roleDeleteTarget?.role ?? ""}
        membersCount={roleDeleteTarget?.membersCount ?? 0}
        isDeleting={deleteRole.isPending}
        onOpenChange={roleDeleteModal.onOpenChange}
        onConfirm={() => {
          if (!roleDeleteId || deleteRole.isPending) return;
          deleteRole.mutate(roleDeleteId, {
            onSuccess: () => roleDeleteModal.close(),
            onError: (error) => {
              const normalized = normalizeApiError(error);
              if (normalized.status === 409) {
                toast.error("لا يمكن حذف هذا الدور لأنه ما زال معيّنًا لموظفين، بما في ذلك الموظفون غير النشطين. أزل جميع التعيينات أولاً.");
                return;
              }
              toast.error(normalized.message);
            },
          });
        }}
      />
    </section>
  );
}
