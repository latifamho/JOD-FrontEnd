     # User Flow: Admin Organizations Management
     **JOD Platform — Admin Dashboard**

     ---

     ## Overview

     This document describes the end-to-end user flow for managing organizations inside the admin dashboard. The section spans two routes: a list page where the admin can filter, sort, toggle status, toggle verification, and delete organizations, and a details page where the admin can review full registration data and formally accept a pending organization. A reusable form sheet component also supports creating and editing organizations inline.

     **List Route:** `/dashboard/admin/organizations`
     **Details Route:** `/dashboard/admin/organizations/[id]`
     **Role:** `admin`
     **Main Components:** `OrganizationsManagementPage`, `OrganizationDetailsPage`, `OrganizationFormSheet`

     ---

     ## Organization Statuses

     | Status | Badge Color | Description |
     |--------|-------------|-------------|
     | `active` | Green | Organization is active and operational |
     | `inactive` | Grey | Organization is deactivated |

     ## Verification Statuses

     | Status | Badge Color | Description |
     |--------|-------------|-------------|
     | `verified` | Green | Organization has been reviewed and accepted by admin |
     | `unverified` | Amber | Organization is pending admin review |

     ## Organization Types

     | Type | Description |
     |------|-------------|
     | `association` | A registered charitable association |
     | `foundation` | A formal foundation entity |
     | `initiative` | A community-driven initiative |

     ---

     ## Entry Points

     | Source | Route |
     |--------|-------|
     | Admin sidebar — Organizations | `/dashboard/admin/organizations` |
     | Direct URL | `/dashboard/admin/organizations` |
     | View Details action (from list) | `/dashboard/admin/organizations/[id]` |

     ---

     ## Screen 1: Organizations List

     ```
     Admin navigates to /dashboard/admin/organizations
                         │
                         ▼
     ┌───────────────────────────────────────────────────┐
     │          ORGANIZATIONS MANAGEMENT PAGE            │
     │                                                   │
     │  Header                                           │
     │  ┌───────────────────────────────────────────┐   │
     │  │  Title: "Organizations Management"        │   │
     │  │  Subtitle: "Manage organization data,     │   │
     │  │  verification, and status via the table." │   │
     │  └───────────────────────────────────────────┘   │
     │                                                   │
     │  Filters Bar (3 columns)                          │
     │  ┌──────────────┐ ┌──────────────┐ ┌───────────┐ │
     │  │ Verification │ │   Location   │ │   Sort    │ │
     │  │ [▾ All     ] │ │ [▾ All     ] │ │ [▾ Newest]│ │
     │  └──────────────┘ └──────────────┘ └───────────┘ │
     │                                                   │
     │  Organizations Table                              │
     │  ┌───────────────────────────────────────────┐   │
     │  │ Org  │ Verif. │ Status │ Contact │ Loc.   │   │
     │  │ Activity │ Dates │           Actions       │   │
     │  │ ────────────────────────────────────────  │   │
     │  │ ORG-1001 │ Verified   │ Active   │ ... │ ⊙⊙⊙⊙ │
     │  │ ORG-1002 │ Verified   │ Active   │ ... │ ⊙⊙⊙⊙ │
     │  │ ORG-1003 │ Unverified │ Active   │ ... │ ⊙⊙⊙⊙ │
     │  └───────────────────────────────────────────┘   │
     │                                                   │
     │  Pagination Controls                              │
     │  [ < ]  [1] [2] ... [N]  [ > ]   Page: [10 ▾]   │
     └───────────────────────────────────────────────────┘
     ```

     ---

     ## Filter & Sort Flow

     ```
     Admin changes any filter or sort dropdown
                         │
                         ▼
          Re-filter + re-sort in memory
                         │
                         ▼
          Page resets to 1
                         │
                         ▼
          Table re-renders with matching rows

     Verification Filter options:
     • All Organizations  (default)
     • Verified
     • Unverified

     Location Filter options:
     • All Locations  (default)
     • <dynamic list built from org data, sorted A-Z>
     Note: resets to "All" automatically if the selected
          city no longer exists in the org list

     Sort options:
     • Newest Created  (default — created_newest)
     • Oldest Created  (created_oldest)
     • Name — A → Z   (name_asc)
     • Name — Z → A   (name_desc)
     ```

     ---

     ## Table Columns

     | Column | Content |
     |--------|---------|
     | Organization | Name (bold) + Organization ID |
     | Verification | Badge — Verified / Unverified |
     | Status | Badge — Active / Inactive |
     | Contact | Official email + official phone |
     | Location | City name |
     | Activity | Campaigns count, Posts count, Activity score |
     | Dates | Created at + Last active at |
     | Actions | View Details · Toggle Status · Toggle Verification · Delete |

     ---

     ## Empty Table State

     ```
     All filters applied but no rows match
                         │
                         ▼
     ┌───────────────────────────────────────────────┐
     │                  TABLE BODY                   │
     │                                               │
     │   "No organization data to display."          │
     │   (single cell spanning all 8 columns)        │
     └───────────────────────────────────────────────┘
     ```

     ---

     ## Row Actions Flow

     ### 1 — View Organization Details

     ```
     Admin clicks [ View Details icon ] on a row
                         │
                         ▼
          router.push → /dashboard/admin/organizations/[id]
                         │
                         ▼
          Full details page loads for that organization
     ```

     ---

     ### 2 — Toggle Organization Status

     ```
     Admin clicks [ Toggle Status icon ] on a row
                         │
                         ▼
          No confirmation dialog — instant update
                         │
          ┌────────────┴────────────┐
     Currently ACTIVE          Currently INACTIVE
          │                          │
          ▼                          ▼
     status → "inactive"        status → "active"
     Badge turns Grey           Badge turns Green
     (in-memory, immediate)     (in-memory, immediate)
     ```

     ---

     ### 3 — Toggle Verification Status

     ```
     Admin clicks [ Toggle Verification icon ] on a row
                         │
                         ▼
          No confirmation dialog — instant update
                         │
          ┌────────────┴────────────┐
     Currently VERIFIED        Currently UNVERIFIED
          │                          │
          ▼                          ▼
     verificationStatus            verificationStatus
     → "unverified"                → "verified"
     Icon → BadgeMinus           Icon → Verified check
     (in-memory, immediate)      (in-memory, immediate)
     ```

     ---

     ### 4 — Delete Organization

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
     Dialog closes           deleteTargetOrganizationId
     No change               filtered out of state
                              Organization removed
                              from list permanently
                              (no undo)
                              Dialog closes
     ```

     ---

     ## Pagination Flow

     ```
     Admin changes page or page size
                         │
                         ▼
          filteredOrganizations sliced by
          [startIndex → endIndex] for current page
                         │
                         ▼
          Table re-renders current page rows

     Controls:
     [ ‹ Prev ]  [1] [2] … [N]  [ Next › ]
     Page size selector: [10 ▾]  (options: 5 / 10 / 20 / 50)

     Note: any filter or sort change resets currentPage → 1
          any page size change resets currentPage → 1
     ```

     ---

     ## Screen 2: Organization Details Page

     ```
     Admin lands on /dashboard/admin/organizations/[id]
                         │
                         ▼
          Lookup organization by ID in static data
                         │
          ┌──────────┴──────────┐
          Not Found             Found
          │                     │
          ▼                     ▼
     Empty State           Full Details Page
     + Back button
     ```

     ### Not Found State

     ```
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

     ### Details Page Layout

     ```
     ┌───────────────────────────────────────────────────┐
     │             ORGANIZATION DETAILS PAGE             │
     │                                                   │
     │  Header Card                                      │
     │  ┌─────────────────────────────────────────────┐  │
     │  │  [ Verified/Unverified ]  [ Active/Inactive]│  │
     │  │  [ ORG-XXXX ]                               │  │
     │  │                                             │  │
     │  │  Organization Name                          │  │
     │  │  Organization description text              │  │
     │  │                                             │  │
     │  │  [ ← Back to Organizations ]               │  │
     │  │  [ Accept Organization ]  ← disabled if    │  │
     │  │                              already verified│  │
     │  └─────────────────────────────────────────────┘  │
     │                                                   │
     │  Two-column info grid                             │
     │  ┌──────────────────┐  ┌───────────────────────┐  │
     │  │ REGISTRATION DATA│  │ OWNER & CONTACT INFO  │  │
     │  │                  │  │                       │  │
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
     │  Documents Card                                   │
     │  ┌─────────────────────────────────────────────┐  │
     │  │ REGISTRATION ATTACHMENTS                    │  │
     │  │                                             │  │
     │  │  License Document:    <filename.pdf>        │  │
     │  │  Delegation Document: <filename.pdf>        │  │
     │  └─────────────────────────────────────────────┘  │
     └───────────────────────────────────────────────────┘
     ```

     ---

     ## Accept Organization Flow

     ```
     Admin clicks [ Accept Organization ]
     (button is only enabled when verificationStatus === "unverified")
                         │
                         ▼
          No confirmation dialog — instant update
                         │
                         ▼
          status             → "active"
          verificationStatus → "verified"
          acceptedAt         → new Date().toISOString()
                         │
                         ▼
          Header badges update immediately:
               Verification badge → "Verified" (Green)
               Status badge       → "Active"   (Green)
                         │
                         ▼
          "Accepted At" field appears in
          Registration Data card
                         │
                         ▼
          [ Accept Organization ] button
               → disabled
               → label changes to "Organization Accepted"
     ```

     ---

     ## Screen 3: Organization Form Sheet (Create / Edit)

     The `OrganizationFormSheet` is a reusable side-panel component available for creating new organizations or editing existing ones. It is built into the module but must be wired to a trigger in the list page to become accessible.

     ```
     Trigger opens form sheet (Create or Edit mode)
                         │
                         ▼
     ┌───────────────────────────────────────────────┐
     │         ORGANIZATION FORM SHEET               │
     │  (slides in from the right side)              │
     │                                               │
     │  Header:                                      │
     │    Create mode → "Add Organization"           │
     │    Edit mode   → "Edit Organization"          │
     │                                               │
     │  Fields:                                      │
     │  ┌─────────────────────────────────────────┐  │
     │  │  Organization Name       [required]     │  │
     │  │  Email                   [required]     │  │
     │  │  Phone                   [required]     │  │
     │  │  Location                [required]     │  │
     │  │  Account Status          [select]       │  │
     │  │    • Active                             │  │
     │  │    • Inactive                           │  │
     │  │  Verification Status     [select]       │  │
     │  │    • Verified                           │  │
     │  │    • Unverified                         │  │
     │  └─────────────────────────────────────────┘  │
     │                                               │
     │  Footer:  [ Cancel ]   [ Add / Save Changes ] │
     └───────────────────────────────────────────────┘
     ```

     ### Create Mode Flow

     ```
     Admin opens form sheet in Create mode
                         │
                         ▼
          Form pre-filled with empty defaults:
               name: ""  email: ""  phone: ""
               location: ""  status: "active"
               verificationStatus: "unverified"
                         │
                         ▼
          Admin fills in required fields
                         │
          ┌────────────┴────────────┐
     Cancel clicked           Submit (Add) clicked
          │                          │
          ▼                          ▼
     Sheet closes             Values trimmed
     No change                onSubmit(values) called
                              Sheet closes
     ```

     ### Edit Mode Flow

     ```
     Admin opens form sheet in Edit mode (pre-loaded org data)
                         │
                         ▼
          Form pre-filled with existing values
                         │
          Admin modifies one or more fields
          isDirty = true  (values differ from initial)
                         │
          ┌────────────┴────────────────────┐
     Save clicked                    Cancel / close clicked
          │                                  │
          ▼                                  ▼
     onSubmit(trimmedValues)          isDirty check
     Sheet closes                          │
                              ┌──────────┴──────────┐
                              Not Dirty              Dirty
                              │                     │
                              ▼                     ▼
                         Sheet closes     DISCARD DIALOG opens
                         No change
     ```

     ### Discard Changes Dialog (Edit Mode — Dirty)

     ```
     ┌───────────────────────────────────────────────┐
     │          DISCARD CHANGES DIALOG               │
     │                                               │
     │  "Discard changes?"                           │
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
     Dialog closes           Dialog closes
     Form stays open         Sheet closes
     Changes preserved       All edits lost
     ```

     ---

     ## Complete Flow Diagram (All Screens)

     ```
     /dashboard/admin/organizations  (List Page)
               │
               ├── Filter by Verification ──► Re-render table (page → 1)
               ├── Filter by Location     ──► Re-render table (page → 1)
               ├── Change Sort            ──► Re-render table (page → 1)
               ├── Change Page Size       ──► Re-render table (page → 1)
               ├── Navigate Page          ──► Re-render current page slice
               │
               ├── [ View Details ]  ──────► /admin/organizations/[id]
               │                                   │
               │                            ┌──────┴──────┐
               │                         Not Found      Found
               │                            │              │
               │                       Empty State    Details Page
               │                       + Back btn         │
               │                                     [ Accept Org ]
               │                                     (unverified only)
               │                                          │
               │                                   status       → active
               │                                   verified     → verified
               │                                   acceptedAt   → now
               │                                   Button       → disabled
               │
               ├── [ Toggle Status ]   ──────► active ↔ inactive
               │                              (instant, no dialog)
               │
               ├── [ Toggle Verification ] ──► verified ↔ unverified
               │                              (instant, no dialog)
               │
               ├── [ Delete ]  ─────────────► Confirmation dialog
               │                                     │
               │                        ┌────────────┴────────────┐
               │                    Cancel                    Confirm Delete
               │                        │                         │
               │                    No change              Org removed from
               │                                           state permanently
               │
               └── [ Form Sheet trigger ]  ─► OrganizationFormSheet
                    (Create or Edit)              │
                                             ┌───────┴────────┐
                                        Create             Edit
                                             │                 │
                                        Empty form       Pre-filled form
                                        Submit →          Submit →
                                        onSubmit(vals)    onSubmit(vals)
                                                       Cancel (dirty) →
                                                       Discard dialog
     ```

     ---

     ## Screens & States Summary

     | State | Location | Description |
     |-------|----------|-------------|
     | List — Loaded | `/organizations` | All orgs in table, default filters applied |
     | List — Filtered | `/organizations` | Narrowed by verification or location |
     | List — Sorted | `/organizations` | Reordered by name or creation date |
     | List — Empty filter result | `/organizations` | No rows match active filters |
     | Delete dialog — Open | `/organizations` | Awaiting admin confirmation |
     | Delete dialog — Confirmed | `/organizations` | Org removed from state |
     | Form sheet — Create | `/organizations` | Empty form, Add mode |
     | Form sheet — Edit | `/organizations` | Pre-filled form, Edit mode |
     | Form sheet — Discard dialog | `/organizations` | Unsaved edits, asking to discard |
     | Details — Found | `/organizations/[id]` | Full org info displayed |
     | Details — Not Found | `/organizations/[id]` | Empty state with back button |
     | Details — Unverified | `/organizations/[id]` | Accept button enabled |
     | Details — Accepted | `/organizations/[id]` | Accept button disabled, acceptedAt shown |

     ---

     ## Decision Points

     | # | Decision | Pass | Fail |
     |---|----------|------|------|
     | 1 | Verification filter applied? | Show only matching orgs | Show all |
     | 2 | Location filter applied? | Show only matching city | Show all |
     | 3 | Selected city removed from list? | Location filter auto-resets to "All" | — |
     | 4 | Admin clicks Toggle Status | Flip active ↔ inactive instantly | — |
     | 5 | Admin clicks Toggle Verification | Flip verified ↔ unverified instantly | — |
     | 6 | Admin confirms delete? | Org removed permanently | Dialog closes, no change |
     | 7 | Org ID found on details page? | Render full details | Render empty state |
     | 8 | Org already verified on details page? | Disable Accept button | Enable Accept button |
     | 9 | Form sheet in edit mode — dirty? | Show Discard dialog on cancel | Close sheet directly |
     | 10 | Admin confirms discard? | Sheet closes, edits lost | Dialog closes, form stays open |

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
