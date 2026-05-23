# User Flow: Admin Campaigns Review — Detailed (API-Integrated)
**JOD Platform — Admin Dashboard**

---

## Overview

This document describes the end-to-end user flow for reviewing campaigns inside the admin dashboard. The section spans three tab routes sharing a single page component: campaigns pending review, approved campaigns, and rejected campaigns. Admins can filter by organization, sort results, view full campaign details in a side panel, approve a pending campaign instantly, or reject it with a required rejection reason. All data fetching, filtering, sorting, and pagination are server-side API operations.

**Review Route:** `/dashboard/admin/campaigns/review`
**Approved Route:** `/dashboard/admin/campaigns/approved`
**Rejected Route:** `/dashboard/admin/campaigns/rejected`
**Role:** `admin`
**Main Components:** `CampaignsReviewPage`, `CampaignReviewToolbar`, `ReviewCampaignCard`, `CampaignDetailsDialog`, `RejectCampaignDialog`

---

## Campaign Moderation Statuses

| Status | Badge Color | Description |
|--------|-------------|-------------|
| `pending` | Amber | Campaign submitted by organization, awaiting admin review |
| `approved` | Green | Campaign reviewed and accepted by admin |
| `rejected` | Red | Campaign reviewed and rejected by admin with a reason |

## Campaign Categories

| Category | Label |
|----------|-------|
| `health` | Health |
| `education` | Education |
| `shelter` | Shelter |
| `food` | Food |
| `emergency` | Emergency |

---

## Entry Points

| Source | Route |
|--------|-------|
| Admin sidebar — Campaigns (Review tab) | `/dashboard/admin/campaigns/review` |
| Admin sidebar — Campaigns (Approved tab) | `/dashboard/admin/campaigns/approved` |
| Admin sidebar — Campaigns (Rejected tab) | `/dashboard/admin/campaigns/rejected` |
| Direct URL | Any of the three routes above |

---

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/admin/campaigns` | Fetch paginated campaigns with server-side filter & sort |
| `PATCH` | `/api/admin/campaigns/:id/approve` | Approve a pending campaign |
| `PATCH` | `/api/admin/campaigns/:id/reject` | Reject a pending campaign with a reason |
| `DELETE` | `/api/admin/campaigns/:id` | Delete a campaign permanently (not in current UI) |

### GET Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | `pending \| approved \| rejected` | _(required)_ | Filter by moderation status (tab) |
| `page` | `number` | `1` | Current page number |
| `pageSize` | `number` | `10` | Items per page |
| `sortBy` | `title \| submitted_at` | `submitted_at` | Field to sort by |
| `order` | `asc \| desc` | `desc` | Sort direction |
| `organization` | `string` | _(omitted = all)_ | Filter by organization name |

### PATCH `/approve` Request Body
```json
{}
```

### PATCH `/reject` Request Body
```json
{
  "reason": "string (min 8 characters)"
}
```

### `DELETE` Request Body
```json
{}
```

---

## Global API Error Handling

| HTTP Status | Meaning | UI Behavior |
|-------------|---------|-------------|
| `401` Unauthorized | Session expired | Redirect to `/login` |
| `403` Forbidden | Not an admin | Show "Access Denied" toast (red), stay on page |
| `404` Not Found | Campaign no longer exists | Show error toast (red), refresh list |
| `422` Unprocessable | Validation failed (e.g., reason too short) | Show field-level error message |
| `500` Server Error | Internal server error | Show "Something went wrong" toast (red) |
| Network Error | No connectivity | Show "Network error, please try again" toast (red) |

---

## Screen 1: Campaigns List — Page Load

```
Admin navigates to /dashboard/admin/campaigns/review
(or /approved or /rejected)
                    │
                    ▼
         API call dispatched immediately
         GET /api/admin/campaigns
           ?status=pending          ← from route prop
           &page=1
           &pageSize=10
           &sortBy=submitted_at
           &order=desc
                    │
         ┌──────────┴──────────┐
    Loading state          API responds
         │                     │
         ▼              ┌──────┴──────┐
   Skeleton cards     Success       Error
   (3×2 grid)            │             │
                          ▼             ▼
                    Cards render    Error banner
                    with data       + Retry button
