# User Flow: Admin Organizations Management — Detailed (API Integration)
**JOD Platform — Admin Dashboard**

---

## Overview

This document is the **detailed, API-integrated** version of the Admin Organizations Management user flow. It covers every screen, every API call, every loading state, every success path, and every error path — including what the UI shows the admin at each step.

**List Route:** `/dashboard/admin/organizations`
**Details Route:** `/dashboard/admin/organizations/[id]`
**Role:** `admin`

---

## API Endpoints Reference

| Action | Method | Endpoint |
|--------|--------|----------|
| Fetch organizations list | `GET` | `/api/admin/organizations` |
| Fetch single organization | `GET` | `/api/admin/organizations/:id` |
| Toggle organization status | `PATCH` | `/api/admin/organizations/:id/status` |
| Toggle verification status | `PATCH` | `/api/admin/organizations/:id/verification` |
| Accept organization | `PATCH` | `/api/admin/organizations/:id/accept` |
| Delete organization | `DELETE` | `/api/admin/organizations/:id` |
| Create organization | `POST` | `/api/admin/organizations` |
| Edit organization | `PATCH` | `/api/admin/organizations/:id` |

---

## Global Error Types

| Error Code | Meaning | UI Behavior |
|------------|---------|-------------|
| `401` | Unauthorized — session expired | Redirect to login page |
| `403` | Forbidden — not an admin | Show "Access Denied" page |
| `404` | Resource not found | Show not-found state |
| `422` | Validation error | Show field-level error messages |
| `500` | Server error | Show generic error toast |
| Network error | No response from server | Show "Connection failed, try again" toast |

---

## Screen 1: Organizations List — Initial Load

```
Admin navigates to /dashboard/admin/organizations
                    │
                    ▼
         Page mounts — trigger GET /api/admin/organizations
                    │
                    ▼
┌───────────────────────────────────────────────────┐
│               LOADING STATE                       │
│                                                   │
│  Filters bar visible but disabled                 │
│  Table shows skeleton rows (shimmer effect)       │
│  Pagination hidden or disabled                    │
└───────────────────────────────────────────────────┘
                    │
         ┌──────────┴──────────┐
      API Success           API Error
         │                     │
         ▼                     ▼
  Organizations loaded    ┌─────────────────────────┐
  Table renders rows      │       ERROR STATE        │
  Filters enabled         │                          │
  Pagination visible      │  Toast: "Failed to load  │
                          │  organizations. Please   │
                          │  try again."             │
                          │                          │
                          │  Table shows empty       │
                          │  [ Retry ] button        │
                          └─────────────────────────┘
                                      │
                                 Admin clicks Retry
                                      │
                                      ▼
                             Re-trigger GET request
                             (returns to loading state)
```

### Success — List Loaded

```
┌───────────────────────────────────────────────────┐
│          ORGANIZATIONS MANAGEMENT PAGE            │
│                                                   │
│  Filters Bar — all dropdowns enabled              │
│  ┌──────────────┐ ┌──────────────┐ ┌───────────┐ │
│  │ Verification │ │   Location   │ │   Sort    │ │
│  │ [▾ All     ] │ │ [▾ All     ] │ │ [▾ Newest]│ │
│  └──────────────┘ └──────────────┘ └───────────┘ │
│                                                   │
│  Table with all organization rows                 │
│  Pagination controls visible                      │
└───────────────────────────────────────────────────┘
```

---

## Filter & Sort Flow (Client-Side)

Filtering and sorting run entirely in the browser against already-loaded data. No additional API calls are made.

```
Admin changes Verification / Location / Sort dropdown
                    │
                    ▼
         Filter + sort applied to loaded data in memory
                    │
                    ▼
         Current page resets to 1
                    │
                    ▼
         Table re-renders with matching rows
                    │
         ┌──────────┴──────────┐
   Rows found             No rows match
         │                     │
         ▼                     ▼
  Table shows             Table shows:
  matching rows           "No organization data
                           to display."
                          (single row spanning
                           all 8 columns)

Location filter edge case:
  If the selected city is later removed from the
  data (e.g., after a delete), the location filter
  automatically resets to "All Locations".
```

---

## Pagination Flow (Client-Side)

