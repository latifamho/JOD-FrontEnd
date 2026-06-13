# Data Contract: Admin Dashboard
**JOD Platform - Backend Specification**

---

## Overview

This document defines the data models, enums, and API endpoints the frontend expects for the **Admin Dashboard**.
All data shapes are derived from the current frontend TypeScript types, page implementations, and dashboard routes.
The backend should match these contracts exactly.

**Dashboard base route:** `/dashboard/admin`
**Role:** `admin`

---

## Table of Contents

1. [API Response Envelope](#1-api-response-envelope)
2. [Query Parameters](#2-query-parameters)
3. [Component Diagram](#3-component-diagram)
4. [Data Models & Endpoints](#4-data-models--endpoints)
   - [Bootstrap & Profile](#41-bootstrap--profile)
   - [Dashboard Overview](#42-dashboard-overview)
   - [Analytics](#43-analytics)
   - [Users](#44-users)
   - [Organizations](#45-organizations)
   - [Post Review](#46-post-review)
   - [Campaign Review](#47-campaign-review)
   - [Reports](#48-reports)
   - [Notifications](#49-notifications)
   - [Rewards / Badges](#410-rewards--badges)
   - [Content / Articles](#411-content--articles)
   - [Categories](#412-categories)
   - [Audit Log](#413-audit-log)
   - [Platform Settings](#414-platform-settings)
5. [Enums Quick Reference](#5-enums-quick-reference)
6. [Field Notes](#6-field-notes)

---

## 1. API Response Envelope

Every endpoint must wrap its response in this structure:

```ts
// Single item
{
  statusCode: number
  message:    string
  item:       T
}

// List
{
  statusCode: number
  message:    string
  item: {
    data:    T[]
    total:   number
    page:    number
    perPage: number
  }
}
```

**Error response:**
```ts
{
  type:     string
  title:    string
  status:   number
  traceId:  string
  code?:    string
  detail?:  string
  errors?:  Record<string, string[]>
}
```

---

## 2. Query Parameters

All list endpoints accept:

| Param | Type | Description |
|---|---|---|
| `page` | `number` | Page number, default `1` |
| `perPage` | `number` | Items per page, default `10` |
| `sortingField` | `string` | Field name to sort by |
| `sortingDir` | `'asc' \| 'desc'` | Sort direction |
| `searchQueries` | `{ columnName: string; searchQuery: string }[]` | Search filters |

---

## 3. Component Diagram

```text
ADMIN USER
  |
  +--> /me
  +--> /me/permissions
  +--> /me/dashboard-context
  |
  +--> Overview
  +--> Analytics
  +--> Users
  +--> Organizations
  +--> Post Review
  +--> Campaign Review
  +--> Reports
  +--> Notifications
  +--> Badges / Rewards
  +--> Articles
  +--> Categories
  +--> Audit Log
  +--> Platform Settings
```

**Entity relationships:**

| Entity | Related To | Relationship |
|---|---|---|
| Admin user | Audit log | one -> many |
| Admin user | Reports | one -> many as assignee |
| Admin user | Notifications | one -> many as creator |
| Organization | Users | one -> many (public users interacting with the platform) |
| Organization | Posts | one -> many |
| Organization | Campaigns | one -> many |
| Post | Review entry | one -> one |
| Campaign | Review entry | one -> one |
| Report | Timeline | one -> many |
| Report | Evidence | one -> many |
| Article | Admin author | many -> one |
| Category | Posts / Campaigns | one -> many |

---

## 4. Data Models & Endpoints

---

### 4.1 Bootstrap & Profile

The admin dashboard uses the authenticated session plus a bootstrap payload for navigation counters and permissions.

```ts
interface AdminProfileItem {
  id: string
  name: string
  email: string
  phone: string
  userType: 'admin'
  status: 'active' | 'inactive'
  createdAt: string
  lastActiveAt: string
}

interface AdminPermissionModule {
  name: string
  permissions: string[]
}

interface AdminPermissionsData {
  modules: AdminPermissionModule[]
  flat: Record<string, boolean>
  granted: string[]
}

interface AdminDashboardContext {
  profile: AdminProfileItem
  permissions: Record<string, boolean>
  counters: {
    unreadNotifications: number
    pendingReviews: number
    openReports: number
  }
}
```

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/me` | Current admin profile |
| `GET` | `/me/permissions` | Permission map and grouped module permissions |
| `GET` | `/me/dashboard-context` | Bootstrap payload for sidebar counters and permissions |

**Notes:**

- `userType` is the current backend field used by the dashboard bootstrap response.
- `platformRole` is used by the login response and routing logic, but `/me` should still return the profile payload above.
- The permissions list must include the dashboard, users, organizations, moderation, reports, notifications, badges, articles, analytics, audit logs, and platform settings capabilities.

---

### 4.2 Dashboard Overview

```ts
type AdminOverviewStatIcon = 'users' | 'building' | 'flag' | 'heart'

interface AdminOverviewStat {
  id: string
  label: string
  value: number
  subLabel: string
  icon: AdminOverviewStatIcon
}

interface AdminOverviewActivity {
  id: string
  title: string
  detail: string
  at: string
}

interface AdminOverviewData {
  stats: AdminOverviewStat[]
  activity: AdminOverviewActivity[]
}
```

**Endpoint:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin/overview` | KPI cards plus recent activity feed |

---

### 4.3 Analytics

The analytics page currently renders KPI cards and weekly trend rows.

```ts
interface AdminAnalyticsKpi {
  id: string
  label: string
  value: number | string
  changeVsLastMonth: string
}

interface AdminAnalyticsWeeklyRow {
  weekLabel: string
  visits: number
  newUsers: number
  donations: number
}

interface AdminAnalyticsKpisData {
  kpis: AdminAnalyticsKpi[]
}

interface AdminAnalyticsWeeklyData {
  rows: AdminAnalyticsWeeklyRow[]
}
```

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin/analytics/kpis` | KPI summary cards |
| `GET` | `/admin/analytics/weekly` | Weekly trend rows |

---

### 4.4 Users

The admin users screen manages public platform users, not the admin account itself.

```ts
type UserStatus = 'active' | 'inactive'
type UserRole = 'general' | 'volunteer' | 'job_seeker' | 'donor'

interface AdminUserItem {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  status: UserStatus
  postsCount: number
  reportsCount: number
  createdAt: string
  lastActiveAt: string
}

interface UserFormValues {
  name: string
  email: string
  phone: string
  role: UserRole
  status: UserStatus
}

interface UserPasswordChangeValues {
  newPassword: string
  confirmPassword: string
}
```

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin/users` | List users |
| `POST` | `/admin/users` | Create user |
| `GET` | `/admin/users/:userId` | Get one user |
| `PATCH` | `/admin/users/:userId` | Update user |
| `PATCH` | `/admin/users/:userId/status` | Toggle status |
| `PATCH` | `/admin/users/:userId/password` | Reset password |
| `DELETE` | `/admin/users/:userId` | Soft delete user |

**Notes:**

- The current frontend form does not collect a password when creating a user.
- If the backend still requires one, it should support an invite flow or server-generated temporary password.

---

### 4.5 Organizations

```ts
type OrganizationStatus = 'active' | 'inactive'
type OrganizationVerificationStatus = 'verified' | 'unverified'
type OrganizationType = 'association' | 'foundation' | 'initiative'

interface AdminOrganizationItem {
  id: string
  name: string
  email: string
  phone: string
  location: string
  verificationStatus: OrganizationVerificationStatus
  status: OrganizationStatus
  campaignsCount: number
  postsCount: number
  activeVolunteersCount: number
  activityScore: number
  createdAt: string
  lastActiveAt: string
  organizationType: OrganizationType
  registrationNumber: string
  establishmentDate: string
  shortAddress: string
  description: string
  licenseDocumentName: string
  delegationDocumentName: string
  ownerFullName: string
  ownerEmail: string
  ownerPhone: string
  website?: string
  socialMedia?: string
  acceptedAt?: string
}

interface OrganizationFormValues {
  name: string
  email: string
  phone: string
  location: string
  status: OrganizationStatus
  verificationStatus: OrganizationVerificationStatus
}
```

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin/organizations` | List organizations |
| `GET` | `/admin/organizations/:organizationId` | Organization detail view |
| `PATCH` | `/admin/organizations/:organizationId` | Update organization |
| `PATCH` | `/admin/organizations/:organizationId/status` | Change status |
| `PATCH` | `/admin/organizations/:organizationId/verification` | Change verification status |
| `POST` | `/admin/organizations/:organizationId/accept` | Accept organization |
| `DELETE` | `/admin/organizations/:organizationId` | Soft delete organization |

**Notes:**

- The detail screen expects the full organization profile, including registration data, owner contact details, documents, and `acceptedAt`.
- The current edit sheet only captures `name`, `email`, `phone`, `location`, `status`, and `verificationStatus`.

---

### 4.6 Post Review

```ts
type ModerationStatus = 'pending' | 'approved' | 'rejected'

type ReviewPostType =
  | 'help_request'
  | 'job_opportunity'
  | 'awareness'
  | 'campaign_update'

interface ReviewPostItem {
  id: string
  title: string
  summary: string
  organizationName: string
  authorName: string
  location: string
  submittedAt: string
  publishedAt: string
  status: ModerationStatus
  type: ReviewPostType
  reviewedBy?: string
  rejectionReason?: string
}

interface PostReviewApproveValues {
  note?: string
}

interface PostReviewRejectValues {
  reason: string
}
```

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin/review/posts` | Posts pending review |
| `GET` | `/admin/review/posts/:postId` | Post details |
| `POST` | `/admin/review/posts/:postId/approve` | Approve post |
| `POST` | `/admin/review/posts/:postId/reject` | Reject post |

---

### 4.7 Campaign Review

```ts
type ReviewCampaignCategory =
  | 'health'
  | 'education'
  | 'shelter'
  | 'food'
  | 'emergency'

interface ReviewCampaignItem {
  id: string
  title: string
  summary: string
  organizationName: string
  campaignManagerName: string
  location: string
  submittedAt: string
  startDate: string
  endDate: string
  status: ModerationStatus
  category: ReviewCampaignCategory
  goalAmount: number
  raisedAmount: number
  beneficiariesCount: number
  reviewedBy?: string
  rejectionReason?: string
}

interface CampaignReviewRejectValues {
  reason: string
}
```

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin/review/campaigns` | Campaigns pending review |
| `POST` | `/admin/review/campaigns/:campaignId/approve` | Approve campaign |
| `POST` | `/admin/review/campaigns/:campaignId/reject` | Reject campaign |

---

### 4.8 Reports

```ts
type ReportStatus = 'new' | 'in_progress' | 'waiting_response' | 'closed'
type ReportSeverity = 'low' | 'medium' | 'high' | 'critical'
type ReportEntityType = 'post' | 'campaign' | 'user' | 'organization'

interface ReportTimelineEntry {
  id: string
  action: string
  actor: string
  at: string
  note?: string
}

interface ReportEvidence {
  id: string
  label: string
  type: 'link' | 'image' | 'document'
  value: string
}

interface ReportItem {
  id: string
  title: string
  description: string
  status: ReportStatus
  severity: ReportSeverity
  entityType: ReportEntityType
  entityId: string
  organizationName: string
  reporterName: string
  createdAt: string
  assignee?: string
  timeline: ReportTimelineEntry[]
  evidence: ReportEvidence[]
}

interface ClaimReportValues {
  assigneeId: string
}

interface RequestReportInfoValues {
  note: string
}

interface CloseReportValues {
  note: string
}
```

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin/reports` | List reports |
| `GET` | `/admin/reports/:reportId` | Report details with timeline and evidence |
| `POST` | `/admin/reports/:reportId/claim` | Claim report |
| `POST` | `/admin/reports/:reportId/request-info` | Request more information |
| `POST` | `/admin/reports/:reportId/close` | Close report |

---

### 4.9 Notifications

```ts
type NotificationMailbox = 'inbox' | 'sent'
type NotificationStatus = 'unread' | 'read' | 'sent'
type NotificationCategory = 'campaign' | 'post' | 'account' | 'report' | 'system'
type NotificationRecipientScope = 'all' | 'users' | 'organizations'
type NotificationPriority = 'normal' | 'high'

interface AdminNotificationItem {
  id: string
  mailbox: NotificationMailbox
  title: string
  body: string
  category: NotificationCategory
  recipientScope: NotificationRecipientScope
  recipientLabel: string
  priority: NotificationPriority
  status: NotificationStatus
  createdAt: string
  sentAt: string
  readAt?: string
  referenceLabel: string
  referencePath: string
  createdBy: string
}

interface NotificationFormValues {
  title: string
  body: string
  category: NotificationCategory
  recipientScope: NotificationRecipientScope
  recipientLabel: string
  priority: NotificationPriority
}

interface NotificationReadStateValues {
  status: 'read' | 'unread'
}
```

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin/notifications` | List notifications |
| `POST` | `/admin/notifications` | Send broadcast notification |
| `PATCH` | `/admin/notifications/:id/read-state` | Update read state |
| `POST` | `/admin/notifications/:id/resend` | Resend notification |
| `DELETE` | `/admin/notifications/:id` | Delete notification |

**Notes:**

- `mailbox` separates the inbox view from sent notifications.
- `readAt` is optional and should only exist when the notification is read.

---

### 4.10 Rewards / Badges

```ts
type RewardIconName =
  | 'rewards'
  | 'donors'
  | 'verification'
  | 'campaigns'
  | 'reports'
  | 'goal'

type RewardStatus = 'active' | 'inactive'

interface BadgeItem {
  id: string
  name: string
  description: string
  criteria: string
  iconName: RewardIconName
  isActive: boolean
  createdAt: string
}

interface RewardFormValues {
  name: string
  description: string
  criteria: string
  iconName: RewardIconName
  isActive: boolean
}
```

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin/badges` | List badges |
| `POST` | `/admin/badges` | Create badge |
| `PATCH` | `/admin/badges/:badgeId` | Update badge |
| `PATCH` | `/admin/badges/:badgeId/status` | Activate / deactivate badge |
| `DELETE` | `/admin/badges/:badgeId` | Delete badge |

---

### 4.11 Content / Articles

```ts
type ArticleStatus = 'draft' | 'published'

interface ArticleItem {
  id: string
  title: string
  slug: string
  excerpt: string
  status: ArticleStatus
  publishedAt?: string
  createdAt: string
  authorName: string
}

interface ArticleFormValues {
  title: string
  slug: string
  excerpt: string
  authorName: string
  status: ArticleStatus
}
```

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin/articles` | List articles |
| `GET` | `/admin/articles/:articleId` | Article details |
| `POST` | `/admin/articles` | Create article |
| `PATCH` | `/admin/articles/:articleId` | Update article |
| `DELETE` | `/admin/articles/:articleId` | Delete article |

**Notes:**

- `publishedAt` is computed when `status` changes to `published`.
- The current frontend editor auto-generates `slug` when it is empty.

---

### 4.12 Categories

This section is inferred from the current admin category management screen.

```ts
type CategoryTarget = 'post' | 'campaign'
type CategoryStatus = 'active' | 'inactive'

interface AdminCategoryItem {
  id: string
  name: string
  target: CategoryTarget
  description: string
  usageCount: number
  status: CategoryStatus
  createdAt: string
  updatedAt: string
}

interface CategoryFormValues {
  name: string
  target: CategoryTarget
  description: string
  status: CategoryStatus
}
```

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin/categories` | List categories |
| `GET` | `/admin/categories/:categoryId` | Category details |
| `POST` | `/admin/categories` | Create category |
| `PATCH` | `/admin/categories/:categoryId` | Update category |
| `PATCH` | `/admin/categories/:categoryId/status` | Toggle active / inactive |
| `DELETE` | `/admin/categories/:categoryId` | Delete category |

**Notes:**

- `usageCount` is computed by the backend and must be treated as read-only.

---

### 4.13 Audit Log

```ts
type AuditLogActionType =
  | 'authentication'
  | 'moderation'
  | 'verification'
  | 'security'
  | 'content'

interface AuditLogEntry {
  id: string
  action: string
  user: string
  type: AuditLogActionType
  reference?: string
  at: string
}
```

**Endpoint:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin/audit-logs` | Paginated audit log entries |

**Notes:**

- The frontend currently renders the summary row set above.
- More detailed backend fields such as `entityType`, `entityId`, or `metadata` can be added, but they are not required by the current UI.

---

### 4.14 Platform Settings

```ts
interface PlatformSettingsDefaults {
  siteName: string
  allowNewPosts: boolean
  requirePostReview: boolean
  accountName: string
  accountEmail: string
  accountPhone: string
  recoveryEmail: string
  twoFactorEnabled: boolean
  bankName: string
  bankAccountNumber: string
  iban: string
}
```

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin/platform-settings` | Get current platform settings |
| `PATCH` | `/admin/platform-settings` | Update platform settings |

**Notes:**

- The current settings UI also shows password fields, but those are not part of the platform-settings payload.
- If password updates are needed, they should be handled by a dedicated auth/profile endpoint.

---

## 5. Enums Quick Reference

```ts
// Auth / profile
'admin'

// Users
'active' | 'inactive'
'general' | 'volunteer' | 'job_seeker' | 'donor'

// Organizations
'active' | 'inactive'
'verified' | 'unverified'
'association' | 'foundation' | 'initiative'

// Moderation
'pending' | 'approved' | 'rejected'
'help_request' | 'job_opportunity' | 'awareness' | 'campaign_update'
'health' | 'education' | 'shelter' | 'food' | 'emergency'

// Reports
'new' | 'in_progress' | 'waiting_response' | 'closed'
'low' | 'medium' | 'high' | 'critical'
'post' | 'campaign' | 'user' | 'organization'

// Notifications
'inbox' | 'sent'
'unread' | 'read' | 'sent'
'campaign' | 'post' | 'account' | 'report' | 'system'
'all' | 'users' | 'organizations'
'normal' | 'high'

// Rewards / badges
'rewards' | 'donors' | 'verification' | 'campaigns' | 'reports' | 'goal'
'active' | 'inactive'

// Content / categories
'draft' | 'published'
'post' | 'campaign'

// Audit log
'authentication' | 'moderation' | 'verification' | 'security' | 'content'
```

---

## 6. Field Notes

- `AdminUserItem.role` is the public user role, not the authenticated admin's platform role.
- `AdminOrganizationItem` is a full read model. The edit form only sends a smaller subset of fields.
- `raisedAmount`, `usageCount`, `postsCount`, `reportsCount`, and similar counters are computed server-side.
- `publishedAt`, `acceptedAt`, `readAt`, and `closedAt` are optional and should only appear when the record reaches that state.
- The frontend currently contains some admin pages that are still mock-driven. This contract defines the backend shape those pages should converge on.
- Where the frontend UI is narrower than the backend seed docs, the UI shape should win for the request payload, and the richer backend shape should be used for read responses.

