# Organization Dashboard Integration Verification

## Completed modules

- Dashboard context hydration and role isolation
- Permission-aware route guards, sidebar links, tabs, and direct-route fallback
- Organization staff, roles, and backend permission catalog
- Owner/staff overview using `/org/dashboard/overview`
- Campaign and post CRUD/lifecycle endpoints
- Donor and applicant CRUD with permission-aware requests and actions
- Organization reports and canonical status transitions
- Organization audit log using `/org/audit-logs`
- Organization profile, bank settings, and separate staff personal profile

## Permission behavior

The frontend reads permissions from `/me/dashboard-context` and uses the same canonical names as the backend. Buttons, navigation items, tabs, route access, and optional queries are gated by permission.

Owner-only pages:

- Staff management
- Role and permission management

Staff-accessible modules require the corresponding `view` permission. Mutating actions require their specific create/update/delete/lifecycle permission.

## Excluded in this delivery

- Organization notifications are hidden and guarded. Existing notification source files are retained but are not part of the active organization dashboard integration.
- Mobile application and mobile backend integration are deferred.

## Verification completed

- `npm run lint`: passed with existing warnings and zero errors.
- `npm run build`: passed with TypeScript validation and 67 generated routes.
- Next.js reports the existing middleware-to-proxy deprecation warning.
- No frontend test runner is configured in `package.json`; lint and production build are the available automated frontend gates.

## Manual smoke matrix

1. Owner login opens the owner dashboard and can access staff/roles.
2. Staff login redirects to the first allowed organization route.
3. Staff cannot open a direct URL without its view permission.
4. Campaign/post lifecycle buttons follow their individual permissions.
5. Donor/applicant queries execute only for the active permitted section.
6. Report status controls appear only with `org.reports.update`.
7. Audit log is loaded from `/org/audit-logs`, not the admin endpoint.
8. Owner edits organization profile/settings; staff edits only personal account data.
9. Organization notification routes redirect to an allowed route and do not appear in navigation.
