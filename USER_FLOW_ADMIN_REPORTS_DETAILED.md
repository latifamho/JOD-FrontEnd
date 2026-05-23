# User Flow: Admin Reports Management — Detailed (API Integration)
**JOD Platform — Admin Dashboard**

---

## Overview

This document is the **detailed, API-integrated** version of the Admin Reports Management user flow. It covers every screen, every API call, every loading state, every success path, and every error path — including what the UI shows the admin at each step.

**Root Route:** `/dashboard/admin/reports` — server-side redirect to `/dashboard/admin/reports/new`
**New Tab Route:** `/dashboard/admin/reports/new`
**In Progress Tab Route:** `/dashboard/admin/reports/in-progress`
**Closed Tab Route:** `/dashboard/admin/reports/closed`
**Role:** `admin`
**Main Components:** `ReportsManagementPage`, `ReportCard`, `ReportDetailsSheet`, `ReportsToolbar`

---

## Report Statuses

| Status | Badge Color | Description |
|--------|-------------|-------------|
| `new` | Blue | Newly submitted, not yet claimed by any admin |
| `in_progress` | Purple | Claimed and actively being reviewed |
| `waiting_response` | Amber | Waiting for a response from the reporter or related party |
| `closed` | Green | Review is complete, report is fully resolved |

## Report Severity Levels

| Severity | Badge Color | Description |
|----------|-------------|-------------|
| `critical` | Red | Severe violation requiring immediate action |
| `high` | Orange | Significant issue requiring prompt review |
| `medium` | Amber | Moderate concern, standard review |
| `low` | Green | Minor issue, low urgency |

## Report Entity Types

| Entity Type | Description |
|-------------|-------------|
| `post` | Report is about a specific post |
| `campaign` | Report is about a fundraising campaign |
| `user` | Report is about a user account |
| `organization` | Report is about an organization |

## Report Status Lifecycle

```
     [ new ]
        │
        │  Admin clicks "Claim"
        ▼
  [ in_progress ]
        │
        ├─── Admin clicks "Move to Waiting" ──► [ waiting_response ]
        │                                               │
        │                                               │ Admin clicks "Close"
        │                                               ▼
        │                                           [ closed ]
        │
        └─── Admin clicks "Close" ─────────────► [ closed ]
```

---

## API Endpoints Reference

| Action | Method | Endpoint |
|--------|--------|----------|
| Fetch reports by status | `GET` | `/api/admin/reports?status=<status>` |
| Fetch single report details | `GET` | `/api/admin/reports/:id` |
| Claim a report | `PATCH` | `/api/admin/reports/:id/claim` |
| Move report to waiting response | `PATCH` | `/api/admin/reports/:id/waiting` |
| Close a report | `PATCH` | `/api/admin/reports/:id/close` |

---

## Global Error Types

| Error Code | Meaning | UI Behavior |
|------------|---------|-------------|
| `401` | Unauthorized — session expired | Redirect to login page |
| `403` | Forbidden — not an admin | Show "Access Denied" page |
| `404` | Report not found | Show not-found empty state |
| `409` | Conflict — report already claimed by another admin | Toast: "Report was already claimed." |
| `500` | Server error | Show generic error toast |
| Network error | No response from server | Show "Connection failed, try again" toast |

---

## Root Redirect

```
Admin navigates to /dashboard/admin/reports
                    │
                    ▼
         Immediate server-side redirect
         No loading state — no API call
                    │
                    ▼
         /dashboard/admin/reports/new
```

---

## Screen 1: Reports List — Initial Load

```
Admin lands on /dashboard/admin/reports/new  (or any tab)
                    │
                    ▼
         Page mounts — trigger GET /api/admin/reports?status=new
                    │
                    ▼
┌───────────────────────────────────────────────────┐
│               LOADING STATE                       │
│                                                   │
│  Tab bar visible — active tab highlighted         │
│  Page header visible — result count shows "—"     │
│  Toolbar filters visible but disabled             │
│  Card grid shows skeleton cards (shimmer effect)  │
│  Pagination hidden or disabled                    │
└───────────────────────────────────────────────────┘
                    │
         ┌──────────┴──────────┐
      API Success           API Error
         │                     │
         ▼                     ▼
  Report cards render     ┌──────────────────────────┐
  Result count updates    │       ERROR STATE         │
  Filters enabled         │                           │
  Pagination visible      │  Toast (red):             │
                          │  "Failed to load          │
                          │   reports. Please         │
                          │   try again."             │
                          │                           │
                          │  Card grid shows empty    │
                          │  [ Retry ] button         │
                          └──────────────────────────┘
                                       │
                                 Admin clicks Retry
                                       │
                                       ▼
                              Re-trigger GET request
                              (returns to loading state)
```

