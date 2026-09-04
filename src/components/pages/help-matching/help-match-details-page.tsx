'use client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DetailsLoadingSkeleton } from '@/components/shared/loading-skeletons'
import { useAdminHelpMatch } from '@/features/admin/help-matching/admin.help-matching.query'
import { routePaths } from '@/constant/routes'

export function HelpMatchDetailsPage(){
  const params=useParams<{id:string}>(); const id=Array.isArray(params.id)?params.id[0]:params.id
  const query=useAdminHelpMatch(id??null)
  if(query.isLoading) return <DetailsLoadingSkeleton className="p-0"/>
  if(query.isError||!query.data?.data) return <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center"><p className="text-sm text-destructive">تعذر تحميل تفاصيل المطابقة.</p><Button asChild variant="outline" className="mt-4"><Link href={routePaths.adminScope.helpMatching}>العودة للمطابقات</Link></Button></div>
  const item=query.data.data
  return <section className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">تفاصيل مطابقة المساعدة</h2><p className="text-sm text-muted-foreground">متابعة العرض، المستخدمين وإشارات التخصيص المرتبطة بالمطابقة.</p></div><Button asChild variant="outline"><Link href={routePaths.adminScope.helpMatching}>العودة</Link></Button></div>
    <div className="flex flex-wrap gap-2"><Badge variant="outline">{item.status}</Badge>{item.isStale?<Badge variant="destructive">متأخر أكثر من 24 ساعة</Badge>:null}<Badge variant="outline">{item.request?.urgency??'normal'}</Badge></div>
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-lg border bg-card p-4"><h3 className="font-semibold">طلب المساعدة</h3><dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-muted-foreground">العنوان</dt><dd>{item.request?.title??'-'}</dd></div><div><dt className="text-muted-foreground">التصنيف</dt><dd>{item.request?.category?.name??'-'}</dd></div><div><dt className="text-muted-foreground">الموقع</dt><dd>{item.request?.location??'-'}</dd></div><div><dt className="text-muted-foreground">حالة الإنجاز</dt><dd>{item.request?.fulfillmentStatus??'-'}</dd></div></dl></div>
      <div className="rounded-lg border bg-card p-4"><h3 className="font-semibold">المساعد</h3><dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-muted-foreground">الاسم</dt><dd>{item.helper?.name??'-'}</dd></div><div><dt className="text-muted-foreground">البريد</dt><dd>{item.helper?.email??'-'}</dd></div><div><dt className="text-muted-foreground">المدينة المفضلة</dt><dd>{item.helper?.preferredCity??'-'}</dd></div><div><dt className="text-muted-foreground">التوفر</dt><dd>{item.helper?.availabilityStatus??'-'}</dd></div></dl>{item.helper?.capabilities?.length?<div className="mt-3 flex flex-wrap gap-2">{item.helper.capabilities.map(cap=><Badge key={cap.id} variant="secondary">{cap.name}</Badge>)}</div>:null}</div>
      <div className="rounded-lg border bg-card p-4"><h3 className="font-semibold">صاحب الطلب</h3><dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-muted-foreground">الاسم</dt><dd>{item.requestOwner?.name??'-'}</dd></div><div><dt className="text-muted-foreground">البريد</dt><dd>{item.requestOwner?.email??'-'}</dd></div><div><dt className="text-muted-foreground">الهاتف</dt><dd>{item.requestOwner?.phone??'-'}</dd></div></dl></div>
      <div className="rounded-lg border bg-card p-4"><h3 className="font-semibold">إشارات المطابقة</h3><dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-muted-foreground">اهتمام صريح</dt><dd>{item.signals.explicitCategoryWeight}</dd></div><div><dt className="text-muted-foreground">اهتمام سلوكي</dt><dd>{item.signals.behavioralCategoryWeight}</dd></div><div><dt className="text-muted-foreground">موقع الطلب</dt><dd>{item.signals.requestLocation??'-'}</dd></div><div><dt className="text-muted-foreground">مدينة المستخدم</dt><dd>{item.signals.preferredCity??'-'}</dd></div></dl></div>
    </div>
    <div className="rounded-lg border bg-card p-4"><h3 className="font-semibold">مسار العرض</h3><div className="mt-3 grid gap-3 text-sm sm:grid-cols-3"><div><p className="text-muted-foreground">الإنشاء</p><p>{item.createdAt?new Date(item.createdAt).toLocaleString('ar'): '-'}</p></div><div><p className="text-muted-foreground">الإنجاز</p><p>{item.completedAt?new Date(item.completedAt).toLocaleString('ar'):'-'}</p></div><div><p className="text-muted-foreground">العمر</p><p>{item.ageHours} ساعة</p></div></div></div>
  </section>
}
