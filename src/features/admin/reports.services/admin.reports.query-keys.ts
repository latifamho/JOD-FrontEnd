import type { AdminReportsParams } from './admin.reports.types'

export const adminReportsKeys = {
  all: ['admin', 'reports'] as const,
  lists: () => [...adminReportsKeys.all, 'list'] as const,
  list: (params: AdminReportsParams) => [...adminReportsKeys.lists(), params] as const,
}
