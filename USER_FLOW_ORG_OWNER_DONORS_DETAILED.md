# User Flow: Org-Owner Donors & Applicants Management

## Overview

The org-owner donors and applicants section allows organization owners to record, view, edit, and delete donor entries and applicant entries linked to their campaigns and opportunities. The section is split into two separate views — **Donors** and **Applicants** — each accessed via its own route but powered by the same shared component (`DonorsManagementPage`). There are no status workflows; the `Amount / Type` field for donors and the `Status` field for applicants are free-text values managed directly in the form.

**Route base:** `/dashboard/org-owner/donors`

---

## Entry Types

| View       | ID Prefix | Description                                                             |
|------------|-----------|-------------------------------------------------------------------------|
| Donors     | `DNR-XXX` | People or organizations who made a financial or in-kind donation        |
| Applicants | `APP-XXX` | People who applied to volunteer, participate in, or receive aid from a campaign |

---

## View-Specific Field Differences

| Field          | Donors View                       | Applicants View              |
|----------------|-----------------------------------|------------------------------|
| Person column  | Donor (name + email)              | Applicant (name + email)     |
| Amount column  | Amount / Type (e.g., "500 SAR")   | Status (e.g., "Under Review") |
| Date column    | Donation Date                     | Application Date              |
| City filter    | Shown (filter by city)            | Hidden                        |
| Status filter  | Hidden                            | Shown (filter by status text) |
| Payment Method | Shown in form (optional)          | Hidden in form                |
| Request Type   | Hidden in form                    | Shown in form (optional)      |

---

## Entry Points

| Entry Point                                  | Route                                     | Active View |
|----------------------------------------------|-------------------------------------------|-------------|
| Org-Owner sidebar → Donors                   | `/dashboard/org-owner/donors`             | Donors      |
| Org-Owner sidebar → Applicants               | `/dashboard/org-owner/donors/applicants`  | Applicants  |

> Switching routes resets all filter, sort, and page state to defaults.

---

## API Endpoints Reference

| Action                          | Method | Endpoint                     |
|---------------------------------|--------|------------------------------|
| List donors (filter/sort/page)  | GET    | `/api/org/donors`            |
| Get single donor (edit prefetch)| GET    | `/api/org/donors/:id`        |
| Create donor                    | POST   | `/api/org/donors`            |
| Update donor                    | PATCH  | `/api/org/donors/:id`        |
| Delete donor                    | DELETE | `/api/org/donors/:id`        |
| List applicants (filter/sort/page)| GET  | `/api/org/applicants`        |
| Get single applicant (edit prefetch)| GET | `/api/org/applicants/:id`   |
| Create applicant                | POST   | `/api/org/applicants`        |
| Update applicant                | PATCH  | `/api/org/applicants/:id`   |
| Delete applicant                | DELETE | `/api/org/applicants/:id`   |

> All list requests include query parameters: `?page=N&pageSize=X&campaign=Y&city=Z&sortBy=W&order=asc|desc`
> Campaign and city/status filter options are derived from the API response metadata.

---

## Global Error Types

| HTTP Status | Meaning             | Behavior                                                    |
|-------------|---------------------|-------------------------------------------------------------|
| 400         | Bad request         | Show inline field errors or error toast                     |
| 401         | Unauthenticated     | Redirect to `/login`                                        |
| 403         | Forbidden           | Show "Access Denied" toast; no redirect                     |
| 404         | Not found           | Show "Entry not found" toast; refresh list                  |
| 409         | Conflict            | Show conflict message in toast                              |
| 422         | Validation error    | Show field-level validation messages in form                |
| 500         | Server error        | Show generic "Something went wrong" error toast             |
| Network     | No response         | Show "Network error, please try again" toast                |

---

## Screen 1: Donors List Page — Initial Load

### Loading State

