import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'
import type { ModerationStatus } from '@/components/shared'
import type { ReviewPostItem, ReviewPostType } from '@/components/pages/posts-review/posts-review.types'

export type ReviewSortOption =
  | 'title_asc'
  | 'title_desc'
  | 'created_at_newest'
  | 'created_at_oldest'

export interface AdminReviewPostsFilter {
  status?: ModerationStatus
  organizationName?: string
  type?: ReviewPostType
}

export interface AdminReviewPostsParams {
  page?: number
  perPage?: number
  sort?: string
  filter?: AdminReviewPostsFilter
}

export type AdminReviewPostsResponse = ApiListResponse<ReviewPostItem>

// ─── Single post detail ───────────────────────────────────────────────────────

export interface ReviewPostDetail extends ReviewPostItem {
  createdAt: string
  updatedAt: string
  viewsCount: number
  reactionsCount: number
  applicationsCount: number
  body?: string | null
  images?: string[] | null
}

export type AdminReviewPostDetailResponse = ApiSingleResponse<ReviewPostDetail>

// ─── Mutations ────────────────────────────────────────────────────────────────

export interface ApprovePostRequest {
  note?: string
}

export interface RejectPostRequest {
  reason: string
}

export type ApprovePostResponse = ApiMutationResponse
export type RejectPostResponse = ApiMutationResponse
