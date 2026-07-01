import { api } from '@/services/api'
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

function buildParams(params: AdminReviewCampaignsParams): Record<string, unknown> {
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

export const adminReviewCampaignsServices = {
  async getReviewCampaigns(params: AdminReviewCampaignsParams): Promise<AdminReviewCampaignsResponse> {
    const response = await api.get<AdminReviewCampaignsResponse>(ENDPOINTS.CAMPAIGNS, {
      params: buildParams(params),
    })
    return response.data
  },

  async getReviewCampaignById(campaignId: string): Promise<AdminReviewCampaignDetailResponse> {
    const response = await api.get<AdminReviewCampaignDetailResponse>(ENDPOINTS.CAMPAIGN(campaignId))
    return response.data
  },

  async approveCampaign(campaignId: string, body: ApproveReviewCampaignRequest = {}): Promise<ApproveReviewCampaignResponse> {
    const response = await api.post<ApproveReviewCampaignResponse>(ENDPOINTS.CAMPAIGN_APPROVE(campaignId), body)
    return response.data
  },

  async rejectCampaign(campaignId: string, body: RejectReviewCampaignRequest): Promise<RejectReviewCampaignResponse> {
    const response = await api.post<RejectReviewCampaignResponse>(ENDPOINTS.CAMPAIGN_REJECT(campaignId), body)
    return response.data
  },
}
