import { api } from '@/services/api'
import { END_POINTS } from '@/features/shared/query-apis'
import type {
  ApiLoginResponse,
  ApiRefreshTokenResponse,
  LoginRequest,
  RefreshTokenRequest,
} from './auth.type'

export const authServices = {
  async login(data: LoginRequest): Promise<ApiLoginResponse> {
    const response = await api.post<ApiLoginResponse>(END_POINTS.AUTH.LOGIN, data)
    return response.data
  },

  async refreshToken(data: RefreshTokenRequest): Promise<ApiRefreshTokenResponse> {
    const response = await api.post<ApiRefreshTokenResponse>(END_POINTS.AUTH.REFRESH_TOKEN, data)
    return response.data
  },
}
