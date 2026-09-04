'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orgHelpServices } from './org.help.services'
import type { HelpRequestStatus, OrgHelpOffersParams, OrgHelpRequestsParams } from './org.help.types'

export const orgHelpKeys = {
  all: ['org', 'help'] as const,
  requests: (params?: OrgHelpRequestsParams) => ['org', 'help', 'requests', params] as const,
  request: (id: string) => ['org', 'help', 'request', id] as const,
  offers: (params?: OrgHelpOffersParams) => ['org', 'help', 'offers', params] as const,
  requestOffers: (id: string) => ['org', 'help', 'request-offers', id] as const,
}

export function useOrgHelpRequests(params: OrgHelpRequestsParams) { return useQuery({ queryKey: orgHelpKeys.requests(params), queryFn: () => orgHelpServices.getRequests(params) }) }
export function useOrgHelpRequest(id: string) { return useQuery({ queryKey: orgHelpKeys.request(id), queryFn: () => orgHelpServices.getRequest(id), enabled: Boolean(id) }) }
export function useOrgHelpOffers(params: OrgHelpOffersParams = {}) { return useQuery({ queryKey: orgHelpKeys.offers(params), queryFn: () => orgHelpServices.getOffers(params) }) }
export function useOrgRequestOffers(id: string) { return useQuery({ queryKey: orgHelpKeys.requestOffers(id), queryFn: () => orgHelpServices.getRequestOffers(id), enabled: Boolean(id) }) }

export function useUpdateOrgHelpRequestStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: HelpRequestStatus }) => orgHelpServices.updateRequestStatus(id, status),
    onSuccess: (_data, vars) => { qc.invalidateQueries({ queryKey: orgHelpKeys.all }); qc.invalidateQueries({ queryKey: orgHelpKeys.request(vars.id) }); qc.invalidateQueries({ queryKey: ['org', 'analytics'] }) },
  })
}

export function useOrgHelpOfferAction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, action, reason }: { id: string; action: 'accept' | 'reject' | 'contact' | 'agree' | 'confirm-received'; reason?: string }) => orgHelpServices.action(id, action, reason ? { reason } : undefined),
    onSuccess: () => { qc.invalidateQueries({ queryKey: orgHelpKeys.all }); qc.invalidateQueries({ queryKey: ['org', 'analytics'] }) },
  })
}
