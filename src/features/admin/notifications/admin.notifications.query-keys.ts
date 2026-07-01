import type { AdminNotificationsParams } from './admin.notifications.types'

export const adminNotificationsKeys = {
  all: ['admin', 'notifications'] as const,
  lists: () => [...adminNotificationsKeys.all, 'list'] as const,
  list: (params: AdminNotificationsParams) => [...adminNotificationsKeys.lists(), params] as const,
  details: () => [...adminNotificationsKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminNotificationsKeys.details(), id] as const,
}
