import { API_ERROR_MESSAGES } from '@/constant/api-error-messages'
import { API_SUCCESS_MESSAGES } from '@/constant/api-success-messages'
import { toast } from '@/lib/toast'
import type { ApiSingleResponse } from '@/types/api.types'
import { adminGroupsMock } from './admin.groups.mock'
import type {
  AdminGroupDetail,
  AdminGroupDetailResponse,
  AdminGroupsParams,
  AdminGroupsResponse,
} from './admin.groups.types'

/**
 * THE SWAP POINT. Every call below goes to the in-memory mock because the
 * groups endpoints do not exist yet — no migrations, routes or controllers in
 * JOD-backend, and the mobile feature that creates these requests is mocked too.
 *
 * When the API lands, replace each body with the `api` call written above it
 * and delete admin.groups.mock.ts / admin.groups.seed.ts. Nothing above this
 * file changes: the hooks, the page and the components already speak the real
 * ApiListResponse / ApiSingleResponse shapes.
 *
 * `runMutation` only exists because the mock has no axios interceptor. Against
 * the real API the success and error toasts come from `services/api.ts`, so it
 * disappears with the mock.
 */

const wrap = (group: AdminGroupDetail): ApiSingleResponse<AdminGroupDetail> => ({
  data: group,
  message: '',
})

async function runMutation<T>(run: () => Promise<T>, successMessage: string): Promise<T> {
  try {
    const result = await run()
    toast.success(successMessage)
    return result
  } catch (error) {
    toast.error(error instanceof Error ? error.message : API_ERROR_MESSAGES.unknown)
    throw error
  }
}

export const adminGroupsServices = {
  // GET `${GROUPS_ENDPOINT}` with { params: buildApiParams(params) }
  async getGroups(params: AdminGroupsParams): Promise<AdminGroupsResponse> {
    return adminGroupsMock.list(params)
  },

  // GET `${GROUP_ENDPOINT(groupId)}`
  async getGroupById(groupId: string): Promise<AdminGroupDetailResponse> {
    return wrap(await adminGroupsMock.getById(groupId))
  },

  // PATCH `${GROUP_ENDPOINT(groupId)}` { status: 'active' }
  async approveGroup(groupId: string): Promise<AdminGroupDetailResponse> {
    const group = await runMutation(
      () => adminGroupsMock.approve(groupId),
      API_SUCCESS_MESSAGES.approved,
    )
    return wrap(group)
  },

  // PATCH `${GROUP_ENDPOINT(groupId)}` { status: 'rejected', rejectionReason }
  async rejectGroup(groupId: string, rejectionReason: string): Promise<AdminGroupDetailResponse> {
    const group = await runMutation(
      () => adminGroupsMock.reject(groupId, rejectionReason),
      API_SUCCESS_MESSAGES.rejected,
    )
    return wrap(group)
  },

  // DELETE `${GROUP_ENDPOINT(groupId)}`
  async deleteGroup(groupId: string): Promise<void> {
    await runMutation(() => adminGroupsMock.remove(groupId), API_SUCCESS_MESSAGES.deleted)
  },
}
