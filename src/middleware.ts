import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ACCESS_TOKEN_COOKIE = 'access_token'
const DASHBOARD_ROLE_COOKIE = 'dashboard_role'

type DashboardRoleCookie = 'admin' | 'org_owner' | 'org_staff'

function getDashboardScope(pathname: string): DashboardRoleCookie | null {
  if (pathname.startsWith('/dashboard/admin')) return 'admin'
  if (pathname.startsWith('/dashboard/org-owner')) return 'org_owner'
  if (pathname.startsWith('/dashboard/org-staff')) return 'org_staff'
  return null
}

function getDashboardHome(role: DashboardRoleCookie): string {
  if (role === 'admin') return '/dashboard/admin'
  if (role === 'org_owner') return '/dashboard/org-owner'
  return '/dashboard/org-staff'
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  const dashboardRole = request.cookies.get(DASHBOARD_ROLE_COOKIE)?.value as
    | DashboardRoleCookie
    | undefined

  const isAuthenticated = Boolean(token)
  const isProtectedRoute = pathname.startsWith('/dashboard')
  const isAuthRoute = pathname === '/login' || pathname === '/register'

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && isAuthenticated) {
    const destination = dashboardRole ? getDashboardHome(dashboardRole) : '/dashboard/admin'
    return NextResponse.redirect(new URL(destination, request.url))
  }

  if (isProtectedRoute && isAuthenticated && dashboardRole) {
    const scope = getDashboardScope(pathname)
    if (scope && scope !== dashboardRole) {
      return NextResponse.redirect(new URL(getDashboardHome(dashboardRole), request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}