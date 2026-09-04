'use client'
import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useUpdateHelpRequestLifecycle } from '@/features/admin/posts/admin.posts.query'
import type { ReviewPostDetail } from '@/features/admin/posts/admin.posts.types'

const urgencyLabels={normal:'عادي',important:'مهم',urgent:'عاجل',critical:'حرج'} as const
const fulfillmentLabels={open:'مفتوح',in_progress:'قيد التنفيذ',fulfilled:'تمت المساعدة',partially_fulfilled:'تمت جزئياً',not_fulfilled:'لم تتم',expired:'منتهي'} as const

export function HelpRequestLifecyclePanel({post}:{post:ReviewPostDetail}){
  const mutation=useUpdateHelpRequestLifecycle()
  const [urgency,setUrgency]=React.useState<NonNullable<ReviewPostDetail['urgency']>>(post.urgency??'normal')
  const [urgencyReason,setUrgencyReason]=React.useState(post.urgencyReason??'')
  const [expiresAt,setExpiresAt]=React.useState(post.expiresAt?post.expiresAt.slice(0,16):'')
  const [fulfillmentStatus,setFulfillmentStatus]=React.useState<NonNullable<ReviewPostDetail['fulfillmentStatus']>>(post.fulfillmentStatus??'open')
  const requiresReason=urgency==='urgent'||urgency==='critical'
  const save=()=>mutation.mutate({postId:post.id,body:{urgency,urgencyReason:urgencyReason.trim()||null,expiresAt:expiresAt?new Date(expiresAt).toISOString():null,fulfillmentStatus}})
  return <div className={`rounded-lg border p-4 ${urgency==='critical'?'border-destructive/50 bg-destructive/5':'border-border'}`}>
    <div className="mb-4 flex items-center justify-between"><div><h3 className="text-sm font-semibold">دورة حياة طلب المساعدة</h3><p className="text-xs text-muted-foreground">الاستعجال وموعد الانتهاء وحالة تنفيذ المساعدة.</p></div>{urgency==='critical'?<Badge variant="destructive">طلب حرج</Badge>:<Badge variant="outline">{urgencyLabels[urgency]}</Badge>}</div>
    <div className="grid gap-3 sm:grid-cols-2"><label className="space-y-1 text-xs"><span className="text-muted-foreground">الاستعجال</span><select className="h-9 w-full rounded-md border bg-background px-2 text-sm" value={urgency} onChange={e=>setUrgency(e.target.value as typeof urgency)}>{Object.entries(urgencyLabels).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label><label className="space-y-1 text-xs"><span className="text-muted-foreground">حالة التنفيذ</span><select className="h-9 w-full rounded-md border bg-background px-2 text-sm" value={fulfillmentStatus} onChange={e=>setFulfillmentStatus(e.target.value as typeof fulfillmentStatus)}>{Object.entries(fulfillmentLabels).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label><label className="space-y-1 text-xs sm:col-span-2"><span className="text-muted-foreground">مطلوب حتى / ينتهي في</span><input className="h-9 w-full rounded-md border bg-background px-2 text-sm" type="datetime-local" value={expiresAt} onChange={e=>setExpiresAt(e.target.value)}/></label>{requiresReason?<label className="space-y-1 text-xs sm:col-span-2"><span className="text-muted-foreground">سبب الاستعجال *</span><textarea className="min-h-20 w-full rounded-md border bg-background p-2 text-sm" value={urgencyReason} onChange={e=>setUrgencyReason(e.target.value)} maxLength={500}/></label>:null}</div>
    <div className="mt-4 flex justify-end"><Button size="sm" disabled={mutation.isPending||(requiresReason&&!urgencyReason.trim())} onClick={save}>{mutation.isPending?'جارٍ الحفظ...':'حفظ حالة الطلب'}</Button></div>
  </div>
}
