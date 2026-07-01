import { api } from '@/services/api'
import type {
  AdminUsersParams,
  AdminUsersResponse,
  AdminUserDetailResponse,
  UserCreateRequest,
  UserUpdateRequest,
  UserStatusToggleRequest,
  UserPasswordChangeRequest,
  CreateUserResponse,
  UpdateUserResponse,
  ToggleUserStatusResponse,
  ChangeUserPasswordResponse,
  DeleteUserResponse,
} from './admin.users.types'

const ENDPOINTS = {
  USERS: '/admin/users',
  USER: (id: string) => `/admin/users/${id}`,
  USER_STATUS: (id: string) => `/admin/users/${id}/status`,
  USER_PASSWORD: (id: string) => `/admin/users/${id}/password`,
} as const

export const adminUsersServices = {
  async getUsers(params: AdminUsersParams): Promise<AdminUsersResponse> {
    const response = await api.get<AdminUsersResponse>(ENDPOINTS.USERS, { params })
    return response.data
  },

  async getUserById(userId: string): Promise<AdminUserDetailResponse> {
    const response = await api.get<AdminUserDetailResponse>(ENDPOINTS.USER(userId))
    return response.data
  },

  async createUser(body: UserCreateRequest): Promise<CreateUserResponse> {
    const response = await api.post<CreateUserResponse>(ENDPOINTS.USERS, body)
    return response.data
  },

  async updateUser(userId: string, body: UserUpdateRequest): Promise<UpdateUserResponse> {
    const response = await api.patch<UpdateUserResponse>(ENDPOINTS.USER(userId), body)
    return response.data
  },

  async toggleUserStatus(userId: string, body: UserStatusToggleRequest): Promise<ToggleUserStatusResponse> {
    const response = await api.patch<ToggleUserStatusResponse>(ENDPOINTS.USER_STATUS(userId), body)
    return response.data
  },

  async changeUserPassword(userId: string, body: UserPasswordChangeRequest): Promise<ChangeUserPasswordResponse> {
    const response = await api.patch<ChangeUserPasswordResponse>(ENDPOINTS.USER_PASSWORD(userId), body)
    return response.data
  },

  async deleteUser(userId: string): Promise<DeleteUserResponse> {
    const response = await api.delete<DeleteUserResponse>(ENDPOINTS.USER(userId))
    return response.data
  },
}
