import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'
import type {
  AdminCategoryItem,
  CategoryStatus,
} from '@/components/pages/categories-management/categories-management.types'

export interface AdminCategoriesFilter {
  status?: CategoryStatus
  search?: string
}

export interface AdminCategoriesParams {
  page?: number
  perPage?: number
  sort?: string
  filter?: AdminCategoriesFilter
}

export interface CategoryCreateRequest {
  name: string
  description: string
  keywords: string[]
  status: CategoryStatus
}

export interface CategoryUpdateRequest {
  name: string
  description: string
  keywords: string[]
  status: CategoryStatus
}

export interface CategoryStatusToggleRequest {
  status: CategoryStatus
}

export type AdminCategoriesResponse = ApiListResponse<AdminCategoryItem>
export type AdminCategoryDetailResponse = ApiSingleResponse<AdminCategoryItem>
export type CreateCategoryResponse = ApiMutationResponse<AdminCategoryItem>
export type UpdateCategoryResponse = ApiMutationResponse<AdminCategoryItem>
export type ToggleCategoryStatusResponse = ApiMutationResponse
export type DeleteCategoryResponse = ApiMutationResponse
