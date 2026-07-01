import { api } from '@/services/api'
import type {
  AdminOrganizationsParams,
  AdminOrganizationsResponse,
  AdminOrganizationDetailResponse,
  OrganizationUpdateRequest,
  UpdateOrganizationResponse,
  OrganizationStatusToggleRequest,
  ToggleOrganizationStatusResponse,
  OrganizationVerificationToggleRequest,
  ToggleOrganizationVerificationResponse,
  AcceptOrganizationResponse,
  DeleteOrganizationResponse,
} from './admin.organizations.types'

const ENDPOINTS = {
  ORGANIZATIONS: '/admin/organizations',
  ORGANIZATION: (id: string) => `/admin/organizations/${id}`,
  ORGANIZATION_STATUS: (id: string) => `/admin/organizations/${id}/status`,
  ORGANIZATION_VERIFICATION: (id: string) => `/admin/organizations/${id}/verification`,
  ORGANIZATION_ACCEPT: (id: string) => `/admin/organizations/${id}/accept`,
} as const

function buildParams(params: AdminOrganizationsParams): Record<string, unknown> {
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

export const adminOrganizationsServices = {
  async getOrganizations(params: AdminOrganizationsParams): Promise<AdminOrganizationsResponse> {
    const response = await api.get<AdminOrganizationsResponse>(ENDPOINTS.ORGANIZATIONS, {
      params: buildParams(params),
    })
    return response.data
  },

  async getOrganizationById(organizationId: string): Promise<AdminOrganizationDetailResponse> {
    const response = await api.get<AdminOrganizationDetailResponse>(ENDPOINTS.ORGANIZATION(organizationId))
    return response.data
  },

  async updateOrganization(organizationId: string, body: OrganizationUpdateRequest): Promise<UpdateOrganizationResponse> {
    const response = await api.patch<UpdateOrganizationResponse>(ENDPOINTS.ORGANIZATION(organizationId), body)
    return response.data
  },

  async toggleOrganizationStatus(organizationId: string, body: OrganizationStatusToggleRequest): Promise<ToggleOrganizationStatusResponse> {
    const response = await api.patch<ToggleOrganizationStatusResponse>(ENDPOINTS.ORGANIZATION_STATUS(organizationId), body)
    return response.data
  },

  async toggleOrganizationVerification(organizationId: string, body: OrganizationVerificationToggleRequest): Promise<ToggleOrganizationVerificationResponse> {
    const response = await api.patch<ToggleOrganizationVerificationResponse>(ENDPOINTS.ORGANIZATION_VERIFICATION(organizationId), body)
    return response.data
  },

  async acceptOrganization(organizationId: string): Promise<AcceptOrganizationResponse> {
    const response = await api.post<AcceptOrganizationResponse>(ENDPOINTS.ORGANIZATION_ACCEPT(organizationId))
    return response.data
  },

  async deleteOrganization(organizationId: string): Promise<DeleteOrganizationResponse> {
    const response = await api.delete<DeleteOrganizationResponse>(ENDPOINTS.ORGANIZATION(organizationId))
    return response.data
  },
}
