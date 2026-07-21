import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { toast } from 'sonner'

import { appendAuthorizationHeaders, clearAuthData } from '@/lib/cookies'
import type { ApiError } from '@/types/api.types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost/api/v1'

const SKIP_AUTH_URLS = ['/auth/login']
const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

let hasHandledUnauthorized = false
let onUnauthorized: (() => void) | null = null

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** Skip success toast for this request (default: false for mutations). */
    skipSuccessToast?: boolean
    /** Skip error toast for this request (default: false). */
    skipErrorToast?: boolean
  }
}

export function setUnauthorizedHandler(fn: () => void): void {
  onUnauthorized = fn
  hasHandledUnauthorized = false
}

export function clearUnauthorizedHandler(): void {
  onUnauthorized = null
}

/**
 * Shared backend error shape (`ApiError`):
 * - `{ message, error?, code? }` — general errors (403/404/422/…)
 * - `{ message, errors: { field: string[] } }` — validation (400/422)
 */
export function extractErrorMessage(error: ApiError | undefined): string {
  if (!error) return 'حدث خطأ غير متوقع'

  if (error.errors) {
    const firstKey = Object.keys(error.errors)[0]
    const firstMessage = firstKey ? error.errors[firstKey]?.[0] : undefined
    if (firstMessage) return firstMessage
  }

  return error.message ?? error.error ?? 'حدث خطأ غير متوقع'
}

function getSuccessMessage(response: AxiosResponse): string | null {
  const payload = response.data as { message?: string } | undefined
  if (payload?.message) return payload.message

  // DELETE often returns 204 No Content with no body
  if (response.status === 204 || response.config.method?.toUpperCase() === 'DELETE') {
    return 'تمت العملية بنجاح'
  }

  return null
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  appendAuthorizationHeaders(config)
  return config
})

api.interceptors.response.use(
  (response: AxiosResponse) => {
    const method = response.config.method?.toUpperCase() ?? ''
    const isMutation = MUTATION_METHODS.has(method)

    if (isMutation && !response.config.skipSuccessToast) {
      const message = getSuccessMessage(response)
      if (message) toast.success(message)
    }

    return response
  },
  (error: AxiosError<ApiError>) => {
    const originalRequest = error.config
    const status = error.response?.status
    const url = originalRequest?.url ?? ''
    const isAuthEndpoint = SKIP_AUTH_URLS.some((endpoint) => url.includes(endpoint))

    // Session expired on protected routes — redirect once, skip normal error toast
    if (status === 401 && !isAuthEndpoint) {
      handleSessionExpiry()
      return Promise.reject(error)
    }

    if (!originalRequest?.skipErrorToast) {
      const apiError = error.response?.data
      toast.error(extractErrorMessage(apiError))
    }

    return Promise.reject(error)
  },
)

function handleSessionExpiry(): void {
  if (hasHandledUnauthorized) return
  hasHandledUnauthorized = true
  clearAuthData()
  toast.error('انتهت الجلسة، يرجى تسجيل الدخول مجددًا')
  onUnauthorized?.()
}
