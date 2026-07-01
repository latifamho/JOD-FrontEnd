import type { AdminReviewPostsParams } from './admin.review-posts.types'

export const adminReviewPostsKeys = {
  all: ['admin', 'review-posts'] as const,
  lists: () => [...adminReviewPostsKeys.all, 'list'] as const,
  list: (params: AdminReviewPostsParams) => [...adminReviewPostsKeys.lists(), params] as const,
  details: () => [...adminReviewPostsKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminReviewPostsKeys.details(), id] as const,
}
