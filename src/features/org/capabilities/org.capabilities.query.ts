'use client'

import { useQuery } from '@tanstack/react-query'
import { orgCapabilitiesServices } from './org.capabilities.services'

export const orgCapabilitiesKeys = {
  brief: () => ['org', 'capabilities', 'brief'] as const,
}

export function useOrgCapabilitiesBrief(enabled = true) {
  return useQuery({
    queryKey: orgCapabilitiesKeys.brief(),
    queryFn: orgCapabilitiesServices.getBrief,
    enabled,
    staleTime: 60_000,
  })
}
