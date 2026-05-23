# User Flow: Org-Owner Posts Management

## Overview

The org-owner posts management section allows organization owners to create, manage, and track the lifecycle of posts belonging to their organization. Posts go through a three-stage workflow: Draft → Published → Archived. The interface uses a tabbed list layout with a side-panel form sheet for creating and editing posts and a side-panel details sheet for viewing post information.

**Route base:** `/dashboard/org-owner/posts`

---

## Post Statuses

| Status    | Color  | Description                                                      |
|-----------|--------|------------------------------------------------------------------|
| draft     | Amber  | Post is saved but not yet visible to the public                  |
| published | Green  | Post is live and visible to the public                           |
| archived  | Slate  | Post has been taken offline and is no longer publicly visible    |

---

## Post Types

| Type             | Label            | Campaign-Related |
|------------------|------------------|-----------------|
| general          | General Post     | No              |
| job_opportunity  | Opportunity      | No              |
| campaign_teaser  | Campaign Teaser  | Yes             |
| campaign_update  | Campaign Update  | Yes             |
| campaign_summary | Campaign Summary | Yes             |

> Campaign-related types (`campaign_teaser`, `campaign_update`, `campaign_summary`) require a **Related Campaign** (campaignTitle) field in the form.

---

## Workflow Actions by Status

| Current Status | Workflow Action  | API Body              | Result Status |
|----------------|------------------|-----------------------|---------------|
| draft          | Publish          | `{ status: "published" }` | published  |
| published      | Archive          | `{ status: "archived" }`  | archived   |
| archived       | Restore to Draft | `{ status: "draft" }`     | draft      |

---

## Entry Points

| Entry Point                                   | Route                                    | Default Tab |
|-----------------------------------------------|------------------------------------------|-------------|
| Org-Owner sidebar → Posts                     | `/dashboard/org-owner/posts`             | All         |
| Tab click → Published                         | `/dashboard/org-owner/posts/published`   | Published   |
| Tab click → Draft                             | `/dashboard/org-owner/posts/draft`       | Draft       |
| Tab click → Archived                          | `/dashboard/org-owner/posts/archived`    | Archived    |

---

## API Endpoints Reference

| Action                        | Method | Endpoint                          |
|-------------------------------|--------|-----------------------------------|
| List posts (filter/sort/page) | GET    | `/api/org/posts`                  |
| Get single post (edit prefetch)| GET   | `/api/org/posts/:id`              |
| Create post                   | POST   | `/api/org/posts`                  |
| Update post                   | PATCH  | `/api/org/posts/:id`              |
| Workflow action (status change)| PATCH | `/api/org/posts/:id/status`       |
| Delete post                   | DELETE | `/api/org/posts/:id`              |

> All list requests include query parameters: `?page=N&pageSize=X&status=Y&type=Z&sortBy=W&order=asc|desc`

---

## Global Error Types

| HTTP Status | Meaning             | Behavior                                                    |
|-------------|---------------------|-------------------------------------------------------------|
| 400         | Bad request         | Show inline field errors or error toast                     |
| 401         | Unauthenticated     | Redirect to `/login`                                        |
| 403         | Forbidden           | Show "Access Denied" toast; no redirect                     |
| 404         | Not found           | Show "Post not found" toast; refresh list                   |
| 409         | Conflict            | Show conflict message in toast                              |
| 422         | Validation error    | Show field-level validation messages in form                |
| 500         | Server error        | Show generic "Something went wrong" error toast             |
| Network     | No response         | Show "Network error, please try again" toast                |

---

## Screen 1: Posts List Page — Initial Load

### Loading State

```
User navigates to /dashboard/org-owner/posts
              |
              v
  [OrganizationPostsManagementPage mounts]
              |
              v
  GET /api/org/posts?page=1&pageSize=10&status=all
              |
              v
  ┌─────────────────────────────────────────────┐
  │  Tabs: All | Published | Draft | Archived   │
  │  [Filter Controls — skeleton/disabled]      │
  │  ┌──────────────────────────────────────┐   │
  │  │   Table skeleton (animated rows)    │   │
  │  └──────────────────────────────────────┘   │
  │  [Pagination skeleton]                      │
  └─────────────────────────────────────────────┘
```

### Error State

