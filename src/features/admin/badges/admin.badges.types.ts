import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'
import type { BadgeItem, RewardIconName } from '@/components/pages/rewards-management/rewards-management.types'

export interface AdminBadgesFilter {
  isActive?: boolean
  search?: string
}

export interface AdminBadgesParams {
  page?: number
  perPage?: number
  sort?: string
  filter?: AdminBadgesFilter
}

export interface BadgeCreateRequest {
  name: string
  description: string
  criteria: string
  iconName: RewardIconName
  isActive: boolean
}

export interface BadgeUpdateRequest {
  name?: string
  description?: string
  criteria?: string
  iconName?: RewardIconName
  isActive?: boolean
}

export interface BadgeStatusToggleRequest {
  isActive: boolean
}

export type AdminBadgesResponse = ApiListResponse<BadgeItem>
export type AdminBadgeDetailResponse = ApiSingleResponse<BadgeItem>
export type CreateBadgeResponse = ApiMutationResponse<BadgeItem>
export type UpdateBadgeResponse = ApiMutationResponse<BadgeItem>
export type ToggleBadgeStatusResponse = ApiMutationResponse
export type DeleteBadgeResponse = ApiMutationResponse
