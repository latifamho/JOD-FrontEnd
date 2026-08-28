'use client'

import * as React from 'react'

import { EmptyState, ListLoadingSkeleton, PaginationControls } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constant/pagination'
import {
  useAgreeDonation,
  useCancelDonation,
  useCompleteDonation,
  useOrgDonation,
  useOrgDonations,
  useStartDonationContact,
} from '@/features/org/donations/org.donations.query'
import type { OrgDonationStatus } from '@/features/org/donations/org.donations.types'
import { PAGINATION_DOTS, type PaginationItem } from '@/hooks/use-pagination'
import { formatUtcDateTimeOrDash } from '@/lib/date'
import { useAuth } from '@/providers/AuthProvider'

const statusLabels: Record<OrgDonationStatus, string> = {
  pending: 'بانتظار التواصل',
  contacting: 'جاري التواصل',
  agreed: 'تم الاتفاق',
  completed: 'مكتمل',
  cancelled: 'ملغي',
}

const allStatuses: Array<{ value: 'all' | OrgDonationStatus; label: string }> = [
  { value: 'all', label: 'كل الحالات' },
  ...Object.entries(statusLabels).map(([value, label]) => ({
    value: value as OrgDonationStatus,
    label,
  })),
]

function createPaginationRange(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }
  if (currentPage <= 4) return [1, 2, 3, 4, 5, PAGINATION_DOTS, totalPages]
  if (currentPage >= totalPages - 3) {
    return [
      1,
      PAGINATION_DOTS,
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
  }
  return [
    1,
    PAGINATION_DOTS,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    PAGINATION_DOTS,
    totalPages,
  ]
}

