# Authentication — Prompt

## Objective

Build a production-ready authentication system for two user roles:

1. **Farmer**
2. **Mandi Operator**

For the current version, both roles should have the **same registration and authentication flow**.

Do **not** implement Mandi onboarding, admin verification, or approval workflows at this stage.

The system should be secure, scalable, maintainable, and consistent with the existing project architecture.

---

## User Roles

### Farmer

A Farmer can:

* Register
* Login
* Logout
* Verify their account
* Reset their password
* Manage their basic profile
* Access Farmer-specific features

### Mandi Operator

A Mandi Operator can:

* Register
* Login
* Logout
* Verify their account
* Reset their password
* Manage their basic profile
* Access Mandi-specific features

For now, **Mandi Operators should not require any additional onboarding or administrator approval**.

---

# Authentication

Implement a shared authentication system with role-based access.

Support:

* Email + password
* Phone number + OTP/password, where supported by the existing architecture
* Registration
* Login
* Logout
* Account verification
* Forgot password
* Reset password
* Current-user/session endpoint

Do not create separate authentication systems for Farmers and Mandi Operators.

Use a common authentication layer and differentiate users using their role.

---

# Role-Based Access Control

Use role-based access control (RBAC).

At minimum:

```text
FARMER
MANDI_OPERATOR
ADMIN
```

The `ADMIN` role may exist in the data model for future functionality, but **do not implement admin verification or admin onboarding workflows yet**.

Users must only be able to access resources permitted for their role.

For example:

* A Farmer cannot access Mandi Operator management APIs.
* A Mandi Operator cannot access Farmer-only management APIs.
* A user cannot access another user's private resources.
* Frontend route protection must not be the only authorization mechanism.
* Authorization must also be enforced at the backend/API layer.

---

# Registration Flow

Both roles should use the same basic registration flow.

Example:

```text
Register
   ↓
Select account type
   ↓
Farmer / Mandi Operator ( with diffrent end points /user/farmer && /user/mandi )
   ↓
Enter registration details
   ↓
Create account
   ↓
Verify account if required
   ↓
Login / authenticated session
   ↓
Role-specific dashboard
```

The registration form should collect only the information currently required by the application.

Do not add unnecessary onboarding fields.

Do not require:

* Mandi documents
* Aadhaar verification
* Legal documents
* Admin approval
* Mandi verification
* Manual review

These can be introduced in a future version.

---

# Database

Use **PostgreSQL + Prisma**.

Design the user/authentication schema so that both roles are represented cleanly.

The schema should support:

* User identity
* Role
* Authentication credentials
* Account verification
* Sessions/tokens
* Password reset
* Created/updated timestamps

Example conceptual model:

```text
User
 ├── id
 ├── name
 ├── email
 ├── phone
 ├── passwordHash
 ├── role
 ├── isVerified
 ├── createdAt
 └── updatedAt
```

Adapt the model to the existing project architecture.

Use appropriate indexes and unique constraints.

Never store plaintext passwords.

---

# Security Requirements

Treat authentication as a production-critical system.

**Follow all existing production rules and security requirements.**

At minimum:

* Never store plaintext passwords.
* Use a secure password hashing algorithm.
* Never expose password hashes through APIs.
* Never expose authentication secrets to the frontend.
* Validate all authentication inputs.
* Protect authentication endpoints against abuse.
* Rate-limit login and OTP-related endpoints where appropriate.
* Use secure session/token handling.
* Give OTPs and reset tokens short expiration periods.
* Make password reset tokens single-use.
* Never log passwords, OTPs, tokens, or other sensitive credentials.
* Do not expose sensitive information in error messages.
* Prevent unauthorized access to other users' data.
* Follow least-privilege principles.
* Keep secrets in environment variables or the project's approved secret-management system.
* Do not commit secrets or credentials to Git.

Do not bypass security controls for convenience.

---

# API

Create a clean and reusable authentication API.

Example:

```text
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh
POST /auth/send-otp
POST /auth/verify-otp
POST /auth/forgot-password
POST /auth/reset-password

GET  /auth/me
```

Adapt route names to the existing backend conventions.

Authentication middleware should be reusable throughout the application.

---

# Frontend

Create a clean authentication experience for both roles.

### Farmer

```text
Register
Login
OTP/email verification
Forgot password
Reset password
Profile
```

### Mandi Operator

```text
Register
Login
OTP/email verification
Forgot password
Reset password
Profile
```

The registration experience should allow the user to select whether they are registering as a **Farmer** or **Mandi Operator**.

After successful authentication, redirect the user to the appropriate role-specific area of the application.

---

# Error Handling

Use consistent authentication error responses.

Handle cases such as:

* Invalid credentials
* Existing email/phone
* Invalid OTP
* Expired OTP
* Invalid reset token
* Expired reset token
* Unverified account
* Unauthorized request
* Forbidden request
* Invalid registration data

Do not reveal whether sensitive account information exists when doing so could create a security/privacy issue.

---

# Testing

Add appropriate tests for:

### Registration

* Farmer registration
* Mandi Operator registration
* Duplicate email
* Duplicate phone
* Invalid registration data
* Password validation

### Login

* Valid Farmer login
* Valid Mandi Operator login
* Invalid credentials
* Unverified account
* Session/token handling

### Authorization

* Farmer accessing Farmer resources
* Mandi Operator accessing Mandi resources
* Farmer being denied Mandi-only resources
* Mandi Operator being denied Farmer-only resources
* Unauthorized users being denied protected resources

### Account Recovery

* Forgot password
* Reset password
* Expired reset token
* Invalid reset token

---

# Implementation Rules

Before implementing:

1. Inspect the existing repository structure.
2. Understand the current frontend and backend architecture.
3. Reuse existing authentication utilities and conventions where possible.
4. Do not introduce unnecessary libraries.
5. Do not create duplicate authentication logic for each role.
6. Keep authentication and authorization modular.
7. Keep business logic separate from authentication infrastructure.
8. Use TypeScript consistently in the Node.js backend.
9. Use Prisma migrations for database changes.
10. Do not modify unrelated functionality.
11. Follow all existing project and production rules.

If the repository already has an authentication approach, **extend or improve it instead of replacing it unnecessarily**.

---

# Explicitly Out of Scope

Do **not** implement the following in this version:

* Mandi onboarding
* Mandi document verification
* Aadhaar verification workflow
* Legal document submission
* Admin approval
* Admin verification
* Mandi application review
* Mandi approval/rejection status
* Manual Mandi verification

These should be designed so they can be added later without requiring a major rewrite of the authentication system.

---

# Definition of Done

The authentication system is complete when:

* Farmers can register and login securely.
* Mandi Operators can register and login securely.
* Both roles use the same core authentication infrastructure.
* Users have a clearly defined role.
* Backend RBAC is implemented.
* Protected routes enforce authorization server-side.
* Account recovery works correctly.
* Authentication data is securely stored.
* Database migrations are created correctly.
* Relevant frontend authentication flows are implemented.
* Relevant tests are implemented and passing.
* No unrelated functionality is broken.
* No Mandi onboarding or admin verification has been implemented.
* The implementation follows all project and production rules.



for email use resend keep commiting at every stage and create branch for each module of my name 
rupesh/auth_module 

donnot write or change Frontend only write backend 

also well document them in 
./docs/auth_module/md file(s) with frontend integration for FE engineer 
