import { api } from '@/services/api'
import type {
  AdminReviewPostsParams,
  AdminReviewPostsResponse,
  AdminReviewPostDetailResponse,
  ApprovePostRequest,
  ApprovePostResponse,
  RejectPostRequest,
  RejectPostResponse,
} from './admin.review-posts.types'

const ENDPOINTS = {
  POSTS: '/admin/review/posts',
  POST: (id: string) => `/admin/review/posts/${id}`,
  POST_APPROVE: (id: string) => `/admin/review/posts/${id}/approve`,
  POST_REJECT: (id: string) => `/admin/review/posts/${id}/reject`,
} as const

function buildParams(params: AdminReviewPostsParams): Record<string, unknown> {
  const flat: Record<string, unknown> = {}
  if (params.page !== undefined) flat.page = params.page
  if (params.perPage !== undefined) flat.perPage = params.perPage
  if (params.sort) flat.sort = params.sort
  if (params.filter) {
    for (const [key, value] of Object.entries(params.filter)) {
      if (value !== undefined && value !== '') flat[`filter.${key}`] = value
    }
  }
  return flat
}

export const adminReviewPostsServices = {
  async getReviewPosts(params: AdminReviewPostsParams): Promise<AdminReviewPostsResponse> {
    const response = await api.get<AdminReviewPostsResponse>(ENDPOINTS.POSTS, {
      params: buildParams(params),
    })
    return response.data
  },

  async getReviewPostById(postId: string): Promise<AdminReviewPostDetailResponse> {
    const response = await api.get<AdminReviewPostDetailResponse>(ENDPOINTS.POST(postId))
    return response.data
  },

  async approvePost(postId: string, body: ApprovePostRequest = {}): Promise<ApprovePostResponse> {
    const response = await api.post<ApprovePostResponse>(ENDPOINTS.POST_APPROVE(postId), body)
    return response.data
  },

  async rejectPost(postId: string, body: RejectPostRequest): Promise<RejectPostResponse> {
    const response = await api.post<RejectPostResponse>(ENDPOINTS.POST_REJECT(postId), body)
    return response.data
  },
}
