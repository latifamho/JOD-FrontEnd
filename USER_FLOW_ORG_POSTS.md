# User Flow: Organization Posts Management
**JOD Platform — Org Owner Dashboard**

---

## Overview

This document describes the end-to-end user flow for managing posts inside the organization owner dashboard. The section allows the org owner to create, view, edit, publish, archive, restore, and delete posts across four status-scoped tabs.

**Base Route:** `/dashboard/org-owner/posts`
**Role:** `organization_owner`
**Main Component:** `OrganizationPostsManagementPage`

---

## Post Statuses

| Status | Description |
|--------|-------------|
| `draft` | Saved but not visible to the public |
| `published` | Live and visible publicly |
| `archived` | Hidden from public, kept for records |

## Post Types

| Type | Description |
|------|-------------|
| `general` | Standard organization post |
| `job_opportunity` | Job or volunteer opportunity listing |
| `campaign_teaser` | Intro post for an upcoming campaign |
| `campaign_update` | Progress update for an active campaign |
| `campaign_summary` | Final results summary of a campaign |

> Campaign-related types (`campaign_teaser`, `campaign_update`, `campaign_summary`) require a **linked campaign title** field.

---

## Entry Points

| Source | Route |
|--------|-------|
| Sidebar — All Posts | `/dashboard/org-owner/posts` |
| Sidebar tab — Drafts | `/dashboard/org-owner/posts/draft` |
| Sidebar tab — Published | `/dashboard/org-owner/posts/published` |
| Sidebar tab — Archived | `/dashboard/org-owner/posts/archived` |

---

## Main Screen Flow

```
User navigates to /dashboard/org-owner/posts
                    │
                    ▼
┌───────────────────────────────────────────────┐
│           POSTS MANAGEMENT PAGE               │
│                                               │
│  Header                                       │
│  ┌─────────────────────────────────────────┐  │
│  │  Title: "Posts Management"              │  │
│  │  Subtitle: X results found             │  │
│  │                            [ + New Post ]  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  Section Tabs (top navigation)                │
│  [ All ]  [ Draft ]  [ Published ]  [ Archived]│
│                                               │
│  Filters Bar                                  │
│  ┌──────────────────┐  ┌────────────────────┐ │
│  │ Type  [▾ All]    │  │ Sort [▾ Newest]    │ │
│  └──────────────────┘  └────────────────────┘ │
│                                               │
│  Posts Table                                  │
│  ┌─────────────────────────────────────────┐  │
│  │ Title │ Type │ Status │ Author │ Actions│  │
│  │ ...   │ ...  │ ...    │ ...    │ ...    │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  Pagination Controls                          │
│  [ < Prev ]  [1] [2] [3]  [ Next > ]         │
│  Page size: [10 ▾]                            │
└───────────────────────────────────────────────┘
```

---

## Filter & Sort Flow

```
User changes Type Filter or Sort option
                    │
                    ▼
         ┌──────────────────────┐
         │  Re-filter in memory │
         │  Re-sort in memory   │
         └──────────┬───────────┘
                    │
                    ▼
         Page resets to 1
                    │
                    ▼
         Table re-renders with
         matching filtered rows

Type Filter options:
  • All Types
  • General
  • Job Opportunity
  • Campaign Teaser
  • Campaign Update
  • Campaign Summary

Sort options:
  • Last Updated — Newest first  (default)
  • Last Updated — Oldest first
  • Title — A → Z
  • Title — Z → A
```

---

## Create Post Flow

```
User clicks [ + New Post ]
                    │
                    ▼
┌───────────────────────────────────────────────┐
│           CREATE POST SIDE SHEET              │
│                                               │
│  Fields (all required unless noted):          │
│  ┌─────────────────────────────────────────┐  │
│  │  Title              [_______________]   │  │
│  │  Summary            [_______________]   │  │
│  │                     [_______________]   │  │
│  │  Post Type          [▾ General      ]   │  │
│  │  Status             [▾ Draft        ]   │  │
│  │  Author Name        [_______________]   │  │
│  │  Location           [_______________]   │  │
│  │                                         │  │
│  │  ─── shown only for campaign types ─── │  │
│  │  Linked Campaign    [_______________]   │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  [ Cancel ]              [ Add Post ]         │
└───────────────────┬───────────────────────────┘
                    │
         ┌──────────▼──────────┐
         │  HTML5 validation   │
         │  (required fields)  │
         └──────────┬──────────┘
                    │
       ┌────────────┴─────────────┐
  ✗ FAIL                    ✓ PASS
       │                          │
       ▼                          ▼
  Browser native            New post added
  field errors              to top of list
                            Sheet closes
                            Table updates
```

