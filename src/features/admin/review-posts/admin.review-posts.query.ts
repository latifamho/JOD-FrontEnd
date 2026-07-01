'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { adminReviewPostsServices } from './admin.review-posts.services'
import { adminReviewPostsKeys } from './admin.review-posts.query-keys'
import type { AdminReviewPostsParams, ApprovePostRequest, RejectPostRequest } from './admin.review-posts.types'

export function useAdminReviewPosts(params: AdminReviewPostsParams) {
  return useQuery({
    queryKey: adminReviewPostsKeys.list(params),
    queryFn: () => adminReviewPostsServices.getReviewPosts(params),
  })
}

export function useApprovePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ postId, body }: { postId: string; body?: ApprovePostRequest }) =>
      adminReviewPostsServices.approvePost(postId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminReviewPostsKeys.lists() })
    },
  })
}

export function useRejectPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ postId, body }: { postId: string; body: RejectPostRequest }) =>
      adminReviewPostsServices.rejectPost(postId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminReviewPostsKeys.lists() })
    },
  })
}
