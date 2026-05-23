# User Flow: Admin Posts Review — Detailed (API-Integrated)
**JOD Platform — Admin Dashboard**

---

## Overview

This document describes the end-to-end user flow for reviewing organization posts inside the admin dashboard. The section spans three tab routes sharing a single page component: posts pending review, approved posts, and rejected posts. Posts are displayed in a table layout. Admins can filter by organization, sort results, view full post details in a side panel, approve a pending post instantly, or reject it with a required rejection reason. All data fetching, filtering, sorting, and pagination are server-side API operations.

**Review Route:** `/dashboard/admin/posts/review`
**Approved Route:** `/dashboard/admin/posts/approved`
**Rejected Route:** `/dashboard/admin/posts/rejected`
**Role:** `admin`
**Main Components:** `PostsReviewPage`, `ReviewToolbar`, `ReviewPostsTable`, `PostDetailsDialog`, `RejectPostDialog`

---

## Post Moderation Statuses

| Status | Badge Color | Description |
|--------|-------------|-------------|
| `pending` | Amber | Post submitted by organization, awaiting admin review |
| `approved` | Green | Post reviewed and accepted by admin |
| `rejected` | Red | Post reviewed and rejected by admin with a reason |

## Post Types

| Type | Label |
|------|-------|
| `help_request` | Help Request |
| `job_opportunity` | Job Opportunity |
| `awareness` | Awareness Post |
| `campaign_update` | Campaign Update |

---

## Entry Points

| Source | Route |
|--------|-------|
| Admin sidebar — Posts (Review tab) | `/dashboard/admin/posts/review` |
| Admin sidebar — Posts (Approved tab) | `/dashboard/admin/posts/approved` |
| Admin sidebar — Posts (Rejected tab) | `/dashboard/admin/posts/rejected` |
| Direct URL | Any of the three routes above |

---

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/admin/posts` | Fetch paginated posts with server-side filter & sort |
| `PATCH` | `/api/admin/posts/:id/approve` | Approve a pending post |
| `PATCH` | `/api/admin/posts/:id/reject` | Reject a pending post with a reason |
| `DELETE` | `/api/admin/posts/:id` | Delete a post permanently (not in current UI) |

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

### DELETE Request Body
```json
{}
```

---

## Global API Error Handling

| HTTP Status | Meaning | UI Behavior |
|-------------|---------|-------------|
| `401` Unauthorized | Session expired | Redirect to `/login` |
| `403` Forbidden | Not an admin | Show "Access Denied" toast (red), stay on page |
| `404` Not Found | Post no longer exists | Show error toast (red), refresh list |
| `422` Unprocessable | Validation failed (e.g., reason too short) | Show field-level error message |
| `500` Server Error | Internal server error | Show "Something went wrong" toast (red) |
| Network Error | No connectivity | Show "Network error, please try again" toast (red) |

---

## Screen 1: Posts List — Page Load

```
Admin navigates to /dashboard/admin/posts/review
(or /approved or /rejected)
                    │
                    ▼
         API call dispatched immediately
         GET /api/admin/posts
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
   Skeleton table     Success       Error
   rows               │             │
                       ▼             ▼
                  Table renders  Error banner
                  with data      + Retry button
