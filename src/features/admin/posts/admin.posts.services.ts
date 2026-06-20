import { api } from '@/services/api'
import type {
  AdminReviewPostsParams,
  AdminReviewPostsResponse,
  ApprovePostRequest,
  ApprovePostResponse,
  RejectPostRequest,
  RejectPostResponse,
} from './admin.posts.types'

const ENDPOINTS = {
  REVIEW_POSTS: '/admin/review/posts',
  APPROVE_POST: (id: string) => `/admin/review/posts/${id}/approve`,
  REJECT_POST: (id: string) => `/admin/review/posts/${id}/reject`,
} as const

function buildParams(params: AdminReviewPostsParams): Record<string, unknown> {
  const flat: Record<string, unknown> = {}
  if (params.page !== undefined) flat.page = params.page
  if (params.perPage !== undefined) flat.perPage = params.perPage
  if (params.sortBy) flat.sortBy = params.sortBy
  if (params.filter) {
    for (const [key, value] of Object.entries(params.filter)) {
      if (value !== undefined && value !== '') {
        flat[`filter.${key}`] = value
      }
    }
  }
  return flat
}

export const adminPostsServices = {
  async getReviewPosts(params: AdminReviewPostsParams): Promise<AdminReviewPostsResponse> {
    const response = await api.get<AdminReviewPostsResponse>(ENDPOINTS.REVIEW_POSTS, {
      params: buildParams(params),
    })
    return response.data
  },

  async approvePost(postId: string, body: ApprovePostRequest): Promise<ApprovePostResponse> {
    const response = await api.post<ApprovePostResponse>(ENDPOINTS.APPROVE_POST(postId), body)
    return response.data
  },

  async rejectPost(postId: string, body: RejectPostRequest): Promise<RejectPostResponse> {
    const response = await api.post<RejectPostResponse>(ENDPOINTS.REJECT_POST(postId), body)
    return response.data
  },
}
