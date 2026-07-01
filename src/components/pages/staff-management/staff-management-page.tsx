"use client";

import * as React from "react";

import { EmptyState, PaginationControls } from "@/components/shared";
import { RolesTable } from "@/components/pages/staff-management/roles-table";
import {
  EMPTY_STAFF_MEMBER_FORM_VALUES,
  StaffMemberFormSheet,
  type StaffMemberFormValues,
} from "@/components/pages/staff-management/staff-member-form-sheet";
import { StaffMemberDeleteDialog } from "@/components/pages/staff-management/staff-member-delete-dialog";
import {
  EMPTY_STAFF_ROLE_FORM_VALUES,
  StaffRoleFormSheet,
  type StaffRoleFormValues,
} from "@/components/pages/staff-management/staff-role-form-sheet";
import { StaffRoleDeleteDialog } from "@/components/pages/staff-management/staff-role-delete-dialog";
import { StaffTable } from "@/components/pages/staff-management/staff-table";
import {
  staffRoleLabels,
  type StaffRole,
} from "@/components/pages/staff-management/static-data";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { AppIcons } from "@/constant/icons";
import { usePagination } from "@/hooks/use-pagination";
import {
  useOrgStaff,
  useCreateOrgStaff,
  useUpdateOrgStaff,
  useDeleteOrgStaff,
  useOrgRoles,
  useCreateOrgRole,
  useUpdateOrgRole,
  useDeleteOrgRole,
} from "@/features/org/staff/org.staff.query";

type StaffManagementPageProps = {
  view?: "employees" | "roles";
};

type EmployeesSortOption =
  | "invited_newest"
  | "invited_oldest"
  | "name_asc"
  | "name_desc";

type RolesSortOption =
  | "updated_newest"
  | "updated_oldest"
  | "permissions_most"
  | "members_most";

const employeesSortToApi: Record<EmployeesSortOption, string> = {
  invited_newest: "-invitedAt",
  invited_oldest: "invitedAt",
  name_asc: "name",
  name_desc: "-name",
};

const rolesSortToApi: Record<RolesSortOption, string> = {
  updated_newest: "-updatedAt",
  updated_oldest: "updatedAt",
  permissions_most: "-permissionsCount",
  members_most: "-membersCount",
};

const allRoles = Object.keys(staffRoleLabels) as StaffRole[];

