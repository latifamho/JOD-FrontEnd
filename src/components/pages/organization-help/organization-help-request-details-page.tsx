'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DetailsLoadingSkeleton, EmptyState } from '@/components/shared'
import { useOrgHelpOfferAction, useOrgHelpRequest, useOrgRequestOffers, useUpdateOrgHelpRequestStatus } from '@/features/org/help/org.help.query'
import type { HelpRequestStatus, OrgHelpOfferItem } from '@/features/org/help/org.help.types'
import { toast } from '@/lib/toast'

const statusLabels: Record<HelpRequestStatus,string> = { open:'مفتوح', in_progress:'قيد التنفيذ', fulfilled:'تمت المساعدة', partially_fulfilled:'تمت جزئياً', not_fulfilled:'لم تتم', expired:'منتهي' }
const offerLabels: Record<string,string> = { pending:'بانتظار المراجعة', accepted:'مقبول', contacting:'تم التواصل', agreed:'تم الاتفاق', completed:'مكتمل', rejected:'مرفوض' }

function OfferActions({ offer }: { offer: OrgHelpOfferItem }) {
  const action = useOrgHelpOfferAction()
  const run = async (name: 'accept'|'reject'|'contact'|'agree'|'confirm-received') => {
    try { await action.mutateAsync({ id: offer.id, action: name }); toast.success('تم تحديث عرض المساعدة.') } catch { toast.error('تعذر تنفيذ الإجراء.') }
  }
  return <div className="flex flex-wrap gap-1">
    {offer.can.accept ? <Button size="sm" onClick={()=>run('accept')} disabled={action.isPending}>قبول</Button> : null}
    {offer.can.reject ? <Button size="sm" variant="destructive" onClick={()=>run('reject')} disabled={action.isPending}>رفض</Button> : null}
    {offer.can.contact ? <Button size="sm" variant="outline" onClick={()=>run('contact')} disabled={action.isPending}>تواصل</Button> : null}
    {offer.status === 'contacting' ? <Button size="sm" variant="outline" onClick={()=>run('agree')} disabled={action.isPending}>تأكيد الاتفاق</Button> : null}
    {offer.can.confirmReceived ? <Button size="sm" onClick={()=>run('confirm-received')} disabled={action.isPending}>تأكيد الإتمام</Button> : null}
  </div>
}

