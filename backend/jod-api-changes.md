# JOD Frontend API Contract — Response and Permission Changes

**Repository:** `MustafaFares445/jod`
**API prefix:** `/api/v1`
**Authentication:** Laravel Sanctum Bearer token
**Relevant backend version:** Commit `e5e4f1605ea7ae1d922ea393eaef15227fa5a14a`

---

## 1. Scope

This contract covers the following backend changes:

1. Every API response now includes a `message`.
2. Delete endpoints now return a JSON response instead of an empty `204` response.
3. The login response now includes the authenticated dashboard user's effective permissions.
4. Permission labels and descriptions returned to the frontend are in Arabic.
5. Permission identifiers remain stable English machine-readable keys.
6. Organization staff permissions are synchronized from the staff member's assigned organization role.
7. Seeded display data is now Arabic.

---

## 2. Request Headers

Authenticated requests must include:

```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer {token}
```

The Bearer token is not required for:

```http
POST /api/v1/auth/login
```

The login, logout, current-user permissions, and dashboard-context routes are registered under `/api/v1/auth` and `/api/v1/me`.

---

# 3. Standard Response Contract

## 3.1 Successful response with data

```json
{
  "data": {
    "id": "resource-id"
  },
  "message": "Data retrieved successfully."
}
```

TypeScript representation:

```ts
export interface ApiResponse<T> {
  data: T;
  message: string;
}
```

---

## 3.2 Successful response without data

Some operations, such as logout, return only a message:

```json
{
  "message": "Logged out successfully"
}
```

TypeScript representation:

```ts
export interface ApiMessageResponse {
  message: string;
}
```

The reusable backend response trait omits `data` when the supplied value is `null`.

---

## 3.3 Paginated collection response

Laravel resource collections retain their normal `data`, `links`, and `meta` values. A `message` is added at the root:

```json
{
  "data": [
    {
      "id": "resource-id"
    }
  ],
  "links": {
    "first": "https://example.com/api/v1/admin/users?page=1",
    "last": "https://example.com/api/v1/admin/users?page=4",
    "prev": null,
    "next": "https://example.com/api/v1/admin/users?page=2"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 4,
    "path": "https://example.com/api/v1/admin/users",
    "per_page": 20,
    "to": 20,
    "total": 75
  },
  "message": "Data retrieved successfully."
}
```

Recommended TypeScript representation:

```ts
export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginatedApiResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
  message: string;
}
```

---

## 3.4 Default response messages

When an endpoint does not provide a custom message, the API middleware supplies one based on the request method and response status.

| Situation                       | Default message                     |
| ------------------------------- | ----------------------------------- |
| Successful `GET`                | `Data retrieved successfully.`      |
| Successful `POST` with HTTP 201 | `Data created successfully.`        |
| Other successful `POST`         | `Operation completed successfully.` |
| Successful `PATCH` or `PUT`     | `Data updated successfully.`        |
| Successful `DELETE`             | `Data deleted successfully.`        |
| HTTP 401                        | `Unauthenticated.`                  |
| HTTP 403                        | `This action is unauthorized.`      |
| HTTP 404                        | `Resource not found.`               |
| HTTP 500 or higher              | `Server error.`                     |

These defaults are applied globally to routes matching `api/*`.

### Frontend rule

The frontend must not use the message text to determine application behavior.

Use:

* HTTP status codes for error handling.
* Response data for application state.
* `message` only for notifications, alerts, or toast messages.

---

# 4. Delete Endpoint Change

## Previous behavior

```http
HTTP/1.1 204 No Content
```

There was no JSON body.

