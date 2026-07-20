import { api } from '@/services/api'
import { buildListParams } from '@/lib/build-list-params'
import type {
  OrgReportsParams,
  OrgReportsResponse,
  OrgReportDetailResponse,
} from './org.reports.types'

const ENDPOINTS = {
  REPORTS: '/org/reports',
  REPORT: (id: string) => `/org/reports/${id}`,
} as const

function buildParams(params: OrgReportsParams): Record<string, unknown> {
  return buildListParams(params)
}

export const orgReportsServices = {
  async getReports(params: OrgReportsParams): Promise<OrgReportsResponse> {
    const response = await api.get<OrgReportsResponse>(ENDPOINTS.REPORTS, {
      params: buildParams(params),
    })
    return response.data
  },

  async getReportById(reportId: string): Promise<OrgReportDetailResponse> {
    const response = await api.get<OrgReportDetailResponse>(ENDPOINTS.REPORT(reportId))
    return response.data
  },
}