```
User navigates to /dashboard/org-owner/donors
              |
              v
  [DonorsManagementPage mounts — view="donors"]
              |
              v
  GET /api/org/donors?page=1&pageSize=10&sortBy=donated_at&order=desc
              |
              v
  ┌──────────────────────────────────────────────────────────┐
  │  Donors Management                  [+ Add Donor]        │
  │  [Campaign ▼]  [City ▼]  [Sort ▼]                        │
  │  ┌──────────────────────────────────────────────────┐   │
  │  │   Table skeleton (animated rows)                │   │
  │  └──────────────────────────────────────────────────┘   │
  │  [Pagination skeleton]                                   │
  └──────────────────────────────────────────────────────────┘
```

### Error State

```
GET /api/org/donors → 500 / Network Error
              |
              v
  ┌──────────────────────────────────────────────────────────┐
  │  Donors Management                  [+ Add Donor]        │
  │                                                          │
  │      ⚠  Failed to load donors.                          │
  │         [Retry]                                          │
  └──────────────────────────────────────────────────────────┘

  User clicks [Retry]
              |
              v
  Re-fires GET /api/org/donors (same params)
```

### Success State — Donors View Layout

```
  ┌──────────────────────────────────────────────────────────────────┐
  │  Donors Management                           [+ Add Donor]       │
  │  Manage donor records linked to campaigns. Results: 38           │
  ├──────────────────────────────────────────────────────────────────┤
  │  [Campaign ▼]  [City ▼]  [Sort ▼]                                │
  ├────────────────┬────────────────┬────────────┬────────┬──────────┤
  │  Donor         │  Campaign      │ Amount/Type│  Date  │ Actions  │
  │  name + email  │                │            │        │ Edit/Del │
  ├────────────────┼────────────────┼────────────┼────────┼──────────┤
  │  ...rows       │                │            │        │          │
  ├────────────────┴────────────────┴────────────┴────────┴──────────┤
  │  [10 ▼]  < 1  2  3 ... >           Showing 1–10 of 38 donors    │
  └──────────────────────────────────────────────────────────────────┘
```

### Success State — Applicants View Layout

```
  ┌──────────────────────────────────────────────────────────────────┐
  │  Applicants Management                    [+ Add Applicant]      │
  │  Manage applicant records linked to campaigns. Results: 12       │
  ├──────────────────────────────────────────────────────────────────┤
  │  [Campaign ▼]  [Status ▼]  [Sort ▼]                              │
  ├────────────────┬────────────────┬────────────┬────────┬──────────┤
  │  Applicant     │  Campaign      │   Status   │  Date  │ Actions  │
  │  name + email  │                │            │        │ Edit/Del │
  ├────────────────┼────────────────┼────────────┼────────┼──────────┤
  │  ...rows       │                │            │        │          │
  ├────────────────┴────────────────┴────────────┴────────┴──────────┤
  │  [10 ▼]  < 1  2  3 ... >         Showing 1–12 of 12 applicants  │
  └──────────────────────────────────────────────────────────────────┘
```

---

## Views

| View       | Route                                    | API Endpoint          |
|------------|------------------------------------------|-----------------------|
| Donors     | `/dashboard/org-owner/donors`            | `GET /api/org/donors` |
| Applicants | `/dashboard/org-owner/donors/applicants` | `GET /api/org/applicants` |

```
User clicks sidebar nav item for Donors or Applicants
              |
              v
Navigate to view route
              |
              v
All filters, sort, and page reset to defaults
              |
              v
GET /api/org/{donors|applicants}?page=1&pageSize=10&sortBy=donated_at&order=desc
              |
              v
Table updates with view-specific columns and data
```

---

## Filter & Sort Flow

> All filtering and sorting is **server-side**. Each change triggers a new API request.

### Donors View — Available Controls

| Control         | Source                                    | Notes                              |
|-----------------|-------------------------------------------|------------------------------------|
| Campaign filter | Dynamic — unique campaign titles from API | Applied to both views              |
| City filter     | Dynamic — unique city values from API     | Donors view only                   |
| Sort            | Static options (see table below)          | Applied to both views              |

### Applicants View — Available Controls

| Control          | Source                                    | Notes                              |
|------------------|-------------------------------------------|------------------------------------|
| Campaign filter  | Dynamic — unique campaign titles from API | Applied to both views              |
| Status filter    | Dynamic — unique status values from API   | Applicants view only (amountOrType)|
| Sort             | Static options (see table below)          | Applied to both views              |

