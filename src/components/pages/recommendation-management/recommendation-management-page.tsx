'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DetailsLoadingSkeleton, FormLoadingSkeleton } from '@/components/shared'
import { useRecommendationInspector, useRecommendationSettings, useUpdateRecommendationSettings } from '@/features/admin/recommendations/admin.recommendations.query'
import type { RecommendationSettings } from '@/features/admin/recommendations/admin.recommendations.types'

const weightLabels: Record<string,string> = {
  followed_publisher:'ناشر متابَع', explicit_interest:'اهتمام صريح', behavioral_interest:'اهتمام سلوكي', same_city:'نفس المدينة', intent_match:'تطابق النية', freshness:'حداثة المحتوى', urgency:'الاستعجال', repeated_unengaged_view:'مشاهدة متكررة دون تفاعل',
}

function SettingsForm({settings}:{settings:RecommendationSettings}){
  const mutation=useUpdateRecommendationSettings()
  const [candidateLimit,setCandidateLimit]=React.useState(String(settings.candidateLimit))
  const [popularityCap,setPopularityCap]=React.useState(String(settings.popularityCap))
  const [explorationRatio,setExplorationRatio]=React.useState(String(Math.round(settings.explorationRatio*100)))
  const [weights,setWeights]=React.useState<Record<string,string>>(()=>Object.fromEntries(settings.activeWeightKeys.map(key=>[key,String(settings.weights[key]??0)])))
  const [message,setMessage]=React.useState('')

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault(); setMessage('')
    try{
      await mutation.mutateAsync({candidateLimit:Number(candidateLimit),popularityCap:Number(popularityCap),explorationRatio:Number(explorationRatio)/100,weights:Object.fromEntries(Object.entries(weights).map(([key,value])=>[key,Number(value)]))})
      setMessage('تم حفظ إعدادات التوصيات وتسجيل التغيير في سجل التدقيق.')
    }catch{setMessage('تعذر حفظ الإعدادات. تحقق من القيم والصلاحيات.')}
  }

  return <form onSubmit={submit} className="space-y-5">
    <div className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2"><Label>حد المرشحين</Label><Input type="number" min={20} max={500} value={candidateLimit} onChange={e=>setCandidateLimit(e.target.value)}/></div>
      <div className="space-y-2"><Label>سقف الشعبية</Label><Input type="number" min={0} max={100} step="0.5" value={popularityCap} onChange={e=>setPopularityCap(e.target.value)}/></div>
      <div className="space-y-2"><Label>نسبة الاستكشاف %</Label><Input type="number" min={0} max={50} step="1" value={explorationRatio} onChange={e=>setExplorationRatio(e.target.value)}/></div>
    </div>
    <div><h3 className="mb-3 font-semibold">أوزان الترتيب الفعالة</h3><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">{settings.activeWeightKeys.map(key=><div key={key} className="space-y-2 rounded-lg border p-3"><Label>{weightLabels[key]??key}</Label><Input type="number" min={-200} max={200} step="1" value={weights[key]??'0'} onChange={e=>setWeights(current=>({...current,[key]:e.target.value}))}/><p className="text-[11px] text-muted-foreground">{key}</p></div>)}</div></div>
    {message?<p className="text-sm text-muted-foreground">{message}</p>:null}
    <Button type="submit" disabled={mutation.isPending}>{mutation.isPending?'جارٍ الحفظ...':'حفظ الإعدادات'}</Button>
  </form>
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
  const settings=useRecommendationSettings()
  const [tab,setTab]=React.useState<'inspector'|'settings'>('inspector')
  return <section className="space-y-5">
    <div><h2 className="text-lg font-semibold">إدارة محرك التوصيات</h2><p className="text-sm text-muted-foreground">فحص سبب ظهور المحتوى وإدارة أوزان الترتيب ونسبة الاستكشاف.</p></div>
    <div className="flex gap-2"><Button variant={tab==='inspector'?'default':'outline'} onClick={()=>setTab('inspector')}>Recommendation Inspector</Button><Button variant={tab==='settings'?'default':'outline'} onClick={()=>setTab('settings')}>إعدادات التوصيات</Button></div>
    {tab==='inspector'?<InspectorPanel/>:settings.isLoading?<FormLoadingSkeleton count={8}/>:settings.data?.data?<SettingsForm key={settings.data.data.updatedAt??'default'} settings={settings.data.data}/>:<div className="rounded-lg border p-6 text-sm text-muted-foreground">تعذر تحميل إعدادات التوصيات.</div>}
  </section>
}
