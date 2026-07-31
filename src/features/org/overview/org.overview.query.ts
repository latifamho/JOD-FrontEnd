'use client'

import { useQuery } from '@tanstack/react-query'
import { orgOverviewServices } from './org.overview.services'

export function useOrgOverview() {
  return useQuery({
    queryKey: ['org', 'dashboard', 'overview'],
    queryFn: orgOverviewServices.getOverview,
  })
}