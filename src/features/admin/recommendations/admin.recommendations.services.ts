import { api } from '@/services/api'
import type { RecommendationAnalyticsResponse, RecommendationInspectorResponse, RecommendationSettingsResponse, RecommendationSettingsUpdateRequest } from './admin.recommendations.types'

export const adminRecommendationsServices = {
  async analytics(params?:{from?:string;to?:string}):Promise<RecommendationAnalyticsResponse>{
    return (await api.get<RecommendationAnalyticsResponse>('/admin/analytics/recommendations',{params})).data
  },
  async inspector(params:{userId:string;postId:string}):Promise<RecommendationInspectorResponse>{
    return (await api.get<RecommendationInspectorResponse>('/admin/recommendations/inspector',{params})).data
  },
  async settings():Promise<RecommendationSettingsResponse>{
    return (await api.get<RecommendationSettingsResponse>('/admin/recommendations/settings')).data
  },
  async updateSettings(body:RecommendationSettingsUpdateRequest):Promise<RecommendationSettingsResponse>{
    return (await api.patch<RecommendationSettingsResponse>('/admin/recommendations/settings',body)).data
  },
}
