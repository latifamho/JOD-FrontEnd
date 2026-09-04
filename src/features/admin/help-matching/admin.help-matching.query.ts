'use client'
import { useQuery } from '@tanstack/react-query'
import { adminHelpMatchingServices } from './admin.help-matching.services'
import type { HelpMatchParams } from './admin.help-matching.types'
export function useAdminHelpMatches(params:HelpMatchParams){ return useQuery({queryKey:['admin','help-matches',params],queryFn:()=>adminHelpMatchingServices.list(params)}) }
export function useAdminHelpMatch(id:string|null){ return useQuery({queryKey:['admin','help-matches','detail',id],queryFn:()=>adminHelpMatchingServices.detail(id!),enabled:Boolean(id)}) }
export function useAdminHelpMonitoring(params?:{from?:string;to?:string}){ return useQuery({queryKey:['admin','help-matching','analytics',params],queryFn:()=>adminHelpMatchingServices.analytics(params)}) }
