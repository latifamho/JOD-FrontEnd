'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminRecommendationsServices } from './admin.recommendations.services'
import type { RecommendationSettingsUpdateRequest } from './admin.recommendations.types'

export function useRecommendationAnalytics(params?:{from?:string;to?:string}){
  return useQuery({queryKey:['admin','recommendations','analytics',params],queryFn:()=>adminRecommendationsServices.analytics(params)})
}
export function useRecommendationSettings(){
  return useQuery({queryKey:['admin','recommendations','settings'],queryFn:()=>adminRecommendationsServices.settings()})
}
export function useUpdateRecommendationSettings(){
  const queryClient=useQueryClient()
  return useMutation({mutationFn:(body:RecommendationSettingsUpdateRequest)=>adminRecommendationsServices.updateSettings(body),onSuccess:()=>queryClient.invalidateQueries({queryKey:['admin','recommendations','settings']})})
}
export function useRecommendationInspector(){
  return useMutation({mutationFn:(params:{userId:string;postId:string})=>adminRecommendationsServices.inspector(params)})
}
