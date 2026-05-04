# JOD Frontend

Frontend dashboard project for **Jood Platform** built with **Next.js App Router**, **TypeScript**, **Tailwind CSS v4**, and reusable UI primitives.

This project currently focuses on dashboard experiences for three roles:
- `admin`
- `organization_owner`
- `organization_staff`

The root route `/` redirects to `/dashboard/admin`.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI + shadcn-style components
- React Hook Form + Zod
- Lucide React icons

## Run Locally

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build
npm run start
npm run lint
```

## Project Structure

```text
src/
├── app/                  # Next.js routes and layouts
├── assets/               # Local static assets (images)
├── components/
│   ├── base/             # Dashboard shell components (sidebar, header, breadcrumb)
│   ├── pages/            # Feature page modules
│   ├── shared/           # Shared reusable business UI bits
│   └── ui/               # Design-system primitives
├── constant/             # Routes, icons, events, pagination constants
├── hooks/                # Reusable hooks
└── lib/                  # Pure helper functions
```

## Routing Overview

### Root + Auth

- `/` -> redirects to `/dashboard/admin`
- `/login` -> login page
- `/register` -> 2-phase organization registration form

### Dashboard Layout

- `src/app/dashboard/layout.tsx` wraps all dashboard pages with:
  - `SideBar`
  - `Header`
  - `AppBreadcrumb`
  - `SectionTabs`
- `src/app/dashboard/[[...segments]]/page.tsx` is a fallback page for unmatched dashboard paths.

### Admin Routes

- `/dashboard/admin`
- `/dashboard/admin/posts/review`
- `/dashboard/admin/posts/approved`
- `/dashboard/admin/posts/rejected`
- `/dashboard/admin/campaigns/review`
- `/dashboard/admin/campaigns/approved`
- `/dashboard/admin/campaigns/rejected`
- `/dashboard/admin/reports/new`
- `/dashboard/admin/reports/in-progress`
- `/dashboard/admin/reports/closed`
- `/dashboard/admin/reports` (redirects to `/dashboard/admin/reports/new`)
- `/dashboard/admin/users`
- `/dashboard/admin/organizations`
- `/dashboard/admin/organizations/[id]`
- `/dashboard/admin/rewards`
- `/dashboard/admin/content`
- `/dashboard/admin/content/new`
- `/dashboard/admin/content/[id]/edit`
- `/dashboard/admin/analytics`
- `/dashboard/admin/notifications/inbox`
- `/dashboard/admin/notifications/sent`
- `/dashboard/admin/notifications` (redirects to `/dashboard/admin/notifications/inbox`)
- `/dashboard/admin/profile`
- `/dashboard/admin/settings`
- `/dashboard/admin/audit-log`

### Organization Owner Routes

- `/dashboard/org-owner`
- `/dashboard/org-owner/campaigns`
- `/dashboard/org-owner/campaigns/draft`
- `/dashboard/org-owner/campaigns/active`
- `/dashboard/org-owner/campaigns/closed`
- `/dashboard/org-owner/campaigns/[id]`
- `/dashboard/org-owner/posts`
- `/dashboard/org-owner/posts/draft`
- `/dashboard/org-owner/posts/published`
- `/dashboard/org-owner/posts/archived`
- `/dashboard/org-owner/donors`
- `/dashboard/org-owner/donors/applicants`
- `/dashboard/org-owner/staff`
- `/dashboard/org-owner/staff/roles`
- `/dashboard/org-owner/notifications/inbox`
- `/dashboard/org-owner/notifications/sent`
- `/dashboard/org-owner/notifications` (redirects to inbox)
- `/dashboard/org-owner/reports`
- `/dashboard/org-owner/profile`
- `/dashboard/org-owner/settings`

### Organization Staff Routes

- `/dashboard/org-staff`
- `/dashboard/org-staff/campaigns`
- `/dashboard/org-staff/campaigns/active`
- `/dashboard/org-staff/campaigns/closed`
- `/dashboard/org-staff/campaigns/[id]`
- `/dashboard/org-staff/posts`
- `/dashboard/org-staff/donors`
- `/dashboard/org-staff/donors/applicants`
- `/dashboard/org-staff/notifications/inbox`
- `/dashboard/org-staff/notifications/sent`
- `/dashboard/org-staff/notifications` (redirects to inbox)
- `/dashboard/org-staff/reports`
- `/dashboard/org-staff/profile`
- `/dashboard/org-staff/settings`

## Components Explained

## 0) App-Level Route Components (`src/app`)

| Component | What it does |
|---|---|
| `layout.tsx` | Root HTML/body layout, sets Arabic RTL direction and global tooltip provider. |
| `page.tsx` | Root page component that redirects to admin dashboard home. |
| `dashboard/layout.tsx` | Shared dashboard shell composition (sidebar + header + breadcrumb + section tabs + content area). |
| `dashboard/[[...segments]]/page.tsx` | Fallback dashboard page that resolves role/title from path and shows placeholder content. |
| `(auth)/layout.tsx` | Auth split-screen layout with branding artwork and form container. |
| `(auth)/login/page.tsx` | Login form page UI. |
| `(auth)/register/page.tsx` | Register route page that renders the registration flow component. |

## 1) Base Components (`src/components/base`)

| Component | What it does |
|---|---|
| `logo.tsx` | Reusable JOD logo renderer using `next/image`. |
| `side-bar.tsx` | Main role-aware sidebar navigation, grouped links, link search, desktop collapse/hover expand, and mobile sheet behavior. |
| `header.tsx` | Top bar with page title, role label, profile menu, role switching, and theme mode switching (light/dark/system). |
| `app-breadcrumb.tsx` | Builds breadcrumb trail from current URL using route labels. |
| `section-tabs.tsx` | Displays contextual tabs for the current active sidebar section. |

## 2) Shared Components (`src/components/shared`)

| Component | What it does |
|---|---|
| `empty-state.tsx` | Generic empty state block with icon, title, and description. |
| `pagination-controls.tsx` | Shared pagination UI (page switching, page size selector, range dots). |
| `review-status-badge.tsx` | Status badge for moderation states (`pending`, `approved`, `rejected`). |

## 3) Auth Components (`src/app/(auth)/register`)

| Component | What it does |
|---|---|
| `register-form.tsx` | Main 2-step registration flow state and validation logic. |
| `register-phase-one-fields.tsx` | Step 1 inputs: admin account data. |
| `register-phase-two-fields.tsx` | Step 2 inputs: organization details, files, declarations. |
| `register-form.types.ts` | Shared types + initial form values for registration flow. |

## 4) Feature Page Modules (`src/components/pages`)

### `admin-overview`

| Component | What it does |
|---|---|
| `admin-overview-page.tsx` | Admin dashboard summary with KPIs and recent activity preview. |
| `static-data.ts` | Mock stats and activity feed data for overview cards. |

### `analytics-dashboard`

| Component | What it does |
|---|---|
| `analytics-dashboard-page.tsx` | Analytics preview page with KPI cards and weekly performance table/chart-like view. |
| `analytics.data.ts` | Static KPI and weekly analytics datasets. |

### `audit-log`

| Component | What it does |
|---|---|
| `audit-log-page.tsx` | Activity log table page for admin operations history. |
| `audit-log.data.ts` | Static audit log entries. |

### `posts-review`

| Component | What it does |
|---|---|
| `posts-review-page.tsx` | Main moderation page for posts by review status. |
| `review-toolbar.tsx` | Search/sort/filter toolbar for post review lists. |
| `review-post-card.tsx` | Card presentation for a single reviewable post. |
| `review-posts-table.tsx` | Tabular presentation for review posts. |
| `post-details-dialog.tsx` | Modal dialog showing post full details. |
| `reject-post-dialog.tsx` | Confirmation + reason dialog for rejecting a post. |
| `static-data.ts` | Mock posts review data and labels. |
| `index.ts` | Public exports for the module. |

### `campaigns-review`

| Component | What it does |
|---|---|
| `campaigns-review-page.tsx` | Main moderation page for campaigns by status. |
| `review-toolbar.tsx` | Search/sort/filter toolbar for campaigns review. |
| `review-campaign-card.tsx` | Card view for campaign moderation items. |
| `campaign-details-dialog.tsx` | Dialog for detailed campaign info. |
| `reject-campaign-dialog.tsx` | Reject campaign confirmation/reason dialog. |
| `helpers.ts` | Helper functions (amount formatting, progress calculation). |
| `static-data.ts` | Mock campaigns review data and labels. |
| `index.ts` | Public exports for the module. |

### `reports-management`

| Component | What it does |
|---|---|
| `reports-management-page.tsx` | Reports management shell filtered by report status route. |
| `reports-toolbar.tsx` | Filter/search controls for report list. |
| `report-card.tsx` | Summary card UI for one report. |
| `report-details-sheet.tsx` | Slide-over details panel for full report timeline/evidence. |
| `helpers.ts` | Severity/status badge style helpers. |
| `static-data.ts` | Mock report datasets, labels, and related types. |
| `index.ts` | Public exports for the module. |

### `users-management`

| Component | What it does |
|---|---|
| `users-management-page.tsx` | Users management page container and actions wiring. |
| `users-table.tsx` | Data table for users listing. |
| `user-form-sheet.tsx` | Create/edit user side sheet form. |
| `user-delete-dialog.tsx` | Delete user confirmation dialog. |
| `user-change-password-dialog.tsx` | Change-password dialog for selected user. |
| `helpers.ts` | Utility helpers (new ID generation, badge class mapping). |
| `static-data.ts` | Mock users data and enums. |
| `index.ts` | Public exports for the module. |

### `organizations-management`

| Component | What it does |
|---|---|
| `organizations-management-page.tsx` | Organizations listing management container. |
| `organizations-table.tsx` | Table view for organizations. |
| `organizations-filters.tsx` | Filter/sort controls for organizations list. |
| `organization-form-sheet.tsx` | Create/edit organization sheet form. |
| `organization-delete-dialog.tsx` | Delete organization confirmation dialog. |
| `organization-details-page.tsx` | Organization profile/details page for `/organizations/[id]`. |
| `helpers.ts` | Helper utilities for status/verification badges and IDs. |
| `static-data.ts` | Mock organizations data and labels. |
| `index.ts` | Public exports for the module. |

### `rewards-management`

| Component | What it does |
|---|---|
| `rewards-management-page.tsx` | Badge/rewards management page for admin. |
| `rewards-table.tsx` | Table of rewards/badges with actions. |
| `reward-form-sheet.tsx` | Create/edit reward sheet form. |
| `helpers.ts` | Reward ID creation and active/inactive badge style helpers. |
| `static-data.ts` | Reward icon options, statuses, and mock badges data. |
| `index.ts` | Public exports for the module. |

### `notifications-management`

| Component | What it does |
|---|---|
| `notifications-management-page.tsx` | Inbox/sent notifications page controller by mailbox route. |
| `notifications-filters.tsx` | Filters for category, date, status, and priority. |
| `notifications-table.tsx` | Notifications table UI. |
| `create-notification-sheet.tsx` | Compose/send notification sheet. |
| `notification-details-sheet.tsx` | Read-only notification details view. |
| `helpers.ts` | Counters, date matching, ID generation, and badge styling helpers. |
| `static-data.ts` | Notification models, labels, and mock data. |
| `index.ts` | Public exports for the module. |

### `content-management`

| Component | What it does |
|---|---|
| `content-management-page.tsx` | Admin content/articles listing and management page. |
| `content-table.tsx` | Table for content rows with edit actions. |
| `content-editor-page.tsx` | Create/edit article editor page (`mode=create/edit`). |
| `helpers.ts` | Local storage helpers, slug generation, and article status badge classes. |
| `static-data.ts` | Article types, statuses, and mock data. |
| `index.ts` | Public exports for the module. |

### `platform-settings`

| Component | What it does |
|---|---|
| `platform-settings-page.tsx` | Admin platform settings form page. |
| `platform-settings.data.ts` | Default settings values used by the form. |
| `index.ts` | Public exports for the module. |

### `dashboard-profile`

| Component | What it does |
|---|---|
| `dashboard-profile-page.tsx` | Profile form page shared by all dashboard roles (`scope` prop). |
| `dashboard-profile.data.ts` | Role-based default profile values. |
| `dashboard-profile.types.ts` | Profile scope typing (`admin`, `org-owner`, `org-staff`). |
| `index.ts` | Public exports for the module. |

### `dashboard-settings`

| Component | What it does |
|---|---|
| `dashboard-settings-page.tsx` | Role-based account/bank settings page for org owner/staff. |
| `dashboard-settings.data.ts` | Default bank settings values per role scope. |
| `index.ts` | Public exports for the module. |

### `org-owner-overview`

| Component | What it does |
|---|---|
| `org-owner-overview-page.tsx` | Overview dashboard for organization owner role. |
| `org-owner-overview.data.ts` | Owner overview KPI and activity mock data. |
| `index.ts` | Public exports for the module. |

### `org-staff-overview`

| Component | What it does |
|---|---|
| `org-staff-overview-page.tsx` | Overview dashboard for organization staff role. |
| `org-staff-overview.data.ts` | Staff overview KPI and activity mock data. |
| `index.ts` | Public exports for the module. |

### `organization-campaigns`

| Component | What it does |
|---|---|
| `organization-campaigns-page.tsx` | Main campaigns management page (status-aware list). |
| `organization-campaigns-filters.tsx` | Campaign list filters and sort controls. |
| `organization-campaigns-table.tsx` | Table view for campaigns with row actions. |
| `organization-campaign-details-page.tsx` | Detailed campaign page for dynamic campaign ID route. |
| `campaign-form-sheet.tsx` | Create/edit campaign side sheet form. |
| `close-campaign-dialog.tsx` | Close campaign confirmation dialog. |
| `delete-campaign-dialog.tsx` | Delete campaign confirmation dialog. |
| `helpers.ts` | Campaign helper functions (ID generation, status classes, date conversions). |
| `static-data.ts` | Campaign models, labels, and mock rows. |
| `index.ts` | Public exports for the module. |

### `organization-posts-management`

| Component | What it does |
|---|---|
| `posts-management-page.tsx` | Organization posts management page by status. |
| `posts-filters.tsx` | Filters/sort controls for posts list. |
| `posts-table.tsx` | Table for organization posts with actions. |
| `post-form-sheet.tsx` | Create/edit post form sheet. |
| `post-details-sheet.tsx` | Post details slide-over sheet. |
| `delete-post-dialog.tsx` | Delete post confirmation dialog. |
| `helpers.ts` | Post helpers (status normalize, workflow actions, badge classes, ID generation). |
| `static-data.ts` | Post models, type/status labels, and mock rows. |
| `index.ts` | Public exports for the module. |

### `donors-management`

| Component | What it does |
|---|---|
| `donors-management-page.tsx` | Donors/applicants page controller (`view=donors/applicants`). |
| `donors-table.tsx` | Table list for donor entries. |
| `donor-entry-form-sheet.tsx` | Create/edit donor entry sheet form. |
| `donor-entry-details-sheet.tsx` | Donor full details sheet. |
| `donor-entry-delete-dialog.tsx` | Delete donor record confirmation dialog. |
| `static-data.ts` | Mock donors and applicants data. |
| `index.ts` | Public exports for the module. |

### `staff-management`

| Component | What it does |
|---|---|
| `staff-management-page.tsx` | Staff module page controller (`view=employees/roles`). |
| `staff-table.tsx` | Employee members table. |
| `roles-table.tsx` | Staff roles table with permissions preview. |
| `staff-member-form-sheet.tsx` | Create/edit staff member sheet form. |
| `staff-member-delete-dialog.tsx` | Confirm delete for staff member entry. |
| `staff-role-form-sheet.tsx` | Create/edit staff role + permissions sheet form. |
| `staff-role-delete-dialog.tsx` | Confirm delete for staff role entry. |
| `static-data.ts` | Mock staff members, roles, and permission catalog. |
| `index.ts` | Public exports for the module. |

### `organization-reports`

| Component | What it does |
|---|---|
| `organization-reports-page.tsx` | Reports list page for organization owner/staff dashboards. |
| `static-data.ts` | Report categories, statuses, and mock organization reports data. |
| `index.ts` | Public exports for the module. |

### `organization-notifications`

| Component | What it does |
|---|---|
| `organization-notifications-page.tsx` | Organization-facing notifications view (feature module). |
| `static-data.ts` | Static organization notification mock data. |
| `index.ts` | Public exports for the module. |

## 5) UI Primitives (`src/components/ui`)

| Component | What it does |
|---|---|
| `accordion.tsx` | Expand/collapse content sections. |
| `badge.tsx` | Small label/status chips with style variants. |
| `breadcrumb.tsx` | Generic breadcrumb structure primitives. |
| `button.tsx` | Button component with multiple variants and sizes. |
| `calendar.tsx` | Date calendar picker UI. |
| `checkbox.tsx` | Checkbox input control. |
| `data-grid.tsx` | Lightweight configurable data grid abstraction. |
| `date-picker.tsx` | Combined input + popover date selection component. |
| `dialog.tsx` | Modal dialog primitives. |
| `dropdown-menu.tsx` | Dropdown and nested menu primitives. |
| `form.tsx` | React Hook Form helper wrappers and form field primitives. |
| `input.tsx` | Styled text input component. |
| `input-otp.tsx` | OTP/pin segmented input component. |
| `label.tsx` | Accessible form label primitive. |
| `pagination.tsx` | Pagination layout primitives (links, items, ellipsis). |
| `password-input.tsx` | Password input with visibility toggle behavior. |
| `phone-number-input.tsx` | Phone input with country code support UX. |
| `popover.tsx` | Popover floating content primitives. |
| `radio-group.tsx` | Radio group and item primitives. |
| `select.tsx` | Custom select/dropdown input primitives. |
| `sheet.tsx` | Side panel/drawer primitives. |
| `switch.tsx` | On/off switch control. |
| `table.tsx` | Table layout primitives (`Table`, rows, cells...). |
| `tabs.tsx` | Tab list/trigger/content primitives. |
| `textarea.tsx` | Styled multiline text input. |
| `tooltip.tsx` | Tooltip trigger/content/provider primitives. |

## 6) Hooks and Utilities

### Hooks (`src/hooks`)

| Hook | What it does |
|---|---|
| `use-pagination.ts` | Handles current page, total pages, previous/next state, and pagination range with dots. |
| `use-app-navigation.ts` | Typed route navigation helpers built on top of `resolveRoute`. |

### Constants (`src/constant`)

| File | What it does |
|---|---|
| `routes.ts` | Central route definitions, role menus, tabs, path title labels, and route helper functions. |
| `icons.ts` | Application-wide icon map (`AppIcons`). |
| `pagination.ts` | Default page sizes and options for pagination controls. |
| `events.ts` | Cross-component custom events (currently sidebar toggle event). |

### Utilities (`src/lib`)

| File | What it does |
|---|---|
| `utils.ts` | `cn()` utility for class name composition (`clsx` + `tailwind-merge`). |
| `date.ts` | UTC-safe parsing and date/date-time formatting helpers. |
| `text.ts` | Text normalization helper. |

## Data Source Status

Current pages are built mostly with in-module mock data files (`static-data.ts`, `*.data.ts`).

When API integration starts, each module can replace static data with async fetching while preserving current component boundaries.

## Quick Development Notes

- Add new dashboard route under `src/app/dashboard/...`.
- Add/extend feature module under `src/components/pages/<feature>/`.
- Register sidebar/tabs route metadata in `src/constant/routes.ts`.
- Reuse primitives from `src/components/ui` and shared blocks from `src/components/shared`.
