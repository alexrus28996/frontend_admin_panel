# User Panel API Reference

> All API endpoints needed for the **customer-facing frontend** (storefront / user panel).  
> Base URL: `http://localhost:4000/api`  
> All endpoints return JSON. Errors follow the standard `{ error: { message, code, details } }` format.

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [User Profile & Preferences](#2-user-profile--preferences)
3. [Addresses](#3-addresses)
4. [Product Browsing](#4-product-browsing)
5. [Categories](#5-categories)
6. [Brands](#6-brands)
7. [Product Reviews](#7-product-reviews)
8. [Shopping Cart](#8-shopping-cart)
9. [Checkout & Orders](#9-checkout--orders)
10. [Payments](#10-payments) 
11. [Wishlist](#11-wishlist)
12. [Notifications](#12-notifications)
13. [Shipping Rates](#13-shipping-rates)
14. [Permissions](#14-permissions)

---

## 1. Authentication

### POST `/auth/register`
Create a new user account.

**Auth:** None  
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```
**Response (201):**
```json
{
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "roles": ["customer"],
    "isActive": true,
    "isVerified": false,
    "createdAt": "2026-03-15T..."
  }
}
```

---

### POST `/auth/login`
Authenticate user and get JWT tokens.

**Auth:** None  
**Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```
**Response (200):**
```json
{
  "token": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "roles": ["customer"],
    "isActive": true,
    "isVerified": false
  }
}
```

**Error cases:**
- `INVALID_CREDENTIALS` (401) — Wrong email or password
- `USER_LOCKED` (423) — Too many failed attempts (locks for 15 min)
- `USER_INACTIVE` (403) — Account deactivated by admin

**Notes:**
- Access token expires in 15 minutes (configurable)
- Refresh token expires in 7 days (configurable)
- After 5 failed attempts, account locks for 15 minutes

---

### POST `/auth/refresh`
Rotate tokens — get a new access token and refresh token.

**Auth:** None  
**Body:**
```json
{
  "refreshToken": "eyJhbGci..."
}
```
**Response (200):**
```json
{
  "token": "new-access-token...",
  "refreshToken": "new-refresh-token...",
  "user": { ... }
}
```

**Notes:**
- Old refresh token is revoked after rotation
- If refresh token is expired or already used → `TOKEN_INVALID` (401)

---

### POST `/auth/logout`
Revoke the refresh token and blacklist the access token.

**Auth:** None  
**Body:**
```json
{
  "refreshToken": "eyJhbGci..."
}
```
**Response (200):**
```json
{ "success": true }
```

---

### GET `/auth/me`
Get the current authenticated user's profile.

**Auth:** Required (Bearer token)  
**Response (200):**
```json
{
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "roles": ["customer"],
    "permissions": [],
    "isActive": true,
    "isVerified": true,
    "preferences": {
      "locale": "en",
      "notifications": { "email": true, "sms": false, "push": true }
    }
  }
}
```

---

### PATCH `/auth/profile`
Update the current user's profile (name only).

**Auth:** Required  
**Body:**
```json
{
  "name": "John Updated"
}
```
**Response (200):**
```json
{ "user": { ... } }
```

---

### POST `/auth/password/forgot`
Request a password reset email.

**Auth:** None  
**Body:**
```json
{
  "email": "john@example.com",
  "baseUrl": "https://yoursite.com/reset-password"
}
```
**Response (200):**
```json
{ "success": true }
```
**Notes:** Always returns success (even if email not found) to prevent enumeration.

---

### POST `/auth/password/reset`
Reset password using the token from the email link.

**Auth:** None  
**Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "newSecurePassword456"
}
```
**Response (200):**
```json
{ "success": true }
```

---

### POST `/auth/password/change`
Change password while logged in.

**Auth:** Required  
**Body:**
```json
{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword456"
}
```
**Response (200):**
```json
{ "success": true }
```

---

### POST `/auth/email/verify/request`
Request an email verification link.

**Auth:** Required  
**Body:**
```json
{
  "baseUrl": "https://yoursite.com/verify-email"
}
```
**Response (200):**
```json
{ "success": true }
```

---

### POST `/auth/email/verify`
Verify email using the token from the verification link.

**Auth:** None  
**Body:**
```json
{
  "token": "verification-token-from-email"
}
```
**Response (200):**
```json
{ "success": true }
```

---

### POST `/auth/email/change/request`
Request to change email address. Sends verification to the new email.

**Auth:** Required  
**Body:**
```json
{
  "newEmail": "newemail@example.com",
  "baseUrl": "https://yoursite.com/verify-email"
}
```
**Response (200):**
```json
{ "success": true }
```

---

### GET `/auth/preferences`
Get current user's preferences.

**Auth:** Required  
**Response (200):**
```json
{
  "preferences": {
    "locale": "en",
    "notifications": {
      "email": true,
      "sms": false,
      "push": true
    }
  }
}
```

---

### PATCH `/auth/preferences`
Update user preferences.

**Auth:** Required  
**Body:**
```json
{
  "locale": "en",
  "notifications": {
    "email": true,
    "sms": true,
    "push": false
  }
}
```
**Response (200):**
```json
{
  "preferences": { ... }
}
```

---

## 2. User Profile & Preferences

All profile and preference endpoints are under the `/auth` namespace (see above). Summary:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/me` | GET | Get profile |
| `/auth/profile` | PATCH | Update name |
| `/auth/password/change` | POST | Change password |
| `/auth/email/change/request` | POST | Change email |
| `/auth/email/verify/request` | POST | Request email verification |
| `/auth/email/verify` | POST | Verify email |
| `/auth/preferences` | GET | Get preferences |
| `/auth/preferences` | PATCH | Update preferences |

---

## 3. Addresses

All address endpoints require authentication. Users can only access their own addresses.

### GET `/addresses`
List all user addresses.

**Auth:** Required  
**Query:** `type` — optional, filter by `'shipping'` or `'billing'`  
**Response (200):**
```json
{
  "items": [
    {
      "_id": "...",
      "type": "shipping",
      "fullName": "John Doe",
      "line1": "123 Main St",
      "line2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "US",
      "phone": "+1234567890",
      "label": "Home",
      "isDefault": true
    }
  ]
}
```

---

### POST `/addresses`
Create a new address.

**Auth:** Required  
**Body:**
```json
{
  "type": "shipping",
  "fullName": "John Doe",
  "line1": "123 Main St",
  "line2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "US",
  "phone": "+1234567890",
  "label": "Home",
  "isDefault": false
}
```
**Response (201):**
```json
{ "address": { ... } }
```

---

### GET `/addresses/:id`
Get single address by ID.

**Auth:** Required  
**Response (200):**
```json
{ "address": { ... } }
```

---

### PUT `/addresses/:id`
Update an address.

**Auth:** Required  
**Body:** Same structure as POST (all fields optional for update)  
**Response (200):**
```json
{ "address": { ... } }
```

---

### DELETE `/addresses/:id`
Delete an address.

**Auth:** Required  
**Response (200):**
```json
{ "result": { ... } }
```

---

### POST `/addresses/:id/default`
Set an address as the default for its type.

**Auth:** Required  
**Response (200):**
```json
{ "address": { ... } }
```

**Notes:** Only one address can be default per type (shipping/billing). Setting a new default unsets the previous.

---

## 4. Product Browsing

### GET `/products`
List/search products. **Public endpoint — no auth needed.**

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | — | Search by name/description (text search) |
| `category` | string | — | Filter by category ID |
| `visibility` | string | — | Filter by visibility (`'visible'`, `'hidden'`) |
| `hasVariants` | boolean | — | Filter by variant status |
| `limit` | number | 20 | Items per page (max 100) |
| `page` | number | 1 | Page number |

**Response (200):**
```json
{
  "items": [
    {
      "_id": "...",
      "name": "Premium T-Shirt",
      "slug": "premium-t-shirt",
      "description": "High quality cotton t-shirt",
      "price": 29.99,
      "compareAtPrice": 39.99,
      "currency": "USD",
      "images": [{ "url": "https://...", "alt": "T-shirt front" }],
      "category": "...",
      "brand": "...",
      "sku": "TSHIRT-001",
      "tags": ["cotton", "premium"],
      "ratingAvg": 4.5,
      "ratingCount": 23,
      "isActive": true,
      "hasVariants": true,
      "visibility": "visible"
    }
  ],
  "total": 150,
  "page": 1,
  "pages": 8
}
```

**Notes:**
- Only returns products where `deletedAt` is null and `isActive` is true
- Text search works on `name` and `description` fields

---

### GET `/products/:id`
Get single product with full details. **Public endpoint.**

**Response (200):**
```json
{
  "product": {
    "_id": "...",
    "name": "Premium T-Shirt",
    "slug": "premium-t-shirt",
    "description": "Short description",
    "longDescription": "Detailed HTML description...",
    "price": 29.99,
    "compareAtPrice": 39.99,
    "costPrice": null,
    "currency": "USD",
    "images": [{ "url": "...", "alt": "..." }],
    "attributes": { "material": "cotton", "fit": "regular" },
    "category": "...",
    "brand": "...",
    "sku": "TSHIRT-001",
    "barcode": "...",
    "tags": ["cotton"],
    "ratingAvg": 4.5,
    "ratingCount": 23,
    "requiresShipping": true,
    "weight": 0.3,
    "weightUnit": "kg",
    "dimensions": { "length": 30, "width": 20, "height": 5, "unit": "cm" },
    "hasVariants": true,
    "visibility": "visible",
    "metaTitle": "...",
    "metaDescription": "..."
  }
}
```

---

### GET `/products/:productId/attributes`
List product attributes with their options. **Public endpoint.**

**Response (200):**
```json
{
  "items": [
    {
      "_id": "...",
      "name": "Color",
      "slug": "color",
      "sortOrder": 0,
      "isRequired": true,
      "options": [
        { "_id": "...", "name": "Red", "slug": "red", "metadata": { "hex": "#FF0000" } },
        { "_id": "...", "name": "Blue", "slug": "blue", "metadata": { "hex": "#0000FF" } }
      ]
    },
    {
      "_id": "...",
      "name": "Size",
      "slug": "size",
      "options": [
        { "_id": "...", "name": "Small", "slug": "small" },
        { "_id": "...", "name": "Medium", "slug": "medium" },
        { "_id": "...", "name": "Large", "slug": "large" }
      ]
    }
  ]
}
```

---

### GET `/products/:productId/attributes/:attributeId/options`
List options for a specific attribute. **Public endpoint.**

**Response (200):**
```json
{
  "items": [
    { "_id": "...", "name": "Red", "slug": "red", "sortOrder": 0, "metadata": {} }
  ]
}
```

---

### GET `/products/:productId/variants-legacy`
List legacy variants for a product. **Public endpoint.**

**Response (200):**
```json
{
  "items": [
    {
      "_id": "...",
      "sku": "TSHIRT-RED-M",
      "price": 29.99,
      "stock": 50,
      "attributes": { "color": "Red", "size": "M" },
      "isActive": true,
      "attributeMap": { ... }
    }
  ]
}
```

---

### GET `/products/:productId/variants-legacy/:variantId`
Get single legacy variant. **Public endpoint.**

**Response (200):**
```json
{
  "variant": { ... }
}
```

---

## 5. Categories

### GET `/categories`
List categories. **Public endpoint.**

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | — | Search by name |
| `parent` | string | — | Filter by parent category ID |
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |

**Response (200):**
```json
{
  "items": [
    {
      "_id": "...",
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic devices and accessories",
      "parent": null,
      "sortOrder": 0,
      "isActive": true,
      "image": { "url": "...", "alt": "..." },
      "banner": { "url": "...", "alt": "..." },
      "icon": "laptop",
      "path": []
    }
  ],
  "total": 15,
  "page": 1,
  "pages": 1
}
```

---

### GET `/categories/:id`
Get single category. **Public endpoint.**

**Response (200):**
```json
{ "category": { ... } }
```

---

### GET `/categories/:id/children`
List child categories. **Public endpoint.**

**Query:** `page`, `limit`  
**Response (200):**
```json
{
  "items": [ ... ],
  "total": 5,
  "page": 1,
  "pages": 1
}
```

---

## 6. Brands

### GET `/brands`
List/search brands. **Public endpoint.**

**Query:** `q` (search), `page`, `limit`  
**Response (200):**
```json
{
  "items": [
    {
      "_id": "...",
      "name": "Nike",
      "slug": "nike",
      "logo": "https://...",
      "description": "Just do it"
    }
  ],
  "total": 10,
  "page": 1,
  "pages": 1
}
```

---

### GET `/brands/:id`
Get single brand. **Public endpoint.**

**Response (200):**
```json
{ "brand": { ... } }
```

---

## 7. Product Reviews

### GET `/products/:productId/reviews`
List approved reviews for a product. **Public endpoint.**

**Query:** `page`, `limit`  
**Response (200):**
```json
{
  "items": [
    {
      "_id": "...",
      "rating": 5,
      "comment": "Excellent quality!",
      "isApproved": true,
      "verifiedPurchase": true,
      "user": { "_id": "...", "name": "Jane Doe" },
      "createdAt": "2026-03-10T..."
    }
  ],
  "total": 23,
  "page": 1,
  "pages": 3
}
```

**Notes:** Only returns `isApproved: true` reviews.

---

### POST `/products/:productId/reviews`
Create or update your review for a product.

**Auth:** Required  
**Body:**
```json
{
  "rating": 5,
  "comment": "Great product! Highly recommended."
}
```
**Response (201):**
```json
{ "review": { ... } }
```

**Notes:**
- One review per user per product (enforced by unique index)
- Reviews require admin approval before they appear publicly (`isApproved: false` by default)
- If user already reviewed this product, the review is updated (upsert)

---

### DELETE `/products/:productId/reviews/:reviewId`
Delete your own review.

**Auth:** Required  
**Response (200):**
```json
{ "result": { ... } }
```

**Notes:** Users can only delete their own reviews (unless admin).

---

## 8. Shopping Cart

All cart endpoints require authentication. Each user has exactly one active cart.

### GET `/cart`
Get the current user's active cart (creates one if it doesn't exist).

**Auth:** Required  
**Response (200):**
```json
{
  "cart": {
    "_id": "...",
    "user": "...",
    "items": [
      {
        "product": "...",
        "variant": null,
        "sku": "TSHIRT-001",
        "name": "Premium T-Shirt",
        "price": 29.99,
        "currency": "USD",
        "quantity": 2,
        "attributes": {}
      }
    ],
    "subtotal": 59.98,
    "discount": 0,
    "couponCode": null,
    "total": 59.98,
    "currency": "USD",
    "status": "active"
  }
}
```

---

### POST `/cart/items`
Add an item to the cart.

**Auth:** Required  
**Body:**
```json
{
  "productId": "product-object-id",
  "variantId": "variant-object-id-or-null",
  "quantity": 2
}
```
**Response (201):**
```json
{ "cart": { ... } }
```

**Error cases:**
- `PRODUCT_NOT_FOUND` (404) — Product doesn't exist
- `PRODUCT_UNAVAILABLE` (400) — Product not active
- `INSUFFICIENT_STOCK` (400) — Not enough stock available

**Notes:**
- If the same product+variant is already in cart, quantity is incremented
- Stock is checked at add time (combined existing + new quantity)
- Price is snapshotted at add time from the product/variant
- For variants: uses `priceOverride` > `priceDelta` (added to product price) > product price
- Non-shippable products (digital) skip stock checks
- Any existing coupon is re-validated after modification

---

### PATCH `/cart/items/:productId`
Update item quantity.

**Auth:** Required  
**Body:**
```json
{
  "quantity": 3,
  "variantId": "variant-id-if-applicable"
}
```
**Response (200):**
```json
{ "cart": { ... } }
```

---

### DELETE `/cart/items/:productId`
Remove an item from the cart.

**Auth:** Required  
**Query:** `variantId` — optional, to specify which variant to remove  
**Response (200):**
```json
{ "cart": { ... } }
```

---

### POST `/cart/clear`
Remove all items from the cart.

**Auth:** Required  
**Response (200):**
```json
{ "cart": { ... } }
```

---

### POST `/cart/coupon`
Apply a coupon code to the cart.

**Auth:** Required  
**Body:**
```json
{
  "code": "SUMMER20"
}
```
**Response (200):**
```json
{ "cart": { ... } }
```

**Error cases:**
- `COUPON_NOT_FOUND` (404) — Code doesn't exist
- `COUPON_EXPIRED` (400) — Coupon has expired
- `COUPON_INVALID` (400) — Doesn't meet requirements (min subtotal, product/category restrictions)
- `COUPON_LIMIT_REACHED` (400) — Per-user or global limit hit

**Coupon validation checks:**
1. Code exists and is active
2. Not expired (`expiresAt` in the future)
3. Cart subtotal meets `minSubtotal`
4. Global usage count under `globalLimit`
5. User's usage count under `perUserLimit`
6. Product/category inclusion/exclusion rules pass

---

### DELETE `/cart/coupon`
Remove the applied coupon.

**Auth:** Required  
**Response (200):**
```json
{ "cart": { ... } }
```

---

### POST `/cart/estimate`
Estimate shipping and tax totals for the current cart.

**Auth:** Required  
**Body:**
```json
{
  "shipping": 5.99,
  "taxRate": 0.08
}
```
**Response (200):**
```json
{
  "subtotal": 59.98,
  "discount": 11.99,
  "shipping": 5.99,
  "tax": 3.84,
  "total": 57.82,
  "currency": "USD"
}
```

---

## 9. Checkout & Orders

### POST `/orders`
Create an order from the current cart (checkout).

**Auth:** Required  
**Headers:**
- `Idempotency-Key: unique-key-per-request` (optional but recommended for safety)

**Body:**
```json
{
  "shippingAddressId": "address-object-id",
  "notes": "Please gift wrap"
}
```
**Response (201):**
```json
{
  "order": {
    "_id": "...",
    "user": "...",
    "items": [
      {
        "product": "...",
        "variant": null,
        "name": "Premium T-Shirt",
        "price": 29.99,
        "currency": "USD",
        "quantity": 2
      }
    ],
    "subtotal": 59.98,
    "discount": 11.99,
    "shipping": 5.99,
    "tax": 3.84,
    "total": 57.82,
    "currency": "USD",
    "status": "pending",
    "paymentStatus": "unpaid",
    "paymentMethod": "prepaid",
    "invoiceNumber": "A1B2C3D4",
    "invoiceUrl": "/uploads/invoices/invoice-A1B2C3D4.pdf",
    "shippingAddress": {
      "fullName": "John Doe",
      "line1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "US"
    },
    "placedAt": "2026-03-15T..."
  }
}
```

**Error cases:**
- `CART_EMPTY` (400) — No items in cart
- `PRODUCT_UNAVAILABLE` (400) — Product no longer active
- `INSUFFICIENT_STOCK` (400) — Not enough stock
- `IDEMPOTENT_REPLAY` (409) — Duplicate idempotency key

**What happens during checkout:**
1. Cart validated (items exist, active, stock available)
2. Addresses resolved (explicit or user's defaults)
3. Subtotal, discount (from coupon), shipping, tax calculated
4. Order created with `status: 'pending'`, `paymentStatus: 'unpaid'`
5. Cart marked as `converted` and cleared
6. Coupon usage recorded
7. PDF invoice generated
8. Inventory reserved at optimal warehouse locations
9. Order confirmation email sent
10. In-app notification created

---

### GET `/orders`
List current user's orders.

**Auth:** Required  
**Query:** `page`, `limit`  
**Response (200):**
```json
{
  "items": [
    {
      "_id": "...",
      "status": "paid",
      "paymentStatus": "paid",
      "total": 57.82,
      "currency": "USD",
      "items": [ ... ],
      "placedAt": "2026-03-15T...",
      "createdAt": "2026-03-15T..."
    }
  ],
  "total": 5,
  "page": 1,
  "pages": 1
}
```

---

### GET `/orders/:id`
Get a single order by ID. Users can only view their own orders.

**Auth:** Required  
**Response (200):**
```json
{ "order": { ... } }
```

---

### GET `/orders/:id/invoice`
Get/download the invoice PDF for an order.

**Auth:** Required  
**Response:** `302` redirect to the PDF file URL, or `404` if invoice not found.

---

### GET `/orders/:id/timeline`
Get the event timeline for an order (status changes, payments, etc.).

**Auth:** Required  
**Query:** `page`, `limit`  
**Response (200):**
```json
{
  "items": [
    {
      "_id": "...",
      "type": "created",
      "message": "Order created",
      "createdAt": "2026-03-15T10:00:00Z"
    },
    {
      "_id": "...",
      "type": "payment_succeeded",
      "message": "Payment succeeded via Stripe",
      "createdAt": "2026-03-15T10:05:00Z"
    }
  ],
  "total": 3,
  "page": 1,
  "pages": 1
}
```

---

### POST `/orders/:id/cancel`
Cancel a pending order (customer-facing).

**Auth:** Required  
**Body:**
```json
{
  "reason": "Changed my mind"
}
```
**Response (200):**
```json
{ "order": { ... } }
```

**Business rules:**
- Only `pending` orders can be cancelled by the customer
- Must be within the cancellation window (default: 120 minutes after placement)
- Releases inventory reservations
- Creates timeline entry and notification

---

### POST `/orders/:id/returns`
Request a return/refund for a delivered order.

**Auth:** Required  
**Body:**
```json
{
  "reason": "Product does not match description"
}
```
**Response (201):**
```json
{ "return": { ... } }
```

**Notes:**
- Creates a `ReturnRequest` with status `'requested'`
- Admin must approve/reject the return

---

## 10. Payments

### POST `/payments/stripe/intent`
Create a Stripe PaymentIntent for an order.

**Auth:** Required  
**Body:**
```json
{
  "orderId": "order-object-id"
}
```
**Response (200):**
```json
{
  "clientSecret": "pi_xxx_secret_xxx"
}
```

**Error cases:**
- `PAYMENTS_NOT_CONFIGURED` (503) — Stripe not configured on server
- `ORDER_NOT_FOUND` (404) — Order doesn't exist or not owned by user
- `PAYMENT_METHOD_UNAVAILABLE` (400) — Order is COD
- Already paid → returns `{ alreadyPaid: true }`

**Frontend integration:**
1. Call this endpoint to get `clientSecret`
2. Use Stripe.js `confirmPayment()` with the secret
3. Stripe sends webhook to backend on success
4. Backend updates order status automatically

---

### POST `/payments/stripe/webhook`
Stripe webhook endpoint (called by Stripe, not by frontend).

**Auth:** None (verified by Stripe signature)  
**Content-Type:** `application/json` (raw body)  
**Response (200):**
```json
{ "received": true }
```

**Handled events:**
- `payment_intent.succeeded` — Marks order paid, converts reservations to stock deductions
- `charge.refunded` / `charge.refund.updated` — Records refund, may mark order as refunded

---

## 11. Wishlist

All wishlist endpoints require authentication.

### GET `/wishlist`
Get the current user's wishlist.

**Auth:** Required  
**Response (200):**
```json
{
  "wishlist": {
    "_id": "...",
    "user": "...",
    "items": [
      {
        "product": "product-id",
        "variantId": null,
        "addedAt": "2026-03-10T..."
      }
    ]
  }
}
```

---

### POST `/wishlist`
Add a product to the wishlist.

**Auth:** Required  
**Body:**
```json
{
  "productId": "product-object-id",
  "variantId": "optional-variant-id"
}
```
**Response (201):**
```json
{ "wishlist": { ... } }
```

---

### DELETE `/wishlist/items/:productId`
Remove a product from the wishlist.

**Auth:** Required  
**Query:** `variantId` — optional  
**Response (200):**
```json
{ "wishlist": { ... } }
```

---

### DELETE `/wishlist`
Clear entire wishlist.

**Auth:** Required  
**Response (200):**
```json
{ "wishlist": { ... } }
```

---

## 12. Notifications

All notification endpoints require authentication.

### GET `/notifications`
List user's notifications (paginated).

**Auth:** Required  
**Query:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `unreadOnly` | boolean | — | Only return unread notifications |

**Response (200):**
```json
{
  "items": [
    {
      "_id": "...",
      "type": "order_update",
      "channel": "in_app",
      "title": "Order Status Updated",
      "body": "Your order #A1B2C3D4 has been shipped",
      "actionUrl": "/orders/order-id",
      "isRead": false,
      "createdAt": "2026-03-15T..."
    }
  ],
  "total": 12,
  "page": 1,
  "pages": 1
}
```

---

### GET `/notifications/unread-count`
Get the count of unread notifications (for badge display).

**Auth:** Required  
**Response (200):**
```json
{ "unreadCount": 3 }
```

---

### PATCH `/notifications/:id/read`
Mark a single notification as read.

**Auth:** Required  
**Response (200):**
```json
{ "notification": { ... } }
```

---

### PATCH `/notifications/read-all`
Mark all notifications as read.

**Auth:** Required  
**Response (200):**
```json
{ "markedRead": 5 }
```

---

### DELETE `/notifications/:id`
Delete a notification.

**Auth:** Required  
**Response (200):**
```json
{ "deleted": true }
```

---

## 13. Shipping Rates

### POST `/shipping/rates`
Get available shipping rates for a given address/cart.

**Auth:** Required  
**Body:**
```json
{
  "country": "US",
  "state": "NY",
  "postalCode": "10001",
  "subtotal": 59.98,
  "totalWeight": 600
}
```
**Response (200):**
```json
{
  "rates": [
    {
      "method": {
        "_id": "...",
        "name": "Standard Shipping",
        "code": "STANDARD",
        "estimatedMinDays": 5,
        "estimatedMaxDays": 7,
        "currency": "USD"
      },
      "rate": 5.99
    },
    {
      "method": {
        "_id": "...",
        "name": "Express Shipping",
        "code": "EXPRESS",
        "estimatedMinDays": 1,
        "estimatedMaxDays": 2,
        "currency": "USD"
      },
      "rate": 14.99
    }
  ]
}
```

---

## 14. Permissions

### GET `/permissions/me`
Get the current user's permissions list.

**Auth:** Required  
**Response (200):**
```json
{
  "userId": "...",
  "permissions": ["product:create", "product:edit"]
}
```

**Notes:** Regular customers typically have an empty permissions array. Permissions are primarily for admin/staff users.

---

## Authentication Header Format

For all endpoints marked **Auth: Required**, include the JWT access token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

When the access token expires (15-minute default), use the `/auth/refresh` endpoint to get a new one.

---

## Pagination Format

All list endpoints support consistent pagination:

**Query Parameters:**
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 20, max: 100)

**Response:**
```json
{
  "items": [ ... ],
  "total": 150,
  "page": 1,
  "pages": 8
}
```

---

## Error Code Quick Reference (User Panel)

| Code | HTTP | When |
|------|------|------|
| `VALIDATION_ERROR` | 400 | Request body/params/query invalid |
| `AUTH_HEADER_MISSING` | 401 | No Bearer token provided |
| `TOKEN_INVALID` | 401 | JWT expired, malformed, or blacklisted |
| `INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `FORBIDDEN` | 403 | Not authorized for this action |
| `USER_LOCKED` | 423 | Account locked (too many login attempts) |
| `USER_INACTIVE` | 403 | Account deactivated |
| `PRODUCT_NOT_FOUND` | 404 | Product ID doesn't exist |
| `PRODUCT_UNAVAILABLE` | 400 | Product inactive or deleted |
| `CATEGORY_NOT_FOUND` | 404 | Category ID doesn't exist |
| `CART_EMPTY` | 400 | Attempting checkout with empty cart |
| `ITEM_NOT_IN_CART` | 404 | Trying to update/remove item not in cart |
| `INSUFFICIENT_STOCK` | 400 | Not enough inventory |
| `COUPON_NOT_FOUND` | 404 | Coupon code doesn't exist |
| `COUPON_EXPIRED` | 400 | Coupon past expiry date |
| `COUPON_INVALID` | 400 | Coupon requirements not met |
| `COUPON_LIMIT_REACHED` | 400 | Usage limit exceeded |
| `ORDER_NOT_FOUND` | 404 | Order doesn't exist or not owned |
| `INVALID_STATE` | 400 | Invalid status transition (e.g., cancel a shipped order) |
| `RETURN_ALREADY_EXISTS` | 409 | Return already requested for this order |
| `RETURN_NOT_ELIGIBLE` | 400 | Order not eligible for return |
| `REVIEW_NOT_FOUND` | 404 | Review doesn't exist |
| `PAYMENTS_NOT_CONFIGURED` | 503 | Stripe not configured |
| `PAYMENT_FAILED` | 400 | Payment processing error |
| `RATE_LIMITED` | 429 | Too many requests |
| `IDEMPOTENT_REPLAY` | 409 | Duplicate request (idempotency key reused) |
