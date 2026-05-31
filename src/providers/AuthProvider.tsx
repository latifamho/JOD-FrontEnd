'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { clearAuthData, getAuthTokenData, getUser } from '@/lib/cookies'
import { clearUnauthorizedHandler, setUnauthorizedHandler } from '@/services/api'
import type { User } from '@/features/shared/auth.services/auth.type'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  login: (tokenData: { access_token: string; expires_at: number }) => void
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const [user, setUserState] = useState<User | null>(() => getUser<User>())
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const tokenData = getAuthTokenData()
    return !!tokenData && Date.now() < tokenData.expires_at
  })

  const logout = useCallback(() => {
    clearAuthData()
    setUserState(null)
    setIsAuthenticated(false)
    router.push('/login')
  }, [router])

  const login = useCallback((_tokenData: { access_token: string; expires_at: number }) => {
    setIsAuthenticated(true)
  }, [])

  const updateUser = useCallback((newUser: User) => {
    setUserState(newUser)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => clearUnauthorizedHandler()
  }, [logout])

  const value = useMemo(
    () => ({ user, isAuthenticated, login, logout, updateUser }),
    [user, isAuthenticated, login, logout, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
