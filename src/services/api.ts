import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { API_ERROR_MESSAGES } from "@/constant/api-error-messages";
import {
  API_SUCCESS_MESSAGES,
  type ApiSuccessMessageKey,
} from "@/constant/api-success-messages";
import { END_POINTS } from "@/features/shared/query-apis";
import type { RefreshTokenResponse } from "@/features/shared/auth.services/auth.type";
import { normalizeApiError } from "@/lib/api-errors";
import {
  appendAuthorizationHeaders,
  clearAuthData,
  getRefreshToken,
  setAuthTokens,
} from "@/lib/cookies";
import { toast } from "@/lib/toast";
import type { ApiError } from "@/types/api.types";
import type { ToastPosition } from "@/types/toast.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const LOGIN_URLS = [END_POINTS.AUTH.LOGIN, END_POINTS.COMPANY_AUTH.LOGIN];
const PUBLIC_AUTH_URLS = [
  ...LOGIN_URLS,
  END_POINTS.AUTH.REFRESH,
  END_POINTS.COMPANY_AUTH.REGISTER,
];
const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

let hasHandledUnauthorized = false;
let onUnauthorized: (() => void) | null = null;
let refreshPromise: Promise<string> | null = null;

declare module "axios" {
  export interface AxiosRequestConfig {
    skipSuccessToast?: boolean;
    skipErrorToast?: boolean;
    successMessageKey?: ApiSuccessMessageKey;
    successMessage?: string;
    toastPosition?: ToastPosition;
  }
}

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _authRetry?: boolean;
};

export function setUnauthorizedHandler(fn: () => void): void {
  onUnauthorized = fn;
  hasHandledUnauthorized = false;
}

export function clearUnauthorizedHandler(): void {
  onUnauthorized = null;
}

export function resetUnauthorizedState(): void {
  hasHandledUnauthorized = false;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function numberValue(value: unknown, fallback = 0): number {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function nullableNumber(value: unknown): number | null {
  return value == null ? null : numberValue(value);
}

function normalizePagination(response: AxiosResponse): void {
  const payload = response.data;
  if (!isRecord(payload) || !isRecord(payload.meta)) return;
  const meta = payload.meta;
  if ("current_page" in meta || "per_page" in meta || "last_page" in meta) {
    payload.meta = {
      currentPage: numberValue(meta.current_page, 1),
      from: nullableNumber(meta.from),
      lastPage: numberValue(meta.last_page, 1),
      path: typeof meta.path === "string" ? meta.path : "",
      perPage: numberValue(meta.per_page, 20),
      to: nullableNumber(meta.to),
      total: numberValue(meta.total),
    };
  }
  if (!isRecord(payload.links)) {
    payload.links = { first: null, last: null, prev: null, next: null };
  }
}

function defaultSuccessKey(method: string): ApiSuccessMessageKey {
  if (method === "DELETE") return "deleted";
  if (method === "PATCH" || method === "PUT") return "updated";
  return "completed";
}

function includesEndpoint(url: string, endpoints: readonly string[]): boolean {
  return endpoints.some((endpoint) => url.includes(endpoint));
}

function handleUnauthorized(config?: InternalAxiosRequestConfig): void {
  if (hasHandledUnauthorized) return;
  hasHandledUnauthorized = true;
  clearAuthData();
  toast.error(API_ERROR_MESSAGES.sessionExpired, {
    position: config?.toastPosition,
  });
  onUnauthorized?.();
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("Missing refresh token.");

  const baseUrl = BASE_URL.replace(/\/+$/, "");
  const response = await axios.post<RefreshTokenResponse>(
    `${baseUrl}${END_POINTS.AUTH.REFRESH}`,
    { refreshToken },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );

  const pair = response.data?.data;
  if (!pair?.token || !pair?.refreshToken) {
    throw new Error("Invalid refresh response.");
  }

  // Atomically replace both tokens (refresh tokens are single-use).
  setAuthTokens(pair);
  hasHandledUnauthorized = false;
  return pair.token;
}

/** Single-flight refresh — shared by the 401 interceptor and session hydrate. */
export function getRefreshedAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) =>
  appendAuthorizationHeaders(config),
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    normalizePagination(response);
    const method = response.config.method?.toUpperCase() ?? "";
    if (MUTATION_METHODS.has(method) && !response.config.skipSuccessToast) {
      const message =
        response.config.successMessage ??
        API_SUCCESS_MESSAGES[
          response.config.successMessageKey ?? defaultSuccessKey(method)
        ];
      toast.success(message, { position: response.config.toastPosition });
    }
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const config = error.config as RetriableRequestConfig | undefined;
    const status = error.response?.status;
    const url = config?.url ?? "";
    const isLogin = includesEndpoint(url, LOGIN_URLS);
    const isPublicAuthRequest = includesEndpoint(url, PUBLIC_AUTH_URLS);

    if (
      status === 401 &&
      config &&
      !isPublicAuthRequest &&
      !config._authRetry &&
      getRefreshToken()
    ) {
      config._authRetry = true;
      try {
        const accessToken = await getRefreshedAccessToken();
        config.headers.Authorization = `Bearer ${accessToken}`;
        return api.request(config);
      } catch {
        handleUnauthorized(config);
        return Promise.reject(error);
      }
    }

    const normalized = normalizeApiError(error, { isLogin });

    // Do not treat failed login/refresh/register as an expired dashboard session.
    if (status === 401 && !isLogin && !isPublicAuthRequest) {
      handleUnauthorized(config);
      return Promise.reject(error);
    }

    if (!config?.skipErrorToast) {
      toast.error(normalized.message, { position: config?.toastPosition });
    }

    return Promise.reject(error);
  },
);
