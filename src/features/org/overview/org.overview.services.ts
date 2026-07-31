import { api } from '@/services/api'
import type { OrganizationOverviewResponse } from './org.overview.types'

export const orgOverviewServices = {
  async getOverview(): Promise<OrganizationOverviewResponse> {
    const response = await api.get<OrganizationOverviewResponse>('/org/dashboard/overview')
    return response.data
  },
}