```
Admin clicks a page number or changes page size
                    │
                    ▼
         Loaded data sliced by [startIndex → endIndex]
         No API call — pagination is client-side
                    │
                    ▼
         Table renders the current page slice

Controls:
  [ ‹ ]  [1] [2] … [N]  [ › ]   Page size: [10 ▾]

Note: any filter or sort change resets page → 1
      any page size change resets page → 1
```

---

## Row Action 1: View Organization Details

```
Admin clicks [ View Details icon ] on a row
                    │
                    ▼
         router.push → /dashboard/admin/organizations/[id]
         (no API call at this step — navigation only)
                    │
                    ▼
         Details page mounts and fetches org by ID
         (see Screen 2 below)
```

---

## Row Action 2: Toggle Organization Status

```
Admin clicks [ Toggle Status icon ] on a row
                    │
                    ▼
         Button shows loading spinner
         Row becomes non-interactive
                    │
                    ▼
         PATCH /api/admin/organizations/:id/status
         Body: { status: "inactive" }  ← or "active"
                    │
         ┌──────────┴──────────┐
      API Success           API Error
         │                     │
         ▼                     ▼
  Row status badge        Spinner removed
  flips instantly:        Row re-enabled
    active → inactive     Status badge unchanged
    inactive → active     (no optimistic update)
  Spinner removed              │
  Row re-enabled               ▼
                          Toast (red):
                          "Failed to update status.
                           Please try again."

Success cases:
  active  → inactive : Badge turns Grey  "Inactive"
  inactive → active  : Badge turns Green "Active"
```

---

## Row Action 3: Toggle Verification Status

```
Admin clicks [ Toggle Verification icon ] on a row
                    │
                    ▼
         Button shows loading spinner
         Row becomes non-interactive
                    │
                    ▼
         PATCH /api/admin/organizations/:id/verification
         Body: { verificationStatus: "unverified" }
                    │
         ┌──────────┴──────────┐
      API Success           API Error
         │                     │
         ▼                     ▼
  Verification badge       Spinner removed
  flips instantly:         Row re-enabled
    verified → unverified  Badge unchanged
    unverified → verified       │
  Icon updates:                 ▼
    verified   → BadgeMinus  Toast (red):
    unverified → Check mark  "Failed to update
  Spinner removed           verification.
  Row re-enabled            Please try again."
```

---

## Row Action 4: Delete Organization

```
Admin clicks [ Delete icon ] on a row
                    │
                    ▼
┌───────────────────────────────────────────────┐
│           DELETE ORGANIZATION DIALOG          │
│                                               │
│  "Organization <name> will be removed         │
│   from the current list."                     │
│                                               │
│  [ Cancel ]          [ Confirm Delete ]       │
└───────────────────────────────────────────────┘
                    │
       ┌────────────┴────────────┐
  Cancel clicked          Confirm Delete clicked
       │                          │
       ▼                          ▼
  Dialog closes           [ Confirm Delete ] button
  No API call             shows loading spinner
  No change               Dialog action buttons
                          disabled
                               │
                               ▼
                    DELETE /api/admin/organizations/:id
                               │
                    ┌──────────┴──────────┐
                 API Success           API Error
                    │                     │
                    ▼                     ▼
             Dialog closes          Spinner removed
             Organization row       Buttons re-enabled
             removed from table     Dialog stays open
             (no undo)                   │
                                         ▼
             Toast (green):         Toast (red):
             "Organization          "Failed to delete
              deleted               organization.
              successfully."         Please try again."
```

---

## Screen 2: Organization Details Page — Load

