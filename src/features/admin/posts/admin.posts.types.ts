import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'
import type { ModerationStatus } from '@/components/shared'
import type { ReviewPostItem } from '@/components/pages/posts-review/static-data'

export type ReviewSortOption =
  | 'title_asc'
  | 'title_desc'
  | 'created_at_newest'
  | 'created_at_oldest'

export interface AdminReviewPostsFilter {
  status?: ModerationStatus
  organizationName?: string
}

export interface AdminReviewPostsParams {
  page?: number
  perPage?: number
  sortBy?: ReviewSortOption
  filter?: AdminReviewPostsFilter
}

export type AdminReviewPostsResponse = ApiListResponse<ReviewPostItem>

// ─── Single post detail ───────────────────────────────────────────────────────

export interface ReviewPostDetail extends ReviewPostItem {
  body: string | null
  images: string[] | null
  viewsCount: number
  reactionsCount: number
  reportsCount: number
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