```

### Loading State (Skeleton)

```
┌───────────────────────────────────────────────────┐
│              POSTS REVIEW PAGE (Loading)          │
│                                                   │
│  Toolbar                                          │
│  ┌──────────────────────────────────────────────┐ │
│  │  Posts Review — Pending Review   N posts     │ │
│  │                  [ Sort ▾ ]  [ Organization ▾]│ │
│  └──────────────────────────────────────────────┘ │
│                                                   │
│  Table                                            │
│  ┌────┬─────────────┬──────────┬────────┬──────┐  │
│  │    │ ░░░░░░░░░░░ │ ░░░░░░░  │ ░░░░░  │  ○○○ │  │
│  │    │ ░░░░░       │ ░░░░░░░  │ ░░░░░  │      │  │
│  ├────┼─────────────┼──────────┼────────┼──────┤  │
│  │    │ ░░░░░░░░░░░ │ ░░░░░░░  │ ░░░░░  │  ○○○ │  │
│  │    │ ░░░░░       │ ░░░░░░░  │ ░░░░░  │      │  │
│  └────┴─────────────┴──────────┴────────┴──────┘  │
└───────────────────────────────────────────────────┘
```

### Error State

```
┌───────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────┐  │
│  │  ⚠ Failed to load posts.                   │  │
│  │     [ Retry ]                               │  │
│  └─────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────┘

Admin clicks [ Retry ]
     │
     ▼
GET /api/admin/posts?status=<current>&... (same params)
     │
  ┌──┴──┐
Success  Error
  │        │
Table    Error banner remains
renders
```

### Success State Layout

```
┌───────────────────────────────────────────────────────────────┐
│                     POSTS REVIEW PAGE                         │
│                                                               │
│  Toolbar                                                      │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  Posts Review — Pending Review         6 posts        │   │
│  │                     [ Sort: Newest ▾ ]  [ Org ▾ ]    │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                               │
│  Posts Table                                                  │
│  ┌──────────┬──────────────────┬──────────┬────────┬───────┐ │
│  │ Status   │ Title            │ Org      │ Author │ Type  │ │
│  │          │                  │          │        │       │ │
│  │          │                  │ Submitted│ Actions│       │ │
│  ├──────────┼──────────────────┼──────────┼────────┼───────┤ │
│  │ [Pending]│ Post Title       │ Org Name │ Author │ Help  │ │
│  │          │ Summary 1 line   │          │  Name  │ Req.  │ │
│  │          │ Rejection reason │          │        │       │ │
│  ├──────────┼──────────────────┼──────────┼────────┼───────┤ │
│  │ [Pending]│ Post Title       │ Org Name │ Author │ Job   │ │
│  └──────────┴──────────────────┴──────────┴────────┴───────┘ │
│                                                               │
│  Pagination Controls                                          │
│  [ < ]  [1] [2] ... [N]  [ > ]   Page: [10 ▾]               │
└───────────────────────────────────────────────────────────────┘
```

---

## Tabs (Status Routes)

The three routes share the same `PostsReviewPage` component. The `status` prop changes the API query and the toolbar title.

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
         GET /api/admin/posts?status=<new_status>&page=1&...
                    │
                    ▼
         Skeleton → Success / Error
```

| Tab | Route | Status Prop |
|-----|-------|------------|
| Pending Review | `/posts/review` | `pending` |
| Approved | `/posts/approved` | `approved` |
| Rejected | `/posts/rejected` | `rejected` |

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
         GET /api/admin/posts
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
                     Table updates  Toast (red)
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
          or a separate GET /api/admin/posts/organizations
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
         GET /api/admin/posts?...&organization=<name>
                    │
         ┌──────────┴──────────┐
       Success               Error
         │                      │
    Table updates          Toast (red)

If selected organization disappears from results
(e.g., all its posts moved to another status tab):
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
         GET /api/admin/posts?...&page=<N>&pageSize=<X>
                    │
         ┌──────────┴──────────┐
       Success               Error
         │                      │
    Table updates          Toast (red)
    Pagination re-renders  Old page stays
