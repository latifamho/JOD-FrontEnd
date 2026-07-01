import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'
import type { DonorEntryItem } from '@/components/pages/donors-management/static-data'

export interface OrgDonorsFilter {
  campaignId?: string
  city?: string
  search?: string
}

export interface OrgDonorsParams {
  page?: number
  perPage?: number
  sort?: string
  filter?: OrgDonorsFilter
}

export interface OrgApplicantsFilter {
  campaignId?: string
  applicantStatus?: string
  search?: string
}

export interface OrgApplicantsParams {
  page?: number
  perPage?: number
  sort?: string
  filter?: OrgApplicantsFilter
}

export interface DonorCreateRequest {
  name: string
  email: string
  phone: string
  campaignTitle: string
  amountOrType: string
  city?: string
  paymentMethod?: string
  assignedTo?: string
  internalNotes?: string
}

export interface DonorUpdateRequest {
  name?: string
  email?: string
  phone?: string
  campaignTitle?: string
  amountOrType?: string
  city?: string
  paymentMethod?: string
  assignedTo?: string
  internalNotes?: string
}

export interface ApplicantCreateRequest {
  name: string
  email: string
  phone: string
  campaignTitle: string
  amountOrType: string
  city?: string
  requestType?: string
  campaignRef?: string
  assignedTo?: string
  internalNotes?: string
}

export interface ApplicantUpdateRequest {
  name?: string
  email?: string
  phone?: string
  campaignTitle?: string
  amountOrType?: string
  city?: string
  requestType?: string
  assignedTo?: string
  internalNotes?: string
}

export type OrgDonorsResponse = ApiListResponse<DonorEntryItem>
export type OrgDonorDetailResponse = ApiSingleResponse<DonorEntryItem>
export type CreateDonorResponse = ApiMutationResponse<DonorEntryItem>
export type UpdateDonorResponse = ApiMutationResponse<DonorEntryItem>
export type DeleteDonorResponse = ApiMutationResponse

export type OrgApplicantsResponse = ApiListResponse<DonorEntryItem>
export type OrgApplicantDetailResponse = ApiSingleResponse<DonorEntryItem>
export type CreateApplicantResponse = ApiMutationResponse<DonorEntryItem>
export type UpdateApplicantResponse = ApiMutationResponse<DonorEntryItem>
export type DeleteApplicantResponse = ApiMutationResponse
