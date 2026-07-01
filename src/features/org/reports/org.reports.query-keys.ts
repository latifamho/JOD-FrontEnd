import type { OrgReportsParams } from './org.reports.types'

export const orgReportsKeys = {
  all: ['org', 'reports'] as const,
  lists: () => [...orgReportsKeys.all, 'list'] as const,
  list: (params: OrgReportsParams) => [...orgReportsKeys.lists(), params] as const,
  details: () => [...orgReportsKeys.all, 'detail'] as const,
  detail: (id: string) => [...orgReportsKeys.details(), id] as const,
}
