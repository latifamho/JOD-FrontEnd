import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'
import type { AdminUserItem, UserRole, UserStatus } from '@/components/pages/users-management/static-data'

export interface AdminUsersParams {
  page?: number
  perPage?: number
}

export interface UserCreateRequest {
  name: string
  email: string
  phone: string
  role: UserRole
  status: UserStatus
}

export interface UserUpdateRequest {
  name: string
  email: string
  phone: string
  role: UserRole
  status: UserStatus
}

export interface UserStatusToggleRequest {
  status: UserStatus
}

export interface UserPasswordChangeRequest {
  newPassword: string
}

export type AdminUsersResponse = ApiListResponse<AdminUserItem>
export type AdminUserDetailResponse = ApiSingleResponse<AdminUserItem>
export type CreateUserResponse = ApiMutationResponse<AdminUserItem>
export type UpdateUserResponse = ApiMutationResponse<AdminUserItem>
export type ToggleUserStatusResponse = ApiMutationResponse
export type ChangeUserPasswordResponse = ApiMutationResponse
export type DeleteUserResponse = ApiMutationResponse
