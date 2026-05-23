# User Flow: Org-Owner Campaigns Management — Detailed (API-Integrated)
**JOD Platform — Organization Owner Dashboard**

---

## Overview

This document is the **detailed, API-integrated** version of the Org-Owner Campaigns Management user flow. It covers every screen, every API call, every loading state, every success path, and every error path — including what the UI shows the org owner at each step.

**All Campaigns Route:** `/dashboard/org-owner/campaigns`
**Active Route:** `/dashboard/org-owner/campaigns/active`
**Draft Route:** `/dashboard/org-owner/campaigns/draft`
**Closed Route:** `/dashboard/org-owner/campaigns/closed`
**Details Route:** `/dashboard/org-owner/campaigns/[id]`
**Role:** `org_owner`

---

## Campaign Statuses

| Status | Badge Color | Description |
|--------|-------------|-------------|
| `draft` | Amber | Campaign created but not yet published or active |
| `active` | Green | Campaign is currently running and accepting donors/applicants |
| `closed` | Slate/Grey | Campaign finished — manually closed or time-expired |

## Campaign Categories

| Category | Label |
|----------|-------|
| `health` | Health |
| `education` | Education |
| `food` | Food |
| `shelter` | Shelter |
| `employment` | Employment & Opportunities |

---

## Entry Points

| Source | Route |
|--------|-------|
| Org-owner sidebar — Campaigns (All) | `/dashboard/org-owner/campaigns` |
| Org-owner sidebar — Active | `/dashboard/org-owner/campaigns/active` |
| Org-owner sidebar — Draft | `/dashboard/org-owner/campaigns/draft` |
| Org-owner sidebar — Closed | `/dashboard/org-owner/campaigns/closed` |
| View Details action (from list row) | `/dashboard/org-owner/campaigns/[id]` |

---

## API Endpoints Reference

| Action | Method | Endpoint |
|--------|--------|----------|
| Fetch campaigns list | `GET` | `/api/org/campaigns` |
| Fetch single campaign | `GET` | `/api/org/campaigns/:id` |
| Create campaign | `POST` | `/api/org/campaigns` |
| Edit campaign | `PATCH` | `/api/org/campaigns/:id` |
| Close campaign | `PATCH` | `/api/org/campaigns/:id/close` |
| Delete campaign | `DELETE` | `/api/org/campaigns/:id` |

---

## Global Error Types

| Error Code | Meaning | UI Behavior |
|------------|---------|-------------|
| `401` | Unauthorized — session expired | Redirect to login page |
| `403` | Forbidden — not authorized for this organization | Show "Access Denied" page |
| `404` | Resource not found | Show not-found empty state |
| `409` | Conflict — campaign title already exists | Show field-level error on title |
| `422` | Validation error | Show field-level error messages |
| `500` | Server error | Show generic error toast (red) |
| Network error | No response from server | Show "Connection failed, try again" toast (red) |

---

## Screen 1: Campaigns List — Initial Load

```
Org owner navigates to /dashboard/org-owner/campaigns
(or /active, /draft, /closed)
                    │
                    ▼
         Page mounts — trigger GET /api/org/campaigns
           ?status=all            ← from route prop
           &page=1
           &pageSize=10
           &sortBy=updated_at
           &order=desc
                    │
                    ▼
┌────────────────────────────────────────────────────────┐
│               LOADING STATE                            │
│                                                        │
│  Filters bar visible but disabled                      │
│  Table shows skeleton rows (shimmer effect)            │
│  Pagination hidden or disabled                         │
│  [ + Add New Campaign ] button visible                 │
└────────────────────────────────────────────────────────┘
                    │
         ┌──────────┴──────────┐
      API Success           API Error
         │                     │
         ▼                     ▼
  Campaigns loaded      ┌─────────────────────────┐
  Table renders rows    │       ERROR STATE        │
  Filters enabled       │                          │
  Pagination visible    │  Toast: "Failed to load  │
                        │  campaigns. Please       │
                        │  try again."             │
                        │                          │
                        │  Table shows empty       │
                        │  [ Retry ] button        │
                        └─────────────────────────┘
                                    │
                            Org owner clicks Retry
                                    │
                                    ▼
                           Re-trigger GET request
                           (returns to loading state)
```

