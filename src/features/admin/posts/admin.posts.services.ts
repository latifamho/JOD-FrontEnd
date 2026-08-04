import { api } from '@/services/api'
import { buildApiParams } from '@/lib/build-api-params'
import type {
  AdminReviewPostDetailResponse,
  AdminReviewPostsParams,
  AdminReviewPostsResponse,
  ApprovePostRequest,
  ApprovePostResponse,
  RejectPostRequest,
  RejectPostResponse,
} from './admin.posts.types'

const ENDPOINTS = {
  REVIEW_POSTS: '/admin/review/posts',
  REVIEW_POST_DETAIL: (id: string) => `/admin/review/posts/${id}`,
  APPROVE_POST: (id: string) => `/admin/review/posts/${id}/approve`,
  REJECT_POST: (id: string) => `/admin/review/posts/${id}/reject`,
} as const

export const adminPostsServices = {
  async getReviewPosts(params: AdminReviewPostsParams): Promise<AdminReviewPostsResponse> {
    const response = await api.get<AdminReviewPostsResponse>(ENDPOINTS.REVIEW_POSTS, {
      params: buildApiParams(params),
    })
    return response.data
  },

  async getPostById(postId: string): Promise<AdminReviewPostDetailResponse> {
    const response = await api.get<AdminReviewPostDetailResponse>(
      ENDPOINTS.REVIEW_POST_DETAIL(postId),
    )
    return response.data
  },

  async approvePost(postId: string, body: ApprovePostRequest): Promise<ApprovePostResponse> {
    const response = await api.post<ApprovePostResponse>(ENDPOINTS.APPROVE_POST(postId), body, { successMessageKey: 'approved' })
    return response.data
  },

  async rejectPost(postId: string, body: RejectPostRequest): Promise<RejectPostResponse> {
    const response = await api.post<RejectPostResponse>(ENDPOINTS.REJECT_POST(postId), body, { successMessageKey: 'rejected' })
    return response.data
  },
}
