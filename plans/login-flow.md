# Login Flow Implementation Plan

**API Base URL:** `http://localhost/api/v1`  
**Auth Method:** Laravel Sanctum Bearer token  
**Last Updated:** 2026-06-15

---

## Current State vs New Contract — Gaps

| Area | Current Code | New API Contract | Action Required |
|---|---|---|---|
| Login endpoint | `/Auth/Login` | `/auth/login` | Update endpoint |
| Request body | `{ username, password, rememberMe }` | `{ email, password }` | Update request type + form field name |
| Response envelope | `{ statusCode, message, item: { token, refreshToken, expiresAt, user } }` | `{ data: { token, tokenType, user: { id, name, email } }, message }` | Update response types |
| Refresh token | Yes (`/Auth/RefreshToken`) | Not in contract (Sanctum tokens are long-lived) | Remove refresh flow |
| User shape | `{ id, name, email, image, platformRole }` | Login returns `{ id, name, email }` only | Fetch `/me` after login for full profile |
| Role routing | Based on `user.platformRole` | `userType` field lives on `/me` response | Call `/me` post-login, route from `userType` |
| Token expiry | Cookie with `expiresAt` from server | No expiry returned by Sanctum | Store indefinitely; clear on 401 |

---

## Implementation Steps

### Step 1 — Update Auth Types (`auth.type.ts`)

Replace the old types to match the new API contract.

```typescript
// New login request — email replaces username, no rememberMe
export interface LoginRequest {
  email: string
  password: string
}

// What the login endpoint returns inside data{}
export interface LoginData {
  token: string
  tokenType: 'Bearer'
  user: {
    id: string
    name: string
    email: string
  }
}

export interface LoginResponse {
  data: LoginData
  message: string
}

// Full profile returned by GET /me
export interface MeProfile {
  id: string
  name: string
  email: string
  phone: string
  userType: 'admin' | 'general' | 'volunteer' | 'donor' | 'job_seeker'
  organizationId: string | null
  organizationName: string | null
  status: string
  createdAt: string
  lastActiveAt: string
}

export interface MeResponse {
  data: MeProfile
  message: string
}
```

**File:** `src/features/shared/auth.services/auth.type.ts`

---

### Step 2 — Update Endpoint Constants (`query-apis.ts`)

```typescript
export const END_POINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
  ME: {
    PROFILE: '/me',
    PERMISSIONS: '/me/permissions',
    DASHBOARD_CONTEXT: '/me/dashboard-context',
  },
} as const
```

**File:** `src/features/shared/query-apis.ts`

---

### Step 3 — Update Auth Service (`auth.service.ts`)

```typescript
export const authServices = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(END_POINTS.AUTH.LOGIN, data)
    return response.data
  },

  async logout(): Promise<void> {
    await api.post(END_POINTS.AUTH.LOGOUT)
  },

  async getMe(): Promise<MeResponse> {
    const response = await api.get<MeResponse>(END_POINTS.ME.PROFILE)
    return response.data
  },
}
```

**File:** `src/features/shared/auth.services/auth.service.ts`

---

### Step 4 — Update Cookies / Token Storage (`cookies.ts`)

The new Sanctum tokens have no server-issued expiry. Simplify token storage:

- Remove `setRefreshToken`, `getRefreshToken` (Sanctum does not issue refresh tokens)
- Remove `TOKEN_EXPIRES_KEY` and expiry logic
- Keep `setAuthToken(token)` — stores Bearer token in a cookie without expiry (persists until logout or 401)
- Keep `setUser`, `getUser`, `clearAuthData`

```typescript
// Simplified setAuthToken — no expiry date
export function setAuthToken(token: string): void {
  Cookies.set(ACCESS_TOKEN_KEY, token, { secure: true, sameSite: 'Strict' })
}

// appendAuthorizationHeaders — remove expiry check
export function appendAuthorizationHeaders(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const url = config.url ?? ''
  if (AUTH_FREE_URLS.some((e) => url.includes(e))) return config
  const token = Cookies.get(ACCESS_TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}
```

**File:** `src/lib/cookies.ts`

---

### Step 5 — Update API Interceptor (`api.ts`)

- Remove the token refresh interceptor block entirely (no `/Auth/RefreshToken`)
- On 401: clear auth data and trigger `onUnauthorized` redirect
- Update `SKIP_AUTH_URLS` to match new endpoint casing: `['/auth/login']`

```typescript
const SKIP_AUTH_URLS = ['/auth/login']

// 401 handler simplification:
if (status === 401 && !isAuthEndpoint) {
  handleSessionExpiry()
  return Promise.reject(error)
}
```

**File:** `src/services/api.ts`

---

### Step 6 — Update Login Mutation (`auth.query.ts`)

The login mutation needs to:
1. POST `/auth/login` → receive token
2. Store token in cookie
3. GET `/me` → receive full profile with `userType`
4. Route based on `userType`

