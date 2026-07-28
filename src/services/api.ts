import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

import { API_ERROR_MESSAGES } from '@/constant/api-error-messages'
import { API_SUCCESS_MESSAGES, type ApiSuccessMessageKey } from '@/constant/api-success-messages'
import { normalizeApiError } from '@/lib/api-errors'
import { appendAuthorizationHeaders, clearAuthData } from '@/lib/cookies'
import { toast } from '@/lib/toast'
import type { ApiError } from '@/types/api.types'
import type { ToastPosition } from '@/types/toast.types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost/api/v1'
const SKIP_AUTH_URLS = ['/auth/login']
const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])
let hasHandledUnauthorized = false
let onUnauthorized: (() => void) | null = null

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipSuccessToast?: boolean
    skipErrorToast?: boolean
    successMessageKey?: ApiSuccessMessageKey
    successMessage?: string
    toastPosition?: ToastPosition
  }
}

export function setUnauthorizedHandler(fn: () => void): void { onUnauthorized = fn; hasHandledUnauthorized = false }
export function clearUnauthorizedHandler(): void { onUnauthorized = null }
export function resetUnauthorizedState(): void { hasHandledUnauthorized = false }

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null }
function numberValue(value: unknown, fallback = 0): number { const parsed = Number(value ?? fallback); return Number.isFinite(parsed) ? parsed : fallback }
function nullableNumber(value: unknown): number | null { return value == null ? null : numberValue(value) }

function normalizePagination(response: AxiosResponse): void {
  const payload = response.data
  if (!isRecord(payload) || !isRecord(payload.meta)) return
  const meta = payload.meta
  if ('current_page' in meta || 'per_page' in meta || 'last_page' in meta) {
    payload.meta = {
      currentPage: numberValue(meta.current_page, 1), from: nullableNumber(meta.from),
      lastPage: numberValue(meta.last_page, 1), path: typeof meta.path === 'string' ? meta.path : '',
      perPage: numberValue(meta.per_page, 20), to: nullableNumber(meta.to), total: numberValue(meta.total),
    }
  }
  if (!isRecord(payload.links)) payload.links = { first: null, last: null, prev: null, next: null }
}

function defaultSuccessKey(method: string): ApiSuccessMessageKey {
  if (method === 'DELETE') return 'deleted'
  if (method === 'PATCH' || method === 'PUT') return 'updated'
  return 'completed'
}

export const api = axios.create({ baseURL: BASE_URL, headers: { 'Content-Type': 'application/json', Accept: 'application/json' } })
api.interceptors.request.use((config: InternalAxiosRequestConfig) => appendAuthorizationHeaders(config))
api.interceptors.response.use(
  (response: AxiosResponse) => {
    normalizePagination(response)
    const method = response.config.method?.toUpperCase() ?? ''
    if (MUTATION_METHODS.has(method) && !response.config.skipSuccessToast) {
      const message = response.config.successMessage ?? API_SUCCESS_MESSAGES[response.config.successMessageKey ?? defaultSuccessKey(method)]
      toast.success(message, { position: response.config.toastPosition })
    }
    return response
  },
  (error: AxiosError<ApiError>) => {
    const config = error.config
    const status = error.response?.status
    const isLogin = SKIP_AUTH_URLS.some((endpoint) => (config?.url ?? '').includes(endpoint))
    const normalized = normalizeApiError(error, { isLogin })
    if (status === 401 && !isLogin) {
      if (!hasHandledUnauthorized) {
        hasHandledUnauthorized = true
        clearAuthData()
        toast.error(API_ERROR_MESSAGES.sessionExpired, { position: config?.toastPosition })
        onUnauthorized?.()
      }
      return Promise.reject(error)
    }
    if (!config?.skipErrorToast) {
      toast.error(normalized.message, { position: config?.toastPosition })
    }
    return Promise.reject(error)
  },
)