```
GET /api/org/posts → 500 / Network Error
              |
              v
  ┌─────────────────────────────────────────────┐
  │  Tabs: All | Published | Draft | Archived   │
  │                                             │
  │     ⚠  Failed to load posts.               │
  │        [Retry]                              │
  └─────────────────────────────────────────────┘

  User clicks [Retry]
              |
              v
  Re-fires GET /api/org/posts (same params)
```

### Success State — Page Layout

```
  ┌─────────────────────────────────────────────────────────────────┐
  │  Posts                                          [+ Create Post] │
  ├─────────────────────────────────────────────────────────────────┤
  │  [ All ] [ Published ] [ Draft ] [ Archived ]                   │
  ├─────────────────────────────────────────────────────────────────┤
  │  [Type ▼]  [Sort ▼]                                             │
  ├──────────┬──────────┬────────┬──────────┬──────────┬───────────┤
  │  Post    │  Type    │ Status │  Link    │ Author & │  Metrics  │
  │ title+   │          │        │ campaign │ Location │views/react│
  │ summary  │          │        │ or Indep.│          │/apps      │
  ├──────────┼──────────┼────────┼──────────┼──────────┼───────────┤
  │ ...rows  │          │        │          │          │           │
  ├──────────┴──────────┴────────┴──────────┴──────────┴───────────┤
  │  Dates (created/updated/published)  |  Actions                 │
  ├─────────────────────────────────────────────────────────────────┤
  │  < 1  2  3 ... >                   Showing 1–10 of 38 posts    │
  └─────────────────────────────────────────────────────────────────┘
```

---

## Tabs

| Tab       | Route                                  | API Status Filter     |
|-----------|----------------------------------------|-----------------------|
| All       | `/dashboard/org-owner/posts`           | (no status filter)    |
| Published | `/dashboard/org-owner/posts/published` | `?status=published`   |
| Draft     | `/dashboard/org-owner/posts/draft`     | `?status=draft`       |
| Archived  | `/dashboard/org-owner/posts/archived`  | `?status=archived`    |

```
User clicks a tab
        |
        v
Navigate to tab route
        |
        v
GET /api/org/posts?status=<tab>&page=1&pageSize=10&<existing sort/type>
        |
        v
Table updates with filtered results
Pagination resets to page 1
```

---

## Filter & Sort Flow

> All filtering and sorting is **server-side**. Each change triggers a new API request.

### Available Controls

| Control     | Options                                                                                           |
|-------------|---------------------------------------------------------------------------------------------------|
| Type filter | All Types / General Post / Opportunity / Campaign Teaser / Campaign Update / Campaign Summary    |
| Sort        | Newest Updated / Oldest Updated / Title A–Z / Title Z–A                                          |

> There is **no location filter** for posts (unlike campaigns which has a location filter).

### Sort Parameter Mapping

| UI Label        | `sortBy` | `order` |
|-----------------|----------|---------|
| Newest Updated  | `updated_at` | `desc` |
| Oldest Updated  | `updated_at` | `asc`  |
| Title A–Z       | `title`  | `asc`  |
| Title Z–A       | `title`  | `desc` |

### Filter & Sort Flow Diagram

```
User changes Type filter or Sort dropdown
              |
              v
  UI stores new filter/sort values
              |
              v
  Reset page to 1
              |
              v
  GET /api/org/posts
    ?status=<active tab>
    &type=<selected type or omit for all>
    &sortBy=<field>
    &order=<asc|desc>
    &page=1
    &pageSize=10
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

> Pagination is **server-side**. The API returns the current page's records plus total count.

```
API Response includes:
  { data: [...], total: 38, page: 2, pageSize: 10 }
              |
              v
  Pagination bar renders:
  < 1  [2]  3  4 >     Showing 11–20 of 38 posts

User clicks page number or next/previous arrow
              |
              v
  GET /api/org/posts
    ?status=<tab>
    &type=<filter>
    &sortBy=<field>
    &order=<order>
    &page=<N>
    &pageSize=10
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

| Column            | Content                                                          | Visibility    |
|-------------------|------------------------------------------------------------------|---------------|
| Post              | Title (bold) + summary (muted) + Post ID (xs muted)             | Always        |
| Type              | Post type badge label                                            | Always        |
| Status            | Colored status badge (amber/green/slate)                         | Always        |
| Link              | campaignTitle if campaign-related, otherwise "Independent"       | Always        |
| Author & Location | Author name + location text                                      | Always        |
| Metrics           | Views count / Reactions count / Applications count               | Always        |
| Dates             | Created date / Updated date / Published date (if published)      | Always        |
| Actions           | View Details · Edit · Workflow Action · Delete                   | Always        |

