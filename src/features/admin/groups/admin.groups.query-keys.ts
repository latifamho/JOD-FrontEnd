import type { AdminGroupsParams } from './admin.groups.types'

export const adminGroupsKeys = {
  all: ['admin', 'groups'] as const,
  lists: () => [...adminGroupsKeys.all, 'list'] as const,
  list: (params: AdminGroupsParams) => [...adminGroupsKeys.lists(), params] as const,
  detail: (groupId: string) => [...adminGroupsKeys.all, 'detail', groupId] as const,
}