---

## Edit Post Flow

```
User clicks [ Edit ] on a row
                    │
                    ▼
┌───────────────────────────────────────────────┐
│            EDIT POST SIDE SHEET               │
│                                               │
│  Same fields as Create,                       │
│  pre-filled with current post values          │
│                                               │
│  [ Cancel ]          [ Save Changes ]         │
└───────────────────────────────────────────────┘
                    │
       ┌────────────┴────────────┐
  User edits             User clicks Cancel
  something              without changes
       │                          │
       ▼                          ▼
  Sheet is "dirty"        Sheet closes safely
       │
  User clicks Cancel
       │
       ▼
┌───────────────────────────────────────────────┐
│          DISCARD CHANGES DIALOG               │
│                                               │
│  "You have unsaved changes.                   │
│   Close without saving?"                      │
│                                               │
│  [ Continue Editing ]  [ Discard Changes ]    │
└───────────────────────────────────────────────┘
       │                          │
       ▼                          ▼
  Sheet stays open        Sheet closes
  (resume editing)        Changes lost
```

---

## View Post Details Flow

```
User clicks [ View Details ] on a row
                    │
                    ▼
┌───────────────────────────────────────────────┐
│          POST DETAILS SIDE SHEET              │
│                                               │
│  Read-only display of all post fields:        │
│  • Title                                      │
│  • Summary                                    │
│  • Type & Status badges                       │
│  • Author Name                                │
│  • Location                                   │
│  • Linked Campaign (if applicable)            │
│  • Created At / Updated At / Published At     │
│  • Views count                                │
│  • Reactions count                            │
│  • Applications count (for job posts)         │
│                                               │
│  [ Close ]                                    │
└───────────────────────────────────────────────┘
```

---

## Workflow Actions Flow

Each post has one available workflow action based on its current status:

```
┌─────────────────────────────────────────────────────────┐
│                  STATUS TRANSITION MAP                  │
│                                                         │
│   DRAFT  ──[ Publish ]──►  PUBLISHED                   │
│                                │                        │
│                         [ Archive ]                     │
│                                │                        │
│                                ▼                        │
│                           ARCHIVED ──[ Restore ]──► DRAFT│
└─────────────────────────────────────────────────────────┘
```

### Publish (Draft → Published)

```
User clicks [ Publish ] on a draft row
                    │
                    ▼
         Post status → "published"
         publishedAt → set to now (if not already set)
         updatedAt   → set to now
                    │
                    ▼
         Row moves out of Draft tab
         Row appears in Published tab
```

### Archive (Published → Archived)

```
User clicks [ Archive ] on a published row
                    │
                    ▼
         Post status → "archived"
         updatedAt   → set to now
         publishedAt → retained (not cleared)
                    │
                    ▼
         Row moves out of Published tab
         Row appears in Archived tab
```

### Restore (Archived → Draft)

```
User clicks [ Restore to Draft ] on an archived row
                    │
                    ▼
         Post status → "draft"
         updatedAt   → set to now
                    │
                    ▼
         Row moves out of Archived tab
         Row appears in Draft tab
```

---

## Delete Post Flow

```
User clicks [ Delete ] on any row
                    │
                    ▼
┌───────────────────────────────────────────────┐
│             DELETE POST DIALOG                │
│                                               │
│  "This post will be permanently deleted       │
│   and cannot be undone."                      │
│                                               │
│  Post: "<post title>"                         │
│                                               │
│  [ Cancel ]          [ Confirm Delete ]       │
└───────────────────────────────────────────────┘
                    │
       ┌────────────┴────────────┐
  Cancel clicked          Confirm clicked
       │                          │
       ▼                          ▼
  Dialog closes           Post removed from list
  No change               permanently (no undo)
                          If details sheet was open
                          for this post → sheet closes
```