---

## Row Action 1: View Details (Side Sheet)

```
User clicks [View Details] on any row
              |
              v
  PostDetailsSheet opens (side panel, no API call)
  Displays data already in the list row:
  ┌─────────────────────────────────────────────────┐
  │  Post Details                              [×]  │
  ├─────────────────────────────────────────────────┤
  │  [Status Badge]  [Type Badge]                   │
  │  Post ID: xxxxxxxx-xxxx                         │
  ├─────────────────────────────────────────────────┤
  │  Info Grid (2-col):                             │
  │  Author Name    |  Location                     │
  │  Created At     |  Updated At                   │
  │  Published At   |  (if published, else blank)   │
  │  Campaign       |  (if campaign-related type)   │
  ├─────────────────────────────────────────────────┤
  │  Stats Row (3-col):                             │
  │  👁 Views   ❤ Reactions   📋 Applications       │
  ├─────────────────────────────────────────────────┤
  │  Post Content Block:                            │
  │  Title                                          │
  │  Summary / body text                            │
  └─────────────────────────────────────────────────┘

User clicks [×] or clicks outside → Sheet closes
```

> No API call is made when opening the details sheet. Data is read from the list cache.

---

## Row Action 2: Edit Post

```
User clicks [Edit] on a row
              |
              v
  Spinner appears on Edit button
              |
              v
  GET /api/org/posts/:id          ← pre-fetch fresh data
              |
       ┌──────┴──────┐
       ▼             ▼
   Success         Error (404 / 500)
       |             |
       v             v
  PostFormSheet    Error toast shown
  opens in         "Failed to load post"
  Edit Mode        Spinner stops
  (pre-filled)

  ┌──────────────────────────────────────────────────────┐
  │  Edit Post                                      [×]  │
  ├──────────────────────────────────────────────────────┤
  │  Title *              [___________________________]  │
  │  Summary *            [___________________________]  │
  │  Post Type *          [Select type            ▼  ]  │
  │  Status *             [Select status          ▼  ]  │
  │  Author Name *        [___________________________]  │
  │  Location *           [___________________________]  │
  │  Related Campaign *   [___________________________]  │
  │  (only shown when type is campaign_teaser/update/    │
  │   summary — hidden for general / job_opportunity)    │
  ├──────────────────────────────────────────────────────┤
  │                             [Cancel]  [Save Changes] │
  └──────────────────────────────────────────────────────┘
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
  PATCH /api/org/posts/:id
  { title, summary, type, status,
    authorName, location, campaignTitle }
              |
       ┌──────┴──────┐
       ▼             ▼
   Success         Error
       |             |
       v             v
  Sheet closes    Error toast
  List row        Sheet stays open
  updates         Fields remain
  Success toast
  "Post updated successfully"
```

---

## Row Action 3: Workflow Action (Publish / Archive / Restore)

```
User clicks Workflow Action button
(icon/label changes based on current status:
  draft      → green check    → "Publish"
  published  → amber archive  → "Archive"
  archived   → blue rotate    → "Restore to Draft")
              |
              v
  Button shows spinner (disabled)
              |
              v
  PATCH /api/org/posts/:id/status
  { status: "published" | "archived" | "draft" }
              |
       ┌──────┴──────┐
       ▼             ▼
   Success         Error
       |             |
       v             v
  Row updates     Error toast
  with new        "Failed to change
  status badge    post status"
  Success toast   Button re-enables
  (see Toast
  Reference)
```

> No confirmation dialog — the workflow action is applied immediately on button click.

---

## Row Action 4: Delete Post

```
User clicks [Delete] on a row
              |
              v
  DeletePostDialog opens:
  ┌──────────────────────────────────────────────┐
  │  Delete Post                                 │
  ├──────────────────────────────────────────────┤
  │  Are you sure you want to delete this post?  │
  │  This action cannot be undone.               │
  ├──────────────────────────────────────────────┤
  │                      [Cancel]  [Delete Post] │
  └──────────────────────────────────────────────┘

User clicks [Cancel]
              |
              v
  Dialog closes, no action taken

User clicks [Delete Post]
              |
              v
  [Delete Post] shows spinner (disabled)
              |
              v
  DELETE /api/org/posts/:id
              |
       ┌──────┴──────┐
       ▼             ▼
   Success         Error
       |             |
       v             v
  Dialog closes   Error toast
  Row removed     "Failed to delete post"
  from table      Dialog stays open
  Success toast
  "Post deleted successfully"

  If PostDetailsSheet was open for
  the same post at time of deletion:
              |
              v
  Details sheet also closes automatically
```

