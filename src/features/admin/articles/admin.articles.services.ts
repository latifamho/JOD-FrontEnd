import { api } from '@/services/api'
import { buildApiParams } from '@/lib/build-api-params'
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

export const adminArticlesServices = {
  async getArticles(params: AdminArticlesParams): Promise<AdminArticlesResponse> {
    const response = await api.get<AdminArticlesResponse>(ENDPOINTS.ARTICLES, {
      params: buildApiParams(params),
    })
    return response.data
  },

  async getArticleById(articleId: string): Promise<AdminArticleDetailResponse> {
    const response = await api.get<AdminArticleDetailResponse>(ENDPOINTS.ARTICLE(articleId))
    return response.data
  },

  async createArticle(body: ArticleCreateRequest): Promise<CreateArticleResponse> {
    const response = await api.post<CreateArticleResponse>(ENDPOINTS.ARTICLES, body, { successMessageKey: 'created' })
    return response.data
  },


  async updateArticle(articleId: string, body: ArticleUpdateRequest): Promise<UpdateArticleResponse> {
    const response = await api.patch<UpdateArticleResponse>(ENDPOINTS.ARTICLE(articleId), body, { successMessageKey: 'updated' })
    return response.data
  },

  async deleteArticle(articleId: string): Promise<DeleteArticleResponse> {
    const response = await api.delete<DeleteArticleResponse>(ENDPOINTS.ARTICLE(articleId), { successMessageKey: 'deleted' })
    return response.data
  },
}
