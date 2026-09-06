'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState, ListLoadingSkeleton } from '@/components/shared'
import { useOrgCategoriesBrief } from '@/features/org/categories/org.categories.query'
import { useOrgContentPerformance, useOrgRecommendationAnalytics } from '@/features/org/analytics/org.analytics.query'
import type { OrgAnalyticsFilters, OrgContentPerformanceRow } from '@/features/org/analytics/org.analytics.types'

export function OrganizationAnalyticsPage({ mode }: { mode: 'overview' | 'content' }) {
  const [dateFrom, setDateFrom] = React.useState('')
  const [dateTo, setDateTo] = React.useState('')
  const [contentType, setContentType] = React.useState('all')
  const [categoryId, setCategoryId] = React.useState('all')
  const [postType, setPostType] = React.useState('all')
  const [selectedRow, setSelectedRow] = React.useState<OrgContentPerformanceRow | null>(null)
  const filters: OrgAnalyticsFilters = {
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    contentType: contentType === 'all' ? undefined : contentType as 'post' | 'campaign' | 'video',
    categoryId: categoryId === 'all' ? undefined : categoryId,
    postType: postType === 'all' ? undefined : postType,
  }
  const categories = useOrgCategoriesBrief()
  const recommendation = useOrgRecommendationAnalytics(filters)
  const content = useOrgContentPerformance(filters)
  const summary = recommendation.data?.data.summary
  const rows = React.useMemo(() => content.data?.data.data ?? [], [content.data?.data.data])
  const categoryNames = new Map((categories.data?.data ?? []).map((item) => [item.id, item.name]))

  const topCategories = React.useMemo(() => {
    const grouped = new Map<string, { categoryId: string; impressions: number; actions: number }>()
    for (const row of rows) {
      if (!row.categoryId) continue
      const current = grouped.get(row.categoryId) ?? { categoryId: row.categoryId, impressions: 0, actions: 0 }
      current.impressions += row.impressions
      current.actions += row.actions
      grouped.set(row.categoryId, current)
    }
    return [...grouped.values()]
      .map((item) => ({ ...item, conversionRate: item.impressions > 0 ? Number(((item.actions / item.impressions) * 100).toFixed(2)) : 0 }))
      .sort((a, b) => b.actions - a.actions || b.impressions - a.impressions)
      .slice(0, 5)
  }, [rows])

  const meaningfulActions = summary ? summary.helpOffers + summary.applications + summary.donations + summary.contacts : 0

  return <section className="space-y-5">
    <div><h2 className="text-lg font-semibold">{mode === 'overview' ? 'تحليلات التوصيات' : 'أداء المحتوى'}</h2><p className="text-sm text-muted-foreground">بيانات خاصة بمحتوى منظمتك فقط، من الظهور في التوصيات وحتى الإجراء الفعلي.</p></div>
    <div className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-5">
      <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
      <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
      <Select value={contentType} onValueChange={(value) => { setContentType(value); if (value !== 'post') setPostType('all') }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">كل المحتوى</SelectItem><SelectItem value="post">منشورات</SelectItem><SelectItem value="campaign">حملات</SelectItem><SelectItem value="video">فيديو</SelectItem></SelectContent></Select>
      <Select value={categoryId} onValueChange={setCategoryId}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">كل التصنيفات</SelectItem>{(categories.data?.data ?? []).map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}</SelectContent></Select>
      <Select value={postType} onValueChange={setPostType} disabled={contentType !== 'all' && contentType !== 'post'}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">كل أنواع المنشورات</SelectItem><SelectItem value="help_request">طلب مساعدة</SelectItem><SelectItem value="service_offer">خدمة مقدمة</SelectItem><SelectItem value="volunteer_opportunity">فرصة تطوع</SelectItem><SelectItem value="awareness">توعوي</SelectItem><SelectItem value="general">عام</SelectItem></SelectContent></Select>
    </div>

    {recommendation.isLoading ? <ListLoadingSkeleton /> : summary ? <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[["مرات الظهور", summary.impressions], ["معدل الفتح", `${summary.openRate}%`], ["معدل الحفظ", `${summary.saveRate}%`], ["متابعون جدد", summary.newFollowers], ["عروض مساعدة", summary.helpOffers], ["طلبات تطوع", summary.applications], ["تبرعات", summary.donations], ["التحويل إلى إجراء", `${summary.recommendationToActionRate}%`]].map(([label, value]) => <div key={String(label)} className="rounded-xl border bg-card p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div>)}
      </div>

      <div className="rounded-xl border bg-card p-4">
        <h3 className="font-semibold">مسار التوصية إلى الإجراء</h3>
        <p className="mt-1 text-xs text-muted-foreground">يوضح انتقال المستخدم من مشاهدة المحتوى المقترح إلى التفاعل المفيد.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {[["الظهور", summary.impressions], ["الفتح", summary.opens], ["الحفظ", summary.saves], ["إجراء فعلي", meaningfulActions]].map(([label, value], index) => <div key={String(label)} className="relative rounded-lg border bg-muted/20 p-4 text-center"><p className="text-xs text-muted-foreground">{index + 1}. {label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div>)}
        </div>
      </div>

      {mode === 'overview' ? <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-4"><h3 className="font-semibold">أفضل المحتوى أداءً</h3><div className="mt-3 space-y-2">{recommendation.data?.data.topContent.map((item) => <button type="button" key={`${item.contentType}-${item.id}`} onClick={() => setSelectedRow(item)} className="flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-start transition hover:bg-muted/40"><div><p className="text-sm font-medium">{item.title || item.id}</p><p className="text-xs text-muted-foreground">{item.postType || item.contentType}</p></div><div className="text-left"><Badge variant="outline">{item.conversionRate}%</Badge><p className="mt-1 text-xs text-muted-foreground">{item.actions} إجراء</p></div></button>)}</div></div>
        <div className="rounded-xl border bg-card p-4"><h3 className="font-semibold">أفضل التصنيفات</h3><div className="mt-3 space-y-2">{topCategories.length ? topCategories.map((item) => <div key={item.categoryId} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-lg border p-3 text-sm"><span>{categoryNames.get(item.categoryId) ?? item.categoryId}</span><span className="text-muted-foreground">{item.actions} إجراء</span><Badge variant="outline">{item.conversionRate}%</Badge></div>) : <p className="text-sm text-muted-foreground">لا توجد بيانات تصنيفات كافية.</p>}</div></div>
      </div> : null}
    </> : <EmptyState icon="analytics" title="لا توجد بيانات كافية ضمن الفترة المحددة" description="غيّر الفترة أو الفلاتر لعرض نتائج أخرى." />}

    {mode === 'content' ? <div className="overflow-x-auto rounded-xl border bg-card"><Table><TableHeader><TableRow><TableHead className="w-12">#</TableHead><TableHead>المحتوى</TableHead><TableHead>النوع</TableHead><TableHead>التصنيف</TableHead><TableHead>الظهور</TableHead><TableHead>الفتح</TableHead><TableHead>الحفظ</TableHead><TableHead>الإجراءات</TableHead><TableHead>التحويل</TableHead></TableRow></TableHeader><TableBody>{rows.map((row, index) => <TableRow key={`${row.contentType}-${row.id}`} onClick={() => setSelectedRow(row)} className="cursor-pointer"><TableCell className="text-muted-foreground">{index + 1}</TableCell><TableCell className="font-medium">{row.title || row.id}</TableCell><TableCell>{row.postType || row.contentType}</TableCell><TableCell>{categoryNames.get(row.categoryId ?? '') ?? '-'}</TableCell><TableCell>{row.impressions}</TableCell><TableCell>{row.opens}</TableCell><TableCell>{row.saves}</TableCell><TableCell>{row.actions}</TableCell><TableCell>{row.conversionRate}%</TableCell></TableRow>)}</TableBody></Table></div> : null}

    <Dialog open={Boolean(selectedRow)} onOpenChange={(open) => { if (!open) setSelectedRow(null) }}>
      <DialogContent dir="rtl" className="sm:max-w-xl"><DialogHeader><DialogTitle>تفاصيل أداء المحتوى</DialogTitle><DialogDescription>{selectedRow?.title || 'تفاصيل التفاعل مع المحتوى المقترح'}</DialogDescription></DialogHeader>{selectedRow ? <div className="grid gap-3 sm:grid-cols-2"><Metric label="مرات الظهور" value={selectedRow.impressions} /><Metric label="مرات الفتح" value={selectedRow.opens} /><Metric label="معدل الحفظ" value={selectedRow.impressions ? `${((selectedRow.saves / selectedRow.impressions) * 100).toFixed(2)}%` : '0%'} /><Metric label="متابعة/عروض مساعدة" value={selectedRow.helpOffers} /><Metric label="طلبات تطوع" value={selectedRow.applications} /><Metric label="تبرعات" value={selectedRow.donations} /><Metric label="تواصل" value={selectedRow.contacts} /><Metric label="معدل التحويل" value={`${selectedRow.conversionRate}%`} /></div> : null}</DialogContent>
    </Dialog>
  </section>
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-xl font-semibold">{value}</p></div>
}