```
Admin lands on /dashboard/admin/organizations/[id]
                    │
                    ▼
         Page mounts — trigger GET /api/admin/organizations/:id
                    │
                    ▼
┌───────────────────────────────────────────────┐
│               LOADING STATE                   │
│                                               │
│  Header card — skeleton shimmer               │
│  Info grid   — skeleton shimmer               │
│  Documents   — skeleton shimmer               │
│  Accept button — disabled / hidden            │
└───────────────────────────────────────────────┘
                    │
         ┌──────────┴───────────────┐
      API Success              API Error
         │                          │
    ┌────┴────┐               ┌─────┴──────────────┐
  Found   Not Found           │    ERROR STATE      │
    │        │                │                    │
    ▼        ▼                │  Toast (red):       │
 Details  Empty State         │  "Failed to load    │
 Page     rendered            │   organization      │
          (see below)         │   details."         │
                              │                     │
                              │  [ ← Back to        │
                              │    Organizations ]  │
                              └─────────────────────┘

404 Not Found state:
┌───────────────────────────────────────────────┐
│                  EMPTY STATE                  │
│                                               │
│       [ Organizations icon ]                  │
│       "Organization Not Found"                │
│       "Could not find the requested           │
│        organization data."                    │
│                                               │
│       [ ← Back to Organizations ]            │
└───────────────────────────────────────────────┘
```

### Success — Details Page Layout

```
┌───────────────────────────────────────────────────┐
│             ORGANIZATION DETAILS PAGE             │
│                                                   │
│  Header Card                                      │
│  ┌─────────────────────────────────────────────┐  │
│  │  [ Verified/Unverified ]  [ Active/Inactive]│  │
│  │  [ ORG-XXXX ]                               │  │
│  │  Organization Name                          │  │
│  │  Organization description                   │  │
│  │                                             │  │
│  │  [ ← Back to Organizations ]               │  │
│  │  [ Accept Organization ]                    │  │
│  │    ↑ enabled only when unverified           │  │
│  │    ↑ disabled + "Organization Accepted"     │  │
│  │      when already verified                  │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  ┌──────────────────┐  ┌───────────────────────┐  │
│  │ REGISTRATION DATA│  │ OWNER & CONTACT INFO  │  │
│  │ • Org Type       │  │ Owner Full Name        │  │
│  │ • Reg. Number    │  │ Owner Email            │  │
│  │ • Est. Date      │  │ Owner Phone            │  │
│  │ • Short Address  │  │ ─────────────────────  │  │
│  │ • City           │  │ Official Email         │  │
│  │ • Created At     │  │ Official Phone         │  │
│  │ • Last Active At │  │ Website (optional)     │  │
│  │ • Accepted At    │  │ Social Media (optional)│  │
│  │   (if accepted)  │  └───────────────────────┘  │
│  └──────────────────┘                             │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │ REGISTRATION ATTACHMENTS                    │  │
│  │  License Document:    <filename.pdf>        │  │
│  │  Delegation Document: <filename.pdf>        │  │
│  └─────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────┘
```

---

## Details Page Action: Accept Organization

```
Admin clicks [ Accept Organization ]
(only visible and enabled when verificationStatus === "unverified")
                    │
                    ▼
         Button label → "Accepting…"
         Button disabled
         Spinner shown on button
                    │
                    ▼
         PATCH /api/admin/organizations/:id/accept
         Body: {
           status: "active",
           verificationStatus: "verified",
           acceptedAt: <ISO timestamp>
         }
                    │
         ┌──────────┴──────────┐
      API Success           API Error
         │                     │
         ▼                     ▼
  Header badges update    Spinner removed
  immediately:            Button re-enabled
    Verification → Green  Button label restored:
    Status → Green        "Accept Organization"
  "Accepted At" field          │
  appears in                   ▼
  Registration Data        Toast (red):
  section with timestamp   "Failed to accept
                            organization.
  Button permanently        Please try again."
  disabled, label →
  "Organization Accepted"

  Toast (green):
  "Organization accepted
   successfully."
```

---

## Screen 3: Organization Form Sheet — Create Mode

