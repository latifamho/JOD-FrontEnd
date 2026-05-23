# User Flow: Admin Rewards (Badges) Management — Detailed (API Integration)
**JOD Platform — Admin Dashboard**

---

## Overview

This document is the **detailed, API-integrated** version of the Admin Rewards (Badges) Management user flow. It covers every screen, every API call, every loading state, every success path, and every error path — including what the UI shows the admin at each step.

The rewards section manages **badges** — achievement markers awarded to users based on defined criteria. Each badge has a name, description, criteria, a selectable icon, and an active/inactive status.

**Route:** `/dashboard/admin/rewards`
**Role:** `admin`
**Main Components:** `RewardsManagementPage`, `RewardsTable`, `RewardFormSheet`

> **Note on Delete:** The current rewards implementation does not include a delete action. Badges can only be deactivated via Toggle Status. A delete endpoint is listed in the API reference for future integration.

---

## Badge Statuses

| Status | Field | Badge Color | Description |
|--------|-------|-------------|-------------|
| `active` | `isActive: true` | Green | Badge is live and can be awarded to users |
| `inactive` | `isActive: false` | Grey | Badge is disabled and will not be awarded |

## Badge Icon Options

| Icon Key | Label | Use Case |
|----------|-------|----------|
| `rewards` | General Reward | Default / generic achievement |
| `donors` | Donation | Donation-related achievements |
| `verification` | Verification | Verified organization or identity |
| `campaigns` | Campaigns | Campaign participation achievements |
| `reports` | Reports | Reporting / moderation contributions |
| `goal` | Goal Achievement | Milestone or target completions |

---

## API Endpoints Reference

| Action | Method | Endpoint |
|--------|--------|----------|
| Fetch all badges | `GET` | `/api/admin/badges` |
| Fetch single badge | `GET` | `/api/admin/badges/:id` |
| Create badge | `POST` | `/api/admin/badges` |
| Edit badge | `PATCH` | `/api/admin/badges/:id` |
| Toggle badge status | `PATCH` | `/api/admin/badges/:id/status` |
| Delete badge *(not in current UI)* | `DELETE` | `/api/admin/badges/:id` |

---

## Global Error Types

| Error Code | Meaning | UI Behavior |
|------------|---------|-------------|
| `401` | Unauthorized — session expired | Redirect to login page |
| `403` | Forbidden — not an admin | Show "Access Denied" page |
| `404` | Badge not found | Toast error, row unchanged |
| `422` | Validation error | Show field-level error messages in form |
| `500` | Server error | Show generic error toast |
| Network error | No response from server | Show "Connection failed, try again" toast |

---

## Screen 1: Badges List — Initial Load

```
Admin navigates to /dashboard/admin/rewards
                    │
                    ▼
         Page mounts — trigger GET /api/admin/badges
                    │
                    ▼
┌───────────────────────────────────────────────────┐
│               LOADING STATE                       │
│                                                   │
│  Header visible — "Add Badge" button disabled     │
│  Badge count shows "—"                            │
│  Table shows skeleton rows (shimmer effect)       │
└───────────────────────────────────────────────────┘
                    │
         ┌──────────┴──────────┐
      API Success           API Error
         │                     │
         ▼                     ▼
  Badges loaded            ┌──────────────────────────┐
  Badge count updates      │       ERROR STATE         │
  "Add Badge" button       │                           │
  enabled                  │  Toast (red):             │
                           │  "Failed to load badges.  │
                           │   Please try again."      │
                           │                           │
                           │  [ Retry ] button shown   │
                           └──────────────────────────┘
                                        │
                                  Admin clicks Retry
                                        │
                                        ▼
                               Re-trigger GET request
                               (returns to loading state)
```

### Success — Badges List Layout (Populated)

