'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { adminPlatformSettingsServices } from './admin.platform-settings.services'
import { adminPlatformSettingsKeys } from './admin.platform-settings.query-keys'
import type { PlatformSettingsUpdateRequest } from './admin.platform-settings.types'

export function useAdminPlatformSettings() {
  return useQuery({
    queryKey: adminPlatformSettingsKeys.all,
    queryFn: () => adminPlatformSettingsServices.getPlatformSettings(),
  })
}

export function useUpdatePlatformSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: PlatformSettingsUpdateRequest) =>
      adminPlatformSettingsServices.updatePlatformSettings(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminPlatformSettingsKeys.all })
    },
  })
}
