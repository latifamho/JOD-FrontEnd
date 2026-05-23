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

export const usersStaticData: AdminUserItem[] = [
  {
    id: "USR-1001",
    name: "خالد علي",
    email: "khalid.ali@jod.sa",
    phone: "+966501234101",
    role: "job_seeker",
    status: "active",
    postsCount: 6,
    reportsCount: 1,
    createdAt: "2026-01-18T10:20:00",
    lastActiveAt: "2026-02-27T09:10:00",
  },
  {
    id: "USR-1002",
    name: "ليان منصور",
    email: "layan.mansour@jod.sa",
    phone: "+966501234102",
    role: "volunteer",
    status: "active",
    postsCount: 3,
    reportsCount: 0,
    createdAt: "2026-01-20T08:15:00",
    lastActiveAt: "2026-02-26T17:45:00",
  },
  {
    id: "USR-1003",
    name: "ريم الزهراني",
    email: "reem.zahrani@jod.sa",
    phone: "+966501234103",
    role: "general",
    status: "inactive",
    postsCount: 11,
    reportsCount: 4,
    createdAt: "2026-01-22T14:00:00",
    lastActiveAt: "2026-02-24T12:32:00",
  },
  {
    id: "USR-1004",
    name: "ناصر فهد",
    email: "nasser.fahad@jod.sa",
    phone: "+966501234104",
    role: "donor",
    status: "active",
    postsCount: 1,
    reportsCount: 0,
    createdAt: "2026-01-26T11:10:00",
    lastActiveAt: "2026-02-27T07:55:00",
  },
  {
    id: "USR-1005",
    name: "مها العتيبي",
    email: "maha.otaibi@jod.sa",
    phone: "+966501234105",
    role: "general",
    status: "inactive",
    postsCount: 8,
    reportsCount: 2,
    createdAt: "2026-02-01T09:40:00",
    lastActiveAt: "2026-02-25T10:03:00",
  },
  {
    id: "USR-1006",
    name: "سالم العمري",
    email: "salem.omari@jod.sa",
    phone: "+966501234106",
    role: "job_seeker",
    status: "active",
    postsCount: 4,
    reportsCount: 0,
    createdAt: "2026-02-05T13:25:00",
    lastActiveAt: "2026-02-26T22:12:00",
  },
];
