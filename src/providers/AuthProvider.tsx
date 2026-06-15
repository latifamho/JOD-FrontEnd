'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { clearAuthData, getAuthToken, getUser } from '@/lib/cookies'
import { clearUnauthorizedHandler, setUnauthorizedHandler } from '@/services/api'
import type { MeProfile } from '@/features/shared/auth.services/auth.type'

interface AuthContextValue {
  user: MeProfile | null
  isAuthenticated: boolean
  login: () => void
  logout: () => void
  updateUser: (user: MeProfile) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const [user, setUserState] = useState<MeProfile | null>(() => getUser<MeProfile>())
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getAuthToken()))

  const logout = useCallback(() => {
    clearAuthData()
    setUserState(null)
    setIsAuthenticated(false)
    router.push('/login')
  }, [router])

  const login = useCallback(() => {
    setIsAuthenticated(true)
  }, [])

  const updateUser = useCallback((newUser: MeProfile) => {
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
