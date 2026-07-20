import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'
import type { AdminUserItem, UserRole, UserStatus } from '@/components/pages/users-management/users-management.types'

export interface AdminUsersFilter {
  status?: UserStatus
  role?: UserRole
  search?: string
}

export interface AdminUsersParams {
  page?: number
  perPage?: number
  sort?: string
  filter?: AdminUsersFilter
}

export interface UserCreateRequest {
  name: string
  email: string
  phone: string
  role: UserRole
  status: UserStatus
  password: string
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
  confirmPassword: string
}

export type AdminUsersResponse = ApiListResponse<AdminUserItem>
export type AdminUserDetailResponse = ApiSingleResponse<AdminUserItem>
export type CreateUserResponse = ApiMutationResponse<AdminUserItem>
export type UpdateUserResponse = ApiMutationResponse<AdminUserItem>
export type ToggleUserStatusResponse = ApiMutationResponse
export type ChangeUserPasswordResponse = ApiMutationResponse
export type DeleteUserResponse = ApiMutationResponse
