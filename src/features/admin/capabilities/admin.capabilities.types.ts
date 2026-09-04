import type { ApiListResponse, ApiSingleResponse } from '@/types/api.types'

export type CapabilityStatus = 'active' | 'inactive'
export interface AdminCapabilityItem { id: string; name: string; slug: string; status: CapabilityStatus; usersCount: number; sortOrder: number; createdAt: string | null; updatedAt: string | null }
export interface AdminCapabilitiesParams { page?: number; perPage?: number; filter?: { search?: string; status?: CapabilityStatus } }
export interface CapabilityInput { name: string; slug?: string; status: CapabilityStatus; sortOrder: number }
export type AdminCapabilitiesResponse = ApiListResponse<AdminCapabilityItem>
export type AdminCapabilityResponse = ApiSingleResponse<AdminCapabilityItem>
