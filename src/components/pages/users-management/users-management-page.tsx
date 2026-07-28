"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/shared";
import { usePagination } from "@/hooks/use-pagination";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { UsersTable } from "@/components/pages/users-management/users-table";
import { UserDeleteDialog } from "@/components/pages/users-management/user-delete-dialog";
import { UserChangePasswordDialog } from "@/components/pages/users-management/user-change-password-dialog";
import {
  getUserType,
  normalizeUserStatus,
  type UserRole,
  type UserStatus,
} from "@/components/pages/users-management/users-management.types";
import { displayOrDash } from "@/lib/text";
import { normalizeApiError } from "@/lib/api-errors";
import { UsersFilters } from "@/components/pages/users-management/users-filters";
import { AppIcons } from "@/constant/icons";
import {
  useAdminUsers,
  useCreateUser,
  useUpdateUser,
  useToggleUserStatus,
  useChangeUserPassword,
  useDeleteUser,
} from "@/features/admin/users/admin.users.query";
import { adminUsersServices } from "@/features/admin/users/admin.users.services";
import { adminUsersKeys } from "@/features/admin/users/admin.users.query-keys";
import {
  EMPTY_USER_FORM_VALUES,
  type UserFormValues,
  UserFormSheet,
} from "@/components/pages/users-management/user-form-sheet";

