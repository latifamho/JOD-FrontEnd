import type { ApiSingleResponse } from '@/types/api.types'

export interface PlatformSettings {
  siteName: string
  allowNewPosts: boolean
  requirePostReview: boolean
}

export type PlatformSettingsUpdateRequest = Partial<PlatformSettings>

export type PlatformSettingsResponse = ApiSingleResponse<PlatformSettings>
