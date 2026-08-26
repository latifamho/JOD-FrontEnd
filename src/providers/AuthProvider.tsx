'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { authServices } from '@/features/shared/auth.services/auth.service'
import type {
  DashboardContextData,
  MeProfile,
  UserPermissions,
} from '@/features/shared/auth.services/auth.type'
import {
  clearAuthData,
  getAuthToken,
  getRefreshToken,
  getUser,
  setDashboardRole,
  setUser,
} from '@/lib/cookies'
import {
  clearUnauthorizedHandler,
  getRefreshedAccessToken,
  resetUnauthorizedState,
  setUnauthorizedHandler,
} from '@/services/api'

interface AuthContextValue {
  user: MeProfile | null
  permissions: UserPermissions | null
  dashboardContext: DashboardContextData | null
  dashboardRole: DashboardContextData['profile']['dashboardRole']
  isAuthenticated: boolean
  isLoading: boolean
  login: () => void
  logout: () => void
  updateUser: (user: MeProfile) => void
  setDashboardContext: (context: DashboardContextData) => void
  can: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUserState] = useState<MeProfile | null>(null)
  const [dashboardContext, setDashboardContextState] = useState<DashboardContextData | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const permissions = dashboardContext?.permissions ?? null
  const dashboardRole = dashboardContext?.profile.dashboardRole ?? null

  useEffect(() => {
    let active = true

    const hydrate = async () => {
      try {
        // Access cookie may have expired while refresh is still valid.
        if (!getAuthToken() && getRefreshToken()) {
          await getRefreshedAccessToken()
        }

        const token = getAuthToken()
        setUserState(getUser<MeProfile>())
        setIsAuthenticated(Boolean(token))

        if (!token) {
          if (active) setIsLoading(false)
          return
        }

        const response = await authServices.getDashboardContext()
        if (!active) return
        const context = response.data
        setDashboardContextState(context)
        setUserState(context.profile)
        setUser(context.profile)
        if (context.profile.dashboardRole) setDashboardRole(context.profile.dashboardRole)
      } catch {
        clearAuthData()
        if (!active) return
        setUserState(null)
        setDashboardContextState(null)
        setIsAuthenticated(false)
        if (window.location.pathname.startsWith('/dashboard')) {
          router.replace('/login')
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void hydrate()
    return () => { active = false }
  }, [router])

  const logout = useCallback(() => {
    clearAuthData()
    setUserState(null)
    setDashboardContextState(null)
    setIsAuthenticated(false)
    router.push('/')
  }, [router])

  const login = useCallback(() => {
    resetUnauthorizedState()
    setIsAuthenticated(true)
  }, [])

  const updateUser = useCallback((newUser: MeProfile) => {
    setUserState(newUser)
    setUser(newUser)
  }, [])

  const setDashboardContext = useCallback((context: DashboardContextData) => {
    setDashboardContextState(context)
    setUserState(context.profile)
    setUser(context.profile)
    if (context.profile.dashboardRole) setDashboardRole(context.profile.dashboardRole)
  }, [])

  const can = useCallback(
    (permission: string) => permissions?.flat[permission] === true,
    [permissions],
  )

  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => clearUnauthorizedHandler()
  }, [logout])

  const value = useMemo(
    () => ({
      user,
      permissions,
      dashboardContext,
      dashboardRole,
      isAuthenticated,
      isLoading,
      login,
      logout,
      updateUser,
      setDashboardContext,
      can,
    }),
    [
      user,
      permissions,
      dashboardContext,
      dashboardRole,
      isAuthenticated,
      isLoading,
      login,
      logout,
      updateUser,
      setDashboardContext,
      can,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}