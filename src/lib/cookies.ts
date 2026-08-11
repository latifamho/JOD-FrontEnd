import Cookies from "js-cookie";
import type { InternalAxiosRequestConfig } from "axios";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user_data";
const DASHBOARD_ROLE_KEY = "dashboard_role";

const AUTH_FREE_URLS = [
  "/auth/login",
  "/auth/refresh",
  "/company/auth/login",
  "/company/auth/register",
];

type CookieAttributes = NonNullable<Parameters<typeof Cookies.set>[2]>;

const BASE_COOKIE_OPTIONS: CookieAttributes = {
  // `secure: true` drops cookies on http://localhost and breaks refresh locally.
  secure:
    typeof window === "undefined"
      ? process.env.NODE_ENV === "production"
      : window.location.protocol === "https:",
  sameSite: "Strict",
};

export type DashboardRoleCookie = "admin" | "org_owner" | "org_staff";

export type AuthTokenCookiePayload = {
  token: string;
  refreshToken: string;
  expiresAt?: string;
  refreshExpiresAt?: string;
};

function cookieOptions(expiresAt?: string): CookieAttributes {
  if (!expiresAt) return BASE_COOKIE_OPTIONS;
  const expires = new Date(expiresAt);
  if (Number.isNaN(expires.getTime())) return BASE_COOKIE_OPTIONS;
  return { ...BASE_COOKIE_OPTIONS, expires };
}

export function setAuthToken(token: string): void {
  Cookies.set(ACCESS_TOKEN_KEY, token, BASE_COOKIE_OPTIONS);
}

export function setAuthTokens(tokens: AuthTokenCookiePayload): void {
  Cookies.set(ACCESS_TOKEN_KEY, tokens.token, cookieOptions(tokens.expiresAt));
  Cookies.set(
    REFRESH_TOKEN_KEY,
    tokens.refreshToken,
    cookieOptions(tokens.refreshExpiresAt),
  );
}

export function getAuthToken(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_KEY);
}

export function setUser<T>(user: T): void {
  Cookies.set(USER_KEY, JSON.stringify(user), BASE_COOKIE_OPTIONS);
}

export function getUser<T>(): T | null {
  const raw = Cookies.get(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setDashboardRole(role: DashboardRoleCookie): void {
  Cookies.set(DASHBOARD_ROLE_KEY, role, BASE_COOKIE_OPTIONS);
}

export function getDashboardRole(): DashboardRoleCookie | undefined {
  return Cookies.get(DASHBOARD_ROLE_KEY) as DashboardRoleCookie | undefined;
}

export function clearAuthData(): void {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  Cookies.remove(USER_KEY);
  Cookies.remove(DASHBOARD_ROLE_KEY);
}

export function appendAuthorizationHeaders(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const url = config.url ?? "";
  if (AUTH_FREE_URLS.some((endpoint) => url.includes(endpoint))) return config;
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}
