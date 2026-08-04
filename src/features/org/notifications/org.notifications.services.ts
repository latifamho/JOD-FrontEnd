import { api } from '@/services/api'
import { buildApiParams } from '@/lib/build-api-params'
import type {
  OrgNotificationsParams,
  OrgNotificationsResponse,
  OrgNotificationDetailResponse,
  OrgNotificationCreateRequest,
  CreateOrgNotificationResponse,
  OrgNotificationReadStateRequest,
  UpdateOrgNotificationReadStateResponse,
  ResendOrgNotificationResponse,
  DeleteOrgNotificationResponse,
} from './org.notifications.types'

const ENDPOINTS = {
  NOTIFICATIONS: '/org/notifications',
  NOTIFICATION: (id: string) => `/org/notifications/${id}`,
  NOTIFICATION_READ_STATE: (id: string) => `/org/notifications/${id}/read-state`,
  NOTIFICATION_RESEND: (id: string) => `/org/notifications/${id}/resend`,
} as const

export const orgNotificationsServices = {
  async getNotifications(params: OrgNotificationsParams): Promise<OrgNotificationsResponse> {
    const response = await api.get<OrgNotificationsResponse>(ENDPOINTS.NOTIFICATIONS, {
      params: buildApiParams(params),
    })
    return response.data
  },

  async getNotificationById(notificationId: string): Promise<OrgNotificationDetailResponse> {
    const response = await api.get<OrgNotificationDetailResponse>(ENDPOINTS.NOTIFICATION(notificationId))
    return response.data
  },

  async createNotification(body: OrgNotificationCreateRequest): Promise<CreateOrgNotificationResponse> {
    const response = await api.post<CreateOrgNotificationResponse>(ENDPOINTS.NOTIFICATIONS, body)
    return response.data
  },

  async updateReadState(notificationId: string, body: OrgNotificationReadStateRequest): Promise<UpdateOrgNotificationReadStateResponse> {
    const response = await api.patch<UpdateOrgNotificationReadStateResponse>(ENDPOINTS.NOTIFICATION_READ_STATE(notificationId), body)
    return response.data
  },

  async resendNotification(notificationId: string): Promise<ResendOrgNotificationResponse> {
    const response = await api.post<ResendOrgNotificationResponse>(ENDPOINTS.NOTIFICATION_RESEND(notificationId))
    return response.data
  },

  async deleteNotification(notificationId: string): Promise<DeleteOrgNotificationResponse> {
    const response = await api.delete<DeleteOrgNotificationResponse>(ENDPOINTS.NOTIFICATION(notificationId))
    return response.data
  },
}
