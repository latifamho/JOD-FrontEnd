'use client'

import { useQuery } from '@tanstack/react-query'

import { adminDashServices } from './admin.dash.services'
import { adminDashKeys } from './admin.dash.query-keys'

export function useAdminOverview() {
  return useQuery({
    queryKey: adminDashKeys.overview(),
    queryFn: () => adminDashServices.getOverview(),
  })
}