### Success — Reports List Layout

```
┌───────────────────────────────────────────────────┐
│             REPORTS MANAGEMENT PAGE               │
│                                                   │
│  Tab Bar                                          │
│  ┌────────────────────────────────────────────┐   │
│  │  [ New ]   [ In Progress ]   [ Closed ]    │   │
│  │    ↑ active tab highlighted                │   │
│  └────────────────────────────────────────────┘   │
│                                                   │
│  Header                                           │
│  ┌────────────────────────────────────────────┐   │
│  │  Title: "Reports Management — New"         │   │
│  │  Subtitle: "Current results: 3 reports"    │   │
│  └────────────────────────────────────────────┘   │
│                                                   │
│  Toolbar (2 filters in a 4-column grid)           │
│  ┌──────────────────┐  ┌──────────────────┐       │
│  │ Severity         │  │ Entity Type      │       │
│  │ [▾ All Levels  ] │  │ [▾ All Types   ] │       │
│  └──────────────────┘  └──────────────────┘       │
│                                                   │
│  Card Grid  (1 col → 2 col → 3 col responsive)    │
│  ┌────────────────┐  ┌────────────────┐           │
│  │ [New] [Medium] │  │ [New] [Critic] │  ...      │
│  │ REP-3001       │  │ REP-3002       │           │
│  │ Report title   │  │ Report title   │           │
│  └────────────────┘  └────────────────┘           │
│                                                   │
│  Pagination Controls                              │
│  [ < ]  [1] [2] ... [N]  [ > ]   Page: [10 ▾]    │
└───────────────────────────────────────────────────┘
```

---

## Tab Navigation Flow

```
Admin clicks a different tab
                    │
                    ▼
         Navigate to the tab's route
                    │
                    ▼
         ReportsManagementPage re-mounts
         with new status prop
                    │
                    ▼
         All filters reset to "all"
         Page resets to 1
                    │
                    ▼
         GET /api/admin/reports?status=<new tab>
         (returns to loading state for that tab)

Tab → Status prop mapping:
  [ New ]          → status = "new"
  [ In Progress ]  → status = "in_progress"
  [ Closed ]       → status = "closed"

Note: "waiting_response" has no dedicated tab.
  Reports moved to this state disappear from
  the In Progress list and are only accessible
  via direct link or the details sheet of a
  known report ID.
```

---

## Filter Flow (Client-Side)

Filtering runs entirely in the browser against already-loaded data for the active tab. No additional API calls are made.

```
Admin changes Severity or Entity Type filter
                    │
                    ▼
         Filters applied in memory
         (always combined with the active tab's status)
                    │
                    ▼
         Current page resets to 1
         Result count in header updates
                    │
         ┌──────────┴──────────┐
   Cards found             No cards match
         │                     │
         ▼                     ▼
  Card grid renders        EMPTY STATE shown:
  matching reports          [ Reports icon ]
                            "No Matching Reports"
                            "Try changing the filters
                             to see more results."

Severity filter options:
  • All Severity Levels  (default)
  • Critical
  • High
  • Medium
  • Low

Entity Type filter options:
  • All Types  (default)
  • Post
  • Campaign
  • User
  • Organization

Sort: always fixed — newest created first (no sort control exposed)
```

---

## Pagination Flow (Client-Side)

```
Admin clicks a page number or changes page size
                    │
                    ▼
         Filtered reports sliced by [startIndex → endIndex]
         No API call — pagination is client-side
                    │
                    ▼
         Card grid renders the current page slice

Controls:
  [ ‹ ]  [1] [2] … [N]  [ › ]   Page size: [10 ▾]

Note: any filter change resets page → 1
      any page size change resets page → 1
      switching tabs resets page → 1
```

---

## Report Card Layout

