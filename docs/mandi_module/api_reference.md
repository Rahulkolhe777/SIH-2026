# Mandi Module — API Reference (V1)

> **Base URL**: `http://localhost:4000/api/v1`  
> **Global Headers Required**: `Authorization: Bearer <accessToken>`

---

## 1. Dashboard & Glance Metrics

### `GET /mandi/dashboard`
Returns operational KPIs and Mandi profile information. Accessible to all authenticated Mandi operators.
- **Middleware**: `authenticate`, `requireRole(MANDI_OPERATOR)`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "metrics": {
      "totalSlotsToday": 2,
      "activeBookings": 8,
      "arrivalsToday": 3,
      "completedToday": 1,
      "pendingApprovals": 2,
      "totalCapacityUtilizedPercentage": 45.0
    },
    "mandi": {
      "id": "clxyz...",
      "mandiName": "Indore APMC Central Grain Yard",
      "apmcCode": "APMC-IND-MP-042",
      "rating": 4.8,
      "totalReviews": 142,
      "approvalStatus": "APPROVED",
      "isApproved": true
    }
  }
}
```

---

## 2. Onboarding & Settings (KYC)

### `POST /mandi/onboarding`
Submits full APMC Yard details, Aadhaar KYC, and statutory legal licenses for Administrator review.
- **Middleware**: `authenticate`, `requireRole(MANDI_OPERATOR)`, `validate(mandiOnboardingSchema)`
- **Request Body**:
```json
{
  "mandiName": "Indore APMC Central Grain Yard",
  "apmcCode": "APMC-IND-MP-042",
  "address": "Plot No. 44, Industrial Area, Bypass Highway",
  "district": "Indore",
  "state": "Madhya Pradesh",
  "operatingHours": "07:30 AM - 06:00 PM (Mon-Sat)",
  "aadhaarNumber": "541289012345",
  "aadhaarDocUrl": "https://vault.agrimarket.gov.in/docs/aadhaar.pdf",
  "legalDocs": [
    {
      "name": "APMC Mandi Operating License 2026",
      "type": "MANDI_LICENSE",
      "fileUrl": "https://vault.agrimarket.gov.in/docs/license.pdf"
    }
  ]
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Mandi onboarding application submitted successfully. Awaiting Administrator verification.",
  "data": {
    "profileId": "clxyz...",
    "approvalStatus": "PENDING_APPROVAL"
  }
}
```

### `GET /mandi/profile`
- **Response (200 OK)**: Returns profile details, Aadhaar status, and array of uploaded `legalDocs`.

---

## 3. Arrival Slots Management

### `POST /mandi/slots`
- **Middleware**: `requireApprovedMandi`, `validate(createSlotSchema)`
- **Request Body**:
```json
{
  "crop": "Wheat (Sharbati)",
  "date": "2026-09-01",
  "startTime": "08:00",
  "endTime": "11:30",
  "totalCapacityQuintals": 500,
  "maxFarmers": 20,
  "bufferMinutes": 15,
  "bufferPercentage": 10
}
```
- **Response (201 Created)**: Returns created `MandiSlot` record.

### `GET /mandi/slots`
- **Query Parameters**: `date` (YYYY-MM-DD), `crop`, `isActive` (boolean).
- **Response (200 OK)**: Returns list of slots with calculated capacity percentages.

### `PUT /mandi/slots/:id`
- **Request Body**: Partial slot fields to update (`totalCapacityQuintals`, `maxFarmers`, `startTime`, `endTime`, `bufferMinutes`, `isActive`).

### `DELETE /mandi/slots/:id`
- **Response (200 OK)**: Deletes slot and cascade-cancels non-completed bookings with a notification remark.

### `POST /mandi/slots/default-preset`
- **Response (201 Created)**: Auto-generates standard morning (08:00-11:30) and afternoon (12:00-15:30) slots.

---

## 4. Bookings & Gate Verification

### `GET /mandi/bookings/current`
- **Response (200 OK)**: Lists bookings in status `PENDING`, `ACCEPTED`, `ARRIVED`, `VERIFIED`.

### `POST /mandi/bookings/verify`
- **Request Body**: `{ "tokenOrQr": "TKN-7842" }`
- **Response (200 OK)**: Updates status to `VERIFIED` and records `verifiedAt` timestamp.

### `PATCH /mandi/bookings/:id/complete`
- **Request Body**:
```json
{
  "actualWeightQuintals": 48.5,
  "pricePerQuintal": 2450.00,
  "notes": "Verified clean Sharbati grade"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Weighbridge processing finalized and marked complete.",
  "data": {
    "bookingId": "clxyz...",
    "actualWeightQuintals": 48.5,
    "finalPayoutAmount": 118825.00,
    "status": "COMPLETED",
    "completedAt": "2026-08-30T17:00:00.000Z"
  }
}
```

---

## 5. Administrator Approval Endpoints

### `GET /admin/mandi/pending`
- **Middleware**: `authenticate`, `requireRole(ADMIN)`
- **Response (200 OK)**: Returns array of Mandis with status `PENDING_APPROVAL`, `REQUIRES_DOCUMENTS`, or `PENDING_ONBOARDING`.

### `PATCH /admin/mandi/:id/approval-status`
- **Middleware**: `authenticate`, `requireRole(ADMIN)`, `validate(adminApprovalSchema)`
- **Request Body**:
```json
{
  "status": "APPROVED", // or "REJECTED", "REQUIRES_DOCUMENTS"
  "rejectionReason": "Optional notes if rejected"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Mandi approval status updated to APPROVED.",
  "data": {
    "mandiId": "clxyz...",
    "approvalStatus": "APPROVED",
    "approvedAt": "2026-08-30T17:05:00.000Z"
  }
}
```
