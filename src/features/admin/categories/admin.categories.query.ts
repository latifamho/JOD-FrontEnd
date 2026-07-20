'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { adminCategoriesServices } from './admin.categories.services'
import { adminCategoriesKeys } from './admin.categories.query-keys'
import type {
  AdminCategoriesParams,
  CategoryCreateRequest,
  CategoryUpdateRequest,
} from './admin.categories.types'
import type { CategoryStatus } from '@/components/pages/categories-management/categories-management.types'

export function useAdminCategories(params: AdminCategoriesParams) {
  return useQuery({
    queryKey: adminCategoriesKeys.list(params),
    queryFn: () => adminCategoriesServices.getCategories(params),
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CategoryCreateRequest) => adminCategoriesServices.createCategory(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCategoriesKeys.lists() })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ categoryId, body }: { categoryId: string; body: CategoryUpdateRequest }) =>
      adminCategoriesServices.updateCategory(categoryId, body),
    onSuccess: (_data, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: adminCategoriesKeys.lists() })
      queryClient.invalidateQueries({ queryKey: adminCategoriesKeys.detail(categoryId) })
    },
  })
}

export function useToggleCategoryStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ categoryId, status }: { categoryId: string; status: CategoryStatus }) =>
      adminCategoriesServices.toggleCategoryStatus(categoryId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCategoriesKeys.lists() })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (categoryId: string) => adminCategoriesServices.deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCategoriesKeys.lists() })
    },
  })
}
