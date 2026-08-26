import { api } from '@/services/api'
import { buildApiParams } from '@/lib/build-api-params'
import type { AdminReportDetailResponse, AdminReportsParams, AdminReportsResponse, ClaimReportRequest, ClaimReportResponse, CloseReportRequest, CloseReportResponse } from './admin.reports.types'
const ENDPOINTS = { REPORTS: '/admin/reports', REPORT_DETAIL: (id: string) => `/admin/reports/${id}`, CLAIM: (id: string) => `/admin/reports/${id}/claim`, CLOSE: (id: string) => `/admin/reports/${id}/close` } as const
export const adminReportsServices = {
 async getReports(params: AdminReportsParams): Promise<AdminReportsResponse> { const response = await api.get<AdminReportsResponse>(ENDPOINTS.REPORTS, { params: buildApiParams(params) }); return response.data },
 async getReportById(reportId: string): Promise<AdminReportDetailResponse> { const response = await api.get<AdminReportDetailResponse>(ENDPOINTS.REPORT_DETAIL(reportId)); return response.data },
 async claimReport(reportId: string, body: ClaimReportRequest = {}): Promise<ClaimReportResponse> { const response = await api.post<ClaimReportResponse>(ENDPOINTS.CLAIM(reportId), body, { successMessageKey: 'claimed' }); return response.data },
 async closeReport(reportId: string, body: CloseReportRequest = {}): Promise<CloseReportResponse> { const response = await api.post<CloseReportResponse>(ENDPOINTS.CLOSE(reportId), body, { successMessageKey: 'closed' }); return response.data },
}
