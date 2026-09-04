'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DetailsLoadingSkeleton } from '@/components/shared'
import { useRecommendationInspector } from '@/features/admin/recommendations/admin.recommendations.query'

const weightLabels: Record<string,string> = {
  followed_publisher:'ناشر متابَع', explicit_interest:'اهتمام صريح', behavioral_interest:'اهتمام سلوكي', same_city:'نفس المدينة', intent_match:'تطابق النية', freshness:'حداثة المحتوى', urgency:'الاستعجال', repeated_unengaged_view:'مشاهدة متكررة دون تفاعل',
}

function InspectorPanel(){
  const inspector=useRecommendationInspector()
  const [userId,setUserId]=React.useState('')
  const [postId,setPostId]=React.useState('')
  const result=inspector.data?.data
  return <div className="space-y-5">
    <form className="grid gap-3 md:grid-cols-[1fr_1fr_auto]" onSubmit={e=>{e.preventDefault(); if(userId.trim()&&postId.trim()) inspector.mutate({userId:userId.trim(),postId:postId.trim()})}}>
      <div className="space-y-2"><Label>معرّف المستخدم</Label><Input value={userId} onChange={e=>setUserId(e.target.value)} placeholder="UUID المستخدم"/></div>
      <div className="space-y-2"><Label>معرّف المنشور</Label><Input value={postId} onChange={e=>setPostId(e.target.value)} placeholder="UUID المنشور"/></div>
      <Button className="self-end" disabled={!userId.trim()||!postId.trim()||inspector.isPending}>{inspector.isPending?'جارٍ الفحص...':'فحص التوصية'}</Button>
    </form>
    {inspector.isPending?<DetailsLoadingSkeleton/>:null}
    {inspector.isError?<div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">تعذر فحص هذه العلاقة. تحقق من المعرّفات والصلاحيات.</div>:null}
    {result?<div className="space-y-4 rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-semibold">{result.user.name} ← {result.post.title}</h3><Badge variant={result.eligible?'default':'destructive'}>{result.eligible?'مؤهل للظهور':'مستبعد'}</Badge><Badge variant="outline">{result.source==='exploration'?'استكشاف':'مخصص'}</Badge><Badge variant="outline">النتيجة {result.score}</Badge></div>
      {result.exclusions.length?<div><p className="mb-2 text-sm font-medium">أسباب الاستبعاد</p><div className="flex flex-wrap gap-2">{result.exclusions.map(item=><Badge key={item} variant="destructive">{item}</Badge>)}</div></div>:null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Object.entries(result.components).map(([key,value])=><div key={key} className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">{weightLabels[key]??key}</p><p className="mt-1 text-xl font-semibold">{value}</p></div>)}</div>
      <div className="grid gap-3 md:grid-cols-2"><div className="rounded-lg border p-4"><p className="font-medium">إشارات المستخدم</p><p className="mt-2 text-sm text-muted-foreground">اهتمام صريح: {result.signals.explicitCategoryWeight} · سلوكي: {result.signals.behavioralCategoryWeight}</p><p className="text-sm text-muted-foreground">مشاهدات 30 يوم: {result.signals.viewsLast30Days} · ناشر مخفي: {result.signals.publisherHidden?'نعم':'لا'}</p></div><div className="rounded-lg border p-4"><p className="font-medium">أسباب التوصية</p><div className="mt-2 flex flex-wrap gap-2">{result.reasons.length?result.reasons.map(reason=><Badge key={reason} variant="outline">{reason}</Badge>):<span className="text-sm text-muted-foreground">لا توجد أسباب تخصيص موجبة؛ المحتوى استكشافي.</span>}</div></div></div>
    </div>:null}
  </div>
}

export function RecommendationManagementPage(){
  return <section className="space-y-5">
    <div><h2 className="text-lg font-semibold">فحص محرك التوصيات</h2><p className="text-sm text-muted-foreground">فحص سبب ظهور محتوى محدد لمستخدم معيّن. إعدادات وأوزان الخوارزمية غير قابلة للتعديل من الواجهة.</p></div>
    <InspectorPanel/>
  </section>
}
