'use client'

import { useQuery } from '@tanstack/react-query'
import { orgAnalyticsServices } from './org.analytics.services'
import type { OrgAnalyticsFilters } from './org.analytics.types'

export function useOrgRecommendationAnalytics(params: OrgAnalyticsFilters) {
  return useQuery({ queryKey: ['org', 'analytics', 'recommendations', params], queryFn: () => orgAnalyticsServices.recommendations(params) })
}
export function useOrgContentPerformance(params: OrgAnalyticsFilters) {
  return useQuery({ queryKey: ['org', 'analytics', 'content', params], queryFn: () => orgAnalyticsServices.content(params) })
}
