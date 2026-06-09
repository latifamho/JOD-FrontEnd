'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { setAuthToken, setLastOpenedAppCode, setRefreshToken, setUser } from '@/lib/cookies'
import { useAuth } from '@/providers/AuthProvider'
import { authServices } from './auth.service'
import type { LoginRequest, User } from './auth.type'

function getDashboardRoute(platformRole: User['platformRole']): string {
  if (platformRole === 'admin') return '/dashboard/admin'
  if (platformRole === 'owner') return '/dashboard/org-owner'
  return '/dashboard/org-staff'
}

export function useLogin() {
  const router = useRouter()
  const { login, updateUser } = useAuth()

  return useMutation({
    mutationFn: (data: LoginRequest) => authServices.login(data),
    onSuccess: (response) => {
      const { token, refreshToken, expiresAt, user, lastOpenedApplicationCode } = response.item

      setAuthToken(token, expiresAt)
      setRefreshToken(refreshToken)
      setUser(user)

      if (lastOpenedApplicationCode) {
        setLastOpenedAppCode(lastOpenedApplicationCode)
      }

      login({ access_token: token, expires_at: Math.floor(new Date(expiresAt).getTime() / 1000) })
      updateUser(user)

      router.push(getDashboardRoute(user.platformRole))
    },
  })
}
