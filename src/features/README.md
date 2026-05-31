# Feature Services

Every API domain lives in its own folder here, organized by dashboard scope.

```
src/features/
├── shared/          ← used by 2+ dashboards (auth, common lookups)
├── admin/           ← admin dashboard only
├── org-owner/       ← org-owner dashboard only
└── org-staff/       ← org-staff dashboard only
```

**Rule:** If a service is only called from one dashboard, put it in that dashboard's folder.
If it's called from two or more, put it in `shared/`.

---

## Folder structure per feature

Every feature — regardless of scope — follows the same 4-file pattern:

```
<scope>/<name>.services/
├── <name>.type.ts           # all types (request, response, domain)
├── <name>.service.ts        # HTTP methods only — no React, no cookies, no toasts
├── <name>.query-keys.ts     # React Query cache key factory
└── <name>.query.ts          # useQuery / useMutation hooks — only thing components import
```

---

## Step-by-step: adding a feature

### Example — users management (admin only)

#### 1 — Decide the scope

Used only by admin → goes in `src/features/admin/users.services/`

---

#### 2 — `user.type.ts` — all types

```ts
// src/features/admin/users.services/user.type.ts

export interface User {
  id: number
  name: string
  email: string
  phone: string
  isActive: boolean
  createdAt: string
}

export interface UserList {
  totalItemsCount: number
  pageSize: number
  items: User[]
}

export interface GetUsersParams {
  PageNumber?: number
  PageSize?: number
  SortingField?: string
  SortingDir?: 'asc' | 'desc'
  SearchQueries?: { columnName: string; searchQuery: string }[]
}

export interface CreateUserRequest {
  name: string
  email: string
  phone: string
}

export interface UpdateUserRequest extends CreateUserRequest {
  id: number
}

export interface ApiUserListResponse {
  statusCode: number
  message: string
  item: UserList
}

export interface ApiUserResponse {
  statusCode: number
  message: string
  item: User
}
```

---

#### 3 — `user.service.ts` — HTTP calls only

Endpoints live here as a local constant. Only move an endpoint to `utils/query-apis.ts`
if another scope (org-owner, org-staff) also calls the exact same URL.

```ts
// src/features/admin/users.services/user.service.ts

import { api } from '@/services/api'
import type {
  ApiUserListResponse,
  ApiUserResponse,
  CreateUserRequest,
  GetUsersParams,
  UpdateUserRequest,
  User,
  UserList,
} from './user.type'

const END_POINTS = {
  GET_LIST:  '/User/Get',
  GET_BY_ID: '/User/GetById',
  CREATE:    '/User/Create',
  UPDATE:    '/User/Update',
  DELETE:    '/User/Delete',
  TOGGLE:    '/User/Toggle',
} as const

function buildQueryParams(params: GetUsersParams): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  if (params.PageNumber !== undefined) result.PageNumber = params.PageNumber
  if (params.PageSize   !== undefined) result.PageSize   = params.PageSize
  if (params.SortingField)             result.SortingField = params.SortingField
  if (params.SortingDir)               result.SortingDir   = params.SortingDir

  params.SearchQueries?.forEach((q, i) => {
    result[`SearchQueries[${i}].columnName`]  = q.columnName
    result[`SearchQueries[${i}].searchQuery`] = q.searchQuery
  })

  return result
}

export const userServices = {
  async getList(params: GetUsersParams): Promise<UserList> {
    const response = await api.get<ApiUserListResponse>(END_POINTS.GET_LIST, {
      params: buildQueryParams(params),
    })
    return response.data.item
  },

  async getById(id: number): Promise<User> {
    const response = await api.get<ApiUserResponse>(END_POINTS.GET_BY_ID, { params: { id } })
    return response.data.item
  },

  async create(data: CreateUserRequest): Promise<void> {
    await api.post(END_POINTS.CREATE, data)
  },

  async update(data: UpdateUserRequest): Promise<void> {
    await api.put(END_POINTS.UPDATE, data)
  },

  async delete(id: number): Promise<void> {
    await api.delete(END_POINTS.DELETE, { params: { id } })
  },

  async toggle(id: number): Promise<void> {
    await api.patch(END_POINTS.TOGGLE, null, { params: { id } })
  },
}
```

