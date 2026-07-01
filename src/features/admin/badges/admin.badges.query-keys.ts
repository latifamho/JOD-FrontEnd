import type { AdminBadgesParams } from './admin.badges.types'

export const adminBadgesKeys = {
  all: ['admin', 'badges'] as const,
  lists: () => [...adminBadgesKeys.all, 'list'] as const,
  list: (params: AdminBadgesParams) => [...adminBadgesKeys.lists(), params] as const,
  details: () => [...adminBadgesKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminBadgesKeys.details(), id] as const,
}
