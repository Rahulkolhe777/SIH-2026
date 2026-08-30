# Mandi Module Backend — Glance Dashboard, Settings KYC Onboarding & Admin Approval Specification (`prompt3.md`)

> **Context & Architectural Reference**: Strictly follows [PROJECT_CONTEXT.md](file:///c:/Users/ADMIN/Desktop/SIH/SIH-2026/PROJECT_CONTEXT.md) and [agents.md](file:///c:/Users/ADMIN/Desktop/SIH/SIH-2026/agents.md).

---

## 1. Objective & User Journey

In this refined workflow, newly registered Mandi operators can log in and immediately view their **Glance Dashboard** in read-only mode, but cannot perform operational actions until they complete **Mandi & KYC Settings** and receive **Platform Administrator Approval**.

### The 4-Step Journey:
```text
1. Minimal Signup & Login
   ──> Operator registers with name, email, phone, password.
   ──> Verifies OTP and logs in.
             ↓
2. Read-Only Glance Dashboard
   ──> Operator enters dashboard with view-only glance access.
   ──> Banner directs operator: "Please complete Mandi & KYC Settings to enable slot creation and gate check-in."
             ↓
3. Complete Mandi & KYC Settings
   ──> Operator navigates to Settings tab.
   ──> Fills APMC Yard Details (Name, APMC Code, Address, District, State, Operating Hours).
   ──> Completes Aadhaar KYC & uploads Statutory Documents (Mandi License, Board Registration, GST).
   ──> Clicks "Submit for Admin Approval" ──> Status: PENDING_APPROVAL.
             ↓
4. Admin Review & Approval
   ──> Platform Administrator reviews submitted details & documents.
   ──> Admin Approves Mandi (/admin/mandi/:id/approval-status) ──> Status: APPROVED.
   ──> Full Operational Access Unlocked (Create/Edit Slots, Verify QR Tokens, Accept/Reject Bookings, Weighbridge Payouts).
```

---

## 2. Security & Policy Enforcement Matrix

| Endpoint | Method | Required Middleware Policy | Behavior for Unapproved Mandi |
|---|:---:|---|---|
| `/api/v1/mandi/dashboard` | `GET` | `authenticate`, `requireRole(MANDI_OPERATOR)` | ✅ Allowed (returns glance metrics + `approvalStatus: PENDING_*`, `isApproved: false`) |
| `/api/v1/mandi/profile` | `GET` / `PUT` | `authenticate`, `requireRole(MANDI_OPERATOR)` | ✅ Allowed (to view and fill Mandi details) |
| `/api/v1/mandi/kyc/aadhaar` | `POST` | `authenticate`, `requireRole(MANDI_OPERATOR)` | ✅ Allowed (to submit Aadhaar) |
| `/api/v1/mandi/kyc/documents` | `POST` / `DELETE` | `authenticate`, `requireRole(MANDI_OPERATOR)` | ✅ Allowed (to upload compliance docs) |
| `/api/v1/mandi/onboarding` | `POST` | `authenticate`, `requireRole(MANDI_OPERATOR)` | ✅ Allowed (submits complete KYC for review) |
| `/api/v1/mandi/rating` | `GET` | `authenticate`, `requireRole(MANDI_OPERATOR)` | ✅ Allowed |
| `/api/v1/mandi/slots` | `POST` | **`requireApprovedMandi`** | ❌ Blocked (`403 MANDI_NOT_APPROVED`) |
| `/api/v1/mandi/slots/:id` | `PUT` / `DELETE` | **`requireApprovedMandi`** | ❌ Blocked (`403 MANDI_NOT_APPROVED`) |
| `/api/v1/mandi/slots/default-preset` | `POST` | **`requireApprovedMandi`** | ❌ Blocked (`403 MANDI_NOT_APPROVED`) |
| `/api/v1/mandi/bookings/verify` | `POST` | **`requireApprovedMandi`** | ❌ Blocked (`403 MANDI_NOT_APPROVED`) |
| `/api/v1/mandi/bookings/:id/status` | `PATCH` | **`requireApprovedMandi`** | ❌ Blocked (`403 MANDI_NOT_APPROVED`) |
| `/api/v1/mandi/bookings/:id/complete` | `PATCH` | **`requireApprovedMandi`** | ❌ Blocked (`403 MANDI_NOT_APPROVED`) |
| `/api/v1/admin/mandi/:id/approval-status` | `PATCH` | `authenticate`, `requireRole(Role.ADMIN)` | Admin approval endpoint |

---

## 3. Database Schema Enums & Defaults (`packages/database/prisma/schema.prisma`)

```prisma
enum MandiApprovalStatus {
  PENDING_ONBOARDING  // Registered, needs to fill Mandi & KYC settings
  PENDING_APPROVAL    // Settings & KYC submitted, awaiting admin approval
  APPROVED            // Approved by Admin; full operational access unlocked
  REJECTED            // Rejected by Admin with remarks
  REQUIRES_DOCUMENTS  // Additional documents requested
}
```

---

## 4. Seeding Specifications

The seed script must provide realistic accounts for all approval states:
1. **`mandi.approved@agrimarket.gov.in`** (Password: `Password@123`) — Status: `APPROVED` (Full operational access)
2. **`mandi.pending@agrimarket.gov.in`** (Password: `Password@123`) — Status: `PENDING_APPROVAL` (Submitted KYC, awaiting admin review)
3. **`mandi.new@agrimarket.gov.in`** (Password: `Password@123`) — Status: `PENDING_ONBOARDING` (Fresh login, needs to fill KYC in settings)
4. **`admin@agrimarket.gov.in`** (Password: `Password@123`) — Role: `ADMIN` (Platform administrator)
