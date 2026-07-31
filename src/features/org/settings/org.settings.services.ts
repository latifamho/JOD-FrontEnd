import { api } from '@/services/api'
import type { OrganizationBankAccount, OrganizationBankAccountResponse, OrganizationProfile, OrganizationProfileResponse } from './org.settings.types'

export const orgSettingsServices = {
  async getProfile(): Promise<OrganizationProfileResponse> {
    const response = await api.get<OrganizationProfileResponse>('/org/settings/profile')
    return response.data
  },
  async updateProfile(body: Pick<OrganizationProfile, 'name' | 'email' | 'phone'>): Promise<OrganizationProfileResponse> {
    const response = await api.patch<OrganizationProfileResponse>('/org/settings/profile', body)
    return response.data
  },
  async getBankAccount(): Promise<OrganizationBankAccountResponse> {
    const response = await api.get<OrganizationBankAccountResponse>('/org/settings/bank-account')
    return response.data
  },
  async updateBankAccount(body: OrganizationBankAccount): Promise<OrganizationBankAccountResponse> {
    const response = await api.patch<OrganizationBankAccountResponse>('/org/settings/bank-account', body)
    return response.data
  },
}
