import { api } from '@/services/api'
import { END_POINTS } from '@/features/shared/query-apis'
import type { LoginRequest, LoginResponse, MeResponse } from './auth.type'

export const authServices = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(END_POINTS.AUTH.LOGIN, data)
    return response.data
  },

  async logout(): Promise<void> {
    await api.post(END_POINTS.AUTH.LOGOUT)
  },

  async getMe(): Promise<MeResponse> {
    const response = await api.get<MeResponse>(END_POINTS.ME.PROFILE)
    return response.data
  },
}
