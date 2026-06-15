import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'

import { appendAuthorizationHeaders, clearAuthData } from '@/lib/cookies'
import type { ApiError } from '@/types/api.types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost/api/v1'

const SKIP_AUTH_URLS = ['/auth/login']

let hasHandledUnauthorized = false
let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(fn: () => void): void {
  onUnauthorized = fn
  hasHandledUnauthorized = false
}

export function clearUnauthorizedHandler(): void {
  onUnauthorized = null
}

function extractErrorMessage(error: ApiError): string {
  if (error.errors) {
    const firstKey = Object.keys(error.errors)[0]
    if (firstKey && error.errors[firstKey]?.length) {
      return error.errors[firstKey][0]
    }
  }
  return error.message ?? 'حدث خطأ غير متوقع'
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
    const method = response.config.method?.toUpperCase()
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method ?? '')
    if (isMutation && response.data?.message) {
      toast.success(response.data.message)
    }
    return response
  },
  (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig
    const status: number = error.response?.status
    const url: string = originalRequest?.url ?? ''
    const isAuthEndpoint = SKIP_AUTH_URLS.some((endpoint) => url.includes(endpoint))

    if (status === 401 && !isAuthEndpoint) {
      handleSessionExpiry()
      return Promise.reject(error)
    }

    const apiError = error.response?.data as ApiError | undefined
    if (apiError && status !== 401) {
      toast.error(extractErrorMessage(apiError))
    } else if (!apiError && status !== 401) {
      toast.error('حدث خطأ غير متوقع')
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
