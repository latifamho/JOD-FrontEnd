import { api } from '@/services/api'
import { buildApiParams } from '@/lib/build-api-params'
import type { OrgReportsParams, OrgReportsResponse, OrgReportDetailResponse, UpdateOrgReportStatusRequest, UpdateOrgReportStatusResponse } from './org.reports.types'

const ENDPOINTS = {
  REPORTS: '/org/reports',
  REPORT: (id: string) => `/org/reports/${id}`,
  STATUS: (id: string) => `/org/reports/${id}/status`,
} as const

export const orgReportsServices = {
  async getReports(params: OrgReportsParams): Promise<OrgReportsResponse> {
    const response = await api.get<OrgReportsResponse>(ENDPOINTS.REPORTS, { params: buildApiParams(params) })
    return response.data
  },
  async getReportById(reportId: string): Promise<OrgReportDetailResponse> {
    const response = await api.get<OrgReportDetailResponse>(ENDPOINTS.REPORT(reportId))
    return response.data
  },
  async updateStatus(reportId: string, body: UpdateOrgReportStatusRequest): Promise<UpdateOrgReportStatusResponse> {
    const response = await api.patch<UpdateOrgReportStatusResponse>(ENDPOINTS.STATUS(reportId), body)
    return response.data
  },
}
