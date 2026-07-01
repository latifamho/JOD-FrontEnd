'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { adminArticlesServices } from './admin.articles.services'
import { adminArticlesKeys } from './admin.articles.query-keys'
import type { AdminArticlesParams, ArticleCreateRequest, ArticleUpdateRequest } from './admin.articles.types'

export function useAdminArticles(params: AdminArticlesParams) {
  return useQuery({
    queryKey: adminArticlesKeys.list(params),
    queryFn: () => adminArticlesServices.getArticles(params),
  })
}

export function useCreateArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: ArticleCreateRequest) => adminArticlesServices.createArticle(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminArticlesKeys.lists() })
    },
  })
}

export function useUpdateArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ articleId, body }: { articleId: string; body: ArticleUpdateRequest }) =>
      adminArticlesServices.updateArticle(articleId, body),
    onSuccess: (_data, { articleId }) => {
      queryClient.invalidateQueries({ queryKey: adminArticlesKeys.lists() })
      queryClient.invalidateQueries({ queryKey: adminArticlesKeys.detail(articleId) })
    },
  })
}

export function useDeleteArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (articleId: string) => adminArticlesServices.deleteArticle(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminArticlesKeys.lists() })
    },
  })
}
