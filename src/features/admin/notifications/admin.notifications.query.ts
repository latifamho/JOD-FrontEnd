'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { adminNotificationsServices } from './admin.notifications.services'
import { adminNotificationsKeys } from './admin.notifications.query-keys'
import type {
  AdminNotificationsParams,
  NotificationCreateRequest,
  NotificationReadStateRequest,
} from './admin.notifications.types'

export function useAdminNotifications(params: AdminNotificationsParams) {
  return useQuery({
    queryKey: adminNotificationsKeys.list(params),
    queryFn: () => adminNotificationsServices.getNotifications(params),
  })
}

export function useCreateAdminNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: NotificationCreateRequest) => adminNotificationsServices.createNotification(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminNotificationsKeys.lists() })
    },
  })
}

export function useUpdateAdminNotificationReadState() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ notificationId, body }: { notificationId: string; body: NotificationReadStateRequest }) =>
      adminNotificationsServices.updateReadState(notificationId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminNotificationsKeys.lists() })
    },
  })
}

export function useResendAdminNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (notificationId: string) => adminNotificationsServices.resendNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminNotificationsKeys.lists() })
    },
  })
}

export function useDeleteAdminNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (notificationId: string) => adminNotificationsServices.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminNotificationsKeys.lists() })
    },
  })
}
