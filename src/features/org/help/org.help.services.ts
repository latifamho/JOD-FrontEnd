import { api } from '@/services/api'
import type { HelpRequestStatus, OrgHelpOfferResponse, OrgHelpOffersParams, OrgHelpOffersResponse, OrgHelpRequestResponse, OrgHelpRequestsParams, OrgHelpRequestsResponse } from './org.help.types'

export const orgHelpServices = {
  async getRequests(params: OrgHelpRequestsParams): Promise<OrgHelpRequestsResponse> {
    return (await api.get<OrgHelpRequestsResponse>('/org/help-requests', { params })).data
  },
  async getRequest(id: string): Promise<OrgHelpRequestResponse> {
    return (await api.get<OrgHelpRequestResponse>(`/org/help-requests/${id}`)).data
  },
  async updateRequestStatus(id: string, status: HelpRequestStatus): Promise<OrgHelpRequestResponse> {
    return (await api.patch<OrgHelpRequestResponse>(`/org/help-requests/${id}/status`, { status })).data
  },
  async getOffers(params: OrgHelpOffersParams): Promise<OrgHelpOffersResponse> {
    return (await api.get<OrgHelpOffersResponse>('/org/help-offers', { params })).data
  },
  async getRequestOffers(id: string, params?: Omit<OrgHelpOffersParams, 'postId'>): Promise<OrgHelpOffersResponse> {
    return (await api.get<OrgHelpOffersResponse>(`/org/help-requests/${id}/offers`, { params })).data
  },
  async action(id: string, action: 'accept' | 'reject' | 'contact' | 'agree' | 'confirm-received', body?: { reason?: string }): Promise<OrgHelpOfferResponse> {
    return (await api.post<OrgHelpOfferResponse>(`/org/help-offers/${id}/${action}`, body)).data
  },
}
