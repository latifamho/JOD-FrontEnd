'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminCapabilitiesServices } from './admin.capabilities.services'
import type { AdminCapabilitiesParams, CapabilityInput } from './admin.capabilities.types'

const keys = { all: ['admin','capabilities'] as const, list: (params: AdminCapabilitiesParams) => ['admin','capabilities','list',params] as const }
export function useAdminCapabilities(params: AdminCapabilitiesParams) { return useQuery({ queryKey: keys.list(params), queryFn: () => adminCapabilitiesServices.list(params) }) }
export function useCreateCapability() { const qc = useQueryClient(); return useMutation({ mutationFn: (body: CapabilityInput) => adminCapabilitiesServices.create(body), onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }) }) }
export function useUpdateCapability() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, body }: { id: string; body: Partial<CapabilityInput> }) => adminCapabilitiesServices.update(id, body), onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }) }) }
