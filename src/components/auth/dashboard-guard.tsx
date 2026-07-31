'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import {
  getFirstAllowedRoute,
  getOrganizationPermissionForPath,
  isOrganizationRouteEnabled,
  type DashboardRole,
} from '@/constant/routes'
import { useAuth } from '@/providers/AuthProvider'

function toRouteRole(role: 'admin' | 'org_owner' | 'org_staff'): DashboardRole {
  if (role === 'admin') return 'admin'
  return role === 'org_owner' ? 'organization_owner' : 'organization_staff'
}

export function DashboardGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { dashboardRole, isAuthenticated, isLoading, can } = useAuth()

  useEffect(() => {
    if (isLoading || !isAuthenticated || !dashboardRole) return

    const routeRole = toRouteRole(dashboardRole)
    const fallback = getFirstAllowedRoute(routeRole, can)

    if (!isOrganizationRouteEnabled(pathname)) {
      router.replace(fallback)
      return
    }

    if (dashboardRole === 'org_staff') {
      const permission = getOrganizationPermissionForPath(pathname)
      if (permission && !can(permission)) router.replace(fallback)
    }
  }, [can, dashboardRole, isAuthenticated, isLoading, pathname, router])

  if (isLoading) return null
  return <>{children}</>
}