```
┌────────────────────────────────────────────────────┐
│  [ Status ]  [ Severity ]  [ Entity Type ]  [ ID ] │
│                                              Date ↗ │
│                                                     │
│  Report Title (bold)                                │
│  Report description — 2 lines max,                  │
│  truncated with "…" if longer                       │
│                                                     │
│  ┌────────────────────────────────────────────┐    │
│  │ Org: <name>        Reporter: User #XXXX   │    │
│  │ Entity: <ID>       Assignee: <name / —>   │    │
│  └────────────────────────────────────────────┘    │
│                                                     │
│  Footer buttons — vary by status:                   │
│  new              → [ View Details ]  [ Claim ]     │
│  in_progress      → [ View Details ]                │
│                      [ Move to Waiting ]  [ Close ] │
│  waiting_response → [ View Details ]  [ Close ]     │
│  closed           → [ View Details ]                │
└────────────────────────────────────────────────────┘
```

---

## Card Action 1: View Report Details

```
Admin clicks [ View Details ] on a card
                    │
                    ▼
         ReportDetailsSheet opens (slides in from right)
         No additional API call — uses data already
         loaded into the card's report prop
                    │
                    ▼
         Sheet displays full report information
         (see Screen 2: Report Details Sheet below)
```

---

## Card Action 2: Claim Report

Available only on cards where `report.status === "new"`.

```
Admin clicks [ Claim ] on a card
                    │
                    ▼
         Button shows loading spinner
         Card becomes non-interactive
                    │
                    ▼
         PATCH /api/admin/reports/:id/claim
         Body: {
           status: "in_progress",
           assignee: "<current admin identifier>",
           timelineEntry: {
             action: "Claim Report",
             actor: "<current admin identifier>",
             at: <ISO timestamp>
           }
         }
                    │
         ┌──────────┴──────────┐
      API Success           API Error
         │                     │
         ▼                     ▼
  Report state updates:   Spinner removed
    status → "in_progress" Card re-enabled
    assignee → admin name       │
  New timeline entry       ▼
  appended             ┌──────────────────────┐
  Card moves out of    │     Error type?       │
  the New list on      └──────────────────────┘
  next render                  │
  (status no longer   ┌────────┴────────┐
   matches "new")   409 Conflict    500 / Network
                        │                │
  Toast (green):        ▼                ▼
  "Report claimed   Toast (amber):  Toast (red):
   successfully."  "Report was      "Failed to claim
                   already claimed  report. Please
                   by another       try again."
                   admin."
```

---

## Card Action 3: Move to Waiting

Available only on cards where `report.status === "in_progress"`.

```
Admin clicks [ Move to Waiting ] on a card
                    │
                    ▼
         No confirmation dialog
         Button shows loading spinner
         Card becomes non-interactive
                    │
                    ▼
         PATCH /api/admin/reports/:id/waiting
         Body: {
           status: "waiting_response",
           timelineEntry: {
             action: "Request Additional Info",
             actor: "<assignee name>",
             at: <ISO timestamp>
           }
         }
                    │
         ┌──────────┴──────────┐
      API Success           API Error
         │                     │
         ▼                     ▼
  Report state updates:   Spinner removed
    status →              Card re-enabled
    "waiting_response"         │
  New timeline entry           ▼
  appended                Toast (red):
  Card moves out of       "Failed to update
  In Progress list        report. Please
  (status no longer        try again."
   matches "in_progress")

  Toast (green):
  "Report moved to
   waiting response."
```

---

## Card Action 4: Close Report

Available on cards where `report.status === "in_progress"` or `report.status === "waiting_response"`.

```
Admin clicks [ Close ] on a card
                    │
                    ▼
         No confirmation dialog
         Button shows loading spinner
         Card becomes non-interactive
                    │
                    ▼
         PATCH /api/admin/reports/:id/close
         Body: {
           status: "closed",
           timelineEntry: {
             action: "Close Report",
             actor: "<assignee name>",
             at: <ISO timestamp>,
             note: "Closed after review complete."
           }
         }
                    │
         ┌──────────┴──────────┐
      API Success           API Error
         │                     │
         ▼                     ▼
  Report state updates:   Spinner removed
    status → "closed"     Card re-enabled
  New timeline entry           │
  appended                     ▼
  Card moves out of       Toast (red):
  current list            "Failed to close
  (status no longer        report. Please
   matches active tab)     try again."

  Toast (green):
  "Report closed
   successfully."
```

---

## Screen 2: Report Details Sheet — Open

