'use client'

import { useQuery } from '@tanstack/react-query'

import { adminAnalyticsServices } from './admin.analytics.services'
import { adminAnalyticsKeys } from './admin.analytics.query-keys'
import type { AdminAnalyticsParams } from './admin.analytics.types'

export function useAdminAnalyticsKpis(params: AdminAnalyticsParams) {
  return useQuery({
    queryKey: adminAnalyticsKeys.kpis(params),
    queryFn: () => adminAnalyticsServices.getKpis(params),
  })
}

export function useAdminAnalyticsWeekly(params: AdminAnalyticsParams) {
  return useQuery({
    queryKey: adminAnalyticsKeys.weekly(params),
    queryFn: () => adminAnalyticsServices.getWeekly(params),
  })
}
