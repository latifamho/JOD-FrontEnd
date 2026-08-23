import { api } from '@/services/api'
import { buildApiParams } from '@/lib/build-api-params'
import type {
  OrgCampaignsParams,
  OrgCampaignsResponse,
  OrgCampaignDetailResponse,
  CampaignCreateRequest,
  CreateCampaignResponse,
  CampaignUpdateRequest,
  UpdateCampaignResponse,
  CloseCampaignRequest,
  CloseCampaignResponse,
  DeleteCampaignResponse,
  OrgCampaignBriefResponse,
} from './org.campaigns.types'

const ENDPOINTS = {
  CAMPAIGNS: '/org/campaigns',
  CAMPAIGN: (id: string) => `/org/campaigns/${id}`,
  BRIEF: '/org/campaigns/brief',
} as const

export const orgCampaignsServices = {
  async getCampaigns(params: OrgCampaignsParams): Promise<OrgCampaignsResponse> {
    const response = await api.get<OrgCampaignsResponse>(ENDPOINTS.CAMPAIGNS, {
      params: buildApiParams(params),
    })
    return response.data
  },

  async getCampaignById(campaignId: string): Promise<OrgCampaignDetailResponse> {
    const response = await api.get<OrgCampaignDetailResponse>(ENDPOINTS.CAMPAIGN(campaignId))
    return response.data
  },

  async getCampaignsBrief(): Promise<OrgCampaignBriefResponse> {
    const response = await api.get<OrgCampaignBriefResponse>(ENDPOINTS.BRIEF)
    return response.data
  },

  async createCampaign(body: CampaignCreateRequest): Promise<CreateCampaignResponse> {
    const response = await api.post<CreateCampaignResponse>(ENDPOINTS.CAMPAIGNS, body)
    return response.data
  },

  async updateCampaign(campaignId: string, body: CampaignUpdateRequest): Promise<UpdateCampaignResponse> {
    const response = await api.patch<UpdateCampaignResponse>(ENDPOINTS.CAMPAIGN(campaignId), body)
    return response.data
  },

  async closeCampaign(campaignId: string, body: CloseCampaignRequest): Promise<CloseCampaignResponse> {
    const response = await api.patch<CloseCampaignResponse>(ENDPOINTS.CAMPAIGN(campaignId), {
      status: 'closed',
      closedReason: body.reason,
    })
    return response.data
  },

  async deleteCampaign(campaignId: string): Promise<DeleteCampaignResponse> {
    const response = await api.delete<DeleteCampaignResponse>(ENDPOINTS.CAMPAIGN(campaignId))
    return response.data
  },
}
