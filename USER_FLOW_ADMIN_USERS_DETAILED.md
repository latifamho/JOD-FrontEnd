# User Flow: Admin Users Management — Detailed (API Integration)
**JOD Platform — Admin Dashboard**

---

## Overview

This document is the **detailed, API-integrated** version of the Admin Users Management user flow. It covers every screen, every API call, every loading state, every success path, and every error path — including what the UI shows the admin at each step.

**Route:** `/dashboard/admin/users`
**Role:** `admin`
**Main Components:** `UsersManagementPage`, `UsersTable`, `UserFormSheet`, `UserDeleteDialog`, `UserChangePasswordDialog`

---

## User Statuses

| Status | Badge Color | Description |
|--------|-------------|-------------|
| `active` | Green | User account is active and accessible |
| `inactive` | Grey | User account is deactivated |

## User Roles

| Role | Description |
|------|-------------|
| `general` | General platform user |
| `volunteer` | User registered as a volunteer |
| `job_seeker` | User looking for job opportunities |
| `donor` | User registered as a donor |

---

## API Endpoints Reference

| Action | Method | Endpoint |
|--------|--------|----------|
| Fetch users list | `GET` | `/api/admin/users?page=1&pageSize=10` |
| Create user | `POST` | `/api/admin/users` |
| Edit user | `PATCH` | `/api/admin/users/:id` |
| Toggle user status | `PATCH` | `/api/admin/users/:id/status` |
| Change user password | `PATCH` | `/api/admin/users/:id/password` |
| Delete user | `DELETE` | `/api/admin/users/:id` |

---

## Global Error Types

| Error Code | Meaning | UI Behavior |
|------------|---------|-------------|
| `401` | Unauthorized — session expired | Redirect to login page |
| `403` | Forbidden — not an admin | Show "Access Denied" page |
| `404` | User not found | Toast error, row remains unchanged |
| `409` | Conflict — email already exists | Inline field error on the email field |
| `422` | Validation error | Show field-level error messages in form |
| `500` | Server error | Show generic error toast |
| Network error | No response from server | Show "Connection failed, try again" toast |

---

## Screen 1: Users List — Initial Load

```
Admin navigates to /dashboard/admin/users
                    │
                    ▼
         Page mounts — trigger GET /api/admin/users?page=1&pageSize=10
                    │
                    ▼
┌───────────────────────────────────────────────────┐
│               LOADING STATE                       │
│                                                   │
│  Header visible — "Add New User" button disabled  │
│  Table shows skeleton rows (shimmer effect)       │
│  Pagination hidden or disabled                    │
└───────────────────────────────────────────────────┘
                    │
         ┌──────────┴──────────┐
      API Success           API Error
         │                     │
         ▼                     ▼
  Users loaded             ┌──────────────────────────┐
  Table renders rows       │       ERROR STATE         │
  "Add New User"           │                           │
  button enabled           │  Toast (red):             │
  Pagination visible       │  "Failed to load users.   │
                           │   Please try again."      │
                           │                           │
                           │  Table shows empty        │
                           │  [ Retry ] button         │
                           └──────────────────────────┘
                                        │
                                  Admin clicks Retry
                                        │
                                        ▼
                               Re-trigger GET request
                               (returns to loading state)
```

### Success — Users List Layout

```
┌───────────────────────────────────────────────────┐
│             USERS MANAGEMENT PAGE                 │
│                                                   │
│  Header                                           │
│  ┌─────────────────────────────────────────────┐  │
│  │  Title: "Users Management"                  │  │
│  │  Subtitle: "Manage user accounts and        │  │
│  │  actions via the table."                    │  │
│  │                          [ + Add New User ] │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  Users Table                                      │
│  ┌─────────────────────────────────────────────┐  │
│  │ User │ Status │ Contact │ Activity │ Dates  │  │
│  │ Actions                                     │  │
│  │ ────────────────────────────────────────    │  │
│  │ User Name  │ [Active] │ email  │ Posts: 6   │  │
│  │ USR-1001   │          │ phone  │ Reports: 1 │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  Pagination Controls                              │
│  [ < ]  [1] [2] ... [N]  [ > ]   Page: [10 ▾]    │
└───────────────────────────────────────────────────┘
```

---

## Table Columns

| Column | Content |
|--------|---------|
| User | Full name (bold) + User ID |
| Status | Badge — Active / Inactive |
| Contact | Email address + phone number |
| Activity | Posts count + Reports filed against user |
| Dates | Joined at + Last active at |
| Actions | Edit · Toggle Status · Change Password · Delete |

