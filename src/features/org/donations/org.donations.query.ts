'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { orgCampaignsKeys } from '@/features/org/campaigns/org.campaigns.query-keys'
import { orgDonationsServices } from './org.donations.services'
import { orgDonationsKeys } from './org.donations.query-keys'
import type { OrgDonationsParams } from './org.donations.types'

export function useOrgDonations(params: OrgDonationsParams, enabled = true) {
  return useQuery({
    queryKey: orgDonationsKeys.list(params),
    queryFn: () => orgDonationsServices.list(params),
    enabled,
  })
}

export function useOrgDonation(id: string | null, enabled = true) {
  return useQuery({
    queryKey: orgDonationsKeys.detail(id ?? ''),
    queryFn: () => orgDonationsServices.detail(id!),
    enabled: Boolean(id) && enabled,
  })
}

function useTransition(
  fn: (id: string) => Promise<unknown>,
  refreshCampaign = false,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => fn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgDonationsKeys.all })
      if (refreshCampaign) {
        queryClient.invalidateQueries({ queryKey: orgCampaignsKeys.all })
      }
    },
  })
}

export const useStartDonationContact = () =>
  useTransition(orgDonationsServices.contact)
export const useAgreeDonation = () => useTransition(orgDonationsServices.agree)
export const useCompleteDonation = () =>
  useTransition(orgDonationsServices.complete, true)

export function useCancelDonation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      orgDonationsServices.cancel(id, reason),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: orgDonationsKeys.all }),
  })
}
