import { api } from '@/services/api'
import { buildListParams } from '@/lib/build-list-params'
import type {
  AdminOrganizationsParams,
  AdminOrganizationsResponse,
  AdminOrganizationDetailResponse,
  OrganizationCreateRequest,
  CreateOrganizationResponse,
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
  return buildListParams(params)
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

  async createOrganization(body: OrganizationCreateRequest): Promise<CreateOrganizationResponse> {
    const response = await api.post<CreateOrganizationResponse>(ENDPOINTS.ORGANIZATIONS, body, { successMessageKey: 'created' })
    return response.data
  },

  async updateOrganization(organizationId: string, body: OrganizationUpdateRequest): Promise<UpdateOrganizationResponse> {
    const response = await api.patch<UpdateOrganizationResponse>(ENDPOINTS.ORGANIZATION(organizationId), body, { successMessageKey: 'updated' })
    return response.data
  },

  async toggleOrganizationStatus(organizationId: string, body: OrganizationStatusToggleRequest): Promise<ToggleOrganizationStatusResponse> {
    const response = await api.patch<ToggleOrganizationStatusResponse>(ENDPOINTS.ORGANIZATION_STATUS(organizationId), body, { successMessageKey: 'statusUpdated' })
    return response.data
  },

  async toggleOrganizationVerification(organizationId: string, body: OrganizationVerificationToggleRequest): Promise<ToggleOrganizationVerificationResponse> {
    const response = await api.patch<ToggleOrganizationVerificationResponse>(ENDPOINTS.ORGANIZATION_VERIFICATION(organizationId), body, { successMessageKey: 'statusUpdated' })
    return response.data
  },

  async acceptOrganization(organizationId: string): Promise<AcceptOrganizationResponse> {
    const response = await api.post<AcceptOrganizationResponse>(ENDPOINTS.ORGANIZATION_ACCEPT(organizationId), undefined, { successMessageKey: 'accepted' })
    return response.data
  },

  async deleteOrganization(organizationId: string): Promise<DeleteOrganizationResponse> {
    const response = await api.delete<DeleteOrganizationResponse>(ENDPOINTS.ORGANIZATION(organizationId), { successMessageKey: 'deleted' })
    return response.data
  },
}