---

## Sort Behavior

```
The table is always sorted by newest created first.
No sort control is exposed to the admin.
The API always returns data ordered by createdAt DESC.

GET /api/admin/users?page=1&pageSize=10&sortBy=created_desc
```

---

## Pagination Flow

```
Admin clicks a page number or changes page size
                    │
                    ▼
         GET /api/admin/users?page=<N>&pageSize=<size>
                    │
                    ▼
┌───────────────────────────────────────────────────┐
│               LOADING STATE                       │
│                                                   │
│  Table shows skeleton rows                        │
│  Pagination controls remain visible               │
│  Action buttons on rows disabled                  │
└───────────────────────────────────────────────────┘
                    │
         ┌──────────┴──────────┐
      API Success           API Error
         │                     │
         ▼                     ▼
  Table renders new       Toast (red):
  page rows               "Failed to load users.
                           Please try again."

Controls:
  [ ‹ ]  [1] [2] … [N]  [ › ]   Page size: [10 ▾]

Note: any successful create or delete re-fetches
      the current page to reflect updated data
```

---

## Row Action 1: Edit User

```
Admin clicks [ Edit icon ] on a row
                    │
                    ▼
         GET /api/admin/users/:id
         (fetch fresh user data before opening form)
                    │
         ┌──────────┴──────────┐
      API Success           API Error
         │                     │
         ▼                     ▼
  UserFormSheet opens      Toast (red):
  in Edit mode             "Failed to load user data.
  pre-filled with          Please try again."
  fetched values           Sheet does not open
  (see Screen 2 — Edit)
```

---

## Row Action 2: Toggle User Status

```
Admin clicks [ Toggle Status icon ] on a row
                    │
                    ▼
         Button shows loading spinner
         Row becomes non-interactive
                    │
                    ▼
         PATCH /api/admin/users/:id/status
         Body: { status: "inactive" }  ← or "active"
                    │
         ┌──────────┴──────────┐
      API Success           API Error
         │                     │
         ▼                     ▼
  Row status badge         Spinner removed
  flips instantly:         Row re-enabled
    active → inactive      Status badge unchanged
    inactive → active           │
  Spinner removed               ▼
  Row re-enabled           Toast (red):
                           "Failed to update status.
                            Please try again."

Success cases:
  active   → inactive : Badge turns Grey  "Inactive"
  inactive → active   : Badge turns Green "Active"
```

---

## Row Action 3: Change User Password

```
Admin clicks [ Change Password icon ] on a row
                    │
                    ▼
         UserChangePasswordDialog opens
         (no API call at this step)
                    │
                    ▼
┌───────────────────────────────────────────────┐
│         CHANGE PASSWORD DIALOG                │
│                                               │
│  "Set a new password for <user name>."        │
│                                               │
│  New Password         [ ••••••••  👁 ]        │
│  Confirm Password     [ ••••••••  👁 ]        │
│                                               │
│  Hint: Minimum 8 characters.                  │
│        Both fields must match.                │
│                                               │
│  [ Cancel ]        [ Save ]  ← disabled until │
│                                 rules pass    │
└───────────────────────────────────────────────┘

Submit button enabled only when:
  newPassword.trim().length >= 8
  AND newPassword === confirmPassword
```

### Change Password — Validation & Submission

```
Admin types in both password fields
                    │
         ┌──────────┴──────────┐
   Rules not met           Rules met
         │                     │
         ▼                     ▼
  [ Save ] stays         [ Save ] becomes
  disabled               enabled
                              │
                         Admin clicks [ Save ]
                              │
                              ▼
                    [ Save ] shows loading spinner
                    Both fields disabled
                    [ Cancel ] disabled
                              │
                              ▼
                    PATCH /api/admin/users/:id/password
                    Body: { newPassword: "<trimmed value>" }
                              │
                    ┌─────────┴─────────┐
                 API Success         API Error
                    │                    │
                    ▼                    ▼
             Dialog closes         Spinner removed
             Fields cleared        Fields re-enabled
                                   [ Save ] re-enabled
                                        │
             Toast (green):             ▼
             "Password changed     Toast (red):
              successfully."       "Failed to change
                                    password. Please
                                    try again."
```

### Change Password — Cancel

```
Admin clicks [ Cancel ] at any point
                    │
                    ▼
         Dialog closes
         Fields cleared (reset on next open)
         No API call
         No change to user account
```

---

## Row Action 4: Delete User