export function StaffManagementPage({ view = "employees" }: StaffManagementPageProps) {
  const [employeesPageSize, setEmployeesPageSize] =
    React.useState<number>(DEFAULT_PAGE_SIZE);
  const [rolesPageSize, setRolesPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);

  const [staffApiTotal, setStaffApiTotal] = React.useState(0);
  const [rolesApiTotal, setRolesApiTotal] = React.useState(0);

  const [employeesRoleFilter, setEmployeesRoleFilter] =
    React.useState<"all" | StaffRole>("all");
  const [employeesSortBy, setEmployeesSortBy] =
    React.useState<EmployeesSortOption>("invited_newest");
  const [rolesStatusFilter, setRolesStatusFilter] =
    React.useState<"all" | "active" | "inactive">("all");
  const [rolesSortBy, setRolesSortBy] =
    React.useState<RolesSortOption>("updated_newest");

  const [memberFormOpen, setMemberFormOpen] = React.useState(false);
  const [memberFormMode, setMemberFormMode] =
    React.useState<"create" | "edit">("create");
  const [memberFormInitialValues, setMemberFormInitialValues] =
    React.useState<StaffMemberFormValues>(EMPTY_STAFF_MEMBER_FORM_VALUES);
  const [editingMemberId, setEditingMemberId] = React.useState<string | null>(null);

  const [memberDeleteDialogOpen, setMemberDeleteDialogOpen] = React.useState(false);
  const [deleteMemberId, setDeleteMemberId] = React.useState<string | null>(null);
  const [deleteMemberName, setDeleteMemberName] = React.useState("");

  const [roleFormOpen, setRoleFormOpen] = React.useState(false);
  const [roleFormMode, setRoleFormMode] = React.useState<"create" | "edit">("create");
  const [roleFormInitialValues, setRoleFormInitialValues] =
    React.useState<StaffRoleFormValues>(EMPTY_STAFF_ROLE_FORM_VALUES);
  const [editingRoleId, setEditingRoleId] = React.useState<string | null>(null);

  const [roleDeleteDialogOpen, setRoleDeleteDialogOpen] = React.useState(false);
  const [deleteRoleId, setDeleteRoleId] = React.useState<string | null>(null);
  const [deleteRoleName, setDeleteRoleName] = React.useState("");

  const employeesPagination = usePagination({
    totalItems: staffApiTotal,
    pageSize: employeesPageSize,
  });
  const rolesPagination = usePagination({
    totalItems: rolesApiTotal,
    pageSize: rolesPageSize,
  });

  const { setCurrentPage: setEmployeesCurrentPage } = employeesPagination;
  const { setCurrentPage: setRolesCurrentPage } = rolesPagination;

  React.useEffect(() => {
    setEmployeesCurrentPage(1);
  }, [employeesPageSize, employeesRoleFilter, employeesSortBy, setEmployeesCurrentPage]);

  React.useEffect(() => {
    setRolesCurrentPage(1);
  }, [rolesPageSize, rolesSortBy, rolesStatusFilter, setRolesCurrentPage]);

  const staffQuery = useOrgStaff({
    page: employeesPagination.currentPage,
    perPage: employeesPageSize,
    sort: employeesSortToApi[employeesSortBy],
    filter: {
      role: employeesRoleFilter !== "all" ? employeesRoleFilter : undefined,
    },
  });

  const rolesQuery = useOrgRoles({
    page: rolesPagination.currentPage,
    perPage: rolesPageSize,
    sort: rolesSortToApi[rolesSortBy],
    filter: {
      status: rolesStatusFilter !== "all" ? rolesStatusFilter : undefined,
    },
  });

  React.useEffect(() => {
    if (staffQuery.data?.meta.total !== undefined) {
      setStaffApiTotal(staffQuery.data.meta.total);
    }
  }, [staffQuery.data?.meta.total]);

  React.useEffect(() => {
    if (rolesQuery.data?.meta.total !== undefined) {
      setRolesApiTotal(rolesQuery.data.meta.total);
    }
  }, [rolesQuery.data?.meta.total]);

  const staffRows = staffQuery.data?.data ?? [];
  const rolesRows = React.useMemo(
    () => (rolesQuery.data?.data ?? []).map((role) => ({ ...role, membersCount: 0 })),
    [rolesQuery.data?.data],
  );

  const createStaffMutation = useCreateOrgStaff();
  const updateStaffMutation = useUpdateOrgStaff();
  const deleteStaffMutation = useDeleteOrgStaff();
  const createRoleMutation = useCreateOrgRole();
  const updateRoleMutation = useUpdateOrgRole();
  const deleteRoleMutation = useDeleteOrgRole();

  const openCreateMemberSheet = React.useCallback(() => {
    setMemberFormMode("create");
    setEditingMemberId(null);
    setMemberFormInitialValues({ ...EMPTY_STAFF_MEMBER_FORM_VALUES });
    setMemberFormOpen(true);
  }, []);

  const openEditMemberSheet = React.useCallback(
    (staffId: string) => {
      const member = staffRows.find((m) => m.id === staffId);
      if (!member) return;

      setMemberFormMode("edit");
      setEditingMemberId(member.id);
      setMemberFormInitialValues({
        name: member.name,
        email: member.email,
        role: member.role,
      });
      setMemberFormOpen(true);
    },
    [staffRows],
  );

  const handleSubmitMember = React.useCallback(
    (values: StaffMemberFormValues) => {
      if (memberFormMode === "create") {
        createStaffMutation.mutate(
          { name: values.name, email: values.email, role: values.role },
          { onSuccess: () => setMemberFormOpen(false) },
        );
        return;
      }

      if (!editingMemberId) return;

      updateStaffMutation.mutate(
        { staffId: editingMemberId, body: { role: values.role } },
        {
          onSuccess: () => {
            setMemberFormOpen(false);
            setEditingMemberId(null);
          },
        },
      );
    },
    [memberFormMode, editingMemberId, createStaffMutation, updateStaffMutation],
  );

  const openDeleteMemberDialog = React.useCallback(
    (staffId: string) => {
      const member = staffRows.find((m) => m.id === staffId);
      setDeleteMemberId(staffId);
      setDeleteMemberName(member?.name ?? "-");
      setMemberDeleteDialogOpen(true);
    },
    [staffRows],
  );

  const handleDeleteMember = React.useCallback(() => {
    if (!deleteMemberId) return;
    deleteStaffMutation.mutate(deleteMemberId, {
      onSuccess: () => {
        setDeleteMemberId(null);
        setMemberDeleteDialogOpen(false);
      },
    });
  }, [deleteMemberId, deleteStaffMutation]);

  const openCreateRoleSheet = React.useCallback(() => {
    setRoleFormMode("create");
    setEditingRoleId(null);
    setRoleFormInitialValues({ ...EMPTY_STAFF_ROLE_FORM_VALUES });
    setRoleFormOpen(true);
  }, []);

  const openEditRoleSheet = React.useCallback(
    (roleId: string) => {
      const role = rolesRows.find((r) => r.id === roleId);
      if (!role) return;

      setRoleFormMode("edit");
      setEditingRoleId(role.id);
      setRoleFormInitialValues({
        role: role.role,
        description: role.description,
        permissions: role.permissions,
        isActive: role.isActive,
      });
      setRoleFormOpen(true);
    },
    [rolesRows],
  );

  const handleSubmitRole = React.useCallback(
    (values: StaffRoleFormValues) => {
      if (roleFormMode === "create") {
        createRoleMutation.mutate(
          {
            role: values.role,
            description: values.description,
            permissions: values.permissions,
            isActive: values.isActive,
          },
          { onSuccess: () => setRoleFormOpen(false) },
        );
        return;
      }

      if (!editingRoleId) return;

      updateRoleMutation.mutate(
        {
          roleId: editingRoleId,
          body: {
            description: values.description,
            permissions: values.permissions,
            isActive: values.isActive,
          },
        },
        {
          onSuccess: () => {
            setRoleFormOpen(false);
            setEditingRoleId(null);
          },
        },
      );
    },
    [roleFormMode, editingRoleId, createRoleMutation, updateRoleMutation],
  );

  const openDeleteRoleDialog = React.useCallback(
    (roleId: string) => {
      const role = rolesRows.find((r) => r.id === roleId);
      setDeleteRoleId(roleId);
      setDeleteRoleName(role ? (staffRoleLabels[role.role] ?? role.role) : "-");
      setRoleDeleteDialogOpen(true);
    },
    [rolesRows],
  );

  const handleDeleteRole = React.useCallback(() => {
    if (!deleteRoleId) return;
    deleteRoleMutation.mutate(deleteRoleId, {
      onSuccess: () => {
        setDeleteRoleId(null);
        setRoleDeleteDialogOpen(false);
      },
    });
  }, [deleteRoleId, deleteRoleMutation]);

  const isEmployeesView = view === "employees";
  const activeCount = isEmployeesView ? staffApiTotal : rolesApiTotal;
  const pageTitle = isEmployeesView ? "إدارة الموظفين" : "إدارة الصلاحيات";
  const pageDescription = isEmployeesView
    ? `إدارة أعضاء المنظمة وتوزيع الأدوار عليهم. النتائج الحالية: ${activeCount}`
    : `إدارة أدوار المنظمة والصلاحيات المرتبطة بها. النتائج الحالية: ${activeCount}`;

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row md:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground sm:text-base">
            {pageTitle}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">{pageDescription}</p>
        </div>

        {isEmployeesView ? (
          <Button size="sm" className="w-fit" onClick={openCreateMemberSheet}>
            <AppIcons.UserPlus className="size-4" />
            إضافة موظف
          </Button>
        ) : (
          <Button size="sm" className="w-fit" onClick={openCreateRoleSheet}>
            <AppIcons.settings className="size-4" />
            إضافة دور
          </Button>
        )}
      </div>

      {isEmployeesView ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Select
            dir="rtl"
            value={employeesRoleFilter}
            onValueChange={(value) => setEmployeesRoleFilter(value as "all" | StaffRole)}
          >
            <SelectTrigger className="w-full text-right text-xs">
              <SelectValue placeholder="كل الأدوار" />
            </SelectTrigger>
            <SelectContent align="start" position="popper" className="text-right">
              <SelectItem value="all" className="text-right text-xs">
                كل الأدوار
              </SelectItem>
              {allRoles.map((role) => (
                <SelectItem key={role} value={role} className="text-right text-xs">
                  {staffRoleLabels[role]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            dir="rtl"
            value={employeesSortBy}
            onValueChange={(value) => setEmployeesSortBy(value as EmployeesSortOption)}
          >
            <SelectTrigger className="w-full text-right text-xs">
              <SelectValue placeholder="الترتيب" />
            </SelectTrigger>
            <SelectContent align="start" position="popper" className="text-right">
              <SelectItem value="invited_newest" className="text-right text-xs">
                الأحدث دعوةً
              </SelectItem>
              <SelectItem value="invited_oldest" className="text-right text-xs">
                الأقدم دعوةً
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
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          <Select
            dir="rtl"
            value={rolesStatusFilter}
            onValueChange={(value) =>
              setRolesStatusFilter(value as "all" | "active" | "inactive")
            }
          >
            <SelectTrigger className="w-full text-right text-xs">
              <SelectValue placeholder="كل الحالات" />
            </SelectTrigger>
            <SelectContent align="start" position="popper" className="text-right">
              <SelectItem value="all" className="text-right text-xs">
                كل الحالات
              </SelectItem>
              <SelectItem value="active" className="text-right text-xs">
                مفعّل
              </SelectItem>
              <SelectItem value="inactive" className="text-right text-xs">
                موقّف
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            dir="rtl"
            value={rolesSortBy}
            onValueChange={(value) => setRolesSortBy(value as RolesSortOption)}
          >
            <SelectTrigger className="w-full text-right text-xs">
              <SelectValue placeholder="الترتيب" />
            </SelectTrigger>
            <SelectContent align="start" position="popper" className="text-right">
              <SelectItem value="updated_newest" className="text-right text-xs">
                الأحدث تحديثاً
              </SelectItem>
              <SelectItem value="updated_oldest" className="text-right text-xs">
                الأقدم تحديثاً
              </SelectItem>
              <SelectItem value="permissions_most" className="text-right text-xs">
                الأكثر صلاحيات
              </SelectItem>
              <SelectItem value="members_most" className="text-right text-xs">
                الأكثر موظفين
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {isEmployeesView ? (
        <div className="space-y-3">
          {staffQuery.isError && (
            <div className="flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
              <p className="flex-1 text-sm text-destructive">
                تعذّر تحميل الموظفين. حاول مرة أخرى.
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => staffQuery.refetch()}
              >
                إعادة المحاولة
              </Button>
            </div>
          )}

          {staffRows.length === 0 ? (
            <EmptyState
              icon="staff"
              title="لا يوجد موظفون مضافون"
              description="يمكنك إضافة موظفين جدد وإسناد الأدوار لهم."
            />
          ) : (
            <StaffTable
              rows={staffRows}
              onEdit={openEditMemberSheet}
              onDelete={openDeleteMemberDialog}
            />
          )}

          <PaginationControls
            currentPage={employeesPagination.currentPage}
            totalPages={employeesPagination.totalPages}
            hasPreviousPage={employeesPagination.hasPreviousPage}
            hasNextPage={employeesPagination.hasNextPage}
            paginationRange={employeesPagination.paginationRange}
            onPageChange={employeesPagination.goToPage}
            onPreviousPage={employeesPagination.goToPreviousPage}
            onNextPage={employeesPagination.goToNextPage}
            pageSize={employeesPageSize}
            onPageSizeChange={setEmployeesPageSize}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {rolesQuery.isError && (
            <div className="flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
              <p className="flex-1 text-sm text-destructive">
                تعذّر تحميل الأدوار. حاول مرة أخرى.
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => rolesQuery.refetch()}
              >
                إعادة المحاولة
              </Button>
            </div>
          )}

          {rolesRows.length === 0 ? (
            <EmptyState
              icon="settings"
              title="لا توجد أدوار معرفة"
              description="أضف أدواراً جديدة لتوزيع الصلاحيات على الموظفين."
            />
          ) : (
            <RolesTable
              rows={rolesRows}
              onEditRole={openEditRoleSheet}
              onDeleteRole={openDeleteRoleDialog}
            />
          )}

          <PaginationControls
            currentPage={rolesPagination.currentPage}
            totalPages={rolesPagination.totalPages}
            hasPreviousPage={rolesPagination.hasPreviousPage}
            hasNextPage={rolesPagination.hasNextPage}
            paginationRange={rolesPagination.paginationRange}
            onPageChange={rolesPagination.goToPage}
            onPreviousPage={rolesPagination.goToPreviousPage}
            onNextPage={rolesPagination.goToNextPage}
            pageSize={rolesPageSize}
            onPageSizeChange={setRolesPageSize}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
          />
        </div>
      )}

      <StaffMemberFormSheet
        open={memberFormOpen}
        mode={memberFormMode}
        initialValues={memberFormInitialValues}
        roleOptions={allRoles}
        onOpenChange={(nextOpen) => {
          setMemberFormOpen(nextOpen);
          if (!nextOpen) setEditingMemberId(null);
        }}
        onSubmit={handleSubmitMember}
      />

      <StaffMemberDeleteDialog
        open={memberDeleteDialogOpen}
        staffName={deleteMemberName}
        onOpenChange={(nextOpen) => {
          setMemberDeleteDialogOpen(nextOpen);
          if (!nextOpen) setDeleteMemberId(null);
        }}
        onConfirm={handleDeleteMember}
      />

      <StaffRoleFormSheet
        open={roleFormOpen}
        mode={roleFormMode}
        initialValues={roleFormInitialValues}
        roleOptions={allRoles}
        onOpenChange={(nextOpen) => {
          setRoleFormOpen(nextOpen);
          if (!nextOpen) setEditingRoleId(null);
        }}
        onSubmit={handleSubmitRole}
      />

      <StaffRoleDeleteDialog
        open={roleDeleteDialogOpen}
        roleName={deleteRoleName}
        membersCount={0}
        onOpenChange={(nextOpen) => {
          setRoleDeleteDialogOpen(nextOpen);
          if (!nextOpen) setDeleteRoleId(null);
        }}
        onConfirm={handleDeleteRole}
      />
    </section>
  );
}