```

### Loading State (Skeleton)

```
┌───────────────────────────────────────────────────┐
│           CAMPAIGNS REVIEW PAGE (Loading)         │
│                                                   │
│  Toolbar                                          │
│  ┌──────────────────────────────────────────────┐ │
│  │  Campaigns Review — Pending Review           │ │
│  │  Results: —                                  │ │
│  │  [ Sort ▾ ]  [ Organization ▾ ]              │ │
│  └──────────────────────────────────────────────┘ │
│                                                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │ ░░░░░░░░░░░ │ │ ░░░░░░░░░░░ │ │ ░░░░░░░░░░░ │ │
│  │ ░░░░░░░     │ │ ░░░░░░░     │ │ ░░░░░░░     │ │
│  │ ░░░░░░░░░░░ │ │ ░░░░░░░░░░░ │ │ ░░░░░░░░░░░ │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │ ░░░░░░░░░░░ │ │ ░░░░░░░░░░░ │ │ ░░░░░░░░░░░ │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ │
└───────────────────────────────────────────────────┘
```

### Error State

```
┌───────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────┐  │
│  │  ⚠ Failed to load campaigns.               │  │
│  │     [ Retry ]                               │  │
│  └─────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────┘

Admin clicks [ Retry ]
     │
     ▼
GET /api/admin/campaigns?status=<current>&... (same params)
     │
  ┌──┴──┐
Success  Error
  │        │
Cards    Error banner remains
render
```

### Success State Layout

```
┌───────────────────────────────────────────────────┐
│              CAMPAIGNS REVIEW PAGE                │
│                                                   │
│  Toolbar                                          │
│  ┌──────────────────────────────────────────────┐ │
│  │  Campaigns Review — Pending Review           │ │
│  │  Results: 6 campaigns                        │ │
│  │  [ Sort: Newest Submitted ▾ ]  [ Org ▾ ]    │ │
│  └──────────────────────────────────────────────┘ │
│                                                   │
│  Campaign Cards (3-column grid on large screens)  │
│  ┌───────────────┐ ┌───────────────┐ ┌──────────┐ │
│  │ [Pending][Health][CAM-2001]     │ ...         │ │
│  │ Submitted: 25 Feb 2026          │             │ │
│  │                                 │             │ │
│  │ Campaign Title Here             │             │ │
│  │ Short summary text (2 lines)    │             │ │
│  │                                 │             │ │
│  │ [Progress bar ────────── 19%]   │             │ │
│  │ Goal: 480,000 SAR               │             │ │
│  │ Raised: 92,000 SAR              │             │ │
│  │                                 │             │ │
│  │ Org: XYZ  Beneficiaries: 75     │             │ │
│  │ City: Riyadh                    │             │ │
│  │                                 │             │ │
│  │ [View Details] [Approve][Reject]│             │ │
│  └───────────────┘                 └────────────┘ │
│                                                   │
│  Pagination Controls                              │
│  [ < ]  [1] [2] ... [N]  [ > ]   Page: [10 ▾]   │
└───────────────────────────────────────────────────┘
```

---

## Tabs (Status Routes)

The three routes share the same `CampaignsReviewPage` component. The `status` prop changes the API query and the toolbar title.

```
Admin clicks a tab (Review / Approved / Rejected)
                    │
                    ▼
         Route changes to matching path
                    │
                    ▼
         Page re-mounts with new status prop
                    │
                    ▼
         Filters reset to defaults
         Page resets to 1
                    │
                    ▼
         GET /api/admin/campaigns?status=<new_status>&page=1&...
                    │
                    ▼
         Skeleton → Success / Error
```

| Tab | Route | Status Prop |
|-----|-------|------------|
| Pending Review | `/campaigns/review` | `pending` |
| Approved | `/campaigns/approved` | `approved` |
| Rejected | `/campaigns/rejected` | `rejected` |

---

## Server-Side Filter, Sort & Pagination

All filter, sort, and pagination changes trigger a new API request. There is no client-side data manipulation.

```
Admin changes any filter, sort, or page parameter
                    │
                    ▼
         State updates (filter/sort/page values)
                    │
                    ▼
         Page resets to 1 (if filter or sort changed)
                    │
                    ▼
         GET /api/admin/campaigns
           ?status=<current_tab>
           &page=<new_page>
           &pageSize=<current_size>
           &sortBy=<field>
           &order=<asc|desc>
           &organization=<name|omit>
                    │
         ┌──────────┴──────────┐
       Loading               API responds
         │                      │
    Skeleton shown       ┌──────┴──────┐
                       Success       Error
                          │             │
                     Cards update  Toast (red)
                                   Old data stays
