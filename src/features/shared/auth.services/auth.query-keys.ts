export const authKeys = {
  all: ['auth'] as const,
  login: ['auth', 'login'] as const,
  refreshToken: ['auth', 'refreshToken'] as const,
  currentUser: ['auth', 'currentUser'] as const,
}
