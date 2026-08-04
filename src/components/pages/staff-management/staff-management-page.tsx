'use client'

import * as React from 'react'
import { useQueryModal } from '@/hooks/use-query-modal'

import { RolesTable } from '@/components/pages/staff-management/roles-table'
import { StaffMemberDeleteDialog } from '@/components/pages/staff-management/staff-member-delete-dialog'
import {
  EMPTY_STAFF_MEMBER_FORM_VALUES,
  StaffMemberFormSheet,
  type StaffMemberFormValues,
} from '@/components/pages/staff-management/staff-member-form-sheet'
import { StaffRoleDeleteDialog } from '@/components/pages/staff-management/staff-role-delete-dialog'
import {
  EMPTY_STAFF_ROLE_FORM_VALUES,
  StaffRoleFormSheet,
  type StaffRoleFormValues,
} from '@/components/pages/staff-management/staff-role-form-sheet'
import { StaffTable } from '@/components/pages/staff-management/staff-table'
import { EmptyState, ListLoadingSkeleton, PaginationControls } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { AppIcons } from '@/constant/icons'
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constant/pagination'
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
} from '@/features/org/staff/org.staff.query'
import { usePagination } from '@/hooks/use-pagination'
import { useAuth } from '@/providers/AuthProvider'

export function StaffManagementPage({ view = 'employees' }: { view?: 'employees' | 'roles' }) {
  const { user: currentUser, can } = useAuth()
  const canCreateMember = can('org.staff.create')
  const canUpdateMember = can('org.staff.update')
  const canDeleteMember = can('org.staff.delete')
  const canCreateRole = can('org.roles.create')
  const canUpdateRole = can('org.roles.update')
  const canDeleteRole = can('org.roles.delete')
  const isEmployeesView = view === 'employees'
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE)
  const [total, setTotal] = React.useState(0)
  const pagination = usePagination({ totalItems: total, pageSize })
  const [memberOptionsRequested, setMemberOptionsRequested] = React.useState(false)
  const [roleOptionsRequested, setRoleOptionsRequested] = React.useState(false)

  const staffQuery = useOrgStaff(
    { page: pagination.currentPage, perPage: pageSize, sort: '-invitedAt' },
    isEmployeesView,
  )
  const rolesQuery = useOrgRoles(
    { page: pagination.currentPage, perPage: pageSize, sort: '-updatedAt' },
    !isEmployeesView,
  )
  const roleOptionsQuery = useOrgRoles(
    { page: 1, perPage: 100, sort: 'name', filter: { status: 'active' } },
    isEmployeesView && memberOptionsRequested,
  )
  const catalogQuery = useOrgPermissionsCatalog(!isEmployeesView && roleOptionsRequested)

  const activeQuery = isEmployeesView ? staffQuery : rolesQuery
  React.useEffect(() => {
    setTotal(activeQuery.data?.meta.total ?? 0)
  }, [activeQuery.data?.meta.total])

  const staffRows = staffQuery.data?.data ?? []
  const roleRows = rolesQuery.data?.data ?? []
  const roleOptions = (roleOptionsQuery.data?.data ?? []).map((role) => ({ id: role.id, name: role.role }))
  const permissionOptions = catalogQuery.data?.data ?? []

  const createStaff = useCreateOrgStaff()
  const updateStaff = useUpdateOrgStaff()
  const deleteStaff = useDeleteOrgStaff()
  const createRole = useCreateOrgRole()
  const updateRole = useUpdateOrgRole()
  const deleteRole = useDeleteOrgRole()

  const memberModal = useQueryModal('staff-member-form', {
    permissionsByMode: {
      create: 'org.staff.create',
      edit: 'org.staff.update',
    },
  })
  const memberOpen = memberModal.isOpen
  const memberMode = memberModal.mode === 'edit' ? 'edit' : 'create'
  const memberId = memberMode === 'edit' ? memberModal.id : null
  const [memberValues, setMemberValues] = React.useState(EMPTY_STAFF_MEMBER_FORM_VALUES)
  const memberDeleteModal = useQueryModal('staff-member-delete', {
    permission: 'org.staff.delete',
  })
  const memberDeleteOpen = memberDeleteModal.isOpen
  const memberDeleteId = memberDeleteModal.id

  const roleModal = useQueryModal('staff-role-form', {
    permissionsByMode: {
      create: 'org.roles.create',
      edit: 'org.roles.update',
    },
  })
  const roleOpen = roleModal.isOpen
  const roleMode = roleModal.mode === 'edit' ? 'edit' : 'create'
  const roleId = roleMode === 'edit' ? roleModal.id : null
  const [roleValues, setRoleValues] = React.useState(EMPTY_STAFF_ROLE_FORM_VALUES)
  const roleDeleteModal = useQueryModal('staff-role-delete', {
    permission: 'org.roles.delete',
  })
  const roleDeleteOpen = roleDeleteModal.isOpen
  const roleDeleteId = roleDeleteModal.id

  const memberDetailQuery = useOrgStaffMember(memberOpen && memberMode === 'edit' ? memberId : null)
  const roleDetailQuery = useOrgRole(roleOpen && roleMode === 'edit' ? roleId : null)

  React.useEffect(() => {
    const member = memberDetailQuery.data?.data
    if (!member) return
    setMemberValues({ name: member.name, email: member.email, organizationRoleId: member.roleId })
  }, [memberDetailQuery.data])

  React.useEffect(() => {
    const role = roleDetailQuery.data?.data
    if (!role) return
    setRoleValues({ name: role.role, description: role.description ?? '', permissions: role.permissions, isActive: role.isActive })
  }, [roleDetailQuery.data])

  const openCreateMember = () => {
    setMemberOptionsRequested(true)

    setMemberValues({ ...EMPTY_STAFF_MEMBER_FORM_VALUES, organizationRoleId: roleOptions[0]?.id ?? '' })
    memberModal.open({ mode: 'create' })
  }

  const openEditMember = (id: string) => {
    setMemberOptionsRequested(true)
    const member = staffRows.find((item) => item.id === id)
    if (!member) return

    setMemberValues({ name: member.name, email: member.email, organizationRoleId: member.roleId })
    memberModal.open({ id, mode: 'edit' })
  }

  const submitMember = (values: StaffMemberFormValues) => {
    if (memberMode === 'create') {
      createStaff.mutate({ name: values.name, email: values.email, organizationRoleId: values.organizationRoleId }, { onSuccess: () => memberModal.close() })
      return
    }
    if (!memberId) return
    updateStaff.mutate({ staffId: memberId, body: { organizationRoleId: values.organizationRoleId } }, { onSuccess: () => memberModal.close() })
  }

  const requestDeleteMember = (id: string) => {
    const member = staffRows.find((item) => item.id === id)
    const isCurrentUser =
      id === currentUser?.id ||
      member?.email.trim().toLowerCase() === currentUser?.email.trim().toLowerCase()
    if (!member || isCurrentUser) return
    memberDeleteModal.open({ id })
  }

  const openCreateRole = () => {
    setRoleOptionsRequested(true)

    setRoleValues(EMPTY_STAFF_ROLE_FORM_VALUES)
    roleModal.open({ mode: 'create' })
  }

  const openEditRole = (id: string) => {
    setRoleOptionsRequested(true)
    const role = roleRows.find((item) => item.id === id)
    if (!role || role.isSystem) return

    setRoleValues({ name: role.role, description: role.description ?? '', permissions: role.permissions, isActive: role.isActive })
    roleModal.open({ id, mode: 'edit' })
  }

  const submitRole = (values: StaffRoleFormValues) => {
    if (roleMode === 'create') {
      createRole.mutate(values, { onSuccess: () => roleModal.close() })
      return
    }
    if (!roleId) return
    updateRole.mutate({ roleId, body: values }, { onSuccess: () => roleModal.close() })
  }

  const requestDeleteRole = (id: string) => {
    const role = roleRows.find((item) => item.id === id)
    if (!role) return
    roleDeleteModal.open({ id })
  }

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold">
            {isEmployeesView ? 'إدارة موظفي المنظمة' : 'إدارة الأدوار والصلاحيات'}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {isEmployeesView
              ? 'إدارة الموظفين وربطهم بالأدوار المناسبة.'
              : 'إنشاء أدوار مخصصة وتحديد صلاحيات كل دور.'}
          </p>
        </div>
        {(isEmployeesView ? canCreateMember : canCreateRole) ? (
          <Button size="sm" onClick={isEmployeesView ? openCreateMember : openCreateRole}>
            {isEmployeesView ? <AppIcons.UserPlus className="size-4" /> : <AppIcons.settings className="size-4" />}
            {isEmployeesView ? 'إضافة موظف' : 'إضافة دور'}
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
        staffRows.length ? <StaffTable rows={staffRows} currentUserId={currentUser?.id ?? null} currentUserEmail={currentUser?.email ?? null} onEdit={canUpdateMember ? openEditMember : undefined} onDelete={canDeleteMember ? requestDeleteMember : undefined} /> : <EmptyState icon="staff" title="لا يوجد موظفون" description="ابدأ بإضافة أول موظف إلى المنظمة." />
      ) : roleRows.length ? (
        <RolesTable rows={roleRows} onEditRole={canUpdateRole ? openEditRole : undefined} onDeleteRole={canDeleteRole ? requestDeleteRole : undefined} />
      ) : (
        <EmptyState icon="settings" title="لا توجد أدوار" description="ابدأ بإضافة دور وتحديد صلاحياته." />
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

      <StaffMemberFormSheet open={memberOpen} mode={memberMode} initialValues={memberValues} roleOptions={roleOptions} isLoadingDetails={roleOptionsQuery.isLoading || memberDetailQuery.isLoading} onOpenChange={memberModal.onOpenChange} onSubmit={submitMember} />
      <StaffMemberDeleteDialog
        open={memberDeleteOpen}
        staffName={staffRows.find((item) => item.id === memberDeleteId)?.name ?? ''}
        onOpenChange={memberDeleteModal.onOpenChange}
        onConfirm={() => {
          const member = staffRows.find((item) => item.id === memberId)
          const isCurrentUser =
            memberDeleteId === currentUser?.id ||
            member?.email.trim().toLowerCase() === currentUser?.email.trim().toLowerCase()
          if (!memberDeleteId || isCurrentUser) return
          deleteStaff.mutate(memberDeleteId, { onSuccess: () => memberDeleteModal.close() })
        }}
      />
      <StaffRoleFormSheet open={roleOpen} mode={roleMode} initialValues={roleValues} permissionOptions={permissionOptions} isLoadingDetails={catalogQuery.isLoading || roleDetailQuery.isLoading} onOpenChange={roleModal.onOpenChange} onSubmit={submitRole} />
      <StaffRoleDeleteDialog open={roleDeleteOpen} roleName={roleRows.find((item) => item.id === roleDeleteId)?.role ?? ''} membersCount={roleRows.find((item) => item.id === roleDeleteId)?.membersCount ?? 0} onOpenChange={roleDeleteModal.onOpenChange} onConfirm={() => roleDeleteId && deleteRole.mutate(roleDeleteId, { onSuccess: () => roleDeleteModal.close() })} />
    </section>
  )
}