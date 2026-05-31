/**
 * Endpoints shared by 2+ org-owner features.
 * Single-feature endpoints stay as a local END_POINTS constant inside the service file.
 * Cross-scope endpoints (used by admin or org-staff too) go in src/features/shared/query-apis.ts
 */
export const ORG_OWNER_END_POINTS = {} as const
