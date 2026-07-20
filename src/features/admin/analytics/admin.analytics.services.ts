import { api } from '@/services/api'
import type {
  AdminAnalyticsKpisResponse,
  AdminAnalyticsParams,
  AdminAnalyticsWeeklyResponse,
} from './admin.analytics.types'

const ENDPOINTS = {
  KPIS: '/admin/analytics/kpis',
  WEEKLY: '/admin/analytics/weekly',
} as const

function buildParams(params: AdminAnalyticsParams): Record<string, unknown> {
  const flat: Record<string, unknown> = {}
  if (params.range) flat.range = params.range
  return flat
}

export const adminAnalyticsServices = {
  async getKpis(params: AdminAnalyticsParams): Promise<AdminAnalyticsKpisResponse> {
    const response = await api.get<AdminAnalyticsKpisResponse>(ENDPOINTS.KPIS, {
      params: buildParams(params),
    })
    return response.data
  },

  async getWeekly(params: AdminAnalyticsParams): Promise<AdminAnalyticsWeeklyResponse> {
    const response = await api.get<AdminAnalyticsWeeklyResponse>(ENDPOINTS.WEEKLY, {
      params: buildParams(params),
    })
    return response.data
  },
}
