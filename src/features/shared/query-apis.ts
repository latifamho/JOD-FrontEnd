export const END_POINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
  },
  COMPANY_AUTH: {
    LOGIN: "/company/auth/login",
    REGISTER: "/company/auth/register",
  },
  ME: {
    PROFILE: "/me",
    PERMISSIONS: "/me/permissions",
    DASHBOARD_CONTEXT: "/me/dashboard-context",
  },
} as const;
