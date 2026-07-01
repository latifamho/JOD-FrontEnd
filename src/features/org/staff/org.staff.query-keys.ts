import type { OrgStaffParams, OrgRolesParams } from './org.staff.types'

export const orgStaffKeys = {
  all: ['org', 'staff'] as const,
  lists: () => [...orgStaffKeys.all, 'list'] as const,
  list: (params: OrgStaffParams) => [...orgStaffKeys.lists(), params] as const,
  details: () => [...orgStaffKeys.all, 'detail'] as const,
  detail: (id: string) => [...orgStaffKeys.details(), id] as const,
}

export const orgRolesKeys = {
  all: ['org', 'roles'] as const,
  lists: () => [...orgRolesKeys.all, 'list'] as const,
  list: (params: OrgRolesParams) => [...orgRolesKeys.lists(), params] as const,
  details: () => [...orgRolesKeys.all, 'detail'] as const,
  detail: (id: string) => [...orgRolesKeys.details(), id] as const,
  catalog: () => [...orgRolesKeys.all, 'catalog'] as const,
}
