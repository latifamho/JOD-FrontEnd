export interface OrganizationOverviewStat {
  id: 'campaigns' | 'posts' | 'donors' | 'applicants' | 'staff' | 'reports'
  label: string
  value: number
  hint: string
}

export interface OrganizationOverviewActivity {
  id: string
  title: string
  detail: string
  action: string
  entityType: string
  entityId: string
  actor: string | null
  at: string | null
}

export interface OrganizationOverviewResponse {
  data: {
    stats: OrganizationOverviewStat[]
    recentActivity: OrganizationOverviewActivity[]
  }
}