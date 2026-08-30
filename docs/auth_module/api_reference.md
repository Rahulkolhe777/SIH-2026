# Authentication Module — API Reference

Base URL: `http://localhost:4000/api/v1`

---

## 1. Summary of Endpoints

| Method | Endpoint | Description | Auth Required | Rate Limited |
| :--- | :--- | :--- | :---: | :---: |
| `POST` | `/auth/register` | Unified user registration (`FARMER` or `MANDI_OPERATOR`) | No | Yes (30/15m) |
| `POST` | `/user/farmer` | Dedicated Farmer registration endpoint | No | Yes (30/15m) |
| `POST` | `/user/mandi` | Dedicated Mandi Operator registration endpoint | No | Yes (30/15m) |
| `POST` | `/auth/login` | Authenticate with email/phone & password | No | Yes (10/15m) |
| `POST` | `/auth/refresh` | Rotate and issue new access & refresh tokens | No | No |
| `POST` | `/auth/logout` | Revoke active refresh token session | No | No |
| `POST` | `/auth/send-otp` | Trigger verification or login OTP via email | No | Yes (5/10m) |
| `POST` | `/auth/verify-otp` | Verify 6-digit OTP code & activate account | No | No |
| `POST` | `/auth/forgot-password` | Initiate password recovery email link + OTP | No | Yes (5/10m) |
| `POST` | `/auth/reset-password` | Set new password with reset token or OTP | No | No |
| `GET` | `/auth/me` | Fetch authenticated user profile | Bearer Token | No |
| `GET` | `/farmer/profile` | Fetch complete farmer profile, address, & crop info | Bearer Token (FARMER) | No |
| `PUT` | `/farmer/profile` | Update farmer name, address with pincode, and crops | Bearer Token (FARMER) | No |
| `GET` | `/farmer/dashboard` | Farmer protected dashboard (RBAC) | Bearer Token (FARMER) | No |
| `GET` | `/mandi/dashboard` | Mandi Operator protected dashboard (RBAC) | Bearer Token (MANDI_OPERATOR) | No |

---

## 2. Detailed Endpoints

### 2.1 Unified Registration: `POST /auth/register`

Creates a new account as either a `FARMER` or `MANDI_OPERATOR`. Automatically sends an email verification OTP.

**Request Body:**
```json
{
  "name": "Ramesh Kumar",
  "email": "ramesh@example.com",
  "phone": "+919876543210",
  "password": "SecurePassword123",
  "role": "FARMER"
}
```
*Note: `phone` is optional. `role` accepts `"FARMER" | "MANDI_OPERATOR"`. Password requires at least 8 characters with letters and numbers.*

**Response (`201 Created`):**
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

---

### 2.2 Dedicated Role Registration: `POST /user/farmer` & `POST /user/mandi`

Convenient role-specific endpoints where the role is determined by the route.

**Request Body (`POST /user/farmer`):**
```json
{
  "name": "Ramesh Kumar",
  "email": "ramesh@example.com",
  "phone": "+919876543210",
  "password": "SecurePassword123"
}
```

**Request Body (`POST /user/mandi`):**
```json
{
  "name": "Suresh APMC",
  "email": "suresh@apmc.org",
  "phone": "+919876543211",
  "password": "SecurePassword123"
}
```

---

### 2.3 User Login: `POST /auth/login`

Authenticates via email or phone with password.

**Request Body:**
```json
{
  "identifier": "ramesh@example.com",
  "password": "SecurePassword123"
}
```
*Note: `identifier` can be either the user's email address or phone number.*

**Response (`200 OK`):**
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

**Unverified Account Response (`403 Forbidden`):**
```json
{
  "success": false,
  "message": "Your account is not verified. Please verify your email with the OTP sent during registration.",
  "code": "ACCOUNT_NOT_VERIFIED"
}
```

---

### 2.4 Token Refresh: `POST /auth/refresh`

Exchanges a valid refresh token for a fresh `accessToken` and rotated `refreshToken`.

**Request Body:**
```json
{
  "refreshToken": "4a7f9b8c0e2d1f4a9b8c0e2d1f..."
}
```

**Response (`200 OK`):**
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

### 2.5 Logout: `POST /auth/logout`

Revokes the active refresh token.

**Request Body:**
```json
{
  "refreshToken": "4a7f9b8c0e2d1f4a9b8c0e2d1f..."
}
```

**Response (`200 OK`):**
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

### 2.6 Send / Resend OTP: `POST /auth/send-otp`

Sends or resends a 6-digit OTP code (10-minute validity).

**Request Body:**
```json
{
  "identifier": "ramesh@example.com",
  "type": "EMAIL_VERIFICATION"
}
```
*`type` options: `"EMAIL_VERIFICATION" | "LOGIN_OTP" | "PASSWORD_RESET"`*

**Response (`200 OK`):**
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

### 2.7 Verify OTP: `POST /auth/verify-otp`

Verifies the 6-digit OTP. If `EMAIL_VERIFICATION`, automatically sets `isVerified: true` on the account.

