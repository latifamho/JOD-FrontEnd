import { api } from '@/services/api'
import { buildApiParams } from '@/lib/build-api-params'
import type {
  AdminNotificationsParams,
  AdminNotificationsResponse,
  AdminNotificationDetailResponse,
  NotificationCreateRequest,
  CreateNotificationResponse,
  NotificationReadStateRequest,
  UpdateNotificationReadStateResponse,
  ResendNotificationResponse,
  DeleteNotificationResponse,
} from './admin.notifications.types'

const ENDPOINTS = {
  NOTIFICATIONS: '/admin/notifications',
  NOTIFICATION: (id: string) => `/admin/notifications/${id}`,
  NOTIFICATION_READ_STATE: (id: string) => `/admin/notifications/${id}/read-state`,
  NOTIFICATION_RESEND: (id: string) => `/admin/notifications/${id}/resend`,
} as const

export const adminNotificationsServices = {
  async getNotifications(params: AdminNotificationsParams): Promise<AdminNotificationsResponse> {
    const response = await api.get<AdminNotificationsResponse>(ENDPOINTS.NOTIFICATIONS, {
      params: buildApiParams(params),
    })
    return response.data
  },

  async getNotificationById(notificationId: string): Promise<AdminNotificationDetailResponse> {
    const response = await api.get<AdminNotificationDetailResponse>(ENDPOINTS.NOTIFICATION(notificationId))
    return response.data
  },

  async createNotification(body: NotificationCreateRequest): Promise<CreateNotificationResponse> {
    const response = await api.post<CreateNotificationResponse>(ENDPOINTS.NOTIFICATIONS, body, { successMessageKey: 'sent' })
    return response.data
  },

  async updateReadState(notificationId: string, body: NotificationReadStateRequest): Promise<UpdateNotificationReadStateResponse> {
    const response = await api.patch<UpdateNotificationReadStateResponse>(ENDPOINTS.NOTIFICATION_READ_STATE(notificationId), body, { successMessageKey: 'statusUpdated' })
    return response.data
  },

  async resendNotification(notificationId: string): Promise<ResendNotificationResponse> {
    const response = await api.post<ResendNotificationResponse>(ENDPOINTS.NOTIFICATION_RESEND(notificationId), undefined, { successMessageKey: 'resent' })
    return response.data
  },

  async deleteNotification(notificationId: string): Promise<DeleteNotificationResponse> {
    const response = await api.delete<DeleteNotificationResponse>(ENDPOINTS.NOTIFICATION(notificationId), { successMessageKey: 'deleted' })
    return response.data
  },
}
