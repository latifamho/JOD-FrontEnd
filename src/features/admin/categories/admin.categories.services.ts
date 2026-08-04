import { api } from '@/services/api'
import { buildApiParams } from '@/lib/build-api-params'
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

export const adminCategoriesServices = {
  async getCategories(params: AdminCategoriesParams): Promise<AdminCategoriesResponse> {
    const response = await api.get<AdminCategoriesResponse>(ENDPOINTS.CATEGORIES, {
      params: buildApiParams(params),
    })
    return response.data
  },

  async getCategoryById(categoryId: string): Promise<AdminCategoryDetailResponse> {
    const response = await api.get<AdminCategoryDetailResponse>(ENDPOINTS.CATEGORY(categoryId))
    return response.data
  },

  async createCategory(body: CategoryCreateRequest): Promise<CreateCategoryResponse> {
    const response = await api.post<CreateCategoryResponse>(ENDPOINTS.CATEGORIES, body, { successMessageKey: 'created' })
    return response.data
  },

  async updateCategory(categoryId: string, body: CategoryUpdateRequest): Promise<UpdateCategoryResponse> {
    const response = await api.patch<UpdateCategoryResponse>(ENDPOINTS.CATEGORY(categoryId), body, { successMessageKey: 'updated' })
    return response.data
  },

  async toggleCategoryStatus(categoryId: string, body: CategoryStatusToggleRequest): Promise<ToggleCategoryStatusResponse> {
    const response = await api.patch<ToggleCategoryStatusResponse>(ENDPOINTS.CATEGORY_STATUS(categoryId), body, { successMessageKey: 'statusUpdated' })
    return response.data
  },

  async deleteCategory(categoryId: string): Promise<DeleteCategoryResponse> {
    const response = await api.delete<DeleteCategoryResponse>(ENDPOINTS.CATEGORY(categoryId), { successMessageKey: 'deleted' })
    return response.data
  },
}
