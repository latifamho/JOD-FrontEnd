import type { ApiListResponse } from '@/types/api.types'
import type { AuditLogEntry } from '@/components/pages/audit-log/audit-log.data'

export interface AdminAuditLogsFilter {
  actorUserId?: string
  action?: string
  from?: string
  to?: string
}

export interface AdminAuditLogsParams {
  page?: number
  perPage?: number
  sort?: string
  filter?: AdminAuditLogsFilter
}

export type AdminAuditLogsResponse = ApiListResponse<AuditLogEntry>
