import { api } from '@/services/api'
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

function buildParams(params: OrgNotificationsParams): Record<string, unknown> {
  const flat: Record<string, unknown> = {}
  if (params.page !== undefined) flat.page = params.page
  if (params.perPage !== undefined) flat.perPage = params.perPage
  if (params.sort) flat.sort = params.sort
  if (params.filter) {
    for (const [key, value] of Object.entries(params.filter)) {
      if (value !== undefined && value !== '') flat[`filter.${key}`] = value
    }
  }
  return flat
}

export const orgNotificationsServices = {
  async getNotifications(params: OrgNotificationsParams): Promise<OrgNotificationsResponse> {
    const response = await api.get<OrgNotificationsResponse>(ENDPOINTS.NOTIFICATIONS, {
      params: buildParams(params),
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
