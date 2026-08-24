'use client'

import { useQuery } from '@tanstack/react-query'

import { organizationVideosServices } from './organization-videos.services'
import { organizationVideosKeys } from './organization-videos.query-keys'
import type { OrganizationVideosScope } from './organization-videos.types'

export function useOrganizationVideos(scope: OrganizationVideosScope, organizationId?: string, enabled = true) {
  const canRequest = scope === 'org' || Boolean(organizationId)

  return useQuery({
    queryKey: organizationVideosKeys.list(scope, organizationId),
    queryFn: () => organizationVideosServices.list(scope, organizationId),
    enabled: enabled && canRequest,
    retry: 1,
    staleTime: 30_000,
  })
}
