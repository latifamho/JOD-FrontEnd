# Organization Dashboard Plan, Branch History, and Implementation Changes

> This is the Frontend repository record for the Organization Owner and Organization Staff dashboard work. It documents the original Backend feature branch, its merge into Backend `main`, the matching Frontend feature work, the transition back to Frontend `main`, and all follow-up changes through the latest implementation.

## Document Information

| Item | Value |
|---|---|
| Status | Implemented and merged to `main` |
| Last updated | 2026-08-04 |
| Backend repository | `BE-JOD/jod` |
| Frontend repository | `JOD-FrontEnd` |
| Backend feature branch | `feature/org-owner-staff-permissions-backend` |
| Frontend feature branch | `feature/org-owner-staff-permissions-frontend` |
| Backend merge commit | `3c951c4` — PR #8 |
| Frontend feature tip | `8a20456` |
| Current Frontend `main` | `38bf7c9` |
| Main scope | Organization authentication, Owner/Staff dashboards, permissions, organization-scoped data, and UI/security refinements |
| Remaining out of scope | Mobile application integration |

---

## 1. Objective

The work started to provide a complete organization dashboard for two authenticated organization roles:

- Organization Owner.
- Organization Staff.

The main goals were:

1. Make the Backend the source of truth for organization membership, permissions, resource ownership, and lifecycle rules.
2. Use the same organization-scoped API surface for Owner and Staff.
3. Allow the Owner to manage staff, roles, and organization operations.
4. Allow Staff to see and execute only the sections and actions granted by their assigned role.
5. Prevent cross-organization data access in Backend policies and services.
6. Keep Backend and Frontend permission names aligned.
7. Replace static dashboard data with real API data.
8. Protect pages, navigation, buttons, requests, routes, Sheets, and Dialogs.
9. Support separate Admin and Organization authentication flows.
10. Provide a clear pending-approval experience after organization registration.

---

## 2. Branch and Merge History

## 2.1 Backend feature branch

The Backend implementation was developed on:

```text
feature/org-owner-staff-permissions-backend
```

The branch started with the organization authentication and dashboard context foundation, then added organization-scoped resources, policies, contracts, tests, and review fixes.

The remote branch ended at:

```text
d338753 Restore organization report permission actions
```

## 2.2 Backend merge to `main`

The Backend feature branch was merged through:

```text
3c951c4 Merge pull request #8 from feature/org-owner-staff-permissions-backend
```

The merge message records that CodeRabbit review feedback was resolved and regression coverage was added.

## 2.3 Authentication work around the Backend merge

Before the organization feature merge, Backend `main` already received the rotating refresh-token flow through PR #5. That work added:

- Access-token and refresh-token separation.
- Token lifetime configuration.
- Refresh request validation.
- Refresh-token rotation.
- Access-token middleware.
- Refresh-token tests.

After PR #8, Backend `main` received the company authentication contract through PR #9:

```text
ea5d1d9 Merge pull request #9 from MustafaFares445/agent/company-auth-endpoints
```

That added:

- Company/organization registration validation.
- Company registration service logic.
- Company login and registration endpoints.
- Company authentication route registration.
- Seeded company accounts.

## 2.4 Frontend feature branch and return to `main`

The matching Frontend implementation was developed on:

```text
feature/org-owner-staff-permissions-frontend
```

The feature branch currently points to:

```text
8a20456 feat: refactor modal handling with useQueryModal hook
```

Frontend `main` directly continues from that commit. The latest follow-up commit is:

```text
38bf7c9 Refactor modal handling in donors, campaigns, notifications, posts, and staff management
```

There is no separate Frontend merge commit in the current history. `main` contains the feature branch history and then the final permission-aware modal and Sidebar update.

---

## 3. Backend Implementation — Step by Step

## Step 1 — Owner and Staff dashboard context

Commit:

```text
8ca8c19 feat(org-auth): add owner staff dashboard context
```

Implemented the organization-aware dashboard context used by the Frontend:

```http
GET /api/v1/me/dashboard-context
```

The response provides:

- Authenticated user profile.
- Dashboard role: `admin`, `org_owner`, or `org_staff`.
- Organization information.
- Staff role information when applicable.
- Hierarchical permission modules.
- Flat permission lookup.
- Granted permission names.
- Dashboard counters.

This contract became the basis for route guards, navigation filtering, and action authorization in the Frontend.

## Step 2 — Staff and role safeguards

Commit:

```text
e73bcfe feat(org-staff): enforce role assignment safeguards
```

