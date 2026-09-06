'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState, ListLoadingSkeleton } from '@/components/shared'
import { routePaths } from '@/constant/routes'
import { useOrgHelpRequests } from '@/features/org/help/org.help.query'
import { useOrgCategoriesBrief } from '@/features/org/categories/org.categories.query'
import type { HelpRequestStatus } from '@/features/org/help/org.help.types'

const statusLabels: Record<HelpRequestStatus,string> = { open:'مفتوح', in_progress:'قيد التنفيذ', fulfilled:'تمت المساعدة', partially_fulfilled:'تمت جزئياً', not_fulfilled:'لم تتم', expired:'منتهي' }
const urgencyLabels: Record<string,string> = { normal:'عادي', important:'مهم', urgent:'عاجل', critical:'حرج' }

export function OrganizationHelpRequestsPage() {
  const pathname = usePathname()
  const staff = pathname.startsWith(routePaths.dashboardScope.orgStaffRoot)
  const [status,setStatus] = React.useState<string>('all')
  const [urgency,setUrgency] = React.useState<string>('all')
  const [search,setSearch] = React.useState('')
  const [categoryId, setCategoryId] = React.useState('all')
  const [date, setDate] = React.useState('')
  const categories = useOrgCategoriesBrief()
  const query = useOrgHelpRequests({ perPage: 100, status: status === 'all' ? undefined : status as HelpRequestStatus, urgency: urgency === 'all' ? undefined : urgency as 'normal'|'important'|'urgent'|'critical', categoryId: categoryId === 'all' ? undefined : categoryId, search: search.trim() || undefined })
  const rows = (query.data?.data ?? []).filter((row) => !date || row.updatedAt.slice(0, 10) === date)

  return <section className="space-y-4">
    <div><h2 className="text-lg font-semibold">طلبات المساعدة</h2><p className="text-sm text-muted-foreground">إدارة طلبات المساعدة ومتابعة الاستعجال والعروض والنتيجة.</p></div>
    <div className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-5">
      <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث بالعنوان أو الموقع" />
      <Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">كل الحالات</SelectItem>{Object.entries(statusLabels).map(([value,label])=><SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select>
      <Select value={urgency} onValueChange={setUrgency}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">كل درجات الاستعجال</SelectItem>{Object.entries(urgencyLabels).map(([value,label])=><SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select>
      <Select value={categoryId} onValueChange={setCategoryId}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">كل التصنيفات</SelectItem>{(categories.data?.data ?? []).map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}</SelectContent></Select>
      <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} aria-label="تاريخ آخر تحديث" />
    </div>
    {query.isLoading ? <ListLoadingSkeleton /> : query.isError ? <div className="rounded-lg border border-destructive/30 p-4 text-sm text-destructive">تعذر تحميل طلبات المساعدة. <Button variant="outline" size="sm" onClick={()=>query.refetch()}>إعادة المحاولة</Button></div> : rows.length === 0 ? <EmptyState icon="posts" title="لا توجد طلبات مساعدة حتى الآن" description="يمكن إنشاء طلب مساعدة من صفحة المنشورات باختيار نوع طلب مساعدة." /> : <div className="overflow-x-auto rounded-xl border bg-card"><Table><TableHeader><TableRow><TableHead className="w-12">#</TableHead><TableHead>الطلب</TableHead><TableHead>التصنيف</TableHead><TableHead>الموقع</TableHead><TableHead>الاستعجال</TableHead><TableHead>الحالة</TableHead><TableHead>ينتهي في</TableHead><TableHead>العروض</TableHead><TableHead /></TableRow></TableHeader><TableBody>{rows.map((row,index)=>{const href=staff?routePaths.organizationStaffScope.helpRequestDetails(row.id):routePaths.organizationOwnerScope.helpRequestDetails(row.id); return <TableRow key={row.id}><TableCell className="text-muted-foreground">{index+1}</TableCell><TableCell className="font-medium">{row.title}</TableCell><TableCell>{row.category?.name ?? '-'}</TableCell><TableCell>{row.location || '-'}</TableCell><TableCell><Badge variant="outline">{urgencyLabels[row.urgency ?? 'normal'] ?? row.urgency}</Badge></TableCell><TableCell><Badge variant="secondary">{row.helpStatus ? statusLabels[row.helpStatus as HelpRequestStatus] ?? row.helpStatus : '-'}</Badge></TableCell><TableCell>{row.expiresAt ? new Date(row.expiresAt).toLocaleString('ar-SY') : '-'}</TableCell><TableCell>{row.helpOffersCount ?? 0}</TableCell><TableCell><Button asChild size="sm" variant="outline"><Link href={href}>إدارة الطلب</Link></Button></TableCell></TableRow>})}</TableBody></Table></div>}
  </section>
}
