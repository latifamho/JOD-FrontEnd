import Cookies from 'js-cookie'
import type { InternalAxiosRequestConfig } from 'axios'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const TOKEN_EXPIRES_KEY = 'token_expires_at'
const USER_KEY = 'user_data'
const LAST_APP_CODE_KEY = 'last_opened_app_code'

const AUTH_FREE_URLS = ['/Auth/Login', '/Auth/RefreshToken']

export function setAuthToken(token: string, expiresAt: string): void {
  const expiry = new Date(expiresAt)
  Cookies.set(ACCESS_TOKEN_KEY, token, { expires: expiry, secure: true, sameSite: 'Strict' })
  Cookies.set(TOKEN_EXPIRES_KEY, String(expiry.getTime()), { expires: expiry })
}

export function setRefreshToken(token: string): void {
  Cookies.set(REFRESH_TOKEN_KEY, token, { secure: true, sameSite: 'Strict' })
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

export function setLastOpenedAppCode(code: string): void {
  Cookies.set(LAST_APP_CODE_KEY, code)
}

export function getLastOpenedAppCode(): string | undefined {
  return Cookies.get(LAST_APP_CODE_KEY)
}

export function getAuthTokenData(): { access_token: string; expires_at: number } | null {
  const token = Cookies.get(ACCESS_TOKEN_KEY)
  const expiresAt = Cookies.get(TOKEN_EXPIRES_KEY)
  if (!token || !expiresAt) return null
  return { access_token: token, expires_at: Number(expiresAt) }
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_KEY)
}

export function clearAuthData(): void {
  Cookies.remove(ACCESS_TOKEN_KEY)
  Cookies.remove(REFRESH_TOKEN_KEY)
  Cookies.remove(TOKEN_EXPIRES_KEY)
  Cookies.remove(USER_KEY)
  Cookies.remove(LAST_APP_CODE_KEY)
}

export function appendAuthorizationHeaders(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const url = config.url ?? ''
  if (AUTH_FREE_URLS.some((endpoint) => url.includes(endpoint))) return config

  const tokenData = getAuthTokenData()
  if (!tokenData) return config

  const isExpired = Date.now() >= tokenData.expires_at
  if (isExpired) return config

  config.headers.Authorization = `Bearer ${tokenData.access_token}`
  return config
}
