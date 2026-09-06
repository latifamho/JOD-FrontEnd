'use client'
import * as React from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from '@/components/ui/table'
import { useAdminHelpMatches,useAdminHelpMonitoring } from '@/features/admin/help-matching/admin.help-matching.query'

const statuses=['all','pending','accepted','contacting','agreed','completed','rejected','cancelled'] as const
export function HelpMatchingPage(){
 const [page,setPage]=React.useState(1); const [search,setSearch]=React.useState(''); const [status,setStatus]=React.useState('all'); const [staleOnly,setStaleOnly]=React.useState(false)
 const query=useAdminHelpMatches({page,perPage:20,sort:'-createdAt',filter:{search:search.trim()||undefined,status:status==='all'?undefined:status,staleOnly:staleOnly||undefined}})
 const analytics=useAdminHelpMonitoring(); const rows=query.data?.data??[]; const k=analytics.data?.data.kpis
 return <section className="space-y-5"><div><h2 className="text-lg font-semibold">مطابقة المساعدات</h2><p className="text-sm text-muted-foreground">متابعة عروض المساعدة ومسار المطابقة والتنبيهات المتأخرة.</p></div>
 <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[
  ['إجمالي العروض',k?.totalOffers],['العروض المكتملة',k?.completedOffers],['المطابقات المتأخرة',k?.staleOffers],['معدل قراءة الإشعارات',k?`${k.notificationReadRate}%`:undefined]
 ].map(([label,value])=><div key={String(label)} className="rounded-lg border bg-card p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold">{value??'-'}</p></div>)}</div>
 <div className="flex flex-wrap gap-2"><Input className="max-w-sm" placeholder="بحث بالطلب أو المستخدم" value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}/><select className="h-9 rounded-md border bg-background px-3 text-sm" value={status} onChange={e=>{setStatus(e.target.value);setPage(1)}}>{statuses.map(s=><option key={s} value={s}>{s}</option>)}</select><Button variant={staleOnly?'default':'outline'} onClick={()=>{setStaleOnly(v=>!v);setPage(1)}}>المتأخرة فقط</Button></div>
 <div className="overflow-auto rounded-md border"><Table><TableHeader><TableRow><TableHead className="w-12">#</TableHead><TableHead>طلب المساعدة</TableHead><TableHead>المساعد</TableHead><TableHead>الحالة</TableHead><TableHead>الاستعجال</TableHead><TableHead>إشارات المطابقة</TableHead><TableHead>العمر</TableHead></TableRow></TableHeader><TableBody>{query.isLoading?Array.from({length:5}).map((_,i)=><TableRow key={i}><TableCell colSpan={7}><div className="h-8 animate-pulse rounded bg-muted"/></TableCell></TableRow>):rows.length?rows.map((row,index)=><TableRow key={row.id} className={row.isStale?'bg-amber-50/60 dark:bg-amber-500/5':''}><TableCell className="text-muted-foreground">{index+1}</TableCell><TableCell><Link className="font-medium hover:underline" href={`/dashboard/admin/help-matching/${row.id}`}>{row.request?.title??'-'}</Link><p className="text-xs text-muted-foreground">{row.request?.location??'-'}</p></TableCell><TableCell><p>{row.helper?.name??'-'}</p><p className="text-xs text-muted-foreground">{row.helper?.preferredCity??'-'}</p></TableCell><TableCell><Badge variant="outline">{row.status}</Badge>{row.isStale?<Badge className="ms-2" variant="destructive">متأخر</Badge>:null}</TableCell><TableCell>{row.request?.urgency??'-'}</TableCell><TableCell className="text-xs">صريح {row.signals.explicitCategoryWeight} / سلوكي {row.signals.behavioralCategoryWeight}</TableCell><TableCell>{row.ageHours} ساعة</TableCell></TableRow>):<TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">لا توجد مطابقات.</TableCell></TableRow>}</TableBody></Table></div>
 <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">الإجمالي {query.data?.meta.total??0}</p><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>السابق</Button><Button size="sm" variant="outline" disabled={page>=(query.data?.meta.lastPage??1)} onClick={()=>setPage(p=>p+1)}>التالي</Button></div></div>
 {analytics.data?<div className="rounded-lg border bg-card p-4"><h3 className="font-semibold">أداء الإشعارات المرتبطة بالمساعدة</h3><div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{analytics.data.data.notificationBreakdown.map(row=><div key={row.eventType} className="rounded-md border p-3 text-sm"><p className="font-medium">{row.eventType}</p><p className="text-muted-foreground">مرسل {row.sent} · مقروء {row.read} · {row.readRate}%</p></div>)}</div></div>:null}
 </section>
}
