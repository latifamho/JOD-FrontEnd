/**
 * Endpoints shared by 2+ org-staff features.
 * Single-feature endpoints stay as a local END_POINTS constant inside the service file.
 * Cross-scope endpoints (used by admin or org-owner too) go in src/features/shared/query-apis.ts
 */
export const ORG_STAFF_END_POINTS = {} as const
