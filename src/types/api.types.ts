// ─── Auth / Legacy (Login, RefreshToken) ──────────────────────────────────────
// Auth endpoints still use the old { statusCode, message, item } envelope

export interface ApiEnvelope<T> {
  statusCode: number
  message: string
  item: T
}

// ─── Dashboard API — Single resource ──────────────────────────────────────────
// GET /me, GET /me/permissions, GET /me/dashboard-context
// GET /admin/overview, GET /admin/analytics/kpis, etc.

export interface ApiSingleResponse<T> {
  data: T
  message: string
}

// ─── Dashboard API — Paginated list ───────────────────────────────────────────
// All list endpoints: GET /admin/users, GET /org/campaigns, etc.

export interface ApiListMeta {
  currentPage: number
  perPage: number
  total: number
  lastPage: number
}

export interface ApiListResponse<T> {
  data: T[]
  meta: ApiListMeta
  message: string
}

// ─── Dashboard API — Mutation (POST / PATCH / DELETE) ─────────────────────────
// Returns updated resource on POST/PATCH, or just message on DELETE (204)

export interface ApiMutationResponse<T = void> {
  data?: T
  message: string
}

// ─── Error ────────────────────────────────────────────────────────────────────

export interface ApiError {
  type: string
  title: string
  status: number
  traceId: string
  code?: string
  detail?: string
  errors?: Record<string, string[]>
}

// ─── Query params ─────────────────────────────────────────────────────────────
// Used by all list endpoints. TFilter is the feature-specific filter shape.
// Example: ApiListParams<{ status: string; search: string }>
// Serialized as: ?page=1&perPage=20&sort=-createdAt&filter.status=active&filter.search=ahmad

export interface ApiListParams<
  TFilter extends Record<string, unknown> = Record<string, unknown>,
> {
  page?: number
  perPage?: number
  sort?: string
  filter?: TFilter
}
