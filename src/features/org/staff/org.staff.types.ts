import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'
import type { StaffMemberItem, StaffRole, StaffRoleItem } from '@/components/pages/staff-management/static-data'

export interface OrgStaffFilter {
  role?: StaffRole
}

export interface OrgStaffParams {
  page?: number
  perPage?: number
  sort?: string
  filter?: OrgStaffFilter
}

export interface OrgRolesFilter {
  status?: 'active' | 'inactive'
}

export interface OrgRolesParams {
  page?: number
  perPage?: number
  sort?: string
  filter?: OrgRolesFilter
}

export interface StaffCreateRequest {
  name: string
  email: string
  role: StaffRole
}

export interface StaffUpdateRequest {
  role: StaffRole
}

export interface RoleCreateRequest {
  role: string
  description: string
  permissions: string[]
  isActive: boolean
}

export interface RoleUpdateRequest {
  description?: string
  permissions?: string[]
  isActive?: boolean
}

export type OrgStaffResponse = ApiListResponse<StaffMemberItem>
export type OrgStaffDetailResponse = ApiSingleResponse<StaffMemberItem>
export type CreateStaffResponse = ApiMutationResponse<StaffMemberItem>
export type UpdateStaffResponse = ApiMutationResponse<StaffMemberItem>
export type DeleteStaffResponse = ApiMutationResponse

export type OrgRolesResponse = ApiListResponse<StaffRoleItem>
export type OrgRoleDetailResponse = ApiSingleResponse<StaffRoleItem>
export type CreateRoleResponse = ApiMutationResponse<StaffRoleItem>
export type UpdateRoleResponse = ApiMutationResponse<StaffRoleItem>
export type DeleteRoleResponse = ApiMutationResponse

export type OrgPermissionsCatalogResponse = { data: { permissions: string[] } }
