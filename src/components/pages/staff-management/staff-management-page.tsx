'use client'

import * as React from 'react'

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
  const { user: currentUser } = useAuth()
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

  const [memberOpen, setMemberOpen] = React.useState(false)
  const [memberMode, setMemberMode] = React.useState<'create' | 'edit'>('create')
  const [memberValues, setMemberValues] = React.useState(EMPTY_STAFF_MEMBER_FORM_VALUES)
  const [memberId, setMemberId] = React.useState<string | null>(null)
  const [memberDeleteOpen, setMemberDeleteOpen] = React.useState(false)
  const [memberDeleteName, setMemberDeleteName] = React.useState('')

  const [roleOpen, setRoleOpen] = React.useState(false)
  const [roleMode, setRoleMode] = React.useState<'create' | 'edit'>('create')
  const [roleValues, setRoleValues] = React.useState(EMPTY_STAFF_ROLE_FORM_VALUES)
  const [roleId, setRoleId] = React.useState<string | null>(null)
  const [roleDeleteOpen, setRoleDeleteOpen] = React.useState(false)
  const [roleDeleteName, setRoleDeleteName] = React.useState('')
  const [roleDeleteMembersCount, setRoleDeleteMembersCount] = React.useState(0)

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
    setMemberMode('create')
    setMemberId(null)
    setMemberValues({ ...EMPTY_STAFF_MEMBER_FORM_VALUES, organizationRoleId: roleOptions[0]?.id ?? '' })
    setMemberOpen(true)
  }

  const openEditMember = (id: string) => {
    setMemberOptionsRequested(true)
    const member = staffRows.find((item) => item.id === id)
    if (!member) return
    setMemberMode('edit')
    setMemberId(id)
    setMemberValues({ name: member.name, email: member.email, organizationRoleId: member.roleId })
    setMemberOpen(true)
  }

  const submitMember = (values: StaffMemberFormValues) => {
    if (memberMode === 'create') {
      createStaff.mutate({ name: values.name, email: values.email, organizationRoleId: values.organizationRoleId }, { onSuccess: () => setMemberOpen(false) })
      return
    }
    if (!memberId) return
    updateStaff.mutate({ staffId: memberId, body: { organizationRoleId: values.organizationRoleId } }, { onSuccess: () => setMemberOpen(false) })
  }

  const requestDeleteMember = (id: string) => {
    const member = staffRows.find((item) => item.id === id)
    const isCurrentUser =
      id === currentUser?.id ||
      member?.email.trim().toLowerCase() === currentUser?.email.trim().toLowerCase()
    if (!member || isCurrentUser) return
    setMemberId(id)
    setMemberDeleteName(member.name)
    setMemberDeleteOpen(true)
  }

  const openCreateRole = () => {
    setRoleOptionsRequested(true)
    setRoleMode('create')
    setRoleId(null)
    setRoleValues(EMPTY_STAFF_ROLE_FORM_VALUES)
    setRoleOpen(true)
  }

  const openEditRole = (id: string) => {
    setRoleOptionsRequested(true)
    const role = roleRows.find((item) => item.id === id)
    if (!role || role.isSystem) return
    setRoleMode('edit')
    setRoleId(id)
    setRoleValues({ name: role.role, description: role.description ?? '', permissions: role.permissions, isActive: role.isActive })
    setRoleOpen(true)
  }

  const submitRole = (values: StaffRoleFormValues) => {
    if (roleMode === 'create') {
      createRole.mutate(values, { onSuccess: () => setRoleOpen(false) })
      return
    }
    if (!roleId) return
    updateRole.mutate({ roleId, body: values }, { onSuccess: () => setRoleOpen(false) })
  }

  const requestDeleteRole = (id: string) => {
    const role = roleRows.find((item) => item.id === id)
    if (!role) return
    setRoleId(id)
    setRoleDeleteName(role.role)
    setRoleDeleteMembersCount(role.membersCount)
    setRoleDeleteOpen(true)
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
        <Button size="sm" onClick={isEmployeesView ? openCreateMember : openCreateRole}>
          {isEmployeesView ? <AppIcons.UserPlus className="size-4" /> : <AppIcons.settings className="size-4" />}
          {isEmployeesView ? 'إضافة موظف' : 'إضافة دور'}
        </Button>
      </div>

      {activeQuery.isLoading ? (
        <ListLoadingSkeleton />
      ) : activeQuery.isError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          تعذّر تحميل البيانات. حاول مرة أخرى.
        </div>
      ) : isEmployeesView ? (
        staffRows.length ? <StaffTable rows={staffRows} currentUserId={currentUser?.id ?? null} currentUserEmail={currentUser?.email ?? null} onEdit={openEditMember} onDelete={requestDeleteMember} /> : <EmptyState icon="staff" title="لا يوجد موظفون" description="ابدأ بإضافة أول موظف إلى المنظمة." />
      ) : roleRows.length ? (
        <RolesTable rows={roleRows} onEditRole={openEditRole} onDeleteRole={requestDeleteRole} />
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

      <StaffMemberFormSheet open={memberOpen} mode={memberMode} initialValues={memberValues} roleOptions={roleOptions} isLoadingDetails={roleOptionsQuery.isLoading || memberDetailQuery.isLoading} onOpenChange={setMemberOpen} onSubmit={submitMember} />
      <StaffMemberDeleteDialog
        open={memberDeleteOpen}
        staffName={memberDeleteName}
        onOpenChange={setMemberDeleteOpen}
        onConfirm={() => {
          const member = staffRows.find((item) => item.id === memberId)
          const isCurrentUser =
            memberId === currentUser?.id ||
            member?.email.trim().toLowerCase() === currentUser?.email.trim().toLowerCase()
          if (!memberId || isCurrentUser) return
          deleteStaff.mutate(memberId, { onSuccess: () => setMemberDeleteOpen(false) })
        }}
      />
      <StaffRoleFormSheet open={roleOpen} mode={roleMode} initialValues={roleValues} permissionOptions={permissionOptions} isLoadingDetails={catalogQuery.isLoading || roleDetailQuery.isLoading} onOpenChange={setRoleOpen} onSubmit={submitRole} />
      <StaffRoleDeleteDialog open={roleDeleteOpen} roleName={roleDeleteName} membersCount={roleDeleteMembersCount} onOpenChange={setRoleDeleteOpen} onConfirm={() => roleId && deleteRole.mutate(roleId, { onSuccess: () => setRoleDeleteOpen(false) })} />
    </section>
  )
}