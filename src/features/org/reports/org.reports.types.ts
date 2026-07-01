import type { ApiListResponse, ApiSingleResponse } from '@/types/api.types'
import type { OrgReportItem, OrgReportStatus } from '@/components/pages/organization-reports/static-data'

export interface OrgReportsFilter {
  status?: OrgReportStatus
  category?: OrgReportItem['category']
}

export interface OrgReportsParams {
  page?: number
  perPage?: number
  sort?: string
  filter?: OrgReportsFilter
}

export type OrgReportsResponse = ApiListResponse<OrgReportItem>
export type OrgReportDetailResponse = ApiSingleResponse<OrgReportItem>
