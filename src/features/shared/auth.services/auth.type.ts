export interface LoginRequest {
  username: string
  password: string
  rememberMe: boolean
}

export interface User {
  id: number
  name: string
  email: string
  image: string | null
  platformRole: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
  expiresAt: string
  user: User
  lastOpenedApplicationId: number | null
  lastOpenedApplicationCode: string | null
  lastOpenedApplicationUrl: string | null
}

export interface ApiLoginResponse {
  statusCode: number
  message: string
  item: LoginResponse
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
  expiresAt: string
}

export interface ApiRefreshTokenResponse {
  statusCode: number
  message: string
  item: RefreshTokenResponse
}
