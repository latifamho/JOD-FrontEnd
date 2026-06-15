import Cookies from 'js-cookie'
import type { InternalAxiosRequestConfig } from 'axios'

const ACCESS_TOKEN_KEY = 'access_token'
const USER_KEY = 'user_data'
const DASHBOARD_ROLE_KEY = 'dashboard_role'

const AUTH_FREE_URLS = ['/auth/login']

export type DashboardRoleCookie = 'admin' | 'org_owner' | 'org_staff'

export function setAuthToken(token: string): void {
  Cookies.set(ACCESS_TOKEN_KEY, token, { secure: true, sameSite: 'Strict' })
}

export function getAuthToken(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_KEY)
}

export function setUser<T>(user: T): void {
  Cookies.set(USER_KEY, JSON.stringify(user), { secure: true, sameSite: 'Strict' })
}

export function getUser<T>(): T | null {
  const raw = Cookies.get(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function setDashboardRole(role: DashboardRoleCookie): void {
  Cookies.set(DASHBOARD_ROLE_KEY, role, { secure: true, sameSite: 'Strict' })
}

export function getDashboardRole(): DashboardRoleCookie | undefined {
  return Cookies.get(DASHBOARD_ROLE_KEY) as DashboardRoleCookie | undefined
}

export function clearAuthData(): void {
  Cookies.remove(ACCESS_TOKEN_KEY)
  Cookies.remove(USER_KEY)
  Cookies.remove(DASHBOARD_ROLE_KEY)
}

export function appendAuthorizationHeaders(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const url = config.url ?? ''
  if (AUTH_FREE_URLS.some((e) => url.includes(e))) return config
  const token = Cookies.get(ACCESS_TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}
