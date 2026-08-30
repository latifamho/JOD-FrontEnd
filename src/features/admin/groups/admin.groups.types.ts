import type { ApiListResponse, ApiSingleResponse } from '@/types/api.types'
import type {
  AdminGroupItem,
  AdminGroupPerson,
  AdminGroupStatus,
  GroupVisibility,
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
  visibility?: GroupVisibility
  search?: string
}

export type AdminGroupsResponse = ApiListResponse<AdminGroupItem>

export interface AdminGroupDetail extends AdminGroupItem {
  description: string
  /** Shown for acknowledgement before joining — the reviewer judges these. */
  rules: string[]
  /** Reviewer-only justification written by the creator. Never shown to members. */
  purpose: string
  owner: AdminGroupPerson
  /** Users the creator proposed as admins. They get the role only on approval. */
  proposedAdmins: AdminGroupPerson[]
  postsCount: number
  createdAt: string | null
}

export type AdminGroupDetailResponse = ApiSingleResponse<AdminGroupDetail>
