import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'

export type OrgReportStatus = 'new' | 'in_progress' | 'waiting_response' | 'closed'

export interface OrgReportItem {
  id: string
  title: string
  description: string
  status: OrgReportStatus
  severity: string
  entityType: string
  entityId: string | null
  organizationName: string | null
  reporterName: string | null
  createdAt: string
  closedAt: string | null
}

export interface OrgReportsParams {
  page?: number
  perPage?: number
  sort?: string
  filter?: { status?: OrgReportStatus; category?: string }
}

export interface UpdateOrgReportStatusRequest {
  status: Exclude<OrgReportStatus, 'new'>
  note?: string
  assigneeId?: string
}

export type OrgReportsResponse = ApiListResponse<OrgReportItem>
export type OrgReportDetailResponse = ApiSingleResponse<OrgReportItem>
export type UpdateOrgReportStatusResponse = ApiMutationResponse<OrgReportItem>
