'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminPostsServices } from './admin.posts.services'
import { adminPostsKeys } from './admin.posts.query-keys'
import type { AdminReviewPostsParams } from './admin.posts.types'

export function useAdminReviewPosts(params: AdminReviewPostsParams) { return useQuery({ queryKey: adminPostsKeys.reviewList(params), queryFn: () => adminPostsServices.getReviewPosts(params) }) }
export function useAdminPostDetail(postId: string | null) { return useQuery({ queryKey: adminPostsKeys.detail(postId ?? ''), queryFn: () => adminPostsServices.getPostById(postId!), enabled: !!postId }) }
export function useCreateAdminPost() { const qc = useQueryClient(); return useMutation({ mutationFn: adminPostsServices.createPost, onSuccess: () => qc.invalidateQueries({ queryKey: adminPostsKeys.reviewLists() }) }) }
export function useUpdateAdminPost() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ postId, body }: { postId: string; body: { title?: string; description?: string } }) => adminPostsServices.updatePost(postId, body), onSuccess: (_d, { postId }) => { qc.invalidateQueries({ queryKey: adminPostsKeys.reviewLists() }); qc.invalidateQueries({ queryKey: adminPostsKeys.detail(postId) }) } }) }
export function useUpdateHelpRequestLifecycle(){ const qc=useQueryClient(); return useMutation({mutationFn:({postId,body}:{postId:string;body:import('./admin.posts.types').HelpRequestLifecycleInput})=>adminPostsServices.updateLifecycle(postId,body),onSuccess:(_d,{postId})=>{qc.invalidateQueries({queryKey:adminPostsKeys.reviewLists()});qc.invalidateQueries({queryKey:adminPostsKeys.detail(postId)})}}) }
function useInvalidateAdminPosts() { const qc = useQueryClient(); return (postId: string) => { qc.invalidateQueries({ queryKey: adminPostsKeys.reviewLists() }); qc.invalidateQueries({ queryKey: adminPostsKeys.detail(postId) }) } }
export function usePublishPost() { const invalidate = useInvalidateAdminPosts(); return useMutation({ mutationFn: ({ postId }: { postId: string }) => adminPostsServices.publishPost(postId), onSuccess: (_d, { postId }) => invalidate(postId) }) }
export function useBlockPost() { const invalidate = useInvalidateAdminPosts(); return useMutation({ mutationFn: ({ postId, blockReason }: { postId: string; blockReason: string }) => adminPostsServices.blockPost(postId, blockReason), onSuccess: (_d, { postId }) => invalidate(postId) }) }
