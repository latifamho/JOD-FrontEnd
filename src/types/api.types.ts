export interface ApiSingleResponse<T> { data: T; message: string }
export interface ApiMessageResponse { message: string }
export interface PaginationLinks { first: string | null; last: string | null; prev: string | null; next: string | null }
export interface LaravelPaginationMeta { current_page: number; from: number | null; last_page: number; path: string; per_page: number; to: number | null; total: number }
export interface ApiListMeta { currentPage: number; from: number | null; lastPage: number; path: string; perPage: number; to: number | null; total: number }
export interface ApiListResponse<T> { data: T[]; links: PaginationLinks; meta: ApiListMeta; message: string }
export interface ApiMutationResponse<T = void> extends ApiMessageResponse { data?: T }
export interface ApiError { error?: string; message?: string; code?: string | number; errors?: Record<string, string[]> }
export interface ApiListParams<TFilter extends Record<string, unknown> = Record<string, unknown>> { page?: number; perPage?: number; sort?: string; filter?: TFilter }
