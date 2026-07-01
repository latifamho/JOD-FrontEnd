import type { OrgDonorsParams, OrgApplicantsParams } from './org.donors.types'

export const orgDonorsKeys = {
  all: ['org', 'donors'] as const,
  lists: () => [...orgDonorsKeys.all, 'list'] as const,
  list: (params: OrgDonorsParams) => [...orgDonorsKeys.lists(), params] as const,
  details: () => [...orgDonorsKeys.all, 'detail'] as const,
  detail: (id: string) => [...orgDonorsKeys.details(), id] as const,
}

export const orgApplicantsKeys = {
  all: ['org', 'applicants'] as const,
  lists: () => [...orgApplicantsKeys.all, 'list'] as const,
  list: (params: OrgApplicantsParams) => [...orgApplicantsKeys.lists(), params] as const,
  details: () => [...orgApplicantsKeys.all, 'detail'] as const,
  detail: (id: string) => [...orgApplicantsKeys.details(), id] as const,
}