Added safeguards for staff and role management, including protection against unsafe owner/system-role changes and organization membership mistakes.

The final contract includes:

```http
GET    /api/v1/org/staff
POST   /api/v1/org/staff
GET    /api/v1/org/staff/{id}
PATCH  /api/v1/org/staff/{id}
DELETE /api/v1/org/staff/{id}

GET    /api/v1/org/staff/roles
POST   /api/v1/org/staff/roles
GET    /api/v1/org/staff/roles/{id}
PATCH  /api/v1/org/staff/roles/{id}
DELETE /api/v1/org/staff/roles/{id}

GET    /api/v1/org/permissions/catalog
```

## Step 3 — Organization overview

Commit:

```text
5131908 feat(org-overview): add scoped dashboard data
```

Added:

```http
GET /api/v1/org/dashboard/overview
```

The overview is scoped to the authenticated organization and contains permission-aware statistics and recent activity.

## Step 4 — Campaign and post lifecycle

Commit:

```text
24f3374 feat(org-content): enforce campaign post lifecycle
```

Implemented organization-scoped Campaign and Post CRUD and lifecycle rules.

Canonical lifecycle endpoints:

```http
PATCH /api/v1/org/campaigns/{campaign}/status
PATCH /api/v1/org/posts/{post}/status
```

Campaign statuses:

- `draft`
- `active`
- `closed`

Post statuses:

- `draft`
- `published`
- `archived`

The Backend validates allowed transitions instead of trusting only the Frontend UI.

## Step 5 — Donors, applicants, reports, and audit data

Commit:

```text
4a4f4dd feat(org-data): scope donors applicants reports audit
```

Added organization scoping and permission checks for:

```http
/api/v1/org/donors
/api/v1/org/applicants
/api/v1/org/reports
/api/v1/org/audit-logs
```

Donors and Applicants remain separate resources and endpoints.

Reports use a canonical status contract:

```http
PATCH /api/v1/org/reports/{report}/status
```

## Step 6 — Settings and profile security

Commit:

```text
c7136ac feat(org-settings): secure profile and password flows
```

Added organization settings contracts and authorization:

```http
GET   /api/v1/org/settings/profile
PATCH /api/v1/org/settings/profile
GET   /api/v1/org/settings/bank-account
PATCH /api/v1/org/settings/bank-account
```

These endpoints remain part of the Backend contract even though later Frontend cleanup removed separate personal profile pages.

## Step 7 — Contract alignment

The following commits aligned the Backend contract with the Frontend implementation:

```text
abe3781 feat(org-dashboard): finalize auth context permissions
6a5ac1d feat(org-dashboard): align staff role contracts
4a2d304 feat(org-dashboard): expose overview activity contract
7b5bb61 feat(org-dashboard): connect reports audit permissions
```

Important alignments included:

- Final dashboard permission structure.
- `roleId` and organization-role mapping.
- `isActive` role behavior.
- `recentActivity` naming.
- Report update permission restoration.
- Audit-log permission behavior.

## Step 8 — Tests and initial documentation

Commits:

```text
2e75132 test(org-dashboard): cover reports audit integration
b3a4394 docs(org-dashboard): add implementation plan and changes
39aa42b docs(org-dashboard): translate implementation plan to English
```

Feature tests and regression coverage were added for organization scoping, lifecycle operations, staff/role behavior, reports, audit access, and settings.

## Step 9 — Review and regression fixes

The review phase produced the following fixes before the final branch tip:

```text
b9a1795 fix: scope report assignees to organization
55723b3 style: add explicit role index return type
c7ba407 style: add explicit staff index return type
7ccf73d fix: validate campaign date ordering
6279c45 fix: default campaign status to draft
beb319d fix: keep campaign DTO default parameter valid
96b804a fix: default post status to draft
151bb0d fix: allow partial role updates
6bf21a7 fix: scope active staff membership to user organization
f3608b9 fix: ignore all sentinel in campaign search
ad0a6ea fix: support permissions count sorting across databases
1f4483a fix: serialize final owner transitions
ad49450 test: align organization overview response assertions
fa22174 Fix organization role management test routes
95769c3 Fix staff deletion assertion and add organization scope regression
d338753 Restore organization report permission actions
```

These commits closed edge cases around validation, database compatibility, owner transitions, staff membership scoping, report assignment, and test accuracy.

---

## 4. Frontend Implementation — Step by Step

## Step 1 — Authentication context and permission navigation

Commit:

```text
777e8ef feat(org-dashboard): enforce auth permission navigation
```

