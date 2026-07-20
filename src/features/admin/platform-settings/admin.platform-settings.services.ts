import { api } from '@/services/api'
import type {
  PlatformSettingsResponse,
  PlatformSettingsUpdateRequest,
} from './admin.platform-settings.types'

const ENDPOINTS = {
  PLATFORM_SETTINGS: '/admin/platform-settings',
} as const

export const adminPlatformSettingsServices = {
  async getPlatformSettings(): Promise<PlatformSettingsResponse> {
    const response = await api.get<PlatformSettingsResponse>(ENDPOINTS.PLATFORM_SETTINGS)
    return response.data
  },

  async updatePlatformSettings(
    body: PlatformSettingsUpdateRequest,
  ): Promise<PlatformSettingsResponse> {
    const response = await api.patch<PlatformSettingsResponse>(ENDPOINTS.PLATFORM_SETTINGS, body)
    return response.data
  },
}
