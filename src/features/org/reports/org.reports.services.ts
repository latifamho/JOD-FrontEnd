import { api } from '@/services/api'
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
  const flat: Record<string, unknown> = {}
  if (params.page !== undefined) flat.page = params.page
  if (params.perPage !== undefined) flat.perPage = params.perPage
  if (params.sort) flat.sort = params.sort
  if (params.filter) {
    for (const [key, value] of Object.entries(params.filter)) {
      if (value !== undefined && value !== '') flat[`filter.${key}`] = value
    }
  }
  return flat
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
