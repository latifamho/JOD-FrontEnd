'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminUsersServices } from './admin.users.services'
import { adminUsersKeys } from './admin.users.query-keys'
import type { AdminUserActivityParams, AdminUsersParams, UserCreateRequest, UserUpdateRequest } from './admin.users.types'
import type { UserStatus } from '@/components/pages/users-management/users-management.types'
export function useAdminUsers(params:AdminUsersParams){return useQuery({queryKey:adminUsersKeys.list(params),queryFn:()=>adminUsersServices.getUsers(params)})}
export function useAdminUser(userId:string){return useQuery({queryKey:adminUsersKeys.detail(userId),queryFn:()=>adminUsersServices.getUserById(userId),enabled:Boolean(userId)})}
export function useAdminUserPosts(userId:string,params:AdminUserActivityParams){return useQuery({queryKey:adminUsersKeys.posts(userId,params),queryFn:()=>adminUsersServices.getUserPosts(userId,params),enabled:Boolean(userId)})}
export function useAdminUserDonations(userId:string,params:AdminUserActivityParams){return useQuery({queryKey:adminUsersKeys.donations(userId,params),queryFn:()=>adminUsersServices.getUserDonations(userId,params),enabled:Boolean(userId)})}
export function useAdminUserPersonalization(userId:string){return useQuery({queryKey:adminUsersKeys.personalization(userId),queryFn:()=>adminUsersServices.getUserPersonalization(userId),enabled:Boolean(userId)})}
export function useCreateUser(){const qc=useQueryClient();return useMutation({mutationFn:(body:UserCreateRequest)=>adminUsersServices.createUser(body),onSuccess:()=>qc.invalidateQueries({queryKey:adminUsersKeys.lists()})})}
export function useUpdateUser(){const qc=useQueryClient();return useMutation({mutationFn:({userId,body}:{userId:string;body:UserUpdateRequest})=>adminUsersServices.updateUser(userId,body),onSuccess:(_d,{userId})=>{qc.invalidateQueries({queryKey:adminUsersKeys.lists()});qc.invalidateQueries({queryKey:adminUsersKeys.detail(userId)})}})}
export function useToggleUserStatus(){const qc=useQueryClient();return useMutation({mutationFn:({userId,status}:{userId:string;status:UserStatus})=>adminUsersServices.toggleUserStatus(userId,{status}),onSuccess:()=>qc.invalidateQueries({queryKey:adminUsersKeys.lists()})})}
export function useChangeUserPassword(){return useMutation({mutationFn:({userId,newPassword}:{userId:string;newPassword:string})=>adminUsersServices.changeUserPassword(userId,newPassword)})}
export function useDeleteUser(){const qc=useQueryClient();return useMutation({mutationFn:(userId:string)=>adminUsersServices.deleteUser(userId),onSuccess:()=>qc.invalidateQueries({queryKey:adminUsersKeys.lists()})})}