Implemented:

- Dashboard context hydration in `AuthProvider`.
- Unified `can(permission)` checks.
- Admin, Owner, and Staff role isolation.
- Sidebar filtering.
- Section-tab filtering.
- Route guards.
- Redirect to the first allowed route when access is missing.

## Step 2 — Staff, roles, and permission catalog

Commit:

```text
a51f1b1 feat(org-dashboard): connect staff roles permissions
```

Implemented:

- Real Staff and Role API integration.
- Dynamic role permission fields from the Backend catalog.
- `organizationRoleId` mapping.
- Owner-only Staff and Role pages.
- Permission-aware staff and role actions.

## Step 3 — Organization overview

Commit:

```text
583ed2a feat(org-dashboard): connect organization overview
```

Implemented:

- Shared Owner/Staff overview component.
- Real overview API data.
- Permission-aware statistics.
- Loading, error, and empty states.

## Step 4 — Campaign and Post lifecycle integration

Commit:

```text
dfc7aa0 feat(org-dashboard): align campaign post lifecycle permissions
```

Implemented:

- Canonical Campaign status updates.
- Canonical Post publish/archive/restore updates.
- Action-specific permission checks.
- Organization-scoped list and mutation hooks.

## Step 5 — Donors and Applicants

Commit:

```text
89683aa feat(org-dashboard): gate donor applicant operations
```

Implemented:

- Separate Donor and Applicant queries.
- Permission-aware list execution.
- Create, update, and delete integration.
- Independent filtering and pagination behavior.

## Step 6 — Reports and Audit Log integration

Commit:

```text
2d95d5d feat(org-dashboard): connect organization reports audit
```

At this historical stage, the Frontend connected:

- Organization Reports.
- Organization-specific Audit Log services and hooks.
- Report status controls.
- Audit access through `org.audit_logs.view`.

The Audit Log Frontend feature was later removed from all dashboard roles. The Backend endpoint still exists, but the current Frontend does not expose an Audit Log page or feature layer.

## Step 7 — Organization settings

Commit:

```text
6ec4cc2 feat(org-dashboard): connect organization settings
```

Implemented:

- Organization profile settings API integration.
- Bank-account API integration.
- Read-only behavior without update permission.

## Step 8 — Historical Owner/Staff profile split

Commit:

```text
3b176eb feat(org-dashboard): separate owner staff profiles
```

Initially separated Owner organization profile behavior from Staff personal profile behavior.

This was later simplified. The final Frontend state removes separate Owner and Staff personal profile pages and removes the personal profile update service from the dashboard UI. Organization Settings remain available through the organization settings routes.

## Step 9 — Verification and documentation

Commits:

```text
a58ea43 docs(org-dashboard): record integration verification
9eba58d docs(org-dashboard): add implementation plan and changes
1198e59 docs(org-dashboard): translate implementation plan to English
0d1271c feat(org-dashboard): add organization dashboard plan and implementation changes document
```

The current file replaces those historical snapshots with the final implementation history.

## Step 10 — API and dependency maintenance

Commits:

```text
e4a56b4 fix(api): ensure BASE_URL is always defined by using non-null assertion
916f59f Implement code changes to enhance functionality and improve performance
```

`916f59f` only changed `package-lock.json`; it did not introduce a separate functional dashboard feature.

## Step 11 — Dedicated details/edit pages and major cleanup

Commit:

```text
cb160fe feat: add organization campaign edit page and related components
```

This commit expanded far beyond its title. It introduced the following final UI direction:

### Campaigns

- Removed the edit action from the Campaign list table.
- Kept the list Sheet create-only.
- Added dedicated Owner and Staff Campaign details routes.
- Added dedicated Owner and Staff Campaign edit routes.
- Added permission-aware edit buttons on details pages.
- Prevented editing closed campaigns.
- Corrected Owner/Staff details routing.

Routes:

```text
/dashboard/org-owner/campaigns/{id}
/dashboard/org-owner/campaigns/{id}/edit
/dashboard/org-staff/campaigns/{id}
/dashboard/org-staff/campaigns/{id}/edit
```

### Posts

- Removed the old Post details Sheet.
- Added dedicated Owner and Staff Post details pages.
- Added dedicated Owner and Staff Post edit pages.
- Restored the Post update API and query mutation.
- Displayed the post body and image grid on the details page.
- Made the eye action navigate to the details route.

Routes:

```text
/dashboard/org-owner/posts/{id}
/dashboard/org-owner/posts/{id}/edit
/dashboard/org-staff/posts/{id}
/dashboard/org-staff/posts/{id}/edit
```

### Loading states

- Added reusable list, card-grid, details, and form loading skeletons.
- Applied loading skeletons across dashboard data-fetching pages.
- Added lazy get-by-ID hooks for Campaigns, Posts, Donors, Applicants, Staff, and Roles.
- Later updated all shared skeleton roots to use `w-full min-w-0 self-stretch` so they fill the available width.

### Routing and empty states

- Added a global `not-found.tsx` page using `src/assets/images/404.png`.
- Removed the optional dashboard catch-all route.
- Added `/dashboard` role-based redirection.
- Kept unauthorized states explicit and permission-aware.

### Audit Log removal

Removed all Frontend Audit Log pages and feature code for:

- Admin.
- Organization Owner.
- Organization Staff.

This included route files, components, services, query hooks, query keys, types, route metadata, and icon references.

### Profile cleanup

Removed separate organization Owner and Staff profile pages and components.

### User safety

Prevented the currently logged-in user from deleting their own account or staff membership through the dashboard UI.

## Step 12 — Organization authentication and pending approval

Commit:

```text
1e605a4 feat: add OrganizationPendingApprovalPage component and related utilities
```

Implemented the full organization authentication flow against the Backend contract.

### Account-type login

The Login page now contains an account-type Select with:

- Platform Administration.
- Organization Account.

Admin login uses:

```http
POST /api/v1/auth/login
```

Organization Owner and Staff login use:

```http
POST /api/v1/company/auth/login
```

After login, the Frontend loads:

```http
GET /api/v1/me/dashboard-context
```

It validates that the returned dashboard role matches the selected account type before completing the session.

### Organization registration

The registration form now submits to:

```http
POST /api/v1/company/auth/register
```

The Frontend maps its fields to the Backend contract:

```ts
{
  companyName,
  companyEmail,
  companyPhone,
  organizationType,
  registrationNumber,
  location,
  ownerName,
  ownerEmail,
  ownerPhone,
  password,
  password_confirmation,
  description,
  website,
  establishmentDate
}
```

`city` and `shortAddress` are combined into `location`.

Unsupported registration fields were removed from the form, including document uploads, the English organization name, and social-media fields.

### Pending approval experience

Added:

```text
/pending-approval
```

The page uses:

```text
src/assets/images/wait-invite.jpg
```

It provides:

- A friendly pending-review message.
- Organization and Owner context.
- Review progress steps.
- Refresh-status action.
- Logout action.
- Automatic redirect to the organization dashboard after approval.

Pending organizations are redirected away from Owner/Staff dashboard routes until the organization becomes active and verified.

### Refresh-token support

The Frontend now:

- Stores Access and Refresh tokens.
- Stores expiration timestamps.
- Calls `POST /api/v1/auth/refresh` after an authenticated `401`.
- Rotates both tokens.
- Retries the original request once.
- Uses a single shared refresh promise to prevent concurrent refresh calls.
- Clears the session when refresh fails.

## Step 13 — Query-param overlays and shared API params

Commit:

```text
8a20456 feat: refactor modal handling with useQueryModal hook
```

Implemented two shared hooks:

```ts
useQueryModal(...)
useQueryDisclosure(...)
```

Sheets and Dialogs are opened from URL query parameters instead of local `open` boolean state.

Standard query structure:

```text
?modal=<name>
&modalId=<entity-id>
&modalMode=<create-or-edit>
```

Nested confirmation dialogs use a separate key:

```text
?dialog=<name>
```

This preserves the parent Sheet while opening a nested Dialog.

The refactor covered dashboard overlays for:

- Campaigns.
- Posts.
- Donors and Applicants.
- Staff and Roles.
- Users.
- Organizations.
- Categories.
- Notifications.
- Reports.
- Rewards.
- Admin content and review flows.
- Mobile Sidebar Sheet.

### Shared API parameter builder

Added:

```text
src/lib/build-api-params.ts
```

`buildApiParams` replaced local `buildParams` wrappers and the removed `build-list-params.ts` utility.

The builder:

- Removes empty values.
- Preserves nested filters.
- Supports pagination, sorting, includes, analytics params, and future API requests.
- Keeps Laravel-compatible nested query serialization.

### Profile and Header cleanup

This refactor also:

- Removed the remaining Admin Profile page and components.
- Removed `authServices.updateProfile` and its request/response types.
- Removed the Profile link from the Header dropdown.
- Removed the role-switch dropdown.
- Removed the role label from the profile dropdown.
- Removed remaining Audit Log icon references.

