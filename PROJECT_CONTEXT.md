# SIH 2026 — Comprehensive Project Architecture & Context Specification

> **Single Source of Truth** for project architecture, development rules, database schema, API contracts, security standards, request/response payloads, and monorepo workflows.

---

## Table of Contents

1. [Monorepo Structure & Architecture](#1-monorepo-structure--architecture)
2. [Development & Production Rules (`agents.md`)](#2-development--production-rules-agentsmd)
3. [Database Architecture (`packages/database`)](#3-database-architecture-packagesdatabase)
4. [Environment & Configuration](#4-environment--configuration)
5. [Authentication & RBAC Architecture](#5-authentication--rbac-architecture)
6. [Complete API Endpoints & Request/Response Contracts](#6-complete-api-endpoints--requestresponse-contracts)
7. [Error Handling & Standard Error Codes](#7-error-handling--standard-error-codes)
8. [Local Development, Docker & Testing Guide](#8-local-development-docker--testing-guide)

---

## 1. Monorepo Structure & Architecture

The repository is organized as a Turborepo monorepo powered by Bun and Node.js.

```text
SIH-2026/
├── apps/
│   ├── backend/               # Express 4 + TypeScript REST API (Port 4000)
│   │   ├── src/
│   │   │   ├── config/        # Environment variable parsing with Zod
│   │   │   ├── controllers/   # HTTP Request/Response controllers (Functional style)
│   │   │   ├── interfaces/    # TypeScript interfaces & types (Barrel exported)
│   │   │   ├── lib/           # Prisma client singleton
│   │   │   ├── middlewares/   # Auth (JWT/RBAC), Rate limiting, Error handling
│   │   │   ├── routes/        # Express route definitions (/api/v1/*)
│   │   │   ├── schemas/       # Zod input validation schemas
│   │   │   ├── services/      # Core business logic & database transactions
│   │   │   ├── utils/         # JWT helpers, bcrypt password hashing, OTP generator
│   │   │   ├── app.ts         # Express app factory & middleware setup
│   │   │   └── index.ts       # Server listener & graceful shutdown handlers
│   │   ├── tests/             # Vitest unit & integration test suites
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── frontend/              # Bun + React 19 + Tailwind CSS 4 App (Port 3000)
│   │   ├── src/               # UI components, pages, live API client & mock data
│   │   └── package.json
│   │
│   └── landing/               # Next.js Landing Page application
│
├── packages/
│   ├── database/              # Shared Prisma schema, migrations, and @repo/database client
│   │   ├── prisma/
│   │   │   └── schema.prisma  # PostgreSQL Prisma schema definition
│   │   ├── src/
│   │   │   └── index.ts       # Global PrismaClient singleton & type exports
│   │   └── package.json
│   │
│   ├── ui/                    # Shared React UI components (@repo/ui)
│   ├── typescript-config/     # Shared tsconfig definitions (@repo/typescript-config)
│   └── eslint-config/         # Shared ESLint configuration (@repo/eslint-config)
│
├── docs/                      # Technical specifications & onboarding documentation
│   ├── auth_module/           # Overview, API reference, and frontend integration specs
│   └── how_to_start/          # Step-by-step local setup, Docker, and dev workflows
│
├── docker-compose.yml         # PostgreSQL 16 Alpine container configuration (Port 5433)
├── turbo.json                 # Turborepo task pipeline configuration
├── agents.md                  # Project development guidelines and production rules
└── package.json               # Monorepo root package.json
```

---

## 2. Development & Production Rules (`agents.md`)

All development within this repository must strictly adhere to the following rules:

### 2.1 Code Style: Pure Functions (No Classes)
* **Do NOT write code in the form of classes and objects.**
* Write all business logic, services, controllers, middlewares, and utilities in the form of **pure, modular, readable functions**.

### 2.2 Interface & Type Management
* All interfaces and TypeScript types **must reside in a dedicated `interfaces/` folder** (e.g. `apps/backend/src/interfaces/<module_name>.interface.ts` and barrel-exported through `src/interfaces/index.ts`).
* Before declaring an interface or type, always check `interfaces/index.ts`. If not present, create it modularly in `interfaces/` and export it.

### 2.3 Shared Database Rule
* All database models, Prisma schema, and migrations must reside in `@repo/database` (`packages/database`).
* Do not create isolated Prisma schemas in sub-services. `@repo/database` is shared across all services (backend, AI pipelines, workers).

### 2.4 Documentation Requirement
* Every module must have comprehensive markdown documentation under `docs/<module_name>/` covering:
  1. `overview.md`: Architectural summary, sequence diagrams, security controls.
  2. `api_reference.md`: Exact endpoint definitions, query parameters, payload examples.
  3. `frontend_integration.md`: Integration contract for frontend engineers (headers, storage, error codes).
* Keep `docs/how_to_start/*.md` updated as the setup evolves.

### 2.5 Git Branch Workflow
* **Do NOT directly modify or push to the `main` branch.**
* Always work on feature branches named: `userName/<module_name>` (e.g. `rupesh/auth`, `mrunal/mandi`).
* Only commit and push to your assigned `userName/<module_name>` branch.

---

## 3. Database Architecture (`packages/database`)

### 3.1 Database Engine
* **PostgreSQL 16** via Docker container (`sih_postgres`).
* Port mapping: **`5433:5432`** (avoiding local default port 5432 conflicts).

### 3.2 Prisma Schema & Data Models

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  FARMER
  MANDI_OPERATOR
  ADMIN
}

enum OtpType {
  EMAIL_VERIFICATION
  LOGIN_OTP
  PASSWORD_RESET
}

model User {
  id                  String               @id @default(cuid())
  name                String
  email               String               @unique
  phone               String?              @unique
  passwordHash        String
  role                Role                 @default(FARMER)
  isVerified          Boolean              @default(false)
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt

  refreshTokens       RefreshToken[]
  otps                OtpVerification[]
  passwordResetTokens PasswordResetToken[]

  @@index([email])
  @@index([phone])
  @@index([role])
}

model RefreshToken {
  id                  String    @id @default(cuid())
  tokenHash           String    @unique // SHA-256 hash of refresh token
  userId              String
  user                User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt           DateTime  // 7-day TTL
  revokedAt           DateTime?
  replacedByTokenHash String?   // For reuse detection
  createdAt           DateTime  @default(now())

  @@index([userId])
  @@index([tokenHash])
}

model OtpVerification {
  id          String    @id @default(cuid())
  identifier  String    // Email address or phone number
  userId      String?
  user        User?     @relation(fields: [userId], references: [id], onDelete: Cascade)
  codeHash    String    // SHA-256 hash of 6-digit OTP
  type        OtpType
  expiresAt   DateTime  // 10-minute TTL
  consumedAt  DateTime?
  createdAt   DateTime  @default(now())

  @@index([identifier, type])
  @@index([userId])
}

model PasswordResetToken {
  id        String    @id @default(cuid())
  tokenHash String    @unique // SHA-256 hash of reset token
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime  // 15-minute TTL
  usedAt    DateTime?
  createdAt DateTime  @default(now())

  @@index([userId])
  @@index([tokenHash])
}
```

---

## 4. Environment & Configuration

Backend environment file: `apps/backend/.env` (configured via `apps/backend/src/config/env.ts` with Zod validation):

| Variable | Type | Default | Description |
|---|---|---|---|
| `PORT` | Number | `4000` | Express HTTP server port |
| `NODE_ENV` | String | `development` | Runtime mode (`development`, `production`, `test`) |
| `CLIENT_URL` | String | `http://localhost:3000` | Frontend web client URL for CORS |
| `DATABASE_URL` | String | `postgresql://postgres:postgres@localhost:5433/sih_db?schema=public` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | String | (min 32 chars) | Secret key for signing access tokens |
| `JWT_REFRESH_SECRET` | String | (min 32 chars) | Secret key for signing refresh tokens |
| `JWT_ACCESS_EXPIRES_IN` | String | `15m` | Access token lifespan |
| `JWT_REFRESH_EXPIRES_IN`| String | `7d` | Refresh token lifespan |
| `RESEND_API_KEY` | String | `re_...` | Resend transactional email API key |
| `EMAIL_FROM` | String | `onboarding@resend.dev` | Verified sender email address |

---

## 5. Authentication & RBAC Architecture

### 5.1 Security Architecture
1. **Password Security**: Bcrypt with salt work factor 12. Plaintext passwords and hashes are never exposed through API responses or logs.
2. **Dual-Token System**:
   - `accessToken`: Stateless JWT containing `{ userId, email, role, isVerified }`. Sent as `Authorization: Bearer <token>` (15-min lifespan).
   - `refreshToken`: Cryptographically secure random string, stored as SHA-256 hash in PostgreSQL (7-day lifespan). Rotated upon every refresh.
3. **Reuse Detection**: If an already revoked refresh token is presented, all active sessions for that user are immediately invalidated.
4. **Rate Limiting**:
   - Registration: 30 requests / 15 mins.
   - Login: 10 attempts / 15 mins.
   - OTP & Forgot Password: 5 attempts / 10 mins.
5. **Role-Based Access Control (RBAC)**: Server-side authorization enforced via middlewares:
   - `authenticate`: Validates Bearer JWT access token.
   - `requireRole(Role.FARMER | Role.MANDI_OPERATOR | Role.ADMIN)`: Enforces role permissions.
   - `requireVerified`: Enforces verified account status.

---

## 6. Complete API Endpoints & Request/Response Contracts

**Base URL**: `http://localhost:4000/api/v1`

### 6.1 Public & Health Endpoints

#### `GET /health` & `GET /api/v1/health`
Checks server status.
* **Auth Required**: No
* **Response (`200 OK`)**:
  ```json
  {
    "status": "ok",
    "service": "SIH Backend API",
    "timestamp": "2026-08-30T09:00:00.000Z",
    "environment": "development"
  }
  ```

---

### 6.2 Authentication Endpoints

#### `POST /api/v1/auth/register` (Unified Registration)
Registers a new user as `FARMER` or `MANDI_OPERATOR` and dispatches an email OTP.
* **Auth Required**: No | **Rate Limit**: 30/15m
* **Request Payload**:
  ```json
  {
    "name": "Ramesh Kumar",
    "email": "ramesh@example.com",
    "phone": "+919876543210",
    "password": "SecurePassword123",
    "role": "FARMER"
  }
  ```
  *(Note: `phone` is optional. `role` accepts `"FARMER" | "MANDI_OPERATOR"`. Password requires min 8 chars with letters and numbers).*
* **Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "cm7xyz1230000abc",
        "name": "Ramesh Kumar",
        "email": "ramesh@example.com",
        "phone": "+919876543210",
        "role": "FARMER",
        "isVerified": false,
        "createdAt": "2026-08-30T09:00:00.000Z"
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "4a7f9b8c0e2d1f4a9b8c0e2d1f...",
      "message": "Registration successful. Please verify your email with the OTP sent."
    }
  }
  ```

---

#### `POST /api/v1/user/farmer` & `POST /api/v1/user/mandi` (Dedicated Role Registration)
Role-specific endpoints where role is inferred from route.
* **Auth Required**: No | **Rate Limit**: 30/15m
* **Request Payload**:
  ```json
  {
    "name": "Suresh APMC",
    "email": "suresh@apmc.org",
    "phone": "+919876543211",
    "password": "SecurePassword123"
  }
  ```
* **Response (`201 Created`)**: Same structure as `/auth/register`.

---

#### `POST /api/v1/auth/login`
Authenticates via email or phone with password.
* **Auth Required**: No | **Rate Limit**: 10/15m
* **Request Payload**:
  ```json
  {
    "identifier": "ramesh@example.com",
    "password": "SecurePassword123"
  }
  ```
  *(Note: `identifier` can be email or phone number).*
* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "data": {
      "user": {
        "id": "cm7xyz1230000abc",
        "name": "Ramesh Kumar",
        "email": "ramesh@example.com",
        "phone": "+919876543210",
        "role": "FARMER",
        "isVerified": true,
        "createdAt": "2026-08-30T09:00:00.000Z"
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "4a7f9b8c0e2d1f4a9b8c0e2d1f..."
    }
  }
  ```
* **Unverified Account (`403 Forbidden`)**:
  ```json
  {
    "success": false,
    "message": "Your account is not verified. Please verify your email with the OTP sent during registration.",
    "code": "ACCOUNT_NOT_VERIFIED"
  }
  ```

---

#### `POST /api/v1/auth/refresh`
Rotates refresh token and issues a new access token.
* **Auth Required**: No
* **Request Payload**:
  ```json
  {
    "refreshToken": "4a7f9b8c0e2d1f4a9b8c0e2d1f..."
  }
  ```
* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Access token refreshed successfully.",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "9d8e7f6a5b4c3d2e1f0a9b8c7d..."
    }
  }
  ```

---

#### `POST /api/v1/auth/logout`
Revokes the submitted refresh token session.
* **Auth Required**: No
* **Request Payload**:
  ```json
  {
    "refreshToken": "4a7f9b8c0e2d1f4a9b8c0e2d1f..."
  }
  ```
* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "success": true,
      "message": "Logged out successfully."
    }
  }
  ```

---

#### `POST /api/v1/auth/send-otp`
Sends/resends a 6-digit OTP code (10-minute validity).
* **Auth Required**: No | **Rate Limit**: 5/10m
* **Request Payload**:
  ```json
  {
    "identifier": "ramesh@example.com",
    "type": "EMAIL_VERIFICATION"
  }
  ```
  *(Options for `type`: `"EMAIL_VERIFICATION" | "LOGIN_OTP" | "PASSWORD_RESET"`).*
* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "success": true,
      "message": "OTP sent successfully to ramesh@example.com. Valid for 10 minutes."
    }
  }
  ```

---

#### `POST /api/v1/auth/verify-otp`
Verifies a 6-digit OTP. For `EMAIL_VERIFICATION`, automatically sets `isVerified: true`.
* **Auth Required**: No
* **Request Payload**:
  ```json
  {
    "identifier": "ramesh@example.com",
    "code": "482915",
    "type": "EMAIL_VERIFICATION"
  }
  ```
* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "success": true,
      "message": "OTP verified successfully.",
      "isVerified": true
    }
  }
  ```

---

#### `POST /api/v1/auth/forgot-password`
Dispatches password recovery link & OTP.
* **Auth Required**: No | **Rate Limit**: 5/10m
* **Request Payload**:
  ```json
  {
    "email": "ramesh@example.com"
  }
  ```
* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "success": true,
      "message": "If an account exists with this email, a password reset link and OTP has been sent."
    }
  }
  ```

---

#### `POST /api/v1/auth/reset-password`
Sets new password with reset token or OTP; invalidates all active sessions.
* **Auth Required**: No
* **Request Payload**:
  ```json
  {
    "email": "ramesh@example.com",
    "token": "3a8bc827d091e7fb10486bc9...",
    "newPassword": "NewStrongPassword456"
  }
  ```
* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "success": true,
      "message": "Password reset successful. You may now login with your new password."
    }
  }
  ```

