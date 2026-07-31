'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { API_SUCCESS_MESSAGES } from '@/constant/api-success-messages'
import { clearAuthData, setAuthToken, setDashboardRole, setUser } from '@/lib/cookies'
import type { DashboardRoleCookie } from '@/lib/cookies'
import { toast } from '@/lib/toast'
import { useAuth } from '@/providers/AuthProvider'
import { authServices } from './auth.service'
import type { DashboardRole, LoginRequest } from './auth.type'

function normalizeDashboardRole(role: DashboardRole | null): DashboardRoleCookie | null {
  if (role === 'admin' || role === 'org_owner' || role === 'org_staff') return role
  return null
}

function getDashboardHome(role: DashboardRole): string {
  if (role === 'admin') return '/dashboard/admin'
  if (role === 'org_owner') return '/dashboard/org-owner'
  return '/dashboard/org-staff'
}

export function useLogin() {
  const router = useRouter()
  const { login, setDashboardContext } = useAuth()

  return useMutation({
    mutationFn: (data: LoginRequest) => authServices.login(data),
    onSuccess: async (response) => {
      const { token } = response.data

      setAuthToken(token)

      try {
        const contextResponse = await authServices.getDashboardContext()
        const context = contextResponse.data
        const { profile } = context
        const role = normalizeDashboardRole(profile.dashboardRole)

        if (!role) {
          clearAuthData()
          throw new Error('The authenticated account does not have dashboard access.')
        }

        setUser(profile)
        setDashboardRole(role)
        login()
        setDashboardContext(context)
        toast.success(API_SUCCESS_MESSAGES.loginSuccess)

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