```

### Sort Options

| Option | `sortBy` | `order` |
|--------|----------|---------|
| Title — A → Z | `title` | `asc` |
| Title — Z → A | `title` | `desc` |
| Submission Date — Newest (default) | `submitted_at` | `desc` |
| Submission Date — Oldest | `submitted_at` | `asc` |

### Organization Filter

```
Admin opens Organization dropdown
                    │
                    ▼
         Dropdown lists organizations
         (populated from API response metadata
          or a separate GET /api/admin/campaigns/organizations
          endpoint filtered by current status)
                    │
         Admin types in inline search box
                    │
                    ▼
         Dropdown options filtered client-side (display only)
                    │
         Admin selects an organization name
                    │
                    ▼
         GET /api/admin/campaigns?...&organization=<name>
                    │
         ┌──────────┴──────────┐
       Success               Error
         │                      │
    Cards update           Toast (red)

If selected organization disappears from results
(e.g., all its campaigns moved to another status tab):
         │
         ▼
    Filter resets to "All Organizations"
    API re-fetched without organization param
```

Filter Options:
- All Organizations (default)
- `<dynamic list from API response metadata, sorted A–Z>`

### Pagination

```
Admin changes page or page size
                    │
                    ▼
         GET /api/admin/campaigns?...&page=<N>&pageSize=<X>
                    │
         ┌──────────┴──────────┐
       Success               Error
         │                      │
    Cards update           Toast (red)
    Pagination re-renders  Old page stays
```

Pagination controls:
- Previous / Next buttons
- Numbered page buttons
- Page size selector: `[10 ▾]` (options: 10, 20, 50)

---

## Campaign Card Layout

Each campaign renders as a card with the following sections:

```
┌─────────────────────────────────────────────────┐
│  Header Row                                     │
│  [ Status Badge ] [ Category Badge ] [ ID ]     │
│                              Submitted: <date>  │
│                                                 │
│  Campaign Title                                 │
│  Summary text (2 lines max, truncated)          │
│                                                 │
│  Funding Progress Block                         │
│  ┌─────────────────────────────────────────┐   │
│  │  Progress                        NN%    │   │
│  │  [████████░░░░░░░░░░░░░░░░░░░░░░░░░░░] │   │
│  │  Goal: NNN,NNN SAR                      │   │
│  │  Raised: NNN,NNN SAR                    │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Meta Block                                     │
│  ┌─────────────────────────────────────────┐   │
│  │  Organization: <name>                   │   │
│  │  Beneficiaries: <count>                 │   │
│  │  City: <city>                           │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Rejection Reason Block (only if rejected)      │
│  ┌─────────────────────────────────────────┐   │
│  │  Rejection Reason:                      │   │
│  │  <reason text, 2 lines max>             │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Action Buttons                                 │
│  [ View Details ]                               │
│  [ Approve ]  [ Reject ]  ← only when pending   │
└─────────────────────────────────────────────────┘
```

---

## Action 1: View Campaign Details

```
Admin clicks [ View Details ] on any card
                    │
                    ▼
         CampaignDetailsDialog opens (side Sheet panel)
         Data displayed from existing card state
         No separate API call for basic details
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│                 CAMPAIGN DETAILS PANEL                │
│                                                      │
│  [ Status Badge ] [ Category Badge ] [ ID ]          │
│                                                      │
│  Funding Progress Block                              │
│  ┌──────────────────────────────────────────────┐   │
│  │  Progress                             NN%    │   │
│  │  [██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] │   │
│  │  Goal: NNN,NNN SAR                           │   │
│  │  Raised: NNN,NNN SAR                         │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  Information Grid (2 columns)                        │
│  ┌─────────────────────┬────────────────────────┐   │
│  │ Organization        │ Campaign Manager        │   │
│  │ <name>              │ <name>                  │   │
│  ├─────────────────────┼────────────────────────┤   │
│  │ City                │ Beneficiaries           │   │
│  │ <city>              │ <count>                 │   │
│  ├─────────────────────┼────────────────────────┤   │
│  │ Start Date          │ End Date                │   │
│  │ <date>              │ <date>                  │   │
│  ├─────────────────────┼────────────────────────┤   │
│  │ Submitted At        │ Last Reviewed By        │   │
│  │ <datetime>          │ <name or —>             │   │
│  └─────────────────────┴────────────────────────┘   │
│                                                      │
│  Campaign Summary                                    │
│  ┌──────────────────────────────────────────────┐   │
│  │  <full summary text>                         │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  Rejection Reason Block (only if status = rejected)  │
│  ┌──────────────────────────────────────────────┐   │
│  │  Previous Rejection Reason:                  │   │
│  │  <full reason text>                          │   │
│  └──────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘

Admin clicks outside panel or presses Escape
                    │
                    ▼
         Panel closes, campaign list unchanged
```

---

## Action 2: Approve Campaign

```
Admin clicks [ Approve ] on a pending campaign card
                    │
                    ▼
         No confirmation dialog
         Button shows spinner immediately
                    │
                    ▼
         PATCH /api/admin/campaigns/:id/approve
                    │
         ┌──────────┴──────────┐
       Success               Error
         │                      │
         ▼                      ▼
  Campaign status          Spinner stops
  → "approved"             Toast (red): "Failed to approve campaign"
  Card moves away          Card stays unchanged
  from /review tab
  (list re-fetches)
         │
         ▼
  Toast (green): "Campaign approved successfully"
  GET /api/admin/campaigns?status=pending&... re-fetched
  Card disappears from current list
```

---

## Action 3: Reject Campaign

```
Admin clicks [ Reject ] on a pending campaign card
                    │
                    ▼
┌──────────────────────────────────────────────────┐
│              REJECT CAMPAIGN DIALOG              │
│                                                  │
│  "Reject Campaign"                               │
│  "Enter a rejection reason. It will be sent to  │
│   the organization with the review notification."│
│                                                  │
│  Campaign: <title displayed as read-only field>  │
│                                                  │
│  Rejection Reason *                              │
│  ┌──────────────────────────────────────────┐   │
│  │  (textarea, min height)                  │   │
│  │  Example: Please attach the operational  │   │
│  │  plan and required documents before      │   │
│  │  resubmitting...                         │   │
│  └──────────────────────────────────────────┘   │
│  Minimum: 8 characters                           │
│                                                  │
│  [ Cancel ]          [ Confirm Rejection ]       │
│                       ↑ disabled if < 8 chars    │
└──────────────────────────────────────────────────┘

                    │
       ┌────────────┴────────────┐
  Cancel clicked          Confirm clicked
       │                          │
       ▼                          ▼
  Dialog closes         Textarea content validated
  No change             (min 8 chars, trimmed)
                                  │
                         ┌────────┴─────────┐
                    < 8 chars            ≥ 8 chars
                         │                   │
                    Button stays         PATCH /api/admin/campaigns/:id/reject
                    disabled             { "reason": "<trimmed text>" }
                                                  │
                                       ┌──────────┴──────────┐
                                     Success               Error
                                         │                    │
                                         ▼                    ▼
                                  Campaign status       Toast (red):
                                  → "rejected"         "Failed to reject campaign"
                                  rejectionReason      Dialog stays open
                                  → stored text
                                  Dialog closes
                                         │
                                         ▼
                                  Toast (green):
                                  "Campaign rejected"
                                  GET re-fetched for
                                  current status tab
                                  Card disappears from
                                  /review tab
```

---

## Action 4: Delete Campaign (Not in Current UI)

> **Note:** The current campaigns implementation does not include a delete action. Campaigns can only be approved or rejected. The DELETE endpoint is listed below for completeness and potential future use.

```
(Future UI) Admin clicks [ Delete ] on a campaign
                    │
                    ▼
┌──────────────────────────────────────────────────┐
│              DELETE CAMPAIGN DIALOG              │
│                                                  │
│  "Campaign <title> will be permanently removed." │
│                                                  │
│  [ Cancel ]          [ Confirm Delete ]          │
└──────────────────────────────────────────────────┘
                    │
       ┌────────────┴────────────┐
  Cancel clicked          Confirm clicked
       │                          │
       ▼                          ▼
  Dialog closes           DELETE /api/admin/campaigns/:id
  No change                         │
                           ┌────────┴─────────┐
                         Success            Error
                             │                 │
                             ▼                 ▼
                      Campaign removed   Toast (red):
                      from list          "Failed to delete campaign"
                      Toast (green):     Dialog closes
                      "Campaign deleted"
