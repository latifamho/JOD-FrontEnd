import type { ApiListResponse, ApiMutationResponse, ApiSingleResponse } from '@/types/api.types'
import type { AdminUserItem, UserRole, UserStatus } from '@/components/pages/users-management/users-management.types'
export interface AdminUsersFilter { status?: UserStatus; userType?: UserRole; role?: UserRole; search?: string }
export interface AdminUsersParams { page?: number; perPage?: number; sort?: string; filter?: AdminUsersFilter }
export interface UserCreateRequest { name: string; email: string; phone: string; userType: UserRole; role?: UserRole; status: UserStatus; password: string; password_confirmation: string }
export interface UserUpdateRequest { name: string; email: string; phone: string; userType: UserRole; role?: UserRole; status: UserStatus }
export interface UserStatusToggleRequest { status: UserStatus }
export interface UserPasswordChangeRequest { password: string; password_confirmation: string }
export type AdminUsersResponse = ApiListResponse<AdminUserItem>
export type AdminUserDetailResponse = ApiSingleResponse<AdminUserItem>
export type CreateUserResponse = ApiMutationResponse<AdminUserItem>
export type UpdateUserResponse = ApiMutationResponse<AdminUserItem>
export type ToggleUserStatusResponse = ApiMutationResponse
export type ChangeUserPasswordResponse = ApiMutationResponse
export type DeleteUserResponse = ApiMutationResponse
export interface AdminUserPostItem { id: string; title: string | null; summary: string | null; content: string | null; description: string | null; body: string | null; type: string; status: string; organizationName: string | null; authorName: string | null; location: string | null; campaignTitle: string | null; images: unknown[]; media: unknown[]; submittedAt: string | null; createdAt: string | null; updatedAt: string | null; publishedAt: string | null; viewsCount: number; reactionsCount: number; applicationsCount: number }
export interface AdminUserDonationItem { id: string; campaignId: string | null; campaignTitle: string | null; organizationId: string | null; organizationName: string | null; name: string | null; email: string | null; phone: string | null; amountOrType: string | null; amount: number | null; paymentMethod: string | null; city: string | null; source: string | null; campaignRef: string | null; internalNotes: string | null; donatedAt: string | null; createdAt: string | null; updatedAt: string | null }
export interface AdminUserActivityParams { page?: number; perPage?: number }
export type AdminUserPostsResponse = ApiListResponse<AdminUserPostItem>
export type AdminUserDonationsResponse = ApiListResponse<AdminUserDonationItem>
export interface AdminUserPersonalization { onboardingCompleted:boolean; onboardingCompletedAt:string|null; intent:'giver'|'receiver'|'both'|null; preferredCity:string|null; preferredGovernorate:string|null; preferredRadiusKm:number|null; remoteHelpEnabled:boolean; availabilityStatus:string|null; interests:{category:{id:string;name:string};selectedByUser:boolean;explicitWeight:number;behavioralWeight:number}[]; capabilities:{id:string;name:string;slug:string}[]; feedback:{interested:number;notInterested:number;hiddenPosts:number;hiddenPublishers:number} }
export type AdminUserPersonalizationResponse = ApiSingleResponse<AdminUserPersonalization>
