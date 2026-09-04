import { api } from '@/services/api'
import type { OrgAnalyticsFilters, OrgContentPerformanceResponse, OrgRecommendationAnalyticsResponse } from './org.analytics.types'

export const orgAnalyticsServices = {
  async recommendations(params: OrgAnalyticsFilters): Promise<OrgRecommendationAnalyticsResponse> {
    return (await api.get<OrgRecommendationAnalyticsResponse>('/org/analytics/recommendations', { params })).data
  },
  async content(params: OrgAnalyticsFilters): Promise<OrgContentPerformanceResponse> {
    return (await api.get<OrgContentPerformanceResponse>('/org/analytics/content', { params })).data
  },
}
