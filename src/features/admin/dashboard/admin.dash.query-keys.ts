export const adminDashKeys = {
  all: ['admin', 'dashboard'] as const,
  overview: () => [...adminDashKeys.all, 'overview'] as const,
}