### Success — List Loaded

```
┌────────────────────────────────────────────────────────────┐
│                  CAMPAIGNS MANAGEMENT PAGE                 │
│                                                            │
│  Header                                                    │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Campaign Management — All     Results: 9 campaigns│   │
│  │                           [ + Add New Campaign ]   │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  Filters Bar — all dropdowns enabled                       │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐   │
│  │ Category [▾] │ │ Location [▾] │ │ Sort: Newest [▾] │   │
│  └──────────────┘ └──────────────┘ └──────────────────┘   │
│                                                            │
│  Table with all campaign rows                              │
│  Pagination controls visible                               │
└────────────────────────────────────────────────────────────┘
```

---

## Tabs (Status Routes)

```
Org owner clicks a tab (All / Active / Draft / Closed)
                    │
                    ▼
         Route changes to matching path
         Page re-mounts with new status prop
         Filters reset to defaults
         Page resets to 1
                    │
                    ▼
         GET /api/org/campaigns?status=<new_status>&page=1&...
                    │
                    ▼
         Loading → Success / Error
```

| Tab | Route | `status` param |
|-----|-------|---------------|
| All Campaigns | `/campaigns` | `all` (omit status param) |
| Active | `/campaigns/active` | `active` |
| Draft | `/campaigns/draft` | `draft` |
| Closed | `/campaigns/closed` | `closed` |

---

## Filter & Sort Flow (Server-Side)

All filter and sort changes trigger a new API request. No client-side data manipulation.

```
Org owner changes Category / Location / Sort dropdown
                    │
                    ▼
         State updates (filter/sort values)
         Current page resets to 1
                    │
                    ▼
         GET /api/org/campaigns
           ?status=<current_tab>
           &page=1
           &pageSize=<current>
           &sortBy=<field>
           &order=<asc|desc>
           &category=<value|omit>
           &location=<value|omit>
                    │
         ┌──────────┴──────────┐
      API Success           API Error
         │                     │
         ▼                     ▼
  Table re-renders        Toast (red):
  with new results        "Failed to load campaigns."
                          Old data stays visible

Sort options:
  • Most Recently Updated  (default — sortBy=updated_at, order=desc)
  • Oldest Updated         (sortBy=updated_at, order=asc)
  • Highest Progress       (sortBy=progress, order=desc)
  • Lowest Progress        (sortBy=progress, order=asc)

Category filter options:
  • All Categories  (default)
  • Health / Education / Food / Shelter / Employment & Opportunities

Location filter options:
  • All Locations  (default)
  • <dynamic list from API response metadata, sorted A–Z>
  Note: resets to "All Locations" if selected city disappears
        after a tab switch
```

---

## Pagination Flow (Server-Side)

```
Org owner clicks a page number or changes page size
                    │
                    ▼
         GET /api/org/campaigns?...&page=<N>&pageSize=<X>
                    │
         ┌──────────┴──────────┐
      API Success           API Error
         │                     │
         ▼                     ▼
  Table renders          Toast (red):
  new page slice         "Failed to load campaigns."
  Pagination updates     Old page stays visible

Controls:
  [ ‹ ]  [1] [2] … [N]  [ › ]   Page size: [10 ▾]
  Page size options: 10, 20, 50

Note: any filter or sort change resets page → 1
      any page size change resets page → 1
```

---

## Table Columns

| Column | Content |
|--------|---------|
| Campaign | Title (bold) + Summary (2 lines, truncated) + Campaign ID |
| Status | Status badge (Active / Draft / Closed) |
| Category | Category badge |
| Progress | Progress % bar + Raised SAR + Goal SAR |
| Metrics | Donors count + Applicants count + Beneficiaries count + City |
| Period | Start date + End date + Closed date (if applicable) |
| Last Updated | Last updated datetime |
| Actions | View Details \| Edit \| Close \| Delete |

---

## Row Action Availability

