# Mandi Module Backend V1 — Comprehensive Technical Reference (`SummaryV1.md`)

> **Module**: APMC Mandi Arrival Management & Electronic Gate Check-in System  
> **Version**: 1.0.0 (V1)  
> **Repository Core**: Express.js + Prisma ORM + PostgreSQL + TypeScript + Zod Validation  
> **Architectural Paradigm**: Pure Functions Only (Zero OOP/Classes), Unified Interfaces, Strong RBAC & Policy Middlewares.

---

## 1. Executive Architecture & Workflow Summary

Mandi Module V1 governs the electronic operation of agricultural market yards (APMCs) across arrival slot allocation, farmer booking pipelines, gate-entry QR/token verification, and post-weighbridge settlement.

### The 4-Stage Operational Lifecycle:
```text
┌───────────────────────────┐
│ 1. Registration & Login   │ ──> Name, Email, Phone, Password. Verifies Email OTP.
└─────────────┬─────────────┘
              ▼
┌───────────────────────────┐
│ 2. Glance Dashboard View  │ ──> Read-only dashboard KPIs with isApproved: false.
│    (Read-Only Preview)    │ ──> Banner prompts: "Complete Mandi & KYC in Settings".
└─────────────┬─────────────┘
              ▼
┌───────────────────────────┐
│ 3. Settings KYC & Review  │ ──> Operator fills APMC Yard details, Aadhaar KYC & Statutory docs.
│    (Settings Submission)  │ ──> Submits for Admin Review (Status: PENDING_APPROVAL).
└─────────────┬─────────────┘
              ▼
┌───────────────────────────┐
│ 4. Admin Verification     │ ──> Platform Administrator approves Mandi (Status: APPROVED).
│    & Full Feature Unlock  │ ──> Unlocks: Slot Management, Gate Scanner, Bookings & Payouts.
└───────────────────────────┘
```

---

## 2. Seeded Test Data for Testing & Evaluation

Run the automated seed command from the backend workspace:
```bash
bun run seed:test-data
# or
bun src/scripts/seed.ts
```

### Pre-Configured Test Accounts in PostgreSQL:

| Account Type | Email | Password | Role | Approval Status | Description & Permissions |
|---|---|---|---|---|---|
| **Approved Mandi** | `mandi.approved@agrimarket.gov.in` | `Password@123` | `MANDI_OPERATOR` | **`APPROVED`** | Full access to operational dashboard, creating/deleting slots, gate QR scanner, and completing transactions. |
| **Pending Review Mandi** | `mandi.pending@agrimarket.gov.in` | `Password@123` | `MANDI_OPERATOR` | **`PENDING_APPROVAL`** | Submitted KYC & statutory documents; has Glance Dashboard access; operational slot creation blocked. |
| **Fresh / Un-onboarded Mandi** | `mandi.new@agrimarket.gov.in` | `Password@123` | `MANDI_OPERATOR` | **`PENDING_ONBOARDING`** | Newly registered operator; has Glance Dashboard access; guided to fill KYC in Settings. |
| **Platform Administrator** | `admin@agrimarket.gov.in` | `Password@123` | `ADMIN` | N/A | Can list pending mandis (`GET /admin/mandi/pending`) and approve/reject (`PATCH /admin/mandi/:id/approval-status`). |

---

## 3. Database Models & Enums (`packages/database/prisma/schema.prisma`)

