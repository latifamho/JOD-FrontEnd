import type { ApiListResponse } from '@/types/api.types'
import type { AuditLogEntry } from '@/components/pages/audit-log/audit-log.data'

export interface OrgAuditLogsParams {
  page?: number
  perPage?: number
  sort?: string
  filter?: { actorUserId?: string; action?: string; from?: string; to?: string }
}

export type OrgAuditLogsResponse = ApiListResponse<AuditLogEntry>
