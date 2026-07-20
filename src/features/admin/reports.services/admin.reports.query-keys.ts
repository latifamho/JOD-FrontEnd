import type { AdminReportsParams } from './admin.reports.types'

export const adminReportsKeys = {
  all: ['admin', 'reports'] as const,
  lists: () => [...adminReportsKeys.all, 'list'] as const,
  list: (params: AdminReportsParams) => [...adminReportsKeys.lists(), params] as const,
  details: () => [...adminReportsKeys.all, 'detail'] as const,
  detail: (reportId: string) => [...adminReportsKeys.details(), reportId] as const,
}