---

### 6.3 Authenticated User & Protected Role Dashboards

#### `GET /api/v1/auth/me`
Retrieves authenticated user profile.
* **Auth Required**: Yes (`Authorization: Bearer <accessToken>`)
* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "cm7xyz1230000abc",
        "name": "Ramesh Kumar",
        "email": "ramesh@example.com",
        "phone": "+919876543210",
        "role": "FARMER",
        "isVerified": true,
        "createdAt": "2026-08-30T09:00:00.000Z",
        "updatedAt": "2026-08-30T09:05:00.000Z"
      }
    }
  }
  ```

---

#### `GET /api/v1/farmer/dashboard`
Farmer-exclusive protected dashboard endpoint.
* **Auth Required**: Yes (`role: FARMER`)
* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Welcome to Farmer Dashboard",
    "data": {
      "userId": "cm7xyz1230000abc",
      "role": "FARMER",
      "modules": ["Crop Management", "Marketplace Prices", "Weather Forecasts", "Direct Bidding"]
    }
  }
  ```
* **Response if accessed by non-farmer (`403 Forbidden`)**:
  ```json
  {
    "success": false,
    "message": "Forbidden. This resource requires role: FARMER",
    "code": "FORBIDDEN_ROLE"
  }
  ```

---

#### `GET /api/v1/mandi/dashboard`
Mandi Operator-exclusive protected dashboard endpoint.
* **Auth Required**: Yes (`role: MANDI_OPERATOR`)
* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Welcome to Mandi Operator Dashboard",
    "data": {
      "userId": "cm7xyz9990000mnd",
      "role": "MANDI_OPERATOR",
      "modules": ["Daily Rate Updates", "Arrival Management", "Auction Records", "Farmer Inquiries"]
    }
  }
  ```

---

## 7. Error Handling & Standard Error Codes

All backend errors return a consistent, structured payload:

```json
{
  "success": false,
  "message": "Human-readable error explanation",
  "code": "ERROR_CODE_STRING",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

### Standard Error Code Registry

| Error Code | HTTP Status | Description |
|---|:---:|---|
| `VALIDATION_ERROR` | 400 | Zod validation failed (field-level details in `errors` array). |
| `INVALID_CREDENTIALS` | 401 | Invalid email/phone or password. |
| `UNAUTHORIZED` | 401 | Missing or malformed Bearer token in header. |
| `TOKEN_EXPIRED_OR_INVALID` | 401 | Access token expired or invalid signature. |
| `INVALID_REFRESH_TOKEN` | 401 | Refresh token is expired, malformed, or missing. |
| `TOKEN_REUSE_DETECTED` | 401 | Revoked refresh token submitted (potential token theft). |
| `FORBIDDEN_ROLE` | 403 | User role is not permitted to access this endpoint. |
| `ACCOUNT_NOT_VERIFIED` | 403 | Action blocked until email/phone OTP verification completes. |
| `EMAIL_EXISTS` | 409 | Account with this email address already exists. |
| `PHONE_EXISTS` | 409 | Account with this phone number already exists. |
| `INVALID_OTP` | 400 | OTP code is incorrect, expired, or already consumed. |
| `INVALID_RESET_TOKEN` | 400 | Password reset token is invalid, expired, or used. |
| `TOO_MANY_REQUESTS` | 429 | Rate limit exceeded. |
| `INTERNAL_SERVER_ERROR` | 500 | Unhandled server exception. |

---

## 8. Local Development, Docker & Testing Guide

### 8.1 Prerequisites
* **Bun** (v1.3+)
* **Docker & Docker Compose**
* **Node.js** (v20+ / v24)

### 8.2 Quick Start Commands

```powershell
# 1. Install dependencies across the monorepo
bun install

# 2. Start PostgreSQL container in background (Port 5433)
docker compose up -d

# 3. Generate Prisma client
bun run db:generate

# 4. Apply database migrations / push schema
bun run db:push
# or: bun run db:migrate

# 5. Start development servers
# Option A: Monorepo dev (Starts backend on 4000 & frontend on 3000)
bun dev

# Option B: Run backend standalone
bun --cwd apps/backend dev

# Option C: Run frontend standalone
bun --cwd apps/frontend dev
```

### 8.3 Automated Testing & Quality Checks

```powershell
# Run backend test suite (Vitest)
bun --cwd apps/backend test

# Run tests in watch mode
bun --cwd apps/backend test:watch

# Static typecheck across all monorepo packages
bun run check-types
```
