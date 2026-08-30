# Mandi Module Backend — Implementation Prompt

## Objective

Build a production-ready, modular, and scalable **Mandi Backend** for the Agricultural Marketplace platform.

All code must strictly follow the architectural and production rules defined in [PROJECT_CONTEXT.md](file:///c:/Users/ADMIN/Desktop/SIH/SIH-2026/PROJECT_CONTEXT.md) and [agents.md](file:///c:/Users/ADMIN/Desktop/SIH/SIH-2026/agents.md).

---

## Mandi Module Features & Goals

### 1. Register & Authentication
- **Mandi Registration**:
  - Register via the Mandi signup endpoint (`/api/v1/user/mandi` or `/api/v1/auth/register`).
  - Required fields: Name, Email, Password, Phone Number, with Role automatically assigned as `MANDI_OPERATOR`.
- **Mandi Login**:
  - Login via credentials (Email/Phone + Password).
  - Automatically detect and authorize as `MANDI_OPERATOR`.
  - Password reset and token refresh support.

---

### 2. Mandi Dashboard
- **Current Bookings**:
  - Fetch all active stream bookings for the Mandi.
  - Display and filter bookings by status: `PENDING`, `ACCEPTED`, `ARRIVED`, `VERIFIED`.
- **Previous Bookings**:
  - Historical booking logs for completed, rejected, and cancelled arrivals.
  - Display and filter: `COMPLETED`, `REJECTED`, `CANCELLED`.
- **Accept & Reject Bookings**:
  - Mandi operator can accept or reject farmer booking requests.
  - Optional rejection note/remark for capacity or moisture constraints.
- **Booking Slots & Real-Time Adjustments**:
  - Edit booking slot parameters dynamically.
  - Apply default booking slot presets for daily operating hours.
- **Verify Booking via QR Code / Token**:
  - Validate farmer gate entry using a 6-to-8 character unique Token (e.g. `TKN-7821`) or QR code payload.
  - Mark arrival status as `VERIFIED` upon gate check-in.
- **Mark Farmer & Booking Complete**:
  - Finalize weighbridge weigh-in and record completion timestamp.

---

### 3. Manage Arrival Slots
- **Create a Slot**:
  - Crop name (e.g. Wheat, Rice, Mustard, Soyabean, etc.).
  - Date & Time window (`date`, `startTime`, `endTime`).
  - Intake capacity in Quintals and calculate Capacity Percentage (%).
  - Maximum allowable farmers limit (`maxFarmers`).
  - Available booking counter (`availableBookings`).
- **Slot Buffer Controls**:
  - Buffer time between consecutive arrivals (in minutes).
  - Capacity buffer margin tolerance (%).
- **Edit Slot**:
  - Update timing, capacity quotas, or buffer parameters.
- **Delete Slot**:
  - Remove a slot and cascade-cancel any pending farmer bookings with a slot cancellation remark.

---

### 4. Mandi Settings & KYC
- **User & Yard Management**:
  - Update operator contact details (Name, Phone, Email).
  - Update APMC Mandi Yard details (Mandi Name, APMC Code, Physical Address, Operating Hours, District, State).
- **Aadhaar Identity Verification**:
  - Add 12-digit Aadhaar number and upload Aadhaar verification document.
- **Legal Documents & Compliance**:
  - Upload statutory documents: APMC Mandi Operating License, State Mandi Board Registration, GST Certificate.
  - Manage and view verification status (`PENDING`, `VERIFIED`, `REJECTED`).
- **Profile Photo**:
  - Upload and update Mandi yard logo or operator profile photo.
- **Mandi Rating & Reputation**:
  - Retrieve live farmer rating score (e.g. 4.8 / 5.0), total reviews count, and weighbridge accuracy metrics.

---

## Architectural & Production Rules (Strict Enforcement)

1. **Pure Functional Style (No Classes)**:
   - Do **NOT** write code using classes or OOP patterns.
   - Write all business logic, services, controllers, middlewares, and utils as **pure, readable, modular functions**.

2. **Dedicated Interfaces**:
   - Declare all TypeScript types/interfaces in `apps/backend/src/interfaces/mandi.interface.ts`.
   - Export all interfaces through `apps/backend/src/interfaces/index.ts`.

3. **Shared Database (`packages/database`)**:
   - Define all models (`MandiProfile`, `MandiSlot`, `Booking`, `MandiLegalDoc`) in `packages/database/prisma/schema.prisma`.
   - Run Prisma migrations via Docker container PostgreSQL on port `5433`.

4. **Input Validation**:
   - Validate all request payloads, queries, and params using Zod schemas in `apps/backend/src/schemas/mandi.schema.ts`.

5. **Role-Based Authorization**:
   - Enforce server-side security using `authenticate` and `requireRole(Role.MANDI_OPERATOR)`.
   - Ensure an operator can only manage slots and bookings belonging to their own Mandi yard.

6. **Backend Only**:
   - Do **NOT** modify the frontend application. Only write backend services, controllers, routes, schemas, database models, and documentation.

7. **Documentation**:
   - Provide complete, well-structured documentation in `docs/mandi_module/`:
     - `overview.md`: System architecture and booking state workflows.
     - `api_reference.md`: Exact endpoints, request/response bodies, query params, error codes.
     - `frontend_integration.md`: Practical integration guide for frontend developers.

8. **Testing**:
   - Write automated Vitest tests under `apps/backend/tests/mandi/` covering slot creation, booking workflows, QR token verification, and role permissions.