```prisma
enum Role {
  FARMER
  MANDI_OPERATOR
  ADMIN
}

enum MandiApprovalStatus {
  PENDING_ONBOARDING   // Initial login, profile/KYC incomplete
  PENDING_APPROVAL     // Submitted KYC, awaiting admin approval
  APPROVED             // Approved by Admin; full operational access unlocked
  REJECTED             // Rejected by Admin with remarks
  REQUIRES_DOCUMENTS   // Additional documents requested
}

enum BookingStatus {
  PENDING              // Farmer submitted booking
  ACCEPTED             // Mandi confirmed slot
  ARRIVED              // Farmer arrived at market gate
  VERIFIED             // QR/Token scanned & verified at weighbridge
  COMPLETED            // Grain weighed, transaction completed
  REJECTED             // Rejected by Mandi
  CANCELLED            // Cancelled by Farmer/Mandi
}

enum LegalDocType {
  MANDI_LICENSE
  APMC_REGISTRATION
  GST_CERTIFICATE
  OTHER
}

model MandiProfile {
  id               String               @id @default(cuid())
  userId           String               @unique
  mandiName        String?
  apmcCode         String?              @unique
  address          String?
  district         String?
  state            String?
  operatingHours   String?
  aadhaarNumber    String?
  aadhaarVerified  Boolean              @default(false)
  aadhaarDocUrl    String?
  avatarUrl        String?
  approvalStatus   MandiApprovalStatus  @default(PENDING_ONBOARDING)
  rejectionReason  String?
  approvedAt       DateTime?
  rating           Float                @default(4.8)
  totalReviews     Int                  @default(0)
  createdAt        DateTime             @default(now())
  updatedAt        DateTime             @updatedAt

  user             User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
  slots            MandiSlot[]
  bookings         Booking[]
  legalDocs        MandiLegalDoc[]
}

model MandiSlot {
  id                     String      @id @default(cuid())
  mandiProfileId         String
  crop                   String
  date                   String      // YYYY-MM-DD
  startTime              String      // HH:mm
  endTime                String      // HH:mm
  totalCapacityQuintals  Float
  bookedCapacityQuintals Float       @default(0)
  capacityPercentage     Float       @default(0)
  maxFarmers             Int
  bookedFarmers          Int         @default(0)
  availableBookings      Int
  bufferMinutes          Int         @default(15)
  bufferPercentage       Float       @default(10)
  isActive               Boolean     @default(true)
  createdAt              DateTime    @default(now())
  updatedAt              DateTime    @updatedAt

  mandiProfile           MandiProfile @relation(fields: [mandiProfileId], references: [id], onDelete: Cascade)
  bookings               Booking[]
}

model Booking {
  id               String        @id @default(cuid())
  mandiProfileId   String
  slotId           String
  farmerId         String
  crop             String
  quantityQuintals Float
  vehicleNumber    String?
  token            String        @unique // TKN-XXXX
  qrCodeUrl        String?
  status           BookingStatus @default(PENDING)
  notes            String?
  actualWeightQuintals Float?
  finalPayoutAmount    Float?
  verifiedAt       DateTime?
  completedAt      DateTime?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  mandiProfile     MandiProfile  @relation(fields: [mandiProfileId], references: [id], onDelete: Cascade)
  slot             MandiSlot     @relation(fields: [slotId], references: [id], onDelete: Cascade)
  farmer           User          @relation(fields: [farmerId], references: [id], onDelete: Cascade)
}
```

---

## 4. Policy Middlewares & Security Layer

All Mandi endpoints are mounted under `/api/v1/mandi` and protected by modular Express middlewares:

