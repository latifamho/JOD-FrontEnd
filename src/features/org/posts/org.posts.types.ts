import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'
import type {
  OrganizationPostItem,
  OrganizationPostStatus,
  OrganizationPostType,
} from '@/components/pages/organization-posts-management/static-data'

export interface OrgPostsFilter {
  status?: OrganizationPostStatus
  type?: OrganizationPostType
}

export interface OrgPostsParams {
  page?: number
  perPage?: number
  sort?: string
  filter?: OrgPostsFilter
}

export interface PostCreateRequest {
  title: string
  summary: string
  type: OrganizationPostType
  status: OrganizationPostStatus
  authorName: string
  location: string
  campaignTitle?: string
}

export interface PostUpdateRequest {
  title?: string
  summary?: string
  type?: OrganizationPostType
  status?: OrganizationPostStatus
  authorName?: string
  location?: string
  campaignTitle?: string
}

export type OrgPostsResponse = ApiListResponse<OrganizationPostItem>
export type OrgPostDetailResponse = ApiSingleResponse<OrganizationPostItem>
export type CreatePostResponse = ApiMutationResponse<OrganizationPostItem>
export type UpdatePostResponse = ApiMutationResponse<OrganizationPostItem>
export type PostStateResponse = ApiMutationResponse<OrganizationPostItem>
export type DeletePostResponse = ApiMutationResponse
