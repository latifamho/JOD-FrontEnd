import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'

export interface StaffMemberItem {
  id: string
  name: string
  email: string
  phone: string | null
  roleId: string
  role: string
  status: 'invited' | 'active' | 'inactive'
  invitedAt: string | null
  acceptedAt: string | null
}

export interface StaffRoleItem {
  id: string
  role: string
  description: string | null
  permissions: string[]
  updatedAt: string | null
  isActive: boolean
  isSystem: boolean
  membersCount: number
}

export interface OrgPermissionCatalogItem {
  id: string
  name: string
  label: string
  description: string
  group: string
  action: string
  requires: string[]
}

export interface OrgStaffFilter { role?: string; status?: StaffMemberItem['status'] }
export interface OrgStaffParams { page?: number; perPage?: number; sort?: string; filter?: OrgStaffFilter }
export interface OrgRolesFilter { status?: 'active' | 'inactive' }
export interface OrgRolesParams { page?: number; perPage?: number; sort?: string; filter?: OrgRolesFilter }

export interface StaffCreateRequest { name: string; email: string; phone?: string | null; organizationRoleId: string }
export interface StaffUpdateRequest { organizationRoleId?: string; status?: StaffMemberItem['status'] }
export interface RoleCreateRequest { name: string; description: string; permissions: string[]; isActive: boolean }
export interface RoleUpdateRequest { name: string; description?: string; permissions: string[]; isActive: boolean }

export type OrgStaffResponse = ApiListResponse<StaffMemberItem>
export type OrgStaffDetailResponse = ApiSingleResponse<StaffMemberItem>
export type CreateStaffResponse = ApiMutationResponse<StaffMemberItem>
export type UpdateStaffResponse = ApiMutationResponse<StaffMemberItem>
export type DeleteStaffResponse = void
export type OrgRolesResponse = ApiListResponse<StaffRoleItem>
export type OrgRoleDetailResponse = ApiSingleResponse<StaffRoleItem>
export type CreateRoleResponse = ApiMutationResponse<StaffRoleItem>
export type UpdateRoleResponse = ApiMutationResponse<StaffRoleItem>
export type DeleteRoleResponse = void
export type OrgPermissionsCatalogResponse = { data: OrgPermissionCatalogItem[] }