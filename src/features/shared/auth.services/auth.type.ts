export interface LoginRequest {
  email: string
  password: string
}

export interface LoginUser {
  id: string
  name: string
  email: string
}

export interface LoginData {
  token: string
  tokenType: 'Bearer'
  user: LoginUser
}

export interface LoginResponse {
  data: LoginData
  message: string
}

export type UserType = 'admin' | 'general' | 'volunteer' | 'donor' | 'job_seeker'

export type DashboardRole = 'admin' | 'org_owner' | 'org_staff'

export interface MeProfile {
  id: string
  name: string
  email: string
  phone: string
  userType: UserType
  organizationId: string | null
  organizationName: string | null
  status: string
  createdAt: string
  lastActiveAt: string
}

export interface MeResponse {
  data: MeProfile
  message: string
}
