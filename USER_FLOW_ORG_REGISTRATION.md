# User Flow: Create Organization Account
**JOD Platform**

---

## Overview

This document describes the end-to-end user flow for registering a new organization account on the JOD platform. The flow is a 2-phase form located at `/register`, followed by an admin review process before the account is activated.

**Route:** `/register`  
**Role created:** `organization_owner`  
**Direction:** RTL (Arabic)  
**Components:** `register-form.tsx`, `register-phase-one-fields.tsx`, `register-phase-two-fields.tsx`

---

## Entry Points

| Source | Action |
|--------|--------|
| Landing page | Click "Register Your Organization" CTA |
| Login page | Click "Don't have an account? Register now" |
| Direct URL | Navigate to `/register` |

---

## Flow Diagram

```
Entry Point
     │
     ▼
┌────────────────────────────────────────────────┐
│            /register — Phase 1 of 2            │
│           Admin Account Information            │
│                                                │
│  • Full Name                  (required)       │
│  • Email Address              (required)       │
│  • Phone Number               (required)       │
│  • Password                   (required)       │
│  • Confirm Password           (required)       │
│                                                │
│  [ Next: Phase Two → ]                         │
└───────────────────┬────────────────────────────┘
                    │
         ┌──────────▼──────────┐
         │  Validate Phase 1   │
         └──────────┬──────────┘
                    │
       ┌────────────┴─────────────┐
  ✗ FAIL                    ✓ PASS
       │                          │
       ▼                          ▼
 Show error msg           Move to Phase 2
 (inline banner)          (tab switches)
 • Empty fields
 • Passwords mismatch
 • Invalid email / phone
```

---

```
┌────────────────────────────────────────────────┐
│            /register — Phase 2 of 2            │
│        Organization Details & Documents        │
│                                                │
│  SECTION A — Identity                          │
│  • Organization Name (Arabic)   (required)     │
│  • Organization Name (English)  (optional)     │
│  • Organization Type            (required)     │
│      ▸ Association / Foundation / Initiative   │
│  • Registration / License Number (required)    │
│  • Establishment Date           (required)     │
│                                                │
│  SECTION B — Location                          │
│  • City                         (required)     │
│  • Short Address                (required)     │
│                                                │
│  SECTION C — Contact & Presence                │
│  • Organization Description     (required)     │
│  • Official Email               (required)     │
│  • Official Phone               (required)     │
│  • Website                      (optional)     │
│  • Social Media Accounts        (optional)     │
│                                                │
│  SECTION D — Documents                         │
│  • License / Registration Document (upload)    │
│      Accepted: PDF, PNG, JPG, JPEG             │
│  • Delegate ID / Authorization Letter (upload) │
│                                                │
│  SECTION E — Agreements                        │
│  ☐  I agree to the Terms & Privacy Policy      │
│  ☐  I confirm all submitted data is accurate   │
│                                                │
│  [ ← Back ]        [ Submit Registration ]     │
└───────────────────┬────────────────────────────┘
                    │
         ┌──────────▼──────────┐
         │  Validate Phase 2   │
         └──────────┬──────────┘
                    │
       ┌────────────┴─────────────┐
  ✗ FAIL                    ✓ PASS
       │                          │
       ▼                          ▼
 Show error msg           POST /api/register
 • Empty required fields
 • Agreements not checked
 • Invalid file format
```

---

```
                    │
         ┌──────────▼──────────┐
         │    API Response      │
         └──────────┬──────────┘
                    │
       ┌────────────┴─────────────┐
  ✗ ERROR                    ✓ 200
       │                          │
       ▼                          ▼
 Show error banner        SUCCESS STATE
 • Duplicate email/phone  "Your request has been
 • Server error            submitted successfully.
 • File too large          We will review it and
                           respond shortly."
```

---

## Post-Submission Flow

