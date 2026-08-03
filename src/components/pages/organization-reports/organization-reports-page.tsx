'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ListLoadingSkeleton, PaginationControls } from '@/components/shared'
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constant/pagination'
import { useOrgReports, useUpdateOrgReportStatus } from '@/features/org/reports/org.reports.query'
import type { OrgReportStatus } from '@/features/org/reports/org.reports.types'
import { usePagination } from '@/hooks/use-pagination'
import { formatUtcDateTime } from '@/lib/date'
import { useAuth } from '@/providers/AuthProvider'

const statusLabels: Record<OrgReportStatus, string> = {
  new: 'جديد',
  in_progress: 'قيد المعالجة',
  waiting_response: 'بانتظار الرد',
  closed: 'مغلق',
}

export function OrganizationReportsPage() {
  const { can } = useAuth()
  const canUpdate = can('org.reports.update')
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE)
  const [total, setTotal] = React.useState(0)
  const pagination = usePagination({ totalItems: total, pageSize })
  const reports = useOrgReports({ page: pagination.currentPage, perPage: pageSize, sort: '-submittedAt' })
  const updateStatus = useUpdateOrgReportStatus()

  React.useEffect(() => setTotal(reports.data?.meta.total ?? 0), [reports.data?.meta.total])
  const rows = reports.data?.data ?? []

  const allowedStatuses = (status: OrgReportStatus): Exclude<OrgReportStatus, 'new'>[] => {
    if (status === 'new') return ['in_progress']
    if (status === 'in_progress') return ['waiting_response', 'closed']
    if (status === 'waiting_response') return ['closed']
    return []
  }

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold">بلاغات المؤسسة</h2>
        <p className="mt-1 text-xs text-muted-foreground">عرض البلاغات المرتبطة بالمؤسسة وتحديث مسار معالجتها حسب الصلاحية.</p>
      </div>

      {reports.isError ? <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">تعذر تحميل البلاغات.</div> : null}

      {reports.isLoading ? (
        <ListLoadingSkeleton />
      ) : (
      <div className="overflow-auto rounded-md border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>العنوان</TableHead><TableHead>الخطورة</TableHead><TableHead>الحالة</TableHead><TableHead>المبلّغ</TableHead><TableHead>التاريخ</TableHead><TableHead>الإجراء</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell><p className="font-medium">{row.title}</p><p className="mt-1 max-w-md text-xs text-muted-foreground">{row.description}</p></TableCell>
                <TableCell><Badge variant="outline">{row.severity}</Badge></TableCell>
                <TableCell><Badge variant="secondary">{statusLabels[row.status]}</Badge></TableCell>
                <TableCell>{row.reporterName ?? '-'}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatUtcDateTime(row.createdAt)}</TableCell>
                <TableCell>
                  {canUpdate && allowedStatuses(row.status).length > 0 ? (
                    <Select onValueChange={(status) => updateStatus.mutate({ reportId: row.id, body: { status: status as Exclude<OrgReportStatus, 'new'> } })}>
                      <SelectTrigger className="w-40"><SelectValue placeholder="تحديث الحالة" /></SelectTrigger>
                      <SelectContent>{allowedStatuses(row.status).map((status) => <SelectItem key={status} value={status}>{statusLabels[status]}</SelectItem>)}</SelectContent>
                    </Select>
                  ) : <Button variant="ghost" size="sm" disabled>لا يوجد إجراء</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      )}

      <PaginationControls currentPage={pagination.currentPage} totalPages={pagination.totalPages} hasPreviousPage={pagination.hasPreviousPage} hasNextPage={pagination.hasNextPage} paginationRange={pagination.paginationRange} onPageChange={pagination.goToPage} onPreviousPage={pagination.goToPreviousPage} onNextPage={pagination.goToNextPage} pageSize={pageSize} onPageSizeChange={setPageSize} pageSizeOptions={PAGE_SIZE_OPTIONS} />
    </section>
  )
}
