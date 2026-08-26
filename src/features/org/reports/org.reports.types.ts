import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'
import type { ReportItem, ReportStatus } from '@/components/pages/reports-management/reports-management.types'
export type OrgReportStatus=ReportStatus
export type OrgReportItem=ReportItem
export interface OrgReportsParams { page?:number; perPage?:number; sort?:string; filter?:{status?:OrgReportStatus;category?:string} }
export interface ClaimOrgReportRequest { assigneeId?:string; note?:string }
export interface CloseOrgReportRequest { note?:string }
export type OrgReportsResponse=ApiListResponse<OrgReportItem>
export type OrgReportDetailResponse=ApiSingleResponse<OrgReportItem>
export type OrgReportMutationResponse=ApiMutationResponse<OrgReportItem>
