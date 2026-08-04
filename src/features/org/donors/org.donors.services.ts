import { api } from '@/services/api'
import { buildApiParams } from '@/lib/build-api-params'
import type {
  OrgDonorsParams,
  OrgDonorsResponse,
  OrgDonorDetailResponse,
  DonorCreateRequest,
  CreateDonorResponse,
  DonorUpdateRequest,
  UpdateDonorResponse,
  DeleteDonorResponse,
  OrgApplicantsParams,
  OrgApplicantsResponse,
  OrgApplicantDetailResponse,
  ApplicantCreateRequest,
  CreateApplicantResponse,
  ApplicantUpdateRequest,
  UpdateApplicantResponse,
  DeleteApplicantResponse,
} from './org.donors.types'

const ENDPOINTS = {
  DONORS: '/org/donors',
  DONOR: (id: string) => `/org/donors/${id}`,
  APPLICANTS: '/org/applicants',
  APPLICANT: (id: string) => `/org/applicants/${id}`,
} as const

export const orgDonorsServices = {
  async getDonors(params: OrgDonorsParams): Promise<OrgDonorsResponse> {
    const response = await api.get<OrgDonorsResponse>(ENDPOINTS.DONORS, {
      params: buildApiParams(params),
    })
    return response.data
  },

  async getDonorById(donorId: string): Promise<OrgDonorDetailResponse> {
    const response = await api.get<OrgDonorDetailResponse>(ENDPOINTS.DONOR(donorId))
    return response.data
  },

  async createDonor(body: DonorCreateRequest): Promise<CreateDonorResponse> {
    const response = await api.post<CreateDonorResponse>(ENDPOINTS.DONORS, body)
    return response.data
  },

  async updateDonor(donorId: string, body: DonorUpdateRequest): Promise<UpdateDonorResponse> {
    const response = await api.patch<UpdateDonorResponse>(ENDPOINTS.DONOR(donorId), body)
    return response.data
  },

  async deleteDonor(donorId: string): Promise<DeleteDonorResponse> {
    const response = await api.delete<DeleteDonorResponse>(ENDPOINTS.DONOR(donorId))
    return response.data
  },

  async getApplicants(params: OrgApplicantsParams): Promise<OrgApplicantsResponse> {
    const response = await api.get<OrgApplicantsResponse>(ENDPOINTS.APPLICANTS, {
      params: buildApiParams(params),
    })
    return response.data
  },

  async getApplicantById(applicantId: string): Promise<OrgApplicantDetailResponse> {
    const response = await api.get<OrgApplicantDetailResponse>(ENDPOINTS.APPLICANT(applicantId))
    return response.data
  },

  async createApplicant(body: ApplicantCreateRequest): Promise<CreateApplicantResponse> {
    const response = await api.post<CreateApplicantResponse>(ENDPOINTS.APPLICANTS, body)
    return response.data
  },

  async updateApplicant(applicantId: string, body: ApplicantUpdateRequest): Promise<UpdateApplicantResponse> {
    const response = await api.patch<UpdateApplicantResponse>(ENDPOINTS.APPLICANT(applicantId), body)
    return response.data
  },

  async deleteApplicant(applicantId: string): Promise<DeleteApplicantResponse> {
    const response = await api.delete<DeleteApplicantResponse>(ENDPOINTS.APPLICANT(applicantId))
    return response.data
  },
}