### Sort Parameter Mapping

| UI Label         | `sortBy`     | `order` |
|------------------|--------------|---------|
| Newest Date      | `donated_at` | `desc`  |
| Oldest Date      | `donated_at` | `asc`   |
| Name A–Z         | `name`       | `asc`   |
| Name Z–A         | `name`       | `desc`  |

### Filter & Sort Flow Diagram

```
User changes Campaign, City/Status filter, or Sort dropdown
              |
              v
  UI stores new filter/sort values
              |
              v
  Reset page to 1
              |
              v
  GET /api/org/{donors|applicants}
    &campaign=<selected or omit for all>
    &city=<selected or omit>         (donors only)
    &status=<selected or omit>       (applicants only)
    &sortBy=<field>
    &order=<asc|desc>
    &page=1
    &pageSize=<current>
              |
       ┌──────┴──────┐
       ▼             ▼
   Success         Error
       |             |
       v             v
  Table updates   Error toast shown
  with new rows   Existing rows stay visible
```

---

## Pagination Flow

> Pagination is **server-side**. The API returns the current page records plus total count.
> Page size is user-selectable (e.g., 10 / 25 / 50).

```
API Response includes:
  { data: [...], total: 38, page: 2, pageSize: 10 }
              |
              v
  Pagination bar renders:
  [10 ▼]  < 1  [2]  3  4 >     Showing 11–20 of 38

User changes page or page size
              |
              v
  GET /api/org/{donors|applicants}
    &campaign=<filter>
    &city=<filter>
    &sortBy=<field>
    &order=<order>
    &page=<N>
    &pageSize=<selected>
              |
       ┌──────┴──────┐
       ▼             ▼
   Success         Error
       |             |
       v             v
  Table scrolls   Error toast
  to top, new     Previous page
  rows loaded     remains visible
```

---

## Table Columns

### Donors View

| Column       | Content                                           | Visibility |
|--------------|---------------------------------------------------|------------|
| Donor        | Full name (bold) + email (muted text)             | Always     |
| Campaign     | Campaign or opportunity title                     | Always     |
| Amount/Type  | Donation amount or type (e.g., "500 SAR", "In-kind") | Always  |
| Donation Date| Formatted donation date                           | Always     |
| Actions      | Edit · Delete                                     | Always     |

### Applicants View

| Column            | Content                                        | Visibility |
|-------------------|------------------------------------------------|------------|
| Applicant         | Full name (bold) + email (muted text)          | Always     |
| Campaign          | Campaign or opportunity title                  | Always     |
| Status            | Application status text (e.g., "Under Review") | Always     |
| Application Date  | Formatted application date                     | Always     |
| Actions           | Edit · Delete                                  | Always     |

---

## Row Action 1: View Details (Side Sheet)

```
User clicks on a row / [View Details] for an entry
              |
              v
  DonorEntryDetailsSheet opens (side panel — no API call)
  Displays data already loaded in the list row:

  ┌────────────────────────────────────────────────────────┐
  │  [Avatar Initial]  [ID Badge]  [Donor/Applicant Badge] │
  │                    [Campaign Ref Badge if present]      │
  │  Full Name (large)                                      │
  │  email@address.com                                      │
  ├────────────────────────────────────────────────────────┤
  │  Contact Information Section:                           │
  │  Email Address    |  Phone Number                       │
  │  City / Region    |  Registration Source (if present)  │
  ├────────────────────────────────────────────────────────┤
  │  Campaign & Contribution Section:                       │
  │  (Donors)   Campaign Name (full width)                  │
  │             Amount or Type  |  Donation Date            │
  │             Payment Method                              │
  │  (Applicants) Campaign / Opportunity Name (full width)  │
  │               Application Status  |  Application Date   │
  │               Request Type                              │
  ├────────────────────────────────────────────────────────┤
  │  Internal Tracking Section:                             │
  │  Assigned Staff                                         │
  ├────────────────────────────────────────────────────────┤
  │  Internal Notes Block:  (shown only if notes exist)     │
  │  [note text]                                            │
  └────────────────────────────────────────────────────────┘

User clicks [×] or clicks outside → Sheet closes
```

