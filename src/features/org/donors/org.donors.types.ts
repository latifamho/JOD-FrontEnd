import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'
import type { DonorEntryItem } from '@/components/pages/donors-management/static-data'

export interface OrgDonorsFilter {
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
}

export type DonorUpdateRequest = DonorCreateRequest

export interface ApplicantCreateRequest {
  name: string
  phone: string
  campaignTitle: string
  applicantStatus: string
  appliedAt: string
}

export type ApplicantUpdateRequest = ApplicantCreateRequest

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
