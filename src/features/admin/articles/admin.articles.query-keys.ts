import type { AdminArticlesParams } from './admin.articles.types'

export const adminArticlesKeys = {
  all: ['admin', 'articles'] as const,
  lists: () => [...adminArticlesKeys.all, 'list'] as const,
  list: (params: AdminArticlesParams) => [...adminArticlesKeys.lists(), params] as const,
  details: () => [...adminArticlesKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminArticlesKeys.details(), id] as const,
}
