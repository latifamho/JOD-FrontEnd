'use client'
import { useMutation,useQuery,useQueryClient } from '@tanstack/react-query'
import { orgReportsServices } from './org.reports.services'
import { orgReportsKeys } from './org.reports.query-keys'
import type { ClaimOrgReportRequest,CloseOrgReportRequest,OrgReportsParams } from './org.reports.types'
export function useOrgReports(p:OrgReportsParams){return useQuery({queryKey:orgReportsKeys.list(p),queryFn:()=>orgReportsServices.getReports(p)})}
export function useOrgReportDetail(id:string|null){return useQuery({queryKey:orgReportsKeys.detail(id??''),queryFn:()=>orgReportsServices.getReportById(id!),enabled:!!id})}
export function useClaimOrgReport(){const q=useQueryClient();return useMutation({mutationFn:({reportId,body={}}:{reportId:string;body?:ClaimOrgReportRequest})=>orgReportsServices.claim(reportId,body),onSuccess:(_,{reportId})=>{q.invalidateQueries({queryKey:orgReportsKeys.lists()});q.invalidateQueries({queryKey:orgReportsKeys.detail(reportId)})}})}
export function useCloseOrgReport(){const q=useQueryClient();return useMutation({mutationFn:({reportId,body={}}:{reportId:string;body?:CloseOrgReportRequest})=>orgReportsServices.close(reportId,body),onSuccess:(_,{reportId})=>{q.invalidateQueries({queryKey:orgReportsKeys.lists()});q.invalidateQueries({queryKey:orgReportsKeys.detail(reportId)})}})}
