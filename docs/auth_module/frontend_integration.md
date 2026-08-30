# Frontend Authentication, OTP Verification & Redux Integration Guide

## Overview
This document specifies the complete frontend authentication and OTP verification lifecycle for Agrovia, connecting the React Application (`apps/frontend`) to the Express/Bun backend API (`apps/backend`) using Redux Toolkit.

---

## 1. Complete User Journey (Registration → OTP → Dashboard)

```mermaid
sequenceDiagram
    autonumber
    actor User as Farmer / Mandi Operator
    participant UI as React Client (apps/frontend)
    participant Redux as Redux Toolkit Store (authSlice)
    participant API as Backend Auth API (apps/backend:4000)
    participant DB as PostgreSQL Database

    Note over User,DB: 1. Registration
    User->>UI: Fills Name, Email, Phone, Mandi/Location, Password
    UI->>Redux: dispatch(registerUserThunk(payload))
    Redux->>API: POST /api/v1/auth/register
    API->>DB: Create User (isVerified=false) & create 6-digit OTP code (10m TTL)
    API-->>Redux: 201 Created (User data + tokens + message)
    Redux-->>UI: Sets pendingIdentifier = user email & otpSent = true

    Note over User,DB: 2. Seamless OTP Screen Transition
    UI->>UI: Automatically switches to 6-Box OTP Verification Screen
    User->>UI: Enters 6-digit OTP code (with auto-focus & paste support)
    UI->>Redux: dispatch(verifyOtpThunk({ identifier, code, type: "EMAIL_VERIFICATION" }))
    Redux->>API: POST /api/v1/auth/verify-otp
    API->>DB: Validates codeHash, sets isVerified=true, marks OTP consumed
    API-->>Redux: 200 OK (Verified User data + accessToken + refreshToken)

    Note over User,DB: 3. Instant Dashboard Entry
    Redux-->>UI: Sets isAuthenticated=true & user session in localStorage
    UI->>UI: Auto-navigates to /farmer/dashboard or /mandi/dashboard based on user role
```

---

## 2. Redux Store Architecture (`apps/frontend/src/store/`)

### State Shape (`auth` slice)
```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  otpSent: boolean;
  pendingIdentifier: string | null;
  pendingOtpType: "EMAIL_VERIFICATION" | "LOGIN_OTP" | "PASSWORD_RESET";
  error: string | null;
  successMessage: string | null;
}
```

### Async Thunks
- `registerUserThunk`: Dispatches to `POST /api/v1/auth/register` and switches view to `OTP_VERIFY`.
- `sendOtpThunk`: Dispatches to `POST /api/v1/auth/send-otp` with countdown timer.
- `verifyOtpThunk`: Dispatches to `POST /api/v1/auth/verify-otp` and activates session.
- `loginUserThunk`: Dispatches to `POST /api/v1/auth/login`. If unverified (`ACCOUNT_NOT_VERIFIED`), automatically opens `OTP_VERIFY`.
- `fetchCurrentUserThunk`: Auto-hydrates active user session on startup.
- `logout`: Clears session tokens from storage and resets state.

---

## 3. Connected Backend API Endpoints

| Endpoint | Method | Payload | Description |
|---|:---:|---|---|
| `/api/v1/auth/register` | `POST` | `{ name, email, phone, password, role }` | Creates account & sends verification OTP |
| `/api/v1/auth/login` | `POST` | `{ identifier, password }` | Authenticates email/phone + password |
| `/api/v1/auth/send-otp` | `POST` | `{ identifier, type }` | Triggers or resends 6-digit OTP code |
| `/api/v1/auth/verify-otp` | `POST` | `{ identifier, code, type }` | Validates 6-digit OTP and activates account |
| `/api/v1/auth/me` | `GET` | Headers: `Bearer <token>` | Fetches active authenticated user session |

---

## 4. OTP Verification UI Capabilities
1. **6-Box Segmented Inputs**: Auto-advances focus upon typing and supports backspace navigation.
2. **Instant Clipboard Paste**: Automatically splits 6 pasted digits across the inputs and auto-submits.
3. **Resend Timer**: 60-second cooldown timer prevents rate limiting and spam.
4. **Typo Correction**: "Back to Details" link allows correcting email/phone without losing context.
