import { api } from '@/services/api'
import { buildApiParams } from '@/lib/build-api-params'
import type {
  OrgPostsParams,
  OrgPostsResponse,
  OrgPostDetailResponse,
  PostCreateRequest,
  CreatePostResponse,
  PostUpdateRequest,
  UpdatePostResponse,
  PostStateResponse,
  DeletePostResponse,
} from './org.posts.types'

const ENDPOINTS = {
  POSTS: '/org/posts',
  POST: (id: string) => `/org/posts/${id}`,
  POST_STATUS: (id: string) => `/org/posts/${id}/status`,
} as const

export const orgPostsServices = {
  async getPosts(params: OrgPostsParams): Promise<OrgPostsResponse> {
    const response = await api.get<OrgPostsResponse>(ENDPOINTS.POSTS, {
      params: buildApiParams(params),
    })
    return response.data
  },

  async getPostById(postId: string): Promise<OrgPostDetailResponse> {
    const response = await api.get<OrgPostDetailResponse>(ENDPOINTS.POST(postId))
    return response.data
  },

  async createPost(body: PostCreateRequest): Promise<CreatePostResponse> {
    const response = await api.post<CreatePostResponse>(ENDPOINTS.POSTS, body)
    return response.data
  },

  async updatePost(postId: string, body: PostUpdateRequest): Promise<UpdatePostResponse> {
    const response = await api.patch<UpdatePostResponse>(ENDPOINTS.POST(postId), body)
    return response.data
  },


  async publishPost(postId: string): Promise<PostStateResponse> {
    const response = await api.patch<PostStateResponse>(ENDPOINTS.POST_STATUS(postId), { status: 'published' })
    return response.data
  },

  async archivePost(postId: string): Promise<PostStateResponse> {
    const response = await api.patch<PostStateResponse>(ENDPOINTS.POST_STATUS(postId), { status: 'archived' })
    return response.data
  },

  async restorePost(postId: string): Promise<PostStateResponse> {
    const response = await api.patch<PostStateResponse>(ENDPOINTS.POST_STATUS(postId), { status: 'draft' })
    return response.data
  },

  async deletePost(postId: string): Promise<DeletePostResponse> {
    const response = await api.delete<DeletePostResponse>(ENDPOINTS.POST(postId))
    return response.data
  },
}
