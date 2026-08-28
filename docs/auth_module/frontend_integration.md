# Frontend Integration Specification — Authentication Module

This document is the technical contract for Frontend Engineers integrating with the SIH Authentication & RBAC backend. It provides endpoint definitions, required request headers, payload specifications, sample response structures, error handling rules, and user flow architectures.

---

## 1. Global API Configuration

- **Base URL**: `http://localhost:4000/api/v1` (Production: configurable via `NEXT_PUBLIC_API_URL` or `VITE_API_URL`)
- **Default Headers**:
  ```http
  Content-Type: application/json
  Accept: application/json
  ```
- **Protected Request Header**:
  ```http
  Authorization: Bearer <accessToken>
  ```

---

## 2. Token Lifecycle & Storage Rules

| Token | Type | Lifetime | Recommended Storage | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **`accessToken`** | JWT (Bearer) | 15 Minutes | In-Memory / Secure State | Sent in `Authorization` header for all protected API calls. |
| **`refreshToken`** | Opaque String | 7 Days | `localStorage` / Secure Storage | Used exclusively to request new `accessToken` upon 401 expiration. |

---

## 3. Endpoints & Payload Specifications

### 3.1 User Registration (Unified)

- **Endpoint**: `POST /auth/register`
- **Auth Required**: No
- **Rate Limit**: 30 requests / 15 mins

#### Request Payload
| Field | Type | Required | Validation Rules | Description |
| :--- | :--- | :---: | :--- | :--- |
| `name` | String | Yes | Min 2, max 100 chars | Full name of the user |
| `email` | String | Yes | Valid email format | User's email address |
| `phone` | String | No | International format (e.g. `+919876543210`) | Mobile number |
| `password` | String | Yes | Min 8 chars, at least 1 letter, 1 number | Account password |
| `role` | String | Yes | `"FARMER"` \| `"MANDI_OPERATOR"` | Account type |

```json
{
  "name": "Ramesh Kumar",
  "email": "ramesh@example.com",
  "phone": "+919876543210",
  "password": "SecurePassword123",
  "role": "FARMER"
}
```

