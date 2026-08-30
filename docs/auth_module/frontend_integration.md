# Frontend Authentication & Redux Integration Guide

## Overview
This document specifies the frontend authentication architecture for Agrovia, connecting the React Single Page Application (`apps/frontend`) to the Express/Bun backend API (`apps/backend`) using Redux Toolkit.

---

## 1. Redux Store Architecture (`apps/frontend/src/store/`)

### State Shape (`auth` slice)
```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  otpSent: boolean;
  error: string | null;
  successMessage: string | null;
}
```

### Typed Hooks
Use `useAppDispatch` and `useAppSelector` from `apps/frontend/src/store`:
```typescript
import { useAppDispatch, useAppSelector } from "../store";

const dispatch = useAppDispatch();
const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
```

---

## 2. Authentication Flow & Role Simplification

### Streamlined Role Selection
Both **Farmer** and **Mandi Operator** registration forms share identical, frictionless onboarding fields:
- `name` (string, required): Full Name
- `email` (string, required): Email address
- `phone` (string, required): 10-digit mobile number
- `location` (string, optional): District / Mandi location
- `password` (string, required, >= 8 chars): Strong password
- `role` (`FARMER` | `MANDI_OPERATOR`)

### Login Support
1. **Password Authentication**: Supports login using either Email or Phone Number with password.
2. **OTP Authentication**: 6-digit one-time passcode with countdown timer and resend capability.

---

## 3. Connected Backend API Endpoints (`/api/v1/auth/*`)

| Endpoint | Method | Payload | Redux Thunk |
|---|:---:|---|---|
| `/api/v1/auth/register` | `POST` | `{ name, email, phone, password, role }` | `registerUserThunk` |
| `/api/v1/auth/login` | `POST` | `{ identifier, password }` | `loginUserThunk` |
| `/api/v1/auth/otp/send` | `POST` | `{ identifier, type }` | `sendOtpThunk` |
| `/api/v1/auth/otp/verify` | `POST` | `{ identifier, code, type }` | `verifyOtpThunk` |
| `/api/v1/auth/me` | `GET` | Headers: `Bearer <token>` | `fetchCurrentUserThunk` |

---

## 4. Turborepo Orchestration

Turborepo config (`turbo.json`) manages workspace pipelines:
- `bun run build`: Runs production builds across `apps/landing`, `apps/frontend`, and `apps/backend`.
- `bun run check-types`: Validates TypeScript typings across all apps and packages.
- `bun run dev`: Runs all dev servers concurrently.