```typescript
function getDashboardRoute(userType: MeProfile['userType'], organizationId: string | null): string {
  if (userType === 'admin') return '/dashboard/admin'
  // General users with an org are either owner or staff — determined by their org role.
  // For now route to org-owner; permissions gate will redirect staff if needed.
  if (userType === 'general' && organizationId) return '/dashboard/org-owner'
  return '/dashboard/org-staff'
}

export function useLogin() {
  const router = useRouter()
  const { login, updateUser } = useAuth()

  return useMutation({
    mutationFn: (data: LoginRequest) => authServices.login(data),
    onSuccess: async (response) => {
      const { token } = response.data

      setAuthToken(token)
      login()

      // Fetch full profile to know userType for routing
      const meResponse = await authServices.getMe()
      const profile = meResponse.data

      setUser(profile)
      updateUser(profile)

      router.push(getDashboardRoute(profile.userType, profile.organizationId))
    },
  })
}
```

**File:** `src/features/shared/auth.services/auth.query.ts`

---

### Step 7 — Update Login Page Form (`login/page.tsx`)

The only UI change needed:
- The form field already maps to `values.email` ✅
- Change the `mutate` call: remove `username` and `rememberMe`, send `email` and `password`

```typescript
// Before
submitLogin({ username: values.email, password: values.password, rememberMe: false })

// After
submitLogin({ email: values.email, password: values.password })
```

**File:** `src/app/(auth)/login/page.tsx`

---

### Step 8 — Update AuthProvider (`AuthProvider.tsx`)

- Update `User` type import to `MeProfile`
- Simplify `login()` signature — no longer needs token data since storage is handled in the mutation

```typescript
interface AuthContextValue {
  user: MeProfile | null
  isAuthenticated: boolean
  login: () => void       // simplified — token stored before calling this
  logout: () => void
  updateUser: (user: MeProfile) => void
}
```

**File:** `src/providers/AuthProvider.tsx`

---

## Role Routing Logic

| `userType` | `organizationId` | Route |
|---|---|---|
| `admin` | `null` | `/dashboard/admin` |
| `general` | set | `/dashboard/org-owner` (owner) or `/dashboard/org-staff` |
| `volunteer` / `donor` / `job_seeker` | `null` | Show "access denied" or redirect to public site |

> **Note:** Distinguishing org-owner vs org-staff cannot be determined from `userType` alone — both are `general`. The cleaner approach is to call `GET /me/permissions` after login and check for the `org.staff.manage` permission (only owners have it). If this is out of scope for the MVP, default all `general` users with an org to `/dashboard/org-owner` and rely on the permission guard inside the dashboard to redirect staff users.

---

## Post-Login Bootstrap Sequence (for dashboard layout)

After the router navigates to the dashboard, the layout should:

1. `GET /me` → topbar user name/email (may reuse cached value from login)
2. `GET /me/permissions` → gate sidebar menu items
3. `GET /admin/overview` or `GET /org/overview` → KPI cards

This is separate from the login flow itself and belongs in the dashboard layout.

---

## Logout Flow

```
User clicks logout
→ POST /auth/logout  (revokes Sanctum token on server)
→ clearAuthData()    (removes cookie)
→ redirect /login
```

Add a `useLogout` mutation in `auth.query.ts`:

```typescript
export function useLogout() {
  const { logout } = useAuth()

  return useMutation({
    mutationFn: () => authServices.logout(),
    onSettled: () => {
      logout() // clears cookie + state, redirects to /login
    },
  })
}
```

---

## Error Handling

| Scenario | HTTP Code | UI Action |
|---|---|---|
| Wrong credentials | 401 | Show field error "البريد الإلكتروني أو كلمة المرور غير صحيحة." |
| Validation failure | 422 | Map `errors` object to form fields |
| Server error | 500 | Toast: "حدث خطأ في الخادم، حاول مجدداً" |
| Session expired | 401 on any request | Clear token → redirect to `/login` |

---

## Files Changed Summary

| File | Change |
|---|---|
| `src/features/shared/auth.services/auth.type.ts` | Replace all types with new contract types |
| `src/features/shared/query-apis.ts` | Update endpoint paths, add ME endpoints |
| `src/features/shared/auth.services/auth.service.ts` | Add `getMe()`, `logout()`; update `login()` |
| `src/features/shared/auth.services/auth.query.ts` | Rewrite `useLogin`, add `useLogout` |
| `src/lib/cookies.ts` | Remove refresh-token + expiry logic; simplify `setAuthToken` |
| `src/services/api.ts` | Remove refresh-token interceptor; update `SKIP_AUTH_URLS` |
| `src/providers/AuthProvider.tsx` | Update `User` type to `MeProfile`; simplify `login()` signature |
| `src/app/(auth)/login/page.tsx` | Change `submitLogin` call to `{ email, password }` |

---

## Out of Scope (for now)

- Register flow (separate API endpoints)
- Password reset
- Permission-based sidebar gating (dashboard layout concern)
- Dashboard bootstrap calls (`/me/permissions`, `/admin/overview`, etc.)
