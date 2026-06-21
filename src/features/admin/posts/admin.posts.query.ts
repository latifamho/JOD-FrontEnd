'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { adminPostsServices } from './admin.posts.services'
import { adminPostsKeys } from './admin.posts.query-keys'
import type {
  AdminReviewPostsParams,
  ApprovePostRequest,
  RejectPostRequest,
} from './admin.posts.types'

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

export function useApprovePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ postId, body }: { postId: string; body: ApprovePostRequest }) =>
      adminPostsServices.approvePost(postId, body),
    onSuccess: (_data, { postId }) => {
      queryClient.invalidateQueries({ queryKey: adminPostsKeys.reviewLists() })
      queryClient.invalidateQueries({ queryKey: adminPostsKeys.detail(postId) })
    },
  })
}

export function useRejectPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ postId, body }: { postId: string; body: RejectPostRequest }) =>
      adminPostsServices.rejectPost(postId, body),
    onSuccess: (_data, { postId }) => {
      queryClient.invalidateQueries({ queryKey: adminPostsKeys.reviewLists() })
      queryClient.invalidateQueries({ queryKey: adminPostsKeys.detail(postId) })
    },
  })
}
