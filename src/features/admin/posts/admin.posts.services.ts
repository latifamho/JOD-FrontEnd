import { api } from '@/services/api'
import { buildApiParams } from '@/lib/build-api-params'
import type {
  AdminPostPayload,
  AdminReviewPostDetailResponse,
  AdminReviewPostsParams,
  AdminReviewPostsResponse,
} from './admin.posts.types'

const configuredBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '')
const apiRootUrl = configuredBaseUrl.replace(/\/v1$/, '')
const POSTS_ENDPOINT = `${apiRootUrl}/posts`
const POST_ENDPOINT = (id: string) => `${POSTS_ENDPOINT}/${id}`

export const adminPostsServices = {
  async getReviewPosts(params: AdminReviewPostsParams): Promise<AdminReviewPostsResponse> {
    const response = await api.get<AdminReviewPostsResponse>(POSTS_ENDPOINT, {
      params: buildApiParams(params),
    })
    return response.data
  },

  async getPostById(postId: string): Promise<AdminReviewPostDetailResponse> {
    const response = await api.get<AdminReviewPostDetailResponse>(POST_ENDPOINT(postId))
    return response.data
  },

  async updatePost(postId: string, body: AdminPostPayload): Promise<AdminReviewPostDetailResponse> {
    const response = await api.patch<AdminReviewPostDetailResponse>(POST_ENDPOINT(postId), body, {
      successMessageKey: 'updated',
    })
    return response.data
  },

  async approvePost(postId: string): Promise<AdminReviewPostDetailResponse> {
    const response = await api.patch<AdminReviewPostDetailResponse>(
      POST_ENDPOINT(postId),
      { status: 'approved' },
      { successMessageKey: 'approved' },
    )
    return response.data
  },

  async rejectPost(postId: string): Promise<AdminReviewPostDetailResponse> {
    const response = await api.patch<AdminReviewPostDetailResponse>(
      POST_ENDPOINT(postId),
      { status: 'rejected' },
      { successMessageKey: 'rejected' },
    )
    return response.data
  },
}