## Step 14 — Final permission-aware modal and Sidebar update

Latest Frontend commit:

```text
38bf7c9 Refactor modal handling in donors, campaigns, notifications, posts, and staff management
```

This is the final change after returning to Frontend `main`.

### Permission-aware query modal security

`useQueryModal` now supports:

```ts
permission?: string
permissionsByMode?: Record<string, string>
roles?: DashboardRole[]
```

The hook now validates:

1. The authenticated dashboard role.
2. The dashboard scope in the current pathname.
3. The required permission.
4. The permission required for the selected mode.
5. Authentication-context loading state.

This protects both normal UI actions and manually edited URLs.

For example, writing this manually:

```text
?modal=campaign-delete&modalId=123
```

does not open the Dialog unless the user has `org.campaigns.delete`. Unauthorized modal parameters are removed from the URL with `replaceState`.

Mode-specific protection prevents invalid combinations such as opening an edit form with only create permission:

```text
modalMode=create -> *.create
modalMode=edit   -> *.update
```

Applied organization modal permissions include:

```text
campaign-create -> org.campaigns.create
campaign-close  -> org.campaigns.close
campaign-delete -> org.campaigns.delete

post-create     -> org.posts.create
post-delete     -> org.posts.delete

notification-details -> org.notifications.view

donor/applicant details -> *.view
donor/applicant create  -> *.create
donor/applicant edit    -> *.update
donor/applicant delete  -> *.delete

staff member create -> org.staff.create
staff member edit   -> org.staff.update
staff member delete -> org.staff.delete

role create -> org.roles.create
role edit   -> org.roles.update
role delete -> org.roles.delete
```

Staff and Role action buttons are also hidden when the permission is absent.

### Sidebar ESLint and state improvements

The Sidebar no longer synchronously calls `setState` inside effects to hydrate collapsed state or clear search state.

Changes include:

- `useSyncExternalStore` for the persisted collapse value.
- A localStorage subscription event for collapse changes.
- Pathname-aware derived search state.
- Mobile Sidebar closing from the `matchMedia` callback when switching to desktop.

This resolved the two reported `react-hooks/set-state-in-effect` errors in `src/components/base/side-bar.tsx`.

---

## 5. Current Final Frontend State

## 5.1 Authentication

- Admin and Organization login use different Backend endpoints.
- Account type is selected from a dropdown.
- Returned dashboard role is validated against the selected account type.
- Access and Refresh tokens are stored and rotated.
- Organization registration is connected to the Backend.
- Pending organizations use the dedicated approval page.

## 5.2 Permission enforcement layers

Permissions are enforced at several Frontend layers:

1. Sidebar navigation.
2. Section tabs.
3. Route guards.
4. Page-level queries.
5. Action buttons.
6. Mutation handlers.
7. Dedicated details/edit pages.
8. Query-param Sheets and Dialogs.
9. Backend policies and organization ownership checks.

The Frontend remains a usability layer. Backend authorization remains the security authority.

## 5.3 Campaigns

- Real API list and detail data.
- Create uses a Sheet.
- Edit uses a dedicated page.
- Details use a dedicated page.
- Closing uses the canonical status endpoint.
- Closed campaigns cannot be edited.
- Owner/Staff routing is preserved.
- Create, update, close, and delete actions are permission-aware.

## 5.4 Posts

- Real API list and detail data.
- Create uses a Sheet.
- Details and edit use dedicated pages.
- Details show body content and images.
- Publish, archive, restore, and delete actions use specific permissions.
- Post update invalidates list and detail queries.

## 5.5 Donors and Applicants

- Separate Backend resources and Frontend queries.
- Permission-aware query execution.
- URL-driven details, form, and delete overlays.
- Create/edit mode is stored in `modalMode` and checked against the matching permission.

## 5.6 Staff and Roles

- Staff and Roles use real APIs.
- Permission catalog is loaded from the Backend.
- Create/edit/delete overlays are URL-driven.
- Each mode has a specific permission check.
- Self-deletion is blocked in the UI.
- System-role and owner safeguards remain enforced by the Backend.

## 5.7 Reports

- Organization report list and status updates use organization APIs.
- Status controls are shown only with `org.reports.update`.
- Invalid lifecycle transitions are prevented in the UI and Backend.

## 5.8 Organization Notifications

Notifications were deferred in the original plan, but they are now active in the Frontend.

Current routes exist for Owner and Staff:

```text
/dashboard/org-owner/notifications/inbox
/dashboard/org-owner/notifications/sent
/dashboard/org-staff/notifications/inbox
/dashboard/org-staff/notifications/sent
```

The current implementation includes:

- Organization notification list queries.
- Inbox and sent mailboxes.
- Read/unread filtering.
- Details display.
- Read-state updates.
- Permission-protected details modal using `org.notifications.view`.

The organization notification feature layer uses:

```http
/api/v1/org/notifications
/api/v1/org/notifications/{id}
/api/v1/org/notifications/{id}/read-state
```

Additional Backend compatibility operations such as resend/delete may remain available in the service layer.

## 5.9 Organization Settings

Organization Settings remain available and connected to:

```http
GET/PATCH /api/v1/org/settings/profile
GET/PATCH /api/v1/org/settings/bank-account
```

Fields become read-only when `org.settings.update` is missing.

## 5.10 Features intentionally removed from the current Frontend

### Audit Log

Removed for all dashboard roles:

- Admin Audit Log page.
- Owner Audit Log page.
- Staff Audit Log page.
- Audit Log components.
- Admin and organization Audit Log feature layers.
- Audit Log routes and icon references.

The Backend endpoint is not deleted by this Frontend change.

### Personal Profile pages

Removed:

- Admin Profile page.
- Organization Owner personal profile page.
- Organization Staff personal profile page.
- Shared dashboard profile components.
- Frontend personal profile update mutation.
- Profile link in the Header menu.
- Role-switch dropdown and role label.

Organization Settings remain separate and are not removed.

---

## 6. Main API Reference

| Area | Method | Endpoint | Current Frontend use |
|---|---|---|---|
| Admin login | POST | `/api/v1/auth/login` | Platform Administration login |
| Organization login | POST | `/api/v1/company/auth/login` | Owner/Staff login |
| Organization registration | POST | `/api/v1/company/auth/register` | Register organization and Owner |
| Refresh token | POST | `/api/v1/auth/refresh` | Rotate Access/Refresh tokens |
| Logout | POST | `/api/v1/auth/logout` | End authenticated session |
| Dashboard context | GET | `/api/v1/me/dashboard-context` | Role, organization, permissions, counters |
| Organization overview | GET | `/api/v1/org/dashboard/overview` | Owner/Staff overview |
| Campaigns | REST | `/api/v1/org/campaigns` | Campaign CRUD |
| Campaign status | PATCH | `/api/v1/org/campaigns/{id}/status` | Close/lifecycle updates |
| Posts | REST | `/api/v1/org/posts` | Post CRUD |
| Post status | PATCH | `/api/v1/org/posts/{id}/status` | Publish/archive/restore |
| Donors | REST | `/api/v1/org/donors` | Donor CRUD |
| Applicants | REST | `/api/v1/org/applicants` | Applicant CRUD |
| Staff | REST | `/api/v1/org/staff` | Staff management |
| Roles | REST | `/api/v1/org/staff/roles` | Role management |
| Permission catalog | GET | `/api/v1/org/permissions/catalog` | Dynamic role permission form |
| Reports | GET | `/api/v1/org/reports` | Report list |
| Report details | GET | `/api/v1/org/reports/{id}` | Report details |
| Report status | PATCH | `/api/v1/org/reports/{id}/status` | Report lifecycle update |
| Notifications | REST | `/api/v1/org/notifications` | Organization inbox/sent data |
| Notification read state | PATCH | `/api/v1/org/notifications/{id}/read-state` | Read/unread update |
| Organization profile | GET/PATCH | `/api/v1/org/settings/profile` | Organization Settings |
| Bank account | GET/PATCH | `/api/v1/org/settings/bank-account` | Organization Settings |
| Audit Log | GET | `/api/v1/org/audit-logs` | Backend remains; Frontend UI removed |
| Personal profile update | PATCH | `/api/v1/me/profile` | Backend may remain; Frontend dashboard mutation removed |

---

## 7. Permission Matrix

| Area | Permissions used by the current Frontend |
|---|---|
| Dashboard | `dashboard.view` |
| Campaigns | `org.campaigns.view/create/update/close/delete` |
| Posts | `org.posts.view/create/update/publish/archive/restore/delete` |
| Donors | `org.donors.view/create/update/delete` |
| Applicants | `org.applicants.view/create/update/delete` |
| Reports | `org.reports.view/update` |
| Notifications | `org.notifications.view` for current details access; Backend policies still protect API operations |
| Settings | `org.settings.view/update` |
| Staff | `org.staff.create/update/delete` plus Owner route restrictions |
| Roles | `org.roles.create/update/delete` plus Owner route restrictions |
| Audit Log | Backend permission may exist, but the current Frontend feature is removed |