## New behavior

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "message": "Data deleted successfully."
}
```

The global API middleware converts API `204` responses into message-bearing JSON responses.

## Required frontend change

Do not require HTTP `204` when determining whether deletion succeeded.

Recommended logic:

```ts
async function deleteResource(url: string): Promise<string> {
  const response = await api.delete<ApiMessageResponse>(url);

  return response.data.message;
}
```

Accept any successful `2xx` response unless an endpoint has a more specific contract.

---

# 5. Error Response Contract

## 5.1 General error

```json
{
  "message": "This action is unauthorized."
}
```

Recommended TypeScript representation:

```ts
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
```

---

## 5.2 Validation error

Status:

```http
HTTP/1.1 422 Unprocessable Entity
```

Example:

```json
{
  "message": "The email field is required.",
  "errors": {
    "email": [
      "The email field is required."
    ]
  }
}
```

Frontend behavior:

1. Display `message` as the general error.
2. Map `errors` entries to form fields.
3. Do not assume `errors` exists for every unsuccessful response.

Example:

```ts
interface ValidationErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}
```

---

## 5.3 Authentication error

Status:

```http
HTTP/1.1 401 Unauthorized
```

Possible response:

```json
{
  "message": "Unauthenticated."
}
```

Invalid login credentials return:

```json
{
  "message": "The provided credentials are incorrect."
}
```

The frontend should branch using HTTP `401`, not the exact English message.

---

## 5.4 Authorization error

Status:

```http
HTTP/1.1 403 Forbidden
```

Example:

```json
{
  "message": "This action is unauthorized."
}
```

Frontend behavior:

* Keep the user logged in.
* Show an access-denied state or notification.
* Do not redirect to login solely because the response is `403`.

---

# 6. Login Endpoint

## Endpoint

```http
POST /api/v1/auth/login
```

## Authentication

Not required.

## Request body

```json
{
  "email": "admin@jod.com",
  "password": "password"
}
```

## Successful response

Status:

```http
HTTP/1.1 200 OK
```

```json
{
  "data": {
    "token": "1|plain-text-sanctum-token",
    "tokenType": "Bearer",
    "user": {
      "id": "user-uuid",
      "name": "مدير النظام",
      "email": "admin@jod.com",
      "phone": "+962791234567",
      "userType": "admin",
      "status": "active",
      "organizationId": null,
      "postsCount": null,
      "reportsCount": null,
      "createdAt": "2026-07-22T01:00:00+00:00",
      "updatedAt": "2026-07-22T01:00:00+00:00",
      "lastActiveAt": "2026-07-22T01:30:00+00:00"
    },
    "permissions": {
      "modules": [],
      "flat": {},
      "granted": []
    }
  },
  "message": "Logged in successfully"
}
```

The backend synchronizes organization-role permissions before generating the token and permission response.

The `user` object contains the fields defined by `UserResource`.

---

## TypeScript contract

```ts
export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  userType: string;
  status: string;
  organizationId: string | null;
  postsCount: number | null;
  reportsCount: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  lastActiveAt: string | null;
}

export interface LoginResponseData {
  token: string;
  tokenType: "Bearer";
  user: AuthenticatedUser;
  permissions: UserPermissions;
}

export type LoginResponse = ApiResponse<LoginResponseData>;
```

---

## Frontend login flow

After receiving a successful response:

1. Store `data.token`.
2. Store `data.user`.
3. Store `data.permissions`.
4. Configure authenticated requests with:

```http
Authorization: Bearer {data.token}
```

5. Build dashboard navigation using permission keys.
6. Do not make a second permissions request immediately after login unless fresh data is explicitly required.

Example:

```ts
const response = await api.post<LoginResponse>("/auth/login", {
  email,
  password,
});

authStore.setToken(response.data.data.token);
authStore.setUser(response.data.data.user);
authStore.setPermissions(response.data.data.permissions);
```

---

# 7. Permission Response Model

The permission response has three representations:

```json
{
  "modules": [],
  "flat": {},
  "granted": []
}
```

The backend builds `flat` from every catalog permission and sets each value to `true` or `false`. `granted` contains only the names whose value is `true`.

---

## 7.1 Permission module

```ts
export interface PermissionModule {
  key: string;
  label: string;
  order: number;
  groups: PermissionGroup[];
}
```

Example:

```json
{
  "key": "organization",
  "label": "إدارة المؤسسة",
  "order": 30,
  "groups": []
}
```

Module keys remain English machine values, while labels are Arabic:

| Key            | Arabic label    |
| -------------- | --------------- |
| `core`         | `الأساسيات`     |
| `admin`        | `إدارة المنصة`  |
| `organization` | `إدارة المؤسسة` |

---

## 7.2 Permission group

```ts
export interface PermissionGroup {
  key: string;
  label: string;
  sectionKey: string | null;
  sectionLabel: string | null;
  description: string;
  order: number;
  depth: number;
  permissions: PermissionItem[];
}
```

Example:

```json
{
  "key": "org.campaigns",
  "label": "الحملات",
  "sectionKey": "campaigns",
  "sectionLabel": "الحملات",
  "description": "إدارة حملات المؤسسة.",
  "order": 210,
  "depth": 3,
  "permissions": []
}
```

---

## 7.3 Permission item

```ts
export interface PermissionItem {
  key: string;
  name: string;
  label: string;
  allowed: boolean;
}
```

Example:

```json
{
  "key": "create",
  "name": "org.campaigns.create",
  "label": "إنشاء الحملات",
  "allowed": true
}
```

Properties:

| Property  | Meaning                                              |
| --------- | ---------------------------------------------------- |
| `key`     | Action only, such as `view`, `create`, or `approve`. |
| `name`    | Complete stable permission identifier.               |
| `label`   | Arabic text intended for display.                    |
| `allowed` | Whether the authenticated user has the permission.   |

Action values remain stable English keys, while display labels are Arabic.

---

## 7.4 Flat permission map

```ts
export type PermissionMap = Record<string, boolean>;
```

Example:

```json
{
  "dashboard.view": true,
  "users.view": true,
  "users.create": false,
  "org.campaigns.view": true,
  "org.campaigns.create": true,
  "org.campaigns.delete": false
}
```

Recommended frontend permission helper:

```ts
export function can(
  permissions: UserPermissions | null | undefined,
  permission: string,
): boolean {
  return permissions?.flat?.[permission] === true;
}
```

Usage:

```ts
const canCreateCampaign = can(
  authStore.permissions,
  "org.campaigns.create",
);
```

---

## 7.5 Granted permission list

```ts
export type GrantedPermissions = string[];
```

Example:

```json
[
  "dashboard.view",
  "org.campaigns.view",
  "org.campaigns.create",
  "org.posts.view"
]
```

This is useful when the frontend prefers sets:

```ts
const grantedPermissions = new Set(
  authStore.permissions.granted,
);