```
Admin clicks [ + Add Organization ] (list page trigger)
                    │
                    ▼
┌───────────────────────────────────────────────┐
│         ORGANIZATION FORM SHEET               │
│  (slides in from the right)                   │
│  Title: "Add Organization"                    │
│                                               │
│  Fields pre-filled with empty defaults:       │
│  ┌─────────────────────────────────────────┐  │
│  │  Organization Name *    [            ]  │  │
│  │  Email *                [            ]  │  │
│  │  Phone *                [            ]  │  │
│  │  Location *             [            ]  │  │
│  │  Account Status         [ Active ▾   ]  │  │
│  │  Verification Status    [ Unverified▾]  │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  [ Cancel ]              [ Add ]              │
└───────────────────────────────────────────────┘
                    │
       ┌────────────┴────────────┐
  Cancel clicked          Admin fills fields
       │                  + clicks [ Add ]
       ▼                          │
  Sheet closes                    ▼
  No API call             Client-side validation
  No change                       │
                       ┌──────────┴──────────┐
                   Invalid              All valid
                       │                     │
                       ▼                     ▼
               Field errors shown     [ Add ] button →
               inline under           loading spinner
               each field             Button disabled
               (required, email       Sheet non-interactive
               format, etc.)               │
                                           ▼
                                POST /api/admin/organizations
                                Body: { name, email, phone,
                                        location, status,
                                        verificationStatus }
                                           │
                               ┌───────────┴───────────┐
                            API Success             API Error
                               │                       │
                               ▼                       ▼
                        Sheet closes            Spinner removed
                        New org added           Button re-enabled
                        to table top            Form stays open
                        (list re-fetched              │
                         or prepended)                ▼
                                             ┌────────────────┐
                        Toast (green):       │  Error type?   │
                        "Organization        └────────────────┘
                         created                    │
                         successfully."    ┌────────┴────────┐
                                       422 Validation    500 / Network
                                           │                  │
                                           ▼                  ▼
                                    Field errors        Toast (red):
                                    shown inline        "Failed to create
                                    under each          organization.
                                    failing field       Please try again."
```

---

## Screen 3: Organization Form Sheet — Edit Mode

```
Admin clicks [ Edit icon ] on a row (list page)
                    │
                    ▼
┌───────────────────────────────────────────────┐
│         ORGANIZATION FORM SHEET               │
│  (slides in from the right)                   │
│  Title: "Edit Organization"                   │
│                                               │
│  Fields pre-filled with existing org values   │
│  ┌─────────────────────────────────────────┐  │
│  │  Organization Name *    [ Org Name    ] │  │
│  │  Email *                [ org@org.sa  ] │  │
│  │  Phone *                [ +9665...    ] │  │
│  │  Location *             [ Riyadh      ] │  │
│  │  Account Status         [ Active ▾    ] │  │
│  │  Verification Status    [ Verified ▾  ] │  │
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
                                     PATCH /api/admin/organizations/:id
                                     Body: { name, email, phone,
                                             location, status,
                                             verificationStatus }
                                                      │
                                          ┌───────────┴───────────┐
                                       API Success            API Error
                                          │                       │
                                          ▼                       ▼
                                   Sheet closes           Spinner removed
                                   Org row in table       Button re-enabled
                                   updated with           Form stays open
                                   new values                  │
                                                               ▼
                                   Toast (green):      ┌───────────────┐
                                   "Organization        │  Error type?  │
                                    updated             └───────────────┘
                                    successfully."             │
                                                   ┌───────────┴──────────┐
                                               422 Validation         500 / Network
                                                   │                      │
                                                   ▼                      ▼
                                            Field errors           Toast (red):
                                            shown inline           "Failed to update
                                            under each             organization.
                                            failing field          Please try again."
```

---

## Edit Mode: Discard Changes Dialog

Triggered when admin tries to cancel or close the sheet while `isDirty === true` (form values differ from initial values).

```
Admin clicks [ Cancel ] or closes sheet
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
  current values          No change to table
```

