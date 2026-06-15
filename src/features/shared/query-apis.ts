export const END_POINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
  ME: {
    PROFILE: '/me',
    PERMISSIONS: '/me/permissions',
    DASHBOARD_CONTEXT: '/me/dashboard-context',
  },
} as const
