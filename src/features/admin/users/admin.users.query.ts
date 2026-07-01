'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { adminUsersServices } from './admin.users.services'
import { adminUsersKeys } from './admin.users.query-keys'
import type {
  AdminUsersParams,
  UserCreateRequest,
  UserUpdateRequest,
} from './admin.users.types'
import type { UserStatus } from '@/components/pages/users-management/static-data'

export function useAdminUsers(params: AdminUsersParams) {
  return useQuery({
    queryKey: adminUsersKeys.list(params),
    queryFn: () => adminUsersServices.getUsers(params),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UserCreateRequest) => adminUsersServices.createUser(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.lists() })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, body }: { userId: string; body: UserUpdateRequest }) =>
      adminUsersServices.updateUser(userId, body),
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.lists() })
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.detail(userId) })
    },
  })
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: UserStatus }) =>
      adminUsersServices.toggleUserStatus(userId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.lists() })
    },
  })
}

export function useChangeUserPassword() {
  return useMutation({
    mutationFn: ({ userId, newPassword }: { userId: string; newPassword: string }) =>
      adminUsersServices.changeUserPassword(userId, { newPassword }),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => adminUsersServices.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.lists() })
    },
  })
}