| Action Icon | Active | Draft | Closed |
|-------------|--------|-------|--------|
| View Details | ✓ | ✓ | ✓ |
| Edit | ✓ | ✓ | ✗ (disabled) |
| Close | ✓ | ✗ (disabled) | ✗ (disabled) |
| Delete | ✓ | ✓ | ✓ |

---

## Row Action 1: View Campaign Details

```
Org owner clicks [ View Details icon ] on a row
                    │
                    ▼
         router.push → /dashboard/org-owner/campaigns/[id]
         (no API call at this step — navigation only)
                    │
                    ▼
         Details page mounts and fetches campaign by ID
         (see Screen 2 below)
```

---

## Row Action 2: Edit Campaign

> Edit is disabled for campaigns with `status === "closed"`.

```
Org owner clicks [ Edit icon ] on an active or draft row
                    │
                    ▼
         GET /api/org/campaigns/:id
         (pre-fetch fresh data before opening form)
                    │
         ┌──────────┴──────────┐
      API Success           API Error
         │                     │
         ▼                     ▼
  Campaign Form Sheet     Spinner removed
  opens in Edit mode      Toast (red):
  (see Screen 3 below)    "Failed to load campaign data."
  Pre-populated with      Sheet does not open
  fresh data
```

---

## Row Action 3: Close Campaign

> Close is only enabled for campaigns with `status === "active"`.

```
Org owner clicks [ Close icon ] on an active row
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│               CLOSE CAMPAIGN DIALOG                  │
│                                                      │
│  "Close Campaign"                                    │
│  "Enter a closure reason. It will appear in the      │
│   campaign's internal record."                       │
│                                                      │
│  Campaign: <title displayed as read-only field>      │
│                                                      │
│  Closure Reason *                                    │
│  ┌──────────────────────────────────────────────┐   │
│  │  (textarea, min height)                      │   │
│  │  Example: Campaign closed after reaching     │   │
│  │  the funding goal...                         │   │
│  └──────────────────────────────────────────────┘   │
│  Minimum: 8 characters                               │
│                                                      │
│  [ Cancel ]              [ Confirm Closure ]         │
│                           ↑ disabled if < 8 chars    │
└──────────────────────────────────────────────────────┘
                    │
       ┌────────────┴────────────┐
  Cancel clicked          Confirm Closure clicked
       │                  (reason ≥ 8 chars)
       ▼                          │
  Dialog closes                   ▼
  No API call            [ Confirm Closure ] button
  No change              shows loading spinner
                         Dialog action buttons disabled
                                  │
                                  ▼
                    PATCH /api/org/campaigns/:id/close
                    Body: { reason: "<trimmed text>" }
                                  │
                       ┌──────────┴──────────┐
                    API Success           API Error
                       │                     │
                       ▼                     ▼
                Dialog closes          Spinner removed
                Campaign row           Buttons re-enabled
                status → "closed"      Dialog stays open
                Close icon disabled         │
                                            ▼
                Toast (green):         Toast (red):
                "Campaign closed       "Failed to close
                 successfully."         campaign. Please
                                        try again."
```

---

## Row Action 4: Delete Campaign

```
Org owner clicks [ Delete icon ] on any row
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│               DELETE CAMPAIGN DIALOG                 │
│                                                      │
│  "Delete Campaign"                                   │
│  "This campaign will be permanently deleted.         │
│   This action cannot be undone."                     │
│                                                      │
│  Campaign: <title displayed as read-only field>      │
│                                                      │
│  [ Cancel ]              [ Confirm Delete ]          │
└──────────────────────────────────────────────────────┘
                    │
       ┌────────────┴────────────┐
  Cancel clicked          Confirm Delete clicked
       │                          │
       ▼                          ▼
  Dialog closes           [ Confirm Delete ] button
  No API call             shows loading spinner
  No change               Dialog action buttons disabled
                                  │
                                  ▼
                    DELETE /api/org/campaigns/:id
                                  │
                       ┌──────────┴──────────┐
                    API Success           API Error
                       │                     │
                       ▼                     ▼
                Dialog closes          Spinner removed
                Campaign row           Buttons re-enabled
                removed from table     Dialog stays open
                (no undo)                   │
                                            ▼
                Toast (green):         Toast (red):
                "Campaign deleted       "Failed to delete
                 successfully."         campaign. Please
                                        try again."
```

