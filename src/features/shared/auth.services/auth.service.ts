import { api } from '@/services/api'
import { END_POINTS } from '@/features/shared/query-apis'
import type {
  DashboardContextResponse,
  LoginRequest,
  LoginResponse,
  MeResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from './auth.type'

export const authServices = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(END_POINTS.AUTH.LOGIN, data, { skipSuccessToast: true })
    return response.data
  },
  async logout(): Promise<void> { await api.post(END_POINTS.AUTH.LOGOUT, undefined, { skipSuccessToast: true }) },
  async getMe(): Promise<MeResponse> { const response = await api.get<MeResponse>(END_POINTS.ME.PROFILE); return response.data },
  async getDashboardContext(): Promise<DashboardContextResponse> {
    const response = await api.get<DashboardContextResponse>(END_POINTS.ME.DASHBOARD_CONTEXT)
    return response.data
  },
  async updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const response = await api.patch<UpdateProfileResponse>('/me/profile', data, { successMessageKey: 'updated' })
    return response.data
  },
}
