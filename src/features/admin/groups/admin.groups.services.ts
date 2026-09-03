import { buildApiParams } from '@/lib/build-api-params'
import { api } from '@/services/api'
import type {
  AdminGroupDetailResponse,
  AdminGroupsParams,
  AdminGroupsResponse,
} from './admin.groups.types'

const ENDPOINTS = {
  GROUPS: '/admin/groups',
  GROUP: (id: string) => `/admin/groups/${id}`,
  APPROVE: (id: string) => `/admin/groups/${id}/approve`,
  REJECT: (id: string) => `/admin/groups/${id}/reject`,
} as const

export const adminGroupsServices = {
  async getGroups(params: AdminGroupsParams): Promise<AdminGroupsResponse> {
    const response = await api.get<AdminGroupsResponse>(ENDPOINTS.GROUPS, {
      params: buildApiParams(params),
    })
    return response.data
  },

  async getGroupById(groupId: string): Promise<AdminGroupDetailResponse> {
    const response = await api.get<AdminGroupDetailResponse>(ENDPOINTS.GROUP(groupId))
    return response.data
  },

  async approveGroup(groupId: string): Promise<AdminGroupDetailResponse> {
    const response = await api.post<AdminGroupDetailResponse>(ENDPOINTS.APPROVE(groupId), undefined, {
      successMessageKey: 'approved',
    })
    return response.data
  },

  async rejectGroup(groupId: string, rejectionReason: string): Promise<AdminGroupDetailResponse> {
    const response = await api.post<AdminGroupDetailResponse>(
      ENDPOINTS.REJECT(groupId),
      { rejectionReason },
      { successMessageKey: 'rejected' },
    )
    return response.data
  },

  async deleteGroup(groupId: string): Promise<void> {
    await api.delete(ENDPOINTS.GROUP(groupId), { successMessageKey: 'deleted' })
  },
}
