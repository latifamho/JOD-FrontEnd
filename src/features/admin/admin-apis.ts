/**
 * Endpoints shared by 2+ admin features.
 * Single-feature endpoints stay as a local END_POINTS constant inside the service file.
 * Cross-scope endpoints (used by org-owner or org-staff too) go in src/features/shared/query-apis.ts
 */
export const ADMIN_END_POINTS = {} as const
