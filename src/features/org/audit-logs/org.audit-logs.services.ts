import { api } from '@/services/api'
import { buildListParams } from '@/lib/build-list-params'
import type { OrgAuditLogsParams, OrgAuditLogsResponse } from './org.audit-logs.types'

export const orgAuditLogsServices = {
  async getAuditLogs(params: OrgAuditLogsParams): Promise<OrgAuditLogsResponse> {
    const response = await api.get<OrgAuditLogsResponse>('/org/audit-logs', { params: buildListParams(params) })
    return response.data
  },
}
