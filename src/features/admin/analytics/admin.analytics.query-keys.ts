import type { AdminAnalyticsParams } from './admin.analytics.types'

export const adminAnalyticsKeys = {
  all: ['admin', 'analytics'] as const,
  kpis: (params: AdminAnalyticsParams) => [...adminAnalyticsKeys.all, 'kpis', params] as const,
  weekly: (params: AdminAnalyticsParams) => [...adminAnalyticsKeys.all, 'weekly', params] as const,
}
