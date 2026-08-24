import type { OrganizationVideosScope } from './organization-videos.types'

function targetKey(scope: OrganizationVideosScope, organizationId?: string): string {
  return scope === 'org' ? organizationId || 'self' : organizationId || 'missing'
}

export const organizationVideosKeys = {
  all: ['organization-videos'] as const,
  lists: () => [...organizationVideosKeys.all, 'list'] as const,
  list: (scope: OrganizationVideosScope, organizationId?: string) =>
    [...organizationVideosKeys.lists(), scope, targetKey(scope, organizationId)] as const,
}
