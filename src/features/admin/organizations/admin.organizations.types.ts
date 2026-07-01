import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'
import type {
  AdminOrganizationItem,
  OrganizationStatus,
  OrganizationVerificationStatus,
} from '@/components/pages/organizations-management/static-data'

export interface AdminOrganizationsFilter {
  status?: OrganizationStatus
  verificationStatus?: OrganizationVerificationStatus
  location?: string
  search?: string
}

export interface AdminOrganizationsParams {
  page?: number
  perPage?: number
  sort?: string
  filter?: AdminOrganizationsFilter
}

export interface OrganizationUpdateRequest {
  name?: string
  email?: string
  phone?: string
  description?: string
}

export interface OrganizationStatusToggleRequest {
  status: OrganizationStatus
}

export interface OrganizationVerificationToggleRequest {
  verificationStatus: OrganizationVerificationStatus
}

export type AdminOrganizationsResponse = ApiListResponse<AdminOrganizationItem>
export type AdminOrganizationDetailResponse = ApiSingleResponse<AdminOrganizationItem>
export type UpdateOrganizationResponse = ApiMutationResponse<AdminOrganizationItem>
export type ToggleOrganizationStatusResponse = ApiMutationResponse
export type ToggleOrganizationVerificationResponse = ApiMutationResponse
export type AcceptOrganizationResponse = ApiMutationResponse
export type DeleteOrganizationResponse = ApiMutationResponse
