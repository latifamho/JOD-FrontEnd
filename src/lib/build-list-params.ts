/**
 * Builds list query params for Spatie Laravel Query Builder.
 *
 * Backend expects bracket notation: `filter[status]=active`
 * NOT dotted keys: `filter.status=active` (those are ignored by Spatie).
 */
export type ListQueryParams = {
  page?: number
  perPage?: number
  sort?: string
  /** @deprecated Prefer `sort`. Kept for endpoints that still accept sortBy. */
  sortBy?: string
  filter?: object
}

export function buildListParams(params: ListQueryParams): Record<string, unknown> {
  const query: Record<string, unknown> = {}

  if (params.page !== undefined) query.page = params.page
  if (params.perPage !== undefined) query.perPage = params.perPage
  if (params.sort) query.sort = params.sort
  if (params.sortBy) query.sortBy = params.sortBy

  if (params.filter) {
    const filter: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(params.filter)) {
      if (value === undefined || value === null || value === '') continue
      filter[key] = value
    }
    if (Object.keys(filter).length > 0) {
      query.filter = filter
    }
  }

  return query
}