const canUpdatePost = grantedPermissions.has(
  "org.posts.update",
);
```

---

## 7.6 Complete permissions type

```ts
export interface UserPermissions {
  modules: PermissionModule[];
  flat: Record<string, boolean>;
  granted: string[];
}
```

---

# 8. Current User Permissions Endpoint

## Endpoint

```http
GET /api/v1/me/permissions
```

## Authentication

Required.

## Successful response

```json
{
  "data": {
    "modules": [
      {
        "key": "organization",
        "label": "إدارة المؤسسة",
        "order": 30,
        "groups": []
      }
    ],
    "flat": {
      "dashboard.view": true,
      "org.campaigns.view": true,
      "org.campaigns.create": false
    },
    "granted": [
      "dashboard.view",
      "org.campaigns.view"
    ]
  },
  "message": "Data retrieved successfully."
}
```

Use this endpoint when:

* Refreshing the application.
* Restoring an existing session.
* Rechecking access after an administrator changes a user's role.
* Reloading permissions without requiring the user to log in again.

The endpoint is protected by Sanctum.

---

# 9. Dashboard Context Endpoint

## Endpoint

```http
GET /api/v1/me/dashboard-context
```

## Authentication

Required.

## Permission location

Permissions remain available at:

```text
data.permissions
```

Example structure:

```json
{
  "data": {
    "profile": {},
    "permissions": {
      "modules": [],
      "flat": {},
      "granted": []
    },
    "counters": {
      "unreadNotifications": 0,
      "pendingReviews": 0,
      "openReports": 0
    }
  },
  "message": "Data retrieved successfully."
}
```

The frontend may use this endpoint to hydrate the dashboard profile, permissions, and counters in one request.

---

# 10. Organization Permission Catalog Endpoint

## Endpoint

```http
GET /api/v1/org/permissions/catalog
```

## Authentication

Required.

## Additional requirement

The authenticated user must belong to an organization.

## Purpose

Use this endpoint for:

* Organization role create forms.
* Organization role update forms.
* Permission checkbox lists.
* Grouped permission selectors.

The route is registered alongside organization staff and role endpoints.

## Successful response

```json
{
  "data": [
    {
      "id": "org.campaigns.view",
      "name": "عرض الحملات",
      "group": "الحملات"
    },
    {
      "id": "org.campaigns.create",
      "name": "إنشاء الحملات",
      "group": "الحملات"
    }
  ],
  "message": "Data retrieved successfully."
}
```

The catalog contains organization permissions only. Each entry maps the complete permission name to an Arabic display label and Arabic group label.

## TypeScript contract

```ts
export interface PermissionCatalogItem {
  id: string;
  name: string;
  group: string;
}

export type PermissionCatalogResponse =
  ApiResponse<PermissionCatalogItem[]>;