```

---

## Empty States

### Empty — No Campaigns in Tab

```
Admin opens a tab with no campaigns
(e.g., no rejected campaigns yet)
                    │
                    ▼
         API returns { data: [], meta: { total: 0 } }
                    │
                    ▼
┌───────────────────────────────────────────────┐
│                  EMPTY STATE                  │
│                                               │
│       [ Campaigns icon ]                      │
│       "No campaigns with status: Approved"    │
│       "Try changing the filter or sort        │
│        options to see more results."          │
└───────────────────────────────────────────────┘
```

### Empty — Filter Produces No Results

```
Admin selects an organization that has no campaigns
in the current status tab
                    │
                    ▼
         API returns { data: [], meta: { total: 0 } }
                    │
                    ▼
         Empty state shown
         Organization filter still active
         Admin can clear filter to return to full list
```

---

## Complete Flow Diagram (All Screens & Actions)

```
/dashboard/admin/campaigns/review      (Pending Review Tab)
/dashboard/admin/campaigns/approved    (Approved Tab)
/dashboard/admin/campaigns/rejected    (Rejected Tab)
            │
            │  Page mount
            ▼
GET /api/admin/campaigns?status=<tab>&page=1&...
            │
     ┌──────┴──────┐
   Success       Error
     │               │
  Cards grid    Error banner
  rendered      + Retry button
     │
     ├── Switch Tab ──────────────────► New route → New status prop
     │                                  Filter reset, page reset to 1
     │                                  New GET request
     │
     ├── Change Sort ─────────────────► Page reset to 1
     │                                  GET with new sortBy/order
     │
     ├── Filter by Organization ──────► Page reset to 1
     │                                  GET with organization param
     │
     ├── Change Page / Page Size ─────► GET with new page/pageSize
     │
     ├── [ View Details ] ───────────► CampaignDetailsDialog opens
     │                                  (client-side, no API call)
     │                                  Shows full campaign info
     │                                  │
     │                                  ▼
     │                             Panel closes on Escape / outside click
     │
     ├── [ Approve ] (pending only) ─► PATCH .../approve
     │                                  │
     │                              ┌───┴───┐
     │                           Success  Error
     │                              │        │
     │                         Toast (green) Toast (red)
     │                         List re-fetch  Card unchanged
     │
     ├── [ Reject ] (pending only) ──► RejectCampaignDialog opens
     │                                  │
     │                             [ Cancel ]
     │                                  │
     │                             Dialog closes, no change
     │                                  │
     │                             [ Confirm ] (reason ≥ 8 chars)
     │                                  │
     │                             PATCH .../reject { reason }
     │                                  │
     │                            ┌─────┴──────┐
     │                          Success      Error
     │                             │            │
     │                        Toast (green)  Toast (red)
     │                        List re-fetch  Dialog stays open
     │
     └── [ Delete ] (future) ──────► DeleteDialog → DELETE .../id
                                      │
                                  ┌───┴───┐
                               Success  Error
                                  │        │
                             Toast (green) Toast (red)
                             List re-fetch  Unchanged