> No API call is made when opening the details sheet. Data is read from the list row cache.

---

## Row Action 2: Edit Entry

```
User clicks [Edit] (pencil icon) on a row
              |
              v
  Spinner appears on Edit button
              |
              v
  GET /api/org/{donors|applicants}/:id       ← pre-fetch fresh data
              |
       ┌──────┴──────┐
       ▼             ▼
   Success         Error (404 / 500)
       |             |
       v             v
  DonorEntryFormSheet  Error toast shown
  opens in Edit Mode   "Failed to load entry"
  (pre-filled)         Spinner stops

  ┌─────────────────────────────────────────────────────────────┐
  │  Edit Donor / Edit Applicant                           [×]  │
  ├─────────────────────────────────────────────────────────────┤
  │  Full Name *          [________________________________]    │
  │  Email *              [____________]  Phone * [__________]  │
  │  Campaign Name *      [________________________________]    │
  │  Amount/Type * OR                                           │
  │  Status *             [__________]   Date * [__________]   │
  │  City / Region        [__________]   Assigned Staff [____]  │
  │  Registration Source  [________________________________]    │
  │  Payment Method       [________________]  (donors only)     │
  │  Request Type         [________________]  (applicants only) │
  │  Internal Notes       [________________________________]    │
  │                       (textarea, optional)                  │
  ├─────────────────────────────────────────────────────────────┤
  │                             [Cancel]   [Save Changes]       │
  └─────────────────────────────────────────────────────────────┘
```

### Edit: Save Changes

```
User edits fields → clicks [Save Changes]
              |
              v
  Client-side validation
              |
       ┌──────┴──────┐
       ▼             ▼
  Valid            Invalid
       |             |
       v             v
  [Save Changes]  Field errors
  shows spinner   shown inline
  (disabled)      Button stays active
       |
       v
  PATCH /api/org/{donors|applicants}/:id
  { name, email, phone, campaignTitle, amountOrType,
    donatedAt, city, source, paymentMethod (donors),
    requestType (applicants), assignedTo, internalNotes }
              |
       ┌──────┴──────┐
       ▼             ▼
   Success         Error
       |             |
       v             v
  Sheet closes    Error toast
  List row        "Failed to update entry"
  updates         Sheet stays open
  Success toast   Fields remain
  "Entry updated successfully"
```

> **No dirty check** — clicking [Cancel] or [×] in edit mode closes the sheet immediately without a discard confirmation dialog.

---

## Row Action 3: Delete Entry

```
User clicks [Delete] (trash icon) on a row
              |
              v
  DonorEntryDeleteDialog opens:
  ┌──────────────────────────────────────────────────────┐
  │  Delete Donor / Delete Applicant                     │
  ├──────────────────────────────────────────────────────┤
  │  The donor/applicant [Name] will be removed          │
  │  from the current list.                              │
  ├──────────────────────────────────────────────────────┤
  │                          [Cancel]  [Confirm Delete]  │
  └──────────────────────────────────────────────────────┘

User clicks [Cancel]
              |
              v
  Dialog closes, no action taken

User clicks [Confirm Delete]
              |
              v
  [Confirm Delete] shows spinner (disabled)
              |
              v
  DELETE /api/org/{donors|applicants}/:id
              |
       ┌──────┴──────┐
       ▼             ▼
   Success         Error
       |             |
       v             v
  Dialog closes   Error toast
  Row removed     "Failed to delete entry"
  from table      Dialog stays open
  Success toast
  "Entry deleted successfully"

  If DonorEntryDetailsSheet was open for
  the same entry at time of deletion:
              |
              v
  Details sheet also closes automatically
```

---

## Screen 3: Entry Form Sheet — Create Mode

