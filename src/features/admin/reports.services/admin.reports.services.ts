import { api } from '@/services/api'
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
  const flat: Record<string, unknown> = {}
  if (params.page !== undefined) flat.page = params.page
  if (params.perPage !== undefined) flat.perPage = params.perPage
  if (params.sortBy) flat.sortBy = params.sortBy
  if (params.filter) {
    for (const [key, value] of Object.entries(params.filter)) {
      if (value !== undefined && value !== '') {
        flat[`filter.${key}`] = value
      }
    }
  }
  return flat
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
    const response = await api.post<ClaimReportResponse>(ENDPOINTS.CLAIM(reportId))
    return response.data
  },

  async waitReport(reportId: string, body: WaitReportRequest): Promise<WaitReportResponse> {
    const response = await api.post<WaitReportResponse>(ENDPOINTS.REQUEST_INFO(reportId), body)
    return response.data
  },

  async closeReport(reportId: string): Promise<CloseReportResponse> {
    const response = await api.post<CloseReportResponse>(ENDPOINTS.CLOSE(reportId))
    return response.data
  },
}