```
┌───────────────────────────────────────────────────┐
│           BADGES & REWARDS MANAGEMENT             │
│                                                   │
│  Header                                           │
│  ┌─────────────────────────────────────────────┐  │
│  │  Title: "Badges & Rewards Management"       │  │
│  │  Subtitle: "5 badges"                       │  │
│  │                            [ + Add Badge ]  │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  Badges Table                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ Badge │ Icon │ Description │ Criteria        │  │
│  │ Status │ Date │ Actions                      │  │
│  │ ──────────────────────────────────────────  │  │
│  │ Active Donor  │ 🏅 │ "5+ donations..." │ ... │  │
│  │ BDG-001       │    │                   │     │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  (no pagination — all badges shown at once)       │
└───────────────────────────────────────────────────┘
```

### Success — Badges List Layout (Empty)

```
┌───────────────────────────────────────────────────┐
│           BADGES & REWARDS MANAGEMENT             │
│                                                   │
│  Header                                           │
│  ┌─────────────────────────────────────────────┐  │
│  │  Title: "Badges & Rewards Management"       │  │
│  │  Subtitle: "0 badges"                       │  │
│  │                            [ + Add Badge ]  │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │  (dashed border box)                        │  │
│  │                                             │  │
│  │  "No badges yet"                            │  │
│  │  "Add a new badge using the button above"   │  │
│  └─────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────┘
```

---

## Table Columns

| Column | Content |
|--------|---------|
| Badge | Badge name (medium weight) + Badge ID |
| Icon | Selected icon rendered in a small rounded box |
| Description | Badge description text (max width truncated) |
| Criteria | Criteria string (e.g. "5 completed donations") |
| Status | Badge — Active (green) / Inactive (grey) |
| Date | Created at date (date only, no time) |
| Actions | Edit · Toggle Status |

> No delete button exists in the current table. Deactivation via Toggle Status is the intended way to retire a badge.

---

## Row Action 1: Edit Badge

```
Admin clicks [ Edit icon ] on a row
                    │
                    ▼
         GET /api/admin/badges/:id
         (fetch fresh badge data before opening form)
                    │
         ┌──────────┴──────────┐
      API Success           API Error
         │                     │
         ▼                     ▼
  RewardFormSheet opens    Toast (red):
  in Edit mode             "Failed to load badge data.
  pre-filled with          Please try again."
  fetched values           Sheet does not open
  (see Screen 2 — Edit)
```

---

## Row Action 2: Toggle Badge Status

```
Admin clicks [ Toggle Status icon ] on a row
                    │
                    ▼
         Button shows loading spinner
         Row becomes non-interactive
                    │
                    ▼
         PATCH /api/admin/badges/:id/status
         Body: { isActive: false }  ← or true
                    │
         ┌──────────┴──────────┐
      API Success           API Error
         │                     │
         ▼                     ▼
  Row status badge         Spinner removed
  flips instantly:         Row re-enabled
    active → inactive      Status badge unchanged
    inactive → active           │
  Icon updates:                 ▼
    active   → ShieldOff   Toast (red):
    inactive → ShieldCheck "Failed to update
  Spinner removed           badge status.
  Row re-enabled            Please try again."

Success cases:
  isActive true  → false : Badge turns Grey  "Inactive"
                           Icon → ShieldOff  (warning)
  isActive false → true  : Badge turns Green "Active"
                           Icon → ShieldCheck (success)
```

---

## Screen 2: Reward Form Sheet — Create Mode