```
Admin clicks [ View Details ] on any card
                    │
                    ▼
         Sheet slides in from the right
         Report data is already loaded — no API call
                    │
                    ▼
┌───────────────────────────────────────────────────┐
│              REPORT DETAILS SHEET                 │
│  (max width 2xl, scrollable body)                 │
│                                                   │
│  Header                                           │
│  ┌─────────────────────────────────────────────┐  │
│  │  [ Status ]  [ Severity ]  [ Entity ]  [ID] │  │
│  │  Report Title                               │  │
│  │  Full report description text               │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  Section 1 — Report Details                       │
│  ┌─────────────────────────────────────────────┐  │
│  │  Reported Entity:  <entityId>               │  │
│  │  Organization:     <organizationName>       │  │
│  │  Reporter:         <reporterName>           │  │
│  │  Created At:       <formatted datetime>     │  │
│  │  Current Assignee: <name / Unassigned>      │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  Section 2 — Attached Evidence                    │
│  ┌─────────────────────────────────────────────┐  │
│  │  ┌─────────────────────────────────────┐    │  │
│  │  │ Label: <evidence label>             │    │  │
│  │  │ Type:  link / image / document      │    │  │
│  │  │ Value: <url or filename>            │    │  │
│  │  └─────────────────────────────────────┘    │  │
│  │  (one item per evidence entry)              │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  Section 3 — Action Timeline                      │
│  ┌─────────────────────────────────────────────┐  │
│  │  ┌─────────────────────────────────────┐    │  │
│  │  │ Action: <action label>              │    │  │
│  │  │ Actor:  <who performed it>          │    │  │
│  │  │ Time:   <formatted datetime>        │    │  │
│  │  │ Note:   <optional note>             │    │  │
│  │  └─────────────────────────────────────┘    │  │
│  │  (one entry per timeline item)              │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  Footer — status-based action buttons             │
│  ┌─────────────────────────────────────────────┐  │
│  │  new              → [ Claim Report ]        │  │
│  │  in_progress      → [ Move to Waiting ]     │  │
│  │                      [ Close Report ]       │  │
│  │  waiting_response → [ Close Report ]        │  │
│  │  closed           → (no buttons, read-only) │  │
│  └─────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────┘
```

### Sheet Action: Claim Report (from Sheet Footer)

```
Admin clicks [ Claim Report ] in the sheet footer
                    │
                    ▼
         Same API call as Card Action 2
         PATCH /api/admin/reports/:id/claim
                    │
         ┌──────────┴──────────┐
      API Success           API Error
         │                     │
         ▼                     ▼
  Sheet footer updates:   Toast (red or amber)
  Claim button replaced   Footer buttons re-enabled
  with in_progress        Sheet stays open
  action buttons:
    [ Move to Waiting ]
    [ Close Report ]
  Timeline section
  appends new entry
  in real time

  Toast (green):
  "Report claimed
   successfully."
```

### Sheet Action: Move to Waiting (from Sheet Footer)

```
Admin clicks [ Move to Waiting ] in the sheet footer
                    │
                    ▼
         Same API call as Card Action 3
         PATCH /api/admin/reports/:id/waiting
                    │
         ┌──────────┴──────────┐
      API Success           API Error
         │                     │
         ▼                     ▼
  Sheet footer updates:   Toast (red)
  Buttons replaced with:  Footer buttons re-enabled
    [ Close Report ]      Sheet stays open
  Status badge in
  header updates →
  "Waiting Response"
  Timeline section
  appends new entry

  Toast (green):
  "Report moved to
   waiting response."
```

### Sheet Action: Close Report (from Sheet Footer)

```
Admin clicks [ Close Report ] in the sheet footer
                    │
                    ▼
         Same API call as Card Action 4
         PATCH /api/admin/reports/:id/close
                    │
         ┌──────────┴──────────┐
      API Success           API Error
         │                     │
         ▼                     ▼
  Sheet footer clears:    Toast (red)
  No action buttons       Footer buttons re-enabled
  (read-only state)       Sheet stays open
  Status badge in
  header updates →
  "Closed" (green)
  Timeline section
  appends new entry

  Toast (green):
  "Report closed
   successfully."
```

### Sheet Close

```
Admin clicks the [ × ] close button on the sheet
                    │
                    ▼
         Sheet dismisses — slides out
         No API call
         No changes lost
         Card grid remains in the background
```

---

## Complete Flow Diagram — All Actions with API

