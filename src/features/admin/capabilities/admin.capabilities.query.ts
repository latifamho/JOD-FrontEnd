'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminCapabilitiesServices } from './admin.capabilities.services'
import type { AdminCapabilitiesParams, CapabilityInput, CapabilityStatus } from './admin.capabilities.types'

export const adminCapabilitiesKeys = {
  all: ['admin', 'capabilities'] as const,
  list: (params: AdminCapabilitiesParams) => ['admin', 'capabilities', 'list', params] as const,
}

export function useAdminCapabilities(params: AdminCapabilitiesParams) {
  return useQuery({ queryKey: adminCapabilitiesKeys.list(params), queryFn: () => adminCapabilitiesServices.list(params) })
}

export function useCreateCapability() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (body: CapabilityInput) => adminCapabilitiesServices.create(body), onSuccess: () => qc.invalidateQueries({ queryKey: adminCapabilitiesKeys.all }) })
}

export function useUpdateCapability() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, body }: { id: string; body: Partial<CapabilityInput> }) => adminCapabilitiesServices.update(id, body), onSuccess: () => qc.invalidateQueries({ queryKey: adminCapabilitiesKeys.all }) })
}

export function useUpdateCapabilityStatus() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, status }: { id: string; status: CapabilityStatus }) => adminCapabilitiesServices.updateStatus(id, status), onSuccess: () => qc.invalidateQueries({ queryKey: adminCapabilitiesKeys.all }) })
}

export function useDeleteCapability() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (id: string) => adminCapabilitiesServices.remove(id), onSuccess: () => qc.invalidateQueries({ queryKey: adminCapabilitiesKeys.all }) })
}