```
Admin clicks [ + Add Badge ] button
                    │
                    ▼
┌───────────────────────────────────────────────┐
│           REWARD FORM SHEET                   │
│  (slides in from the right)                   │
│  Title: "Add New Badge"                       │
│                                               │
│  Fields pre-filled with empty defaults:       │
│  ┌─────────────────────────────────────────┐  │
│  │  Badge Name *        [              ]   │  │
│  │  Description *       [              ]   │  │
│  │                      (textarea 3 rows)  │  │
│  │  Criteria *          [              ]   │  │
│  │  Icon                [ General ▾    ]   │  │
│  │  Status              [ Active ▾     ]   │  │
│  │                                         │  │
│  │  ┌─────────────────────────────────┐    │  │
│  │  │  Icon Preview                   │    │  │
│  │  │  [ 🏆 ]  (updates live as       │    │  │
│  │  │          icon selection changes) │    │  │
│  │  └─────────────────────────────────┘    │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  [ Cancel ]            [ Add Badge ]          │
└───────────────────────────────────────────────┘
                    │
       ┌────────────┴────────────┐
  Cancel clicked          Admin fills fields
       │                  + clicks [ Add Badge ]
       ▼                          │
  Sheet closes                    ▼
  No API call             Client-side validation
  No change                       │
                       ┌──────────┴──────────┐
                   Invalid              All valid
                       │                     │
                       ▼                     ▼
               Field errors shown    [ Add Badge ] →
               inline under          loading spinner
               each field            Button disabled
               (required fields)     Sheet non-interactive
                                           │
                                           ▼
                                POST /api/admin/badges
                                Body: {
                                  name, description,
                                  criteria, iconName,
                                  isActive
                                }
                                           │
                               ┌───────────┴───────────┐
                            API Success             API Error
                               │                       │
                               ▼                       ▼
                        Sheet closes            Spinner removed
                        New badge prepended     Button re-enabled
                        to table top            Form stays open
                        Badge count                  │
                        increments                   ▼
                                             ┌───────────────┐
                        Toast (green):       │  Error type?  │
                        "Badge created       └───────────────┘
                         successfully."             │
                                          ┌─────────┴─────────┐
                                      422 Validation      500 / Network
                                          │                    │
                                          ▼                    ▼
                                   Field errors          Toast (red):
                                   shown inline          "Failed to create
                                   under each            badge. Please
                                   failing field         try again."
```

---

## Screen 2: Reward Form Sheet — Edit Mode

```
Admin clicks [ Edit icon ] on a row
→ GET /api/admin/badges/:id succeeds
                    │
                    ▼
┌───────────────────────────────────────────────┐
│           REWARD FORM SHEET                   │
│  (slides in from the right)                   │
│  Title: "Edit Badge"                          │
│                                               │
│  Fields pre-filled with fetched badge values: │
│  ┌─────────────────────────────────────────┐  │
│  │  Badge Name *        [ Active Donor   ] │  │
│  │  Description *       [ "For those who  │  │
│  │                        completed 5+..."  ] │
│  │  Criteria *          [ 5 donations    ] │  │
│  │  Icon                [ Donation ▾     ] │  │
│  │  Status              [ Active ▾       ] │  │
│  │                                         │  │
│  │  ┌─────────────────────────────────┐    │  │
│  │  │  Icon Preview                   │    │  │
│  │  │  [ 🏅 ]  (updates live)          │    │  │
│  │  └─────────────────────────────────┘    │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  [ Cancel ]         [ Save Changes ]          │
└───────────────────────────────────────────────┘
                    │
         Admin edits one or more fields
         isDirty = true
                    │
       ┌────────────┴────────────────────────┐
  Cancel / close             Admin clicks [ Save Changes ]
  (dirty check)                          │
       │                                  ▼
       ▼                        Client-side validation
  DISCARD DIALOG                         │
  (see below)            ┌───────────────┴───────────────┐
                      Invalid                        All valid
                         │                               │
                         ▼                               ▼
                  Field errors shown          [ Save Changes ] →
                  inline under               loading spinner
                  each field                 Button disabled
                                             Sheet non-interactive
                                                      │
                                                      ▼
                                     PATCH /api/admin/badges/:id
                                     Body: {
                                       name, description,
                                       criteria, iconName,
                                       isActive
                                     }
                                                      │
                                          ┌───────────┴───────────┐
                                       API Success            API Error
                                          │                       │
                                          ▼                       ▼
                                   Sheet closes           Spinner removed
                                   Badge row in table     Button re-enabled
                                   updated with           Form stays open
                                   new values                  │
                                   Icon in table               ▼
                                   updates to             ┌───────────────┐
                                   new selection          │  Error type?  │
                                                          └───────────────┘
                                   Toast (green):                │
                                   "Badge updated        ┌───────┴───────┐
                                    successfully."    422 Validation   500 / Network
                                                         │                  │
                                                         ▼                  ▼
                                                  Field errors        Toast (red):
                                                  shown inline        "Failed to update
                                                  under each          badge. Please
                                                  failing field       try again."
```

