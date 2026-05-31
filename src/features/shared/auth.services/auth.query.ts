'use client'

import { useMutation } from '@tanstack/react-query'

import { setAuthToken, setLastOpenedAppCode, setRefreshToken, setUser } from '@/lib/cookies'
import { useAuth } from '@/providers/AuthProvider'
import { authServices } from './auth.service'
import type { LoginRequest } from './auth.type'

export function useLogin() {
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
    },
  })
}
