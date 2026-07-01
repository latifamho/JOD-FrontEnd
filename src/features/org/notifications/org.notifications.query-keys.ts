import type { OrgNotificationsParams } from './org.notifications.types'

export const orgNotificationsKeys = {
  all: ['org', 'notifications'] as const,
  lists: () => [...orgNotificationsKeys.all, 'list'] as const,
  list: (params: OrgNotificationsParams) => [...orgNotificationsKeys.lists(), params] as const,
  details: () => [...orgNotificationsKeys.all, 'detail'] as const,
  detail: (id: string) => [...orgNotificationsKeys.details(), id] as const,
}
