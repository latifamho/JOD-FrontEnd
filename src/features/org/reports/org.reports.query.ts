'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orgReportsServices } from './org.reports.services'
import { orgReportsKeys } from './org.reports.query-keys'
import type { OrgReportsParams, UpdateOrgReportStatusRequest } from './org.reports.types'

export function useOrgReports(params: OrgReportsParams) {
  return useQuery({ queryKey: orgReportsKeys.list(params), queryFn: () => orgReportsServices.getReports(params) })
}

export function useUpdateOrgReportStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ reportId, body }: { reportId: string; body: UpdateOrgReportStatusRequest }) => orgReportsServices.updateStatus(reportId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orgReportsKeys.lists() }),
  })
}