```

## Role form payload

Send permission identifiers using the `id` values returned by the catalog:

```json
{
  "name": "مدير الحملات",
  "description": "يمكنه إدارة الحملات والمنشورات.",
  "permissions": [
    "org.campaigns.view",
    "org.campaigns.create",
    "org.campaigns.update",
    "org.posts.view"
  ],
  "is_active": true
}
```

Do not send Arabic permission labels as permission values.

Correct:

```json
"org.campaigns.create"
```

Incorrect:

```json
"إنشاء الحملات"
```

---

# 11. Permission Naming Rules

Permission names follow one of these formats:

```text
{group}.{action}
```

Example:

```text
users.view
```

Or:

```text
{module}.{section}.{action}
```

Example:

```text
org.campaigns.create
```

Frontend requirements:

1. Treat permission `name` values as opaque stable identifiers.
2. Do not construct permission names from Arabic labels.
3. Do not translate permission identifiers.
4. Use the backend-provided `label` for display.
5. Use `flat[name]` or `granted.includes(name)` for permission checks.
6. Never rely only on hidden frontend buttons for security; the backend still enforces policies.

This matches the supplied permission-flow guide, where effective permissions are returned for interface control while backend policies remain the authorization boundary.

---

# 12. Organization Role Synchronization

Organization dashboard users receive effective permissions based on their linked organization staff record and organization role.

Permissions are synchronized when:

* The user logs in.
* A staff member is assigned a role.
* A staff member's role changes.
* A role's permission list changes.
* A staff member is removed or disabled.
* Seeded users and roles are created.

## Frontend effect

After changing a role or staff assignment, refresh permissions using:

```http
GET /api/v1/me/permissions
```

For the affected currently logged-in user, a fresh login will also synchronize and return the latest permissions.

Do not permanently cache permissions across sessions.

---

# 13. Arabic Seed Data

Human-readable seeded data is now Arabic, including:

* User names.
* Organization names and descriptions.
* Staff names.
* Organization role names and descriptions.
* Campaign titles and content.
* Post titles and content.
* Notifications.
* Reports.
* Articles.
* Badges.
* Donor and applicant display data.

## Frontend requirements

* Render all API strings as UTF-8.
* Support right-to-left Arabic display.
* Avoid assumptions that seeded names or descriptions are English.
* Keep machine-readable fields unchanged.

Examples of machine-readable values that remain English:

```json
{
  "status": "active",
  "userType": "admin",
  "category": "health",
  "permission": "org.campaigns.view"
}
```

The frontend may translate known enum values separately, but it must not modify values sent back to the API.

---

# 14. Frontend Migration Checklist

The frontend must apply these changes:

* [ ] Read `message` from every successful and unsuccessful API response.
* [ ] Stop requiring HTTP `204` for successful deletions.
* [ ] Accept the new HTTP `200` delete response with a JSON message.
* [ ] Store `data.permissions` from the login response.
* [ ] Use `permissions.flat` for fast permission checks.
* [ ] Use permission `name` or catalog `id` as the submitted permission value.
* [ ] Display backend-provided Arabic permission labels.
* [ ] Refresh `/me/permissions` after role changes when necessary.
* [ ] Handle Arabic seeded content and RTL layouts.
* [ ] Branch on HTTP status codes rather than exact message text.
* [ ] Keep `401` and `403` handling separate.
* [ ] Preserve Laravel pagination fields for collection endpoints.

---

# 15. Suggested Axios Error Handler

```ts
import axios, { AxiosError } from "axios";

interface ApiErrorPayload {
  message?: string;
  errors?: Record<string, string[]>;
}

export function handleApiError(error: unknown): {
  status: number | null;
  message: string;
  errors: Record<string, string[]>;
} {
  if (!axios.isAxiosError(error)) {
    return {
      status: null,
      message: "حدث خطأ غير متوقع.",
      errors: {},
    };
  }

  const axiosError = error as AxiosError<ApiErrorPayload>;
  const status = axiosError.response?.status ?? null;
  const payload = axiosError.response?.data;

  return {
    status,
    message: payload?.message ?? "تعذر إكمال العملية.",
    errors: payload?.errors ?? {},
  };
}
```

---

# 16. Suggested Authentication State

```ts
export interface AuthState {
  token: string | null;
  user: AuthenticatedUser | null;
  permissions: UserPermissions | null;
}

export const initialAuthState: AuthState = {
  token: null,
  user: null,
  permissions: null,
};
```

Permission helper:

```ts
export function hasPermission(
  state: AuthState,
  permissionName: string,
): boolean {
  return state.permissions?.flat?.[permissionName] === true;
}
```

Example UI gating:

```tsx
{hasPermission(authState, "org.campaigns.create") && (
  <CreateCampaignButton />
)}
```

The frontend permission check controls presentation only. Unauthorized API requests will still be rejected by backend policies.