If `isDirty === false` (no changes made):
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
/dashboard/admin/organizations  (List Page)
            │
            ▼
  GET /api/admin/organizations
            │
   ┌────────┴────────┐
 Error            Success
   │                 │
 Toast +          Table loads
 Retry btn             │
                       ├── Filter / Sort ─────────────► Client-side, no API
                       ├── Paginate     ─────────────► Client-side, no API
                       │
                       ├── [ View Details ] ──────────► Navigate to /[id]
                       │                                      │
                       │                              GET /api/admin/organizations/:id
                       │                                      │
                       │                           ┌──────────┴──────────┐
                       │                        Error                  Success
                       │                           │              ┌─────┴──────┐
                       │                      Toast +          404 Not      Found
                       │                      Back btn         Found          │
                       │                                          │        Details
                       │                                     Empty State   rendered
                       │                                                      │
                       │                                          [ Accept Org ] (unverified)
                       │                                                      │
                       │                                    PATCH /api/.../accept
                       │                                                      │
                       │                                           ┌──────────┴──────┐
                       │                                        Error            Success
                       │                                           │                 │
                       │                                      Toast (red)     Badges update
                       │                                      Re-enable btn   acceptedAt shown
                       │                                                      Button disabled
                       │                                                      Toast (green)
                       │
                       ├── [ Toggle Status ] ──────────► PATCH /api/.../status
                       │                                      │
                       │                           ┌──────────┴──────────┐
                       │                        Error                  Success
                       │                           │                     │
                       │                      Toast (red)          Badge flips
                       │                      Badge unchanged       Toast (green)
                       │
                       ├── [ Toggle Verification ] ────► PATCH /api/.../verification
                       │                                      │
                       │                           ┌──────────┴──────────┐
                       │                        Error                  Success
                       │                           │                     │
                       │                      Toast (red)          Badge flips
                       │                      Badge unchanged       Toast (green)
                       │
                       ├── [ Delete ] ─────────────────► Confirm dialog
                       │                                      │
                       │                             DELETE /api/admin/organizations/:id
                       │                                      │
                       │                           ┌──────────┴──────────┐
                       │                        Error                  Success
                       │                           │                     │
                       │                      Toast (red)          Row removed
                       │                      Dialog stays         Toast (green)
                       │                      open                 Dialog closes
                       │
                       └── [ Form Sheet ] ─────────────► Create: POST / Edit: PATCH
                             Create / Edit                         │
                                                       ┌──────────┴──────────┐
                                                    Error                  Success
                                                       │                     │
                                                  422 → field errors   Sheet closes
                                                  500 → toast (red)    List updated
                                                                        Toast (green)
