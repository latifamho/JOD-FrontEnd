'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState, ListLoadingSkeleton } from '@/components/shared'
import { useOrgHelpOfferAction, useOrgHelpOffers } from '@/features/org/help/org.help.query'
import type { HelpOfferStatus, OrgHelpOfferItem } from '@/features/org/help/org.help.types'
import { toast } from '@/lib/toast'
import { formatUtcDateTimeOrDash } from '@/lib/date'

const labels: Record<HelpOfferStatus, string> = {
  pending: 'بانتظار المراجعة',
  accepted: 'تم قبول العرض',
  contacting: 'جاري التواصل',
  agreed: 'تم الاتفاق',
  completed: 'مكتمل',
  rejected: 'مرفوض',
  cancelled: 'ملغي',
}

function Step({ done, children }: { done: boolean; children: React.ReactNode }) {
  return <p className={done ? 'text-xs font-medium text-primary' : 'text-xs text-muted-foreground'}>{done ? '✓' : '○'} {children}</p>
}

function OfferProgress({ offer }: { offer: OrgHelpOfferItem }) {
  return (
    <div className="min-w-56 space-y-1 rounded-md bg-muted/30 p-2">
      <Step done={Boolean(offer.createdAt)}>تم إرسال العرض</Step>
      <Step done={Boolean(offer.acceptedAt)}>تم قبول العرض</Step>
      <Step done={Boolean(offer.contactedAt)}>تم بدء التواصل</Step>
      <Step done={Boolean(offer.helperAgreedAt)}>المساعد أكد الاتفاق</Step>
      <Step done={Boolean(offer.receiverAgreedAt)}>المنظمة أكدت الاتفاق</Step>
      <Step done={Boolean(offer.helperConfirmedAt)}>المساعد أكد تقديم المساعدة</Step>
      <Step done={Boolean(offer.receiverConfirmedAt)}>تم تأكيد الاستلام</Step>
    </div>
  )
}

export function OrganizationHelpOffersPage() {
  const [status, setStatus] = React.useState('all')
  const query = useOrgHelpOffers({ perPage: 100, status: status === 'all' ? undefined : status as HelpOfferStatus })
  const action = useOrgHelpOfferAction()

  const run = async (id: string, name: 'accept' | 'reject' | 'contact' | 'agree' | 'confirm-received') => {
    try {
      await action.mutateAsync({ id, action: name })
      toast.success(
        name === 'accept' ? 'تم قبول عرض المساعدة.' :
        name === 'reject' ? 'تم رفض العرض.' :
        name === 'contact' ? 'تم تسجيل بدء التواصل.' :
        name === 'agree' ? 'تم تسجيل تأكيد المنظمة للاتفاق.' :
        'تم تأكيد استلام أو الاستفادة من المساعدة.',
      )
    } catch {
      toast.error('تعذر تنفيذ الإجراء.')
    }
  }

  const rows = query.data?.data ?? []

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">عروض المساعدة الواردة</h2>
        <p className="text-sm text-muted-foreground">تابع العرض من لحظة إرساله حتى قبول العرض والتواصل واتفاق الطرفين وتأكيد تقديم واستلام المساعدة.</p>
      </div>

      <div className="w-72">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الحالات</SelectItem>
            {Object.entries(labels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {query.isLoading ? <ListLoadingSkeleton /> : rows.length === 0 ? (
        <EmptyState icon="donors" title="لم تصل أي عروض مساعدة حتى الآن" description="ستظهر عروض المساعدة الواردة هنا." />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>الطلب</TableHead>
                <TableHead>المساعد</TableHead>
                <TableHead>العرض والتواصل</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>مسار التنفيذ</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((offer, index) => (
                <TableRow key={offer.id}>
                  <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                  <TableCell>
                    <p className="font-medium">{offer.request?.title ?? '-'}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatUtcDateTimeOrDash(offer.createdAt)}</p>
                  </TableCell>
                  <TableCell>{offer.helper.name ?? '-'}</TableCell>
                  <TableCell>
                    <div className="space-y-1 text-xs">
                      <p>النوع: {offer.type ?? '-'}</p>
                      {offer.amount != null ? <p>المبلغ: {offer.amount.toLocaleString('ar-SY')} ل.س</p> : null}
                      {offer.contactValue ? <p dir="ltr" className="text-muted-foreground">{offer.contactMethod ?? '-'} • {offer.contactValue}</p> : <p className="text-muted-foreground">بيانات التواصل تظهر بعد قبول العرض</p>}
                    </div>
                  </TableCell>
                  <TableCell><Badge variant={offer.status === 'completed' ? 'default' : offer.status === 'rejected' || offer.status === 'cancelled' ? 'destructive' : 'outline'}>{labels[offer.status] ?? offer.status}</Badge></TableCell>
                  <TableCell><OfferProgress offer={offer} /></TableCell>
                  <TableCell>
                    <div className="flex min-w-40 flex-col gap-1">
                      {offer.can.accept ? <Button size="sm" disabled={action.isPending} onClick={() => void run(offer.id, 'accept')}>قبول العرض</Button> : null}
                      {offer.can.reject ? <Button size="sm" variant="destructive" disabled={action.isPending} onClick={() => void run(offer.id, 'reject')}>رفض العرض</Button> : null}
                      {offer.can.contact ? <Button size="sm" variant="outline" disabled={action.isPending} onClick={() => void run(offer.id, 'contact')}>تم بدء التواصل</Button> : null}
                      {offer.can.agree ? <Button size="sm" variant="outline" disabled={action.isPending} onClick={() => void run(offer.id, 'agree')}>تأكيد التوصل لاتفاق</Button> : null}
                      {offer.can.confirmReceived ? <Button size="sm" disabled={action.isPending} onClick={() => void run(offer.id, 'confirm-received')}>تأكيد الاستلام أو الاستفادة</Button> : null}
                      {!offer.can.accept && !offer.can.reject && !offer.can.contact && !offer.can.agree && !offer.can.confirmReceived ? <span className="text-xs text-muted-foreground">لا يوجد إجراء مطلوب حالياً</span> : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  )
}
