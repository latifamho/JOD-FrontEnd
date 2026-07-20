export type UserStatus = "active" | "inactive";

export type UserRole = "general" | "volunteer" | "job_seeker" | "donor";

export type AdminUserItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  /** Backend field name (preferred). */
  userType?: UserRole;
  /** Legacy alias — some docs still use role. */
  role?: UserRole;
  status: UserStatus;
  postsCount: number;
  reportsCount: number;
  createdAt: string;
  lastActiveAt: string;
};

export const userStatusLabels: Record<UserStatus, string> = {
  active: "نشط",
  inactive: "غير نشط",
};

export const userRoleLabels: Record<UserRole, string> = {
  general: "مستخدم",
  volunteer: "متطوع",
  job_seeker: "باحث عن فرصة",
  donor: "متبرع",
};

export function getUserType(user: Pick<AdminUserItem, "userType" | "role">): UserRole {
  const value = user.userType ?? user.role ?? "general";
  return value in userRoleLabels ? (value as UserRole) : "general";
}

export function normalizeUserStatus(status: string | null | undefined): UserStatus {
  return status === "inactive" ? "inactive" : "active";
}