```
/dashboard/admin/reports  (root)
            │
            ▼  server-side redirect (no API)
/dashboard/admin/reports/new
            │
            ▼
  GET /api/admin/reports?status=new
            │
   ┌────────┴────────┐
 Error            Success
   │                 │
 Toast +          Cards render
 Retry btn        (sorted newest first)
                       │
                       ├── Tab click ──────────────► Navigate to /reports/[tab]
                       │                              Filters + page reset to 1
                       │                              GET /api/admin/reports?status=<tab>
                       │
                       ├── Filter Severity ────────► Client-side, no API, page → 1
                       ├── Filter Entity Type ─────► Client-side, no API, page → 1
                       ├── Paginate ───────────────► Client-side, no API
                       │
                       ├── [ View Details ] ────────► Open ReportDetailsSheet
                       │                              No API call — uses loaded report data
                       │                                    │
                       │                            Sheet sections rendered:
                       │                              • Report Details
                       │                              • Attached Evidence
                       │                              • Action Timeline
                       │                                    │
                       │                            Footer actions (by status):
                       │                              new              → Claim Report
                       │                              in_progress      → Move to Waiting
                       │                                                  Close Report
                       │                              waiting_response → Close Report
                       │                              closed           → (none)
                       │                                    │
                       │                       Each sheet footer action calls
                       │                       same API as card action below ↓
                       │
                       ├── [ Claim ] (new) ─────────► PATCH /api/admin/reports/:id/claim
                       │                                    │
                       │                         ┌──────────┴──────────┐
                       │                      Error                  Success
                       │                         │                     │
                       │                   409 → Toast (amber)  status → in_progress
                       │                   "Already claimed"    assignee set
                       │                   500 → Toast (red)    Timeline entry added
                       │                                        Card exits New list
                       │                                        Toast (green)
                       │
                       ├── [ Move to Waiting ] ────► PATCH /api/admin/reports/:id/waiting
                       │   (in_progress only)               │
                       │                         ┌──────────┴──────────┐
                       │                      Error                  Success
                       │                         │                     │
                       │                    Toast (red)        status → waiting_response
                       │                    No change          Timeline entry added
                       │                                       Card exits In Progress list
                       │                                       Toast (green)
                       │
                       └── [ Close ] ───────────────► PATCH /api/admin/reports/:id/close
                           (in_progress or                  │
                            waiting_response)      ┌────────┴────────┐
                                                Error           Success
                                                   │               │
                                              Toast (red)   status → closed
                                              No change     Timeline entry added
                                                            Card exits current list
                                                            Toast (green)
```

---

## Toast Notification Reference

| Action | Success Toast | Error Toast |
|--------|--------------|-------------|
| Load reports list | *(silent)* | "Failed to load reports. Please try again." |
| Claim report | "Report claimed successfully." | 409: "Report was already claimed by another admin." · 500: "Failed to claim report. Please try again." |
| Move to waiting | "Report moved to waiting response." | "Failed to update report. Please try again." |
| Close report | "Report closed successfully." | "Failed to close report. Please try again." |

---

## Loading & Disabled States Reference

| UI Element | Loading Behavior |
|------------|-----------------|
| Report card grid (initial load) | Skeleton shimmer cards, toolbar filters disabled |
| Claim button (card) | Spinner on button, entire card non-interactive |
| Move to Waiting button (card) | Spinner on button, entire card non-interactive |
| Close button (card) | Spinner on button, entire card non-interactive |
| Claim Report button (sheet footer) | Spinner on button, all footer buttons disabled |
| Move to Waiting button (sheet footer) | Spinner on button, all footer buttons disabled |
| Close Report button (sheet footer) | Spinner on button, all footer buttons disabled |

---

## All Screens & States

