# JOD Platform — Backend Contract (Org-Owner Dashboard)

This document defines the data models, enums, and entity relationships for the **Org-Owner Dashboard** module.
The frontend is built and ready. Backend should match these shapes exactly for API responses.

---

## Table of Contents

1. [API Response Format](#1-api-response-format)
2. [Query Parameters](#2-query-parameters)
3. [Data Models](#3-data-models)
   - [Campaign](#31-campaign)
   - [Donor / Applicant](#32-donor--applicant)
   - [Post](#33-post)
   - [Staff Member](#34-staff-member)
   - [Staff Role](#35-staff-role)
   - [Notification](#36-notification)
   - [Report](#37-report)
   - [Audit Log](#38-audit-log)
   - [Overview / Dashboard Stats](#39-overview--dashboard-stats)
4. [Enums Reference](#4-enums-reference)
5. [Entity Relationship Diagram](#5-entity-relationship-diagram)
6. [Notes](#6-notes)

---

## 1. API Response Format

All endpoints must wrap their response in this envelope:

```ts
interface ApiEnvelope<T> {
  statusCode: number
  message: string
  item: T
}
```

**Example — single item:**
```json
{
  "statusCode": 200,
  "message": "Campaign fetched successfully.",
  "item": { "id": "1", "title": "..." }
}
```

**Example — list:**
```json
{
  "statusCode": 200,
  "message": "Campaigns fetched successfully.",
  "item": {
    "data": [...],
    "total": 42,
    "page": 1,
    "perPage": 10
  }
}
```

**Error response:**
```ts
interface ApiError {
  type: string
  title: string
  status: number
  traceId: string
  code?: string
  detail?: string
  errors?: Record<string, string[]>
}
```

---

## 2. Query Parameters

All list endpoints accept these query parameters:

```ts
interface QueryParams {
  page?: number
  perPage?: number
  sortingField?: string
  sortingDir?: 'asc' | 'desc'
  searchQueries?: {
    columnName: string
    searchQuery: string
  }[]
}
```

---

## 3. Data Models

---

### 3.1 Campaign

```ts
type OrganizationCampaignStatus   = 'draft' | 'active' | 'closed'
type OrganizationCampaignCategory = 'health' | 'education' | 'food' | 'shelter' | 'employment'

interface OrganizationCampaignItem {
  id:                 string
  title:              string
  summary:            string
  category:           OrganizationCampaignCategory
  status:             OrganizationCampaignStatus
  location:           string
  goalAmount:         number
  raisedAmount:       number
  beneficiariesCount: number
  donorsCount:        number
  applicantsCount:    number
  startDate:          string   // ISO 8601 — e.g. "2025-01-01T00:00:00Z"
  endDate:            string
  createdAt:          string
  updatedAt:          string
  closedAt?:          string   // only when status = "closed"
  closedReason?:      string
}
```

**Create / Update payload (sent from frontend):**
```ts
interface CampaignFormValues {
  title:              string
  summary:            string
  category:           OrganizationCampaignCategory
  status:             OrganizationCampaignStatus
  location:           string
  goalAmount:         number
  beneficiariesCount: number
  startDate:          string   // date only — "YYYY-MM-DD"
  endDate:            string
}
```

**Endpoints needed:**
```
GET    /campaigns              → ApiEnvelope<{ data: OrganizationCampaignItem[], total, page, perPage }>
GET    /campaigns/:id          → ApiEnvelope<OrganizationCampaignItem>
POST   /campaigns              → ApiEnvelope<OrganizationCampaignItem>
PUT    /campaigns/:id          → ApiEnvelope<OrganizationCampaignItem>
DELETE /campaigns/:id          → ApiEnvelope<null>
PATCH  /campaigns/:id/status   → ApiEnvelope<OrganizationCampaignItem>   body: { status }
```

---

### 3.2 Donor / Applicant

The same model is used for both donors and applicants. The `view` query param controls which records to return.

```ts
interface DonorEntryItem {
  id:              string
  name:            string
  email:           string
  phone:           string
  campaignTitle:   string
  amountOrType:    string    // e.g. "500 ر.س" for donors, status string for applicants
  donatedAt:       string    // ISO 8601
  city?:           string
  source?:         string
  paymentMethod?:  string    // donors only
  campaignRef?:    string
  assignedTo?:     string
  internalNotes?:  string
  requestType?:    string    // applicants only
}
```

**Create / Update payload:**
```ts
interface DonorEntryFormValues {
  name:          string
  email:         string
  phone:         string
  campaignTitle: string
  amountOrType:  string
  donatedAt:     string
  city:          string
  source:        string
  paymentMethod: string
  requestType:   string
  assignedTo:    string
  internalNotes: string
}
```

**Endpoints needed:**
```
GET    /donors              ?view=donors|applicants   → ApiEnvelope<{ data: DonorEntryItem[], total, page, perPage }>
GET    /donors/:id                                    → ApiEnvelope<DonorEntryItem>
POST   /donors                                        → ApiEnvelope<DonorEntryItem>
PUT    /donors/:id                                    → ApiEnvelope<DonorEntryItem>
DELETE /donors/:id                                    → ApiEnvelope<null>
```

---

### 3.3 Post

```ts
type OrganizationPostStatus = 'draft' | 'published' | 'archived'
type OrganizationPostType   =
  | 'general'
  | 'job_opportunity'
  | 'campaign_teaser'
  | 'campaign_update'
  | 'campaign_summary'

interface OrganizationPostItem {
  id:                 string
  title:              string
  summary:            string
  type:               OrganizationPostType
  status:             OrganizationPostStatus
  authorName:         string
  location:           string
  campaignTitle?:     string   // only for campaign-related post types
  createdAt:          string
  updatedAt:          string
  publishedAt?:       string   // only when status = "published"
  viewsCount:         number
  reactionsCount:     number
  applicationsCount:  number
}
```

**Create / Update payload:**
```ts
interface PostFormValues {
  title:         string
  summary:       string
  type:          OrganizationPostType
  status:        OrganizationPostStatus
  authorName:    string
  location:      string
  campaignTitle: string
}
```

**Endpoints needed:**
```
GET    /posts              ?status=all|draft|published|archived   → ApiEnvelope<{ data: OrganizationPostItem[], total, page, perPage }>
GET    /posts/:id                                                  → ApiEnvelope<OrganizationPostItem>
POST   /posts                                                      → ApiEnvelope<OrganizationPostItem>
PUT    /posts/:id                                                  → ApiEnvelope<OrganizationPostItem>
DELETE /posts/:id                                                  → ApiEnvelope<null>
PATCH  /posts/:id/status                                           → ApiEnvelope<OrganizationPostItem>   body: { status }
```

---

### 3.4 Staff Member

```ts
type StaffRole = 'owner' | 'manager' | 'editor' | 'viewer'

interface StaffMemberItem {
  id:        string
  name:      string
  email:     string
  role:      StaffRole
  invitedAt: string   // ISO 8601
}
```

**Create / Update payload:**
```ts
interface StaffMemberFormValues {
  name:  string
  email: string
  role:  StaffRole
}
```

**Endpoints needed:**
```
GET    /staff              → ApiEnvelope<{ data: StaffMemberItem[], total, page, perPage }>
GET    /staff/:id          → ApiEnvelope<StaffMemberItem>
POST   /staff              → ApiEnvelope<StaffMemberItem>   (sends invite)
PUT    /staff/:id          → ApiEnvelope<StaffMemberItem>
DELETE /staff/:id          → ApiEnvelope<null>
```

---

### 3.5 Staff Role

```ts
interface StaffPermissionOption {
  id:          string
  label:       string
  description: string
}

interface StaffRoleItem {
  id:          string
  role:        StaffRole
  description: string
  permissions: string[]   // array of permission ids from the catalog below
  updatedAt:   string
  isActive:    boolean
  isSystem?:   boolean    // system roles cannot be deleted
}
```

**Permission catalog** (these are the valid permission `id` values):

| id | label |
|---|---|
| `campaigns-manage` | Manage Campaigns |
| `posts-manage` | Manage Posts |
| `donors-manage` | Manage Donors |
| `donors-view` | View Donors |
| `staff-manage` | Manage Staff |
| `notifications-manage` | Manage Notifications |
| `notifications-view` | View Notifications |
| `reports-view` | View Reports |
| `dashboard-view` | View Dashboard |
| `settings-manage` | Manage Settings |

**Create / Update payload:**
```ts
interface StaffRoleFormValues {
  role:        StaffRole
  description: string
  permissions: string[]
  isActive:    boolean
}
```

**Endpoints needed:**
```
GET    /staff/roles        → ApiEnvelope<{ data: StaffRoleItem[], total, page, perPage }>
GET    /staff/roles/:id    → ApiEnvelope<StaffRoleItem>
POST   /staff/roles        → ApiEnvelope<StaffRoleItem>
PUT    /staff/roles/:id    → ApiEnvelope<StaffRoleItem>
DELETE /staff/roles/:id    → ApiEnvelope<null>   (block if isSystem = true)
```

---

### 3.6 Notification

```ts
type NotificationMailbox        = 'inbox' | 'sent'
type NotificationStatus         = 'unread' | 'read' | 'sent'
type NotificationCategory       = 'campaign' | 'post' | 'account' | 'report' | 'system'
type NotificationRecipientScope = 'all' | 'users' | 'organizations'
type NotificationPriority       = 'normal' | 'high'

interface AdminNotificationItem {
  id:             string
  mailbox:        NotificationMailbox
  title:          string
  body:           string
  category:       NotificationCategory
  recipientScope: NotificationRecipientScope
  recipientLabel: string
  priority:       NotificationPriority
  status:         NotificationStatus
  createdAt:      string
  sentAt:         string
  readAt?:        string   // only when status = "read"
  referenceLabel: string
  referencePath:  string
  createdBy:      string   // staff member name or id
}
```

**Create payload:**
```ts
interface CreateNotificationValues {
  title:          string
  body:           string
  category:       NotificationCategory
  recipientScope: NotificationRecipientScope
  recipientLabel: string
}
```

**Endpoints needed:**
```
GET    /notifications              ?mailbox=inbox|sent   → ApiEnvelope<{ data: AdminNotificationItem[], total, page, perPage }>
GET    /notifications/:id                                → ApiEnvelope<AdminNotificationItem>
POST   /notifications                                    → ApiEnvelope<AdminNotificationItem>
PATCH  /notifications/:id/read                           → ApiEnvelope<AdminNotificationItem>
DELETE /notifications/:id                                → ApiEnvelope<null>
```

---

### 3.7 Report

Reports are **read-only** from the org-owner's perspective (submitted externally).

```ts
type OrgReportStatus   = 'open' | 'in_review' | 'closed'
type OrgReportCategory = 'content' | 'harassment' | 'fraud' | 'other'

interface OrgReportItem {
  id:            string
  subject:       string
  summary:       string
  category:      OrgReportCategory
  status:        OrgReportStatus
  submittedAt:   string   // ISO 8601
  reporterLabel: string
}
```

**Endpoints needed:**
```
GET    /reports        ?status=open|in_review|closed   → ApiEnvelope<{ data: OrgReportItem[], total, page, perPage }>
GET    /reports/:id                                    → ApiEnvelope<OrgReportItem>
PATCH  /reports/:id/status                             → ApiEnvelope<OrgReportItem>   body: { status }
```

---

### 3.8 Audit Log

Audit logs are **system-generated and read-only**. No create/edit endpoints needed.

```ts
type AuditLogActionType =
  | 'authentication'
  | 'moderation'
  | 'verification'
  | 'security'
  | 'content'

interface AuditLogEntry {
  id:         string
  action:     string    // human-readable description, e.g. "User login"
  user:       string    // actor name or id
  type:       AuditLogActionType
  reference?: string    // optional related entity id or label
  at:         string    // ISO 8601
}
```

**Dashboard also needs summary stats:**
```ts
interface AuditLogSummary {
  totalEntries:    number
  totalUsers:      number
  recentEntries:   number   // entries in last 24h
  latestTimestamp: string
}
```

**Endpoints needed:**
```
GET /audit-log            → ApiEnvelope<{ data: AuditLogEntry[], total, page, perPage, summary: AuditLogSummary }>
GET /audit-log/:id        → ApiEnvelope<AuditLogEntry>
```

---

### 3.9 Overview / Dashboard Stats

The org-owner home page needs aggregated statistics.

```ts
interface OrgOwnerOverviewStat {
  id:    'campaigns' | 'posts' | 'donors' | 'staff' | 'notifications' | 'reports'
  label: string
  value: number
  hint:  string
}

interface OrgOwnerActivityItem {
  id:       string
  title:    string
  detail:   string
  category: 'campaigns' | 'posts' | 'donors' | 'staff' | 'reports' | 'general'
  priority: 'high' | 'medium' | 'low'
  at:       string   // ISO 8601
}
```

**Endpoint needed:**
```
GET /dashboard/overview   → ApiEnvelope<{ stats: OrgOwnerOverviewStat[], recentActivity: OrgOwnerActivityItem[] }>
```

---

## 4. Enums Reference

Quick lookup for all string literal unions used across the system:

| Enum | Values |
|---|---|
| `OrganizationCampaignStatus` | `draft` · `active` · `closed` |
| `OrganizationCampaignCategory` | `health` · `education` · `food` · `shelter` · `employment` |
| `OrganizationPostStatus` | `draft` · `published` · `archived` |
| `OrganizationPostType` | `general` · `job_opportunity` · `campaign_teaser` · `campaign_update` · `campaign_summary` |
| `StaffRole` | `owner` · `manager` · `editor` · `viewer` |
| `NotificationMailbox` | `inbox` · `sent` |
| `NotificationStatus` | `unread` · `read` · `sent` |
| `NotificationCategory` | `campaign` · `post` · `account` · `report` · `system` |
| `NotificationRecipientScope` | `all` · `users` · `organizations` |
| `NotificationPriority` | `normal` · `high` |
| `OrgReportStatus` | `open` · `in_review` · `closed` |
| `OrgReportCategory` | `content` · `harassment` · `fraud` · `other` |
| `AuditLogActionType` | `authentication` · `moderation` · `verification` · `security` · `content` |

---

## 5. Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          ORGANIZATION                               │
│  (the top-level owner entity — org-owner belongs to one org)        │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ owns
          ┌────────────────────┼──────────────────────┐
          │                    │                       │
          ▼                    ▼                       ▼
   ┌─────────────┐     ┌──────────────┐      ┌──────────────┐
   │  CAMPAIGN   │     │    POST      │      │    STAFF     │
   │─────────────│     │──────────────│      │──────────────│
   │ id          │◄────│ campaignTitle│      │ id           │
   │ title       │     │ type         │      │ name         │
   │ status      │     │ status       │      │ email        │
   │ category    │     │ authorName   │      │ role ────────┼──► STAFF ROLE
   │ goalAmount  │     │ location     │      │ invitedAt    │    │ permissions[]
   │ raisedAmount│     │ viewsCount   │      └──────────────┘    │ isActive
   │ startDate   │     │ publishedAt? │                          └──────────────
   │ endDate     │     └──────────────┘
   └──────┬──────┘
          │ referenced by
          ▼
   ┌─────────────────┐
   │  DONOR /        │
   │  APPLICANT      │
   │─────────────────│
   │ id              │
   │ name            │
   │ email           │
   │ campaignTitle   │  (soft reference to Campaign.title)
   │ amountOrType    │
   │ paymentMethod?  │  ← donors only
   │ requestType?    │  ← applicants only
   │ assignedTo?     │
   └─────────────────┘

   ┌──────────────────────┐     ┌─────────────────┐
   │    NOTIFICATION      │     │     REPORT      │
   │──────────────────────│     │─────────────────│
   │ id                   │     │ id              │
   │ mailbox (inbox/sent) │     │ subject         │
   │ title                │     │ category        │
   │ category             │     │ status          │
   │ recipientScope       │     │ reporterLabel   │
   │ priority             │     │ submittedAt     │
   │ status               │     └─────────────────┘
   │ createdBy ───────────┼──► Staff Member
   └──────────────────────┘

   ┌──────────────────────┐
   │     AUDIT LOG        │
   │──────────────────────│
   │ id                   │
   │ action               │  (system-generated, read-only)
   │ user ────────────────┼──► Staff Member / any user
   │ type                 │
   │ reference?           │
   │ at                   │
   └──────────────────────┘
```

**Relationship summary:**

| From | To | Type |
|---|---|---|
| Organization | Campaign | one-to-many |
| Organization | Post | one-to-many |
| Organization | Staff Member | one-to-many |
| Staff Member | Staff Role | many-to-one |
| Campaign | Donor / Applicant | one-to-many |
| Campaign | Post | one-to-many (soft, via campaignTitle) |
| Staff Member | Notification | one-to-many (createdBy) |
| Staff Member | Audit Log | one-to-many (actor) |

---

## 6. Notes

- All `id` fields are strings — use UUIDs on the backend.
- All date/time fields are **ISO 8601 strings** (e.g. `"2025-06-07T10:30:00Z"`). The frontend handles formatting.
- Fields marked with `?` are optional — return `null` or omit them when not applicable.
- `raisedAmount`, `donorsCount`, `applicantsCount`, `viewsCount`, `reactionsCount`, `applicationsCount` are **computed fields** — the backend should calculate and return them, not accept them as input.
- `isSystem: true` on a StaffRoleItem means the role is built-in and must not be deleted.
- The `view` query param on `/donors` (`donors` or `applicants`) filters by the type of entry — backend can use a single table with a `type` column or separate tables, as long as the response shape matches `DonorEntryItem`.
- Pagination is expected on all list endpoints. Default `perPage` suggestion: `10`.
