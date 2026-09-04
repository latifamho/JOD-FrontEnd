export interface OrgAnalyticsFilters {
  dateFrom?: string
  dateTo?: string
  contentType?: 'post' | 'campaign' | 'video'
  categoryId?: string
  postType?: string
}

export interface OrgContentPerformanceRow {
  id: string
  contentType: string
  title: string
  postType?: string | null
  categoryId?: string | null
  impressions: number
  opens: number
  saves: number
  helpOffers: number
  applications: number
  donations: number
  contacts: number
  actions: number
  conversionRate: number
}

export interface OrgRecommendationAnalytics {
  period: { dateFrom: string; dateTo: string }
  summary: {
    impressions: number
    opens: number
    openRate: number
    saves: number
    saveRate: number
    newFollowers: number
    helpOffers: number
    applications: number
    donations: number
    contacts: number
    recommendationToActionRate: number
    attributionMode: string
  }
  timeseries: Array<{ date: string; impressions: number }>
  byCategory: Array<{ categoryId: string; impressions: number }>
  topContent: OrgContentPerformanceRow[]
}

export type OrgRecommendationAnalyticsResponse = { data: OrgRecommendationAnalytics }
export type OrgContentPerformanceResponse = { data: { period: { dateFrom: string; dateTo: string }; data: OrgContentPerformanceRow[] } }
