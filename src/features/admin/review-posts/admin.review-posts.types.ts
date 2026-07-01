import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'
import type { ModerationStatus } from '@/components/shared'
import type { ReviewPostItem, ReviewPostType } from '@/components/pages/posts-review/static-data'

export interface AdminReviewPostsFilter {
  status?: ModerationStatus
  type?: ReviewPostType
  organizationId?: string
  organizationName?: string
}

export interface AdminReviewPostsParams {
  page?: number
  perPage?: number
  sort?: string
  filter?: AdminReviewPostsFilter
}

export interface ApprovePostRequest {
  note?: string
}

export interface RejectPostRequest {
  reason: string
}

export type AdminReviewPostsResponse = ApiListResponse<ReviewPostItem>
export type AdminReviewPostDetailResponse = ApiSingleResponse<ReviewPostItem>
export type ApprovePostResponse = ApiMutationResponse
export type RejectPostResponse = ApiMutationResponse
