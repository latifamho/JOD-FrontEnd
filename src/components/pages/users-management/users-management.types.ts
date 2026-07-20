export type UserStatus = "active" | "inactive";

export type UserRole = "general" | "volunteer" | "job_seeker" | "donor";

export type AdminUserItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
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