```
Admin clicks [ Delete icon ] on a row
                    │
                    ▼
┌───────────────────────────────────────────────┐
│             DELETE USER DIALOG                │
│                                               │
│  "User <name> will be removed                 │
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
  No change               Both buttons disabled
                                   │
                                   ▼
                        DELETE /api/admin/users/:id
                                   │
                        ┌──────────┴──────────┐
                     API Success           API Error
                        │                     │
                        ▼                     ▼
                 Dialog closes          Spinner removed
                 User row removed       Buttons re-enabled
                 from table             Dialog stays open
                 (no undo)                   │
                 Page re-fetched             ▼
                 to stay current       Toast (red):
                                       "Failed to delete
                 Toast (green):         user. Please
                 "User deleted          try again."
                  successfully."
```

---

## Screen 2: User Form Sheet — Create Mode

```
Admin clicks [ + Add New User ] button
                    │
                    ▼
┌───────────────────────────────────────────────┐
│           USER FORM SHEET                     │
│  (slides in from the right)                   │
│  Title: "Add User"                            │
│                                               │
│  Fields pre-filled with empty defaults:       │
│  ┌─────────────────────────────────────────┐  │
│  │  Full Name *         [              ]   │  │
│  │  Email *             [              ]   │  │
│  │  Phone *             [              ]   │  │
│  │  Role                [ General ▾    ]   │  │
│  │  Account Status      [ Active ▾     ]   │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  [ Cancel ]               [ Add ]             │
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
               (required,             Sheet non-interactive
               email format, etc.)         │
                                           ▼
                                POST /api/admin/users
                                Body: {
                                  name, email, phone,
                                  role, status
                                }
                                           │
                               ┌───────────┴───────────┐
                            API Success             API Error
                               │                       │
                               ▼                       ▼
                        Sheet closes            Spinner removed
                        New user prepended      Button re-enabled
                        to table top            Form stays open
                        Page re-fetched              │
                                                     ▼
                        Toast (green):        ┌──────────────┐
                        "User created         │  Error type? │
                         successfully."       └──────────────┘
                                                     │
                                          ┌──────────┴──────────┐
                                      409 Conflict          422 / 500
                                          │                      │
                                          ▼                      ▼
                                   Inline error on        422 → field errors
                                   email field:           shown inline
                                   "Email already         500 → Toast (red):
                                    in use."              "Failed to create
                                                           user. Please
                                                           try again."
```

---

## Screen 2: User Form Sheet — Edit Mode

```
Admin clicks [ Edit icon ] on a row
→ GET /api/admin/users/:id succeeds
                    │
                    ▼
┌───────────────────────────────────────────────┐
│           USER FORM SHEET                     │
│  (slides in from the right)                   │
│  Title: "Edit User"                           │
│                                               │
│  Fields pre-filled with fetched user values:  │
│  ┌─────────────────────────────────────────┐  │
│  │  Full Name *         [ Khalid Ali     ] │  │
│  │  Email *             [ khalid@jod.sa  ] │  │
│  │  Phone *             [ +9665012...    ] │  │
│  │  Role                [ Job Seeker ▾   ] │  │
│  │  Account Status      [ Active ▾       ] │  │
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
                                     PATCH /api/admin/users/:id
                                     Body: {
                                       name, email, phone,
                                       role, status
                                     }
                                                      │
                                          ┌───────────┴───────────┐
                                       API Success            API Error
                                          │                       │
                                          ▼                       ▼
                                   Sheet closes           Spinner removed
                                   User row in table      Button re-enabled
                                   updated with           Form stays open
                                   new values                  │
                                                               ▼
                                   Toast (green):      ┌───────────────┐
                                   "User updated        │  Error type?  │
                                    successfully."      └───────────────┘
                                                               │
                                                   ┌───────────┴──────────┐
                                               409 Conflict          422 / 500
                                                   │                      │
                                                   ▼                      ▼
                                            Inline error on       422 → field errors
                                            email field:          shown inline
                                            "Email already        500 → Toast (red):
                                             in use."             "Failed to update
                                                                   user. Please
                                                                   try again."
```

---

## Edit Mode: Discard Changes Dialog

