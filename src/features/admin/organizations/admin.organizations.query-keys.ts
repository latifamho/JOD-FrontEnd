import type { AdminOrganizationsParams } from './admin.organizations.types'

export const adminOrganizationsKeys = {
  all: ['admin', 'organizations'] as const,
  lists: () => [...adminOrganizationsKeys.all, 'list'] as const,
  list: (params: AdminOrganizationsParams) => [...adminOrganizationsKeys.lists(), params] as const,
  details: () => [...adminOrganizationsKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminOrganizationsKeys.details(), id] as const,
}
