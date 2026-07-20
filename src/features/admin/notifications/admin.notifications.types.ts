import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'
import type {
  AdminNotificationItem,
  NotificationCategory,
  NotificationDateFilter,
  NotificationMailbox,
  NotificationPriority,
  NotificationRecipientScope,
  NotificationStatus,
} from '@/components/pages/notifications-management/notifications-management.types'

export interface AdminNotificationsFilter {
  mailbox?: NotificationMailbox
  status?: NotificationStatus
  category?: NotificationCategory
  recipientScope?: NotificationRecipientScope
  date?: NotificationDateFilter
}

export interface AdminNotificationsParams {
  page?: number
  perPage?: number
  sort?: string
  filter?: AdminNotificationsFilter
}

export interface NotificationCreateRequest {
  title: string
  body: string
  category: NotificationCategory
  recipientScope: NotificationRecipientScope
  recipientLabel: string
  priority?: NotificationPriority
}

export interface NotificationReadStateRequest {
  status: NotificationStatus
}

export type AdminNotificationsResponse = ApiListResponse<AdminNotificationItem>
export type AdminNotificationDetailResponse = ApiSingleResponse<AdminNotificationItem>
export type CreateNotificationResponse = ApiMutationResponse<AdminNotificationItem>
export type UpdateNotificationReadStateResponse = ApiMutationResponse
export type ResendNotificationResponse = ApiMutationResponse
export type DeleteNotificationResponse = ApiMutationResponse
