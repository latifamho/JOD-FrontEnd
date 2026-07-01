'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { orgCampaignsServices } from './org.campaigns.services'
import { orgCampaignsKeys } from './org.campaigns.query-keys'
import type {
  OrgCampaignsParams,
  CampaignCreateRequest,
  CampaignUpdateRequest,
  CloseCampaignRequest,
} from './org.campaigns.types'

export function useOrgCampaigns(params: OrgCampaignsParams) {
  return useQuery({
    queryKey: orgCampaignsKeys.list(params),
    queryFn: () => orgCampaignsServices.getCampaigns(params),
  })
}

export function useCreateOrgCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CampaignCreateRequest) => orgCampaignsServices.createCampaign(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgCampaignsKeys.lists() })
    },
  })
}

export function useUpdateOrgCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ campaignId, body }: { campaignId: string; body: CampaignUpdateRequest }) =>
      orgCampaignsServices.updateCampaign(campaignId, body),
    onSuccess: (_data, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: orgCampaignsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: orgCampaignsKeys.detail(campaignId) })
    },
  })
}

export function useCloseOrgCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ campaignId, body }: { campaignId: string; body: CloseCampaignRequest }) =>
      orgCampaignsServices.closeCampaign(campaignId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgCampaignsKeys.lists() })
    },
  })
}

export function useDeleteOrgCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (campaignId: string) => orgCampaignsServices.deleteCampaign(campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgCampaignsKeys.lists() })
    },
  })
}
