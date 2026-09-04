import { api } from '@/services/api'
import type { RecommendationAnalyticsResponse, RecommendationInspectorResponse } from './admin.recommendations.types'

export const adminRecommendationsServices = {
  async analytics(params?:{from?:string;to?:string}):Promise<RecommendationAnalyticsResponse>{
    return (await api.get<RecommendationAnalyticsResponse>('/admin/analytics/recommendations',{params})).data
  },
  async inspector(params:{userId:string;postId:string}):Promise<RecommendationInspectorResponse>{
    return (await api.get<RecommendationInspectorResponse>('/admin/recommendations/inspector',{params})).data
  },
}
