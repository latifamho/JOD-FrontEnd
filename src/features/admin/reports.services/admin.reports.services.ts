import { api } from '@/services/api'
import { buildListParams } from '@/lib/build-list-params'
import type {
  AdminReportDetailResponse,
  AdminReportsParams,
  AdminReportsResponse,
  ClaimReportResponse,
  CloseReportResponse,
  WaitReportRequest,
  WaitReportResponse,
} from './admin.reports.types'

const ENDPOINTS = {
  REPORTS: '/admin/reports',
  REPORT_DETAIL: (id: string) => `/admin/reports/${id}`,
  CLAIM: (id: string) => `/admin/reports/${id}/claim`,
  REQUEST_INFO: (id: string) => `/admin/reports/${id}/request-info`,
  CLOSE: (id: string) => `/admin/reports/${id}/close`,
} as const

function buildParams(params: AdminReportsParams): Record<string, unknown> {
  return buildListParams(params)
}

export const adminReportsServices = {
  async getReports(params: AdminReportsParams): Promise<AdminReportsResponse> {
    const response = await api.get<AdminReportsResponse>(ENDPOINTS.REPORTS, {
      params: buildParams(params),
    })
    return response.data
  },

  async getReportById(reportId: string): Promise<AdminReportDetailResponse> {
    const response = await api.get<AdminReportDetailResponse>(
      ENDPOINTS.REPORT_DETAIL(reportId),
    )
    return response.data
  },

  async claimReport(reportId: string): Promise<ClaimReportResponse> {
    const response = await api.post<ClaimReportResponse>(ENDPOINTS.CLAIM(reportId), undefined, { successMessageKey: 'claimed' })
    return response.data
  },

  async waitReport(reportId: string, body: WaitReportRequest): Promise<WaitReportResponse> {
    const response = await api.post<WaitReportResponse>(ENDPOINTS.REQUEST_INFO(reportId), body, { successMessageKey: 'infoRequested' })
    return response.data
  },

  async closeReport(reportId: string): Promise<CloseReportResponse> {
    const response = await api.post<CloseReportResponse>(ENDPOINTS.CLOSE(reportId), undefined, { successMessageKey: 'closed' })
    return response.data
  },
}
