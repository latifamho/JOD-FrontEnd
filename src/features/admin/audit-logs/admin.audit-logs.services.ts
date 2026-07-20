import { api } from '@/services/api'
import { buildListParams } from '@/lib/build-list-params'
import type { AdminAuditLogsParams, AdminAuditLogsResponse } from './admin.audit-logs.types'

const ENDPOINTS = {
  AUDIT_LOGS: '/admin/audit-logs',
} as const

function buildParams(params: AdminAuditLogsParams): Record<string, unknown> {
  return buildListParams(params)
}

export const adminAuditLogsServices = {
  async getAuditLogs(params: AdminAuditLogsParams): Promise<AdminAuditLogsResponse> {
    const response = await api.get<AdminAuditLogsResponse>(ENDPOINTS.AUDIT_LOGS, {
      params: buildParams(params),
    })
    return response.data
  },
}
