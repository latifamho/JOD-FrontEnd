import type { AdminUsersParams } from './admin.users.types'

export const adminUsersKeys = {
  all: ['admin', 'users'] as const,
  lists: () => [...adminUsersKeys.all, 'list'] as const,
  list: (params: AdminUsersParams) => [...adminUsersKeys.lists(), params] as const,
  details: () => [...adminUsersKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminUsersKeys.details(), id] as const,
}
