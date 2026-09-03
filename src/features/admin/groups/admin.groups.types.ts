import type { ApiListResponse, ApiSingleResponse } from '@/types/api.types'
import type {
  AdminGroupItem,
  AdminGroupPerson,
  AdminGroupStatus,
} from '@/components/pages/groups-management/groups-management.types'

export type AdminGroupSortOption =
  | 'name_asc'
  | 'name_desc'
  | 'created_at_newest'
  | 'created_at_oldest'
  | 'members_desc'

export interface AdminGroupsParams {
  page?: number
  perPage?: number
  sort?: string
  status?: AdminGroupStatus
  category?: string
  search?: string
}

export type AdminGroupsResponse = ApiListResponse<AdminGroupItem>

export interface AdminGroupDetail extends AdminGroupItem {
  description: string
  rules: string[]
  purpose: string
  owner: AdminGroupPerson
  proposedAdmins: AdminGroupPerson[]
  postsCount: number
  createdAt: string | null
}

export type AdminGroupDetailResponse = ApiSingleResponse<AdminGroupDetail>
