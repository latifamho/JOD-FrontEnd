'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { orgDonorsServices } from './org.donors.services'
import { orgDonorsKeys, orgApplicantsKeys } from './org.donors.query-keys'
import type {
  OrgDonorsParams,
  DonorCreateRequest,
  DonorUpdateRequest,
  OrgApplicantsParams,
  ApplicantCreateRequest,
  ApplicantUpdateRequest,
} from './org.donors.types'

export function useOrgDonors(params: OrgDonorsParams, enabled = true) {
  return useQuery({
    queryKey: orgDonorsKeys.list(params),
    queryFn: () => orgDonorsServices.getDonors(params),
    enabled,
  })
}

export function useOrgDonor(donorId: string | null) {
  return useQuery({
    queryKey: orgDonorsKeys.detail(donorId ?? ''),
    queryFn: () => orgDonorsServices.getDonorById(donorId!),
    enabled: Boolean(donorId),
  })
}

export function useCreateOrgDonor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: DonorCreateRequest) => orgDonorsServices.createDonor(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgDonorsKeys.lists() })
    },
  })
}

export function useUpdateOrgDonor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ donorId, body }: { donorId: string; body: DonorUpdateRequest }) =>
      orgDonorsServices.updateDonor(donorId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgDonorsKeys.lists() })
    },
  })
}

export function useDeleteOrgDonor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (donorId: string) => orgDonorsServices.deleteDonor(donorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgDonorsKeys.lists() })
    },
  })
}

export function useOrgDonationWorkflowAction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ donorId, action, amount, reason }: { donorId: string; action: 'accept' | 'contact' | 'agree' | 'complete' | 'cancel'; amount?: number; reason?: string }) =>
      orgDonorsServices.runDonationAction(donorId, action, { amount, reason }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: orgDonorsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: orgDonorsKeys.detail(variables.donorId) })
    },
  })
}

export function useOrgApplicants(params: OrgApplicantsParams, enabled = true) {
  return useQuery({
    queryKey: orgApplicantsKeys.list(params),
    queryFn: () => orgDonorsServices.getApplicants(params),
    enabled,
  })
}

export function useOrgApplicant(applicantId: string | null) {
  return useQuery({
    queryKey: orgApplicantsKeys.detail(applicantId ?? ''),
    queryFn: () => orgDonorsServices.getApplicantById(applicantId!),
    enabled: Boolean(applicantId),
  })
}

export function useCreateOrgApplicant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: ApplicantCreateRequest) => orgDonorsServices.createApplicant(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgApplicantsKeys.lists() })
    },
  })
}

export function useUpdateOrgApplicant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ applicantId, body }: { applicantId: string; body: ApplicantUpdateRequest }) =>
      orgDonorsServices.updateApplicant(applicantId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgApplicantsKeys.lists() })
    },
  })
}

export function useOrgApplicantWorkflowAction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ applicantId, action }: { applicantId: string; action: 'accept' | 'contact' | 'complete' | 'reject' }) =>
      orgDonorsServices.runApplicantAction(applicantId, action),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: orgApplicantsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: orgApplicantsKeys.detail(variables.applicantId) })
    },
  })
}

export function useDeleteOrgApplicant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (applicantId: string) => orgDonorsServices.deleteApplicant(applicantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgApplicantsKeys.lists() })
    },
  })
}