export function OrganizationHelpRequestDetailsPage({ id }: { id: string }) {
  const requestQuery = useOrgHelpRequest(id)
  const offersQuery = useOrgRequestOffers(id)
  const updateStatus = useUpdateOrgHelpRequestStatus()
  const request = requestQuery.data?.data
  const [statusOverride, setStatusOverride] = React.useState<HelpRequestStatus | null>(null)
  const [confirmStatus, setConfirmStatus] = React.useState<HelpRequestStatus | null>(null)

  if (requestQuery.isLoading) return <DetailsLoadingSkeleton />
  if (!request || requestQuery.isError) return <EmptyState icon="posts" title="لم يعد هذا الطلب متاحاً" description="تعذر تحميل تفاصيل طلب المساعدة." />
  const terminal = ['fulfilled','partially_fulfilled','not_fulfilled','expired'].includes(request.helpStatus ?? '')
  const selectedStatus = statusOverride ?? (request.helpStatus as HelpRequestStatus | null) ?? 'open'
  const offers = offersQuery.data?.data ?? []

  const saveStatus = async (nextStatus = selectedStatus) => { try { await updateStatus.mutateAsync({ id, status: nextStatus }); setConfirmStatus(null); toast.success('تم تحديث نتيجة الطلب.') } catch { toast.error('تعذر تحديث حالة الطلب.') } }

  return <section className="space-y-5">
    <div className="rounded-xl border bg-card p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-semibold">{request.title}</h2><p className="mt-1 text-sm text-muted-foreground">{request.summary}</p></div><Badge>{statusLabels[request.helpStatus as HelpRequestStatus] ?? request.helpStatus}</Badge></div><div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4"><div>التصنيف: <strong>{request.category?.name ?? '-'}</strong></div><div>الموقع: <strong>{request.location ?? '-'}</strong></div><div>الاستعجال: <strong>{request.urgency ?? 'normal'}</strong></div><div>الموعد: <strong>{request.expiresAt ? new Date(request.expiresAt).toLocaleString('ar-SY') : '-'}</strong></div></div>{request.requiredCapabilities?.length ? <div className="mt-4 flex flex-wrap gap-2">{request.requiredCapabilities.map(cap=><Badge key={cap.id} variant="outline">{cap.name}</Badge>)}</div> : null}</div>
    <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border bg-card p-4"><p className="text-xs text-muted-foreground">كل العروض</p><p className="text-2xl font-semibold">{request.helpOffersCount ?? 0}</p></div><div className="rounded-xl border bg-card p-4"><p className="text-xs text-muted-foreground">العروض النشطة</p><p className="text-2xl font-semibold">{request.activeHelpOffersCount ?? 0}</p></div><div className="rounded-xl border bg-card p-4"><p className="text-xs text-muted-foreground">المكتملة</p><p className="text-2xl font-semibold">{request.completedHelpOffersCount ?? 0}</p></div></div>
    <div className="rounded-xl border bg-card p-4"><h3 className="font-semibold">تحديث نتيجة الطلب</h3><div className="mt-3 flex flex-wrap gap-2"><Select value={selectedStatus} onValueChange={v=>setStatusOverride(v as HelpRequestStatus)} disabled={terminal}><SelectTrigger className="w-64"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="open">مفتوح</SelectItem><SelectItem value="in_progress">قيد التنفيذ</SelectItem><SelectItem value="fulfilled">تمت المساعدة</SelectItem><SelectItem value="partially_fulfilled">تمت جزئياً</SelectItem><SelectItem value="not_fulfilled">لم تتم</SelectItem></SelectContent></Select><Button disabled={terminal || updateStatus.isPending || selectedStatus === request.helpStatus} onClick={() => { if (['fulfilled','partially_fulfilled','not_fulfilled'].includes(selectedStatus)) setConfirmStatus(selectedStatus); else void saveStatus(selectedStatus) }}>حفظ الحالة</Button></div>{terminal ? <p className="mt-2 text-xs text-muted-foreground">الطلب في حالة نهائية ولا يمكن إعادة فتحه من لوحة المنظمة.</p> : null}</div>
    <div><h3 className="mb-3 font-semibold">العروض الواردة</h3>{offersQuery.isLoading ? <DetailsLoadingSkeleton /> : offers.length === 0 ? <EmptyState icon="donors" title="لم تصل أي عروض مساعدة حتى الآن" description="ستظهر العروض الجديدة هنا." /> : <div className="overflow-x-auto rounded-xl border bg-card"><Table><TableHeader><TableRow><TableHead>المساعد</TableHead><TableHead>النوع</TableHead><TableHead>الرسالة</TableHead><TableHead>الحالة</TableHead><TableHead>التاريخ</TableHead><TableHead>الإجراءات</TableHead></TableRow></TableHeader><TableBody>{offers.map(offer=><TableRow key={offer.id}><TableCell>{offer.helper.name ?? '-'}</TableCell><TableCell>{offer.type ?? '-'}</TableCell><TableCell className="max-w-xs">{offer.description ?? '-'}</TableCell><TableCell><Badge variant="outline">{offerLabels[offer.status] ?? offer.status}</Badge></TableCell><TableCell>{offer.createdAt ? new Date(offer.createdAt).toLocaleDateString('ar-SY') : '-'}</TableCell><TableCell><OfferActions offer={offer} /></TableCell></TableRow>)}</TableBody></Table></div>}</div>
    <Dialog open={Boolean(confirmStatus)} onOpenChange={(open) => { if (!open) setConfirmStatus(null) }}>
      <DialogContent dir="rtl"><DialogHeader><DialogTitle>تأكيد نتيجة طلب المساعدة</DialogTitle><DialogDescription>سيتم تحويل الطلب إلى حالة نهائية وقد تتوقف إجراءات المطابقة الجديدة. هل تريد المتابعة؟</DialogDescription></DialogHeader><DialogFooter className="gap-2 sm:gap-0"><Button variant="outline" onClick={() => setConfirmStatus(null)}>إلغاء</Button><Button onClick={() => confirmStatus && void saveStatus(confirmStatus)} disabled={updateStatus.isPending}>تأكيد النتيجة</Button></DialogFooter></DialogContent>
    </Dialog>
  </section>
}
