import type { OrgPostsParams } from './org.posts.types'

export const orgPostsKeys = {
  all: ['org', 'posts'] as const,
  lists: () => [...orgPostsKeys.all, 'list'] as const,
  list: (params: OrgPostsParams) => [...orgPostsKeys.lists(), params] as const,
  details: () => [...orgPostsKeys.all, 'detail'] as const,
  detail: (id: string) => [...orgPostsKeys.details(), id] as const,
}
