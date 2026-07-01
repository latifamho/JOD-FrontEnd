import { api } from '@/services/api'
import type {
  AdminArticlesParams,
  AdminArticlesResponse,
  AdminArticleDetailResponse,
  ArticleCreateRequest,
  CreateArticleResponse,
  ArticleUpdateRequest,
  UpdateArticleResponse,
  DeleteArticleResponse,
} from './admin.articles.types'

const ENDPOINTS = {
  ARTICLES: '/admin/articles',
  ARTICLE: (id: string) => `/admin/articles/${id}`,
} as const

function buildParams(params: AdminArticlesParams): Record<string, unknown> {
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

export const adminArticlesServices = {
  async getArticles(params: AdminArticlesParams): Promise<AdminArticlesResponse> {
    const response = await api.get<AdminArticlesResponse>(ENDPOINTS.ARTICLES, {
      params: buildParams(params),
    })
    return response.data
  },

  async getArticleById(articleId: string): Promise<AdminArticleDetailResponse> {
    const response = await api.get<AdminArticleDetailResponse>(ENDPOINTS.ARTICLE(articleId))
    return response.data
  },

  async createArticle(body: ArticleCreateRequest): Promise<CreateArticleResponse> {
    const response = await api.post<CreateArticleResponse>(ENDPOINTS.ARTICLES, body)
    return response.data
  },

  async updateArticle(articleId: string, body: ArticleUpdateRequest): Promise<UpdateArticleResponse> {
    const response = await api.patch<UpdateArticleResponse>(ENDPOINTS.ARTICLE(articleId), body)
    return response.data
  },

  async deleteArticle(articleId: string): Promise<DeleteArticleResponse> {
    const response = await api.delete<DeleteArticleResponse>(ENDPOINTS.ARTICLE(articleId))
    return response.data
  },
}