```

---

## Toast Notifications

| Action | Outcome | Toast Color | Message |
|--------|---------|-------------|---------|
| Load campaigns | Success | — | No toast (data renders) |
| Load campaigns | Error | Red | "Failed to load campaigns" |
| Approve campaign | Success | Green | "Campaign approved successfully" |
| Approve campaign | Error | Red | "Failed to approve campaign" |
| Reject campaign | Success | Green | "Campaign rejected" |
| Reject campaign | Error | Red | "Failed to reject campaign" |
| Delete campaign (future) | Success | Green | "Campaign deleted" |
| Delete campaign (future) | Error | Red | "Failed to delete campaign" |

---

## Loading States

| Trigger | Loading Indicator |
|---------|-------------------|
| Initial page load | Skeleton card grid (2×3 placeholder cards) |
| Tab switch | Skeleton card grid |
| Filter / Sort change | Skeleton card grid or inline spinner overlay |
| Page navigation | Skeleton card grid |
| Approve button clicked | Spinner on Approve button, button disabled |
| Reject — Confirm clicked | Spinner on Confirm button, button disabled |
| Delete — Confirm clicked (future) | Spinner on Confirm button, button disabled |

---

## All Screens & States

| State | Location | Description |
|-------|----------|-------------|
| Loading — initial | `/campaigns/<tab>` | Skeleton grid shown while API call in progress |
| Error — failed load | `/campaigns/<tab>` | Error banner with Retry button |
| Loaded — with data | `/campaigns/<tab>` | Card grid with pagination controls |
| Loaded — empty tab | `/campaigns/<tab>` | Empty state icon + message |
| Loaded — empty filter | `/campaigns/<tab>` | Empty state, filter still active |
| Details panel — open | `/campaigns/<tab>` | Side sheet with full campaign info |
| Details panel — closed | `/campaigns/<tab>` | Panel dismissed, list unchanged |
| Approve — in progress | `/campaigns/<tab>` | Spinner on Approve button |
| Approve — success | `/campaigns/review` | Card gone, green toast, list re-fetched |
| Approve — error | `/campaigns/<tab>` | Red toast, card unchanged |
| Reject dialog — open | `/campaigns/<tab>` | Dialog with textarea; Confirm disabled if < 8 chars |
| Reject dialog — confirm in progress | `/campaigns/<tab>` | Spinner on Confirm button |
| Reject — success | `/campaigns/review` | Card gone, green toast, list re-fetched |
| Reject — error | `/campaigns/<tab>` | Red toast, dialog stays open |
| Delete dialog — open (future) | `/campaigns/<tab>` | Confirmation dialog |
| Delete — success (future) | `/campaigns/<tab>` | Card gone, green toast, list re-fetched |
| Delete — error (future) | `/campaigns/<tab>` | Red toast, card unchanged |

---

## Decision Points

| # | Decision | Pass | Fail |
|---|----------|------|------|
| 1 | API load successful? | Render campaign cards | Show error banner with Retry |
| 2 | Status tab changed? | Reset filters & page, new GET request | — |
| 3 | Organization filter applied? | GET with `organization` param | GET without organization param |
| 4 | Sort changed? | Reset page to 1, GET with new sortBy/order | — |
| 5 | Page or page size changed? | GET with new page/pageSize | — |
| 6 | Campaign is `pending`? | Show Approve + Reject buttons | Hide Approve + Reject buttons |
| 7 | Campaign has rejection reason? | Show rejection reason block on card and in details | Omit rejection reason block |
| 8 | Rejection reason ≥ 8 chars (trimmed)? | Enable Confirm Rejection button | Keep Confirm button disabled |
| 9 | Approve API success? | Remove card from list, green toast, re-fetch | Red toast, card unchanged |
| 10 | Reject API success? | Remove card from list, green toast, re-fetch | Red toast, dialog stays open |
| 11 | Filter produces zero results? | Show empty state (no card grid) | — |

---

## Related Files

| File | Role |
|------|------|
| `src/app/dashboard/admin/campaigns/review/page.tsx` | Route entry — pending review tab (`status="pending"`) |
| `src/app/dashboard/admin/campaigns/approved/page.tsx` | Route entry — approved tab (`status="approved"`) |
| `src/app/dashboard/admin/campaigns/rejected/page.tsx` | Route entry — rejected tab (`status="rejected"`) |
| `src/components/pages/campaigns-review/campaigns-review-page.tsx` | Main page logic — state, API calls, filter/sort/pagination, action handlers |
| `src/components/pages/campaigns-review/review-toolbar.tsx` | Toolbar with sort select, organization filter dropdown, results count |
| `src/components/pages/campaigns-review/review-campaign-card.tsx` | Individual campaign card — displays data, approve/reject/view-details actions |
| `src/components/pages/campaigns-review/campaign-details-dialog.tsx` | Side panel (Sheet) showing full campaign details |
| `src/components/pages/campaigns-review/reject-campaign-dialog.tsx` | Reject confirmation dialog with rejection reason textarea |
| `src/components/pages/campaigns-review/helpers.ts` | `formatAmount` (currency formatting), `getProgress` (fundraising %) |
| `src/components/pages/campaigns-review/static-data.ts` | Types (`ReviewCampaignItem`, `ReviewCampaignCategory`), label maps, mock data |
| `src/components/pages/campaigns-review/index.ts` | Public exports for the module |
