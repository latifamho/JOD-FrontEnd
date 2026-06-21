import type { ApiSingleResponse } from '@/types/api.types'

// ─── Stat card ────────────────────────────────────────────────────────────────

export type AdminOverviewStatIcon = 'users' | 'building' | 'document' | 'flag' | 'alert'

export interface AdminOverviewStat {
  id: string
  label: string
  value: number
  subLabel: string
  icon: AdminOverviewStatIcon
}

// ─── Activity feed item ───────────────────────────────────────────────────────

export interface AdminOverviewActivity {
  id: string
  title: string
  detail: string
  at: string // ISO 8601
}

// ─── Data payload (what lives inside "data") ──────────────────────────────────

export interface AdminOverviewData {
  stats: AdminOverviewStat[]
  activity: AdminOverviewActivity[]
}

// ─── Full API response ────────────────────────────────────────────────────────
// Usage: api.get<AdminOverviewResponse>('/admin/overview')

export type AdminOverviewResponse = ApiSingleResponse<AdminOverviewData>
