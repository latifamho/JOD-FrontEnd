import { api } from '@/services/api'
import { buildApiParams } from '@/lib/build-api-params'
import type { AdminCapabilitiesParams, AdminCapabilitiesResponse, AdminCapabilityResponse, CapabilityInput } from './admin.capabilities.types'

const endpoint = '/admin/capabilities'
export const adminCapabilitiesServices = {
  async list(params: AdminCapabilitiesParams): Promise<AdminCapabilitiesResponse> { return (await api.get<AdminCapabilitiesResponse>(endpoint, { params: buildApiParams(params) })).data },
  async create(body: CapabilityInput): Promise<AdminCapabilityResponse> { return (await api.post<AdminCapabilityResponse>(endpoint, body, { successMessageKey: 'created' })).data },
  async update(id: string, body: Partial<CapabilityInput>): Promise<AdminCapabilityResponse> { return (await api.patch<AdminCapabilityResponse>(`${endpoint}/${id}`, body, { successMessageKey: 'updated' })).data },
}
