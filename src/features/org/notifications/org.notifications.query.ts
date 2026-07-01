'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { orgNotificationsServices } from './org.notifications.services'
import { orgNotificationsKeys } from './org.notifications.query-keys'
import type {
  OrgNotificationsParams,
  OrgNotificationCreateRequest,
  OrgNotificationReadStateRequest,
} from './org.notifications.types'

export function useOrgNotifications(params: OrgNotificationsParams) {
  return useQuery({
    queryKey: orgNotificationsKeys.list(params),
    queryFn: () => orgNotificationsServices.getNotifications(params),
  })
}

export function useCreateOrgNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: OrgNotificationCreateRequest) => orgNotificationsServices.createNotification(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgNotificationsKeys.lists() })
    },
  })
}

export function useUpdateOrgNotificationReadState() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ notificationId, body }: { notificationId: string; body: OrgNotificationReadStateRequest }) =>
      orgNotificationsServices.updateReadState(notificationId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgNotificationsKeys.lists() })
    },
  })
}

export function useResendOrgNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (notificationId: string) => orgNotificationsServices.resendNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgNotificationsKeys.lists() })
    },
  })
}

export function useDeleteOrgNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (notificationId: string) => orgNotificationsServices.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgNotificationsKeys.lists() })
    },
  })
}
