'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { adminBadgesServices } from './admin.badges.services'
import { adminBadgesKeys } from './admin.badges.query-keys'
import type { AdminBadgesParams, BadgeCreateRequest, BadgeUpdateRequest } from './admin.badges.types'

export function useAdminBadges(params: AdminBadgesParams) {
  return useQuery({
    queryKey: adminBadgesKeys.list(params),
    queryFn: () => adminBadgesServices.getBadges(params),
  })
}

export function useCreateBadge() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: BadgeCreateRequest) => adminBadgesServices.createBadge(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminBadgesKeys.lists() })
    },
  })
}

export function useUpdateBadge() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ badgeId, body }: { badgeId: string; body: BadgeUpdateRequest }) =>
      adminBadgesServices.updateBadge(badgeId, body),
    onSuccess: (_data, { badgeId }) => {
      queryClient.invalidateQueries({ queryKey: adminBadgesKeys.lists() })
      queryClient.invalidateQueries({ queryKey: adminBadgesKeys.detail(badgeId) })
    },
  })
}

export function useToggleBadgeStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ badgeId, isActive }: { badgeId: string; isActive: boolean }) =>
      adminBadgesServices.toggleBadgeStatus(badgeId, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminBadgesKeys.lists() })
    },
  })
}

export function useDeleteBadge() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (badgeId: string) => adminBadgesServices.deleteBadge(badgeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminBadgesKeys.lists() })
    },
  })
}
