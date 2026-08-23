import { api } from '@/services/api'
import type {
  OrganizationPasswordUpdateRequest,
  OrganizationPasswordUpdateResponse,
  OrganizationProfileResponse,
  OrganizationProfileUpdateRequest,
} from './org.settings.types'

export const orgSettingsServices = {
  async getProfile(): Promise<OrganizationProfileResponse> {
    const response = await api.get<OrganizationProfileResponse>('/org/settings/profile')
    return response.data
  },
  async updateProfile(body: OrganizationProfileUpdateRequest): Promise<OrganizationProfileResponse> {
    const response = await api.patch<OrganizationProfileResponse>('/org/settings/profile', body)
    return response.data
  },
  async updatePassword(body: OrganizationPasswordUpdateRequest): Promise<OrganizationPasswordUpdateResponse> {
    const response = await api.patch<OrganizationPasswordUpdateResponse>('/org/settings/password', body)
    return response.data
  },
}
