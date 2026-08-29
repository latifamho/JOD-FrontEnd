'use client'

import { CardGridLoadingSkeleton, EmptyState, ListLoadingSkeleton } from '@/components/shared'
import { AppIcons } from '@/constant/icons'
import { useOrgOverview } from '@/features/org/overview/org.overview.query'
import type { OrganizationOverviewStat } from '@/features/org/overview/org.overview.types'
import { formatUtcDateTimeOrDash } from '@/lib/date'

const iconMap: Record<OrganizationOverviewStat['id'], keyof typeof AppIcons> = {
  followers: 'users',
  campaigns: 'campaigns',
  posts: 'posts',
  donors: 'donors',
  applicants: 'users',
  staff: 'staff',
  reports: 'reports',
}

const labelMap: Record<OrganizationOverviewStat['id'], string> = {
  followers: 'المتابعون',
  campaigns: 'الحملات',
  posts: 'المنشورات',
  donors: 'المتبرعون',
  applicants: 'المتقدمون',
  staff: 'الموظفون',
  reports: 'البلاغات',
}

// The backend may add stats faster than this map; render an unknown id rather than
// crashing on `AppIcons[undefined]`.
const FALLBACK_STAT_ICON: keyof typeof AppIcons = 'users'

export function OrganizationOverviewPage({ owner }: { owner: boolean }) {
  const overview = useOrgOverview()
  const stats = overview.data?.data.stats ?? []
  const activity = overview.data?.data.recentActivity ?? []

  if (overview.isError) {
    return <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">تعذّر تحميل ملخص المنظمة.</div>
  }

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">{owner ? 'نظرة عامة للمنظمة' : 'نظرة عامة للموظف'}</h2>
        <p className="mt-1 text-sm text-muted-foreground">ملخص سريع لأهم مؤشرات ونشاطات المنظمة.</p>
      </div>

      {overview.isLoading ? (
        <CardGridLoadingSkeleton />
      ) : (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = AppIcons[iconMap[stat.id] ?? FALLBACK_STAT_ICON]
          return (
            <article key={stat.id} className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></div>
                <div><p className="text-sm text-muted-foreground">{labelMap[stat.id] ?? stat.label}</p><p className="text-2xl font-bold">{stat.value}</p><p className="text-xs text-muted-foreground">{stat.hint}</p></div>
              </div>
            </article>
          )
        })}
      </div>
      )}

      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold">آخر النشاطات</h3>
        {overview.isLoading ? (
          <div className="mt-3"><ListLoadingSkeleton count={4} /></div>
        ) : activity.length === 0 ? (
          <div className="mt-3"><EmptyState icon="dashboard" title="لا توجد نشاطات" description="ستظهر هنا آخر النشاطات المسجلة في المنظمة." /></div>
        ) : (
          <ul className="mt-3 divide-y">
            {activity.map((item) => (
              <li key={item.id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:justify-between">
                <div><p className="text-sm font-medium">{item.title}</p><p className="text-xs text-muted-foreground">{item.detail}{item.actor ? ` — ${item.actor}` : ''}</p></div>
                <time className="text-xs text-muted-foreground">{formatUtcDateTimeOrDash(item.at ?? undefined)}</time>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}