"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/shared";
import { usePagination } from "@/hooks/use-pagination";
import { toUtcTimestamp } from "@/lib/date";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { UsersTable } from "@/components/pages/users-management/users-table";
import {
  EMPTY_USER_FORM_VALUES,
  type UserFormValues,
  UserFormSheet,
} from "@/components/pages/users-management/user-form-sheet";
import { UserDeleteDialog } from "@/components/pages/users-management/user-delete-dialog";
import { UserChangePasswordDialog } from "@/components/pages/users-management/user-change-password-dialog";
import { createNextUserId } from "@/components/pages/users-management/helpers";
import {
  usersStaticData,
  type AdminUserItem,
  type UserStatus,
} from "@/components/pages/users-management/static-data";
import { AppIcons } from "@/constant/icons";

export function UsersManagementPage() {
  const [users, setUsers] = React.useState<AdminUserItem[]>(usersStaticData);
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);

  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [formInitialValues, setFormInitialValues] =
    React.useState<UserFormValues>(EMPTY_USER_FORM_VALUES);
  const [editingUserId, setEditingUserId] = React.useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteTargetUserId, setDeleteTargetUserId] = React.useState<
    string | null
  >(null);

  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    React.useState(false);
  const [changePasswordTargetUserId, setChangePasswordTargetUserId] =
    React.useState<string | null>(null);

  const sortedUsers = React.useMemo(
    () =>
      [...users].sort(
        (firstUser, secondUser) =>
          toUtcTimestamp(secondUser.createdAt) -
          toUtcTimestamp(firstUser.createdAt),
      ),
    [users],
  );

  const pagination = usePagination({
    totalItems: sortedUsers.length,
    pageSize,
  });

  const currentPageUsers = React.useMemo(
    () => sortedUsers.slice(pagination.startIndex, pagination.endIndex),
    [sortedUsers, pagination.startIndex, pagination.endIndex],
  );

  const deleteTargetUser = React.useMemo(
    () =>
      deleteTargetUserId
        ? (users.find((user) => user.id === deleteTargetUserId) ?? null)
        : null,
    [users, deleteTargetUserId],
  );

  const changePasswordTargetUser = React.useMemo(
    () =>
      changePasswordTargetUserId
        ? (users.find((user) => user.id === changePasswordTargetUserId) ?? null)
        : null,
    [users, changePasswordTargetUserId],
  );

  const openCreateSheet = React.useCallback(() => {
    setFormMode("create");
    setEditingUserId(null);
    setFormInitialValues(EMPTY_USER_FORM_VALUES);
    setFormOpen(true);
  }, []);

  const openEditSheet = React.useCallback(
    (userId: string) => {
      const user = users.find((candidate) => candidate.id === userId);
      if (!user) {
        return;
      }

      setFormMode("edit");
      setEditingUserId(user.id);
      setFormInitialValues({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      });
      setFormOpen(true);
    },
    [users],
  );

  const handleSaveForm = React.useCallback(
    (values: UserFormValues) => {
      if (formMode === "create") {
        const now = new Date().toISOString();

        const nextUser: AdminUserItem = {
          id: createNextUserId(users),
          name: values.name,
          email: values.email,
          phone: values.phone,
          role: values.role,
          status: values.status,
          postsCount: 0,
          reportsCount: 0,
          createdAt: now,
          lastActiveAt: now,
        };

        setUsers((currentUsers) => [nextUser, ...currentUsers]);
        return;
      }

      if (!editingUserId) {
        return;
      }

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === editingUserId
            ? {
                ...user,
                name: values.name,
                email: values.email,
                phone: values.phone,
                role: values.role,
                status: values.status,
              }
            : user,
        ),
      );
    },
    [editingUserId, formMode, users],
  );

  const handleToggleUserStatus = React.useCallback((userId: string) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: (user.status === "active"
                ? "inactive"
                : "active") as UserStatus,
            }
          : user,
      ),
    );
  }, []);

  const openDeleteDialog = React.useCallback((userId: string) => {
    setDeleteTargetUserId(userId);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteUser = React.useCallback(() => {
    if (!deleteTargetUserId) {
      return;
    }

    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== deleteTargetUserId),
    );
    setDeleteDialogOpen(false);
    setDeleteTargetUserId(null);
  }, [deleteTargetUserId]);

  const openChangePasswordDialog = React.useCallback((userId: string) => {
    setChangePasswordTargetUserId(userId);
    setChangePasswordDialogOpen(true);
  }, []);

  const handleChangePassword = React.useCallback((newPassword: string) => {
    // Static demo action: no backend call here.
    void newPassword;
  }, []);

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row md:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground sm:text-base">
            إدارة المستخدمين
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            إدارة بيانات المستخدمين وإجراءات الحسابات عبر الجدول.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={openCreateSheet}>
            اضافة مستخدم جديد
            <AppIcons.users className="size-4" />
          </Button>
        </div>
      </div>

      <UsersTable
        rows={currentPageUsers}
        onEditUser={openEditSheet}
        onToggleUserStatus={handleToggleUserStatus}
        onChangeUserPassword={openChangePasswordDialog}
        onDeleteUser={openDeleteDialog}
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

      <UserFormSheet
        open={formOpen}
        mode={formMode}
        initialValues={formInitialValues}
        onOpenChange={(nextOpen) => {
          setFormOpen(nextOpen);
          if (!nextOpen) {
            setEditingUserId(null);
          }
        }}
        onSubmit={handleSaveForm}
      />

      <UserDeleteDialog
        open={deleteDialogOpen}
        userName={deleteTargetUser?.name ?? "-"}
        onOpenChange={(nextOpen) => {
          setDeleteDialogOpen(nextOpen);
          if (!nextOpen) {
            setDeleteTargetUserId(null);
          }
        }}
        onConfirm={handleDeleteUser}
      />

      <UserChangePasswordDialog
        open={changePasswordDialogOpen}
        userName={changePasswordTargetUser?.name ?? "-"}
        onOpenChange={(nextOpen) => {
          setChangePasswordDialogOpen(nextOpen);
          if (!nextOpen) {
            setChangePasswordTargetUserId(null);
          }
        }}
        onConfirm={handleChangePassword}
      />
    </section>
  );
}