---

## Edit Mode: Discard Changes Dialog

Triggered when the admin tries to cancel or close the sheet while `isDirty === true` (form values differ from the values fetched from the API).

```
Admin clicks [ Cancel ] or closes the sheet
while there are unsaved changes (isDirty = true)
                    │
                    ▼
┌───────────────────────────────────────────────┐
│          DISCARD CHANGES DIALOG               │
│                                               │
│  "Discard changes?"                           │
│                                               │
│  "You have unsaved changes.                   │
│   Do you want to close without saving?"       │
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
  current values          No change to badge row
```

If `isDirty === false` (no changes made in edit mode):

```
Admin clicks [ Cancel ] with no changes
                    │
                    ▼
         No discard dialog shown
         Sheet closes immediately
         No API call
```

---

## Complete Flow Diagram — All Actions with API

```
/dashboard/admin/rewards  (Badges List)
            │
            ▼
  GET /api/admin/badges
            │
   ┌────────┴────────┐
 Error            Success
   │                 │
 Toast +          Table loads
 Retry btn        (badges shown in order)
                       │
                       ├── [ + Add Badge ] ──────────► Open RewardFormSheet (Create mode)
                       │                               Empty form, no API call yet
                       │                                     │
                       │                              POST /api/admin/badges
                       │                                     │
                       │                          ┌──────────┴──────────┐
                       │                       Error                  Success
                       │                          │                     │
                       │                    422 → field errors    Sheet closes
                       │                    500 → toast (red)     Badge prepended
                       │                                          Count increments
                       │                                          Toast (green)
                       │
                       ├── [ Edit ] ─────────────────► GET /api/admin/badges/:id
                       │                                     │
                       │                          ┌──────────┴──────────┐
                       │                       Error                  Success
                       │                          │                     │
                       │                     Toast (red)        Open RewardFormSheet
                       │                     Sheet blocked      (Edit mode, pre-filled)
                       │                                               │
                       │                                    PATCH /api/admin/badges/:id
                       │                                               │
                       │                                    ┌──────────┴──────────┐
                       │                                 Error                  Success
                       │                                    │                     │
                       │                             422 → field errors    Sheet closes
                       │                             500 → toast (red)     Row updated
                       │                             Dirty cancel →        Toast (green)
                       │                             Discard dialog
                       │
                       └── [ Toggle Status ] ────────► PATCH /api/admin/badges/:id/status
                                                             │
                                                  ┌──────────┴──────────┐
                                               Error                  Success
                                                  │                     │
                                             Toast (red)          Badge flips:
                                             Badge unchanged        active ↔ inactive
                                                                   Icon updates
                                                                   Toast (green)
```

---

## Icon Preview Behavior

The form sheet includes a live icon preview that updates as the admin changes the Icon selection. This is a purely visual component and has no effect on the API call.

```
Admin changes Icon dropdown in the form sheet
                    │
                    ▼
         Icon preview box updates immediately
         Shows the selected icon rendered at size-5
         inside a rounded primary-tinted container
         No API call — preview is client-side only
```

---

## Toast Notification Reference

| Action | Success Toast | Error Toast |
|--------|--------------|-------------|
| Load badges list | *(silent)* | "Failed to load badges. Please try again." |
| Load badge for edit | *(silent)* | "Failed to load badge data. Please try again." |
| Toggle badge status | "Badge status updated successfully." | "Failed to update badge status. Please try again." |
| Create badge | "Badge created successfully." | 422: field errors shown · 500: "Failed to create badge. Please try again." |
| Edit badge | "Badge updated successfully." | 422: field errors shown · 500: "Failed to update badge. Please try again." |

---

## Loading & Disabled States Reference

