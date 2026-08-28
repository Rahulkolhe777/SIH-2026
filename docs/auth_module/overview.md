# Authentication Module — Architecture & System Overview

## 1. Executive Summary

The **Authentication & RBAC Module** provides a shared, secure, and production-ready identity layer for the **SIH Agricultural Marketplace Platform**. It provides seamless onboarding, login, session management, and role-based authorization for two primary user personas:
1. **Farmer** (`FARMER`)
2. **Mandi Operator** (`MANDI_OPERATOR`)
3. *(Future administrative role: `ADMIN`)*

Both roles utilize a unified backend infrastructure while enforcing strict server-side boundary segregation across dashboards and resources.

---

## 2. Core Architectural Principles

- **Unified Identity Model**: Single database schema backing all user types with a `Role` discriminator.
- **Stateless Access with State-Backed Rotation**: Fast JWT validation for low latency with DB-tracked Refresh Token rotation and reuse detection.
- **Crypto-Grade Password Security**: Bcrypt with work factor 12. Plaintext passwords and hashes are never exposed through API responses or logs.
- **Resend Email Integration**: Automated transactional email delivery for 6-digit OTPs and single-use password reset tokens with fallback development mode.
- **Granular RBAC**: Express middleware enforcing role checks at every API layer (`authenticate`, `requireRole`, `requireVerified`).
- **Defensive Security Controls**: Rate limiting against brute-force attacks on login, OTP, and password reset endpoints.

---

## 3. Database Schema (PostgreSQL + Prisma)

```mermaid
erDiagram
    USER ||--o{ REFRESH_TOKEN : "owns"
    USER ||--o{ OTP_VERIFICATION : "receives"
    USER ||--o{ PASSWORD_RESET_TOKEN : "requests"

    USER {
        string id PK "cuid"
        string name
        string email UK
        string phone UK "optional"
        string passwordHash
        enum role "FARMER | MANDI_OPERATOR | ADMIN"
        boolean isVerified
        datetime createdAt
        datetime updatedAt
    }

    REFRESH_TOKEN {
        string id PK "cuid"
        string tokenHash UK "sha256"
        string userId FK
        datetime expiresAt "7 days"
        datetime revokedAt "nullable"
        string replacedByTokenHash "nullable"
        datetime createdAt
    }

    OTP_VERIFICATION {
        string id PK "cuid"
        string identifier "email or phone"
        string userId FK "nullable"
        string codeHash "sha256"
        enum type "EMAIL_VERIFICATION | LOGIN_OTP | PASSWORD_RESET"
        datetime expiresAt "10 mins"
        datetime consumedAt "nullable"
        datetime createdAt
    }

    PASSWORD_RESET_TOKEN {
        string id PK "cuid"
        string tokenHash UK "sha256"
        string userId FK
        datetime expiresAt "15 mins"
        datetime usedAt "nullable"
        datetime createdAt
    }
```

---

## 4. Token & Session Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Client as Frontend Client
    participant Server as Backend Auth API
    participant DB as PostgreSQL DB
    participant Mail as Resend Service

    Note over Client,Mail: Registration & Verification Flow
    Client->>Server: POST /api/v1/auth/register (or /user/farmer /user/mandi)
    Server->>DB: Hash password & create User (isVerified=false)
    Server->>DB: Store hashed 6-digit OTP (10m TTL)
    Server->>Mail: Send verification email with OTP
    Server-->>Client: 201 Created (User data + accessToken + refreshToken)

    Client->>Server: POST /api/v1/auth/verify-otp (email, code, type=EMAIL_VERIFICATION)
    Server->>DB: Validate & consume OTP, set isVerified=true
    Server-->>Client: 200 OK (isVerified=true)

    Note over Client,Mail: Token Rotation & Refresh
    Client->>Server: POST /api/v1/auth/refresh (refreshToken)
    Server->>DB: Verify token hash & active state
    Server->>DB: Revoke old token & generate new token pair
    Server-->>Client: 200 OK (new accessToken + new refreshToken)
```

---

## 5. Security & Threat Mitigation

| Security Feature | Implementation Mechanism | Purpose |
| :--- | :--- | :--- |
| **Password Hashing** | `bcryptjs` (Cost factor 12) | Prevents rainbow table and dictionary attacks. |
| **Token Storage** | SHA-256 hash in DB | Refresh tokens and OTPs stored as hashes. DB compromise cannot leak active sessions. |
| **Reuse Detection** | `replacedByTokenHash` & revocation audit | If an already-revoked refresh token is re-submitted, all sessions for that user are immediately invalidated. |
| **Single-Use Tokens** | `consumedAt` / `usedAt` timestamps | Prevents replay attacks on OTPs and reset tokens. |
| **Rate Limiting** | `express-rate-limit` | 10 attempts / 15m on login; 5 attempts / 10m on OTPs. |
| **Email Enumeration Defense** | Constant-response forgot password | Unregistered emails return standard generic 200 OK message to prevent account discovery. |
| **Header Hardening** | `helmet` | Sets standard OWASP recommended HTTP response headers (CSP, HSTS, X-Content-Type-Options, etc.). |

---

## 6. Environment Variables

Create `.env` in `apps/backend/` using the following parameters:

```env
# Server
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/sih_db?schema=public"

# JWT Secrets (Minimum 32 random characters recommended)
JWT_ACCESS_SECRET="your_super_secret_access_token_key_change_in_production"
JWT_REFRESH_SECRET="your_super_secret_refresh_token_key_change_in_production"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Resend Email Service
RESEND_API_KEY="re_your_api_key_here"
EMAIL_FROM="onboarding@resend.dev"
```
