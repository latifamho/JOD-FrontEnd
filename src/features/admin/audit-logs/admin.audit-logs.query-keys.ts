import type { AdminAuditLogsParams } from './admin.audit-logs.types'

export const adminAuditLogsKeys = {
  all: ['admin', 'audit-logs'] as const,
  lists: () => [...adminAuditLogsKeys.all, 'list'] as const,
  list: (params: AdminAuditLogsParams) => [...adminAuditLogsKeys.lists(), params] as const,
}
