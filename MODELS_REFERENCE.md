# Data Models Reference

> Complete schema reference for all 36 Mongoose models in the ecombackend project.

---

## Table of Contents

1. [User](#1-user)
2. [Address](#2-address)
3. [Wishlist](#3-wishlist)
4. [EmailToken](#4-emailtoken)
5. [RefreshToken](#5-refreshtoken)
6. [PasswordResetToken](#6-passwordresettoken)
7. [TokenBlacklist](#7-tokenblacklist)
8. [Product](#8-product)
9. [Category](#9-category)
10. [Brand](#10-brand)
11. [ProductAttribute](#11-productattribute)
12. [ProductOption](#12-productoption)
13. [ProductVariant](#13-productvariant)
14. [Cart](#14-cart)
15. [Order](#15-order)
16. [Shipment](#16-shipment)
17. [OrderTimeline](#17-ordertimeline)
18. [ReturnRequest](#18-returnrequest)
19. [Coupon](#19-coupon)
20. [Review](#20-review)
21. [PaymentTransaction](#21-paymenttransaction)
22. [PaymentEvent](#22-paymentevent)
23. [Refund](#23-refund)
24. [AuditLog](#24-auditlog)
25. [Notification](#25-notification)
26. [StockItem](#26-stockitem)
27. [StockLedger](#27-stockledger)
28. [Location](#28-location)
29. [Reservation](#29-reservation)
30. [TransferOrder](#30-transferorder)
31. [ShippingZone](#31-shippingzone)
32. [ShippingMethod](#32-shippingmethod)
33. [TaxZone](#33-taxzone)
34. [TaxRule](#34-taxrule)
35. [CurrencyRate](#35-currencyrate)
36. [IdempotencyKey](#36-idempotencykey)

---

## 1. User

**File:** `src/modules/users/user.model.js`  
**Collection:** `users`  
**Timestamps:** `createdAt`, `updatedAt`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `name` | String | ✅ | — | trim |
| `email` | String | ✅ | — | unique, lowercase, trim, regex validated |
| `phone` | String | — | `''` | trim |
| `password` | String | ✅ | — | `select: false` (hidden by default) |
| `roles` | [String] | — | `['customer']` | Values from ROLES constant |
| `permissions` | [String] | — | `[]` | Indexed. Fine-grained access control |
| `isActive` | Boolean | — | `true` | Can be deactivated by admin |
| `isVerified` | Boolean | — | `false` | Email verification status |
| `failedLoginAttempts` | Number | — | `0` | Account lockout tracking |
| `lockUntil` | Date | — | — | Lockout expiry timestamp |
| `preferences.locale` | String | — | `'en'` | User language preference |
| `preferences.notifications.email` | Boolean | — | `true` | Email notification opt-in |
| `preferences.notifications.sms` | Boolean | — | `false` | SMS notification opt-in |
| `preferences.notifications.push` | Boolean | — | `true` | Push notification opt-in |

**Pre-save hook:** Hashes password with bcrypt (salt 10) when modified.  
**Instance method:** `comparePassword(candidate)` — Returns `bcrypt.compare()` result.

**Indexes:**
- `email` — unique
- `permissions` — single-field

---

## 2. Address

**File:** `src/modules/users/address.model.js`  
**Collection:** `addresses`  
**Timestamps:** `createdAt`, `updatedAt`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `user` | ObjectId | ✅ | — | ref `User`, indexed |
| `type` | String | ✅ | — | enum: `['shipping', 'billing']` |
| `fullName` | String | — | — | |
| `line1` | String | ✅ | — | Street address line 1 |
| `line2` | String | — | — | Street address line 2 |
| `city` | String | ✅ | — | |
| `state` | String | — | — | |
| `postalCode` | String | ✅ | — | |
| `country` | String | ✅ | — | |
| `phone` | String | — | — | |
| `label` | String | — | — | e.g., "Home", "Office" |
| `isDefault` | Boolean | — | `false` | |

**Indexes:**
- `{ user: 1, type: 1, isDefault: 1 }` — unique partial (isDefault: true) — enforces max one default per user+type

---

## 3. Wishlist

**File:** `src/modules/users/wishlist.model.js`  
**Collection:** `wishlists`  
**Timestamps:** `createdAt`, `updatedAt`

**Embedded subdocument — wishlistItemSchema (_id: false):**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `product` | ObjectId | ✅ | ref `Product` |
| `variantId` | ObjectId | — | ref `ProductVariant` |
| `addedAt` | Date | — | Default: `Date.now` |

**Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `user` | ObjectId | ✅ | ref `User`, unique |
| `items` | [wishlistItemSchema] | — | |

---

## 4. EmailToken

**File:** `src/modules/users/email-token.model.js`  
**Collection:** `emailtokens`  
**Timestamps:** `createdAt`, `updatedAt`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `user` | ObjectId | ✅ | ref `User`, indexed |
| `tokenHash` | String | ✅ | unique |
| `newEmail` | String | — | For email change requests |
| `expiresAt` | Date | ✅ | |
| `usedAt` | Date | — | |

**Virtuals:** `isExpired` (boolean), `isActive` (boolean)  
**TTL Index:** `expiresAt` — auto-deletes expired tokens

---

## 5. RefreshToken

**File:** `src/modules/users/refresh-token.model.js`  
**Collection:** `refreshtokens`  
**Timestamps:** `createdAt`, `updatedAt`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `user` | ObjectId | ✅ | ref `User`, indexed |
| `tokenHash` | String | ✅ | unique |
| `createdByIp` | String | — | IP that created the token |
| `revokedAt` | Date | — | |
| `revokedByIp` | String | — | |
| `replacedByToken` | String | — | Token rotation chain |
| `expiresAt` | Date | ✅ | |

**Virtuals:** `isExpired`, `isActive`  
**TTL Index:** `expiresAt`

---

## 6. PasswordResetToken

**File:** `src/modules/users/password-reset-token.model.js`  
**Collection:** `passwordresettokens`  
**Timestamps:** `createdAt`, `updatedAt`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `user` | ObjectId | ✅ | ref `User`, indexed |
| `tokenHash` | String | ✅ | unique |
| `expiresAt` | Date | ✅ | |
| `usedAt` | Date | — | |

**Virtuals:** `isExpired`, `isActive`  
**TTL Index:** `expiresAt`

---

## 7. TokenBlacklist

**File:** `src/modules/users/token-blacklist.model.js`  
**Collection:** `tokenblacklists`  
**Timestamps:** `createdAt`, `updatedAt`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `token` | String | ✅ | — | unique (JWT ID or hash) |
| `reason` | String | — | `'logout'` | |
| `user` | ObjectId | — | — | ref `User` |
| `expiresAt` | Date | ✅ | — | |

**TTL Index:** `expiresAt`  
**Exported helpers:** `blacklistToken()`, `isTokenBlacklisted()`

---

## 8. Product

**File:** `src/modules/catalog/product.model.js`  
**Collection:** `products`  
**Timestamps:** `createdAt`, `updatedAt`

**Embedded — imageSchema (_id: false):**

| Field | Type | Required |
|-------|------|----------|
| `url` | String | ✅ |
| `alt` | String | — |

**Embedded — dimensionsSchema (_id: false):**

| Field | Type | Default |
|-------|------|---------|
| `length` | Number | — |
| `width` | Number | — |
| `height` | Number | — |
| `unit` | String | `'cm'` |

**Embedded — variantSchema (_id: true, timestamps) — DEPRECATED:**

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `sku` | String | ✅ | — |
| `price` | Number | ✅ | — |
| `stock` | Number | ✅ | `0` |
| `attributes` | Map\<String\> | — | — |
| `barcode` | String | — | — |
| `images` | [imageSchema] | — | `[]` |
| `isActive` | Boolean | — | `true` |

**Main Fields:**

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `name` | String | ✅ | — | trim |
| `slug` | String | — | auto-generated | Unique (partial: deletedAt null) |
| `description` | String | — | — | |
| `longDescription` | String | — | — | |
| `price` | Number | conditional | — | Required when `hasVariants === false` |
| `compareAtPrice` | Number | — | — | Strikethrough/"was" price |
| `costPrice` | Number | — | — | Internal cost |
| `currency` | String | — | `DEFAULT_CURRENCY` | |
| `images` | [imageSchema] | — | `[]` | |
| `attributes` | Map\<String\> | — | — | Free-form product attributes |
| `category` | ObjectId | — | — | ref `Category` |
| `brand` | ObjectId | — | — | ref `Brand`, alias `brandId` |
| `vendor` | String | — | — | |
| `sku` | String | — | — | Unique (partial, when non-empty) |
| `barcode` | String | — | — | |
| `mpn` | String | — | — | Manufacturer Part Number |
| `taxClass` | String | — | — | |
| `tags` | [String] | — | `[]` | |
| `ratingAvg` | Number | — | `0` | Computed from reviews |
| `ratingCount` | Number | — | `0` | Computed from reviews |
| `requiresShipping` | Boolean | — | `true` | Digital products set to false |
| `weight` | Number | — | — | |
| `weightUnit` | String | — | `'kg'` | |
| `dimensions` | dimensionsSchema | — | — | |
| `isActive` | Boolean | — | `true` | |
| `metaTitle` | String | — | — | SEO |
| `metaDescription` | String | — | — | SEO |
| `metaKeywords` | [String] | — | `[]` | SEO |
| `deletedAt` | Date | — | `null` | Soft delete |
| `hasVariants` | Boolean | — | `false` | |
| `visibility` | String | — | `'visible'` | enum: `['visible', 'hidden']` |
| `variants` | [variantSchema] | — | `[]` | **DEPRECATED** — use ProductVariant collection |

**Hooks:**
- `pre('save')` — Auto-generates slug from name
- `pre('validate')` — Validates price required when `!hasVariants`
- `pre('validate')` — Validates variant SKU uniqueness and attribute combination uniqueness

**Indexes:**
- `{ category: 1 }`
- `{ name: 'text', description: 'text' }` — full-text search
- `{ slug: 1 }` — unique, partial (deletedAt: null)
- `{ sku: 1 }` — unique, partial (deletedAt: null, sku exists)
- `{ deletedAt: 1 }`
- `{ hasVariants: 1 }`
- `{ visibility: 1 }`
- `{ 'variants.sku': 1 }` — unique, partial

---

## 9. Category

**File:** `src/modules/catalog/category.model.js`  
**Collection:** `categories`  
**Timestamps:** `createdAt`, `updatedAt`

**Embedded — catImageSchema (_id: false):**

| Field | Type |
|-------|------|
| `url` | String |
| `alt` | String |

**Fields:**

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `name` | String | ✅ | — | trim |
| `slug` | String | ✅ | — | Auto-generated from name |
| `description` | String | — | — | |
| `parent` | ObjectId | — | — | ref `Category`, indexed (supports nesting) |
| `sortOrder` | Number | — | `0` | Custom ordering |
| `isActive` | Boolean | — | `true` | |
| `status` | String | — | `'active'` | enum: `['active', 'inactive']`, synced with isActive |
| `image` | catImageSchema | — | — | Category thumbnail |
| `banner` | catImageSchema | — | — | Category banner |
| `icon` | String | — | — | Icon identifier |
| `fullSlug` | String | — | — | Full path slug (e.g., `electronics/phones`) |
| `path` | [ObjectId] | — | `[]` | Materialized path of ancestor category IDs |
| `metaTitle` | String | — | — | SEO |
| `metaDescription` | String | — | — | SEO |
| `metaKeywords` | [String] | — | `[]` | SEO |
| `attributes` | Map\<String\> | — | — | Free-form category attributes |
| `deletedAt` | Date | — | `null` | Soft delete |

**Indexes:**
- `{ slug: 1 }` — unique, partial (deletedAt: null)
- `{ name: 1 }` — unique, partial (deletedAt: null)

---

## 10. Brand

**File:** `src/modules/catalog/brand.model.js`  
**Collection:** `brands`  
**Timestamps:** `createdAt`, `updatedAt`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `name` | String | ✅ | — | trim |
| `slug` | String | ✅ | — | Auto-generated |
| `logo` | String | — | — | Logo URL |
| `description` | String | — | — | |
| `isActive` | Boolean | — | `true` | |
| `deletedAt` | Date | — | `null` | Soft delete |

**Indexes:**
- `{ name: 1 }` — unique, partial (deletedAt: null)
- `{ slug: 1 }` — unique, partial (deletedAt: null)

---

## 11. ProductAttribute

**File:** `src/modules/catalog/product-attribute.model.js`  
**Collection:** `productattributes`  
**Timestamps:** `createdAt`, `updatedAt`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `product` | ObjectId | ✅ | — | ref `Product`, indexed |
| `name` | String | ✅ | — | e.g., "Color", "Size" |
| `slug` | String | ✅ | — | Auto-generated from name |
| `description` | String | — | — | |
| `sortOrder` | Number | — | `0` | |
| `isRequired` | Boolean | — | `true` | |

**Indexes:**
- `{ product: 1, slug: 1 }` — unique
- `{ product: 1, name: 1 }` — unique

---

## 12. ProductOption

**File:** `src/modules/catalog/product-option.model.js`  
**Collection:** `productoptions`  
**Timestamps:** `createdAt`, `updatedAt`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `product` | ObjectId | ✅ | — | ref `Product` |
| `attribute` | ObjectId | ✅ | — | ref `ProductAttribute` |
| `name` | String | ✅ | — | e.g., "Red", "Large" |
| `slug` | String | ✅ | — | Auto-generated |
| `sortOrder` | Number | — | `0` | |
| `metadata` | Map\<String\> | — | — | Extra option data (hex code, etc.) |

**Indexes:**
- `{ attribute: 1, slug: 1 }` — unique
- `{ attribute: 1, name: 1 }` — unique

---

## 13. ProductVariant

**File:** `src/modules/catalog/product-variant.model.js`  
**Collection:** `productvariants`  
**Timestamps:** `createdAt`, `updatedAt`

**Embedded — attributeSelectionSchema (_id: false):**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `attribute` | ObjectId | ✅ | ref `ProductAttribute` |
| `option` | ObjectId | ✅ | ref `ProductOption` |

**Fields:**

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `product` | ObjectId | ✅ | — | ref `Product`, indexed |
| `sku` | String | ✅ | — | trim |
| `combinationKey` | String | ✅ | — | Sorted selection IDs joined, for uniqueness |
| `selections` | [attributeSelectionSchema] | — | `[]` | Links to attribute+option pairs |
| `priceOverride` | Number | — | — | Absolute price (overrides product price) |
| `priceDelta` | Number | — | — | Relative price change from product price |
| `stock` | Number | — | `0` | Legacy; use StockItem for inventory |
| `barcode` | String | — | — | |
| `isActive` | Boolean | — | `true` | |

**Indexes:**
- `{ product: 1, sku: 1 }` — unique
- `{ product: 1, combinationKey: 1 }` — unique

---

## 14. Cart

**File:** `src/modules/cart/cart.model.js`  
**Collection:** `carts`  
**Timestamps:** `createdAt`, `updatedAt`

**Embedded — itemSchema (_id: false):**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `product` | ObjectId | ✅ | ref `Product` |
| `variant` | ObjectId | — | |
| `sku` | String | — | Snapshot at add time |
| `attributes` | Map\<String\> | — | Snapshot at add time |
| `name` | String | ✅ | Snapshot at add time |
| `price` | Number | ✅ | Snapshot at add time |
| `currency` | String | ✅ | Snapshot at add time |
| `quantity` | Number | ✅ | min 1 |

**Fields:**

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `user` | ObjectId | ✅ | — | ref `User` |
| `items` | [itemSchema] | — | `[]` | |
| `subtotal` | Number | — | `0` | Sum of (price × quantity) |
| `discount` | Number | — | `0` | From applied coupon |
| `couponCode` | String | — | — | Applied coupon code |
| `coupon` | ObjectId | — | — | ref `Coupon` |
| `total` | Number | — | `0` | subtotal - discount |
| `currency` | String | — | `DEFAULT_CURRENCY` | |
| `status` | String | — | `'active'` | enum: `['active', 'converted']` |

**Instance method:** `recalculate()` — Recomputes subtotal from items  
**Index:** `{ user: 1 }` — unique, partial (status: 'active') — one active cart per user

---

## 15. Order

**File:** `src/modules/orders/order.model.js`  
**Collection:** `orders`  
**Timestamps:** `createdAt`, `updatedAt`

**Embedded — orderItemSchema (_id: false):**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `product` | ObjectId | ✅ | ref `Product` |
| `variant` | ObjectId | — | |
| `name` | String | ✅ | Snapshot |
| `price` | Number | ✅ | Snapshot |
| `currency` | String | ✅ | Snapshot |
| `quantity` | Number | ✅ | min 1 |

**Embedded — addressSchema (_id: false):**

| Field | Type |
|-------|------|
| `fullName` | String |
| `line1` | String |
| `line2` | String |
| `city` | String |
| `state` | String |
| `postalCode` | String |
| `country` | String |
| `phone` | String |

**Fields:**

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `user` | ObjectId | ✅ | — | ref `User` |
| `items` | [orderItemSchema] | ✅ | — | |
| `subtotal` | Number | ✅ | — | |
| `shipping` | Number | — | `0` | |
| `tax` | Number | — | `0` | |
| `taxRate` | Number | — | `0` | 0-1 range |
| `discount` | Number | — | `0` | |
| `couponCode` | String | — | — | |
| `total` | Number | ✅ | — | |
| `currency` | String | — | `DEFAULT_CURRENCY` | |
| `status` | String | — | `'pending'` | enum: `['pending','paid','shipped','delivered','cancelled','refunded']` |
| `paymentStatus` | String | — | `'unpaid'` | enum: `['unpaid','paid','refunded']` |
| `paymentMethod` | String | — | `'prepaid'` | enum: `['prepaid','cod']` |
| `paymentProvider` | String | — | — | e.g., `'stripe'` |
| `transactionId` | String | — | — | Stripe PaymentIntent ID |
| `paidAt` | Date | — | — | |
| `invoiceNumber` | String | — | — | |
| `invoiceUrl` | String | — | — | |
| `shippingAddress` | addressSchema | — | — | |
| `billingAddress` | addressSchema | — | — | |
| `placedAt` | Date | — | `Date.now` | |

**Index:** `{ user: 1, createdAt: -1 }`

---

## 16. Shipment

**File:** `src/modules/orders/shipment.model.js`  
**Collection:** `shipments`  
**Timestamps:** `createdAt`, `updatedAt`

**Embedded — shipmentItemSchema (_id: false):**

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `product` | ObjectId | ✅ | — |
| `variant` | ObjectId | — | — |
| `name` | String | — | — |
| `quantity` | Number | — | `1` |

**Fields:**

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `order` | ObjectId | ✅ | — | ref `Order`, indexed |
| `address` | addressSchema | — | — | |
| `carrier` | String | — | — | e.g., "DHL", "FedEx" |
| `service` | String | — | — | e.g., "Express", "Ground" |
| `tracking` | String | — | — | Tracking number, indexed |
| `status` | String | — | `'pending'` | enum: `['pending','shipped','delivered','returned']` |
| `items` | [shipmentItemSchema] | — | `[]` | |
| `shippedAt` | Date | — | — | |
| `estimatedDelivery` | Date | — | — | |
| `deliveredAt` | Date | — | — | |

**Index:** `{ order: 1, createdAt: -1 }`

---

## 17. OrderTimeline

**File:** `src/modules/orders/timeline.model.js`  
**Collection:** `ordertimelines`  
**Timestamps:** `createdAt`, `updatedAt`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `order` | ObjectId | ✅ | ref `Order`, indexed |
| `user` | ObjectId | — | ref `User` (who triggered) |
| `type` | String | ✅ | Event type identifier |
| `message` | String | — | Human-readable message |
| `from` | Mixed | — | Previous state value |
| `to` | Mixed | — | New state value |
| `meta` | Mixed | — | Extra metadata |

**Index:** `{ order: 1, createdAt: -1 }`

---

## 18. ReturnRequest

**File:** `src/modules/orders/return.model.js`  
**Collection:** `returnrequests`  
**Timestamps:** `createdAt`, `updatedAt`

**Embedded — returnItemSchema (_id: false):**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `product` | ObjectId | ✅ | ref `Product` |
| `variant` | ObjectId | — | |
| `name` | String | — | |
| `quantity` | Number | ✅ | min 1 |
| `reason` | String | — | |

**Fields:**

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `order` | ObjectId | ✅ | — | ref `Order`, indexed |
| `user` | ObjectId | ✅ | — | ref `User`, indexed |
| `status` | String | — | `'requested'` | enum: `['requested','approved','rejected','refunded']` |
| `reason` | String | — | — | |
| `note` | String | — | — | Admin note |
| `items` | [returnItemSchema] | — | `[]` | |
| `refund` | ObjectId | — | — | ref `Refund` |
| `approvedBy` | ObjectId | — | — | ref `User` |
| `approvedAt` | Date | — | — | |
| `rejectedAt` | Date | — | — | |
| `refundedAt` | Date | — | — | |

---

## 19. Coupon

**File:** `src/modules/coupons/coupon.model.js`  
**Collection:** `coupons`  
**Timestamps:** `createdAt`, `updatedAt`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `code` | String | ✅ | — | unique, uppercase, trim |
| `description` | String | — | — | |
| `type` | String | ✅ | — | enum: `['percent','fixed']` |
| `value` | Number | ✅ | — | ≤100 for percent type |
| `minSubtotal` | Number | — | `0` | Minimum cart subtotal to apply |
| `expiresAt` | Date | — | — | Coupon expiry |
| `isActive` | Boolean | — | `true` | |
| `includeCategories` | [ObjectId] | — | `[]` | ref `Category` — restrict to these categories |
| `excludeCategories` | [ObjectId] | — | `[]` | ref `Category` — exclude these categories |
| `includeProducts` | [ObjectId] | — | `[]` | ref `Product` — restrict to these products |
| `excludeProducts` | [ObjectId] | — | `[]` | ref `Product` — exclude these products |
| `perUserLimit` | Number | — | `0` | Max uses per user (0 = unlimited) |
| `globalLimit` | Number | — | `0` | Max total uses (0 = unlimited) |
| `usageCount` | Number | — | `0` | Current total uses |
| `usedBy` | [ObjectId] | — | — | ref `User` — tracks which users used it |

---

## 20. Review

**File:** `src/modules/reviews/review.model.js`  
**Collection:** `reviews`  
**Timestamps:** `createdAt`, `updatedAt`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `product` | ObjectId | ✅ | — | ref `Product`, indexed |
| `user` | ObjectId | ✅ | — | ref `User`, indexed |
| `rating` | Number | ✅ | — | 1–5 range |
| `comment` | String | — | — | |
| `isApproved` | Boolean | — | `false` | Requires admin approval |
| `verifiedPurchase` | Boolean | — | `false` | System-set based on order history |

**Index:** `{ product: 1, user: 1 }` — unique (one review per user per product)

---

## 21. PaymentTransaction

**File:** `src/modules/payments/payment-transaction.model.js`  
**Collection:** `paymenttransactions`  
**Timestamps:** `createdAt`, `updatedAt`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `order` | ObjectId | ✅ | — | ref `Order`, indexed |
| `provider` | String | ✅ | — | e.g., `'stripe'` |
| `status` | String | — | `'pending'` | enum: `['pending','succeeded','failed','refunded']` |
| `amount` | Number | ✅ | — | |
| `currency` | String | — | `DEFAULT_CURRENCY` | |
| `providerRef` | String | — | — | Stripe PaymentIntent ID, indexed |
| `raw` | Mixed | — | — | Full provider response payload |

**Index:** `{ order: 1, createdAt: -1 }`

---

## 22. PaymentEvent

**File:** `src/modules/payments/payment-event.model.js`  
**Collection:** `paymentevents`  
**Timestamps:** disabled

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `provider` | String | ✅ | |
| `eventId` | String | ✅ | Stripe event ID |
| `type` | String | — | Event type (e.g., `payment_intent.succeeded`) |
| `order` | ObjectId | — | ref `Order` |
| `receivedAt` | Date | — | Default: `Date.now` |

**Index:** `{ provider: 1, eventId: 1 }` — unique (webhook deduplication)

---

## 23. Refund

**File:** `src/modules/payments/refund.model.js`  
**Collection:** `refunds`  
**Timestamps:** `createdAt`, `updatedAt`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `order` | ObjectId | ✅ | — | ref `Order`, indexed |
| `transaction` | ObjectId | — | — | ref `PaymentTransaction` |
| `provider` | String | — | — | |
| `status` | String | — | `'pending'` | enum: `['pending','succeeded','failed']` |
| `amount` | Number | ✅ | — | |
| `currency` | String | — | `DEFAULT_CURRENCY` | |
| `reason` | String | — | — | |
| `providerRef` | String | — | — | |
| `raw` | Mixed | — | — | |

**Index:** `{ order: 1, createdAt: -1 }`

---

## 24. AuditLog

**File:** `src/modules/audit/audit.model.js`  
**Collection:** `auditlogs`  
**Timestamps:** `createdAt`, `updatedAt`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `user` | ObjectId | — | ref `User` |
| `method` | String | ✅ | HTTP method |
| `path` | String | ✅ | Request path |
| `status` | Number | — | HTTP response status |
| `ip` | String | — | Client IP |
| `requestId` | String | — | X-Request-Id |
| `query` | Mixed | — | Query parameters |
| `params` | Mixed | — | URL parameters |
| `body` | Mixed | — | Sanitized request body |
| `meta` | Mixed | — | Extra metadata (e.g., durationMs) |

**Indexes:**
- `{ user: 1, createdAt: -1 }`
- `{ method: 1, path: 1, createdAt: -1 }`

---

## 25. Notification

**File:** `src/modules/notifications/notification.model.js`  
**Collection:** `notifications`  
**Timestamps:** `createdAt`, `updatedAt`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `user` | ObjectId | ✅ | — | ref `User`, indexed |
| `type` | String | ✅ | — | enum: `['order_update','promotion','system','stock_alert','review_approved','refund_processed','shipment_update']` |
| `channel` | String | — | `'in_app'` | enum: `['in_app','email','push']` |
| `title` | String | ✅ | — | maxlength 200 |
| `body` | String | ✅ | — | maxlength 2000 |
| `actionUrl` | String | — | — | Deep link for frontend |
| `refModel` | String | — | — | enum: `['Order','Product','Shipment','Coupon','Review', null]` |
| `refId` | ObjectId | — | — | |
| `isRead` | Boolean | — | `false` | |
| `readAt` | Date | — | — | |
| `meta` | Mixed | — | — | |

**Instance method:** `markRead()` — Sets `isRead = true`, `readAt = now`, saves  
**Indexes:**
- `{ user: 1, isRead: 1, createdAt: -1 }` — feed queries
- `{ createdAt: 1 }` — TTL (90 days auto-delete)

---

## 26. StockItem

**File:** `src/modules/inventory/models/stock-item.model.js`  
**Collection:** `stockitems`  
**Timestamps:** `updatedAt` only

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `productId` | ObjectId | ✅ | — | ref `Product` |
| `variantId` | ObjectId | — | — | ref `ProductVariant` |
| `locationId` | ObjectId | ✅ | — | ref `Location` |
| `onHand` | Number | — | `0` | Physical stock count |
| `reserved` | Number | — | `0` | Reserved for pending orders |
| `incoming` | Number | — | `0` | Expected incoming stock |
| `safetyStock` | Number | — | `0` | Safety stock level |
| `reorderPoint` | Number | — | `0` | Reorder alert threshold |

**Virtual:** `available` = `max(0, onHand - reserved)`

**Indexes:**
- `{ productId: 1, variantId: 1, locationId: 1 }` — unique, partial
- `{ locationId: 1 }`
- `{ productId: 1, variantId: 1 }`

---

## 27. StockLedger

**File:** `src/modules/inventory/models/stock-ledger.model.js`  
**Collection:** `stockledgers`  
**Timestamps:** `createdAt` only

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `productId` | ObjectId | ✅ | — | ref `Product` |
| `variantId` | ObjectId | — | — | ref `ProductVariant` |
| `locationId` | ObjectId | ✅ | — | ref `Location` |
| `qty` | Number | ✅ | — | Quantity changed (can be negative) |
| `direction` | String | ✅ | — | enum: `['IN','OUT','RESERVE','RELEASE','ADJUST','TRANSFER_IN','TRANSFER_OUT']` |
| `reason` | String | — | `'SYSTEM'` | enum: `['ORDER','PO','ADJUSTMENT','TRANSFER','RETURN','RESERVATION','FULFILLMENT','RECONCILIATION','SYSTEM']` |
| `refType` | String | — | `'ORDER'` | enum: `['ORDER','PO','ADJUSTMENT','TRANSFER','RETURN','RESERVATION']` |
| `refId` | String | — | — | Reference document ID |
| `occurredAt` | Date | — | `new Date()` | |
| `actor` | String | — | — | User who performed the action |
| `metadata` | Map\<Mixed\> | — | — | |

**Indexes:**
- `{ occurredAt: -1 }`
- `{ productId: 1, variantId: 1, locationId: 1, occurredAt: -1 }`

---

## 28. Location

**File:** `src/modules/inventory/models/location.model.js`  
**Collection:** `locations`  
**Timestamps:** `createdAt`, `updatedAt`

**Embedded — GEO_SCHEMA (_id: false):**

| Field | Type |
|-------|------|
| `lat` | Number |
| `lng` | Number |
| `pincode` | String |
| `country` | String |
| `region` | String |

**Fields:**

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `code` | String | ✅ | — | Unique identifier |
| `name` | String | ✅ | — | |
| `type` | String | ✅ | `'WAREHOUSE'` | enum: `['WAREHOUSE','STORE','DROPSHIP','BUFFER']` |
| `geo` | GEO_SCHEMA | — | `{}` | Geographic coordinates and address |
| `priority` | Number | — | `0` | Fulfillment priority (higher = preferred) |
| `active` | Boolean | — | `true` | |
| `metadata` | Map\<Mixed\> | — | — | |
| `deletedAt` | Date | — | `null` | Soft delete |

**Instance method:** `isDropship()` — returns `type === 'DROPSHIP'`

**Indexes:**
- `{ code: 1 }` — unique, case-insensitive, partial (deletedAt: null)
- `{ 'geo.country': 1, 'geo.region': 1, 'geo.pincode': 1 }` — unique, sparse
- `{ active: 1, priority: -1 }`
- `{ deletedAt: 1 }`

---

## 29. Reservation

**File:** `src/modules/inventory/reservation.model.js`  
**Collection:** `reservations`  
**Timestamps:** `createdAt`, `updatedAt`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `orderId` | ObjectId | ✅ | — | ref `Order`, indexed |
| `productId` | ObjectId | ✅ | — | ref `Product`, indexed |
| `variantId` | ObjectId | — | `null` | ref `ProductVariant` |
| `userId` | ObjectId | — | — | ref `User`, indexed |
| `locationId` | ObjectId | ✅ | — | ref `Location`, indexed |
| `reservedQty` | Number | ✅ | — | min 1 |
| `status` | String | — | `'active'` | enum: `['active','cancelled','expired','converted']` |
| `expiryTimestamp` | Date | — | — | When reservation auto-expires |
| `notes` | String | — | — | |
| `releasedAt` | Date | — | — | |
| `convertedAt` | Date | — | — | |
| `metadata` | Map\<Mixed\> | — | — | |

**Index:** `{ orderId: 1, productId: 1, variantId: 1, locationId: 1 }`

---

## 30. TransferOrder

**File:** `src/modules/inventory/models/transfer-order.model.js`  
**Collection:** `transferorders`  
**Timestamps:** `createdAt`, `updatedAt`

**Embedded — transferLineSchema (_id: false):**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `productId` | ObjectId | ✅ | ref `Product` |
| `variantId` | ObjectId | — | ref `ProductVariant` |
| `qty` | Number | ✅ | min 1 |

**Fields:**

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `fromLocationId` | ObjectId | ✅ | — | ref `Location` |
| `toLocationId` | ObjectId | ✅ | — | ref `Location` |
| `lines` | [transferLineSchema] | — | — | Must have ≥1 line |
| `status` | String | — | `'DRAFT'` | enum: `['DRAFT','REQUESTED','IN_TRANSIT','RECEIVED','CANCELLED']` |
| `metadata` | Map\<Mixed\> | — | — | |

**Indexes:**
- `{ status: 1, createdAt: -1 }`
- `{ fromLocationId: 1, toLocationId: 1, status: 1 }`

---

## 31. ShippingZone

**File:** `src/modules/shipping/shipping-zone.model.js`  
**Collection:** `shippingzones`  
**Timestamps:** `createdAt`, `updatedAt`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `name` | String | ✅ | — | unique |
| `countries` | [String] | ✅ | — | Must have ≥1 |
| `states` | [String] | — | `[]` | Filter by state |
| `postalCodePatterns` | [String] | — | `[]` | Regex patterns |
| `isActive` | Boolean | — | `true` | |
| `priority` | Number | — | `0` | |

**Indexes:**
- `{ countries: 1, isActive: 1 }`
- `{ name: 1 }` — unique

---

## 32. ShippingMethod

**File:** `src/modules/shipping/shipping-method.model.js`  
**Collection:** `shippingmethods`  
**Timestamps:** `createdAt`, `updatedAt`

**Embedded — weightTierSchema (_id: false):**

| Field | Type | Required |
|-------|------|----------|
| `minWeight` | Number | ✅ |
| `maxWeight` | Number | ✅ |
| `price` | Number | ✅ |

**Embedded — priceTierSchema (_id: false):**

| Field | Type | Required |
|-------|------|----------|
| `minSubtotal` | Number | ✅ |
| `maxSubtotal` | Number | — |
| `price` | Number | ✅ |

**Fields:**

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `name` | String | ✅ | — | |
| `code` | String | ✅ | — | uppercase, unique |
| `description` | String | — | — | |
| `zones` | [ObjectId] | ✅ | — | ref `ShippingZone` |
| `rateType` | String | ✅ | — | enum: `['flat','weight_based','price_based','free']` |
| `flatRate` | Number | — | `0` | |
| `weightTiers` | [weightTierSchema] | — | `[]` | |
| `priceTiers` | [priceTierSchema] | — | `[]` | |
| `minSubtotal` | Number | — | `0` | |
| `freeAbove` | Number | — | `null` | Free shipping above this cart value |
| `currency` | String | — | `DEFAULT_CURRENCY` | |
| `estimatedMinDays` | Number | — | — | |
| `estimatedMaxDays` | Number | — | — | |
| `sortOrder` | Number | — | `0` | |
| `isActive` | Boolean | — | `true` | |

**Indexes:**
- `{ zones: 1, isActive: 1 }`
- `{ code: 1 }` — unique

---

## 33. TaxZone

**File:** `src/modules/tax/tax-zone.model.js`  
**Collection:** `taxzones`  
**Timestamps:** `createdAt`, `updatedAt`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `name` | String | ✅ | — | unique |
| `countries` | [String] | ✅ | — | |
| `states` | [String] | — | `[]` | |
| `description` | String | — | — | |
| `isActive` | Boolean | — | `true` | |
| `priority` | Number | — | `0` | |

**Indexes:**
- `{ countries: 1, isActive: 1 }`
- `{ name: 1 }` — unique

---

## 34. TaxRule

**File:** `src/modules/tax/tax-rule.model.js`  
**Collection:** `taxrules`  
**Timestamps:** `createdAt`, `updatedAt`

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `name` | String | ✅ | — | |
| `zone` | ObjectId | ✅ | — | ref `TaxZone`, indexed |
| `category` | ObjectId | — | `null` | ref `Category` — for category-specific tax |
| `calcType` | String | — | `'percentage'` | enum: `['percentage','fixed']` |
| `rate` | Number | ✅ | — | ≤1 for percentage type |
| `priority` | Number | — | `0` | |
| `isActive` | Boolean | — | `true` | |
| `inclusive` | Boolean | — | `false` | VAT-inclusive mode |
| `label` | String | — | `'Tax'` | Display label |

**Index:** `{ zone: 1, category: 1, isActive: 1 }`

---

## 35. CurrencyRate

**File:** `src/modules/pricing/currency-rate.model.js`  
**Collection:** `currencyrates`  
**Timestamps:** `createdAt`, `updatedAt`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `baseCurrency` | String | ✅ | uppercase |
| `currency` | String | ✅ | uppercase |
| `rate` | Number | ✅ | min 0, exchange rate multiplier |
| `source` | String | — | Rate source identifier |
| `metadata` | Map\<Mixed\> | — | |

**Index:** `{ baseCurrency: 1, currency: 1 }` — unique

---

## 36. IdempotencyKey

**File:** `src/modules/ops/idempotency-key.model.js`  
**Collection:** `idempotencykeys`  
**Timestamps:** disabled

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `key` | String | ✅ | Client-provided idempotency key |
| `method` | String | ✅ | HTTP method |
| `path` | String | ✅ | Request path |
| `user` | ObjectId | — | ref `User` |
| `createdAt` | Date | — | Default: `Date.now` |

**Indexes:**
- `{ key: 1, method: 1, path: 1, user: 1 }` — unique (dedup)
- `{ createdAt: 1 }` — TTL (24 hours auto-delete)

---

## Entity Relationship Summary

```
User ──┬── Address (1:many)
       ├── Wishlist (1:1)
       ├── Cart (1:1 active)
       ├── Order (1:many)
       ├── Review (1:many)
       ├── Notification (1:many)
       ├── RefreshToken (1:many)
       ├── PasswordResetToken (1:many)
       └── EmailToken (1:many)

Product ──┬── Category (many:1)
          ├── Brand (many:1)
          ├── ProductAttribute (1:many) ── ProductOption (1:many)
          ├── ProductVariant (1:many) ── attributeSelections → [Attribute, Option]
          ├── Review (1:many)
          └── StockItem (1:many per location)

Order ──┬── Shipment (1:many)
        ├── OrderTimeline (1:many)
        ├── ReturnRequest (1:many)
        ├── PaymentTransaction (1:many)
        ├── Refund (1:many)
        └── Reservation (1:many)

Location ──┬── StockItem (1:many)
           └── TransferOrder (many:many via from/to)

ShippingZone ── ShippingMethod (many:many)
TaxZone ── TaxRule (1:many)
CurrencyRate (standalone, keyed by baseCurrency+currency)
```