export function UsersManagementPage() {
  const queryClient = useQueryClient();

  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [apiTotal, setApiTotal] = React.useState(0);
  const [statusFilter, setStatusFilter] = React.useState<"all" | UserStatus>("all");
  const [roleFilter, setRoleFilter] = React.useState<"all" | UserRole>("all");
  const [searchFilter, setSearchFilter] = React.useState("");

  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;

  const { data, isLoading, isError, refetch } = useAdminUsers({
    page: pagination.currentPage,
    perPage: pageSize,
    sort: "-createdAt",
    filter: {
      status: statusFilter !== "all" ? statusFilter : undefined,
      role: roleFilter !== "all" ? roleFilter : undefined,
      userType: roleFilter !== "all" ? roleFilter : undefined,
      search: searchFilter.trim() || undefined,
    },
  });

  React.useEffect(() => {
    if (data?.meta.total !== undefined) {
      setApiTotal(data.meta.total);
    }
  }, [data?.meta.total]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, statusFilter, roleFilter, searchFilter, setCurrentPage]);

  const users = data?.data ?? [];

  // Form sheet state
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [formInitialValues, setFormInitialValues] =
    React.useState<UserFormValues>(EMPTY_USER_FORM_VALUES);
  const [editingUserId, setEditingUserId] = React.useState<string | null>(null);
  const [formEmailError, setFormEmailError] = React.useState<string | null>(null);
  const [formFieldErrors, setFormFieldErrors] = React.useState<
    Partial<Record<keyof UserFormValues, string>>
  >({});
  const [isLoadingDetails, setIsLoadingDetails] = React.useState(false);

  // Per-row loading for status toggle only
  const [loadingRowIds, setLoadingRowIds] = React.useState<Set<string>>(
    new Set(),
  );

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteTargetUserId, setDeleteTargetUserId] = React.useState<
    string | null
  >(null);

  // Change password dialog state
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    React.useState(false);
  const [changePasswordTargetUserId, setChangePasswordTargetUserId] =
    React.useState<string | null>(null);
  const [changePasswordTargetUserName, setChangePasswordTargetUserName] =
    React.useState("");
  const [changePasswordError, setChangePasswordError] = React.useState<string | null>(null);

  // Mutations
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const toggleStatusMutation = useToggleUserStatus();
  const changePasswordMutation = useChangeUserPassword();
  const deleteMutation = useDeleteUser();

  const deleteTargetUser = deleteTargetUserId
    ? (users.find((u) => u.id === deleteTargetUserId) ?? null)
    : null;

  const addLoadingRow = React.useCallback((id: string) => {
    setLoadingRowIds((prev) => new Set([...prev, id]));
  }, []);

  const removeLoadingRow = React.useCallback((id: string) => {
    setLoadingRowIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const resetFilters = React.useCallback(() => {
    setStatusFilter("all");
    setRoleFilter("all");
    setSearchFilter("");
  }, []);

  const openCreateSheet = React.useCallback(() => {
    setFormMode("create");
    setEditingUserId(null);
    setFormInitialValues(EMPTY_USER_FORM_VALUES);
    setFormEmailError(null);
    setFormFieldErrors({});
    setIsLoadingDetails(false);
    setFormOpen(true);
  }, []);

  const openEditSheet = React.useCallback(
    async (userId: string) => {
      setFormMode("edit");
      setEditingUserId(userId);
      setFormInitialValues(EMPTY_USER_FORM_VALUES);
      setFormEmailError(null);
      setIsLoadingDetails(true);
      setFormOpen(true);

      try {
        const response = await queryClient.fetchQuery({
          queryKey: adminUsersKeys.detail(userId),
          queryFn: () => adminUsersServices.getUserById(userId),
          staleTime: 0,
        });
        const user = response.data;
        setFormInitialValues({
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: getUserType(user),
          status: normalizeUserStatus(user.status),
          password: "",
          passwordConfirmation: "",
        });
      } catch {
        // toast already shown by the api interceptor
        setFormOpen(false);
        setEditingUserId(null);
      } finally {
        setIsLoadingDetails(false);
      }
    },
    [queryClient],
  );

  const handleSaveForm = React.useCallback(
    (values: UserFormValues) => {
      const onError = (error: Error) => {
        const normalized = normalizeApiError<keyof UserFormValues & string>(error, {
          fieldAliases: { userType: "role", password_confirmation: "passwordConfirmation" },
        });
        setFormFieldErrors(normalized.fieldErrors);
        if (normalized.status === 409 && !normalized.fieldErrors.email) {
          setFormEmailError("البريد الإلكتروني مستخدم مسبقاً.");
        }
      };

      if (formMode === "create") {
        const password = values.password ?? "";
        createMutation.mutate(
          {
            name: values.name,
            email: values.email,
            phone: values.phone,
            userType: values.role,
            role: values.role,
            status: values.status,
            password,
            password_confirmation: values.passwordConfirmation ?? password,
          },
          {
            onSuccess: () => {
              setFormOpen(false);
              setFormEmailError(null);
            },
            onError,
          },
        );
        return;
      }

      if (!editingUserId) return;

      updateMutation.mutate(
        {
          userId: editingUserId,
          body: {
            name: values.name,
            email: values.email,
            phone: values.phone,
            userType: values.role,
            role: values.role,
            status: values.status,
          },
        },        {
          onSuccess: () => {
            setFormOpen(false);
            setEditingUserId(null);
            setFormEmailError(null);
          },
          onError,
        },
      );
    },
    [formMode, editingUserId, createMutation, updateMutation],
  );

  const handleToggleUserStatus = React.useCallback(
    (userId: string) => {
      const user = users.find((u) => u.id === userId);
      if (!user) return;
      const nextStatus: UserStatus =
        user.status === "active" ? "inactive" : "active";
      addLoadingRow(userId);
      toggleStatusMutation.mutate(
        { userId, status: nextStatus },
        { onSettled: () => removeLoadingRow(userId) },
      );
    },
    [users, toggleStatusMutation, addLoadingRow, removeLoadingRow],
  );

  const openDeleteDialog = React.useCallback((userId: string) => {
    setDeleteTargetUserId(userId);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteUser = React.useCallback(() => {
    if (!deleteTargetUserId) return;
    deleteMutation.mutate(deleteTargetUserId, {
      onSuccess: () => {
        // success toast from api interceptor
        setDeleteDialogOpen(false);
        setDeleteTargetUserId(null);
      },
    });
  }, [deleteTargetUserId, deleteMutation]);

  const openChangePasswordDialog = React.useCallback(
    (userId: string) => {
      const user = users.find((u) => u.id === userId);
      setChangePasswordTargetUserId(userId);
      setChangePasswordTargetUserName(displayOrDash(user?.name));
      setChangePasswordError(null);
      setChangePasswordDialogOpen(true);
    },
    [users],
  );

  const handleChangePassword = React.useCallback(
    (newPassword: string) => {
      if (!changePasswordTargetUserId) return;
      changePasswordMutation.mutate(
        { userId: changePasswordTargetUserId, newPassword },
        {
          onSuccess: () => {
            setChangePasswordDialogOpen(false);
            setChangePasswordTargetUserId(null);
            setChangePasswordError(null);
          },
          onError: (error) => {
            const normalized = normalizeApiError(error);
            setChangePasswordError(
              normalized.fieldErrors.newPassword ?? normalized.message,
            );
          },
        },
      );
    },
    [changePasswordTargetUserId, changePasswordMutation],
  );

  const isFormSubmitting =
    createMutation.isPending || updateMutation.isPending;

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
          <Button type="button" disabled={isLoading} onClick={openCreateSheet}>
            اضافة مستخدم جديد
            <AppIcons.users className="size-4" />
          </Button>
        </div>
      </div>

      <UsersFilters
        statusFilter={statusFilter}
        roleFilter={roleFilter}
        searchFilter={searchFilter}
        onStatusFilterChange={setStatusFilter}
        onRoleFilterChange={setRoleFilter}
        onSearchFilterChange={setSearchFilter}
        onResetFilters={resetFilters}
      />

      {isError && (
        <div className="flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="flex-1 text-sm text-destructive">
            تعذّر تحميل المستخدمين. حاول مرة أخرى.
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => refetch()}
          >
            إعادة المحاولة
          </Button>
        </div>
      )}

      <UsersTable
        rows={users}
        isLoading={isLoading}
        loadingRowIds={loadingRowIds}
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
        key={`${formMode}-${editingUserId ?? "new"}`}
        open={formOpen}
        mode={formMode}
        initialValues={formInitialValues}
        isSubmitting={isFormSubmitting}
        isLoadingDetails={isLoadingDetails}
        emailError={formEmailError}
        apiFieldErrors={formFieldErrors}
        onOpenChange={(nextOpen) => {
          if (isFormSubmitting || isLoadingDetails) return;
          setFormOpen(nextOpen);
          if (!nextOpen) {
            setEditingUserId(null);
            setFormEmailError(null);
            setFormFieldErrors({});
            setIsLoadingDetails(false);
          }
        }}
        onSubmit={handleSaveForm}
      />

      <UserDeleteDialog
        open={deleteDialogOpen}
        userName={displayOrDash(deleteTargetUser?.name)}
        isDeleting={deleteMutation.isPending}
        onOpenChange={(nextOpen) => {
          if (!deleteMutation.isPending) {
            setDeleteDialogOpen(nextOpen);
            if (!nextOpen) setDeleteTargetUserId(null);
          }
        }}
        onConfirm={handleDeleteUser}
      />

      <UserChangePasswordDialog
        open={changePasswordDialogOpen}
        userName={changePasswordTargetUserName}
        isSubmitting={changePasswordMutation.isPending}
        errorMessage={changePasswordError}
        onOpenChange={(nextOpen) => {
          if (!changePasswordMutation.isPending) {
            setChangePasswordDialogOpen(nextOpen);
            if (!nextOpen) {
              setChangePasswordTargetUserId(null);
              setChangePasswordTargetUserName("");
              setChangePasswordError(null);
            }
          }
        }}
        onConfirm={handleChangePassword}
      />
    </section>
  );
}
