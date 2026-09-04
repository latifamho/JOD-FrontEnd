import { api } from '@/services/api'
import { buildApiParams } from '@/lib/build-api-params'
import type { HelpMatchDetailResponse, HelpMatchListResponse, HelpMatchParams, HelpMonitoringResponse } from './admin.help-matching.types'
export const adminHelpMatchingServices = {
  async list(params:HelpMatchParams):Promise<HelpMatchListResponse>{ return (await api.get<HelpMatchListResponse>('/admin/help-matches',{params:buildApiParams(params)})).data },
  async detail(id:string):Promise<HelpMatchDetailResponse>{ return (await api.get<HelpMatchDetailResponse>(`/admin/help-matches/${id}`)).data },
  async analytics(params?:{from?:string;to?:string}):Promise<HelpMonitoringResponse>{ return (await api.get<HelpMonitoringResponse>('/admin/analytics/help-matching',{params})).data },
}