Every mutation must still be authorized by the Backend even when the Frontend hides or blocks the action.

---

## 8. Shared Frontend Architecture Added During This Work

## 8.1 AuthProvider

`AuthProvider` owns:

- Authenticated state.
- User profile.
- Dashboard context.
- Dashboard role.
- Organization context.
- Permission lookup.
- Unauthorized-session handling.

## 8.2 API feature structure

Organization features follow the pattern:

```text
feature.types.ts
feature.services.ts
feature.query-keys.ts
feature.query.ts
```

This separates:

- API contracts.
- HTTP calls.
- React Query keys.
- Query and mutation hooks.

## 8.3 Shared API params

All list services use `buildApiParams` instead of local wrappers.

## 8.4 Shared loading states

Shared skeletons include:

- `ListLoadingSkeleton`
- `CardGridLoadingSkeleton`
- `DetailsLoadingSkeleton`
- `FormLoadingSkeleton`

Each root fills the parent width using:

```text
w-full min-w-0 self-stretch
```

## 8.5 URL-driven overlays

`useQueryModal` and `useQueryDisclosure` make overlay state:

- Linkable.
- Refresh-safe.
- Consistent across pages.
- Compatible with nested dialogs.
- Protected by role and permission.

---

## 9. Security Rules

1. Frontend visibility is not a replacement for Backend authorization.
2. Every organization resource must be scoped by the authenticated user's organization.
3. The Frontend must not send an arbitrary organization ID to choose data ownership.
4. Owner and Staff routes must stay isolated from Admin routes.
5. Staff permissions come from the assigned organization role.
6. The Backend validates lifecycle transitions.
7. Direct route access must be guarded.
8. Direct query-param access to a Sheet or Dialog must be guarded.
9. `modalMode=create` and `modalMode=edit` must use different permissions when the operation differs.
10. Unauthorized query params must be removed without opening the overlay.
11. The current user must not be able to delete their own active account or staff membership from the UI.
12. Pending organizations must not enter the organization dashboard until active and verified.
13. Access tokens and refresh tokens must not be treated as interchangeable.
14. A failed refresh operation must clear the session.

---

## 10. Verification Status

## 10.1 Frontend production build

The latest implementation was verified with:

```bash
npm run build
```

Result at `38bf7c9`:

- Next.js compilation passed.
- TypeScript validation passed.
- 63 application pages were generated.
- Exit code was `0`.

The only build warning was the existing Next.js notice that the `middleware` file convention is deprecated in favor of `proxy`.

## 10.2 Targeted ESLint verification

The two files involved in the latest Sidebar/query-modal fix were checked with:

```bash
npx eslint src/components/base/side-bar.tsx src/hooks/use-query-modal.ts
```

Result:

- Zero errors.
- Zero warnings.

The repository-wide lint command still reports pre-existing `react-hooks/set-state-in-effect` issues in unrelated components. Therefore this document does not claim that the entire repository lint is currently clean.

## 10.3 Backend tests

The Backend feature branch contains organization feature and regression tests covering areas such as:

- Organization scoping.
- Owner and Staff permissions.
- Staff and Role safeguards.
- Campaign and Post lifecycle behavior.
- Donor and Applicant isolation.
- Report transitions and assignment scope.
- Audit access.
- Settings contracts.
- Final-owner and membership regressions.

This Frontend documentation update did not rerun the Backend test suite.

---

## 11. Commit Timeline

## 11.1 Backend feature branch

```text
8ca8c19 feat(org-auth): add owner staff dashboard context
e73bcfe feat(org-staff): enforce role assignment safeguards
5131908 feat(org-overview): add scoped dashboard data
24f3374 feat(org-content): enforce campaign post lifecycle
4a4f4dd feat(org-data): scope donors applicants reports audit
c7136ac feat(org-settings): secure profile and password flows
abe3781 feat(org-dashboard): finalize auth context permissions
6a5ac1d feat(org-dashboard): align staff role contracts
4a2d304 feat(org-dashboard): expose overview activity contract
7b5bb61 feat(org-dashboard): connect reports audit permissions
2e75132 test(org-dashboard): cover reports audit integration
b3a4394 docs(org-dashboard): add implementation plan and changes
39aa42b docs(org-dashboard): translate implementation plan to English
b9a1795 fix: scope report assignees to organization
55723b3 style: add explicit role index return type
c7ba407 style: add explicit staff index return type
7ccf73d fix: validate campaign date ordering
6279c45 fix: default campaign status to draft
beb319d fix: keep campaign DTO default parameter valid
96b804a fix: default post status to draft
151bb0d fix: allow partial role updates
6bf21a7 fix: scope active staff membership to user organization
f3608b9 fix: ignore all sentinel in campaign search
ad0a6ea fix: support permissions count sorting across databases
1f4483a fix: serialize final owner transitions
ad49450 test: align organization overview response assertions
fa22174 Fix organization role management test routes
95769c3 Fix staff deletion assertion and add organization scope regression
d338753 Restore organization report permission actions
```