#### Success Response (`201 Created`)
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
      "createdAt": "2026-08-28T16:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "4a7f9b8c0e2d1f4a9b8c0e2d1f...",
    "message": "Registration successful. Please verify your email with the OTP sent."
  }
}
```

#### Error Responses
- `409 Conflict` (`EMAIL_EXISTS`): Email is already registered.
- `409 Conflict` (`PHONE_EXISTS`): Phone number is already registered.
- `400 Bad Request` (`VALIDATION_ERROR`): Invalid format (e.g. weak password or invalid email).

---

### 3.2 Dedicated Role Registration Endpoints

Alternative endpoints where role is determined by URL:

- **Farmer Registration**: `POST /user/farmer`
- **Mandi Operator Registration**: `POST /user/mandi`

#### Request Payload
```json
{
  "name": "Suresh APMC",
  "email": "suresh@apmc.org",
  "phone": "+919876543211",
  "password": "SecurePassword123"
}
```

#### Success Response (`201 Created`)
```json
{
  "success": true,
  "message": "Farmer account registered successfully.",
  "data": {
    "user": {
      "id": "cm7xyz1230000abc",
      "name": "Suresh APMC",
      "email": "suresh@apmc.org",
      "phone": "+919876543211",
      "role": "MANDI_OPERATOR",
      "isVerified": false,
      "createdAt": "2026-08-28T16:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "4a7f9b8c0e2d1f4a9b8c0e2d1f..."
  }
}
```

---

### 3.3 User Login

- **Endpoint**: `POST /auth/login`
- **Auth Required**: No
- **Rate Limit**: 10 attempts / 15 mins

#### Request Payload
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `identifier` | String | Yes | Email address OR phone number |
| `password` | String | Yes | Account password |

```json
{
  "identifier": "ramesh@example.com",
  "password": "SecurePassword123"
}
```

#### Success Response (`200 OK`)
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
      "createdAt": "2026-08-28T16:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "4a7f9b8c0e2d1f4a9b8c0e2d1f..."
  }
}
```

#### Error Responses
- `401 Unauthorized` (`INVALID_CREDENTIALS`): Wrong email/phone or password.
- `403 Forbidden` (`ACCOUNT_NOT_VERIFIED`): User has not completed OTP verification.
  ```json
  {
    "success": false,
    "message": "Your account is not verified. Please verify your email with the OTP sent during registration.",
    "code": "ACCOUNT_NOT_VERIFIED"
  }
  ```

---

### 3.4 Token Refresh (Silent Re-authentication)

- **Endpoint**: `POST /auth/refresh`
- **Auth Required**: No

#### Request Payload
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `refreshToken` | String | Yes | Stored active refresh token |

```json
{
  "refreshToken": "4a7f9b8c0e2d1f4a9b8c0e2d1f..."
}
```

#### Success Response (`200 OK`)
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

#### Error Responses
- `401 Unauthorized` (`REFRESH_TOKEN_EXPIRED`): Refresh token expired. Redirect user to `/login`.
- `401 Unauthorized` (`TOKEN_REUSE_DETECTED`): Stolen token detected. Clear all local storage and force `/login`.

---

### 3.5 User Logout

- **Endpoint**: `POST /auth/logout`
- **Auth Required**: No

#### Request Payload
```json
{
  "refreshToken": "4a7f9b8c0e2d1f4a9b8c0e2d1f..."
}
```

#### Success Response (`200 OK`)
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

### 3.6 Send / Resend OTP

- **Endpoint**: `POST /auth/send-otp`
- **Auth Required**: No
- **Rate Limit**: 5 requests / 10 mins

#### Request Payload
| Field | Type | Required | Options |
| :--- | :--- | :---: | :--- |
| `identifier` | String | Yes | Target email or phone number |
| `type` | String | Yes | `"EMAIL_VERIFICATION"` \| `"LOGIN_OTP"` \| `"PASSWORD_RESET"` |

```json
{
  "identifier": "ramesh@example.com",
  "type": "EMAIL_VERIFICATION"
}
```

#### Success Response (`200 OK`)
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

### 3.7 Verify OTP

- **Endpoint**: `POST /auth/verify-otp`
- **Auth Required**: No

#### Request Payload
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `identifier` | String | Yes | Email or phone number |
| `code` | String | Yes | Exactly 6 numeric digits |
| `type` | String | Yes | `"EMAIL_VERIFICATION"` \| `"LOGIN_OTP"` \| `"PASSWORD_RESET"` |

```json
{
  "identifier": "ramesh@example.com",
  "code": "572098",
  "type": "EMAIL_VERIFICATION"
}
```

#### Success Response (`200 OK`)
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

#### Error Responses
- `400 Bad Request` (`INVALID_OTP`): Code is incorrect, expired (>10 mins), or already consumed.

---

### 3.8 Forgot Password

- **Endpoint**: `POST /auth/forgot-password`
- **Auth Required**: No
- **Rate Limit**: 5 requests / 10 mins

#### Request Payload
```json
{
  "email": "ramesh@example.com"
}
```

#### Success Response (`200 OK`)
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

### 3.9 Reset Password

- **Endpoint**: `POST /auth/reset-password`
- **Auth Required**: No

#### Request Payload
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `email` | String | Yes | User email address |
| `token` | String | Yes | 64-char reset token from email link OR 6-digit OTP |
| `newPassword` | String | Yes | Min 8 chars, 1 letter, 1 number |

```json
{
  "email": "ramesh@example.com",
  "token": "3a8bc827d091e7fb10486bc9...",
  "newPassword": "NewStrongPassword456"
}
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "Password reset successful. You may now login with your new password."
  }
}
```

#### Error Responses
- `400 Bad Request` (`INVALID_RESET_TOKEN`): Token or OTP is expired, invalid, or already used.

---

### 3.10 Fetch Authenticated User Session

- **Endpoint**: `GET /auth/me`
- **Auth Required**: Yes (`Authorization: Bearer <accessToken>`)

#### Success Response (`200 OK`)
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
      "createdAt": "2026-08-28T16:30:00.000Z",
      "updatedAt": "2026-08-28T16:35:00.000Z"
    }
  }
}
```

---

## 4. Frontend Integration Flows & Rules

### Flow 1: Registration & Role Selection
1. The registration UI provides a role selection tab or dropdown: **Farmer** (`FARMER`) or **Mandi Operator** (`MANDI_OPERATOR`).
2. User submits registration details to `POST /auth/register` (or `/user/farmer` / `/user/mandi`).
3. Backend creates account with `isVerified: false` and emails a 6-digit OTP.
4. Frontend prompts user with the OTP verification screen.

---

### Flow 2: Account OTP Verification
1. User enters the 6-digit code received via email.
2. Frontend submits `POST /auth/verify-otp` with `{ identifier, code, type: "EMAIL_VERIFICATION" }`.
3. Upon `200 OK` (`isVerified: true`), frontend directs user to `/login` or logs them into their role-specific dashboard.

---

### Flow 3: Login & Role-Based Navigation
1. User enters identifier (email/phone) and password.
2. If the user is unverified, backend responds with `403 Forbidden` (`code: "ACCOUNT_NOT_VERIFIED"`). Frontend should capture this and route to `/verify-otp?email=...`.
3. On `200 OK`, frontend saves `accessToken` and `refreshToken` and redirects according to `user.role`:
   - If `role === "FARMER"` ➔ navigate to `/farmer/dashboard`
   - If `role === "MANDI_OPERATOR"` ➔ navigate to `/mandi/dashboard`

---

### Flow 4: Auto-Refresh Interceptor Handling
1. Every API call includes `Authorization: Bearer <accessToken>`.
2. When the backend returns `401 Unauthorized` (`code: "TOKEN_EXPIRED_OR_INVALID"`):
   - Frontend pauses pending requests.
   - Dispatches `POST /auth/refresh` with `{ refreshToken }`.
   - On success, updates stored tokens and retries original request.
   - On failure (`REFRESH_TOKEN_EXPIRED` or `TOKEN_REUSE_DETECTED`), clears local storage and navigates to `/login`.

---

### Flow 5: Forgot / Reset Password
1. User enters email on `/forgot-password` ➔ calls `POST /auth/forgot-password`.
2. Email contains a reset link with query parameters `?token=<hexToken>&email=<email>` plus a 6-digit OTP.
3. User navigates to `/reset-password`, enters new password, and submits `POST /auth/reset-password`.
4. On `200 OK`, show success notification and redirect to `/login`.

---

## 5. Error Code Dictionary for Frontend UI

| Backend Error Code | HTTP Status | Suggested User-Facing UI Message |
| :--- | :---: | :--- |
| `VALIDATION_ERROR` | 400 | Please check the entered fields for errors. |
| `INVALID_OTP` | 400 | The OTP code entered is invalid or has expired. |
| `INVALID_RESET_TOKEN` | 400 | The password reset link or OTP has expired or already been used. |
| `INVALID_CREDENTIALS` | 401 | Incorrect email/phone or password. |
| `UNAUTHORIZED` | 401 | Your session has expired. Please login again. |
| `TOKEN_EXPIRED_OR_INVALID` | 401 | Session token expired. Auto-refreshing... |
| `REFRESH_TOKEN_EXPIRED` | 401 | Your session has expired. Please login again. |
| `TOKEN_REUSE_DETECTED` | 401 | Security alert: session invalidated. Please login again. |
| `ACCOUNT_NOT_VERIFIED` | 403 | Your account is not verified yet. Please enter the OTP sent to your email. |
| `FORBIDDEN_ROLE` | 403 | You do not have permission to access this page. |
| `EMAIL_EXISTS` | 409 | An account with this email address already exists. |
| `PHONE_EXISTS` | 409 | An account with this phone number already exists. |
| `TOO_MANY_REQUESTS` | 429 | Too many attempts. Please wait a few minutes before trying again. |
| `INTERNAL_SERVER_ERROR` | 500 | An unexpected server error occurred. Please try again later. |