```

---

## Toast Notification Reference

| Action | Success Toast | Error Toast |
|--------|--------------|-------------|
| Load list | *(silent)* | "Failed to load organizations. Please try again." |
| Load details | *(silent)* | "Failed to load organization details." |
| Toggle status | "Status updated successfully." | "Failed to update status. Please try again." |
| Toggle verification | "Verification updated successfully." | "Failed to update verification. Please try again." |
| Accept organization | "Organization accepted successfully." | "Failed to accept organization. Please try again." |
| Delete organization | "Organization deleted successfully." | "Failed to delete organization. Please try again." |
| Create organization | "Organization created successfully." | "Failed to create organization. Please try again." |
| Edit organization | "Organization updated successfully." | "Failed to update organization. Please try again." |

---

## Loading & Disabled States Reference

| UI Element | Loading Behavior |
|------------|-----------------|
| Organizations table (initial load) | Skeleton shimmer rows, filters disabled |
| Toggle Status button | Spinner on icon, row non-interactive |
| Toggle Verification button | Spinner on icon, row non-interactive |
| Delete dialog Confirm button | Spinner on button, both buttons disabled |
| Accept Organization button | Spinner + "Accepting…" label, button disabled |
| Form sheet Submit button | Spinner on button, all fields disabled |
| Form sheet Cancel button | Disabled while submit is in progress |

---

## All Screens & States

| State | Location | Trigger | Description |
|-------|----------|---------|-------------|
| List — Loading | `/organizations` | Page mount | Skeleton table, filters disabled |
| List — Loaded | `/organizations` | GET success | Full table with all orgs |
| List — Load Error | `/organizations` | GET failure | Error toast + Retry button |
| List — Filtered | `/organizations` | Filter change | Narrowed rows, page reset to 1 |
| List — Empty filter | `/organizations` | No matches | "No data" row in table body |
| List — Sorted | `/organizations` | Sort change | Reordered rows, page reset to 1 |
| Toggle status — Loading | `/organizations` | Icon click | Row spinner, non-interactive |
| Toggle status — Error | `/organizations` | PATCH failure | Toast error, badge unchanged |
| Toggle verification — Loading | `/organizations` | Icon click | Row spinner, non-interactive |
| Toggle verification — Error | `/organizations` | PATCH failure | Toast error, badge unchanged |
| Delete dialog — Open | `/organizations` | Delete icon | Dialog with name + Cancel/Confirm |
| Delete dialog — Loading | `/organizations` | Confirm click | Dialog buttons disabled, spinner |
| Delete dialog — Success | `/organizations` | DELETE success | Row removed, toast, dialog closed |
| Delete dialog — Error | `/organizations` | DELETE failure | Toast, dialog stays open |
| Form sheet — Create | `/organizations` | Add trigger | Empty form, "Add Organization" title |
| Form sheet — Edit | `/organizations` | Edit trigger | Pre-filled form, "Edit Organization" title |
| Form sheet — Validation error | `/organizations` | Invalid submit | Inline field errors shown |
| Form sheet — Submitting | `/organizations` | Valid submit | Spinner, fields disabled |
| Form sheet — Submit error | `/organizations` | POST/PATCH fail | Toast or field errors, form stays open |
| Form sheet — Discard dialog | `/organizations` | Cancel dirty form | Discard dialog overlay |
| Details — Loading | `/organizations/[id]` | Page mount | Skeleton cards |
| Details — Found | `/organizations/[id]` | GET success + found | Full org info, 3 cards |
| Details — Not Found | `/organizations/[id]` | GET 404 | Empty state + back button |
| Details — Load Error | `/organizations/[id]` | GET failure | Toast error + back button |
| Details — Accept loading | `/organizations/[id]` | Accept click | Button spinner + disabled |
| Details — Accepted | `/organizations/[id]` | PATCH accept success | Badges green, acceptedAt shown, button disabled |
| Details — Accept error | `/organizations/[id]` | PATCH accept failure | Toast error, button re-enabled |

---

## Decision Points

| # | Decision | Pass | Fail |
|---|----------|------|------|
| 1 | GET organizations succeeds? | Render table | Show error + Retry |
| 2 | GET organization by ID succeeds? | Render details | Error toast + back button |
| 3 | Organization ID found (200)? | Render details page | Render empty state (404) |
| 4 | Verification filter applied? | Show only matching orgs | Show all |
| 5 | Location filter applied? | Show only matching city | Show all |
| 6 | Selected city still in data? | Keep filter | Auto-reset to "All" |
| 7 | PATCH toggle status succeeds? | Badge flips | Toast error, badge unchanged |
| 8 | PATCH toggle verification succeeds? | Badge flips | Toast error, badge unchanged |
| 9 | Admin confirms delete? | Call DELETE API | Close dialog, no call |
| 10 | DELETE organization succeeds? | Remove row, toast | Toast error, dialog stays |
| 11 | Org already verified on details page? | Disable Accept button | Enable Accept button |
| 12 | PATCH accept succeeds? | Update badges + acceptedAt, disable button | Toast error, re-enable button |
| 13 | Form fields pass client validation? | Call POST/PATCH API | Show inline field errors |
| 14 | POST/PATCH form succeeds? | Close sheet, update list | 422 → field errors / 500 → toast |
| 15 | Form dirty on cancel (edit mode)? | Show discard dialog | Close sheet directly |
| 16 | Admin confirms discard? | Close sheet, edits lost | Close dialog, form stays open |

---

## Related Files

| File | Role |
|------|------|
| `src/app/dashboard/admin/organizations/page.tsx` | Route entry — list page |
| `src/app/dashboard/admin/organizations/[id]/page.tsx` | Route entry — details page (resolves `id` param) |
| `src/components/pages/organizations-management/organizations-management-page.tsx` | List page logic — state, filters, actions |
| `src/components/pages/organizations-management/organizations-table.tsx` | Table with all 4 row action buttons |
| `src/components/pages/organizations-management/organizations-filters.tsx` | Verification, location, and sort filter controls |
| `src/components/pages/organizations-management/organization-details-page.tsx` | Full org details view + Accept action |
| `src/components/pages/organizations-management/organization-delete-dialog.tsx` | Delete confirmation dialog |
| `src/components/pages/organizations-management/organization-form-sheet.tsx` | Create / Edit side-panel form + Discard dialog |
| `src/components/pages/organizations-management/helpers.ts` | Badge class helpers for status and verification |
| `src/components/pages/organizations-management/static-data.ts` | Types, labels, and mock organization data |
| `src/components/pages/organizations-management/index.ts` | Public exports for the module |
