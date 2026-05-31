import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'

import {
  appendAuthorizationHeaders,
  clearAuthData,
  getRefreshToken,
  setAuthToken,
  setRefreshToken,
} from '@/lib/cookies'
import type { ApiEnvelope, ApiError } from '@/types/api.types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://jod.mustafafares.com/api/v1'

const SKIP_AUTH_URLS = ['/Auth/Login', '/Auth/RefreshToken']

type FailedRequest = {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

let isRefreshing = false
let failedQueue: FailedRequest[] = []
let hasHandledUnauthorized = false
let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(fn: () => void): void {
  onUnauthorized = fn
  hasHandledUnauthorized = false
}

export function clearUnauthorizedHandler(): void {
  onUnauthorized = null
}

function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else if (token) resolve(token)
  })
  failedQueue = []
}

function extractErrorMessage(error: ApiError): string {
  if (error.errors) {
    const firstKey = Object.keys(error.errors)[0]
    if (firstKey && error.errors[firstKey]?.length) {
      return error.errors[firstKey][0]
    }
  }
  if (error.title) {
    return error.detail ? `${error.title} - ${error.detail}` : error.title
  }
  return 'An unexpected error occurred'
}

// Separate instance for token refresh — avoids interceptor recursion
const refreshAxios = axios.create({ baseURL: BASE_URL })

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  appendAuthorizationHeaders(config)
  config.headers['Accept-Language'] = 'ar'
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
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const status: number = error.response?.status
    const url: string = originalRequest?.url ?? ''
    const isAuthEndpoint = SKIP_AUTH_URLS.some((endpoint) => url.includes(endpoint))

    if (status === 401 && !isAuthEndpoint && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        isRefreshing = false
        handleSessionExpiry()
        return Promise.reject(error)
      }

      try {
        const response = await refreshAxios.post<
          ApiEnvelope<{ token: string; refreshToken: string; expiresAt: string }>
        >('/Auth/RefreshToken', { refreshToken })

        const { token, refreshToken: newRefreshToken, expiresAt } = response.data.item
        setAuthToken(token, expiresAt)
        setRefreshToken(newRefreshToken)
        processQueue(null, token)

        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        handleSessionExpiry()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    const apiError = error.response?.data as ApiError | undefined
    if (apiError && status !== 401) {
      toast.error(extractErrorMessage(apiError))
    } else if (!apiError && status !== 401) {
      toast.error('An unexpected error occurred')
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