---

## Screen 2: Campaign Details Page — Load

```
Org owner lands on /dashboard/org-owner/campaigns/[id]
                    │
                    ▼
         Page mounts — trigger GET /api/org/campaigns/:id
                    │
                    ▼
┌───────────────────────────────────────────────────┐
│               LOADING STATE                       │
│                                                   │
│  Header card — skeleton shimmer                   │
│  Stats row   — skeleton shimmer                   │
│  Info grid   — skeleton shimmer                   │
│  Back buttons — disabled / hidden                 │
└───────────────────────────────────────────────────┘
                    │
         ┌──────────┴──────────────┐
      API Success             API Error
         │                         │
    ┌────┴────┐              ┌──────┴──────────────┐
  Found   Not Found          │    ERROR STATE       │
    │        │               │                     │
    ▼        ▼               │  Toast (red):        │
 Details  Empty State        │  "Failed to load     │
 Page     (see below)        │   campaign details." │
                             │                     │
                             │  [ ← Back to        │
                             │    Campaigns ]      │
                             └─────────────────────┘

404 Not Found state:
┌───────────────────────────────────────────────┐
│                  EMPTY STATE                  │
│                                               │
│       [ Campaigns icon ]                      │
│       "Campaign Not Found"                    │
│       "Check the campaign ID or go back       │
│        to the campaigns list."                │
│                                               │
│       [ ← Back to Campaigns ]                │
└───────────────────────────────────────────────┘
```

### Success — Details Page Layout

```
┌────────────────────────────────────────────────────────────┐
│                  CAMPAIGN DETAILS PAGE                     │
│                                                            │
│  Header Card                                               │
│  ┌────────────────────────────────────────────────────┐   │
│  │  [ Status Badge ] [ Category Badge ] [ OCM-XXXX ]  │   │
│  │  Campaign Title                                    │   │
│  │  Campaign summary text                             │   │
│  │                                                    │   │
│  │  [ ← Back to Active ]   [ All Campaigns ]         │   │
│  │     ↑ links to the matching status tab            │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  Stats Row (3 columns)                                     │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────┐   │
│  │  Goal Amount     │ │  Raised Amount   │ │ Progress │   │
│  │  NNN,NNN SAR     │ │  NNN,NNN SAR     │ │  NN%     │   │
│  │                  │ │                  │ │ [██░░░░] │   │
│  └──────────────────┘ └──────────────────┘ └──────────┘   │
│                                                            │
│  Info Grid (2 columns)                                     │
│  ┌──────────────────────────┐  ┌────────────────────────┐ │
│  │  CAMPAIGN DATA           │  │  PARTICIPATION METRICS │ │
│  │  City: <location>        │  │  Donors: <count>       │ │
│  │  Start Date: <date>      │  │  Applicants: <count>   │ │
│  │  End Date: <date>        │  │  Beneficiaries: <count>│ │
│  │  Created At: <datetime>  │  │  Closed At: <datetime> │ │
│  │  Last Updated: <datetime>│  │    (only if closed)    │ │
│  └──────────────────────────┘  └────────────────────────┘ │
│                                                            │
│  Closure Reason Block (only if campaign is closed)         │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Closure Reason:                                   │   │
│  │  <full reason text>                                │   │
│  └────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

---

## Screen 3: Campaign Form Sheet — Create Mode

```
Org owner clicks [ + Add New Campaign ] button (page header)
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│           CAMPAIGN FORM SHEET (Create Mode)          │
│  (slides in from the right)                          │
│  Title: "Add New Campaign"                           │
│                                                      │
│  Fields pre-filled with empty defaults:              │
│  ┌────────────────────────────────────────────────┐  │
│  │  Campaign Title *           [               ]  │  │
│  │  Campaign Summary *         [               ]  │  │
│  │                             [   (textarea)  ]  │  │
│  │  Category *  [ Health ▾ ]   Status * [ Draft▾] │  │
│  │  Location *                 [               ]  │  │
│  │  Goal Amount (SAR) *        [    0          ]  │  │
│  │  Beneficiaries Count *      [    0          ]  │  │
│  │  Start Date *               [ date picker   ]  │  │
│  │  End Date *                 [ date picker   ]  │  │
│  │                            (min = start date)  │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  [ Cancel ]              [ Add Campaign ]            │
└──────────────────────────────────────────────────────┘
                    │
       ┌────────────┴────────────┐
  Cancel clicked          Org owner fills all fields
       │                  + clicks [ Add Campaign ]
       ▼                          │
  Sheet closes                    ▼
  No API call             Client-side validation
  No change                       │
                       ┌──────────┴──────────┐
                   Invalid              All valid
                       │                     │
                       ▼                     ▼
               Field errors shown   [ Add Campaign ] →
               inline under         loading spinner
               each field           Button disabled
               (required,           Sheet non-interactive
               date range, etc.)         │
                                         ▼
                              POST /api/org/campaigns
                              Body: { title, summary,
                                      category, status,
                                      location, goalAmount,
                                      beneficiariesCount,
                                      startDate, endDate }
                                         │
                             ┌───────────┴───────────┐
                          API Success             API Error
                             │                       │
                             ▼                       ▼
                      Sheet closes            Spinner removed
                      New campaign            Button re-enabled
                      added to table          Form stays open
                      (list re-fetched)            │
                                                   ▼
                      Toast (green):       ┌────────────────┐
                      "Campaign created     │  Error type?   │
                       successfully."      └────────────────┘
                                                   │
                                       ┌───────────┴───────────┐
                                   409 / 422              500 / Network
                                       │                       │
                                       ▼                       ▼
                               Field errors shown       Toast (red):
                               inline under each        "Failed to create
                               failing field            campaign. Please
                                                        try again."
