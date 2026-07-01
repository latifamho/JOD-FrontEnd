'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { orgPostsServices } from './org.posts.services'
import { orgPostsKeys } from './org.posts.query-keys'
import type { OrgPostsParams, PostCreateRequest, PostUpdateRequest } from './org.posts.types'

export function useOrgPosts(params: OrgPostsParams) {
  return useQuery({
    queryKey: orgPostsKeys.list(params),
    queryFn: () => orgPostsServices.getPosts(params),
  })
}

export function useCreateOrgPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: PostCreateRequest) => orgPostsServices.createPost(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgPostsKeys.lists() })
    },
  })
}

export function useUpdateOrgPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ postId, body }: { postId: string; body: PostUpdateRequest }) =>
      orgPostsServices.updatePost(postId, body),
    onSuccess: (_data, { postId }) => {
      queryClient.invalidateQueries({ queryKey: orgPostsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: orgPostsKeys.detail(postId) })
    },
  })
}

export function usePublishOrgPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (postId: string) => orgPostsServices.publishPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgPostsKeys.lists() })
    },
  })
}

export function useArchiveOrgPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (postId: string) => orgPostsServices.archivePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgPostsKeys.lists() })
    },
  })
}

export function useRestoreOrgPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (postId: string) => orgPostsServices.restorePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgPostsKeys.lists() })
    },
  })
}

export function useDeleteOrgPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (postId: string) => orgPostsServices.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgPostsKeys.lists() })
    },
  })
}
