import { api } from '@/services/api'
import type {
  OrgStaffParams,
  OrgStaffResponse,
  OrgStaffDetailResponse,
  StaffCreateRequest,
  CreateStaffResponse,
  StaffUpdateRequest,
  UpdateStaffResponse,
  DeleteStaffResponse,
  OrgRolesParams,
  OrgRolesResponse,
  OrgRoleDetailResponse,
  RoleCreateRequest,
  CreateRoleResponse,
  RoleUpdateRequest,
  UpdateRoleResponse,
  DeleteRoleResponse,
  OrgPermissionsCatalogResponse,
} from './org.staff.types'

const ENDPOINTS = {
  STAFF: '/org/staff',
  STAFF_MEMBER: (id: string) => `/org/staff/${id}`,
  ROLES: '/org/roles',
  ROLE: (id: string) => `/org/roles/${id}`,
  PERMISSIONS_CATALOG: '/org/permissions/catalog',
} as const

function buildParams(params: OrgStaffParams | OrgRolesParams): Record<string, unknown> {
  const flat: Record<string, unknown> = {}
  if (params.page !== undefined) flat.page = params.page
  if (params.perPage !== undefined) flat.perPage = params.perPage
  if (params.sort) flat.sort = params.sort
  if (params.filter) {
    for (const [key, value] of Object.entries(params.filter)) {
      if (value !== undefined && value !== '') flat[`filter.${key}`] = value
    }
  }
  return flat
}

export const orgStaffServices = {
  async getStaff(params: OrgStaffParams): Promise<OrgStaffResponse> {
    const response = await api.get<OrgStaffResponse>(ENDPOINTS.STAFF, {
      params: buildParams(params),
    })
    return response.data
  },

  async getStaffById(staffId: string): Promise<OrgStaffDetailResponse> {
    const response = await api.get<OrgStaffDetailResponse>(ENDPOINTS.STAFF_MEMBER(staffId))
    return response.data
  },

  async createStaff(body: StaffCreateRequest): Promise<CreateStaffResponse> {
    const response = await api.post<CreateStaffResponse>(ENDPOINTS.STAFF, body)
    return response.data
  },

  async updateStaff(staffId: string, body: StaffUpdateRequest): Promise<UpdateStaffResponse> {
    const response = await api.patch<UpdateStaffResponse>(ENDPOINTS.STAFF_MEMBER(staffId), body)
    return response.data
  },

  async deleteStaff(staffId: string): Promise<DeleteStaffResponse> {
    const response = await api.delete<DeleteStaffResponse>(ENDPOINTS.STAFF_MEMBER(staffId))
    return response.data
  },

  async getRoles(params: OrgRolesParams): Promise<OrgRolesResponse> {
    const response = await api.get<OrgRolesResponse>(ENDPOINTS.ROLES, {
      params: buildParams(params),
    })
    return response.data
  },

  async getRoleById(roleId: string): Promise<OrgRoleDetailResponse> {
    const response = await api.get<OrgRoleDetailResponse>(ENDPOINTS.ROLE(roleId))
    return response.data
  },

  async createRole(body: RoleCreateRequest): Promise<CreateRoleResponse> {
    const response = await api.post<CreateRoleResponse>(ENDPOINTS.ROLES, body)
    return response.data
  },

  async updateRole(roleId: string, body: RoleUpdateRequest): Promise<UpdateRoleResponse> {
    const response = await api.patch<UpdateRoleResponse>(ENDPOINTS.ROLE(roleId), body)
    return response.data
  },

  async deleteRole(roleId: string): Promise<DeleteRoleResponse> {
    const response = await api.delete<DeleteRoleResponse>(ENDPOINTS.ROLE(roleId))
    return response.data
  },

  async getPermissionsCatalog(): Promise<OrgPermissionsCatalogResponse> {
    const response = await api.get<OrgPermissionsCatalogResponse>(ENDPOINTS.PERMISSIONS_CATALOG)
    return response.data
  },
}