```

Pagination controls:
- Previous / Next buttons
- Numbered page buttons
- Page size selector: `[10 ▾]` (options: 10, 20, 50)

---

## Table Columns

| Column | Content | Visibility |
|--------|---------|------------|
| Status | Moderation status badge | Always |
| Title | Post title (bold) + summary (1 line, truncated) + rejection reason (1 line, red, if any) | Always |
| Organization | Organization name | Always |
| Author | Author name | Hidden on mobile (md+) |
| Type | Post type label | Hidden on small screens (lg+) |
| Submission Date | Formatted submission date | Always |
| Actions | View Details icon \| Approve icon \| Reject icon | Always |

---

## Row Actions

```
Each row exposes up to three icon actions:
┌──────────────────────────────────────────────────┐
│  [ 👁 View Details ]                             │  ← always shown
│  [ ✓ Approve ]      ← only when status=pending  │
│  [ ✗ Reject  ]      ← only when status=pending  │
└──────────────────────────────────────────────────┘
```

---

## Action 1: View Post Details

```
Admin clicks [ View Details icon ] on any row
                    │
                    ▼
         PostDetailsDialog opens (side Sheet panel)
         Data displayed from existing row state
         No separate API call
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│                  POST DETAILS PANEL                  │
│                                                      │
│  Post Title                                          │
│  ─────────────────────────────────────────────────  │
│                                                      │
│  [ Status Badge ] [ Type Badge ] [ Post ID ]         │
│                                                      │
│  Information Grid (2 columns)                        │
│  ┌───────────────────────┬────────────────────────┐  │
│  │ Publishing Entity     │ Post Author             │  │
│  │ <organizationName>    │ <authorName>            │  │
│  ├───────────────────────┼────────────────────────┤  │
│  │ City                  │ Submitted At            │  │
│  │ <location>            │ <datetime>              │  │
│  └───────────────────────┴────────────────────────┘  │
│                                                      │
│  Post Content                                        │
│  ┌──────────────────────────────────────────────┐   │
│  │  <full summary / post body text>             │   │
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
         Panel closes, post list unchanged
```

---

## Action 2: Approve Post

```
Admin clicks [ Approve icon ] on a pending row
                    │
                    ▼
         No confirmation dialog
         Button shows spinner immediately
                    │
                    ▼
         PATCH /api/admin/posts/:id/approve
                    │
         ┌──────────┴──────────┐
       Success               Error
         │                      │
         ▼                      ▼
  Post status             Spinner stops
  → "approved"            Toast (red): "Failed to approve post"
  Row moves away          Row stays unchanged
  from /review tab
  (list re-fetches)
         │
         ▼
  Toast (green): "Post approved successfully"
  GET /api/admin/posts?status=pending&... re-fetched
  Row disappears from current list
```

---

## Action 3: Reject Post

```
Admin clicks [ Reject icon ] on a pending row
                    │
                    ▼
┌──────────────────────────────────────────────────┐
│               REJECT POST DIALOG                 │
│                                                  │
│  "Reject Post"                                   │
│  "Enter a rejection reason. It will be sent to  │
│   the publishing organization with the review   │
│   notification."                                 │
│                                                  │
│  Post: <title displayed as read-only field>      │
│                                                  │
│  Rejection Reason *                              │
│  ┌──────────────────────────────────────────┐   │
│  │  (textarea, min height)                  │   │
│  │  Example: Please add documentation or    │   │
│  │  supporting attachments before           │   │
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
                    Button stays         PATCH /api/admin/posts/:id/reject
                    disabled             { "reason": "<trimmed text>" }
                                                  │
                                       ┌──────────┴──────────┐
                                     Success               Error
                                         │                    │
                                         ▼                    ▼
                                  Post status          Toast (red):
                                  → "rejected"        "Failed to reject post"
                                  rejectionReason     Dialog stays open
                                  → stored text
                                  Dialog closes
                                         │
                                         ▼
                                  Toast (green): "Post rejected"
                                  GET re-fetched for
                                  current status tab
                                  Row disappears from
                                  /review tab
```

---

## Action 4: Delete Post (Not in Current UI)

> **Note:** The current posts implementation does not include a delete action. Posts can only be approved or rejected. The DELETE endpoint is listed below for completeness and potential future use.

```
(Future UI) Admin clicks [ Delete ] on a post row
                    │
                    ▼
