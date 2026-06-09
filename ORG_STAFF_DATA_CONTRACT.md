# Data Contract: Org-Staff Dashboard
**JOD Platform — Backend Specification**

---

## Overview

This document defines every data model, enum, and API endpoint the frontend expects for the **Org-Staff Dashboard**.
All data shapes are derived directly from the frontend TypeScript interfaces and component implementations.
Backend must match these exactly.

**Dashboard base route:** `/dashboard/org-staff`
**Role:** `org_staff`

> **Note:** Many sections below are shared with the Org-Owner dashboard. Where a section is shared, the endpoint path and response shape are identical — the backend only needs to scope the data by the authenticated user's organization.

---

## Table of Contents

1. [API Response Envelope](#1-api-response-envelope)
2. [Query Parameters](#2-query-parameters)
3. [Component Diagram](#3-component-diagram)
4. [Data Models & Endpoints](#4-data-models--endpoints)
   - [Dashboard Overview](#41-dashboard-overview)
   - [Campaigns](#42-campaigns)
   - [Donors & Applicants](#43-donors--applicants)
   - [Posts](#44-posts)
   - [Notifications](#45-notifications)
   - [Reports](#46-reports)
   - [Audit Log](#47-audit-log)
   - [Profile](#48-profile)
   - [Settings](#49-settings)
5. [Enums Quick Reference](#5-enums-quick-reference)
6. [Field Notes](#6-field-notes)
7. [Org-Staff vs Org-Owner — Difference Summary](#7-org-staff-vs-org-owner--difference-summary)

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
                        ┌──────────────────────┐
                        │    ORG STAFF MEMBER   │
                        │  (belongs to one org) │
                        └──────────┬───────────┘
                                   │ has access to (scoped by org)
          ┌─────────────┬──────────┼──────────┬─────────────┐
          │             │          │          │             │
          ▼             ▼          ▼          ▼             ▼
     ┌─────────┐  ┌─────────┐ ┌───────┐ ┌────────────┐ ┌────────┐
     │CAMPAIGN │  │  POST   │ │DONOR  │ │NOTIFICATION│ │REPORT  │
     │ (view/  │  │(manage) │ │/APPLI-│ │  (inbox +  │ │(read   │
     │ manage) │  │         │ │CANT   │ │   sent)    │ │ only)  │
     └────┬────┘  └────┬────┘ └───┬───┘ └────────────┘ └────────┘
          │             │          │
          │             └──────────┘
          │         (campaignTitle ref)
          └──────────────────────┐
                            (id) │
                                 ▼
                          ┌─────────────┐
                          │  AUDIT LOG  │  (system-generated, read-only)
                          └─────────────┘

                          ┌─────────────────────────┐
                          │   STAFF MEMBER PROFILE   │  (own profile only)
                          └─────────────────────────┘

NOTE: Org-Staff does NOT manage other staff members or roles.
      That is exclusively an Org-Owner capability.
```

**Entity Relationships:**

| Entity | Related To | Relationship |
|---|---|---|
| Org Staff Member | Organization | many → one (belongs to) |
| Org Staff Member | Campaign | many → many (access scoped by org) |
| Org Staff Member | Post | one → many (can author) |
| Org Staff Member | Notification | one → many (inbox + sent) |
| Org Staff Member | Audit Log (`user`) | one → many |
| Campaign | Donor / Applicant | one → many |
| Campaign | Post | one → many (soft ref via `campaignTitle`) |

---

## 4. Data Models & Endpoints

---

### 4.1 Dashboard Overview

Aggregated stats for the org-staff home page. **Different from org-owner** — stats reflect the staff member's own scope and activity categories include `tasks`.

**Models:**
```ts
interface OrgStaffOverviewStat {
  id:    'campaigns' | 'posts' | 'donors' | 'notifications'
  label: string
  value: number
  hint:  string
}

interface OrgStaffActivityItem {
  id:       string
  title:    string
  detail:   string
  category: 'campaigns' | 'posts' | 'donors' | 'reports' | 'tasks' | 'general'
  priority: 'high' | 'medium' | 'low'
  at:       string   // ISO 8601
}
```

**Stat IDs and their meaning for org-staff:**

| `id` | Meaning |
|---|---|
| `campaigns` | Active campaigns accessible to this staff member |
| `posts` | Posts the staff member is tracking or has authored |
| `donors` | Donor interactions (responses, messages) this month |
| `notifications` | Unread notifications |

**Endpoint:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/dashboard/overview` | Overview stats + recent activity for the authenticated staff member |

Response:
```ts
{
  stats:          OrgStaffOverviewStat[]
  recentActivity: OrgStaffActivityItem[]
}
```

---

### 4.2 Campaigns

**Shared with Org-Owner.** Org-staff can view and manage campaigns within their organization scope.

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

### 4.3 Donors & Applicants

**Shared with Org-Owner.** Same model for both — use `?view=donors` or `?view=applicants` to filter.

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

### 4.4 Posts

**Shared with Org-Owner.**

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

### 4.5 Notifications

**Shared with Org-Owner.**

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

### 4.6 Reports

**Shared with Org-Owner.** Reports are **read-only** — submitted externally, org-staff can only view and update status.

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

### 4.7 Audit Log

**Shared with Org-Owner.** System-generated and **fully read-only**. No create or edit endpoints needed.

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

### 4.8 Profile

The org-staff profile page displays the **individual staff member's** identity info (not the organization's). This is a **read + update** resource.

**Model:**
```ts
interface OrgStaffProfile {
  name:              string   // staff member's display name
  email:             string   // staff member's email
  showVerifiedBadge: boolean  // whether the staff member has a verified checkmark
  showOrgBadge:      boolean  // always false for staff members
}
```

> This is structurally the same shape as `OrgOwnerProfile` but semantically represents a **person**, not an organization. `showOrgBadge` will always be `false` for org-staff.

**Endpoints:**

| Method | Path | Description |
|---|---|---|
| `GET` | `/profile` | Get staff member profile |
| `PUT` | `/profile` | Update profile |

---

### 4.9 Settings

Account security and bank details for the org-staff member. Same structure as org-owner settings.

**Model:**
```ts
interface OrgStaffSettings {
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
| Notification mailbox | `inbox` · `sent` |
| Notification status | `unread` · `read` · `sent` |
| Notification category | `campaign` · `post` · `account` · `report` · `system` |
| Notification recipient scope | `all` · `users` · `organizations` |
| Notification priority | `normal` · `high` |
| Report status | `open` · `in_review` · `closed` |
| Report category | `content` · `harassment` · `fraud` · `other` |
| Audit log type | `authentication` · `moderation` · `verification` · `security` · `content` |
| Activity category (overview) | `campaigns` · `posts` · `donors` · `reports` · `tasks` · `general` |
| Activity priority (overview) | `high` · `medium` · `low` |

---

## 6. Field Notes

| Rule | Detail |
|---|---|
| **IDs** | All `id` fields are `string` — use UUIDs |
| **Dates** | All date/time fields are ISO 8601 strings, e.g. `"2025-06-07T10:30:00Z"`. The frontend handles display formatting |
| **Optional fields** | Fields marked `?` should be `null` or omitted when not applicable |
| **Computed fields** | `raisedAmount`, `donorsCount`, `applicantsCount`, `viewsCount`, `reactionsCount`, `applicationsCount` are backend-computed — never accepted as create/update input |
| **Donors vs Applicants** | Same table/endpoint — differentiate via a `type` column or separate tables, as long as the response shape matches `DonorEntryItem` |
| **Default pagination** | Suggest `perPage: 10` as default |
| **Data scoping** | All list endpoints must be scoped to the authenticated staff member's organization — a staff member must never see data from another organization |

---

## 7. Org-Staff vs Org-Owner — Difference Summary

| Feature | Org-Owner | Org-Staff |
|---|---|---|
| Dashboard overview stats | `campaigns · posts · donors · staff · notifications · reports` | `campaigns · posts · donors · notifications` |
| Activity categories | `campaigns · posts · donors · staff · reports · general` | `campaigns · posts · donors · reports · tasks · general` |
| Staff management (`/staff`) | Yes — full CRUD | **No** |
| Staff roles & permissions (`/staff/roles`) | Yes — full CRUD | **No** |
| Profile subject | Organization identity | Individual staff member |
| `showOrgBadge` in profile | `true` | `false` |
| Campaigns | Full access | Full access (scoped to org) |
| Posts | Full access | Full access (scoped to org) |
| Donors & Applicants | Full access | Full access (scoped to org) |
| Notifications | Full access | Full access (scoped to org) |
| Reports | View + status update | View + status update |
| Audit Log | Read-only | Read-only |
| Settings | Account + Security + Bank | Account + Security + Bank |