---

## Screen 3: Post Form Sheet — Create Mode

```
User clicks [+ Create Post] button (top-right)
              |
              v
  PostFormSheet opens in Create Mode:
  ┌──────────────────────────────────────────────────────┐
  │  Create Post                                    [×]  │
  ├──────────────────────────────────────────────────────┤
  │  Title *              [___________________________]  │
  │  Summary *            [___________________________]  │
  │  Post Type *          [Select type            ▼  ]  │
  │  Status *             [Select status          ▼  ]  │
  │  Author Name *        [___________________________]  │
  │  Location *           [___________________________]  │
  │                                                      │
  │  (Related Campaign field hidden until type is set    │
  │   to campaign_teaser / campaign_update /             │
  │   campaign_summary)                                  │
  ├──────────────────────────────────────────────────────┤
  │                                   [Cancel]  [Create] │
  └──────────────────────────────────────────────────────┘

User selects campaign-related Post Type
              |
              v
  Related Campaign * field appears:
  │  Related Campaign *   [___________________________]  │
  (field becomes required)

User selects general or job_opportunity Post Type
              |
              v
  Related Campaign field hidden and value cleared

User fills all required fields → clicks [Create]
              |
              v
  Client-side validation
              |
       ┌──────┴──────┐
       ▼             ▼
  Valid            Invalid
       |             |
       v             v
  [Create] shows  Field errors
  spinner         shown inline
  (disabled)
       |
       v
  POST /api/org/posts
  { title, summary, type, status,
    authorName, location, campaignTitle? }
              |
       ┌──────┴──────┐
       ▼             ▼
   Success         Error
       |             |
       v             v
  Sheet closes    Error toast
  New row         "Failed to create post"
  appears in      Sheet stays open
  list (page 1    Fields remain
  if reset)
  Success toast
  "Post created successfully"

User clicks [×] or [Cancel]
              |
              v
  Sheet closes immediately (no dirty check in create mode)
```

---

## Screen 3: Post Form Sheet — Edit Mode

```
(Sheet opened after successful GET /api/org/posts/:id prefetch)

All fields pre-filled with existing post data.
Related Campaign field shown only if type is
campaign_teaser / campaign_update / campaign_summary.

User edits one or more fields
              |
              v
  Form is now "dirty" (has unsaved changes)

User clicks [×] or [Cancel]
              |
              v
  Dirty check: are there unsaved changes?
              |
       ┌──────┴──────┐
       ▼             ▼
  No changes      Has changes
  (clean)         (dirty)
       |             |
       v             v
  Sheet closes    Discard Changes
  immediately     Dialog opens
```

---

## Edit Mode: Discard Changes Dialog

```
  ┌──────────────────────────────────────────────┐
  │  Discard Changes?                            │
  ├──────────────────────────────────────────────┤
  │  You have unsaved changes.                   │
  │  Are you sure you want to discard them?      │
  ├──────────────────────────────────────────────┤
  │                   [Keep Editing]  [Discard]  │
  └──────────────────────────────────────────────┘

User clicks [Keep Editing]
              |
              v
  Dialog closes, form sheet stays open
  User continues editing

User clicks [Discard]
              |
              v
  Dialog closes
  Form sheet closes
  All unsaved changes lost
  No API call made
```

---

## Complete Flow Diagram — All Actions with API

