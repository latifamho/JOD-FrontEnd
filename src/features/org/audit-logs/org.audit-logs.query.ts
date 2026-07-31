'use client'

import { useQuery } from '@tanstack/react-query'
import { orgAuditLogsServices } from './org.audit-logs.services'
import type { OrgAuditLogsParams } from './org.audit-logs.types'

export function useOrgAuditLogs(params: OrgAuditLogsParams) {
  return useQuery({
    queryKey: ['org', 'audit-logs', params],
    queryFn: () => orgAuditLogsServices.getAuditLogs(params),
  })
}
