import { api } from '@/services/api'
import type { AdminOverviewResponse } from './admin.dash.types'

const END_POINTS = {
  OVERVIEW: '/admin/overview',
} as const

export const adminDashServices = {
  async getOverview(): Promise<AdminOverviewResponse> {
    const response = await api.get<AdminOverviewResponse>(END_POINTS.OVERVIEW)
    return response.data
  },
}