```
  /dashboard/org-owner/posts
              |
              v
  GET /api/org/posts?page=1&pageSize=10&status=all
              |
        ┌─────┴─────┐
        ▼           ▼
    Success       Error → Retry button
        |
        v
  ┌─────────────────────────────────────────────┐
  │   Posts List Page with Tabs                 │
  └──┬──────────┬────────────┬──────────────────┘
     │          │            │
     ▼          ▼            ▼
  Tab click  Filter/Sort  [+ Create Post]
     |        change           |
     v           |             v
  Navigate    Reset page 1  PostFormSheet
  to tab      + GET list    (Create Mode)
  route           |             |
     |            v          [Create]
     v         Table           |
  GET list     updates      POST /api/org/posts
  ?status=X                     |
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
  ┌──────────────────────────────────────────────────┐
  │  [View Details]  →  PostDetailsSheet (no API)    │
  │  [Edit]          →  GET :id → PostFormSheet      │
  │                       → PATCH /api/org/posts/:id │
  │  [Publish/       →  PATCH /api/org/posts/:id/    │
  │   Archive/            status (instant, no dialog)│
  │   Restore]                                        │
  │  [Delete]        →  DeletePostDialog             │
  │                       → DELETE /api/org/posts/:id│
  └──────────────────────────────────────────────────┘

  Workflow Action State Machine:
  draft ──[Publish]──► published ──[Archive]──► archived
    ▲                                               |
    └──────────────[Restore to Draft]───────────────┘
```

---

## Toast Notification Reference

| Action                  | Success Toast                              | Error Toast                            |
|-------------------------|--------------------------------------------|----------------------------------------|
| Load list               | (none)                                     | "Failed to load posts"                 |
| Create post             | "Post created successfully"                | "Failed to create post"                |
| Edit (prefetch) post    | (none)                                     | "Failed to load post"                  |
| Save post edits         | "Post updated successfully"                | "Failed to update post"                |
| Publish post            | "Post published successfully"              | "Failed to publish post"               |
| Archive post            | "Post archived successfully"               | "Failed to archive post"               |
| Restore post to draft   | "Post restored to draft"                   | "Failed to restore post"               |
| Delete post             | "Post deleted successfully"                | "Failed to delete post"                |

---

## Loading & Disabled States Reference

| UI Element                    | Loading Behavior                                                    |
|-------------------------------|---------------------------------------------------------------------|
| Posts table (initial load)    | Skeleton rows animated while API call is in flight                  |
| Posts table (filter/sort/page)| Table content replaced with skeleton rows; controls remain visible  |
| [+ Create Post] button        | No spinner; always enabled unless form sheet is open                |
| [Edit] row button             | Spinner on button; button disabled; pre-fetch GET in progress       |
| [Workflow Action] row button  | Spinner on button; button disabled; PATCH in progress               |
| [Delete] row button           | Spinner on button; button disabled; DELETE in progress              |
| [Create] form button          | Spinner; disabled while POST is in flight                           |
| [Save Changes] form button    | Spinner; disabled while PATCH is in flight                          |
| [Delete Post] dialog button   | Spinner; disabled while DELETE is in flight                         |
| Filter & sort controls        | Disabled during API request; re-enabled on response                 |
| Pagination controls           | Disabled during API request; re-enabled on response                 |

---

## All Screens & States

