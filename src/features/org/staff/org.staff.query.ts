'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { orgStaffServices } from './org.staff.services'
import { orgStaffKeys, orgRolesKeys } from './org.staff.query-keys'
import type {
  OrgStaffParams,
  StaffCreateRequest,
  StaffUpdateRequest,
  OrgRolesParams,
  RoleCreateRequest,
  RoleUpdateRequest,
} from './org.staff.types'

export function useOrgStaff(params: OrgStaffParams) {
  return useQuery({
    queryKey: orgStaffKeys.list(params),
    queryFn: () => orgStaffServices.getStaff(params),
  })
}

export function useCreateOrgStaff() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: StaffCreateRequest) => orgStaffServices.createStaff(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgStaffKeys.lists() })
    },
  })
}

export function useUpdateOrgStaff() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ staffId, body }: { staffId: string; body: StaffUpdateRequest }) =>
      orgStaffServices.updateStaff(staffId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgStaffKeys.lists() })
    },
  })
}

export function useDeleteOrgStaff() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (staffId: string) => orgStaffServices.deleteStaff(staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgStaffKeys.lists() })
    },
  })
}

export function useOrgRoles(params: OrgRolesParams) {
  return useQuery({
    queryKey: orgRolesKeys.list(params),
    queryFn: () => orgStaffServices.getRoles(params),
  })
}

export function useCreateOrgRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: RoleCreateRequest) => orgStaffServices.createRole(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgRolesKeys.lists() })
    },
  })
}

export function useUpdateOrgRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ roleId, body }: { roleId: string; body: RoleUpdateRequest }) =>
      orgStaffServices.updateRole(roleId, body),
    onSuccess: (_data, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: orgRolesKeys.lists() })
      queryClient.invalidateQueries({ queryKey: orgRolesKeys.detail(roleId) })
    },
  })
}

export function useDeleteOrgRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (roleId: string) => orgStaffServices.deleteRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgRolesKeys.lists() })
    },
  })
}

export function useOrgPermissionsCatalog() {
  return useQuery({
    queryKey: orgRolesKeys.catalog(),
    queryFn: () => orgStaffServices.getPermissionsCatalog(),
    staleTime: Infinity,
  })
}
