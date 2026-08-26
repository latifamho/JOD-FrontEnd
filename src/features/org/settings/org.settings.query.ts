'use client'
import { useMutation,useQuery,useQueryClient } from '@tanstack/react-query'
import { orgSettingsServices } from './org.settings.services'
import type { OrganizationBankAccountUpdateRequest,OrganizationPasswordUpdateRequest,OrganizationProfileUpdateRequest } from './org.settings.types'
export const orgSettingsKeys={profile:['org','settings','profile'] as const,bankAccount:['org','settings','bank-account'] as const}
export function useOrgSettingsProfile(){return useQuery({queryKey:orgSettingsKeys.profile,queryFn:orgSettingsServices.getProfile})}
export function useOrgBankAccount(){return useQuery({queryKey:orgSettingsKeys.bankAccount,queryFn:orgSettingsServices.getBankAccount})}
export function useUpdateOrgSettingsProfile(){const q=useQueryClient();return useMutation({mutationFn:(b:OrganizationProfileUpdateRequest)=>orgSettingsServices.updateProfile(b),onSuccess:()=>q.invalidateQueries({queryKey:orgSettingsKeys.profile})})}
export function useUpdateOrgBankAccount(){const q=useQueryClient();return useMutation({mutationFn:(b:OrganizationBankAccountUpdateRequest)=>orgSettingsServices.updateBankAccount(b),onSuccess:()=>q.invalidateQueries({queryKey:orgSettingsKeys.bankAccount})})}
export function useUpdateOrgSettingsPassword(){return useMutation({mutationFn:(b:OrganizationPasswordUpdateRequest)=>orgSettingsServices.updatePassword(b)})}
