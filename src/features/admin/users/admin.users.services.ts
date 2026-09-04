import { api } from '@/services/api'
import { buildApiParams } from '@/lib/build-api-params'
import type { AdminUserActivityParams, AdminUserDonationsResponse, AdminUserPersonalizationResponse, AdminUserPostsResponse, AdminUsersParams, AdminUsersResponse, AdminUserDetailResponse, UserCreateRequest, UserUpdateRequest, UserStatusToggleRequest, CreateUserResponse, UpdateUserResponse, ToggleUserStatusResponse, ChangeUserPasswordResponse, DeleteUserResponse } from './admin.users.types'
const ENDPOINTS = { USERS:'/admin/users', USER:(id:string)=>`/admin/users/${id}`, USER_STATUS:(id:string)=>`/admin/users/${id}/status`, USER_PASSWORD:(id:string)=>`/admin/users/${id}/password`, USER_POSTS:(id:string)=>`/admin/users/${id}/posts`, USER_DONATIONS:(id:string)=>`/admin/users/${id}/donations`, USER_PERSONALIZATION:(id:string)=>`/admin/users/${id}/personalization` } as const
export const adminUsersServices = {
  async getUsers(params: AdminUsersParams): Promise<AdminUsersResponse> { const response=await api.get<AdminUsersResponse>(ENDPOINTS.USERS,{params:buildApiParams(params)}); return response.data },
  async getUserById(userId:string): Promise<AdminUserDetailResponse> { return (await api.get<AdminUserDetailResponse>(ENDPOINTS.USER(userId))).data },
  async getUserPosts(userId:string,params:AdminUserActivityParams):Promise<AdminUserPostsResponse>{return (await api.get<AdminUserPostsResponse>(ENDPOINTS.USER_POSTS(userId),{params})).data},
  async getUserDonations(userId:string,params:AdminUserActivityParams):Promise<AdminUserDonationsResponse>{return (await api.get<AdminUserDonationsResponse>(ENDPOINTS.USER_DONATIONS(userId),{params})).data},
  async getUserPersonalization(userId:string):Promise<AdminUserPersonalizationResponse>{return (await api.get<AdminUserPersonalizationResponse>(ENDPOINTS.USER_PERSONALIZATION(userId))).data},
  async createUser(body:UserCreateRequest):Promise<CreateUserResponse>{return (await api.post<CreateUserResponse>(ENDPOINTS.USERS,body,{successMessageKey:'created'})).data},
  async updateUser(userId:string,body:UserUpdateRequest):Promise<UpdateUserResponse>{return (await api.patch<UpdateUserResponse>(ENDPOINTS.USER(userId),body,{successMessageKey:'updated'})).data},
  async toggleUserStatus(userId:string,body:UserStatusToggleRequest):Promise<ToggleUserStatusResponse>{return (await api.patch<ToggleUserStatusResponse>(ENDPOINTS.USER_STATUS(userId),body,{successMessageKey:'statusUpdated'})).data},
  async changeUserPassword(userId:string,newPassword:string):Promise<ChangeUserPasswordResponse>{return (await api.patch<ChangeUserPasswordResponse>(ENDPOINTS.USER_PASSWORD(userId),{newPassword,newPassword_confirmation:newPassword},{successMessageKey:'passwordUpdated'})).data},
  async deleteUser(userId:string):Promise<DeleteUserResponse>{return (await api.delete<DeleteUserResponse>(ENDPOINTS.USER(userId),{successMessageKey:'deleted'})).data},
}