```

---

## Screen 3: Campaign Form Sheet — Edit Mode

```
Org owner clicks [ Edit icon ] on an active or draft row
→ GET /api/org/campaigns/:id completes successfully
(see Row Action 2 above for the pre-fetch step)
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│           CAMPAIGN FORM SHEET (Edit Mode)            │
│  (slides in from the right)                          │
│  Title: "Edit Campaign"                              │
│                                                      │
│  Fields pre-filled with existing campaign values:    │
│  ┌────────────────────────────────────────────────┐  │
│  │  Campaign Title *     [ Existing Title      ]  │  │
│  │  Campaign Summary *   [ Existing summary... ]  │  │
│  │                       [                     ]  │  │
│  │  Category * [ Health▾]  Status * [ Active ▾ ]  │  │
│  │  Location *           [ Riyadh              ]  │  │
│  │  Goal Amount (SAR) *  [ 480,000             ]  │  │
│  │  Beneficiaries *      [ 75                  ]  │  │
│  │  Start Date *         [ 2026-03-01          ]  │  │
│  │  End Date *           [ 2026-05-30          ]  │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  [ Cancel ]              [ Save Changes ]            │
└──────────────────────────────────────────────────────┘
                    │
         Org owner edits one or more fields
         isDirty = true
                    │
       ┌────────────┴────────────────────────┐
  Cancel / close             Org owner clicks [ Save Changes ]
  (dirty check)                          │
       │                                  ▼
       ▼                        Client-side validation
  DISCARD DIALOG                         │
  (see below)            ┌───────────────┴───────────────┐
                      Invalid                        All valid
                         │                               │
                         ▼                               ▼
                  Field errors shown        [ Save Changes ] →
                  inline under              loading spinner
                  each field               Button disabled
                                           Sheet non-interactive
                                                    │
                                                    ▼
                                     PATCH /api/org/campaigns/:id
                                     Body: { title, summary,
                                             category, status,
                                             location, goalAmount,
                                             beneficiariesCount,
                                             startDate, endDate }
                                                    │
                                        ┌───────────┴───────────┐
                                     API Success            API Error
                                        │                       │
                                        ▼                       ▼
                                 Sheet closes           Spinner removed
                                 Campaign row           Button re-enabled
                                 updated in table       Form stays open
                                                             │
                                 Toast (green):      ┌───────────────┐
                                 "Campaign updated    │  Error type?  │
                                  successfully."     └───────────────┘
                                                             │
                                                 ┌───────────┴──────────┐
                                             409 / 422            500 / Network
                                                 │                      │
                                                 ▼                      ▼
                                         Field errors           Toast (red):
                                         shown inline           "Failed to update
                                         under each             campaign. Please
                                         failing field          try again."
