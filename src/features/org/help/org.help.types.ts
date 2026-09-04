import type { ApiListResponse, ApiSingleResponse } from '@/types/api.types'
import type { OrganizationPostItem } from '@/components/pages/organization-posts-management/static-data'

export type HelpRequestStatus = 'open' | 'in_progress' | 'fulfilled' | 'partially_fulfilled' | 'not_fulfilled' | 'expired'
export type HelpOfferStatus = 'pending' | 'accepted' | 'contacting' | 'agreed' | 'completed' | 'rejected'

export interface OrgHelpRequestsParams {
  page?: number
  perPage?: number
  status?: HelpRequestStatus
  urgency?: 'normal' | 'important' | 'urgent' | 'critical'
  categoryId?: string
  location?: string
  search?: string
}

export interface OrgHelpOfferItem {
  id: string
  postId: string
  request?: { id: string; title: string; helpStatus?: HelpRequestStatus | null }
  helper: { id: string; name?: string | null }
  type?: string | null
  amount?: number | null
  description?: string | null
  status: HelpOfferStatus
  contactMethod?: string | null
  phone?: string | null
  rejectionReason?: string | null
  createdAt?: string | null
  acceptedAt?: string | null
  contactedAt?: string | null
  agreedAt?: string | null
  completedAt?: string | null
  can: { accept: boolean; reject: boolean; contact: boolean; confirmReceived: boolean }
}

export interface OrgHelpOffersParams {
  page?: number
  perPage?: number
  postId?: string
  status?: HelpOfferStatus
}

export type OrgHelpRequestsResponse = ApiListResponse<OrganizationPostItem>
export type OrgHelpRequestResponse = ApiSingleResponse<OrganizationPostItem>
export type OrgHelpOffersResponse = ApiListResponse<OrgHelpOfferItem>
export type OrgHelpOfferResponse = ApiSingleResponse<OrgHelpOfferItem>
