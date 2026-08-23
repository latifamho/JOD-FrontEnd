import type { OrgCampaignsParams } from './org.campaigns.types'

export const orgCampaignsKeys = {
  all: ['org', 'campaigns'] as const,
  lists: () => [...orgCampaignsKeys.all, 'list'] as const,
  list: (params: OrgCampaignsParams) => [...orgCampaignsKeys.lists(), params] as const,
  details: () => [...orgCampaignsKeys.all, 'detail'] as const,
  detail: (id: string) => [...orgCampaignsKeys.details(), id] as const,
  brief: () => [...orgCampaignsKeys.all, 'brief'] as const,
}
