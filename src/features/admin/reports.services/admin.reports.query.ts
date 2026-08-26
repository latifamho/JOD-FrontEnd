'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminReportsServices } from './admin.reports.services'
import { adminReportsKeys } from './admin.reports.query-keys'
import type { AdminReportsParams, ClaimReportRequest, CloseReportRequest } from './admin.reports.types'
export function useAdminReports(params: AdminReportsParams) { return useQuery({ queryKey: adminReportsKeys.list(params), queryFn: () => adminReportsServices.getReports(params) }) }
export function useAdminReportDetail(reportId: string | null) { return useQuery({ queryKey: adminReportsKeys.detail(reportId ?? ''), queryFn: () => adminReportsServices.getReportById(reportId!), enabled: !!reportId }) }
export function useClaimReport() { const q = useQueryClient(); return useMutation({ mutationFn: ({ reportId, body = {} }: { reportId: string; body?: ClaimReportRequest }) => adminReportsServices.claimReport(reportId, body), onSuccess: (_d,{reportId}) => { q.invalidateQueries({queryKey:adminReportsKeys.lists()}); q.invalidateQueries({queryKey:adminReportsKeys.detail(reportId)}) } }) }
export function useCloseReport() { const q = useQueryClient(); return useMutation({ mutationFn: ({ reportId, body = {} }: { reportId: string; body?: CloseReportRequest }) => adminReportsServices.closeReport(reportId, body), onSuccess: (_d,{reportId}) => { q.invalidateQueries({queryKey:adminReportsKeys.lists()}); q.invalidateQueries({queryKey:adminReportsKeys.detail(reportId)}) } }) }