```
User clicks [+ Add Donor] or [+ Add Applicant]
              |
              v
  DonorEntryFormSheet opens in Create Mode:
  ┌─────────────────────────────────────────────────────────────┐
  │  Add Donor / Add Applicant                             [×]  │
  ├─────────────────────────────────────────────────────────────┤
  │  Full Name *          [________________________________]    │
  │                                                             │
  │  Email *              [________________]                    │
  │  Phone *              [________________]                    │
  │                                                             │
  │  Campaign Name *      [________________________________]    │
  │                                                             │
  │  Amount/Type * (donors) OR Status * (applicants)            │
  │                       [__________]                          │
  │  Date *               [datetime-local input]               │
  │  (Donation Date for donors / Application Date for applicants)│
  │                                                             │
  │  City / Region        [__________]   (optional)            │
  │  Assigned Staff       [__________]   (optional)            │
  │                                                             │
  │  Registration Source  [________________]  (optional)       │
  │                                                             │
  │  Payment Method       [________________]  (optional, donors only) │
  │  Request Type         [________________]  (optional, applicants only) │
  │                                                             │
  │  Internal Notes       [________________________________]    │
  │                       (textarea, optional)                  │
  ├─────────────────────────────────────────────────────────────┤
  │                                    [Cancel]  [Add / Save]   │
  └─────────────────────────────────────────────────────────────┘

User fills required fields → clicks [Add]
              |
              v
  Client-side validation (required fields: name, email, phone,
                           campaignTitle, amountOrType, donatedAt)
              |
       ┌──────┴──────┐
       ▼             ▼
  Valid            Invalid
       |             |
       v             v
  [Add] shows     Field errors
  spinner         shown inline
  (disabled)
       |
       v
  POST /api/org/{donors|applicants}
  { name, email, phone, campaignTitle, amountOrType,
    donatedAt, city, source, paymentMethod (donors),
    requestType (applicants), assignedTo, internalNotes }
              |
       ┌──────┴──────┐
       ▼             ▼
   Success         Error
       |             |
       v             v
  Sheet closes    Error toast
  New row         "Failed to create entry"
  appears in      Sheet stays open
  list            Fields remain
  Success toast
  "Entry created successfully"

User clicks [×] or [Cancel] (no dirty check in create mode)
              |
              v
  Sheet closes immediately, no action taken
```

---

## Screen 3: Entry Form Sheet — Edit Mode

```
(Sheet opened after successful GET /api/org/{donors|applicants}/:id prefetch)

All fields pre-filled with existing entry data.

User edits one or more fields
              |
              v
  No dirty tracking — Cancel closes immediately at any time

User clicks [×] or [Cancel]
              |
              v
  Sheet closes immediately (no discard confirmation dialog)

User clicks [Save Changes]
              |
              v
  (See "Row Action 2: Edit Entry — Save Changes" flow above)
```

> **Note:** The edit form does not track dirty state. Closing via [×] or [Cancel] always discards any unsaved changes without a confirmation dialog.

---

## Complete Flow Diagram — All Actions with API

```
  /dashboard/org-owner/donors  (or /donors/applicants)
              |
              v
  GET /api/org/{donors|applicants}?page=1&pageSize=10&sortBy=donated_at&order=desc
              |
        ┌─────┴─────┐
        ▼           ▼
    Success       Error → Retry button
        |
        v
  ┌──────────────────────────────────────────────────────────────┐
  │   Donors / Applicants List Page                              │
  └──┬─────────────┬──────────────┬──────────────────────────────┘
     │             │              │
     ▼             ▼              ▼
  Nav switch    Filter/Sort    [+ Add Donor / Add Applicant]
  to other      change              |
  view route       |               v
     |          Reset page 1   FormSheet (Create Mode)
     v              |              |
  Reset all      GET list       [Add]
  filters            |              |
  GET new view   Table           POST /api/org/{donors|applicants}
                 updates              |
                                ┌─────┴─────┐
                                ▼           ▼
                             Success      Error
                                |           |
                                v           v
                             Sheet       Error toast
                             closes      stays open
                             List
                             refreshes

  Row Actions:
  ┌─────────────────────────────────────────────────────────────────┐
  │  [View Details]  →  DonorEntryDetailsSheet (no API)            │
  │  [Edit]          →  GET :id → FormSheet (Edit Mode)            │
  │                       → PATCH /api/org/{donors|applicants}/:id │
  │  [Delete]        →  DonorEntryDeleteDialog                     │
  │                       → DELETE /api/org/{donors|applicants}/:id│
  └─────────────────────────────────────────────────────────────────┘

  Switching Views:
  /donors  ◄──────────────────────────────►  /donors/applicants
  Donors endpoint, city filter             Applicants endpoint, status filter
  Payment Method in form                   Request Type in form
  Resets: campaign, city/status, sort, page
```

