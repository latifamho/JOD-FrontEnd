import { api } from '@/services/api'
import { buildApiParams } from '@/lib/build-api-params'
import type { AdminPostCreateRequest, AdminPostUpdateRequest, AdminReviewPostDetailResponse, AdminReviewPostsParams, AdminReviewPostsResponse, HelpRequestLifecycleInput } from './admin.posts.types'

const configuredBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '')
const apiRootUrl = configuredBaseUrl.replace(/\/v1$/, '')
const POSTS_ENDPOINT = `${apiRootUrl}/posts`
const POST_ENDPOINT = (id: string) => `${POSTS_ENDPOINT}/${id}`

export const adminPostsServices = {
  async getReviewPosts(params: AdminReviewPostsParams): Promise<AdminReviewPostsResponse> { const response = await api.get<AdminReviewPostsResponse>(POSTS_ENDPOINT, { params: buildApiParams(params) }); return response.data },
  async getPostById(postId: string): Promise<AdminReviewPostDetailResponse> { const response = await api.get<AdminReviewPostDetailResponse>(POST_ENDPOINT(postId)); return response.data },
  async createPost(body: AdminPostCreateRequest): Promise<AdminReviewPostDetailResponse> { const response = await api.post<AdminReviewPostDetailResponse>(POSTS_ENDPOINT, body); return response.data },
  async updatePost(postId: string, body: AdminPostUpdateRequest): Promise<AdminReviewPostDetailResponse> { const response = await api.patch<AdminReviewPostDetailResponse>(POST_ENDPOINT(postId), body); return response.data },
  async publishPost(postId: string): Promise<AdminReviewPostDetailResponse> { const response = await api.patch<AdminReviewPostDetailResponse>(POST_ENDPOINT(postId), { status: 'published' }); return response.data },
  async blockPost(postId: string, blockReason: string): Promise<AdminReviewPostDetailResponse> { const response = await api.patch<AdminReviewPostDetailResponse>(POST_ENDPOINT(postId), { status: 'blocked', blockReason }); return response.data },
  async updateLifecycle(postId:string, body:HelpRequestLifecycleInput):Promise<AdminReviewPostDetailResponse>{ const response=await api.patch<AdminReviewPostDetailResponse>(`/admin/posts/${postId}/lifecycle`,body,{successMessageKey:'updated'}); return response.data },
}
