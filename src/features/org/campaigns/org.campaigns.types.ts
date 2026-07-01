import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'
import type {
  OrganizationCampaignCategory,
  OrganizationCampaignItem,
  OrganizationCampaignStatus,
} from '@/components/pages/organization-campaigns/static-data'

export interface OrgCampaignsFilter {
  status?: OrganizationCampaignStatus
  category?: OrganizationCampaignCategory
  location?: string
}

export interface OrgCampaignsParams {
  page?: number
  perPage?: number
  sort?: string
  filter?: OrgCampaignsFilter
}

export interface CampaignCreateRequest {
  title: string
  summary: string
  category: OrganizationCampaignCategory
  status: OrganizationCampaignStatus
  location: string
  goalAmount: number
  beneficiariesCount: number
  startDate: string
  endDate: string
}

export interface CampaignUpdateRequest {
  title?: string
  summary?: string
  category?: OrganizationCampaignCategory
  status?: OrganizationCampaignStatus
  location?: string
  goalAmount?: number
  beneficiariesCount?: number
  startDate?: string
  endDate?: string
}

export interface CloseCampaignRequest {
  reason: string
}

export type OrgCampaignsResponse = ApiListResponse<OrganizationCampaignItem>
export type OrgCampaignDetailResponse = ApiSingleResponse<OrganizationCampaignItem>
export type CreateCampaignResponse = ApiMutationResponse<OrganizationCampaignItem>
export type UpdateCampaignResponse = ApiMutationResponse<OrganizationCampaignItem>
export type CloseCampaignResponse = ApiMutationResponse
export type DeleteCampaignResponse = ApiMutationResponse
