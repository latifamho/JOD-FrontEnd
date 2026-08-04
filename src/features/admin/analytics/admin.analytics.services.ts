import { api } from '@/services/api'
import type {
  AdminAnalyticsKpisResponse,
  AdminAnalyticsParams,
  AdminAnalyticsWeeklyResponse,
} from './admin.analytics.types'
import { buildApiParams } from '@/lib/build-api-params'

const ENDPOINTS = {
  KPIS: '/admin/analytics/kpis',
  WEEKLY: '/admin/analytics/weekly',
} as const

export const adminAnalyticsServices = {
  async getKpis(params: AdminAnalyticsParams): Promise<AdminAnalyticsKpisResponse> {
    const response = await api.get<AdminAnalyticsKpisResponse>(ENDPOINTS.KPIS, {
      params: buildApiParams(params),
    })
    return response.data
  },

  async getWeekly(params: AdminAnalyticsParams): Promise<AdminAnalyticsWeeklyResponse> {
    const response = await api.get<AdminAnalyticsWeeklyResponse>(ENDPOINTS.WEEKLY, {
      params: buildApiParams(params),
    })
    return response.data
  },
}