> **File uploads:** build `FormData` with PascalCase field names and pass
> `{ headers: { 'Content-Type': 'multipart/form-data' } }` as the third argument to `api.post`.

---

#### 4 — `user.query-keys.ts` — cache key factory

```ts
// src/features/admin/users.services/user.query-keys.ts

import type { GetUsersParams } from './user.type'

export const userKeys = {
  all:     ['admin', 'users'] as const,
  lists:   () => [...userKeys.all, 'list']          as const,
  list:    (params: GetUsersParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail']        as const,
  detail:  (id: number | null) => [...userKeys.details(), id] as const,
}
```

> Prefix the root key with the scope (`'admin'`, `'org-owner'`, `'org-staff'`)
> so keys from different dashboards never collide in the shared cache.

| Key | Invalidates |
|-----|-------------|
| `userKeys.all` | everything in admin/users |
| `userKeys.lists()` | all list queries |
| `userKeys.list(params)` | one specific paginated list |
| `userKeys.details()` | all detail queries |
| `userKeys.detail(id)` | one user by id |

---

#### 5 — `user.query.ts` — hooks

The **only file components import from**. Cache invalidation lives here.

```ts
// src/features/admin/users.services/user.query.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userServices } from './user.service'
import { userKeys } from './user.query-keys'
import type { CreateUserRequest, GetUsersParams, UpdateUserRequest } from './user.type'

export function useUsers(params: GetUsersParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn:  () => userServices.getList(params),
  })
}

export function useUser(id: number | null) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn:  () => userServices.getById(id!),
    enabled:  !!id,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUserRequest) => userServices.create(data),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: userKeys.lists() }),
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateUserRequest) => userServices.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.details() })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => userServices.delete(id),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: userKeys.lists() }),
  })
}

export function useToggleUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => userServices.toggle(id),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: userKeys.lists() }),
  })
}
```

---

#### 6 — Use in a component

```tsx
import { useUsers, useCreateUser } from '@/features/admin/users.services/user.query'

export function UsersPage() {
  const { data, isLoading } = useUsers({ PageNumber: 1, PageSize: 10 })
  const createUser = useCreateUser()

  if (isLoading) return <div>جارٍ التحميل...</div>

  return (
    <div>
      {data?.items.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
      <button onClick={() => createUser.mutate({ name: 'أحمد', email: 'ahmed@example.com', phone: '07XXXXXXXX' })}>
        إضافة مستخدم
      </button>
    </div>
  )
}
```

Error and success toasts are automatic from `api.ts` — do not add them in components or hooks.

---

## Where does a new service go?

```
Is it called from more than one dashboard?
├── Yes → src/features/shared/<name>.services/
└── No  → src/features/<dashboard>/<name>.services/
              admin | org-owner | org-staff
```

---

## Rules

| Rule | Detail |
|------|--------|
| Components import from `*.query.ts` only | Never import `*.service.ts` directly |
| Services contain HTTP only | No `useState`, no `useRouter`, no cookies, no toast |
| Side effects in `*.query.ts` | Cache invalidation, cookie writes, context updates go in `onSuccess` |
| Endpoints are local | Define `END_POINTS` in the service file; add to `utils/query-apis.ts` only if 2+ scopes share the same URL |
| Query keys are scoped | Prefix root key with scope: `['admin', 'users']`, `['org-owner', 'campaigns']` |
| Return domain types | Unwrap `response.data.item` in the service — hooks receive clean data |
| Query params are PascalCase | `PageNumber`, `PageSize`, `SortingField`, `SortingDir` |
| Arrays use bracket notation | `SearchQueries[0].columnName`, `RoleIds[0]` |

---

## Checklist for any new feature

- [ ] Decide scope: `shared/` or `admin/` or `org-owner/` or `org-staff/`
- [ ] Create `src/features/<scope>/<name>.services/`
- [ ] `<name>.type.ts` — domain + request + API envelope types
- [ ] `<name>.service.ts` — async methods + local `END_POINTS`
- [ ] `<name>.query-keys.ts` — prefixed root key + `lists()` / `list(params)` / `details()` / `detail(id)`
- [ ] `<name>.query.ts` — one hook per operation + `invalidateQueries` in `onSuccess`
- [ ] Components import from `<name>.query.ts` only