| UI Element | Loading Behavior |
|------------|-----------------|
| Badges table (initial load) | Skeleton shimmer rows, "Add Badge" button disabled |
| Toggle Status button | Spinner on icon, row non-interactive |
| Edit icon (pre-fetch) | Spinner on icon, row non-interactive while fetching badge data |
| Form sheet Submit button | Spinner on button, all fields disabled |
| Form sheet Cancel button | Disabled while submit is in progress |

---

## All Screens & States

| State | Location | Trigger | Description |
|-------|----------|---------|-------------|
| List — Loading | `/rewards` | Page mount | Skeleton table, "Add Badge" button disabled |
| List — Loaded | `/rewards` | GET success | Full table with all badges |
| List — Load Error | `/rewards` | GET failure | Toast error + Retry button |
| List — Empty | `/rewards` | GET success, 0 badges | Dashed empty state with hint message |
| Toggle status — Loading | `/rewards` | Icon click | Row spinner, non-interactive |
| Toggle status — Success | `/rewards` | PATCH success | Badge flips, icon updates, toast |
| Toggle status — Error | `/rewards` | PATCH failure | Toast error, badge unchanged |
| Edit — Fetching | `/rewards` | Edit icon click | Row spinner while fetching badge data |
| Edit — Fetch Error | `/rewards` | GET failure | Toast error, sheet does not open |
| Form sheet — Create | `/rewards` | Add Badge click | Empty form, "Add New Badge" title |
| Form sheet — Edit | `/rewards` | Edit icon click + GET success | Pre-filled form, "Edit Badge" title |
| Form sheet — Icon preview | `/rewards` | Icon dropdown change | Preview box updates live, no API call |
| Form sheet — Validation error | `/rewards` | Invalid submit | Inline field errors shown |
| Form sheet — Submitting | `/rewards` | Valid submit | Spinner, all fields disabled |
| Form sheet — Submit error (422) | `/rewards` | POST/PATCH 422 | Field-level inline errors shown |
| Form sheet — Submit error (500) | `/rewards` | POST/PATCH 500 | Toast error, form stays open |
| Form sheet — Discard dialog | `/rewards` | Cancel dirty edit form | Discard dialog overlay |

---

## Decision Points

| # | Decision | Pass | Fail |
|---|----------|------|------|
| 1 | GET badges list succeeds? | Render table or empty state | Toast error + Retry button |
| 2 | Badges list is empty after load? | Show dashed empty state | Show table with rows |
| 3 | GET badge by ID (for edit) succeeds? | Open form sheet pre-filled | Toast error, sheet does not open |
| 4 | PATCH toggle status succeeds? | Badge flips, icon updates, toast | Toast error, badge unchanged |
| 5 | Form fields pass client validation? | Call POST/PATCH API | Show inline field errors |
| 6 | POST/PATCH form returns 422? | — | Field-level inline errors shown |
| 7 | POST/PATCH form returns 500 / network? | — | Toast error, form stays open |
| 8 | Form is dirty on cancel (edit mode)? | Show discard dialog | Close sheet directly, no API call |
| 9 | Admin confirms discard? | Sheet closes, edits lost | Discard dialog closes, form stays open |
| 10 | Badge being deactivated or activated? | isActive true → false: Grey badge | isActive false → true: Green badge |

---

## Related Files

| File | Role |
|------|------|
| `src/app/dashboard/admin/rewards/page.tsx` | Route entry — rewards management page |
| `src/components/pages/rewards-management/rewards-management-page.tsx` | Page logic — state, all action handlers, empty state |
| `src/components/pages/rewards-management/rewards-table.tsx` | Table with Edit and Toggle Status row actions |
| `src/components/pages/rewards-management/reward-form-sheet.tsx` | Create / Edit side-panel form + live icon preview + Discard dialog |
| `src/components/pages/rewards-management/helpers.ts` | Badge ID generator + status badge class helper |
| `src/components/pages/rewards-management/static-data.ts` | Types, icon options, status labels, and mock badge data |
| `src/components/pages/rewards-management/index.ts` | Public exports for the module |