Backend merge:

```text
3c951c4 Merge pull request #8 from feature/org-owner-staff-permissions-backend
```

## 11.2 Backend company authentication on `main`

```text
32fdc6f add company registration validation
c58577b add company registration service
e87bebc add company auth endpoints
5c5e3d3 register company auth routes
ca2078d load company auth routes
b457035 add company account seeds
65f2e0d run company account seeds
ea5d1d9 Merge pull request #9 from MustafaFares445/agent/company-auth-endpoints
```

## 11.3 Frontend implementation through `main`

```text
777e8ef feat(org-dashboard): enforce auth permission navigation
a51f1b1 feat(org-dashboard): connect staff roles permissions
583ed2a feat(org-dashboard): connect organization overview
dfc7aa0 feat(org-dashboard): align campaign post lifecycle permissions
89683aa feat(org-dashboard): gate donor applicant operations
2d95d5d feat(org-dashboard): connect organization reports audit
6ec4cc2 feat(org-dashboard): connect organization settings
3b176eb feat(org-dashboard): separate owner staff profiles
a58ea43 docs(org-dashboard): record integration verification
9eba58d docs(org-dashboard): add implementation plan and changes
1198e59 docs(org-dashboard): translate implementation plan to English
e4a56b4 fix(api): ensure BASE_URL is always defined by using non-null assertion
0d1271c feat(org-dashboard): add organization dashboard plan and implementation changes document
916f59f Implement code changes to enhance functionality and improve performance
cb160fe feat: add organization campaign edit page and related components
1e605a4 feat: add OrganizationPendingApprovalPage component and related utilities
8a20456 feat: refactor modal handling with useQueryModal hook
38bf7c9 Refactor modal handling in donors, campaigns, notifications, posts, and staff management
```

---

## 12. Rules for Future Organization Dashboard Work

When adding or changing an organization feature:

1. Define or confirm the Backend permission names first.
2. Add Backend policies and organization ownership checks.
3. Define a camelCase API contract.
4. Add Backend tests for cross-organization access.
5. Add Frontend types, services, query keys, and hooks.
6. Use `buildApiParams` for list/query parameters.
7. Gate the route and navigation with the view permission.
8. Gate each action with its exact permission.
9. Disable unauthorized queries where possible.
10. Protect direct URL routes.
11. Protect query-driven Sheets and Dialogs through `useQueryModal`.
12. Use `permissionsByMode` when create and edit require different permissions.
13. Use dedicated details/edit pages for complex resources instead of overloading list Sheets.
14. Use shared loading skeletons.
15. Keep Owner and Staff routing correct when they share a component.
16. Verify the production build.
17. Record whether lint/test issues are new or pre-existing.
18. Update this document when the final behavior changes.

---

## 13. Final Status

- The Backend organization permission feature was completed on `feature/org-owner-staff-permissions-backend` and merged through PR #8.
- Backend `main` later added company authentication through PR #9.
- The Frontend organization dashboard implementation was completed on `feature/org-owner-staff-permissions-frontend` and continued on `main`.
- Admin, Owner, and Staff authentication paths are separated.
- Organization registration and pending approval are implemented.
- Owner and Staff use organization-scoped APIs.
- Permission-aware navigation, routes, actions, queries, Sheets, and Dialogs are implemented.
- Campaign and Post details/edit flows use dedicated pages.
- Donor, Applicant, Staff, and Role overlays are query-driven and permission-aware.
- Organization Notifications are now integrated; they are no longer deferred.
- Audit Log UI and personal Profile pages were removed from the current Frontend.
- Organization Settings remain active.
- Shared API parameter building and loading skeletons are in place.
- The latest production build passes.
- Mobile application integration remains outside this Frontend dashboard delivery.
