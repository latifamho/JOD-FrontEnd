'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { adminOrganizationsServices } from './admin.organizations.services'
import { adminOrganizationsKeys } from './admin.organizations.query-keys'
import type {
  AdminOrganizationsParams,
  OrganizationCreateRequest,
  OrganizationUpdateRequest,
  OrganizationStatusToggleRequest,
  OrganizationVerificationToggleRequest,
} from './admin.organizations.types'

export function useAdminOrganizations(params: AdminOrganizationsParams) {
  return useQuery({
    queryKey: adminOrganizationsKeys.list(params),
    queryFn: () => adminOrganizationsServices.getOrganizations(params),
  })
}

export function useAdminOrganizationDetail(organizationId: string | null) {
  return useQuery({
    queryKey: adminOrganizationsKeys.detail(organizationId ?? ''),
    queryFn: () => adminOrganizationsServices.getOrganizationById(organizationId!),
    enabled: !!organizationId && organizationId !== 'verification',
    retry: 1,
  })
}

export function useCreateOrganization() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: OrganizationCreateRequest) =>
      adminOrganizationsServices.createOrganization(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminOrganizationsKeys.lists() })
    },
  })
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ organizationId, body }: { organizationId: string; body: OrganizationUpdateRequest }) =>
      adminOrganizationsServices.updateOrganization(organizationId, body),
    onSuccess: (_data, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: adminOrganizationsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: adminOrganizationsKeys.detail(organizationId) })
    },
  })
}

export function useToggleOrganizationStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ organizationId, body }: { organizationId: string; body: OrganizationStatusToggleRequest }) =>
      adminOrganizationsServices.toggleOrganizationStatus(organizationId, body),
    onSuccess: (_data, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: adminOrganizationsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: adminOrganizationsKeys.detail(organizationId) })
    },
  })
}

export function useToggleOrganizationVerification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ organizationId, body }: { organizationId: string; body: OrganizationVerificationToggleRequest }) =>
      adminOrganizationsServices.toggleOrganizationVerification(organizationId, body),
    onSuccess: (_data, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: adminOrganizationsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: adminOrganizationsKeys.detail(organizationId) })
    },
  })
}

export function useAcceptOrganization() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (organizationId: string) => adminOrganizationsServices.acceptOrganization(organizationId),
    onSuccess: (_data, organizationId) => {
      queryClient.invalidateQueries({ queryKey: adminOrganizationsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: adminOrganizationsKeys.detail(organizationId) })
    },
  })
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (organizationId: string) => adminOrganizationsServices.deleteOrganization(organizationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminOrganizationsKeys.lists() })
    },
  })
}
