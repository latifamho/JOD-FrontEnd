# User Flow: Organization Reports
**JOD Platform — Org Owner Dashboard**

---

## Overview

This document describes the end-to-end user flow for the Reports section inside the organization owner dashboard. The page displays reports submitted by users (donors, visitors, volunteers, supporters) about content or behavior linked to the organization's account. The org owner can view all reports and open a details panel for each one. No create, edit, or delete actions are available — this is a read-only view.

**Route:** `/dashboard/org-owner/reports`
**Role:** `organization_owner`
**Main Component:** `OrganizationReportsPage`

---

## Report Statuses

| Status | Badge Color | Description |
|--------|-------------|-------------|
| `open` | Amber | Report submitted, not yet reviewed by admin |
| `in_review` | Sky Blue | Admin is actively reviewing the report |
| `closed` | Grey | Report resolved and closed |

## Report Categories

| Category | Description |
|----------|-------------|
| `content` | Inappropriate or policy-violating content |
| `harassment` | Offensive comments or harassing behavior |
| `fraud` | Misleading links, fake campaigns, or deceptive activity |
| `other` | General inquiries or uncategorized reports |

---

## Entry Points

| Source | Route |
|--------|-------|
| Sidebar — Reports | `/dashboard/org-owner/reports` |
| Direct URL | `/dashboard/org-owner/reports` |

---

## Main Screen Flow

```
User navigates to /dashboard/org-owner/reports
                    │
                    ▼
┌───────────────────────────────────────────────┐
│            REPORTS PAGE                       │
│                                               │
│  Header                                       │
│  ┌─────────────────────────────────────────┐  │
│  │  Title: "Reports"                       │  │
│  │  Subtitle: "Reports received about      │  │
│  │  content or behavior linked to your     │  │
│  │  organization. X records."              │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  Reports Table (read-only)                    │
│  ┌─────────────────────────────────────────┐  │
│  │ Report │ Category │ Status │ Sender     │  │
│  │        │          │        │ Date │ Act │  │
│  │ ─────────────────────────────────────── │  │
│  │ RPT-501│ Harassment│In Review│ Donor   │  │
│  │ RPT-502│ Fraud     │ Open    │ Visitor │  │
│  │ RPT-503│ Content   │ Closed  │ Volunteer│ │
│  │ RPT-504│ Other     │ Closed  │ Supporter│ │
│  └─────────────────────────────────────────┘  │
└───────────────────────────────────────────────┘
```

---

## Table Columns

| Column | Content |
|--------|---------|
| Report | Subject (bold) + short summary (2-line clamp) + report ID |
| Category | Badge — Content / Harassment / Fraud / Other |
| Status | Colored badge — Open / In Review / Closed |
| Sender | Reporter label (e.g. Donor (Anonymous), Visitor, Volunteer) |
| Date | Formatted submission date and time |
| Action | "Details" button |

---

## View Report Details Flow

```
User clicks [ Details ] on any report row
                    │
                    ▼
┌───────────────────────────────────────────────┐
│           REPORT DETAILS SIDE SHEET           │
│                                               │
│  Title: <report subject>                      │
│                                               │
│  Full summary text                            │
│                                               │
│  Badges:                                      │
│  [ Category Badge ]  [ Status Badge ]         │
│                                               │
│  Sender: <reporter label>                     │
│                                               │
│  Submitted: <formatted date & time>           │
│                                               │
│  [ × Close ]                                  │
└───────────────────────────────────────────────┘
                    │
       ┌────────────┴────────────┐
  User clicks ×           User clicks outside
  or Close                the sheet
       │                          │
       ▼                          ▼
  Sheet closes             Sheet closes
  Table stays as-is        Table stays as-is
```

---

## Full Page Flow Diagram

```
User lands on /dashboard/org-owner/reports
                    │
                    ▼
         Load static report data
                    │
                    ▼
         Render reports table
         (all records, no filter)
                    │
            ┌───────┴────────┐
      No records         Records exist
            │                   │
            ▼                   ▼
      Table renders        Table renders rows
      with empty body      with all reports
                                │
                    User clicks [ Details ]
                                │
                                ▼
                    Open details side sheet
                    for selected report
                                │
                    User reads report info
                                │
                    User closes sheet (× or outside)
                                │
                                ▼
                    Sheet closes, back to table
```

---

## Status Badge Colors

| Status | Color | Meaning |
|--------|-------|---------|
| `open` | Amber / Yellow | Awaiting admin attention |
| `in_review` | Sky Blue | Under active review |
| `closed` | Grey / Muted | No further action needed |

---

## Screens & States

| State | Trigger | Description |
|-------|---------|-------------|
| Reports table — Loaded | Navigate to `/reports` | All reports displayed in table |
| Details sheet — Open | Click "Details" on a row | Side panel shows full report info |
| Details sheet — Closed | Click × or outside sheet | Panel closes, table unchanged |

---

## Constraints & Notes

| Constraint | Detail |
|------------|--------|
| Read-only | Org owner cannot create, edit, or delete reports |
| No filters | All reports are shown without filter or sort controls |
| No pagination | All records are rendered in a single scrollable table |
| Sender anonymity | Reporter labels may be anonymous (e.g. "Donor (Anonymous)") |
| Status changes | Report status is managed exclusively by the admin dashboard |
| Admin route | Admins manage reports at `/dashboard/admin/reports` |

---

## Decision Points

| # | Decision | Result |
|---|----------|--------|
| 1 | User clicks "Details" button | Opens side sheet for that report |
| 2 | User closes sheet (× or outside click) | Sheet closes, no data changes |
| 3 | Report has no matching ID in state | Sheet renders empty / null-safe |

---

## Related Files

| File | Role |
|------|------|
| `src/app/dashboard/org-owner/reports/page.tsx` | Route entry point |
| `src/components/pages/organization-reports/organization-reports-page.tsx` | Main page component — table + details sheet logic |
| `src/components/pages/organization-reports/static-data.ts` | Report types, statuses, categories, badge helpers, and mock data |
| `src/components/pages/organization-reports/index.ts` | Public exports for the module |
| `src/app/dashboard/admin/reports/page.tsx` | Admin-side reports management (status changes happen here) |
