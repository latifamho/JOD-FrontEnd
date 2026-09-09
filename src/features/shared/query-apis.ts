export const END_POINTS = {
  AUTH: { LOGIN: "/auth/login", REFRESH: "/auth/refresh", LOGOUT: "/auth/logout" },
  COMPANY_AUTH: { REGISTER: "/company/auth/register" },
  ME: {
    PROFILE: "/me",
    PERMISSIONS: "/me/permissions",
    DASHBOARD_CONTEXT: "/me/dashboard-context",
    PUSH_DEVICE: "/me/push-device",
  },
} as const;