```

---

## Edit Mode: Discard Changes Dialog

Triggered when org owner tries to cancel or close the sheet while `isDirty === true` (form values differ from initial values loaded from API).

```
Org owner clicks [ Cancel ] or closes sheet
while there are unsaved changes (isDirty = true)
                    │
                    ▼
┌───────────────────────────────────────────────┐
│          DISCARD CHANGES DIALOG               │
│                                               │
│  "Discard Changes?"                           │
│                                               │
│  "You have unsaved changes.                   │
│   Close the edit form without saving?"        │
│                                               │
│  [ Continue Editing ]   [ Discard Changes ]   │
└───────────────────────────────────────────────┘
                    │
       ┌────────────┴────────────┐
  Continue Editing        Discard Changes
       │                          │
       ▼                          ▼
  Discard dialog          Discard dialog closes
  closes                  Form sheet closes
  Form sheet stays        All edits lost
  open with               No API call
  current values          No change to table
```

If `isDirty === false` (no changes made):
```
Org owner clicks [ Cancel ] with no changes
                    │
                    ▼
         No discard dialog shown
         Sheet closes immediately
         No API call
```

Note: The discard dialog only applies in **edit mode**. In create mode, Cancel always closes the sheet immediately with no dialog — there is no "original data" to compare against.

---

## Complete Flow Diagram — All Actions with API

```
/dashboard/org-owner/campaigns  (or /active / /draft / /closed)
            │
            ▼
  GET /api/org/campaigns?status=<tab>&page=1&...
            │
   ┌────────┴────────┐
 Error            Success
   │                 │
 Toast +          Table loads
 Retry btn             │
                       ├── Switch Tab ──────────────► New route, new GET
                       │                              filters reset, page=1
                       │
                       ├── Filter / Sort ───────────► Server-side GET (page=1)
                       │
                       ├── Paginate ────────────────► Server-side GET (new page)
                       │
                       ├── [ + Add New Campaign ] ──► Screen 3 (Create mode)
                       │                                     │
                       │                              POST /api/org/campaigns
                       │                                     │
                       │                         ┌──────────┴──────────┐
                       │                      Error                  Success
                       │                         │                     │
                       │                 422 → field errors      Sheet closes
                       │                 500 → toast (red)       List re-fetches
                       │                                         Toast (green)
                       │
                       ├── [ View Details ] ───────► Navigate to /campaigns/[id]
                       │                                     │
                       │                         GET /api/org/campaigns/:id
                       │                                     │
                       │                      ┌──────────────┴────────┐
                       │                   Error              ┌────────┴──────┐
                       │                      │            404 Not       Found
                       │                 Toast (red)       Found           │
                       │                 Back button          │         Details
                       │                                 Empty State   rendered
                       │
                       ├── [ Edit ] (active/draft) ──► GET /api/org/campaigns/:id
                       │                               then Screen 3 (Edit mode)
                       │                                     │
                       │                         PATCH /api/org/campaigns/:id
                       │                                     │
                       │                         ┌──────────┴──────────┐
                       │                      Error                  Success
                       │                         │                     │
                       │                 422 → field errors      Sheet closes
                       │                 500 → toast (red)       Row updated
                       │                                         Toast (green)
                       │
                       ├── [ Close ] (active only) ──► Close dialog
                       │                                     │
                       │                    PATCH /api/org/campaigns/:id/close
                       │                                     │
                       │                         ┌──────────┴──────────┐
                       │                      Error                  Success
                       │                         │                     │
                       │                    Toast (red)          Row → "Closed"
                       │                    Dialog stays         Toast (green)
                       │
                       └── [ Delete ] ──────────────► Delete dialog
                                                             │
                                              DELETE /api/org/campaigns/:id
                                                             │
                                                 ┌──────────┴──────────┐
                                              Error                  Success
                                                 │                     │
                                            Toast (red)          Row removed
                                            Dialog stays         Toast (green)
