import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'
import type {
  ReportEntityType,
  ReportItem,
  ReportSeverity,
  ReportStatus,
} from '@/components/pages/reports-management/reports-management.types'

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

export type AdminReportDetailResponse = ApiSingleResponse<ReportItem>

export interface WaitReportRequest {
  note: string
}

export type ClaimReportResponse = ApiMutationResponse
export type WaitReportResponse = ApiMutationResponse
export type CloseReportResponse = ApiMutationResponse
