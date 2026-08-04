import { api } from '@/services/api'
import { buildApiParams } from '@/lib/build-api-params'
import type {
  AdminReviewCampaignsParams,
  AdminReviewCampaignsResponse,
  AdminReviewCampaignDetailResponse,
  ApproveReviewCampaignRequest,
  ApproveReviewCampaignResponse,
  RejectReviewCampaignRequest,
  RejectReviewCampaignResponse,
} from './admin.review-campaigns.types'

const ENDPOINTS = {
  CAMPAIGNS: '/admin/review/campaigns',
  CAMPAIGN: (id: string) => `/admin/review/campaigns/${id}`,
  CAMPAIGN_APPROVE: (id: string) => `/admin/review/campaigns/${id}/approve`,
  CAMPAIGN_REJECT: (id: string) => `/admin/review/campaigns/${id}/reject`,
} as const

export const adminReviewCampaignsServices = {
  async getReviewCampaigns(params: AdminReviewCampaignsParams): Promise<AdminReviewCampaignsResponse> {
    const response = await api.get<AdminReviewCampaignsResponse>(ENDPOINTS.CAMPAIGNS, {
      params: buildApiParams(params),
    })
    return response.data
  },

  async getReviewCampaignById(campaignId: string): Promise<AdminReviewCampaignDetailResponse> {
    const response = await api.get<AdminReviewCampaignDetailResponse>(ENDPOINTS.CAMPAIGN(campaignId))
    return response.data
  },

  async approveCampaign(campaignId: string, body: ApproveReviewCampaignRequest = {}): Promise<ApproveReviewCampaignResponse> {
    const response = await api.post<ApproveReviewCampaignResponse>(ENDPOINTS.CAMPAIGN_APPROVE(campaignId), body, { successMessageKey: 'approved' })
    return response.data
  },

  async rejectCampaign(campaignId: string, body: RejectReviewCampaignRequest): Promise<RejectReviewCampaignResponse> {
    const response = await api.post<RejectReviewCampaignResponse>(ENDPOINTS.CAMPAIGN_REJECT(campaignId), body, { successMessageKey: 'rejected' })
    return response.data
  },
}
