import type { ApiListResponse, ApiMutationResponse } from '@/types/api.types'
import type {
  ReportEntityType,
  ReportItem,
  ReportSeverity,
  ReportStatus,
} from '@/components/pages/reports-management/static-data'

export type ReportSortOption = 'created_at_newest' | 'created_at_oldest'

export interface AdminReportsFilter {
  status?: ReportStatus
  severity?: ReportSeverity
  entityType?: ReportEntityType
}

export interface AdminReportsParams {
  page?: number
  perPage?: number
  sortBy?: ReportSortOption
  filter?: AdminReportsFilter
}

export type AdminReportsResponse = ApiListResponse<ReportItem>

export type ClaimReportResponse = ApiMutationResponse
export type WaitReportResponse = ApiMutationResponse
export type CloseReportResponse = ApiMutationResponse
