export interface ApiEnvelope<T> {
  statusCode: number
  message: string
  item: T
}

export interface ApiError {
  type: string
  title: string
  status: number
  traceId: string
  code?: string
  detail?: string
  errors?: Record<string, string[]>
}

export interface QueryParams {
  page?: number
  perPage?: number
  sortingField?: string
  sortingDir?: 'asc' | 'desc'
  searchQueries?: { columnName: string; searchQuery: string }[]
}
