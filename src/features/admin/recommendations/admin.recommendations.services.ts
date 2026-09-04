import { api } from '@/services/api'
import type { RecommendationAnalyticsResponse } from './admin.recommendations.types'
export const adminRecommendationsServices = { async analytics(params?:{from?:string;to?:string}):Promise<RecommendationAnalyticsResponse>{ return (await api.get<RecommendationAnalyticsResponse>('/admin/analytics/recommendations',{params})).data } }
