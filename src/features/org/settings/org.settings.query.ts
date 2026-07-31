'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orgSettingsServices } from './org.settings.services'
import type { OrganizationBankAccount, OrganizationProfile } from './org.settings.types'

const keys = { profile: ['org', 'settings', 'profile'] as const, bank: ['org', 'settings', 'bank'] as const }
export function useOrgSettingsProfile() { return useQuery({ queryKey: keys.profile, queryFn: orgSettingsServices.getProfile }) }
export function useOrgBankAccount() { return useQuery({ queryKey: keys.bank, queryFn: orgSettingsServices.getBankAccount }) }
export function useUpdateOrgSettingsProfile() {
  const client = useQueryClient()
  return useMutation({ mutationFn: (body: Pick<OrganizationProfile, 'name' | 'email' | 'phone'>) => orgSettingsServices.updateProfile(body), onSuccess: () => client.invalidateQueries({ queryKey: keys.profile }) })
}
export function useUpdateOrgBankAccount() {
  const client = useQueryClient()
  return useMutation({ mutationFn: (body: OrganizationBankAccount) => orgSettingsServices.updateBankAccount(body), onSuccess: () => client.invalidateQueries({ queryKey: keys.bank }) })
}
