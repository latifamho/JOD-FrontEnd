import { api } from '@/services/api'
import type { OrgCapabilitiesBriefResponse } from './org.capabilities.types'

export const orgCapabilitiesServices = {
  async getBrief(): Promise<OrgCapabilitiesBriefResponse> {
    const response = await api.get<OrgCapabilitiesBriefResponse>('/org/capabilities/brief')
    return response.data
  },
}
