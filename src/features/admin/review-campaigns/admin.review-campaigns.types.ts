import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'
import type { ModerationStatus } from '@/components/shared'
import type { ReviewCampaignCategory, ReviewCampaignItem } from '@/components/pages/campaigns-review/campaigns-review.types'

export interface AdminReviewCampaignsFilter {
  status?: ModerationStatus
  category?: ReviewCampaignCategory
  organizationId?: string
}

export interface AdminReviewCampaignsParams {
  page?: number
  perPage?: number
  sort?: string
  filter?: AdminReviewCampaignsFilter
}

export interface ApproveReviewCampaignRequest {
  note?: string
}

export interface RejectReviewCampaignRequest {
  reason: string
}

export type AdminReviewCampaignsResponse = ApiListResponse<ReviewCampaignItem>
export type AdminReviewCampaignDetailResponse = ApiSingleResponse<ReviewCampaignItem>
export type ApproveReviewCampaignResponse = ApiMutationResponse
export type RejectReviewCampaignResponse = ApiMutationResponse