---

## Empty State Flow

```
Active filters return 0 results
                    │
                    ▼
┌───────────────────────────────────────────────┐
│                 EMPTY STATE                   │
│                                               │
│        [  Posts icon  ]                       │
│        "No matching posts"                    │
│        "Try changing the filters to see       │
│         more results."                        │
└───────────────────────────────────────────────┘
         User adjusts Type filter or Sort
                    │
                    ▼
         Table re-renders with results
```

---

## Pagination Flow

```
Posts list has more items than page size
                    │
                    ▼
         Pagination controls appear below table
                    │
         ┌──────────┴──────────────────┐
         │  [ < ]  [1] [2] ... [N]  [ > ]  │
         │  Page size: [ 10 ▾ ]           │
         └────────────────────────────────┘
                    │
       ┌────────────┴────────────┐
  Page changed             Page size changed
       │                          │
       ▼                          ▼
  Show next/prev slice     Reset to page 1
  of filtered posts        Show new slice size
```

> Page also resets to 1 whenever the type filter, sort option, or status tab changes.

---

## Complete Screens & States

| State | Trigger | Description |
|-------|---------|-------------|
| Posts list — All | Navigate to `/posts` | All posts regardless of status |
| Posts list — Draft | Navigate to `/posts/draft` | Only draft posts |
| Posts list — Published | Navigate to `/posts/published` | Only published posts |
| Posts list — Archived | Navigate to `/posts/archived` | Only archived posts |
| Filtered list | Change type filter or sort | Narrowed/reordered results |
| Empty state | Filters match nothing | Prompt to adjust filters |
| Create sheet — Open | Click "+ New Post" | Blank form slide-over |
| Create sheet — Saved | Submit valid form | Post added, sheet closes |
| Edit sheet — Open | Click "Edit" on row | Pre-filled form slide-over |
| Edit sheet — Dirty | User edits a field | Discard dialog guards close |
| Edit sheet — Saved | Submit valid form | Post updated, sheet closes |
| Discard dialog | Close dirty edit sheet | Confirm loss of changes |
| Details sheet | Click "View Details" | Read-only post info panel |
| Delete dialog — Open | Click "Delete" on row | Confirmation modal |
| Delete dialog — Confirmed | Click "Confirm Delete" | Post permanently removed |
| Publish action | Click "Publish" on draft | Status → published |
| Archive action | Click "Archive" on published | Status → archived |
| Restore action | Click "Restore" on archived | Status → draft |

---

## Workflow Transition Summary

| Current Status | Available Action | Resulting Status |
|----------------|-----------------|-----------------|
| `draft` | Publish | `published` |
| `published` | Archive | `archived` |
| `archived` | Restore to Draft | `draft` |

---

## Related Files

| File | Role |
|------|------|
| `src/app/dashboard/org-owner/posts/page.tsx` | Route — All posts |
| `src/app/dashboard/org-owner/posts/draft/page.tsx` | Route — Draft posts |
| `src/app/dashboard/org-owner/posts/published/page.tsx` | Route — Published posts |
| `src/app/dashboard/org-owner/posts/archived/page.tsx` | Route — Archived posts |
| `src/components/pages/organization-posts-management/posts-management-page.tsx` | Main page logic and state |
| `src/components/pages/organization-posts-management/posts-table.tsx` | Table with row actions |
| `src/components/pages/organization-posts-management/posts-filters.tsx` | Type filter and sort controls |
| `src/components/pages/organization-posts-management/post-form-sheet.tsx` | Create / Edit side sheet |
| `src/components/pages/organization-posts-management/post-details-sheet.tsx` | Read-only details panel |
| `src/components/pages/organization-posts-management/delete-post-dialog.tsx` | Delete confirmation dialog |
| `src/components/pages/organization-posts-management/helpers.ts` | Status normalization, workflow logic, badge classes |
| `src/components/pages/organization-posts-management/static-data.ts` | Post types, statuses, and mock data |
