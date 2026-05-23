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
  staffRolesStaticData,
  staffStaticData,
  type StaffMemberItem,
  type StaffRole,
  type StaffRoleItem,
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
import { toUtcTimestamp } from "@/lib/date";

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

function createNextStaffId(staff: StaffMemberItem[]): string {
  const max = staff.reduce((acc, member) => {
    const suffix = member.id.split("-")[1];
    const parsed = suffix ? Number.parseInt(suffix, 10) : Number.NaN;
    return Number.isFinite(parsed) ? Math.max(acc, parsed) : acc;
  }, 0);

  return `STF-${String(max + 1).padStart(3, "0")}`;
}

function createNextRoleId(roles: StaffRoleItem[]): string {
  const max = roles.reduce((acc, role) => {
    const suffix = role.id.split("-")[1];
    const parsed = suffix ? Number.parseInt(suffix, 10) : Number.NaN;
    return Number.isFinite(parsed) ? Math.max(acc, parsed) : acc;
  }, 0);

  return `ROLE-${String(max + 1).padStart(3, "0")}`;
}

export function StaffManagementPage({ view = "employees" }: StaffManagementPageProps) {
  const [staff, setStaff] = React.useState(staffStaticData);
  const [roles, setRoles] = React.useState(staffRolesStaticData);

  const [employeesPageSize, setEmployeesPageSize] =
    React.useState<number>(DEFAULT_PAGE_SIZE);
  const [rolesPageSize, setRolesPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
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

  const [roleFormOpen, setRoleFormOpen] = React.useState(false);
  const [roleFormMode, setRoleFormMode] = React.useState<"create" | "edit">("create");
  const [roleFormInitialValues, setRoleFormInitialValues] =
    React.useState<StaffRoleFormValues>(EMPTY_STAFF_ROLE_FORM_VALUES);
  const [editingRoleId, setEditingRoleId] = React.useState<string | null>(null);

  const [roleDeleteDialogOpen, setRoleDeleteDialogOpen] = React.useState(false);
  const [deleteRoleId, setDeleteRoleId] = React.useState<string | null>(null);

  const sortedStaff = React.useMemo(
    () =>
      [...staff].sort(
        (firstMember, secondMember) =>
          toUtcTimestamp(secondMember.invitedAt) -
          toUtcTimestamp(firstMember.invitedAt),
      ),
    [staff],
  );

  const roleMemberCounts = React.useMemo(() => {
    const initialCounts: Record<StaffRole, number> = {
      owner: 0,
      manager: 0,
      editor: 0,
      viewer: 0,
    };

    return staff.reduce<Record<StaffRole, number>>((acc, member) => {
      acc[member.role] += 1;
      return acc;
    }, initialCounts);
  }, [staff]);

  const sortedRoles = React.useMemo(
    () =>
      [...roles]
        .map((role) => ({
          ...role,
          membersCount: roleMemberCounts[role.role],
        }))
        .sort(
          (firstRole, secondRole) =>
            toUtcTimestamp(secondRole.updatedAt) -
            toUtcTimestamp(firstRole.updatedAt),
        ),
    [roleMemberCounts, roles],
  );

  const filteredStaffRows = React.useMemo(() => {
    const filtered = sortedStaff.filter((member) =>
      employeesRoleFilter === "all" ? true : member.role === employeesRoleFilter,
    );

    return filtered.sort((firstMember, secondMember) => {
      if (employeesSortBy === "invited_oldest") {
        return toUtcTimestamp(firstMember.invitedAt) - toUtcTimestamp(secondMember.invitedAt);
      }

      if (employeesSortBy === "name_asc") {
        return firstMember.name.localeCompare(secondMember.name, "ar", {
          sensitivity: "base",
        });
      }

      if (employeesSortBy === "name_desc") {
        return secondMember.name.localeCompare(firstMember.name, "ar", {
          sensitivity: "base",
        });
      }

      return toUtcTimestamp(secondMember.invitedAt) - toUtcTimestamp(firstMember.invitedAt);
    });
  }, [employeesRoleFilter, employeesSortBy, sortedStaff]);

  const filteredRolesRows = React.useMemo(() => {
    const filtered = sortedRoles.filter((role) => {
      if (rolesStatusFilter === "active") {
        return role.isActive;
      }

      if (rolesStatusFilter === "inactive") {
        return !role.isActive;
      }

      return true;
    });

    return filtered.sort((firstRole, secondRole) => {
      if (rolesSortBy === "updated_oldest") {
        return toUtcTimestamp(firstRole.updatedAt) - toUtcTimestamp(secondRole.updatedAt);
      }

      if (rolesSortBy === "permissions_most") {
        return secondRole.permissions.length - firstRole.permissions.length;
      }

      if (rolesSortBy === "members_most") {
        return secondRole.membersCount - firstRole.membersCount;
      }

      return toUtcTimestamp(secondRole.updatedAt) - toUtcTimestamp(firstRole.updatedAt);
    });
  }, [rolesSortBy, rolesStatusFilter, sortedRoles]);

  const activeAssignableRoles = React.useMemo(
    () =>
      roles
        .filter((role) => role.isActive)
        .map((role) => role.role),
    [roles],
  );

  const allRoles = React.useMemo(
    () => Object.keys(staffRoleLabels) as StaffRole[],
    [],
  );

  const createRoleOptions = React.useMemo(
    () =>
      allRoles.filter(
        (roleKey) => !roles.some((existingRole) => existingRole.role === roleKey),
      ),
    [allRoles, roles],
  );

  const memberFormRoleOptions = React.useMemo(() => {
    if (activeAssignableRoles.length > 0) {
      return activeAssignableRoles;
    }

    return ["viewer"] as StaffRole[];
  }, [activeAssignableRoles]);

  const roleFormRoleOptions = React.useMemo(() => {
    if (roleFormMode === "create") {
      return createRoleOptions.length > 0 ? createRoleOptions : allRoles;
    }

    return allRoles;
  }, [allRoles, createRoleOptions, roleFormMode]);

  const employeesPagination = usePagination({
    totalItems: filteredStaffRows.length,
    pageSize: employeesPageSize,
  });
  const rolesPagination = usePagination({
    totalItems: filteredRolesRows.length,
    pageSize: rolesPageSize,
  });

  const { setCurrentPage: setEmployeesCurrentPage } = employeesPagination;
  const { setCurrentPage: setRolesCurrentPage } = rolesPagination;

  React.useEffect(() => {
    setEmployeesCurrentPage(1);
  }, [
    employeesPageSize,
    employeesRoleFilter,
    employeesSortBy,
    setEmployeesCurrentPage,
  ]);

  React.useEffect(() => {
    setRolesCurrentPage(1);
  }, [rolesPageSize, rolesSortBy, rolesStatusFilter, setRolesCurrentPage]);

  const paginatedStaff = React.useMemo(
    () =>
      filteredStaffRows.slice(
        employeesPagination.startIndex,
        employeesPagination.endIndex,
      ),
    [
      employeesPagination.endIndex,
      employeesPagination.startIndex,
      filteredStaffRows,
    ],
  );

  const paginatedRoles = React.useMemo(
    () =>
      filteredRolesRows.slice(rolesPagination.startIndex, rolesPagination.endIndex),
    [filteredRolesRows, rolesPagination.endIndex, rolesPagination.startIndex],
  );

  const deleteTargetMember = React.useMemo(
    () =>
      deleteMemberId
        ? (staff.find((member) => member.id === deleteMemberId) ?? null)
        : null,
    [deleteMemberId, staff],
  );

  const deleteTargetRole = React.useMemo(
    () =>
      deleteRoleId ? (roles.find((role) => role.id === deleteRoleId) ?? null) : null,
    [deleteRoleId, roles],
  );

  const openCreateMemberSheet = React.useCallback(() => {
    setMemberFormMode("create");
    setEditingMemberId(null);
    setMemberFormInitialValues({
      ...EMPTY_STAFF_MEMBER_FORM_VALUES,
      role: memberFormRoleOptions[0] ?? "viewer",
    });
    setMemberFormOpen(true);
  }, [memberFormRoleOptions]);

  const openEditMemberSheet = React.useCallback(
    (staffId: string) => {
      const member = staff.find((candidate) => candidate.id === staffId);
      if (!member) {
        return;
      }

      setMemberFormMode("edit");
      setEditingMemberId(member.id);
      setMemberFormInitialValues({
        name: member.name,
        email: member.email,
        role: member.role,
      });
      setMemberFormOpen(true);
    },
    [staff],
  );

  const handleSubmitMember = React.useCallback(
    (values: StaffMemberFormValues) => {
      if (memberFormMode === "create") {
        setStaff((currentStaff) => [
          {
            id: createNextStaffId(currentStaff),
            name: values.name,
            email: values.email,
            role: values.role,
            invitedAt: new Date().toISOString(),
          },
          ...currentStaff,
        ]);
        return;
      }

      if (!editingMemberId) {
        return;
      }

      setStaff((currentStaff) =>
        currentStaff.map((member) =>
          member.id === editingMemberId
            ? {
                ...member,
                name: values.name,
                email: values.email,
                role: values.role,
              }
            : member,
        ),
      );
    },
    [editingMemberId, memberFormMode],
  );

  const openDeleteMemberDialog = React.useCallback((staffId: string) => {
    setDeleteMemberId(staffId);
    setMemberDeleteDialogOpen(true);
  }, []);

  const handleDeleteMember = React.useCallback(() => {
    if (!deleteMemberId) {
      return;
    }

    setStaff((currentStaff) =>
      currentStaff.filter((member) => member.id !== deleteMemberId),
    );
    setDeleteMemberId(null);
    setMemberDeleteDialogOpen(false);
  }, [deleteMemberId]);

  const openCreateRoleSheet = React.useCallback(() => {
    setRoleFormMode("create");
    setEditingRoleId(null);
    setRoleFormInitialValues({
      ...EMPTY_STAFF_ROLE_FORM_VALUES,
      role: createRoleOptions[0] ?? allRoles[0] ?? "viewer",
    });
    setRoleFormOpen(true);
  }, [allRoles, createRoleOptions]);

  const openEditRoleSheet = React.useCallback(
    (roleId: string) => {
      const role = roles.find((candidate) => candidate.id === roleId);
      if (!role) {
        return;
      }

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
    [roles],
  );

  const handleSubmitRole = React.useCallback(
    (values: StaffRoleFormValues) => {
      const now = new Date().toISOString();

      if (roleFormMode === "create") {
        const existingRole = roles.find((role) => role.role === values.role);
        if (existingRole) {
          setRoles((currentRoles) =>
            currentRoles.map((role) =>
              role.id === existingRole.id
                ? {
                    ...role,
                    description: values.description,
                    permissions:
                      values.permissions.length > 0
                        ? values.permissions
                        : role.permissions,
                    isActive: values.isActive,
                    updatedAt: now,
                  }
                : role,
            ),
          );

          if (!values.isActive) {
            setStaff((currentStaff) =>
              currentStaff.map((member) =>
                member.role === existingRole.role
                  ? {
                      ...member,
                      role: "viewer",
                    }
                  : member,
              ),
            );
          }
          return;
        }

        setRoles((currentRoles) => [
          {
            id: createNextRoleId(currentRoles),
            role: values.role,
            description: values.description,
            permissions:
              values.permissions.length > 0 ? values.permissions : ["عرض اللوحة"],
            updatedAt: now,
            isActive: values.isActive,
            isSystem: false,
          },
          ...currentRoles,
        ]);
        return;
      }

      if (!editingRoleId) {
        return;
      }

      const targetRole = roles.find((role) => role.id === editingRoleId);
      if (!targetRole) {
        return;
      }

      setRoles((currentRoles) =>
        currentRoles.map((role) =>
          role.id === editingRoleId
            ? {
                ...role,
                description: values.description,
                permissions:
                  values.permissions.length > 0 ? values.permissions : role.permissions,
                isActive: values.isActive,
                updatedAt: now,
              }
            : role,
        ),
      );

      if (!values.isActive) {
        setStaff((currentStaff) =>
          currentStaff.map((member) =>
            member.role === targetRole.role
              ? {
                  ...member,
                  role: "viewer",
                }
              : member,
          ),
        );
      }
    },
    [editingRoleId, roleFormMode, roles],
  );

  const openDeleteRoleDialog = React.useCallback((roleId: string) => {
    setDeleteRoleId(roleId);
    setRoleDeleteDialogOpen(true);
  }, []);

  const handleDeleteRole = React.useCallback(() => {
    if (!deleteRoleId) {
      return;
    }

    const roleToDelete = roles.find((role) => role.id === deleteRoleId);
    if (!roleToDelete || roleToDelete.isSystem) {
      setRoleDeleteDialogOpen(false);
      setDeleteRoleId(null);
      return;
    }

    setRoles((currentRoles) =>
      currentRoles.filter((role) => role.id !== deleteRoleId),
    );

    setStaff((currentStaff) =>
      currentStaff.map((member) =>
        member.role === roleToDelete.role
          ? {
              ...member,
              role: "viewer",
            }
          : member,
      ),
    );

    setDeleteRoleId(null);
    setRoleDeleteDialogOpen(false);
  }, [deleteRoleId, roles]);

  const isEmployeesView = view === "employees";
  const activeCount = isEmployeesView
    ? filteredStaffRows.length
    : filteredRolesRows.length;
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
          <Button
            size="sm"
            className="w-fit"
            onClick={openCreateRoleSheet}
          >
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
            onValueChange={(value) =>
              setEmployeesRoleFilter(value as "all" | StaffRole)
            }
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
            onValueChange={(value) =>
              setEmployeesSortBy(value as EmployeesSortOption)
            }
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
          {filteredStaffRows.length === 0 ? (
            <EmptyState
              icon="staff"
              title="لا يوجد موظفون مضافون"
              description="يمكنك إضافة موظفين جدد وإسناد الأدوار لهم."
            />
          ) : (
            <StaffTable
              rows={paginatedStaff}
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
          {filteredRolesRows.length === 0 ? (
            <EmptyState
              icon="settings"
              title="لا توجد أدوار معرفة"
              description="أضف أدواراً جديدة لتوزيع الصلاحيات على الموظفين."
            />
          ) : (
            <RolesTable
              rows={paginatedRoles}
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
        roleOptions={memberFormRoleOptions}
        onOpenChange={(nextOpen) => {
          setMemberFormOpen(nextOpen);
          if (!nextOpen) {
            setEditingMemberId(null);
          }
        }}
        onSubmit={handleSubmitMember}
      />

      <StaffMemberDeleteDialog
        open={memberDeleteDialogOpen}
        staffName={deleteTargetMember?.name ?? "-"}
        onOpenChange={(nextOpen) => {
          setMemberDeleteDialogOpen(nextOpen);
          if (!nextOpen) {
            setDeleteMemberId(null);
          }
        }}
        onConfirm={handleDeleteMember}
      />

      <StaffRoleFormSheet
        open={roleFormOpen}
        mode={roleFormMode}
        initialValues={roleFormInitialValues}
        roleOptions={roleFormRoleOptions}
        onOpenChange={(nextOpen) => {
          setRoleFormOpen(nextOpen);
          if (!nextOpen) {
            setEditingRoleId(null);
          }
        }}
        onSubmit={handleSubmitRole}
      />

      <StaffRoleDeleteDialog
        open={roleDeleteDialogOpen}
        roleName={
          deleteTargetRole ? (staffRoleLabels[deleteTargetRole.role] ?? deleteTargetRole.role) : "-"
        }
        membersCount={deleteTargetRole ? roleMemberCounts[deleteTargetRole.role] : 0}
        onOpenChange={(nextOpen) => {
          setRoleDeleteDialogOpen(nextOpen);
          if (!nextOpen) {
            setDeleteRoleId(null);
          }
        }}
        onConfirm={handleDeleteRole}
      />
    </section>
  );
}