┌──────────────────────────────────────────────────┐
│               DELETE POST DIALOG                 │
│                                                  │
│  "Post <title> will be permanently removed."     │
│                                                  │
│  [ Cancel ]          [ Confirm Delete ]          │
└──────────────────────────────────────────────────┘
                    │
       ┌────────────┴────────────┐
  Cancel clicked          Confirm clicked
       │                          │
       ▼                          ▼
  Dialog closes           DELETE /api/admin/posts/:id
  No change                         │
                           ┌────────┴─────────┐
                         Success            Error
                             │                 │
                             ▼                 ▼
                      Post removed        Toast (red):
                      from list           "Failed to delete post"
                      Toast (green):      Dialog closes
                      "Post deleted"
```

---

## Empty States

### Empty — No Posts in Tab

```
Admin opens a tab with no posts
(e.g., no rejected posts yet)
                    │
                    ▼
         API returns { data: [], meta: { total: 0 } }
                    │
                    ▼
┌───────────────────────────────────────────────┐
│                  EMPTY STATE                  │
│                                               │
│       [ Posts icon ]                          │
│       "No posts with status: Approved"        │
│       "Try changing the filter or sort        │
│        options to see more results."          │
└───────────────────────────────────────────────┘
```

### Empty — Filter Produces No Results

```
Admin selects an organization with no posts
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
/dashboard/admin/posts/review      (Pending Review Tab)
/dashboard/admin/posts/approved    (Approved Tab)
/dashboard/admin/posts/rejected    (Rejected Tab)
            │
            │  Page mount
            ▼
GET /api/admin/posts?status=<tab>&page=1&...
            │
     ┌──────┴──────┐
   Success       Error
     │               │
  Table rows    Error banner
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
     ├── [ View Details icon ] ──────► PostDetailsDialog opens
     │                                  (client-side, no API call)
     │                                  Shows full post info in side panel
     │                                  │
     │                                  ▼
     │                             Panel closes on Escape / outside click
     │
     ├── [ Approve icon ] (pending) ─► PATCH .../approve
     │                                  │
     │                              ┌───┴───┐
     │                           Success  Error
     │                              │        │
     │                         Toast (green) Toast (red)
     │                         List re-fetch  Row unchanged
     │
     ├── [ Reject icon ] (pending) ──► RejectPostDialog opens
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
     └── [ Delete icon ] (future) ──► DeleteDialog → DELETE .../id
                                       │
                                   ┌───┴───┐
                                Success  Error
                                   │        │
                              Toast (green) Toast (red)
                              List re-fetch  Row unchanged