export function OrganizationDonationsPage() {
  const { can } = useAuth()
  const canView = can('org.donors.view')
  const canUpdate = can('org.donors.update')
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE)
  const [status, setStatus] = React.useState<'all' | OrgDonationStatus>('all')
  const [campaignId, setCampaignId] = React.useState('')
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [cancelReason, setCancelReason] = React.useState('')
  const [completeDialogOpen, setCompleteDialogOpen] = React.useState(false)

  const list = useOrgDonations(
    {
      page,
      perPage: pageSize,
      status: status === 'all' ? undefined : status,
      campaignId: campaignId.trim() || undefined,
    },
    canView,
  )
  const detail = useOrgDonation(selectedId, canView)
  const contact = useStartDonationContact()
  const agree = useAgreeDonation()
  const complete = useCompleteDonation()
  const cancel = useCancelDonation()
  const donation = detail.data
  const busy =
    contact.isPending || agree.isPending || complete.isPending || cancel.isPending
  const totalPages = Math.max(1, list.data?.meta.lastPage ?? 1)
  const currentPage = Math.min(Math.max(1, list.data?.meta.currentPage ?? page), totalPages)
  const paginationRange = createPaginationRange(currentPage, totalPages)

  const closeDetails = () => {
    setSelectedId(null)
    setCancelReason('')
    setCompleteDialogOpen(false)
  }

  if (!canView) {
    return (
      <section className="flex flex-1 flex-col gap-4">
        <EmptyState
          icon="ShieldOff"
          title="لا تملك صلاحية عرض طلبات التبرع"
          description="اطلب من مالك المنظمة منحك صلاحية عرض المتبرعين وطلبات التبرع."
        />
      </section>
    )
  }

  return (
    <section className="flex flex-1 flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold">إدارة طلبات التبرع</h2>
        <p className="text-sm text-muted-foreground">
          تابع طلب التبرع من الإرسال حتى تأكيد الاستلام. لا تُحتسب المبالغ قبل حالة مكتمل.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value as typeof status)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            {allStatuses.map((item) => (
              <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          className="w-64"
          value={campaignId}
          onChange={(event) => {
            setCampaignId(event.target.value)
            setPage(1)
          }}
          placeholder="معرّف الحملة - اختياري"
        />
      </div>

      {list.isError ? (
        <div className="flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="flex-1 text-sm text-destructive">تعذّر تحميل طلبات التبرع. حاول مرة أخرى.</p>
          <Button type="button" size="sm" variant="outline" onClick={() => list.refetch()}>
            إعادة المحاولة
          </Button>
        </div>
      ) : null}

      {list.isLoading ? (
        <ListLoadingSkeleton />
      ) : list.data?.data.length ? (
        <div className="overflow-auto rounded-md border border-border shadow-xs">
          <Table className="min-w-[900px] bg-background">
            <TableHeader className="bg-muted/35">
              <TableRow>
                <TableHead>المتبرع</TableHead>
                <TableHead>الحملة</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>التواصل</TableHead>
                <TableHead>تاريخ الطلب</TableHead>
                <TableHead>التفاصيل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.data.data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="font-medium">{row.name}</p>
                      {row.isAnonymous ? <AnonymousBadge /> : null}
                    </div>
                    <p className="text-xs text-muted-foreground">{row.phone || row.email || '-'}</p>
                  </TableCell>
                  <TableCell>{row.campaignTitle}</TableCell>
                  <TableCell>{Number(row.amount).toLocaleString('ar-SY')}</TableCell>
                  <TableCell><Badge variant="outline">{statusLabels[row.status]}</Badge></TableCell>
                  <TableCell>{row.contactMethod || '-'}</TableCell>
                  <TableCell>{formatUtcDateTimeOrDash(row.createdAt)}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => setSelectedId(row.id)}>عرض</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState
          icon="donors"
          title="لا توجد طلبات تبرع"
          description="ستظهر هنا طلبات التبرع اليدوية عند إرسالها من التطبيق."
        />
      )}

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        hasPreviousPage={currentPage > 1}
        hasNextPage={currentPage < totalPages}
        paginationRange={paginationRange}
        onPageChange={setPage}
        onPreviousPage={() => setPage((value) => Math.max(1, value - 1))}
        onNextPage={() => setPage((value) => Math.min(totalPages, value + 1))}
        pageSize={pageSize}
        onPageSizeChange={(value) => {
          setPageSize(value)
          setPage(1)
        }}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
      />

      <Sheet open={Boolean(selectedId)} onOpenChange={(open) => { if (!open) closeDetails() }}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl" side="left" dir="rtl">
          <SheetHeader>
            <SheetTitle>تفاصيل طلب التبرع</SheetTitle>
            <SheetDescription>
              الإجراءات المتاحة تعتمد على الحالة الحالية وصلاحية تعديل المتبرعين.
            </SheetDescription>
          </SheetHeader>

          {detail.isLoading ? (
            <div className="p-4"><ListLoadingSkeleton /></div>
          ) : donation ? (
            <div className="space-y-5 p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Field label="المتبرع" value={donation.name} />
                <Field label="الحالة" value={statusLabels[donation.status]} />
                <Field label="الهاتف" value={donation.phone} />
                <Field label="البريد" value={donation.email} />
                <Field label="المدينة" value={donation.city} />
                <Field label="المبلغ" value={Number(donation.amount).toLocaleString('ar-SY')} />
                <Field label="طريقة التواصل" value={donation.contactMethod} />
                <Field label="طريقة الدفع" value={donation.paymentMethod} />
              </div>

              {donation.isAnonymous ? (
                <div className="space-y-1 rounded-md border border-dashed p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">الخصوصية العامة</span>
                    <Badge variant="secondary">مجهول علنًا</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    بيانات المتبرع أعلاه متاحة لكم لإدارة التبرع والتواصل معه، لكن لا يجب إظهار
                    هويته في أي محتوى عام.
                  </p>
                </div>
              ) : null}

              {donation.notes ? (
                <div className="rounded-md bg-muted p-3 text-sm">
                  <p className="text-muted-foreground">ملاحظات المتبرع</p>
                  <p>{donation.notes}</p>
                </div>
              ) : null}

              <div className="space-y-2 text-xs text-muted-foreground">
                <p>إنشاء: {formatUtcDateTimeOrDash(donation.createdAt)}</p>
                <p>بدء التواصل: {formatUtcDateTimeOrDash(donation.contactedAt)}</p>
                <p>الاتفاق: {formatUtcDateTimeOrDash(donation.agreedAt)}</p>
                <p>الاكتمال: {formatUtcDateTimeOrDash(donation.completedAt)}</p>
                <p>الإلغاء: {formatUtcDateTimeOrDash(donation.cancelledAt)}</p>
              </div>

              {canUpdate ? (
                <div className="flex flex-wrap gap-2">
                  {donation.status === 'pending' ? (
                    <Button disabled={busy} onClick={() => contact.mutate(donation.id)}>بدء التواصل</Button>
                  ) : null}
                  {donation.status === 'contacting' ? (
                    <Button disabled={busy} onClick={() => agree.mutate(donation.id)}>تم الاتفاق</Button>
                  ) : null}
                  {donation.status === 'agreed' ? (
                    <Button disabled={busy} onClick={() => setCompleteDialogOpen(true)}>تأكيد الاستلام</Button>
                  ) : null}
                </div>
              ) : null}

              {canUpdate && ['pending', 'contacting', 'agreed'].includes(donation.status) ? (
                <div className="space-y-2 border-t pt-4">
                  <Textarea
                    value={cancelReason}
                    onChange={(event) => setCancelReason(event.target.value)}
                    placeholder="سبب الإلغاء"
                  />
                  <Button
                    variant="destructive"
                    disabled={busy || !cancelReason.trim()}
                    onClick={() => cancel.mutate(
                      { id: donation.id, reason: cancelReason.trim() },
                      { onSuccess: () => setCancelReason('') },
                    )}
                  >
                    إلغاء الطلب
                  </Button>
                </div>
              ) : null}

              {!canUpdate ? (
                <p className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                  لديك صلاحية عرض الطلب فقط. تحتاج صلاحية تعديل المتبرعين لتنفيذ انتقالات الحالة.
                </p>
              ) : null}

              {donation.cancelReason ? (
                <p className="text-sm text-destructive">سبب الإلغاء: {donation.cancelReason}</p>
              ) : null}
            </div>
          ) : (
            <p className="p-4 text-destructive">تعذر تحميل الطلب.</p>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تأكيد استلام التبرع</DialogTitle>
            <DialogDescription>
              سيتم احتساب المبلغ ضمن إجمالي الحملة بعد نجاح هذا الإجراء فقط. هل تريد المتابعة؟
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="outline"
              disabled={complete.isPending}
              onClick={() => setCompleteDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              disabled={!donation || donation.status !== 'agreed' || complete.isPending}
              onClick={() => {
                if (!donation || donation.status !== 'agreed') return
                complete.mutate(donation.id, { onSuccess: () => setCompleteDialogOpen(false) })
              }}
            >
              تأكيد الاستلام
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

function AnonymousBadge() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className="cursor-default">
            مجهول علنًا
          </Badge>
        </TooltipTrigger>
        <TooltipContent>اختار المتبرع عدم إظهار هويته علنًا.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function Field({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div>
      <span className="text-muted-foreground">{label}</span>
      <p>{value ?? '-'}</p>
    </div>
  )
}
