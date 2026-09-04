'use client'
import { useQuery } from '@tanstack/react-query'
import { adminRecommendationsServices } from './admin.recommendations.services'
export function useRecommendationAnalytics(params?:{from?:string;to?:string}){ return useQuery({queryKey:['admin','recommendations','analytics',params],queryFn:()=>adminRecommendationsServices.analytics(params)}) }
