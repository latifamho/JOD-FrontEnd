import { api } from '@/services/api'
import type { AdminAuditLogsParams, AdminAuditLogsResponse } from './admin.audit-logs.types'

const ENDPOINTS = {
  AUDIT_LOGS: '/admin/audit-logs',
} as const

function buildParams(params: AdminAuditLogsParams): Record<string, unknown> {
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

export const adminAuditLogsServices = {
  async getAuditLogs(params: AdminAuditLogsParams): Promise<AdminAuditLogsResponse> {
    const response = await api.get<AdminAuditLogsResponse>(ENDPOINTS.AUDIT_LOGS, {
      params: buildParams(params),
    })
    return response.data
  },
}
