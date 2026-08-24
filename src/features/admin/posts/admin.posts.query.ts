'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { adminPostsServices } from './admin.posts.services'
import { adminPostsKeys } from './admin.posts.query-keys'
import type { AdminReviewPostsParams } from './admin.posts.types'

export function useAdminReviewPosts(params: AdminReviewPostsParams) {
  return useQuery({
    queryKey: adminPostsKeys.reviewList(params),
    queryFn: () => adminPostsServices.getReviewPosts(params),
  })
}

export function useAdminPostDetail(postId: string | null) {
  return useQuery({
    queryKey: adminPostsKeys.detail(postId ?? ''),
    queryFn: () => adminPostsServices.getPostById(postId!),
    enabled: !!postId,
  })
}

function useInvalidateAdminPosts() {
  const queryClient = useQueryClient()
  return (postId: string) => {
    queryClient.invalidateQueries({ queryKey: adminPostsKeys.reviewLists() })
    queryClient.invalidateQueries({ queryKey: adminPostsKeys.detail(postId) })
  }
}

export function useApprovePost() {
  const invalidate = useInvalidateAdminPosts()
  return useMutation({
    mutationFn: ({ postId }: { postId: string }) => adminPostsServices.approvePost(postId),
    onSuccess: (_data, { postId }) => invalidate(postId),
  })
}

export function useRejectPost() {
  const invalidate = useInvalidateAdminPosts()
  return useMutation({
    mutationFn: ({ postId }: { postId: string }) => adminPostsServices.rejectPost(postId),
    onSuccess: (_data, { postId }) => invalidate(postId),
  })
}
