import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'
import type {
  AdminCategoryItem,
  CategoryStatus,
  CategoryTarget,
} from '@/components/pages/categories-management/static-data'

export interface AdminCategoriesFilter {
  target?: CategoryTarget
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
  target: CategoryTarget
  description: string
  status: CategoryStatus
}

export interface CategoryUpdateRequest {
  name: string
  target: CategoryTarget
  description: string
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