```
                    SUCCESS
                       │
                       ▼
        ┌──────────────────────────────┐
        │        PENDING REVIEW        │
        │                              │
        │  User:                       │
        │  • Receives confirmation     │
        │    email                     │
        │  • Account locked until      │
        │    admin approval            │
        │                              │
        │  Admin:                      │
        │  • New entry appears in      │
        │    /dashboard/admin/         │
        │    organizations             │
        └──────────────┬───────────────┘
                       │
          ┌────────────▼────────────┐
          │      ADMIN REVIEWS      │
          │  Organization details   │
          │  + uploaded documents   │
          └────────────┬────────────┘
                       │
           ┌───────────┴───────────┐
      ✓ APPROVE               ✗ REJECT
           │                       │
           ▼                       ▼
  ┌─────────────────┐   ┌──────────────────────┐
  │ Account         │   │ Rejection email sent  │
  │ ACTIVATED       │   │ with reason           │
  │                 │   │                       │
  │ • Email sent    │   │ • User can correct    │
  │ • User logs in  │   │   data and re-apply   │
  │ • Redirected to │   └──────────────────────┘
  │   /dashboard/   │
  │   org-owner     │
  └─────────────────┘
```

---

## Screens & States

| State | Location | Description |
|-------|----------|-------------|
| Phase 1 — Idle | `/register` tab 1 | User filling admin account fields |
| Phase 1 — Error | `/register` tab 1 | Inline error after failed validation |
| Phase 2 — Idle | `/register` tab 2 | User filling org info and uploading docs |
| Phase 2 — Error | `/register` tab 2 | Inline error after failed validation |
| Submitting | `/register` | Loading state during API call |
| Success | `/register` | Success banner shown after API confirms |
| Pending Review | Email / no dashboard | Account awaiting admin decision |
| Approved | `/dashboard/org-owner` | Full access granted |
| Rejected | Email notification | User notified with rejection reason |

---

## Validation Rules

### Phase 1

| Field | Rule |
|-------|------|
| Full Name | Required, non-empty |
| Email Address | Required, valid email format |
| Phone Number | Required, valid phone format |
| Password | Required, non-empty |
| Confirm Password | Must match Password |

### Phase 2

| Field | Rule |
|-------|------|
| Organization Name (Arabic) | Required, non-empty |
| Organization Type | Required, one of: Association / Foundation / Initiative |
| Registration / License Number | Required, non-empty |
| Establishment Date | Required, valid date |
| City | Required, non-empty |
| Short Address | Required, non-empty |
| Organization Description | Required, non-empty |
| Official Email | Required, valid email format |
| Official Phone | Required, valid phone format |
| License / Registration Document | File upload, accepted: PDF, PNG, JPG, JPEG |
| Delegate ID / Authorization Letter | File upload, accepted: PDF, PNG, JPG, JPEG |
| Terms & Privacy Policy | Must be checked |
| Data Accuracy Confirmation | Must be checked |

---

## Decision Points

| # | Decision | Pass | Fail |
|---|----------|------|------|
| 1 | All Phase 1 fields filled? | Move to Phase 2 | Show field error |
| 2 | Passwords match? | Continue | "Passwords do not match" error |
| 3 | All Phase 2 required fields complete? | Submit form | Show missing field error |
| 4 | Both agreement checkboxes checked? | Submit form | Block submission |
| 5 | API accepts the request? | Show success state | Show server error banner |
| 6 | Admin approves the organization? | Activate account | Send rejection email |

---

## Navigation Controls

| Control | Phase | Action |
|---------|-------|--------|
| "Next: Phase Two" button | Phase 1 | Validates Phase 1 → moves to Phase 2 |
| "Back" button | Phase 2 | Returns to Phase 1, clears messages |
| Tab "Phase One" | Any | Switches to Phase 1 view |
| Tab "Phase Two" | Phase 1 | Triggers Phase 1 validation first |
| "Submit Registration" button | Phase 2 | Validates Phase 2 → submits form |
| "Log in" link | Any | Navigates to `/login` |

---

## Related Files

| File | Role |
|------|------|
| `src/app/(auth)/register/page.tsx` | Route entry point |
| `src/app/(auth)/register/register-form.tsx` | Main form state, validation, and phase logic |
| `src/app/(auth)/register/register-phase-one-fields.tsx` | Phase 1 field components |
| `src/app/(auth)/register/register-phase-two-fields.tsx` | Phase 2 field components |
| `src/app/(auth)/register/register-form.types.ts` | Shared types and initial form values |
| `src/app/(auth)/layout.tsx` | Auth split-screen layout wrapper |
| `src/app/dashboard/admin/organizations/page.tsx` | Admin review queue for submitted orgs |