---

## Toast Notification Reference

| Action                   | Success Toast                               | Error Toast                               |
|--------------------------|---------------------------------------------|-------------------------------------------|
| Load list                | (none)                                      | "Failed to load entries"                  |
| Create donor             | "Donor added successfully"                  | "Failed to add donor"                     |
| Create applicant         | "Applicant added successfully"              | "Failed to add applicant"                 |
| Edit prefetch            | (none)                                      | "Failed to load entry"                    |
| Save donor edits         | "Donor updated successfully"                | "Failed to update donor"                  |
| Save applicant edits     | "Applicant updated successfully"            | "Failed to update applicant"              |
| Delete donor             | "Donor deleted successfully"                | "Failed to delete donor"                  |
| Delete applicant         | "Applicant deleted successfully"            | "Failed to delete applicant"              |

---

## Loading & Disabled States Reference

| UI Element                        | Loading Behavior                                                    |
|-----------------------------------|---------------------------------------------------------------------|
| Entries table (initial load)      | Skeleton rows animated while API call is in flight                  |
| Entries table (filter/sort/page)  | Table content replaced with skeleton rows; controls remain visible  |
| [+ Add Donor/Applicant] button    | No spinner; always enabled unless form sheet is open                |
| [Edit] row button                 | Spinner on button; button disabled; pre-fetch GET in progress       |
| [Delete] row button               | Spinner on button; button disabled; DELETE in progress              |
| [Add / Save] form button          | Spinner; disabled while POST or PATCH is in flight                  |
| [Confirm Delete] dialog button    | Spinner; disabled while DELETE is in flight                         |
| Filter & sort controls            | Disabled during API request; re-enabled on response                 |
| Pagination controls               | Disabled during API request; re-enabled on response                 |
| Page size selector                | Disabled during API request; re-enabled on response                 |

---

## All Screens & States

| State                            | Location                        | Trigger                                           | Description                                                    |
|----------------------------------|---------------------------------|---------------------------------------------------|----------------------------------------------------------------|
| Donors list loading              | Donors list page                | Page mount / filter / page change                 | Skeleton rows shown while GET /api/org/donors is pending       |
| Donors list error                | Donors list page                | GET /api/org/donors returns 4xx/5xx/network       | Error message with Retry button                                |
| Donors list empty                | Donors list page                | API returns empty array                           | Empty state message, "No donors found yet"                     |
| Donors list populated            | Donors list page                | GET /api/org/donors returns data                  | Table rows with name/email/campaign/amount/date/actions        |
| Applicants list loading          | Applicants list page            | Page mount / filter / page change                 | Skeleton rows shown while GET /api/org/applicants is pending   |
| Applicants list error            | Applicants list page            | GET /api/org/applicants returns 4xx/5xx/network   | Error message with Retry button                                |
| Applicants list empty            | Applicants list page            | API returns empty array                           | Empty state message, "No applicants found"                     |
| Applicants list populated        | Applicants list page            | GET /api/org/applicants returns data              | Table rows with name/email/campaign/status/date/actions        |
| View switched to Donors          | Donors list page                | Sidebar nav → Donors route                        | All filters/sort/page reset; donors endpoint called            |
| View switched to Applicants      | Applicants list page            | Sidebar nav → Applicants route                    | All filters/sort/page reset; applicants endpoint called        |
| Campaign filter applied          | Active list page                | User selects a campaign from dropdown             | `?campaign=X` added; page resets to 1                         |
| City filter applied              | Donors list page                | User selects a city from dropdown                 | `?city=X` added; page resets to 1                             |
| Status filter applied            | Applicants list page            | User selects a status from dropdown               | `?status=X` added; page resets to 1                           |
| Sort applied                     | Active list page                | User selects sort option                          | `?sortBy=X&order=Y` applied; page resets to 1                 |
| Details sheet open               | Active list page (overlay)      | User clicks View Details / row click              | Side Sheet with full entry data; no API call                   |
| Details sheet closed             | Active list page                | [×] click or outside click                        | Sheet dismissed; list unchanged                                |
| Edit prefetch loading            | Active list page                | User clicks Edit button                           | Spinner on Edit button; GET :id in progress                    |
| Form sheet open (create)         | Active list page (overlay)      | User clicks [+ Add Donor/Applicant]               | Blank form sheet slides in                                     |
| Form sheet open (edit)           | Active list page (overlay)      | Edit prefetch success                             | Pre-filled form sheet slides in                                |
| Create entry submitting          | Form sheet                      | User clicks [Add]                                 | Button spinner; POST in flight                                 |
| Edit entry submitting            | Form sheet                      | User clicks [Save Changes]                        | Button spinner; PATCH in flight                                |
| Delete dialog open               | Active list page (overlay)      | User clicks [Delete]                              | Confirmation dialog                                            |
| Delete submitting                | Delete dialog                   | User confirms delete                              | Button spinner; DELETE in flight                               |
| Details sheet auto-closed        | Active list page                | Delete succeeds for the currently open entry      | Both delete dialog and details sheet close simultaneously      |
| Page size changed                | Active list page                | User selects new page size from selector          | New GET with updated pageSize; page resets to 1               |

