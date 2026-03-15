# Authentication & Authorization Flow

> Complete reference for how authentication, authorization, token lifecycle, and security works in this backend.  
> This document is essential for building both admin and user panel authentication layers.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Registration](#2-registration)
3. [Login & Account Lockout](#3-login--account-lockout)
4. [Token Lifecycle](#4-token-lifecycle)
5. [Token Refresh & Rotation](#5-token-refresh--rotation)
6. [Logout & Token Blacklisting](#6-logout--token-blacklisting)
7. [Password Reset Flow](#7-password-reset-flow)
8. [Email Verification Flow](#8-email-verification-flow)
9. [Email Change Flow](#9-email-change-flow)
10. [Password Change](#10-password-change)
11. [Authorization: Roles & Permissions](#11-authorization-roles--permissions)
12. [Auth Middleware Pipeline](#12-auth-middleware-pipeline)
13. [Rate Limiting](#13-rate-limiting)
14. [Idempotency](#14-idempotency)
15. [Security Summary](#15-security-summary)
16. [Frontend Implementation Guide](#16-frontend-implementation-guide)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Frontend)                        │
│  Stores: accessToken (memory), refreshToken (httpOnly cookie    │
│  or secure storage)                                             │
└─────────────┬───────────────────────────────────────────────────┘
              │
              │  Authorization: Bearer <accessToken>
              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Express Middleware Stack                     │
│                                                                 │
│  1. Rate Limiter (per route group)                              │
│  2. authRequired (JWT verify + blacklist check)                 │
│  3. requireRole / requireAnyRole (role gate)                    │
│  4. checkPermission (granular permission gate)                  │
│  5. validate (Zod/Joi schema validation)                        │
│  6. idempotency (optional, for mutation endpoints)              │
│  7. audit (logs write operations)                               │
└─────────────────────────────────────────────────────────────────┘
```

**Token types:**

| Token | Format | Storage | Lifetime | Purpose |
|-------|--------|---------|----------|---------|
| Access Token | JWT (HS256) | Client memory | 15 minutes | API authentication |
| Refresh Token | Opaque hex (80 chars) | MongoDB (hashed) | 7 days | Access token renewal |
| Password Reset Token | Opaque hex (80 chars) | MongoDB (hashed) | 1 hour | Password reset link |
| Email Token | Opaque hex (80 chars) | MongoDB (hashed) | 24 hours | Email verify / change |

---

## 2. Registration

### Endpoint: `POST /api/auth/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Validation (Zod):**
- `name` — string, min 2 characters, required
- `email` — valid email format, required
- `password` — string, min 6 characters, required

**Flow:**
```
1. Normalize email → trim + lowercase
2. Check if email exists → 409 EMAIL_IN_USE
3. Check if any admin exists in the database
   ├── No admins exist → assign roles: ["admin"]   (first-user bootstrap)
   └── Admins exist    → assign roles: ["customer"]
4. Create user document
   ├── Password is hashed via pre-save hook (bcrypt, 10 salt rounds)
   └── isVerified: false, isActive: true
5. Return public user object (NO tokens returned)
```

**Response (201):**
```json
{
  "user": {
    "id": "MongoDB ObjectId",
    "name": "John Doe",
    "email": "john@example.com",
    "roles": ["customer"],
    "permissions": [],
    "isActive": true,
    "isVerified": false
  }
}
```

**Important:** Registration does NOT return tokens. The user must call the login endpoint separately to receive access and refresh tokens.

---

## 3. Login & Account Lockout

### Endpoint: `POST /api/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Flow:**
```
1. Normalize email → trim + lowercase
2. Find user by email (with +password selection)
   └── Not found → 401 INVALID_CREDENTIALS
3. Check account lockout
   └── lockUntil > now → 401 INVALID_CREDENTIALS (locked)
4. Compare password (bcrypt)
   ├── WRONG:
   │   ├── Increment failedLoginAttempts
   │   ├── If failedLoginAttempts >= MAX_LOGIN_ATTEMPTS (default: 5)
   │   │   ├── Set lockUntil = now + LOCK_TIME_MS (default: 15 minutes)
   │   │   └── Reset failedLoginAttempts to 0
   │   └── Throw 401 INVALID_CREDENTIALS
   │
   └── CORRECT:
       ├── Reset failedLoginAttempts to 0
       ├── Clear lockUntil
       ├── Generate JWT access token (15 min)
       ├── Generate opaque refresh token (7 days, stored hashed)
       └── Return { token, refreshToken, user }
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "a1b2c3d4e5...80-hex-characters",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "roles": ["customer"],
    "permissions": [],
    "isActive": true,
    "isVerified": false
  }
}
```

### Lockout Parameters

| Setting | Default | Environment Variable |
|---------|---------|---------------------|
| Max failed attempts | 5 | `MAX_LOGIN_ATTEMPTS` |
| Lock duration | 15 minutes | `LOCK_TIME_MS` (in milliseconds: 900000) |

**Note:** The lockout does not tell the client the account is locked — it returns the same `INVALID_CREDENTIALS` error to prevent enumeration.

---

## 4. Token Lifecycle

### Access Token (JWT)

**Structure:**
```json
{
  "sub": "user-mongodb-objectid",
  "email": "john@example.com",
  "name": "John Doe",
  "roles": ["customer"],
  "permissions": [],
  "iss": "ecombackend",
  "aud": "ecombackend-api",
  "iat": 1711000000,
  "exp": 1711000900
}
```

**Configuration:**

| Setting | Value | Env Variable |
|---------|-------|--------------|
| Algorithm | HS256 | — |
| Secret | Required | `JWT_SECRET` |
| Expiry | 15 minutes | `JWT_EXPIRES_IN` |
| Issuer | App name or `"ecombackend"` | `APP_NAME` |
| Audience | `"ecombackend-api"` | — |

**Important:** The JWT payload contains `roles` and `permissions` at issuance time. If an admin changes a user's permissions, the user must re-login or refresh their token to get updated claims.

### Refresh Token (Opaque)

- Format: 80-character hexadecimal string (`crypto.randomBytes(40).toString('hex')`)
- Storage: SHA-256 hash stored in MongoDB `RefreshToken` collection
- TTL: MongoDB TTL index auto-deletes expired documents
- Fields tracked: `user`, `tokenHash`, `createdByIp`, `revokedAt`, `revokedByIp`, `replacedByToken`, `expiresAt`

---

## 5. Token Refresh & Rotation

### Endpoint: `POST /api/auth/refresh`

**Request:**
```json
{
  "refreshToken": "a1b2c3d4e5...80-hex-chars"
}
```

**Flow:**
```
1. Hash the incoming raw token (SHA-256)
2. Find RefreshToken document by hash
   └── Check: exists + not revoked + not expired → else 401
3. Look up the user
   └── Not found → 401
4. Create a NEW refresh token for the user
5. Revoke the OLD refresh token:
   ├── Set revokedAt = now
   ├── Set revokedByIp = request IP
   └── Set replacedByToken = new token hash (chain tracking)
6. Issue a new JWT access token
7. Return { token, refreshToken, user }
```

**Response (200):**
```json
{
  "token": "new-jwt-access-token",
  "refreshToken": "new-80-hex-char-refresh-token",
  "user": { ... }
}
```

**Key behaviors:**
- **Rotation:** Each refresh call invalidates the old token and creates a new one
- **Single use:** A refresh token can only be used once
- **Chain tracking:** `replacedByToken` links old → new for forensic analysis
- **Replay detection:** If a revoked token is presented, it returns 401

---

## 6. Logout & Token Blacklisting

### Endpoint: `POST /api/auth/logout`

**Request:**
```json
{
  "refreshToken": "a1b2c3d4e5...80-hex-chars"
}
```

**Note:** The `Authorization: Bearer <token>` header is **optional** on this endpoint — the route does NOT use `authRequired` middleware.

**Flow:**
```
1. Revoke the refresh token in MongoDB
   ├── Set revokedAt = now
   └── Set revokedByIp = request IP
2. If Authorization header is present:
   ├── Extract the access JWT
   ├── Get token key (jti claim or raw token string)
   ├── Blacklist the access token until its expiry time
   └── Store in TokenBlacklist collection with: token, reason="logout", user, expiresAt
3. Return { success: true }
```

**Token Blacklist:**
- Model: `TokenBlacklist` with fields: `token` (unique), `reason`, `user`, `expiresAt`
- TTL index on `expiresAt` — MongoDB auto-cleans expired entries
- On every authenticated request, `authRequired` middleware checks: `isTokenBlacklisted(tokenKey)`

**Response (200):**
```json
{ "success": true }
```

---

## 7. Password Reset Flow

### Step 1: Request Reset

**Endpoint:** `POST /api/auth/password/forgot`

**Request:**
```json
{
  "email": "john@example.com",
  "baseUrl": "https://mystore.com"
}
```

**Flow:**
```
1. Find user by email
   └── Not found → still return success (anti-enumeration)
2. Generate random token (40 bytes → 80 hex chars)
3. Store SHA-256 hash in PasswordResetToken collection
   └── Expiry: PASSWORD_RESET_EXPIRES_IN (default: 1 hour)
4. Send email with link: {baseUrl}/reset-password?token={rawToken}
5. Return { success: true }
```

**Response (200):**
```json
{ "success": true }
```

### Step 2: Reset Password

**Endpoint:** `POST /api/auth/password/reset`

**Request:**
```json
{
  "token": "raw-80-hex-char-token-from-email-link",
  "password": "newSecurePassword123"
}
```

**Flow:**
```
1. Hash the incoming token (SHA-256)
2. Find PasswordResetToken by hash
   └── Check: exists + not used + not expired → else 401
3. Find the user, set new password
   └── Pre-save hook re-hashes with bcrypt
4. Mark token as used (set usedAt)
5. Revoke ALL active refresh tokens for this user
   └── Prevents all existing sessions from continuing
6. Return { success: true }
```

**Response (200):**
```json
{ "success": true }
```

**Security:** After a password reset, ALL sessions (refresh tokens) are invalidated. The user must log in again.

---

## 8. Email Verification Flow

### Step 1: Request Verification Email

**Endpoint:** `POST /api/auth/email/verify/request`  
**Auth:** Required (must be logged in)

**Request:**
```json
{
  "baseUrl": "https://mystore.com"
}
```

**Flow:**
```
1. Generate random token (40 bytes → 80 hex chars)
2. Store in EmailToken collection (expires: 24 hours)
3. Send verification email with link: {baseUrl}/verify-email?token={rawToken}
4. Return { success: true }
```

### Step 2: Verify Email

**Endpoint:** `POST /api/auth/email/verify`  
**Auth:** Not required

**Request:**
```json
{
  "token": "raw-80-hex-char-token-from-email"
}
```

**Flow:**
```
1. Hash token, find EmailToken, validate (not used, not expired)
2. If token has NO newEmail field:
   └── Set user.isVerified = true (standard verification)
3. If token HAS newEmail field:
   └── Change user.email to newEmail AND set isVerified = true
4. Mark token as used
5. Return { success: true }
```

---

## 9. Email Change Flow

### Step 1: Request Email Change

**Endpoint:** `POST /api/auth/email/change/request`  
**Auth:** Required

**Request:**
```json
{
  "newEmail": "newemail@example.com",
  "baseUrl": "https://mystore.com"
}
```

**Flow:**
```
1. Check newEmail is not already in use → 409 EMAIL_IN_USE
2. Generate token, store in EmailToken with newEmail field
3. Send verification email to the NEW email address
4. Return { success: true }
```

### Step 2: Verify (Same endpoint as email verification)

**Endpoint:** `POST /api/auth/email/verify`

Uses the same endpoint — the backend detects the `newEmail` field on the token and applies the email change.

---

## 10. Password Change

### Endpoint: `POST /api/auth/password/change`
**Auth:** Required

**Request:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Flow:**
```
1. Find user (with +password selected)
2. Compare currentPassword with stored hash
   └── Wrong → 401 INVALID_CREDENTIALS
3. Set user.password = newPassword
   └── Pre-save hook re-hashes with bcrypt
4. Save user
5. Return { success: true }
```

**Note:** This does NOT invalidate existing sessions. If you want to force re-login after password change, the frontend should also call the logout endpoint.

---

## 11. Authorization: Roles & Permissions

### Roles

```
admin              → Full access to everything, bypasses all permission checks
customer           → Default role for registered users
warehouse_manager  → Access to inventory module endpoints
ops_admin          → Access to inventory/operations endpoints
support            → Customer support staff
```

### How Permission Checks Work

```
Request arrives
    │
    ▼
authRequired middleware
    │ Verifies JWT, extracts roles + permissions into req.user
    ▼
checkPermission('product:create') middleware
    │
    ├── Is user an admin? → YES → Allow (bypass)
    │
    └── Does user.permissions include 'product:create'? 
        ├── YES → Allow
        └── NO  → 403 Forbidden
```

**Permissions are free-form strings** — not an enum. They are stored in the `User.permissions` array and embedded in the JWT payload at login/refresh time.

### Role-Based Route Access

| Route Group | Required Role(s) |
|-------------|------------------|
| `/api/admin/*` | `admin` (checked per-endpoint via `requireRole` or `checkPermission`) |
| `/api/inventory/*` | `admin` OR `warehouse_manager` OR `ops_admin` (via `requireAnyRole`) |
| `/api/auth/*` | No role required (public / authenticated) |
| `/api/products/*` (public) | No role required |
| `/api/cart/*` | Authenticated (any role) |
| `/api/orders/*` | Authenticated (any role) |
| `/api/shipping/zones|methods` (write) | `admin` |
| `/api/uploads/*` | `admin` |

### Permission Reference (38 permissions)

| Category | Permission Strings |
|----------|-------------------|
| **Catalog** | `product:create`, `product:edit`, `product:delete`, `category:create`, `category:edit`, `category:delete`, `category:restore`, `brand:create`, `brand:edit`, `brand:delete` |
| **Inventory** | `inventory:manage`, `inventory:location:view`, `inventory:location:create`, `inventory:location:edit`, `inventory:location:delete`, `inventory:transfer:view`, `inventory:transfer:create`, `inventory:transfer:edit`, `inventory:transfer:delete`, `inventory:ledger:view` |
| **Orders** | `order:view`, `order:create`, `order:manage`, `orders:timeline:write` |
| **Coupons** | `coupon:view`, `coupon:create`, `coupon:edit`, `coupon:delete` |
| **Reviews** | `review:moderate`, `review:delete` |
| **Returns** | `return:view`, `return:manage` |
| **Shipments** | `shipment:view`, `shipment:create`, `shipment:edit` |
| **Users** | `user:view`, `user:edit`, `user:manage` |
| **Uploads** | `upload:create`, `upload:delete` |
| **Payments** | `payments:events:view`, `payments:refund` |
| **Audit** | `audit:view` |
| **Reports** | `report:view` |

---

## 12. Auth Middleware Pipeline

### `authRequired(req, res, next)`

```
1. Check Authorization header exists and starts with "Bearer "
   └── Missing → 401 AUTH_HEADER_MISSING

2. Extract token from header (substring after "Bearer ")

3. Verify JWT:
   ├── Algorithm: HS256
   ├── Secret: JWT_SECRET
   ├── Issuer: APP_NAME or "ecombackend"
   ├── Audience: "ecombackend-api"
   └── Checks: signature, expiry, claims
   └── Invalid → 401 TOKEN_INVALID

4. Check token blacklist:
   ├── Key: payload.jti (if exists) or raw token string
   └── Blacklisted → 401 TOKEN_INVALID

5. Attach to request:
   req.user = {
     sub: "user-id",
     email: "user@example.com",
     name: "User Name",
     roles: ["customer"],
     permissions: ["product:view"],
     iat: 1711000000,
     exp: 1711000900
   }
```

### `requireRole(role)`
```
1. Check req.user exists → 401
2. Check req.user.roles includes the required role → 403
```

### `requireAnyRole(roles[])`
```
1. Check req.user exists → 401
2. Check req.user.roles has at least one overlap with required roles → 403
```

### `checkPermission(permission)`
```
1. Check req.user exists → 401
2. If admin role → allow (bypass all checks)
3. Check req.user.permissions includes the permission → 403
```

---

## 13. Rate Limiting

Rate limits are applied per IP address using `express-rate-limit`.

| Route Group | Window | Max Requests | Notes |
|-------------|--------|-------------|-------|
| `/api/*` (global) | 15 minutes | 200 | Applies to all API routes |
| `/api/auth/*` | 1 minute | 20 | Tighter limit for auth endpoints |
| `/api/uploads/*` | 5 minutes | 50 | File upload limit |
| `/api/payments/*` | 5 minutes | 50 | Payment endpoint limit |
| `/api/admin/*` | 15 minutes | ~67 | Calculated as `max(30, RATE_LIMIT_MAX / 3)` |

**Response when rate limited (429):**
```json
{
  "error": "Too many requests, please try again later."
}
```

**Frontend handling:** Implement exponential backoff or show a "Please wait" message when receiving 429.

---

## 14. Idempotency

The backend supports **idempotency keys** for mutation endpoints (POST, PUT, PATCH, DELETE) to prevent duplicate operations.

### How to Use

Send the header:
```
Idempotency-Key: unique-uuid-or-string
```
or
```
X-Idempotency-Key: unique-uuid-or-string
```

### Behavior

| Scenario | Result |
|----------|--------|
| First request with key | Normal processing |
| Duplicate key (same method + path + user) | `409 Conflict` |
| No idempotency key | Normal processing (optional) |
| Key longer than 256 chars | `400 Bad Request` |

### When to Use

- **Return approvals** — `POST /admin/returns/:id/approve` (prevents double refunds)
- **Order placement** — checkout operations
- **Payment operations** — any Stripe-related mutations
- **Stock adjustments** — inventory changes

---

## 15. Security Summary

| Feature | Implementation |
|---------|---------------|
| Password hashing | bcrypt (10 salt rounds) |
| JWT algorithm | HS256 |
| Token storage | Access: client memory; Refresh: server-side (hashed) |
| Token rotation | Refresh tokens are single-use with rotation |
| Token blacklisting | Access tokens blacklisted on logout (TTL auto-cleanup) |
| Account lockout | 5 failed attempts → 15 min lock |
| Anti-enumeration | Password reset always returns success |
| Input validation | Zod schemas on all endpoints |
| Rate limiting | Per-route group with configurable windows |
| Audit logging | All write operations on admin/sensitive routes |
| Field redaction | Passwords, tokens, secrets redacted in audit logs |
| CORS | Configurable via `CORS_ORIGINS` environment variable |
| Helmet | Security headers via `helmet` middleware |
| Request ID | UUID per request via `express-request-id` |

---

## 16. Frontend Implementation Guide

### Token Management Pattern

```javascript
// Recommended: Store tokens
let accessToken = null;  // In memory (NOT localStorage for security)
let refreshToken = null; // In memory or httpOnly cookie

// API call with auto-refresh
async function apiCall(method, url, body) {
  let response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: body ? JSON.stringify(body) : undefined
  });

  // If 401 and we have a refresh token, try to refresh
  if (response.status === 401 && refreshToken) {
    const refreshResponse = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      accessToken = data.token;
      refreshToken = data.refreshToken;

      // Retry original request with new token
      response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: body ? JSON.stringify(body) : undefined
      });
    } else {
      // Refresh failed → force re-login
      accessToken = null;
      refreshToken = null;
      window.location.href = '/login';
    }
  }

  return response;
}
```

### Login Flow

```javascript
async function login(email, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (res.ok) {
    const { token, refreshToken: rt, user } = await res.json();
    accessToken = token;
    refreshToken = rt;
    // Store user info, redirect based on roles
    if (user.roles.includes('admin')) {
      // → Admin panel
    } else {
      // → User panel
    }
  } else {
    const err = await res.json();
    // Show error (INVALID_CREDENTIALS, rate limited, etc.)
  }
}
```

### Logout Flow

```javascript
async function logout() {
  await fetch('/api/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`  // Optional but recommended
    },
    body: JSON.stringify({ refreshToken })
  });
  accessToken = null;
  refreshToken = null;
  window.location.href = '/login';
}
```

### Role-Based UI Rendering

```javascript
// After login, use user.roles to determine which panel to show
const user = loginResponse.user;

const isAdmin = user.roles.includes('admin');
const isWarehouse = user.roles.includes('warehouse_manager');
const isOpsAdmin = user.roles.includes('ops_admin');
const isSupport = user.roles.includes('support');

// Admin panel: full access
// Staff panels: check user.permissions for granular feature flags
const canManageProducts = isAdmin || user.permissions.includes('product:create');
const canViewOrders = isAdmin || user.permissions.includes('order:view');
const canManageInventory = isAdmin || isWarehouse || isOpsAdmin;
```

### Token Refresh Timer

```javascript
// Set up automatic refresh before token expires
function scheduleTokenRefresh(tokenExpiresInMs = 15 * 60 * 1000) {
  // Refresh 1 minute before expiry
  const refreshIn = tokenExpiresInMs - 60 * 1000;
  setTimeout(async () => {
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      if (res.ok) {
        const data = await res.json();
        accessToken = data.token;
        refreshToken = data.refreshToken;
        scheduleTokenRefresh(); // Schedule next refresh
      }
    } catch {
      // Network error → will retry on next API call
    }
  }, refreshIn);
}
```

---

## Error Codes Reference (Auth)

| Code | HTTP | Description |
|------|------|-------------|
| `AUTH_HEADER_MISSING` | 401 | No Authorization header or wrong format |
| `TOKEN_INVALID` | 401 | JWT expired, malformed, or blacklisted |
| `INVALID_CREDENTIALS` | 401 | Wrong email/password or account locked |
| `EMAIL_IN_USE` | 409 | Email already registered |
| `FORBIDDEN` | 403 | Missing required role or permission |
| `RATE_LIMIT` | 429 | Too many requests |
