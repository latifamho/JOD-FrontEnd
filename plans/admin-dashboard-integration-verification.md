# Admin Dashboard Integration Verification

Scope: Admin Dashboard integrations implemented on `main`.

Excluded by request:
- Permission-based navigation and action gating
- Notifications
- Organization dashboard
- Mobile application

## Verification

- `npm run build`: passed
- `npm run lint`: passed with existing warnings and no errors
- Laravel test suite: not executed because the local environment does not provide a `php` executable (`spawn php ENOENT`)

## Implemented areas

- API contract corrections for users, categories, audit logs, campaigns, and report timelines
- User form validation feedback
- Admin profile API integration
- Organization filtering, status, verification, acceptance, details, and deletion flows; organization add/edit is intentionally removed
- Post moderation sorting and full content response
- Campaign detail loading, categories, and JOD currency display
- Report detail loading, request-information workflow, actionable evidence links, and close notes
- Article full content editing with unsupported image inputs removed
- Badge deletion
- Post type filtering and campaign organization/category filtering
- Category target/status filters and audit-log actor/action/date filters
- Analytics range selection and weekly activity visualization
