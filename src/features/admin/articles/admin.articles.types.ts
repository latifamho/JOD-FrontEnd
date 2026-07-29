import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'
import type { ArticleItem, ArticleStatus } from '@/components/pages/content-management/content-management.types'

export interface AdminArticlesFilter {
  status?: ArticleStatus
  search?: string
}

export interface AdminArticlesParams {
  page?: number
  perPage?: number
  sort?: string
  filter?: AdminArticlesFilter
}

export interface ArticleCreateRequest {
  title: string
  slug?: string
  excerpt: string
  content: string
  authorName: string
  status: ArticleStatus
}

export interface ArticleUpdateRequest {
  title?: string
  slug?: string
  excerpt?: string
  content?: string
  authorName?: string
  status?: ArticleStatus
}

export type AdminArticlesResponse = ApiListResponse<ArticleItem>
export type AdminArticleDetailResponse = ApiSingleResponse<ArticleItem>
export type CreateArticleResponse = ApiMutationResponse<ArticleItem>
export type UpdateArticleResponse = ApiMutationResponse<ArticleItem>
export type DeleteArticleResponse = ApiMutationResponse