Triggered when admin tries to cancel or close the sheet while `isDirty === true` (form values differ from the values fetched from the API).

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
  current values          No change to user row
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
/dashboard/admin/users  (List Page)
            │
            ▼
  GET /api/admin/users?page=1&pageSize=10
            │
   ┌────────┴────────┐
 Error            Success
   │                 │
 Toast +          Table loads
 Retry btn        (sorted newest first)
                       │
                       ├── Paginate ─────────────────► GET /api/admin/users?page=N&pageSize=X
                       │                                      │
                       │                           ┌──────────┴──────────┐
                       │                        Error                  Success
                       │                           │                     │
                       │                      Toast (red)          Table re-renders
                       │                                           new page rows
                       │
                       ├── [ + Add New User ] ──────► Open UserFormSheet (Create mode)
                       │                              Empty form, no API call yet
                       │                                    │
                       │                             POST /api/admin/users
                       │                                    │
                       │                         ┌──────────┴──────────┐
                       │                      Error                  Success
                       │                         │                     │
                       │                   409 → email error    Sheet closes
                       │                   422 → field errors   Row prepended
                       │                   500 → toast (red)    Page re-fetched
                       │                                        Toast (green)
                       │
                       ├── [ Edit ] ────────────────► GET /api/admin/users/:id
                       │                                    │
                       │                         ┌──────────┴──────────┐
                       │                      Error                  Success
                       │                         │                     │
                       │                    Toast (red)        Open UserFormSheet
                       │                    Sheet blocked      (Edit mode, pre-filled)
                       │                                             │
                       │                                    PATCH /api/admin/users/:id
                       │                                             │
                       │                                  ┌──────────┴──────────┐
                       │                               Error                  Success
                       │                                  │                     │
                       │                          409 → email error    Sheet closes
                       │                          422 → field errors   Row updated
                       │                          500 → toast (red)    Toast (green)
                       │                          Dirty cancel →
                       │                          Discard dialog
                       │
                       ├── [ Toggle Status ] ───────► PATCH /api/admin/users/:id/status
                       │                                    │
                       │                         ┌──────────┴──────────┐
                       │                      Error                  Success
                       │                         │                     │
                       │                    Toast (red)          Badge flips
                       │                    Badge unchanged       Toast (green)
                       │
                       ├── [ Change Password ] ────► Open UserChangePasswordDialog
                       │                             No API call until Submit
                       │                                    │
                       │                             (validation passes)
                       │                                    │
                       │                    PATCH /api/admin/users/:id/password
                       │                                    │
                       │                         ┌──────────┴──────────┐
                       │                      Error                  Success
                       │                         │                     │
                       │                    Toast (red)          Dialog closes
                       │                    Fields re-enabled    Fields cleared
                       │                    Dialog stays open    Toast (green)
                       │
                       └── [ Delete ] ──────────────► Confirm dialog
                                                            │
                                                 DELETE /api/admin/users/:id
                                                            │
                                                 ┌──────────┴──────────┐
                                              Error                  Success
                                                 │                     │
                                            Toast (red)          Row removed
                                            Dialog stays         Page re-fetched
                                            open                 Toast (green)
                                                                 Dialog closes
