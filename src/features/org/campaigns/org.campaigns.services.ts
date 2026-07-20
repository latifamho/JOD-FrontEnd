import { api } from '@/services/api'
import { buildListParams } from '@/lib/build-list-params'
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
} from './org.campaigns.types'

const ENDPOINTS = {
  CAMPAIGNS: '/org/campaigns',
  CAMPAIGN: (id: string) => `/org/campaigns/${id}`,
  CAMPAIGN_CLOSE: (id: string) => `/org/campaigns/${id}/close`,
} as const

function buildParams(params: OrgCampaignsParams): Record<string, unknown> {
  return buildListParams(params)
}

export const orgCampaignsServices = {
  async getCampaigns(params: OrgCampaignsParams): Promise<OrgCampaignsResponse> {
    const response = await api.get<OrgCampaignsResponse>(ENDPOINTS.CAMPAIGNS, {
      params: buildParams(params),
    })
    return response.data
  },

  async getCampaignById(campaignId: string): Promise<OrgCampaignDetailResponse> {
    const response = await api.get<OrgCampaignDetailResponse>(ENDPOINTS.CAMPAIGN(campaignId))
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
    const response = await api.post<CloseCampaignResponse>(ENDPOINTS.CAMPAIGN_CLOSE(campaignId), body)
    return response.data
  },

  async deleteCampaign(campaignId: string): Promise<DeleteCampaignResponse> {
    const response = await api.delete<DeleteCampaignResponse>(ENDPOINTS.CAMPAIGN(campaignId))
    return response.data
  },
}
