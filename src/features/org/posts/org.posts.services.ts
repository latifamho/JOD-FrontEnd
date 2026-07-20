import { api } from '@/services/api'
import { buildListParams } from '@/lib/build-list-params'
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
  POST_PUBLISH: (id: string) => `/org/posts/${id}/publish`,
  POST_ARCHIVE: (id: string) => `/org/posts/${id}/archive`,
  POST_RESTORE: (id: string) => `/org/posts/${id}/restore`,
} as const

function buildParams(params: OrgPostsParams): Record<string, unknown> {
  return buildListParams(params)
}

export const orgPostsServices = {
  async getPosts(params: OrgPostsParams): Promise<OrgPostsResponse> {
    const response = await api.get<OrgPostsResponse>(ENDPOINTS.POSTS, {
      params: buildParams(params),
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
    const response = await api.post<PostStateResponse>(ENDPOINTS.POST_PUBLISH(postId))
    return response.data
  },

  async archivePost(postId: string): Promise<PostStateResponse> {
    const response = await api.post<PostStateResponse>(ENDPOINTS.POST_ARCHIVE(postId))
    return response.data
  },

  async restorePost(postId: string): Promise<PostStateResponse> {
    const response = await api.post<PostStateResponse>(ENDPOINTS.POST_RESTORE(postId))
    return response.data
  },

  async deletePost(postId: string): Promise<DeletePostResponse> {
    const response = await api.delete<DeletePostResponse>(ENDPOINTS.POST(postId))
    return response.data
  },
}
