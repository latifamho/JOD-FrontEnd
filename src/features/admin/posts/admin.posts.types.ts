import type { ApiListResponse, ApiSingleResponse } from '@/types/api.types'
import type { ModerationStatus } from '@/components/shared'
import type { ReviewPostItem, ReviewPostType } from '@/components/pages/posts-review/posts-review.types'
import type { MediaItem } from '@/features/shared/media/media.types'

export type ReviewSortOption =
  | 'title_asc'
  | 'title_desc'
  | 'created_at_newest'
  | 'created_at_oldest'

export interface AdminReviewPostsParams {
  page?: number
  perPage?: number
  sort?: string
  status?: ModerationStatus
  type?: ReviewPostType
  location?: string
  categoryId?: string
  organizationId?: string
  authorId?: string
  search?: string
}

export type AdminReviewPostsResponse = ApiListResponse<ReviewPostItem>

export interface UserSummary {
  id: string
  name: string
  email: string | null
}

export interface ReviewPostDetail extends ReviewPostItem {
  createdAt: string | null
  updatedAt: string | null
  viewsCount: number
  reactionsCount: number
  applicationsCount: number
  content: string | null
  description: string | null
  body: string | null
  images: string[]
  videos: string[]
  media: MediaItem[]
  author?: UserSummary | null
  updatedBy?: UserSummary | null
  updatedByName?: string | null
  reviewedByUser?: UserSummary | null
}

export type AdminReviewPostDetailResponse = ApiSingleResponse<ReviewPostDetail>

export interface AdminPostCreateRequest {
  title: string
  description: string
}

export interface AdminPostUpdateRequest {
  title?: string
  description?: string
}

export type AdminPostStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'archived'
