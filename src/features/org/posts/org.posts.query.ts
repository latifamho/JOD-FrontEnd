'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orgPostsServices } from './org.posts.services'
import { orgPostsKeys } from './org.posts.query-keys'
import type { OrgPostsParams, PostCreateRequest, PostUpdateRequest } from './org.posts.types'

export function useOrgPosts(params: OrgPostsParams) { return useQuery({ queryKey: orgPostsKeys.list(params), queryFn: () => orgPostsServices.getPosts(params) }) }
export function useOrgPost(postId: string | null) { return useQuery({ queryKey: orgPostsKeys.detail(postId ?? ''), queryFn: () => orgPostsServices.getPostById(postId!), enabled: Boolean(postId) }) }
export function useCreateOrgPost() { const qc = useQueryClient(); return useMutation({ mutationFn: (body: PostCreateRequest) => orgPostsServices.createPost(body), onSuccess: () => qc.invalidateQueries({ queryKey: orgPostsKeys.lists() }) }) }
export function useUpdateOrgPost() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ postId, body }: { postId: string; body: PostUpdateRequest }) => orgPostsServices.updatePost(postId, body), onSuccess: (_data, { postId }) => { qc.invalidateQueries({ queryKey: orgPostsKeys.lists() }); qc.invalidateQueries({ queryKey: orgPostsKeys.detail(postId) }) } }) }
export function usePublishOrgPost() { const qc = useQueryClient(); return useMutation({ mutationFn: (postId: string) => orgPostsServices.publishPost(postId), onSuccess: () => qc.invalidateQueries({ queryKey: orgPostsKeys.lists() }) }) }
export function useDeleteOrgPost() { const qc = useQueryClient(); return useMutation({ mutationFn: (postId: string) => orgPostsServices.deletePost(postId), onSuccess: () => qc.invalidateQueries({ queryKey: orgPostsKeys.lists() }) }) }
