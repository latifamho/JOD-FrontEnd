import { api } from '@/services/api'
import type {
  AdminCategoriesParams,
  AdminCategoriesResponse,
  AdminCategoryDetailResponse,
  CategoryCreateRequest,
  CategoryUpdateRequest,
  CategoryStatusToggleRequest,
  CreateCategoryResponse,
  UpdateCategoryResponse,
  ToggleCategoryStatusResponse,
  DeleteCategoryResponse,
} from './admin.categories.types'

const ENDPOINTS = {
  CATEGORIES: '/admin/categories',
  CATEGORY: (id: string) => `/admin/categories/${id}`,
  CATEGORY_STATUS: (id: string) => `/admin/categories/${id}/status`,
} as const

function buildParams(params: AdminCategoriesParams): Record<string, unknown> {
  const flat: Record<string, unknown> = {}
  if (params.page !== undefined) flat.page = params.page
  if (params.perPage !== undefined) flat.perPage = params.perPage
  if (params.sort) flat.sort = params.sort
  if (params.filter) {
    for (const [key, value] of Object.entries(params.filter)) {
      if (value !== undefined && value !== '') {
        flat[`filter.${key}`] = value
      }
    }
  }
  return flat
}

export const adminCategoriesServices = {
  async getCategories(params: AdminCategoriesParams): Promise<AdminCategoriesResponse> {
    const response = await api.get<AdminCategoriesResponse>(ENDPOINTS.CATEGORIES, {
      params: buildParams(params),
    })
    return response.data
  },

  async getCategoryById(categoryId: string): Promise<AdminCategoryDetailResponse> {
    const response = await api.get<AdminCategoryDetailResponse>(ENDPOINTS.CATEGORY(categoryId))
    return response.data
  },

  async createCategory(body: CategoryCreateRequest): Promise<CreateCategoryResponse> {
    const response = await api.post<CreateCategoryResponse>(ENDPOINTS.CATEGORIES, body)
    return response.data
  },

  async updateCategory(categoryId: string, body: CategoryUpdateRequest): Promise<UpdateCategoryResponse> {
    const response = await api.patch<UpdateCategoryResponse>(ENDPOINTS.CATEGORY(categoryId), body)
    return response.data
  },

  async toggleCategoryStatus(categoryId: string, body: CategoryStatusToggleRequest): Promise<ToggleCategoryStatusResponse> {
    const response = await api.patch<ToggleCategoryStatusResponse>(ENDPOINTS.CATEGORY_STATUS(categoryId), body)
    return response.data
  },

  async deleteCategory(categoryId: string): Promise<DeleteCategoryResponse> {
    const response = await api.delete<DeleteCategoryResponse>(ENDPOINTS.CATEGORY(categoryId))
    return response.data
  },
}