```

---

## Toast Notification Reference

| Action | Success Toast | Error Toast |
|--------|--------------|-------------|
| Load list | *(silent)* | "Failed to load campaigns. Please try again." |
| Load details | *(silent)* | "Failed to load campaign details." |
| Edit pre-fetch | *(silent)* | "Failed to load campaign data." |
| Create campaign | "Campaign created successfully." | "Failed to create campaign. Please try again." |
| Edit campaign | "Campaign updated successfully." | "Failed to update campaign. Please try again." |
| Close campaign | "Campaign closed successfully." | "Failed to close campaign. Please try again." |
| Delete campaign | "Campaign deleted successfully." | "Failed to delete campaign. Please try again." |

---

## Loading & Disabled States Reference

| UI Element | Loading Behavior |
|------------|-----------------|
| Campaigns table (initial load) | Skeleton shimmer rows, filters disabled |
| Edit row icon (pre-fetch) | Spinner on icon, icon non-interactive |
| Close dialog Confirm button | Spinner on button, both buttons disabled |
| Delete dialog Confirm button | Spinner on button, both buttons disabled |
| Form sheet Submit button | Spinner on button, all fields disabled |
| Form sheet Cancel button | Disabled while submit is in progress |

---

## All Screens & States

| State | Location | Trigger | Description |
|-------|----------|---------|-------------|
| List — Loading | `/campaigns/<tab>` | Page mount | Skeleton table rows, filters disabled |
| List — Loaded | `/campaigns/<tab>` | GET success | Full table with campaigns |
| List — Load Error | `/campaigns/<tab>` | GET failure | Error toast + Retry button |
| List — Filtered | `/campaigns/<tab>` | Filter change | Server GET, page reset to 1 |
| List — Sorted | `/campaigns/<tab>` | Sort change | Server GET, page reset to 1 |
| List — Empty (filter) | `/campaigns/<tab>` | GET returns 0 rows | Empty state, filters still active |
| List — Empty (tab) | `/campaigns/<tab>` | GET returns 0 rows | Empty state, no campaigns in this status |
| Close dialog — Open | `/campaigns/<tab>` | Close icon click | Dialog with reason textarea |
| Close dialog — Loading | `/campaigns/<tab>` | Confirm click | Dialog buttons disabled, spinner |
| Close dialog — Success | `/campaigns/<tab>` | PATCH success | Row → Closed, toast, dialog closed |
| Close dialog — Error | `/campaigns/<tab>` | PATCH failure | Toast error, dialog stays open |
| Delete dialog — Open | `/campaigns/<tab>` | Delete icon click | Dialog with campaign name + Cancel/Confirm |
| Delete dialog — Loading | `/campaigns/<tab>` | Confirm click | Dialog buttons disabled, spinner |
| Delete dialog — Success | `/campaigns/<tab>` | DELETE success | Row removed, toast, dialog closed |
| Delete dialog — Error | `/campaigns/<tab>` | DELETE failure | Toast error, dialog stays open |
| Form sheet — Create | `/campaigns/<tab>` | Add button click | Empty form, "Add New Campaign" title |
| Form sheet — Edit pre-fetch | `/campaigns/<tab>` | Edit icon click | Spinner on edit icon |
| Form sheet — Edit | `/campaigns/<tab>` | GET :id success | Pre-filled form, "Edit Campaign" title |
| Form sheet — Validation error | `/campaigns/<tab>` | Invalid submit | Inline field errors shown |
| Form sheet — Submitting | `/campaigns/<tab>` | Valid submit click | Spinner, fields disabled |
| Form sheet — Submit error | `/campaigns/<tab>` | POST/PATCH failure | Toast or field errors, form stays open |
| Form sheet — Discard dialog | `/campaigns/<tab>` | Cancel dirty edit form | Discard dialog overlay |
| Details — Loading | `/campaigns/[id]` | Page mount | Skeleton cards |
| Details — Found | `/campaigns/[id]` | GET success + found | Full campaign info, stats, info grid |
| Details — Not Found | `/campaigns/[id]` | GET 404 | Empty state + back button |
| Details — Load Error | `/campaigns/[id]` | GET failure | Error toast + back button |

---

## Decision Points

| # | Decision | Pass | Fail |
|---|----------|------|------|
| 1 | GET campaigns succeeds? | Render table rows | Show error toast + Retry button |
| 2 | Status tab changed? | Reset all filters & page, new GET | — |
| 3 | Category filter applied? | GET with `category` param | GET without category param |
| 4 | Location filter applied? | GET with `location` param | GET without location param |
| 5 | Selected location still in new tab's data? | Keep filter active | Auto-reset to "All Locations" |
| 6 | Sort changed? | Reset page to 1, new GET | — |
| 7 | Campaign status is `active`? | Enable Close icon | Disable Close icon |
| 8 | Campaign status is `closed`? | Disable Edit icon | Enable Edit icon (active/draft) |
| 9 | Edit pre-fetch (GET :id) succeeds? | Open form sheet pre-filled | Toast error, sheet does not open |
| 10 | Form fields pass client validation? | Call POST/PATCH API | Show inline field errors |
| 11 | POST/PATCH form succeeds? | Close sheet, update table | 409/422 → field errors / 500 → toast |
| 12 | Form dirty on cancel (edit mode)? | Show discard dialog | Close sheet directly |
| 13 | Admin confirms discard? | Close sheet, edits lost | Close dialog, form stays open |
| 14 | Closure reason ≥ 8 chars (trimmed)? | Enable Confirm Closure button | Keep button disabled |
| 15 | PATCH close succeeds? | Row → Closed, toast | Toast error, dialog stays open |
| 16 | DELETE campaign succeeds? | Remove row, toast | Toast error, dialog stays open |
| 17 | GET campaign by ID succeeds? | Render details page | Error toast + back button |
| 18 | Campaign ID found (200)? | Render details page | Render empty state (404) |

---

## Related Files

| File | Role |
|------|------|
| `src/app/dashboard/org-owner/campaigns/page.tsx` | Route entry — all campaigns tab (`status="all"`) |
| `src/app/dashboard/org-owner/campaigns/active/page.tsx` | Route entry — active tab (`status="active"`) |
| `src/app/dashboard/org-owner/campaigns/draft/page.tsx` | Route entry — draft tab (`status="draft"`) |
| `src/app/dashboard/org-owner/campaigns/closed/page.tsx` | Route entry — closed tab (`status="closed"`) |
| `src/app/dashboard/org-owner/campaigns/[id]/page.tsx` | Route entry — details page (resolves `id` param) |
| `src/components/pages/organization-campaigns/organization-campaigns-page.tsx` | List page logic — state, API calls, filter/sort/pagination, action handlers |
| `src/components/pages/organization-campaigns/organization-campaigns-filters.tsx` | Category filter, location filter, sort select controls |
| `src/components/pages/organization-campaigns/organization-campaigns-table.tsx` | Table layout — all columns and action buttons per row |
| `src/components/pages/organization-campaigns/campaign-form-sheet.tsx` | Create/Edit side panel with all form fields + dirty-check discard dialog |
| `src/components/pages/organization-campaigns/close-campaign-dialog.tsx` | Close confirmation dialog with required closure reason (min 8 chars) |
| `src/components/pages/organization-campaigns/delete-campaign-dialog.tsx` | Delete confirmation dialog (no reason required) |
| `src/components/pages/organization-campaigns/organization-campaign-details-page.tsx` | Full campaign details view — stats row, info grid, closure reason block |
| `src/components/pages/organization-campaigns/helpers.ts` | `formatAmount`, `getProgress`, `getCampaignStatusBadgeClass`, date helpers |
| `src/components/pages/organization-campaigns/static-data.ts` | Types, label maps, mock data |
| `src/components/pages/organization-campaigns/index.ts` | Public exports for the module |
