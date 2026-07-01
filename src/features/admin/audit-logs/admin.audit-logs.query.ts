'use client'

import { useQuery } from '@tanstack/react-query'

import { adminAuditLogsServices } from './admin.audit-logs.services'
import { adminAuditLogsKeys } from './admin.audit-logs.query-keys'
import type { AdminAuditLogsParams } from './admin.audit-logs.types'

export function useAdminAuditLogs(params: AdminAuditLogsParams) {
  return useQuery({
    queryKey: adminAuditLogsKeys.list(params),
    queryFn: () => adminAuditLogsServices.getAuditLogs(params),
  })
}