| State                           | Location                    | Trigger                                       | Description                                               |
|---------------------------------|-----------------------------|-----------------------------------------------|-----------------------------------------------------------|
| Posts list loading              | Posts list page             | Page mount / tab change / filter / page change | Skeleton rows shown while GET /api/org/posts is pending  |
| Posts list error                | Posts list page             | GET /api/org/posts returns 4xx/5xx/network     | Error message with Retry button                          |
| Posts list empty                | Posts list page             | API returns empty array                        | Empty state message, e.g., "No posts found"              |
| Posts list populated            | Posts list page             | GET /api/org/posts returns data                | Table rows rendered with pagination                      |
| All tab active                  | Posts list page             | Default route or tab click                     | No status filter applied                                 |
| Published tab active            | Posts list page             | Tab click → published route                    | `?status=published` filter applied                       |
| Draft tab active                | Posts list page             | Tab click → draft route                        | `?status=draft` filter applied                           |
| Archived tab active             | Posts list page             | Tab click → archived route                     | `?status=archived` filter applied                        |
| Filter applied                  | Posts list page             | User selects type filter                       | `?type=X` appended to request; page resets to 1         |
| Sort applied                    | Posts list page             | User selects sort option                       | `?sortBy=X&order=Y` appended; page resets to 1          |
| Details sheet open              | Posts list page (overlay)   | User clicks View Details                       | Side Sheet with post data; no API call                   |
| Details sheet closed            | Posts list page             | [×] click / outside click                      | Sheet dismissed; list unchanged                          |
| Edit prefetch loading           | Posts list page             | User clicks Edit                               | Spinner on Edit button; GET :id in progress              |
| Form sheet open (create)        | Posts list page (overlay)   | User clicks [+ Create Post]                    | Blank form sheet slides in                              |
| Form sheet open (edit)          | Posts list page (overlay)   | Edit prefetch success                          | Pre-filled form sheet slides in                         |
| Form campaign field visible     | Form sheet                  | User selects campaign-related post type        | Related Campaign field appears and becomes required      |
| Form campaign field hidden      | Form sheet                  | User selects non-campaign post type            | Related Campaign field hidden, value cleared             |
| Form dirty (edit)               | Form sheet                  | User changes any field in edit mode            | Discard dialog will appear if user attempts to close     |
| Discard changes dialog open     | Form sheet (overlay)        | Close/Cancel clicked with unsaved changes      | Confirmation dialog before discarding edits              |
| Create post submitting          | Form sheet                  | User clicks [Create]                           | Button spinner; POST in flight                           |
| Edit post submitting            | Form sheet                  | User clicks [Save Changes]                     | Button spinner; PATCH in flight                          |
| Workflow action submitting      | Posts list page             | User clicks Publish/Archive/Restore button     | Button spinner; PATCH status in flight                   |
| Delete dialog open              | Posts list page (overlay)   | User clicks [Delete]                           | Confirmation dialog                                      |
| Delete submitting               | Delete dialog               | User confirms delete                           | Button spinner; DELETE in flight                         |
| Details sheet auto-closed       | Posts list page             | Delete succeeds for the currently open post    | Both delete dialog and details sheet close               |

---

## Decision Points

| #  | Decision                                              | Options                                  |
|----|-------------------------------------------------------|------------------------------------------|
| 1  | Does the post type require a campaign title?          | Yes (campaign_teaser/update/summary) → show Related Campaign field; No → hide field |
| 2  | Is the form dirty when user tries to close edit mode? | Yes → show Discard Changes dialog; No → close sheet immediately |
| 3  | What workflow action applies to this post?            | draft → Publish; published → Archive; archived → Restore to Draft |
| 4  | Is the PostDetailsSheet open for the post being deleted? | Yes → also close the details sheet after delete success; No → only remove row |
| 5  | Which tab is active when list reloads after an action? | Use currently active tab's status filter for the refresh request |
| 6  | Pre-fetch for edit — does the GET :id succeed?        | Yes → open form sheet; No → show error toast, do not open sheet |
| 7  | Create post submitted — which page to show after?     | Reset to page 1 of current tab to show new post in list |
| 8  | Filter or sort changed — should page reset?           | Yes → always reset to page 1 when filter/sort changes |

---

## Related Files

| File                                                                                       | Purpose                                               |
|--------------------------------------------------------------------------------------------|-------------------------------------------------------|
| `src/app/dashboard/org-owner/posts/page.tsx`                                               | All-posts tab route (status="all")                    |
| `src/app/dashboard/org-owner/posts/published/page.tsx`                                     | Published tab route                                   |
| `src/app/dashboard/org-owner/posts/draft/page.tsx`                                         | Draft tab route                                       |
| `src/app/dashboard/org-owner/posts/archived/page.tsx`                                      | Archived tab route                                    |
| `src/components/pages/organization-posts-management/posts-management-page.tsx`             | Main page component, tab state, action handlers       |
| `src/components/pages/organization-posts-management/posts-table.tsx`                       | Table with columns and row action buttons             |
| `src/components/pages/organization-posts-management/posts-filters.tsx`                     | Type filter + sort dropdown controls                  |
| `src/components/pages/organization-posts-management/post-form-sheet.tsx`                   | Create / Edit form sheet with dirty check             |
| `src/components/pages/organization-posts-management/post-details-sheet.tsx`                | View-only side panel sheet                            |
| `src/components/pages/organization-posts-management/delete-post-dialog.tsx`                | Delete confirmation dialog                            |
| `src/components/pages/organization-posts-management/helpers.ts`                            | normalizePostStatus, getWorkflowActionForStatus, isCampaignRelatedPostType, getPostStatusBadgeClass |
| `src/components/pages/organization-posts-management/static-data.ts`                        | Types, status/type label maps, OrganizationPostItem   |
| `src/components/pages/organization-posts-management/index.ts`                              | Barrel export                                         |
