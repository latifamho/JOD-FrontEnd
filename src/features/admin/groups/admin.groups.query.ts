'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminGroupsKeys } from './admin.groups.query-keys'
import { adminGroupsServices } from './admin.groups.services'
import type { AdminGroupsParams } from './admin.groups.types'

export function useAdminGroups(params: AdminGroupsParams) {
  return useQuery({
    queryKey: adminGroupsKeys.list(params),
    queryFn: () => adminGroupsServices.getGroups(params),
  })
}

export function useAdminGroupDetail(groupId: string | null) {
  return useQuery({
    queryKey: adminGroupsKeys.detail(groupId ?? ''),
    queryFn: () => adminGroupsServices.getGroupById(groupId!),
    enabled: !!groupId,
  })
}

function useInvalidateAdminGroups() {
  const queryClient = useQueryClient()

  return (groupId: string) => {
    queryClient.invalidateQueries({ queryKey: adminGroupsKeys.lists() })
    queryClient.invalidateQueries({ queryKey: adminGroupsKeys.detail(groupId) })
  }
}

export function useApproveGroup() {
  const invalidate = useInvalidateAdminGroups()

  return useMutation({
    mutationFn: ({ groupId }: { groupId: string }) => adminGroupsServices.approveGroup(groupId),
    onSuccess: (_data, { groupId }) => invalidate(groupId),
  })
}

export function useRejectGroup() {
  const invalidate = useInvalidateAdminGroups()

  return useMutation({
    mutationFn: ({ groupId, rejectionReason }: { groupId: string; rejectionReason: string }) =>
      adminGroupsServices.rejectGroup(groupId, rejectionReason),
    onSuccess: (_data, { groupId }) => invalidate(groupId),
  })
}

export function useDeleteGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ groupId }: { groupId: string }) => adminGroupsServices.deleteGroup(groupId),
    onSuccess: (_data, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: adminGroupsKeys.lists() })
      queryClient.removeQueries({ queryKey: adminGroupsKeys.detail(groupId) })
    },
  })
}