**Request Body:**
```json
{
  "identifier": "ramesh@example.com",
  "code": "482915",
  "type": "EMAIL_VERIFICATION"
}
```

**Response (`200 OK`):**
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

### 2.8 Forgot Password: `POST /auth/forgot-password`

Sends an email with a secure password reset link and a 6-digit OTP.

**Request Body:**
```json
{
  "email": "ramesh@example.com"
}
```

**Response (`200 OK`):**
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

### 2.9 Reset Password: `POST /auth/reset-password`

Consumes the reset token (or OTP) and updates the account password. Automatically invalidates all active sessions for that account.

**Request Body:**
```json
{
  "email": "ramesh@example.com",
  "token": "3a8bc827d091e7fb10486bc9...",
  "newPassword": "NewStrongPassword456"
}
```

**Response (`200 OK`):**
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

### 2.10 Current User Profile: `GET /auth/me`

Fetches authenticated user information.

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response (`200 OK`):**
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

### 2.12 Get Farmer Profile: `GET /farmer/profile`

Fetches the complete profile, detailed address, and crop records for the authenticated farmer.

**Headers:**
- `Authorization: Bearer <ACCESS_TOKEN>` (Role: `FARMER`)

**Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Farmer profile retrieved successfully.",
  "data": {
    "id": "cm7xyz1230000abc",
    "name": "Ramesh Kumar",
    "email": "ramesh@example.com",
    "phone": "+919876543210",
    "role": "FARMER",
    "isVerified": true,
    "createdAt": "2026-08-28T16:30:00.000Z",
    "updatedAt": "2026-08-28T16:35:00.000Z",
    "farmerProfile": {
      "id": "fp_cm7xyz123",
      "userId": "cm7xyz1230000abc",
      "addressLine1": "Plot 12, Kisan Nagar",
      "addressLine2": "Near APMC Market",
      "village": "Lasalgaon",
      "taluka": "Niphad",
      "district": "Nashik",
      "state": "Maharashtra",
      "pincode": "422306",
      "landSizeAcres": 5.5,
      "mainCrops": ["Onion", "Tomato", "Wheat"],
      "secondaryCrops": ["Gram", "Soybean"],
      "irrigationType": "Drip Irrigation",
      "farmLocation": "Farm Gate 1",
      "createdAt": "2026-08-28T16:30:00.000Z",
      "updatedAt": "2026-08-28T16:35:00.000Z"
    }
  }
}
```

---

### 2.13 Update Farmer Profile: `PUT /farmer/profile` (or `PATCH`)

Updates the farmer's personal information (name, phone), detailed address with 6-digit pincode, and agricultural details (crops, land size, irrigation).

**Headers:**
- `Authorization: Bearer <ACCESS_TOKEN>` (Role: `FARMER`)

**Request Body:**
```json
{
  "name": "Ramesh Jagtap",
  "phone": "+919876543210",
  "addressLine1": "Plot 12, Kisan Nagar",
  "addressLine2": "Near APMC Market",
  "village": "Lasalgaon",
  "taluka": "Niphad",
  "district": "Nashik",
  "state": "Maharashtra",
  "pincode": "422306",
  "landSizeAcres": 6.5,
  "mainCrops": ["Onion", "Tomato", "Soybean"],
  "secondaryCrops": ["Gram"],
  "irrigationType": "Drip Irrigation",
  "farmLocation": "Farm Gate 1"
}
```
*Note: All fields are optional. `pincode` must be exactly 6 digits if provided.*

**Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Farmer profile updated successfully.",
  "data": { ... }
}
```

---

## 3. Standard Error Response Format

All error responses adhere to the following schema:

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

### Common Error Codes

| Error Code | HTTP Status | Description |
| :--- | :---: | :--- |
| `VALIDATION_ERROR` | 400 | Invalid payload fields (details in `errors` array). |
| `INVALID_CREDENTIALS` | 401 | Incorrect email/phone or password. |
| `UNAUTHORIZED` | 401 | Missing or malformed Bearer token. |
| `TOKEN_EXPIRED_OR_INVALID` | 401 | Access token expired. Refresh required. |
| `INVALID_REFRESH_TOKEN` | 401 | Invalid or non-existent refresh token. |
| `TOKEN_REUSE_DETECTED` | 401 | Stolen/revoked refresh token re-submitted. |
| `FORBIDDEN_ROLE` | 403 | User role is not permitted to access this resource. |
| `ACCOUNT_NOT_VERIFIED` | 403 | Action requires verified email/phone account. |
| `EMAIL_EXISTS` | 409 | Account with this email already exists. |
| `PHONE_EXISTS` | 409 | Account with this phone number already exists. |
| `INVALID_OTP` | 400 | OTP code is wrong, expired, or already used. |
| `INVALID_RESET_TOKEN` | 400 | Reset token is wrong, expired, or already used. |
| `TOO_MANY_REQUESTS` | 429 | Rate limit exceeded. |
