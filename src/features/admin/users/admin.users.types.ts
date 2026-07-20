import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'
import type { AdminUserItem, UserRole, UserStatus } from '@/components/pages/users-management/users-management.types'

export interface AdminUsersFilter {
  status?: UserStatus
  userType?: UserRole
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
  userType: UserRole
  /** Legacy alias accepted by some backend versions */
  role?: UserRole
  status: UserStatus
  password: string
  password_confirmation: string
}

export interface UserUpdateRequest {
  name: string
  email: string
  phone: string
  userType: UserRole
  /** Legacy alias accepted by some backend versions */
  role?: UserRole
  status: UserStatus
}

export interface UserStatusToggleRequest {
  status: UserStatus
}

export interface UserPasswordChangeRequest {
  password: string
  password_confirmation: string
}

export type AdminUsersResponse = ApiListResponse<AdminUserItem>
export type AdminUserDetailResponse = ApiSingleResponse<AdminUserItem>
export type CreateUserResponse = ApiMutationResponse<AdminUserItem>
export type UpdateUserResponse = ApiMutationResponse<AdminUserItem>
export type ToggleUserStatusResponse = ApiMutationResponse
export type ChangeUserPasswordResponse = ApiMutationResponse
export type DeleteUserResponse = ApiMutationResponse
