export type LoginAccountType = "admin" | "organization";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginMutationInput extends LoginRequest {
  accountType: LoginAccountType;
}

export interface PermissionItem {
  key: string;
  name: string;
  label: string;
  allowed: boolean;
}

export interface PermissionGroup {
  key: string;
  label: string;
  sectionKey: string | null;
  sectionLabel: string | null;
  description: string;
  order: number;
  depth: number;
  permissions: PermissionItem[];
}

export interface PermissionModule {
  key: string;
  label: string;
  order: number;
  groups: PermissionGroup[];
}

export interface UserPermissions {
  modules: PermissionModule[];
  flat: Record<string, boolean>;
  granted: string[];
}

export interface LoginUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  userType: string;
  status: string;
  organizationId: string | null;
  postsCount: number | null;
  reportsCount: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  lastActiveAt: string | null;
}

export interface AuthTokenData {
  token: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  refreshExpiresIn: number;
  expiresAt: string;
  refreshExpiresAt: string;
}

/** Alias matching the refresh-token API contract. */
export type TokenPair = AuthTokenData;

export interface LoginData extends AuthTokenData {
  user: LoginUser;
  permissions: UserPermissions;
}

export interface LoginResponse {
  data: LoginData;
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  data: TokenPair;
  message: string;
}

export interface CompanyRegisterRequest {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  organizationType: string;
  registrationNumber: string;
  location: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  password: string;
  password_confirmation: string;
  description?: string;
  website?: string;
  establishmentDate?: string;
}

export type CompanyRegisterResponse = LoginResponse;

export type UserType = "admin" | "general" | "volunteer" | "donor" | "job_seeker";
export type DashboardRole = "admin" | "org_owner" | "org_staff";

export interface MeProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
  organizationId: string | null;
  organizationName: string | null;
  status: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface MeResponse {
  data: MeProfile;
  message: string;
}

export interface DashboardContextProfile extends MeProfile {
  dashboardRole: DashboardRole | null;
}

export interface DashboardOrganization {
  id: string;
  name: string;
  status: string;
  verificationStatus: string;
}

export interface DashboardStaffRole {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  isSystem: boolean;
  membershipStatus: string;
}

export interface DashboardCounters {
  pendingReviews: number;
  openReports: number;
}

export interface DashboardContextData {
  profile: DashboardContextProfile;
  organization: DashboardOrganization | null;
  staffRole: DashboardStaffRole | null;
  permissions: UserPermissions;
  counters: DashboardCounters;
}

export interface DashboardContextResponse {
  data: DashboardContextData;
}

