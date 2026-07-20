import type { ApiSingleResponse } from '@/types/api.types'

export type AdminAnalyticsRange = '7d' | '30d' | '90d' | '12m'

export interface AdminAnalyticsParams {
  range?: AdminAnalyticsRange
}

export interface AdminAnalyticsKpi {
  id: string
  label: string
  value: number | string
  changeVsLastMonth: string
}

export interface AdminAnalyticsWeeklyRow {
  weekLabel: string
  visits: number
  newUsers: number
  donations: number
}

export interface AdminAnalyticsKpisData {
  kpis: AdminAnalyticsKpi[]
}

export interface AdminAnalyticsWeeklyData {
  rows: AdminAnalyticsWeeklyRow[]
}

export type AdminAnalyticsKpisResponse = ApiSingleResponse<AdminAnalyticsKpisData>
export type AdminAnalyticsWeeklyResponse = ApiSingleResponse<AdminAnalyticsWeeklyData>
