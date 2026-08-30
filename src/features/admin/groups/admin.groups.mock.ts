import type { ApiListResponse } from '@/types/api.types'
import type { AdminGroupItem } from '@/components/pages/groups-management/groups-management.types'
import { MOCK_REVIEWER, seededAdminGroups } from './admin.groups.seed'
import type { AdminGroupDetail, AdminGroupsParams } from './admin.groups.types'

/**
 * TEMPORARY — stands in for GET/PATCH/DELETE /v1/admin/groups until the groups
 * endpoints exist. This is the only module that knows the data is fake;
 * admin.groups.services.ts is the swap point and already speaks the real
 * response shapes.
 *
 * State lives in module scope, so a decision survives moving between the status
 * tabs and resets on a full page reload — the same trade-off the mobile app's
 * mock store makes.
 */

const MOCK_LATENCY_MS = 260
const DEFAULT_SORT = '-submittedAt'

let groups: AdminGroupDetail[] = seededAdminGroups.map((group) => ({ ...group }))

const delay = (ms = MOCK_LATENCY_MS) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })

/** Drops the detail-only fields so list rows stay as cheap as the real endpoint. */
function toListItem(group: AdminGroupDetail): AdminGroupItem {
  return {
    id: group.id,
    name: group.name,
    category: group.category,
    location: group.location,
    visibility: group.visibility,
    membersCount: group.membersCount,
    postsThisWeek: group.postsThisWeek,
    imageUrl: group.imageUrl,
    organizationName: group.organizationName,
    isVerifiedOrganization: group.isVerifiedOrganization,
    ownerName: group.ownerName,
    status: group.status,
    rejectionReason: group.rejectionReason,
    suspensionReason: group.suspensionReason,
    submittedAt: group.submittedAt,
    reviewedAt: group.reviewedAt,
    reviewedBy: group.reviewedBy,
  }
}

function matchesSearch(group: AdminGroupDetail, search: string): boolean {
  const needle = search.trim().toLowerCase()
  if (needle === '') return true

  return [group.name, group.ownerName, group.organizationName, group.location].some((value) =>
    (value ?? '').toLowerCase().includes(needle),
  )
}

function matchesFilters(group: AdminGroupDetail, params: AdminGroupsParams): boolean {
  if (params.status && group.status !== params.status) return false
  if (params.category && group.category !== params.category) return false
  if (params.visibility && group.visibility !== params.visibility) return false
  return matchesSearch(group, params.search ?? '')
}

const timestamp = (value: string | null): number => (value ? Date.parse(value) : 0)

const sorters: Record<string, (a: AdminGroupDetail, b: AdminGroupDetail) => number> = {
  name: (a, b) => a.name.localeCompare(b.name, 'ar'),
  '-name': (a, b) => b.name.localeCompare(a.name, 'ar'),
  submittedAt: (a, b) => timestamp(a.submittedAt) - timestamp(b.submittedAt),
  '-submittedAt': (a, b) => timestamp(b.submittedAt) - timestamp(a.submittedAt),
  '-membersCount': (a, b) => b.membersCount - a.membersCount,
}

function paginate(
  rows: AdminGroupItem[],
  page: number,
  perPage: number,
): ApiListResponse<AdminGroupItem> {
  const total = rows.length
  const lastPage = Math.max(1, Math.ceil(total / perPage))
  const currentPage = Math.min(Math.max(1, page), lastPage)
  const offset = (currentPage - 1) * perPage
  const data = rows.slice(offset, offset + perPage)

  return {
    data,
    links: { first: null, last: null, prev: null, next: null },
    meta: {
      currentPage,
      from: total === 0 ? null : offset + 1,
      lastPage,
      path: '/v1/admin/groups',
      perPage,
      to: total === 0 ? null : offset + data.length,
      total,
    },
    message: '',
  }
}

function findOrThrow(groupId: string): AdminGroupDetail {
  const group = groups.find((item) => item.id === groupId)
  if (!group) throw new Error('المجموعة غير موجودة.')
  return group
}

function patch(groupId: string, changes: Partial<AdminGroupDetail>): AdminGroupDetail {
  const updated = { ...findOrThrow(groupId), ...changes }
  groups = groups.map((item) => (item.id === groupId ? updated : item))
  return updated
}

/** Stands in for the review timestamp the backend would stamp server-side. */
const reviewStamp = () => new Date().toISOString()

export const adminGroupsMock = {
  async list(params: AdminGroupsParams): Promise<ApiListResponse<AdminGroupItem>> {
    await delay()

    const sorter = sorters[params.sort ?? DEFAULT_SORT] ?? sorters[DEFAULT_SORT]
    // `filter` already returns a fresh array, so sorting it never touches `groups`.
    const rows = groups
      .filter((group) => matchesFilters(group, params))
      .sort(sorter)
      .map(toListItem)

    return paginate(rows, params.page ?? 1, params.perPage ?? 9)
  },

  async getById(groupId: string): Promise<AdminGroupDetail> {
    await delay(180)
    return { ...findOrThrow(groupId) }
  },

  async approve(groupId: string): Promise<AdminGroupDetail> {
    await delay()
    const stamp = reviewStamp()

    return patch(groupId, {
      status: 'active',
      rejectionReason: null,
      suspensionReason: null,
      reviewedAt: stamp,
      reviewedBy: MOCK_REVIEWER,
      createdAt: findOrThrow(groupId).createdAt ?? stamp,
    })
  },

  async reject(groupId: string, rejectionReason: string): Promise<AdminGroupDetail> {
    await delay()

    return patch(groupId, {
      status: 'rejected',
      rejectionReason,
      reviewedAt: reviewStamp(),
      reviewedBy: MOCK_REVIEWER,
    })
  },

  async remove(groupId: string): Promise<void> {
    await delay()
    findOrThrow(groupId)
    groups = groups.filter((item) => item.id !== groupId)
  },

  /** Restores the seeded state — used by tests and local debugging. */
  reset(): void {
    groups = seededAdminGroups.map((group) => ({ ...group }))
  },
}
