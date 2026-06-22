'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { adminReportsServices } from './admin.reports.services'
import { adminReportsKeys } from './admin.reports.query-keys'
import type { AdminReportsParams } from './admin.reports.types'

export function useAdminReports(params: AdminReportsParams) {
  return useQuery({
    queryKey: adminReportsKeys.list(params),
    queryFn: () => adminReportsServices.getReports(params),
  })
}

export function useClaimReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (reportId: string) => adminReportsServices.claimReport(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminReportsKeys.lists() })
    },
  })
}

export function useWaitReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (reportId: string) => adminReportsServices.waitReport(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminReportsKeys.lists() })
    },
  })
}

export function useCloseReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (reportId: string) => adminReportsServices.closeReport(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminReportsKeys.lists() })
    },
  })
}