```

---

## Toast Notifications

| Action | Outcome | Toast Color | Message |
|--------|---------|-------------|---------|
| Load posts | Success | — | No toast (table renders) |
| Load posts | Error | Red | "Failed to load posts" |
| Approve post | Success | Green | "Post approved successfully" |
| Approve post | Error | Red | "Failed to approve post" |
| Reject post | Success | Green | "Post rejected" |
| Reject post | Error | Red | "Failed to reject post" |
| Delete post (future) | Success | Green | "Post deleted" |
| Delete post (future) | Error | Red | "Failed to delete post" |

---

## Loading States

| Trigger | Loading Indicator |
|---------|-------------------|
| Initial page load | Skeleton table rows |
| Tab switch | Skeleton table rows |
| Filter / Sort change | Skeleton table rows or inline overlay |
| Page navigation | Skeleton table rows |
| Approve button clicked | Spinner on Approve icon, button disabled |
| Reject — Confirm clicked | Spinner on Confirm button, button disabled |
| Delete — Confirm clicked (future) | Spinner on Confirm button, button disabled |

---

## All Screens & States

| State | Location | Description |
|-------|----------|-------------|
| Loading — initial | `/posts/<tab>` | Skeleton table rows shown while API call in progress |
| Error — failed load | `/posts/<tab>` | Error banner with Retry button |
| Loaded — with data | `/posts/<tab>` | Table rows with pagination controls |
| Loaded — empty tab | `/posts/<tab>` | Empty state icon + message |
| Loaded — empty filter | `/posts/<tab>` | Empty state, filter still active |
| Details panel — open | `/posts/<tab>` | Side sheet with full post info |
| Details panel — closed | `/posts/<tab>` | Panel dismissed, list unchanged |
| Approve — in progress | `/posts/<tab>` | Spinner on Approve icon |
| Approve — success | `/posts/review` | Row gone, green toast, list re-fetched |
| Approve — error | `/posts/<tab>` | Red toast, row unchanged |
| Reject dialog — open | `/posts/<tab>` | Dialog with textarea; Confirm disabled if < 8 chars |
| Reject dialog — confirm in progress | `/posts/<tab>` | Spinner on Confirm button |
| Reject — success | `/posts/review` | Row gone, green toast, list re-fetched |
| Reject — error | `/posts/<tab>` | Red toast, dialog stays open |
| Delete dialog — open (future) | `/posts/<tab>` | Confirmation dialog |
| Delete — success (future) | `/posts/<tab>` | Row gone, green toast, list re-fetched |
| Delete — error (future) | `/posts/<tab>` | Red toast, row unchanged |

---

## Decision Points

| # | Decision | Pass | Fail |
|---|----------|------|------|
| 1 | API load successful? | Render post table rows | Show error banner with Retry |
| 2 | Status tab changed? | Reset filters & page, new GET request | — |
| 3 | Organization filter applied? | GET with `organization` param | GET without organization param |
| 4 | Sort changed? | Reset page to 1, GET with new sortBy/order | — |
| 5 | Page or page size changed? | GET with new page/pageSize | — |
| 6 | Post status is `pending`? | Show Approve + Reject icons in row | Hide Approve + Reject icons |
| 7 | Post has rejection reason? | Show rejection reason line in Title cell and in details panel | Omit rejection reason |
| 8 | Rejection reason ≥ 8 chars (trimmed)? | Enable Confirm Rejection button | Keep Confirm button disabled |
| 9 | Approve API success? | Remove row from list, green toast, re-fetch | Red toast, row unchanged |
| 10 | Reject API success? | Remove row from list, green toast, re-fetch | Red toast, dialog stays open |
| 11 | Filter produces zero results? | Show empty state (no table rows) | — |

---

## Related Files

| File | Role |
|------|------|
| `src/app/dashboard/admin/posts/review/page.tsx` | Route entry — pending review tab (`status="pending"`) |
| `src/app/dashboard/admin/posts/approved/page.tsx` | Route entry — approved tab (`status="approved"`) |
| `src/app/dashboard/admin/posts/rejected/page.tsx` | Route entry — rejected tab (`status="rejected"`) |
| `src/components/pages/posts-review/posts-review-page.tsx` | Main page logic — state, API calls, filter/sort/pagination, action handlers |
| `src/components/pages/posts-review/review-toolbar.tsx` | Toolbar with sort select, organization filter dropdown, results count |
| `src/components/pages/posts-review/review-posts-table.tsx` | Table layout — renders all post rows with status, title, org, author, type, date, actions |
| `src/components/pages/posts-review/post-details-dialog.tsx` | Side panel (Sheet) showing full post details |
| `src/components/pages/posts-review/reject-post-dialog.tsx` | Reject confirmation dialog with rejection reason textarea (min 8 chars) |
| `src/components/pages/posts-review/review-post-card.tsx` | Alternative card layout component (defined but not used in current page flow) |
| `src/components/pages/posts-review/static-data.ts` | Types (`ReviewPostItem`, `ReviewPostType`), label maps (`postTypeLabels`, `reviewStatusLabels`), mock data |
| `src/components/pages/posts-review/index.ts` | Public exports for the module |
