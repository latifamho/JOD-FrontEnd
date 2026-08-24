import type { ApiListResponse, ApiSingleResponse } from '@/types/api.types'
import type { ModerationStatus } from '@/components/shared'
import type { ReviewPostItem, ReviewPostType } from '@/components/pages/posts-review/posts-review.types'

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
  author?: UserSummary | null
  updatedBy?: UserSummary | null
  updatedByName?: string | null
  reviewedByUser?: UserSummary | null
}

export type AdminReviewPostDetailResponse = ApiSingleResponse<ReviewPostDetail>

export type AdminPostStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'archived'

export type AdminPostPayload = {
  title?: string
  summary?: string | null
  content?: string | null
  description?: string | null
  type?: string
  status?: AdminPostStatus
  location?: string | null
  category_id?: string | null
  campaign_id?: string | null
  organization_id?: string | null
  author_id?: string | null
}
