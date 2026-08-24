import type { ApiListMeta, PaginationLinks } from '@/types/api.types'
export type OrgDonationStatus = 'pending' | 'contacting' | 'agreed' | 'completed' | 'cancelled'
export interface OrgDonation { id: string; campaignId: string; campaignTitle: string; name: string; email: string | null; phone: string | null; city: string | null; amount: number; status: OrgDonationStatus; contactMethod: string | null; paymentMethod: string | null; notes: string | null; cancelReason: string | null; createdAt: string | null; contactedAt: string | null; agreedAt: string | null; completedAt: string | null; cancelledAt: string | null }
export interface OrgDonationsParams { page?: number; perPage?: number; status?: OrgDonationStatus; campaignId?: string }
export interface OrgDonationsResult { data: OrgDonation[]; meta: ApiListMeta; links: PaginationLinks }
export interface OrgDonationEnvelope { data?: OrgDonation | OrgDonation[]; item?: OrgDonation | { data?: OrgDonation[]; total?: number; page?: number; perPage?: number }; meta?: ApiListMeta; links?: PaginationLinks }
