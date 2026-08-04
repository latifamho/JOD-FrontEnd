import { api } from '@/services/api'
import { buildApiParams } from '@/lib/build-api-params'
import type {
  AdminBadgesParams,
  AdminBadgesResponse,
  AdminBadgeDetailResponse,
  BadgeCreateRequest,
  CreateBadgeResponse,
  BadgeUpdateRequest,
  UpdateBadgeResponse,
  BadgeStatusToggleRequest,
  ToggleBadgeStatusResponse,
  DeleteBadgeResponse,
} from './admin.badges.types'

const ENDPOINTS = {
  BADGES: '/admin/badges',
  BADGE: (id: string) => `/admin/badges/${id}`,
  BADGE_STATUS: (id: string) => `/admin/badges/${id}/status`,
} as const

export const adminBadgesServices = {
  async getBadges(params: AdminBadgesParams): Promise<AdminBadgesResponse> {
    const response = await api.get<AdminBadgesResponse>(ENDPOINTS.BADGES, {
      params: buildApiParams(params),
    })
    return response.data
  },

  async getBadgeById(badgeId: string): Promise<AdminBadgeDetailResponse> {
    const response = await api.get<AdminBadgeDetailResponse>(ENDPOINTS.BADGE(badgeId))
    return response.data
  },

  async createBadge(body: BadgeCreateRequest): Promise<CreateBadgeResponse> {
    const response = await api.post<CreateBadgeResponse>(ENDPOINTS.BADGES, body, { successMessageKey: 'created' })
    return response.data
  },

  async updateBadge(badgeId: string, body: BadgeUpdateRequest): Promise<UpdateBadgeResponse> {
    const response = await api.patch<UpdateBadgeResponse>(ENDPOINTS.BADGE(badgeId), body, { successMessageKey: 'updated' })
    return response.data
  },

  async toggleBadgeStatus(badgeId: string, body: BadgeStatusToggleRequest): Promise<ToggleBadgeStatusResponse> {
    const response = await api.patch<ToggleBadgeStatusResponse>(ENDPOINTS.BADGE_STATUS(badgeId), body, { successMessageKey: 'statusUpdated' })
    return response.data
  },

  async deleteBadge(badgeId: string): Promise<DeleteBadgeResponse> {
    const response = await api.delete<DeleteBadgeResponse>(ENDPOINTS.BADGE(badgeId), { successMessageKey: 'deleted' })
    return response.data
  },
}
