import { api } from '@/services/api'
import type { ApiListMeta, PaginationLinks } from '@/types/api.types'
import type { OrgDonation, OrgDonationEnvelope, OrgDonationsParams, OrgDonationsResult } from './org.donations.types'
const ENDPOINT = '/org/donations'
const defaultLinks: PaginationLinks = { first: null, last: null, prev: null, next: null }
function normalizeList(payload: OrgDonationEnvelope, params: OrgDonationsParams): OrgDonationsResult { const item = payload.item && 'data' in payload.item ? payload.item : null; const data = Array.isArray(payload.data) ? payload.data : item?.data ?? []; const meta: ApiListMeta = payload.meta ?? { currentPage: item?.page ?? params.page ?? 1, from: data.length ? 1 : null, lastPage: item?.total && item?.perPage ? Math.max(1, Math.ceil(item.total / item.perPage)) : 1, path: '', perPage: item?.perPage ?? params.perPage ?? 20, to: data.length || null, total: item?.total ?? data.length }; return { data, meta, links: payload.links ?? defaultLinks }; }
function normalizeSingle(payload: OrgDonationEnvelope): OrgDonation { if (payload.item && !('data' in payload.item)) return payload.item as OrgDonation; if (payload.data && !Array.isArray(payload.data)) return payload.data; throw new Error('Invalid donation response') }
export const orgDonationsServices = {
  async list(params: OrgDonationsParams) { const response = await api.get<OrgDonationEnvelope>(ENDPOINT, { params }); return normalizeList(response.data, params); },
  async detail(id: string) { const response = await api.get<OrgDonationEnvelope>(`${ENDPOINT}/${id}`); return normalizeSingle(response.data); },
  async contact(id: string) { const response = await api.patch<OrgDonationEnvelope>(`${ENDPOINT}/${id}/contact`, {}, { successMessage: 'تم تسجيل بدء التواصل.' }); return normalizeSingle(response.data); },
  async agree(id: string) { const response = await api.patch<OrgDonationEnvelope>(`${ENDPOINT}/${id}/agree`, {}, { successMessage: 'تم تسجيل الاتفاق.' }); return normalizeSingle(response.data); },
  async complete(id: string) { const response = await api.patch<OrgDonationEnvelope>(`${ENDPOINT}/${id}/complete`, {}, { successMessage: 'تم تأكيد استلام التبرع.' }); return normalizeSingle(response.data); },
  async cancel(id: string, reason: string) { const response = await api.patch<OrgDonationEnvelope>(`${ENDPOINT}/${id}/cancel`, { reason }, { successMessage: 'تم إلغاء طلب التبرع.' }); return normalizeSingle(response.data); },
}
