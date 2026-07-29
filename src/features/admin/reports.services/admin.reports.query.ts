'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { adminReportsServices } from './admin.reports.services'
import { adminReportsKeys } from './admin.reports.query-keys'
import type {
  AdminReportsParams,
  ClaimReportRequest,
  CloseReportRequest,
  WaitReportRequest,
} from './admin.reports.types'

export function useAdminReports(params: AdminReportsParams) {
  return useQuery({
    queryKey: adminReportsKeys.list(params),
    queryFn: () => adminReportsServices.getReports(params),
  })
}

export function useAdminReportDetail(reportId: string | null) {
  return useQuery({
    queryKey: adminReportsKeys.detail(reportId ?? ''),
    queryFn: () => adminReportsServices.getReportById(reportId!),
    enabled: !!reportId,
  })
}

export function useClaimReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ reportId, body = {} }: { reportId: string; body?: ClaimReportRequest }) =>
      adminReportsServices.claimReport(reportId, body),
    onSuccess: (_data, { reportId }) => {
      queryClient.invalidateQueries({ queryKey: adminReportsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: adminReportsKeys.detail(reportId) })
    },
  })
}

export function useWaitReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ reportId, body }: { reportId: string; body: WaitReportRequest }) =>
      adminReportsServices.waitReport(reportId, body),
    onSuccess: (_data, { reportId }) => {
      queryClient.invalidateQueries({ queryKey: adminReportsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: adminReportsKeys.detail(reportId) })
    },
  })
}

export function useCloseReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ reportId, body = {} }: { reportId: string; body?: CloseReportRequest }) =>
      adminReportsServices.closeReport(reportId, body),
    onSuccess: (_data, { reportId }) => {
      queryClient.invalidateQueries({ queryKey: adminReportsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: adminReportsKeys.detail(reportId) })
    },
  })
}
