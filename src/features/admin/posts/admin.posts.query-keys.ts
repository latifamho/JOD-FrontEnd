import type { AdminReviewPostsParams } from './admin.posts.types'

export const adminPostsKeys = {
  all: ['admin', 'posts'] as const,
  reviewLists: () => [...adminPostsKeys.all, 'review'] as const,
  reviewList: (params: AdminReviewPostsParams) =>
    [...adminPostsKeys.reviewLists(), params] as const,
  detail: (postId: string) => [...adminPostsKeys.all, 'detail', postId] as const,
}
