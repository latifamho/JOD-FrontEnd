'use client'

import { useQuery } from '@tanstack/react-query'

import { orgReportsServices } from './org.reports.services'
import { orgReportsKeys } from './org.reports.query-keys'
import type { OrgReportsParams } from './org.reports.types'

export function useOrgReports(params: OrgReportsParams) {
  return useQuery({
    queryKey: orgReportsKeys.list(params),
    queryFn: () => orgReportsServices.getReports(params),
  })
}
