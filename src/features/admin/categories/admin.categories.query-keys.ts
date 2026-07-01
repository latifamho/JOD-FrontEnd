import type { AdminCategoriesParams } from './admin.categories.types'

export const adminCategoriesKeys = {
  all: ['admin', 'categories'] as const,
  lists: () => [...adminCategoriesKeys.all, 'list'] as const,
  list: (params: AdminCategoriesParams) => [...adminCategoriesKeys.lists(), params] as const,
  details: () => [...adminCategoriesKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminCategoriesKeys.details(), id] as const,
}
