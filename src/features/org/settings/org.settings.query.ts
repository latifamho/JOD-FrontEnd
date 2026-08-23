'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orgSettingsServices } from './org.settings.services'
import type { OrganizationPasswordUpdateRequest, OrganizationProfileUpdateRequest } from './org.settings.types'

export const orgSettingsKeys = { profile: ['org', 'settings', 'profile'] as const }

export function useOrgSettingsProfile() {
  return useQuery({ queryKey: orgSettingsKeys.profile, queryFn: orgSettingsServices.getProfile })
}

export function useUpdateOrgSettingsProfile() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body: OrganizationProfileUpdateRequest) => orgSettingsServices.updateProfile(body),
    onSuccess: () => client.invalidateQueries({ queryKey: orgSettingsKeys.profile }),
  })
}

export function useUpdateOrgSettingsPassword() {
  return useMutation({ mutationFn: (body: OrganizationPasswordUpdateRequest) => orgSettingsServices.updatePassword(body) })
}
