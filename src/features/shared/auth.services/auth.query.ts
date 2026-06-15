'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { clearAuthData, setAuthToken, setDashboardRole, setUser } from '@/lib/cookies'
import type { DashboardRoleCookie } from '@/lib/cookies'
import { useAuth } from '@/providers/AuthProvider'
import { authServices } from './auth.service'
import type { DashboardRole, LoginRequest, MeProfile } from './auth.type'

function resolveDashboardRole(profile: MeProfile): DashboardRoleCookie {
  if (profile.userType === 'admin') return 'admin'
  // Both org_owner and org_staff have userType 'general' with an organizationId.
  // Defaulting to org_owner; staff access is enforced inside the dashboard via permissions.
  if (profile.userType === 'general' && profile.organizationId) return 'org_owner'
  return 'org_staff'
}

function getDashboardHome(role: DashboardRole): string {
  if (role === 'admin') return '/dashboard/admin'
  if (role === 'org_owner') return '/dashboard/org-owner'
  return '/dashboard/org-staff'
}

export function useLogin() {
  const router = useRouter()
  const { login, updateUser } = useAuth()

  return useMutation({
    mutationFn: (data: LoginRequest) => authServices.login(data),
    onSuccess: async (response) => {
      const { token } = response.data

      setAuthToken(token)

      try {
        const meResponse = await authServices.getMe()
        const profile = meResponse.data

        const role = resolveDashboardRole(profile)
        setUser(profile)
        setDashboardRole(role)
        login()
        updateUser(profile)

        router.push(getDashboardHome(role))
      } catch {
        clearAuthData()
      }
    },
  })
}

export function useLogout() {
  const { logout } = useAuth()

  return useMutation({
    mutationFn: () => authServices.logout(),
    onSettled: () => {
      logout()
    },
  })
}