1. **`authenticate`** ([auth.middleware.ts](file:///c:/Users/ADMIN/Desktop/SIH/SIH-2026/apps/backend/src/middlewares/auth.middleware.ts)):
   - Verifies JWT Bearer token in `Authorization: Bearer <token>`.
   - Attaches `req.user` (`userId`, `role`, `email`).
2. **`requireRole(Role.MANDI_OPERATOR)`**:
   - Ensures only users with `role: "MANDI_OPERATOR"` can access Mandi routes (returns `403 FORBIDDEN_ROLE` for Farmers).
3. **`requireApprovedMandi`**:
   - Fetches the user's `MandiProfile`.
   - If `profile.approvalStatus !== "APPROVED"`, immediately halts execution and returns:
     ```json
     {
       "success": false,
       "message": "Access restricted. Your Mandi registration is currently pending approval. Platform administrator approval is required.",
       "code": "MANDI_NOT_APPROVED",
       "data": {
         "approvalStatus": "PENDING_APPROVAL",
         "requiresOnboarding": false
       }
     }
     ```
4. **`validate(schema, source)`** ([validate.middleware.ts](file:///c:/Users/ADMIN/Desktop/SIH/SIH-2026/apps/backend/src/middlewares/validate.middleware.ts)):
   - Evaluates input payloads using Zod schemas.
   - Returns structured `400 BAD_REQUEST` with detailed validation paths on format errors.

---

## 5. Complete API Endpoints Matrix

### A. Dashboard, Glance & Rating
| Endpoint | Method | Middleware | Description |
|---|:---:|---|---|
| `/api/v1/mandi/dashboard` | `GET` | `authenticate`, `requireRole` | Returns high-level metrics & `isApproved: boolean` (accessible for all logged-in Mandi operators). |
| `/api/v1/mandi/rating` | `GET` | `authenticate`, `requireRole` | Returns farmer rating score, precision %, gate wait times, and review stream. |

### B. Profile, KYC & Onboarding (Settings)
| Endpoint | Method | Middleware | Description |
|---|:---:|---|---|
| `/api/v1/mandi/profile` | `GET` | `authenticate`, `requireRole` | Retrieves current APMC Mandi profile and statutory doc records. |
| `/api/v1/mandi/profile` | `PUT` | `validate`, `authenticate` | Updates Mandi profile parameters (operating hours, address, etc.). |
| `/api/v1/mandi/kyc/aadhaar` | `POST` | `validate`, `authenticate` | Submits operator Aadhaar number and document URL. |
| `/api/v1/mandi/kyc/documents` | `POST` | `validate`, `authenticate` | Uploads statutory licenses (License, APMC Board Registration, GST). |
| `/api/v1/mandi/kyc/documents/:docId` | `DELETE` | `authenticate` | Deletes an uploaded statutory compliance document. |
| `/api/v1/mandi/onboarding` | `POST` | `validate`, `authenticate` | Submits complete onboarding payload and transitions status to `PENDING_APPROVAL`. |

### C. Arrival Slot Management (Operational)
| Endpoint | Method | Middleware | Description |
|---|:---:|---|---|
| `/api/v1/mandi/slots` | `POST` | `requireApprovedMandi`, `validate` | Creates a new crop arrival slot with buffer & capacity parameters. |
| `/api/v1/mandi/slots` | `GET` | `requireApprovedMandi`, `validate` | Lists arrival slots filtered by `date`, `crop`, or `isActive`. |
| `/api/v1/mandi/slots/:id` | `GET` | `requireApprovedMandi` | Retrieves single slot by ID. |
| `/api/v1/mandi/slots/:id` | `PUT` | `requireApprovedMandi`, `validate` | Edits an existing slot's timing, buffer, and capacity. |
| `/api/v1/mandi/slots/:id` | `DELETE` | `requireApprovedMandi` | Deletes a slot and cascade-cancels pending bookings. |
| `/api/v1/mandi/slots/default-preset` | `POST` | `requireApprovedMandi` | Auto-generates standard morning & afternoon default slot presets. |

### D. Booking Stream, Gate Verification & Weighbridge Settlement
| Endpoint | Method | Middleware | Description |
|---|:---:|---|---|
| `/api/v1/mandi/bookings/current` | `GET` | `requireApprovedMandi`, `validate` | Streams active bookings in pipeline (`PENDING`, `ACCEPTED`, `ARRIVED`, `VERIFIED`). |
| `/api/v1/mandi/bookings/previous` | `GET` | `requireApprovedMandi`, `validate` | Fetches historical bookings (`COMPLETED`, `REJECTED`, `CANCELLED`). |
| `/api/v1/mandi/bookings/:id/status` | `PATCH` | `requireApprovedMandi`, `validate` | Updates booking status (`ACCEPTED`, `REJECTED`, `ARRIVED`, `CANCELLED`). |
| `/api/v1/mandi/bookings/verify` | `POST` | `requireApprovedMandi`, `validate` | Verifies gate entry via QR code URL or 8-char `TKN-XXXX` token. |
| `/api/v1/mandi/bookings/:id/complete` | `PATCH` | `requireApprovedMandi`, `validate` | Records final weighbridge weight & calculates farmer payout. |

### E. Administrator Review & Approval
| Endpoint | Method | Middleware | Description |
|---|:---:|---|---|
| `/api/v1/admin/mandi/pending` | `GET` | `authenticate`, `requireRole(ADMIN)` | Lists all Mandi applications pending review. |
| `/api/v1/admin/mandi/:id/approval-status` | `PATCH` | `authenticate`, `requireRole(ADMIN)`, `validate` | Updates approval status to `APPROVED`, `REJECTED`, or `REQUIRES_DOCUMENTS`. |

---

## 6. Verification & Automated Test Coverage

The module is verified via **41 automated Vitest tests** covering:
- Role-based authorization and rejection of unauthorized roles.
- Strict enforcement of `requireApprovedMandi` across operational endpoints.
- Post-login onboarding and statutory document upload.
- Admin verification and one-click status transitions.
- Slot capacity calculation, buffer percentages, and booking cascade cancellations.
- Token generation (`TKN-XXXX`) and gate QR validation.

Run all tests:
```bash
bun --cwd apps/backend test
```