```

---

## Toast Notification Reference

| Action | Success Toast | Error Toast |
|--------|--------------|-------------|
| Load users list | *(silent)* | "Failed to load users. Please try again." |
| Load user for edit | *(silent)* | "Failed to load user data. Please try again." |
| Toggle status | "Status updated successfully." | "Failed to update status. Please try again." |
| Change password | "Password changed successfully." | "Failed to change password. Please try again." |
| Delete user | "User deleted successfully." | "Failed to delete user. Please try again." |
| Create user | "User created successfully." | 409: "Email already in use." · 422: field errors · 500: "Failed to create user. Please try again." |
| Edit user | "User updated successfully." | 409: "Email already in use." · 422: field errors · 500: "Failed to update user. Please try again." |

---

## Loading & Disabled States Reference

| UI Element | Loading Behavior |
|------------|-----------------|
| Users table (initial load) | Skeleton shimmer rows, "Add New User" button disabled |
| Users table (page change) | Skeleton shimmer rows, pagination controls remain visible |
| Toggle Status button | Spinner on icon, row non-interactive |
| Edit icon (pre-fetch) | Spinner on icon, row non-interactive while fetching user data |
| Delete dialog Confirm button | Spinner on button, both buttons disabled |
| Change Password dialog Save button | Spinner on button, both fields and buttons disabled |
| Form sheet Submit button | Spinner on button, all fields disabled |
| Form sheet Cancel button | Disabled while submit is in progress |

---

## All Screens & States

| State | Location | Trigger | Description |
|-------|----------|---------|-------------|
| List — Loading | `/users` | Page mount | Skeleton table, "Add New User" button disabled |
| List — Loaded | `/users` | GET success | Full table with all users, newest first |
| List — Load Error | `/users` | GET failure | Toast error + Retry button |
| List — Page Loading | `/users` | Page or size change | Skeleton rows, pagination stays visible |
| List — Page Load Error | `/users` | GET page failure | Toast error, previous page remains |
| Toggle status — Loading | `/users` | Icon click | Row spinner, non-interactive |
| Toggle status — Success | `/users` | PATCH success | Badge flips, toast shown |
| Toggle status — Error | `/users` | PATCH failure | Toast error, badge unchanged |
| Edit — Fetching | `/users` | Edit icon click | Row spinner while fetching user data |
| Edit — Fetch Error | `/users` | GET failure | Toast error, sheet does not open |
| Form sheet — Create | `/users` | Add New User click | Empty form, "Add User" title |
| Form sheet — Edit | `/users` | Edit icon click + GET success | Pre-filled form, "Edit User" title |
| Form sheet — Validation error | `/users` | Invalid submit | Inline field errors shown |
| Form sheet — Submitting | `/users` | Valid submit | Spinner, fields disabled |
| Form sheet — Submit error (409) | `/users` | POST/PATCH 409 | Inline email error "Email already in use." |
| Form sheet — Submit error (422/500) | `/users` | POST/PATCH fail | Field errors or toast, form stays open |
| Form sheet — Discard dialog | `/users` | Cancel dirty edit form | Discard dialog overlay |
| Change password — Open | `/users` | Change Password icon | Dialog opens, fields empty |
| Change password — Validation | `/users` | Typing in fields | Submit disabled until rules pass |
| Change password — Submitting | `/users` | Valid submit | Spinner, fields and buttons disabled |
| Change password — Success | `/users` | PATCH success | Dialog closes, fields cleared, toast |
| Change password — Error | `/users` | PATCH failure | Toast error, dialog stays open, fields re-enabled |
| Delete dialog — Open | `/users` | Delete icon | Dialog with name + Cancel / Confirm |
| Delete dialog — Loading | `/users` | Confirm click | Spinner on Confirm, both buttons disabled |
| Delete dialog — Success | `/users` | DELETE success | Row removed, page re-fetched, toast, dialog closes |
| Delete dialog — Error | `/users` | DELETE failure | Toast error, dialog stays open, buttons re-enabled |

---

## Decision Points

| # | Decision | Pass | Fail |
|---|----------|------|------|
| 1 | GET users list succeeds? | Render table | Toast error + Retry button |
| 2 | GET users page succeeds? | Render new page rows | Toast error, previous rows stay |
| 3 | GET user by ID (for edit) succeeds? | Open form sheet pre-filled | Toast error, sheet does not open |
| 4 | PATCH toggle status succeeds? | Badge flips, toast shown | Toast error, badge unchanged |
| 5 | Password meets minimum rules? (≥8 chars, both fields match) | Enable Save button | Save button stays disabled |
| 6 | PATCH change password succeeds? | Dialog closes, fields cleared, toast | Toast error, dialog stays open |
| 7 | Admin confirms delete? | Call DELETE API | Dialog closes, no API call |
| 8 | DELETE user succeeds? | Row removed, page re-fetched, toast | Toast error, dialog stays open |
| 9 | Form fields pass client validation? | Call POST/PATCH API | Show inline field errors |
| 10 | POST/PATCH form returns 409? | — | Inline email error "Email already in use." |
| 11 | POST/PATCH form returns 422? | — | Field-level inline errors shown |
| 12 | POST/PATCH form returns 500/network? | — | Toast error, form stays open |
| 13 | Form is dirty on cancel (edit mode)? | Show discard dialog | Close sheet directly, no API call |
| 14 | Admin confirms discard? | Sheet closes, edits lost | Discard dialog closes, form stays open |

---

## Related Files

| File | Role |
|------|------|
| `src/app/dashboard/admin/users/page.tsx` | Route entry — users management page |
| `src/components/pages/users-management/users-management-page.tsx` | Page logic — state, pagination, all action handlers |
| `src/components/pages/users-management/users-table.tsx` | Table with all 4 row action buttons |
| `src/components/pages/users-management/user-form-sheet.tsx` | Create / Edit side-panel form + Discard dialog |
| `src/components/pages/users-management/user-delete-dialog.tsx` | Delete confirmation dialog |
| `src/components/pages/users-management/user-change-password-dialog.tsx` | Change password dialog with validation |
| `src/components/pages/users-management/helpers.ts` | Badge class helper for user status + ID generator |
| `src/components/pages/users-management/static-data.ts` | Types, labels, and mock user data |
| `src/components/pages/users-management/index.ts` | Public exports for the module |
