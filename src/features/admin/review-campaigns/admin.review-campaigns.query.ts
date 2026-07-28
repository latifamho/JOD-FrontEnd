'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { adminReviewCampaignsServices } from './admin.review-campaigns.services'
import { adminReviewCampaignsKeys } from './admin.review-campaigns.query-keys'
import type {
  AdminReviewCampaignsParams,
  ApproveReviewCampaignRequest,
  RejectReviewCampaignRequest,
} from './admin.review-campaigns.types'

export function useAdminReviewCampaigns(params: AdminReviewCampaignsParams) {
  return useQuery({
    queryKey: adminReviewCampaignsKeys.list(params),
    queryFn: () => adminReviewCampaignsServices.getReviewCampaigns(params),
  })
}

export function useAdminReviewCampaignDetail(campaignId: string | null) {
  return useQuery({
    queryKey: adminReviewCampaignsKeys.detail(campaignId ?? ''),
    queryFn: () => adminReviewCampaignsServices.getReviewCampaignById(campaignId!),
    enabled: Boolean(campaignId),
  })
}

export function useApproveReviewCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ campaignId, body }: { campaignId: string; body?: ApproveReviewCampaignRequest }) =>
      adminReviewCampaignsServices.approveCampaign(campaignId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminReviewCampaignsKeys.lists() })
    },
  })
}

export function useRejectReviewCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ campaignId, body }: { campaignId: string; body: RejectReviewCampaignRequest }) =>
      adminReviewCampaignsServices.rejectCampaign(campaignId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminReviewCampaignsKeys.lists() })
    },
  })
}
