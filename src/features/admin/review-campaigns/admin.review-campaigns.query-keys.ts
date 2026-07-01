import type { AdminReviewCampaignsParams } from './admin.review-campaigns.types'

export const adminReviewCampaignsKeys = {
  all: ['admin', 'review-campaigns'] as const,
  lists: () => [...adminReviewCampaignsKeys.all, 'list'] as const,
  list: (params: AdminReviewCampaignsParams) => [...adminReviewCampaignsKeys.lists(), params] as const,
  details: () => [...adminReviewCampaignsKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminReviewCampaignsKeys.details(), id] as const,
}
