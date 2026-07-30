export interface LoginRequest { email: string; password: string }
export interface PermissionItem { key: string; name: string; label: string; allowed: boolean }
export interface PermissionGroup { key: string; label: string; sectionKey: string | null; sectionLabel: string | null; description: string; order: number; depth: number; permissions: PermissionItem[] }
export interface PermissionModule { key: string; label: string; order: number; groups: PermissionGroup[] }
export interface UserPermissions { modules: PermissionModule[]; flat: Record<string, boolean>; granted: string[] }
export interface LoginUser { id: string; name: string; email: string; phone: string | null; userType: string; status: string; organizationId: string | null; postsCount: number | null; reportsCount: number | null; createdAt: string | null; updatedAt: string | null; lastActiveAt: string | null }
export interface LoginData { token: string; tokenType: 'Bearer'; user: LoginUser; permissions: UserPermissions }
export interface LoginResponse { data: LoginData; message: string }
export type UserType = 'admin' | 'general' | 'volunteer' | 'donor' | 'job_seeker'
export type DashboardRole = 'admin' | 'org_owner' | 'org_staff'
export interface MeProfile { id: string; name: string; email: string; phone: string; userType: UserType; organizationId: string | null; organizationName: string | null; status: string; createdAt: string; lastActiveAt: string }
export interface MeResponse { data: MeProfile; message: string }
export interface DashboardContextProfile extends MeProfile { dashboardRole: DashboardRole | null }
export interface DashboardOrganization { id: string; name: string; status: string; verificationStatus: string }
export interface DashboardStaffRole { id: string; name: string; description: string | null; isActive: boolean; isSystem: boolean; membershipStatus: string }
export interface DashboardCounters { unreadNotifications: number; pendingReviews: number; openReports: number }
export interface DashboardContextData {
  profile: DashboardContextProfile
  organization: DashboardOrganization | null
  staffRole: DashboardStaffRole | null
  permissions: UserPermissions
  counters: DashboardCounters
}
export interface DashboardContextResponse { data: DashboardContextData }
export interface UpdateProfileRequest { name: string; email: string; phone: string }
export interface UpdateProfileResponse { data: MeProfile; message?: string }