---

## Decision Points

| #  | Decision                                                       | Options                                                                        |
|----|----------------------------------------------------------------|--------------------------------------------------------------------------------|
| 1  | Which view is active?                                          | Donors (`/donors`) → donors endpoint, city filter, Payment Method field; Applicants (`/donors/applicants`) → applicants endpoint, status filter, Request Type field |
| 2  | Is the DonorEntryDetailsSheet open for the entry being deleted? | Yes → also close the details sheet after delete success; No → only remove row |
| 3  | Edit prefetch — does GET :id succeed?                          | Yes → open form sheet with pre-filled data; No → show error toast, do not open sheet |
| 4  | Create entry submitted — which page to show after?             | Reset to page 1 of current view to show new entry at top of list               |
| 5  | Filter or sort changed — should page reset?                    | Yes → always reset to page 1 when filter, sort, or page size changes           |
| 6  | User switches between Donors and Applicants route              | Reset all filter/sort/page state; call the correct API endpoint for the new view |
| 7  | User cancels or closes form sheet in edit mode                 | No dirty check — sheet closes immediately without a discard dialog             |
| 8  | City filter visible?                                           | Yes for Donors view; Hidden for Applicants view (replaced by Status filter)    |
| 9  | Payment Method field visible in form?                          | Yes for Donors view; Hidden for Applicants view                                |
| 10 | Request Type field visible in form?                            | Yes for Applicants view; Hidden for Donors view                                |

---

## Related Files

| File                                                                                           | Purpose                                                          |
|------------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| `src/app/dashboard/org-owner/donors/page.tsx`                                                  | Donors route — renders `<DonorsManagementPage view="donors" />`  |
| `src/app/dashboard/org-owner/donors/applicants/page.tsx`                                       | Applicants route — renders `<DonorsManagementPage view="applicants" />` |
| `src/components/pages/donors-management/donors-management-page.tsx`                            | Main page component — handles both views, filters, pagination, state, and action handlers |
| `src/components/pages/donors-management/donors-table.tsx`                                      | Table component — renders view-specific columns and Edit/Delete row actions |
| `src/components/pages/donors-management/donor-entry-form-sheet.tsx`                            | Create / Edit form sheet — adapts labels and fields based on view |
| `src/components/pages/donors-management/donor-entry-details-sheet.tsx`                         | View-only side panel sheet — shows full entry detail sections    |
| `src/components/pages/donors-management/donor-entry-delete-dialog.tsx`                         | Delete confirmation dialog — adapts label to Donor or Applicant  |
| `src/components/pages/donors-management/static-data.ts`                                        | `DonorEntryItem` type, `donorsStaticData`, `applicantsStaticData` |
| `src/components/pages/donors-management/index.ts`                                              | Barrel export                                                    |