| State | Location | Trigger | Description |
|-------|----------|---------|-------------|
| Root redirect | `/reports` | Page load | Server redirects to `/reports/new`, no loading |
| List — Loading | `/reports/[tab]` | Page mount or tab switch | Skeleton cards, toolbar disabled |
| List — Loaded | `/reports/[tab]` | GET success | Card grid with all matching reports |
| List — Load Error | `/reports/[tab]` | GET failure | Toast error + Retry button |
| List — Filtered | `/reports/[tab]` | Filter change | Narrowed cards, page reset to 1 |
| List — Empty (filter) | `/reports/[tab]` | No filter matches | "No Matching Reports" empty state |
| List — Empty (no reports) | `/reports/[tab]` | Tab has 0 reports | "No Matching Reports" empty state |
| Claim — Loading | `/reports/new` | Claim button click | Spinner on button, card non-interactive |
| Claim — Success | `/reports/new` | PATCH success | Status → in_progress, card exits New list |
| Claim — Conflict | `/reports/new` | PATCH 409 | Toast (amber) "already claimed", card re-enabled |
| Claim — Error | `/reports/new` | PATCH 500 | Toast (red), card re-enabled |
| Move to Waiting — Loading | `/reports/in-progress` | Button click | Spinner on button, card non-interactive |
| Move to Waiting — Success | `/reports/in-progress` | PATCH success | Status → waiting_response, card exits list |
| Move to Waiting — Error | `/reports/in-progress` | PATCH failure | Toast (red), card re-enabled |
| Close — Loading | `/reports/in-progress` or waiting | Button click | Spinner on button, card non-interactive |
| Close — Success | `/reports/in-progress` or waiting | PATCH success | Status → closed, card exits list |
| Close — Error | `/reports/in-progress` or waiting | PATCH failure | Toast (red), card re-enabled |
| Details sheet — Open | `/reports/[tab]` | View Details click | Sheet slides in from right |
| Details sheet — Claim loading | `/reports/[tab]` | Sheet footer Claim click | Spinner, footer buttons disabled |
| Details sheet — Claim success | `/reports/[tab]` | PATCH success | Footer updates to in_progress actions |
| Details sheet — Move to Waiting loading | `/reports/[tab]` | Sheet footer button | Spinner, footer buttons disabled |
| Details sheet — Move to Waiting success | `/reports/[tab]` | PATCH success | Footer updates to waiting_response actions |
| Details sheet — Close loading | `/reports/[tab]` | Sheet footer Close click | Spinner, footer buttons disabled |
| Details sheet — Close success | `/reports/[tab]` | PATCH success | Footer clears, badge → Closed (green) |
| Details sheet — Action error | `/reports/[tab]` | Any PATCH failure | Toast (red), footer buttons re-enabled |
| Details sheet — Closed status | `/reports/[tab]` | Report is closed | Sheet is read-only, no footer buttons |
| Details sheet — Dismissed | `/reports/[tab]` | × button click | Sheet slides out, no API call |

---

## Decision Points

| # | Decision | Pass | Fail |
|---|----------|------|------|
| 1 | GET reports list succeeds? | Render card grid | Toast error + Retry button |
| 2 | Active tab has matching reports? | Render cards | Show "No Matching Reports" empty state |
| 3 | Severity filter applied? | Show only matching severity | Show all |
| 4 | Entity type filter applied? | Show only matching entity type | Show all |
| 5 | Combined filters have results? | Render matching cards | Show "No Matching Reports" empty state |
| 6 | PATCH claim succeeds? | Status → in_progress, assignee set, card exits New | 409 toast or 500 toast, no state change |
| 7 | Report already claimed by another admin (409)? | — | Toast (amber): "Already claimed", re-enable card |
| 8 | PATCH move-to-waiting succeeds? | Status → waiting_response, card exits In Progress | Toast (red), no state change |
| 9 | PATCH close succeeds? | Status → closed, card exits current list | Toast (red), no state change |
| 10 | Report status is `new`? | Show Claim button on card and sheet | Hide Claim button |
| 11 | Report status is `in_progress`? | Show Move to Waiting + Close on card and sheet | Hide those buttons |
| 12 | Report status is `waiting_response`? | Show Close button only on card and sheet | Hide all action buttons |
| 13 | Report status is `closed`? | Sheet is read-only, no footer buttons | — |
| 14 | Report has an assignee? | Display assignee name | Display "Unassigned" |

---

## Related Files

| File | Role |
|------|------|
| `src/app/dashboard/admin/reports/page.tsx` | Root route — server-side redirect to `/reports/new` |
| `src/app/dashboard/admin/reports/new/page.tsx` | New tab — passes `status="new"` to `ReportsManagementPage` |
| `src/app/dashboard/admin/reports/in-progress/page.tsx` | In Progress tab — passes `status="in_progress"` |
| `src/app/dashboard/admin/reports/closed/page.tsx` | Closed tab — passes `status="closed"` |
| `src/components/pages/reports-management/reports-management-page.tsx` | Shared page logic — state, filters, pagination, all action handlers |
| `src/components/pages/reports-management/report-card.tsx` | Individual report card — badges, meta info, action buttons, sheet trigger |
| `src/components/pages/reports-management/report-details-sheet.tsx` | Full report details side-sheet — evidence, timeline, footer actions |
| `src/components/pages/reports-management/reports-toolbar.tsx` | Severity and entity type filter dropdowns |
| `src/components/pages/reports-management/helpers.ts` | Badge class helpers for status and severity |
| `src/components/pages/reports-management/static-data.ts` | Types, labels, and mock report data |
| `src/components/pages/reports-management/index.ts` | Public exports for the module |
