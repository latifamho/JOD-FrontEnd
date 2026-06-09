# Data Contract: Org-Owner Dashboard
**JOD Platform — Backend Specification**

---

## Overview

This document defines every data model, enum, and API endpoint the frontend expects for the **Org-Owner Dashboard**.
All data shapes are derived directly from the frontend TypeScript interfaces.
Backend must match these exactly.

**Dashboard base route:** `/dashboard/org-owner`
**Role:** `org_owner`

---

## Table of Contents

1. [API Response Envelope](#1-api-response-envelope)
2. [Query Parameters](#2-query-parameters)
3. [Component Diagram](#3-component-diagram)
4. [Data Models & Endpoints](#4-data-models--endpoints)
   - [Campaigns](#41-campaigns)
   - [Donors & Applicants](#42-donors--applicants)
   - [Posts](#43-posts)
   - [Staff Members](#44-staff-members)
   - [Staff Roles & Permissions](#45-staff-roles--permissions)
   - [Notifications](#46-notifications)
   - [Reports](#47-reports)
   - [Audit Log](#48-audit-log)
   - [Dashboard Overview](#49-dashboard-overview)
   - [Profile](#410-profile)
   - [Settings](#411-settings)
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
| `page` | `number` | Page number (default: 1) |
| `perPage` | `number` | Items per page (default: 10) |
| `sortingField` | `string` | Field name to sort by |
| `sortingDir` | `'asc' \| 'desc'` | Sort direction |
| `searchQueries` | `{ columnName: string; searchQuery: string }[]` | Search filters |

---

## 3. Component Diagram

```
                        ┌─────────────────────┐
                        │    ORGANIZATION      │
                        └──────────┬──────────┘
                                   │ owns
          ┌─────────────┬──────────┼──────────┬─────────────┐
          │             │          │          │             │
          ▼             ▼          ▼          ▼             ▼
     ┌─────────┐  ┌─────────┐ ┌───────┐ ┌────────┐ ┌────────────┐
     │CAMPAIGN │  │  POST   │ │DONOR  │ │ STAFF  │ │NOTIFICATION│
     └────┬────┘  └────┬────┘ │/APPLI-│ └───┬────┘ └────────────┘
          │             │      │CANT   │     │
          │             │      └───┬───┘     │
          │             │          │         ▼
          │             └──────────┘    ┌──────────┐
          │         (campaignTitle ref) │STAFF ROLE│
          └─────────────────────────┐   │(permissions[])
                               (id) │   └──────────┘
                                    ▼
                             ┌─────────────┐
                             │  AUDIT LOG  │  (system-generated, read-only)
                             └─────────────┘

                             ┌─────────────┐
                             │   REPORT    │  (submitted externally, read-only)
                             └─────────────┘
```

**Entity Relationships:**

| Entity | Related To | Relationship |
|---|---|---|
| Organization | Campaign | one → many |
| Organization | Post | one → many |
| Organization | Staff Member | one → many |
| Organization | Notification | one → many |
| Campaign | Donor / Applicant | one → many |
| Campaign | Post | one → many (soft ref via `campaignTitle`) |
| Staff Member | Staff Role | many → one |
| Staff Role | Permissions | one → many |
| Staff Member | Notification (`createdBy`) | one → many |
| Staff Member | Audit Log (`user`) | one → many |

---

## 4. Data Models & Endpoints

---

### 4.1 Campaigns

**Model:**
```ts
interface OrganizationCampaignItem {
  id:                 string
  title:              string
  summary:            string
  category:           'health' | 'education' | 'food' | 'shelter' | 'employment'
  status:             'draft' | 'active' | 'closed'
  location:           string
  goalAmount:         number
  raisedAmount:       number   // computed — do not accept as input
  beneficiariesCount: number
  donorsCount:        number   // computed — do not accept as input
  applicantsCount:    number   // computed — do not accept as input
  startDate:          string   // ISO 8601
  endDate:            string   // ISO 8601
  createdAt:          string   // ISO 8601
  updatedAt:          string   // ISO 8601
  closedAt?:          string   // ISO 8601 — only when status = "closed"
  closedReason?:      string   // only when status = "closed"
}
```

**Create / Update body:**
```ts
interface CampaignFormValues {
  title:              string
  summary:            string
  category:           'health' | 'education' | 'food' | 'shelter' | 'employment'
  status:             'draft' | 'active' | 'closed'
  location:           string
  goalAmount:         number
  beneficiariesCount: number
  startDate:          string   // date only: "YYYY-MM-DD"
  endDate:            string
}
```

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/campaigns` | List all campaigns (supports `?status=all\|draft\|active\|closed`) |
| `GET` | `/campaigns/:id` | Get single campaign |
| `POST` | `/campaigns` | Create campaign |
| `PUT` | `/campaigns/:id` | Update campaign |
| `DELETE` | `/campaigns/:id` | Delete campaign |
| `PATCH` | `/campaigns/:id/status` | Update status only — body: `{ status }` |

---

### 4.2 Donors & Applicants

Same model for both — use `?view=donors` or `?view=applicants` to filter.

**Model:**
```ts
interface DonorEntryItem {
  id:             string
  name:           string
  email:          string
  phone:          string
  campaignTitle:  string   // soft ref to campaign
  amountOrType:   string   // "500 ر.س" for donors — status string for applicants
  donatedAt:      string   // ISO 8601
  city?:          string
  source?:        string
  paymentMethod?: string   // donors only
  campaignRef?:   string
  assignedTo?:    string
  internalNotes?: string
  requestType?:   string   // applicants only
}
```

**Create / Update body:**
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

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/donors?view=donors\|applicants` | List donors or applicants |
| `GET` | `/donors/:id` | Get single entry |
| `POST` | `/donors` | Create entry |
| `PUT` | `/donors/:id` | Update entry |
| `DELETE` | `/donors/:id` | Delete entry |

---

### 4.3 Posts

**Model:**
```ts
interface OrganizationPostItem {
  id:                string
  title:             string
  summary:           string
  type:              'general' | 'job_opportunity' | 'campaign_teaser' | 'campaign_update' | 'campaign_summary'
  status:            'draft' | 'published' | 'archived'
  authorName:        string
  location:          string
  campaignTitle?:    string   // only for campaign-related post types
  createdAt:         string   // ISO 8601
  updatedAt:         string   // ISO 8601
  publishedAt?:      string   // ISO 8601 — only when status = "published"
  viewsCount:        number   // computed
  reactionsCount:    number   // computed
  applicationsCount: number   // computed
}
```

**Create / Update body:**
```ts
interface PostFormValues {
  title:         string
  summary:       string
  type:          'general' | 'job_opportunity' | 'campaign_teaser' | 'campaign_update' | 'campaign_summary'
  status:        'draft' | 'published' | 'archived'
  authorName:    string
  location:      string
  campaignTitle: string
}
```

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/posts?status=all\|draft\|published\|archived` | List posts by status |
| `GET` | `/posts/:id` | Get single post |
| `POST` | `/posts` | Create post |
| `PUT` | `/posts/:id` | Update post |
| `DELETE` | `/posts/:id` | Delete post |
| `PATCH` | `/posts/:id/status` | Update status only — body: `{ status }` |

---

### 4.4 Staff Members

**Model:**
```ts
interface StaffMemberItem {
  id:        string
  name:      string
  email:     string
  role:      'owner' | 'manager' | 'editor' | 'viewer'
  invitedAt: string   // ISO 8601
}
```

**Create / Update body:**
```ts
interface StaffMemberFormValues {
  name:  string
  email: string
  role:  'owner' | 'manager' | 'editor' | 'viewer'
}
```

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/staff` | List all staff members |
| `GET` | `/staff/:id` | Get single staff member |
| `POST` | `/staff` | Invite staff member |
| `PUT` | `/staff/:id` | Update staff member |
| `DELETE` | `/staff/:id` | Remove staff member |

---

### 4.5 Staff Roles & Permissions

**Permission Catalog** — these are the only valid permission `id` values:

| Permission ID | Label |
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

**Role Model:**
```ts
interface StaffRoleItem {
  id:          string
  role:        'owner' | 'manager' | 'editor' | 'viewer'
  description: string
  permissions: string[]   // array of permission ids from catalog above
  updatedAt:   string     // ISO 8601
  isActive:    boolean
  isSystem?:   boolean    // if true — cannot be deleted
}
```

**Create / Update body:**
```ts
interface StaffRoleFormValues {
  role:        'owner' | 'manager' | 'editor' | 'viewer'
  description: string
  permissions: string[]
  isActive:    boolean
}
```

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/staff/roles` | List all roles |
| `GET` | `/staff/roles/:id` | Get single role |
| `POST` | `/staff/roles` | Create role |
| `PUT` | `/staff/roles/:id` | Update role |
| `DELETE` | `/staff/roles/:id` | Delete role (block if `isSystem = true`) |

---

### 4.6 Notifications

**Model:**
```ts
interface AdminNotificationItem {
  id:             string
  mailbox:        'inbox' | 'sent'
  title:          string
  body:           string
  category:       'campaign' | 'post' | 'account' | 'report' | 'system'
  recipientScope: 'all' | 'users' | 'organizations'
  recipientLabel: string
  priority:       'normal' | 'high'
  status:         'unread' | 'read' | 'sent'
  createdAt:      string   // ISO 8601
  sentAt:         string   // ISO 8601
  readAt?:        string   // ISO 8601 — only when status = "read"
  referenceLabel: string
  referencePath:  string
  createdBy:      string   // staff member name or id
}
```

**Create body:**
```ts
interface CreateNotificationValues {
  title:          string
  body:           string
  category:       'campaign' | 'post' | 'account' | 'report' | 'system'
  recipientScope: 'all' | 'users' | 'organizations'
  recipientLabel: string
}
```

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/notifications?mailbox=inbox\|sent` | List notifications by mailbox |
| `GET` | `/notifications/:id` | Get single notification |
| `POST` | `/notifications` | Send notification |
| `PATCH` | `/notifications/:id/read` | Mark as read |
| `DELETE` | `/notifications/:id` | Delete notification |

---

### 4.7 Reports

Reports are **read-only** — submitted externally, org-owner can only view and update status.

**Model:**
```ts
interface OrgReportItem {
  id:            string
  subject:       string
  summary:       string
  category:      'content' | 'harassment' | 'fraud' | 'other'
  status:        'open' | 'in_review' | 'closed'
  submittedAt:   string   // ISO 8601
  reporterLabel: string
}
```

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/reports?status=open\|in_review\|closed` | List reports |
| `GET` | `/reports/:id` | Get single report |
| `PATCH` | `/reports/:id/status` | Update status — body: `{ status }` |

---

### 4.8 Audit Log

System-generated and **fully read-only**. No create or edit endpoints needed.

**Model:**
```ts
interface AuditLogEntry {
  id:         string
  action:     string   // human-readable, e.g. "User logged in"
  user:       string   // actor name or id
  type:       'authentication' | 'moderation' | 'verification' | 'security' | 'content'
  reference?: string   // optional related entity id or label
  at:         string   // ISO 8601
}
```

**Summary stats** (needed by the page header):
```ts
interface AuditLogSummary {
  totalEntries:    number
  totalUsers:      number
  recentEntries:   number   // entries in last 24h
  latestTimestamp: string   // ISO 8601
}
```

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/audit-log` | List entries + summary stats |
| `GET` | `/audit-log/:id` | Get single entry |

Response for list:
```ts
{
  data:    AuditLogEntry[]
  total:   number
  page:    number
  perPage: number
  summary: AuditLogSummary
}
```

---

### 4.9 Dashboard Overview

Aggregated stats for the org-owner home page.

**Models:**
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

**Endpoint:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/dashboard/overview` | Overview stats + recent activity |

Response:
```ts
{
  stats:          OrgOwnerOverviewStat[]
  recentActivity: OrgOwnerActivityItem[]
}
```

---

### 4.10 Profile

The org-owner profile page displays organization identity info. This is a **read + update** resource.

**Model:**
```ts
interface OrgOwnerProfile {
  name:               string   // organization display name
  email:              string   // organization contact email
  showVerifiedBadge:  boolean  // whether the org has a verified checkmark
  showOrgBadge:       boolean  // whether to show the organization badge
}
```

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/profile` | Get org-owner profile |
| `PUT` | `/profile` | Update profile |

---

### 4.11 Settings

Account security and bank details for the org-owner. Split into logical groups.

**Model:**
```ts
interface OrgOwnerSettings {
  // Account
  accountName:       string
  accountEmail:      string
  accountPhone:      string
  recoveryEmail:     string
  twoFactorEnabled:  boolean

  // Bank
  bankName:          string
  bankAccountNumber: string
  iban:              string
}
```

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/settings` | Get current settings |
| `PUT` | `/settings/account` | Update account info — body: `{ accountName, accountEmail, accountPhone, recoveryEmail }` |
| `PATCH` | `/settings/security` | Toggle 2FA — body: `{ twoFactorEnabled }` |
| `PUT` | `/settings/bank` | Update bank details — body: `{ bankName, bankAccountNumber, iban }` |

---

## 5. Enums Quick Reference

| Enum | Values |
|---|---|
| Campaign status | `draft` · `active` · `closed` |
| Campaign category | `health` · `education` · `food` · `shelter` · `employment` |
| Post status | `draft` · `published` · `archived` |
| Post type | `general` · `job_opportunity` · `campaign_teaser` · `campaign_update` · `campaign_summary` |
| Staff role | `owner` · `manager` · `editor` · `viewer` |
| Notification mailbox | `inbox` · `sent` |
| Notification status | `unread` · `read` · `sent` |
| Notification category | `campaign` · `post` · `account` · `report` · `system` |
| Notification recipient scope | `all` · `users` · `organizations` |
| Notification priority | `normal` · `high` |
| Report status | `open` · `in_review` · `closed` |
| Report category | `content` · `harassment` · `fraud` · `other` |
| Audit log type | `authentication` · `moderation` · `verification` · `security` · `content` |

---

## 6. Field Notes

| Rule | Detail |
|---|---|
| **IDs** | All `id` fields are `string` — use UUIDs |
| **Dates** | All date/time fields are ISO 8601 strings, e.g. `"2025-06-07T10:30:00Z"`. The frontend handles display formatting |
| **Optional fields** | Fields marked `?` should be `null` or omitted when not applicable |
| **Computed fields** | `raisedAmount`, `donorsCount`, `applicantsCount`, `viewsCount`, `reactionsCount`, `applicationsCount` are backend-computed — never accepted as create/update input |
| **System roles** | `StaffRoleItem.isSystem = true` means the role is built-in and must not be deleted |
| **Donors vs Applicants** | Same table/endpoint — differentiate via a `type` column or separate tables, as long as the response shape matches `DonorEntryItem` |
| **Default pagination** | Suggest `perPage: 10` as default |
