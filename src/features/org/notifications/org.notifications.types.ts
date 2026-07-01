import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'
import type {
  OrgNotificationCategory,
  OrgNotificationItem,
} from '@/components/pages/organization-notifications/static-data'

export interface OrgNotificationsFilter {
  mailbox?: 'inbox' | 'sent'
  status?: 'unread' | 'read' | 'sent'
  category?: OrgNotificationCategory
  date?: 'all' | 'today' | 'last_7_days'
}

export interface OrgNotificationsParams {
  page?: number
  perPage?: number
  sort?: string
  filter?: OrgNotificationsFilter
}

export interface OrgNotificationCreateRequest {
  title: string
  body: string
  category: OrgNotificationCategory
  recipientScope: string
  recipientLabel: string
  priority?: 'normal' | 'high'
}

export interface OrgNotificationReadStateRequest {
  status: 'read' | 'unread'
}

export type OrgNotificationsResponse = ApiListResponse<OrgNotificationItem>
export type OrgNotificationDetailResponse = ApiSingleResponse<OrgNotificationItem>
export type CreateOrgNotificationResponse = ApiMutationResponse<OrgNotificationItem>
export type UpdateOrgNotificationReadStateResponse = ApiMutationResponse
export type ResendOrgNotificationResponse = ApiMutationResponse
export type DeleteOrgNotificationResponse = ApiMutationResponse
