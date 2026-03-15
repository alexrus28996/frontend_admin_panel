# Business Logic & Flows

> Complete reference for all business processes, workflows, and algorithms in the e-commerce backend.  
> This document describes **what happens internally** when each operation is performed.

---

## Table of Contents

1. [Checkout & Order Creation](#1-checkout--order-creation)
2. [Cart Management](#2-cart-management)
3. [Payment Flow (Stripe)](#3-payment-flow-stripe)
4. [Inventory Reservation System](#4-inventory-reservation-system)
5. [Picking Algorithm](#5-picking-algorithm)
6. [Order Status Machine](#6-order-status-machine)
7. [Shipping Rate Calculation](#7-shipping-rate-calculation)
8. [Tax Resolution](#8-tax-resolution)
9. [Coupon Validation & Application](#9-coupon-validation--application)
10. [Return & Refund Flow](#10-return--refund-flow)
11. [Invoice Generation](#11-invoice-generation)
12. [Notification System](#12-notification-system)
13. [Email System](#13-email-system)
14. [Stock Management](#14-stock-management)
15. [Transfer Orders](#15-transfer-orders)
16. [Currency Conversion](#16-currency-conversion)
17. [Product & Variant Rules](#17-product--variant-rules)
18. [Category Rules](#18-category-rules)

---

## 1. Checkout & Order Creation

The checkout process converts a shopping cart into an order. There is no separate "checkout service" — the logic lives in `createOrderFromCart()` in the order service.

### Full Sequence

```
Customer calls: POST /api/checkout

Step 1: Cart Retrieval
├── Find user's ACTIVE cart
├── Cart empty? → throw CART_EMPTY

Step 2: Payment Method
├── Determine COD (Cash on Delivery) or PREPAID
├── Passed in request body: { paymentMethod: "cod" | "prepaid" }

Step 3: Address Resolution
├── If shippingAddress provided → use it
├── Else → load user's default shipping address (Address with type="shipping", isDefault=true)
├── If billingAddress provided → use it
├── Else → load user's default billing address (falls back to shipping if none)

Step 4: Stock Validation (per cart item)
├── Re-fetch Product document (ensure isActive)
├── If product.requiresShipping !== false:
│   ├── getAvailableStock(productId, variantId)
│   └── quantity > available? → throw INSUFFICIENT_STOCK
└── Build reservationItems[] (physical goods only)

Step 5: Item Snapshot
├── Denormalize each cart item:
│   { product, variant, name, price, currency, quantity }
└── Price comes from cart (already validated at add-to-cart time)

Step 6: Price Computation
├── subtotal = Σ(price × quantity)
├── discount = cart.discount (from applied coupon, capped at subtotal)
├── shipping = calcShipping() or fallback to SHIPPING_FLAT_RATE config
│   └── Free if subtotal ≥ SHIPPING_FREE_LIMIT
├── tax = calcTax() or fallback to subtotal × TAX_DEFAULT_RATE
├── total = max(0, subtotal - discount) + shipping + tax

Step 7: Order Creation (MongoDB transaction*)
├── Order.create({ items, addresses, paymentMethod, subtotal,
│     discount, shipping, tax, total, couponCode, currency, ... })
└── * Transaction with standalone fallback (see note below)

Step 8: Cart Conversion
├── cart.status = 'CONVERTED'
├── cart.items = []
└── cart.subtotal = 0

Step 9: Coupon Usage
├── recordCouponUsage(code, userId)
├── $inc: { usageCount: 1 }
└── $push: { usedBy: userId }

Step 10: Timeline
├── Create "created" timeline entry
└── If COD → add "payment_method_cod" entry

Step 11: Invoice Generation
├── PDFKit generates A4 invoice PDF
├── Saved to: uploads/invoices/invoice-{NUMBER}.pdf
└── Returns { invoiceNumber, invoicePath, invoiceUrl }

Step 12: Inventory Reservation
├── quotePickingPlan() → multi-location allocation (see §5)
├── allocatePickingPlan() → increment 'reserved' on StockItem
└── Create Reservation documents (30 min expiry)

Step 13: Email
├── deliverEmail() sends order confirmation
└── Tries BullMQ queue first, falls back to direct SMTP

Step 14: Notification
└── notifyOrderUpdate() → in-app notification
```

**Transaction Handling:**  
Uses `session.withTransaction()`. If MongoDB is standalone (no replica set), catches the `"Transaction numbers are only allowed"` error and re-runs outside a transaction.

### Response

```json
{
  "order": {
    "_id": "...",
    "status": "pending",
    "paymentStatus": "unpaid",
    "paymentMethod": "prepaid",
    "items": [...],
    "subtotal": 59.98,
    "discount": 10.00,
    "shipping": 5.99,
    "tax": 3.62,
    "total": 59.59,
    "invoiceNumber": "A1B2C3D4",
    "invoiceUrl": "/uploads/invoices/invoice-A1B2C3D4.pdf"
  }
}
```

---

## 2. Cart Management

### Data Model

- **One active cart per user** — enforced via a partial unique index (`{ user: 1 } where status = 'active'`).
- Items are **denormalized snapshots**: `{ product, variant, sku, attributes (Map), name, price, currency, quantity }`
- `recalculate()` method: `subtotal = Σ(price × quantity)`

### Operations

#### Add Item

```
1. Validate product exists and isActive
2. If product has variants, resolve variant
3. Calculate price:
   ├── variant.priceOverride exists? → use priceOverride
   ├── variant.priceDelta exists?   → product.price + priceDelta
   └── else                         → product.price
4. Check stock (if requiresShipping !== false):
   └── currentQtyInCart + newQty ≤ availableStock
5. If item already in cart → increment quantity
   Else → push new item
6. Recalculate subtotal
7. Re-validate coupon (if applied) → may remove if no longer valid
```

#### Update Item Quantity

```
1. Set quantity to exact value
2. Re-check stock availability
3. Recalculate subtotal
4. Re-validate coupon
```

#### Remove Item

```
1. Filter item out by product + variant match
2. Recalculate subtotal
3. Re-validate coupon
```

#### Apply Coupon

```
1. findValidCouponByCode(code, { subtotal, userId, productIds })
2. If valid → store couponCode, coupon ref, compute discount
3. If invalid → throw error
```

#### Remove Coupon

```
1. Clear couponCode, coupon ref
2. Set discount = 0
3. total = subtotal
```

---

## 3. Payment Flow (Stripe)

### Overview

```
┌──────────┐     ┌──────────────┐     ┌──────────┐     ┌──────────┐
│ Frontend  │────▶│ POST /stripe │────▶│  Stripe  │────▶│ Webhook  │
│           │     │ /intent      │     │  Server  │     │ Handler  │
│           │     └──────────────┘     └──────────┘     └──────────┘
│           │            │                   │                │
│           │     Returns clientSecret       │                │
│           │◀───────────┘                   │                │
│           │                                │                │
│           │     Stripe.js confirmPayment   │                │
│           │───────────────────────────────▶│                │
│           │                                │                │
│           │                    payment_intent.succeeded      │
│           │                                │───────────────▶│
│           │                                                 │
│           │                              Order updated:     │
│           │                              status=paid,       │
│           │                              reservations→stock │
└──────────┘                                                  │
```

### Step 1: Create PaymentIntent

**Endpoint:** `POST /api/payments/stripe/intent`

```
1. Validate order belongs to user
2. Check not COD and not already paid
3. Convert order.total to minor units (cents):
   ├── Zero-decimal currencies (JPY, KRW): amount as-is
   └── Others: amount × 100
4. stripe.paymentIntents.create({
     amount,
     currency: order.currency,
     metadata: { orderId, userId }
   })
5. Store on order:
   ├── paymentProvider = 'stripe'
   └── transactionId = intent.id
6. Return { clientSecret: intent.client_secret }
```

### Step 2: Frontend Confirms Payment

The frontend uses Stripe.js `confirmPayment()` with the `clientSecret`. Stripe handles the card form, 3D Secure, etc.

### Step 3: Webhook Processing

**Endpoint:** `POST /api/payments/stripe/webhook`  
Content-Type: raw body (not JSON-parsed). Uses `STRIPE_WEBHOOK_SECRET` to verify signatures.

#### `payment_intent.succeeded`

```
1. Idempotency — create PaymentEvent (unique on eventId)
   └── Duplicate? → skip silently
2. Find order by metadata.orderId
3. In a MongoDB transaction:
   a. Set order.paymentStatus = 'paid'
   b. Set order.status = 'paid'
   c. Set order.paidAt = now
   d. Convert reservations to stock deductions:
      └── convertReservationsToStock():
          ├── Find active reservations for this order
          ├── Decrement BOTH onHand AND reserved on StockItem
          └── Set reservation.status = 'converted'
   e. Create PaymentTransaction record
4. Append 'payment_succeeded' timeline entry
```

#### `payment_intent.payment_failed`

Logged but no state change.

#### `charge.refunded` / `refund.*`

```
1. Idempotency via PaymentEvent
2. Process each refund in the event
3. Upsert Refund document (unique on providerRef)
4. If refund succeeded:
   a. Mark PaymentTransactions as 'refunded'
   b. Calculate totalRefunded across all refunds
   c. If totalRefunded ≥ order.total → set order.status = 'refunded'
5. Append 'refund_recorded' timeline entry
```

---

## 4. Inventory Reservation System

### Reservation States

```
active ─────┬──── converted   (payment succeeded — stock permanently deducted)
             ├──── cancelled   (order cancelled — stock released back)
             └──── expired     (timeout — stock released by cleanup worker)
```

### Lifecycle

| Event | Function | What Happens |
|-------|----------|-------------|
| **Order Created** | `reserveOrderItems()` | Runs picking algorithm → increments `reserved` on StockItem → creates Reservation docs with 30-min expiry |
| **Payment Succeeded** | `convertReservationsToStock()` | Finds active reservations → decrements BOTH `onHand` AND `reserved` → status = `converted` |
| **Order Cancelled** | `releaseOrderReservations()` | Decrements `reserved` only (qty back to sellable) → status = `cancelled` |
| **Timeout** | `expireStaleReservations()` | Finds expired active reservations → groups by order → calls release per order → status = `expired` |

### Stock Movement Example

Starting: `onHand: 100, reserved: 0, available: 100`

```
1. Order placed (qty 5):
   onHand: 100, reserved: 5, available: 95
   └── Reservation(status: active, reservedQty: 5, expiry: +30min)

2a. Payment succeeds:
    onHand: 95, reserved: 0, available: 95
    └── Reservation(status: converted)

2b. Order cancelled:
    onHand: 100, reserved: 0, available: 100
    └── Reservation(status: cancelled)

2c. Reservation expires:
    onHand: 100, reserved: 0, available: 100
    └── Reservation(status: expired)
```

### Cleanup Worker

- **Standalone Node.js process** (not part of the main Express server)
- Runs a sweep every 60 seconds (configurable: `RESERVATION_SWEEP_INTERVAL_MS`)
- Uses **MongoDB-based distributed lock** (`_distributed_locks` collection) to prevent overlap across multiple instances
- Lock has TTL → auto-releases if a worker crashes
- Exposes HTTP health endpoint on port 9001 (configurable: `HEALTH_PORT`)

---

## 5. Picking Algorithm

The picking algorithm determines which warehouse(s) to fulfill an order from when the system has multiple inventory locations.

### Configuration

```javascript
// src/config/picking.js
weights: {
  priority:     0.6,   // Location priority (admin-set preference)
  distance:     0.2,   // Proximity to shipping address
  handlingCost: 0.1,   // Cost to handle at this location
  age:          0.1    // Stock age factor
}
allowSplit: configurable (default: false)
```

### Algorithm: `quotePickingPlan()`

```
Input: 
  - items: [{ productId, variantId, qty }]
  - shipTo: { lat, lng } (shipping address geolocation)

Step 1: Normalize Requirements
├── Aggregate items by productId:variantId
└── Build requirements map: { "prod1:var1": 5, "prod2:null": 3 }

Step 2: Fetch Data
├── All active, non-deleted Location docs
└── Batch query StockItem for all location×item combinations

Step 3: Score Each Location
├── priorityScore = normalize(location.priority, max: 100)
├── distanceScore = 1 / (1 + distance_km)
│   └── Distance via Haversine formula from shipTo coordinates
├── handlingScore = 1 / (1 + handlingCost)
│   └── handlingCost from location.metadata
├── ageScore = from location.metadata (default: 0.5)
│
├── availability = min(available/required) across all items at this location
│   └── DROPSHIP locations → availability = 1 (infinite stock)
│
└── baseScore = Σ(weight × score) × (0.5 + 0.5 × availability)

Step 4: Sort Candidates
└── Descending by baseScore

Step 5: Allocation
├── splitAllowed = false:
│   ├── Find first single location with full availability
│   └── None found → { plan: [], fillRate: 0, reason: 'NO_SINGLE_LOCATION' }
│
└── splitAllowed = true:
    ├── Greedily allocate from best-scored locations
    ├── Each location fulfills as much as possible
    └── Continue until all items fulfilled or no more stock

Step 6: SLA Inference
├── ≤50 km  → 1 day delivery
├── ≤250 km → 2 days
├── ≤1000 km → 4 days
└── >1000 km → 7 days

Output: {
  plan: [
    { location, items: [...], distanceKm, score, sla }
  ],
  fillRate: 1.0,    // 0 to 1 (1 = fully fulfilled)
  split: false
}
```

### Allocation Execution: `allocatePickingPlan()`

Translates the plan into stock adjustments:
- For each item in each leg: `adjustStockLevels({ reservedChange: +qty })`
- Creates ledger entries with direction `RESERVE`

---

## 6. Order Status Machine

### Status Transitions

```
┌─────────┐     ┌──────┐     ┌─────────┐     ┌───────────┐
│ PENDING  │────▶│ PAID │────▶│ SHIPPED │────▶│ DELIVERED │
└─────────┘     └──────┘     └─────────┘     └───────────┘
     │              │              │
     │              │              │
     ▼              ▼              ▼
┌───────────┐  ┌───────────┐  ┌───────────┐
│ CANCELLED │  │ CANCELLED │  │ CANCELLED │
└───────────┘  └───────────┘  └───────────┘

                                              ┌──────────┐
                                              │ REFUNDED │
                                              └──────────┘
                                     (set by payment webhook)
```

### Allowed Transitions Map

| From | Allowed To |
|------|-----------|
| `pending` | `paid`, `shipped`, `cancelled` |
| `paid` | `shipped`, `cancelled` |
| `shipped` | `delivered`, `cancelled` |
| `delivered` | *(terminal)* |
| `cancelled` | *(terminal)* |
| `refunded` | *(terminal)* |

### Side Effects by Transition

| Transition | Side Effects |
|-----------|-------------|
| → `paid` | Set `paidAt`, convert reservations to stock, create PaymentTransaction |
| → `shipped` | Timeline entry, notification |
| → `delivered` | Timeline entry, notification |
| → `cancelled` | Release all inventory reservations, timeline, notification |
| → `refunded` | Set by payment webhook when total refunded ≥ order total |

### Customer Cancellation Rules

- Only `PENDING` orders can be cancelled by the customer
- Must be within a **time window**: configurable via `ORDER_AUTO_CANCEL_MINUTES` (default: 120 minutes)
- After the window → customer cannot cancel; must contact support

---

## 7. Shipping Rate Calculation

### Resolution Flow

```
Input: { country, state, postalCode, subtotal, totalWeight }

Step 1: Match Shipping Zones
├── Find active zones where countries[] contains the country
├── Narrow by states[] (if zone specifies states)
└── Narrow by postalCodePatterns[] (regex match on postal code)

Step 2: Find Shipping Methods
├── Methods linked to matched zones
├── Filter: isActive = true
└── Filter: minSubtotal ≤ cart subtotal

Step 3: Calculate Rate per Method
├── rateType = 'free'         → rate = 0
├── rateType = 'flat'         → rate = method.flatRate
├── rateType = 'weight_based' → find tier where totalWeight ∈ [min, max] → tier.price
├── rateType = 'price_based'  → find tier where subtotal ∈ [min, max] → tier.price
│
└── Free-shipping override:
    if method.freeAbove != null && subtotal ≥ freeAbove → rate = 0

Step 4: Return Methods with Rates
└── Client selects from available methods

Fallback (no matching zones):
└── SHIPPING_FLAT_RATE from config (free if subtotal ≥ SHIPPING_FREE_LIMIT)
```

---

## 8. Tax Resolution

### Resolution Flow

```
Input: { country, state, categoryId }

Step 1: Match Tax Zones
├── Find active TaxZone docs matching country
└── Narrow by state (zones with empty states[] match ALL states)

Step 2: Find Tax Rules
├── Active TaxRule docs in matched zones
└── Sort by priority DESC

Step 3: Category-Specific Matching
├── If categoryId matches a rule's category → use that rule (most specific)
└── Else → use first generic rule (no category restriction)

Step 4: Return Tax Config
└── { rate, label, inclusive, calcType }
```

### Tax Calculation Formulas

| Type | Inclusive | Formula |
|------|----------|---------|
| `percentage` | `false` (sales tax) | `tax = subtotal × rate` |
| `percentage` | `true` (VAT-style) | `taxable = subtotal / (1 + rate)` then `tax = subtotal - taxable` |
| `fixed` | — | `tax = rate` (flat amount) |

### Example

```
Tax rule: { rate: 0.0725, calcType: "percentage", inclusive: false, label: "CA Tax" }
Subtotal: $100.00

Tax = $100.00 × 0.0725 = $7.25
Total = $100.00 + $7.25 = $107.25
```

### Fallback

If no zone/rules match → uses `TAX_DEFAULT_RATE` from config: `tax = subtotal × rate`

---

## 9. Coupon Validation & Application

### Validation Chain

When a coupon is applied to a cart, all checks must pass:

```
findValidCouponByCode(code, { subtotal, userId, productIds })

Check 1: Exists and isActive = true
         └── Fail → null

Check 2: Not expired
         └── expiresAt > now (or no expiresAt set)
         └── Fail → null

Check 3: Minimum subtotal met
         └── subtotal ≥ coupon.minSubtotal
         └── Fail → null

Check 4: Global usage limit
         └── coupon.usageCount < coupon.globalLimit
         └── Fail → null

Check 5: Per-user usage limit
         └── count(userId in coupon.usedBy[]) < coupon.perUserLimit
         └── Fail → null

Check 6: Product targeting (if configured)
         ├── includeProducts[] → at least one cart product in list
         ├── excludeProducts[] → no cart product in list
         ├── includeCategories[] → at least one product's category in list
         └── excludeCategories[] → no product's category in list
         └── Fail → null
```

### Discount Calculation

```
computeDiscount(coupon, subtotal):

type = 'percent':
  discount = subtotal × (value / 100)
  Example: subtotal=$100, value=20 → discount=$20

type = 'fixed':
  discount = min(subtotal, value)
  Example: subtotal=$100, value=15 → discount=$15
  Example: subtotal=$10, value=15  → discount=$10 (capped)
```

### Usage Recording

During order creation (inside the transaction):
```javascript
recordCouponUsage(code, userId, { session })
// $inc: { usageCount: 1 }
// $push: { usedBy: userId }
```

### Coupon Re-validation

The coupon is re-validated whenever the cart changes (add/update/remove item). If the coupon becomes invalid (e.g., subtotal drops below minimum), it is automatically removed from the cart.

---

## 10. Return & Refund Flow

### Customer Requests Return

```
POST /api/orders/:id/returns

Preconditions:
├── Order must have paymentStatus = 'paid'
└── Idempotent: if return with status 'requested' or 'approved' exists → return it

Creates:
├── ReturnRequest { order, user, status: 'requested', reason, items }
└── Timeline entry: 'return_requested'
```

### Admin Approves Return

```
POST /api/admin/returns/:id/approve

Step 1: Validate
├── Return exists and status = 'requested'
└── Build restock adjustments:
    ├── Partial return: items[] with per-item quantity and locationId
    └── Full return: uses defaultLocationId from request body

Step 2: Stripe Refund (if applicable)
├── If order.paymentProvider = 'stripe' && transactionId:
│   ├── Calculate amountCents (from items or explicit amount)
│   ├── stripe.refunds.create({ payment_intent, amount? })
│   ├── Create Refund document
│   └── If Stripe call fails → 502 error, abort everything
└── If not Stripe → skip (manual refund)

Step 3: Database Changes (transaction)
├── Restock inventory: adjustStockLevels({ qtyChange: +qty, reason: 'RETURN' })
├── If full return:
│   ├── order.paymentStatus = 'refunded'
│   └── order.status = 'refunded'
├── returnRequest.status = 'refunded'
├── Record refundedAt, approvedBy, approvedAt
└── Mark PaymentTransactions as 'refunded'

Step 4: Post-processing
├── Timeline: 'return_approved'
└── In-app notification to customer
```

### Admin Rejects Return

```
POST /api/admin/returns/:id/reject

├── Set status = 'rejected', rejectedAt
├── Timeline: 'return_rejected'
└── Notification to customer
```

---

## 11. Invoice Generation

Invoked automatically during order creation. Uses **PDFKit**.

### Invoice Structure (A4 PDF)

```
┌──────────────────────────────────────────┐
│              INVOICE                      │
│                                          │
│  Invoice #: A1B2C3D4                     │
│  Date: March 15, 2026                    │
│                                          │
│  Bill To:                                │
│    John Doe                              │
│    123 Main St                           │
│    New York, NY 10001                    │
│    US                                    │
│                                          │
│  ┌──────────────┬─────┬────────┬───────┐ │
│  │ Product      │ Qty │ Price  │ Total │ │
│  ├──────────────┼─────┼────────┼───────┤ │
│  │ T-Shirt Red  │  2  │ $29.99 │$59.98 │ │
│  │ Socks Pack   │  1  │ $9.99  │ $9.99 │ │
│  └──────────────┴─────┴────────┴───────┘ │
│                                          │
│                     Subtotal:  $69.97    │
│                     Discount: -$10.00    │
│                     Shipping:   $5.99    │
│                     Tax:        $4.35    │
│                     ─────────────────    │
│                     TOTAL:     $70.31    │
└──────────────────────────────────────────┘
```

- Invoice number: last 8 characters of order `_id`, uppercased
- Saved to: `uploads/invoices/invoice-{NUMBER}.pdf`
- Returns: `{ invoiceNumber, invoicePath, invoiceUrl }`

---

## 12. Notification System

### Architecture

In-app notifications stored in MongoDB with automatic 90-day TTL cleanup.

### Notification Types

| Type | Created When |
|------|-------------|
| `order_update` | Order placed, status change, cancellation |
| `shipment_update` | Shipment created or updated |
| `refund_processed` | Return approved |
| `review_approved` | Review moderation approved |
| `stock_alert` | Low stock threshold hit |
| `promotion` | Admin-created promotional notification |
| `system` | System-wide announcements |

### Data Model

```json
{
  "user": "user-id",
  "type": "order_update",
  "channel": "in_app",
  "title": "Order Shipped",
  "body": "Your order #ABC123 has been shipped",
  "actionUrl": "/orders/order-id",
  "refModel": "Order",
  "refId": "order-id",
  "isRead": false,
  "readAt": null,
  "meta": { "status": "shipped" }
}
```

### Indexes

- `{ user, isRead, createdAt: -1 }` — efficient feed queries
- `{ createdAt: 1 }` with TTL: 90 days — auto-deletion

### API for Frontend

| Endpoint | Purpose |
|----------|---------|
| `GET /notifications` | Paginated feed (supports `unreadOnly` filter) |
| `PATCH /notifications/:id/read` | Mark single as read |
| `PATCH /notifications/read-all` | Mark all as read |
| `GET /notifications/unread-count` | Badge count |
| `DELETE /notifications/:id` | Delete one |

---

## 13. Email System

### Architecture

```
deliverEmail({ to, subject, text, html })
         │
         ├── QUEUE_ENABLED && REDIS_URL?
         │   ├── YES → BullMQ 'mail' queue
         │   │         ├── Stored in Redis
         │   │         ├── Processed by mail.worker.js (concurrency: 5)
         │   │         ├── Retry: 3 attempts, exponential backoff (2s)
         │   │         └── Worker calls sendEmail()
         │   │
         │   └── Queue fails → fallback to synchronous sendEmail()
         │
         └── NO → synchronous sendEmail()

sendEmail():
  ├── SMTP_HOST + SMTP_USER configured → real Nodemailer transport (pooled, 5 connections)
  └── Not configured → jsonTransport (dev mode: logs to console)
```

### Emails Sent By The System

| Event | Subject | Content |
|-------|---------|---------|
| Order placed | Order confirmation | Order details, items, total |
| Password reset | Password reset | Link to reset form |
| Email verification | Verify your email | Verification link |
| Email change | Confirm email change | Link to confirm new email |

---

## 14. Stock Management

### Stock Formula

```
available = max(0, onHand - reserved)
```

- `onHand` — Physical units at the location
- `reserved` — Units committed to unpaid orders
- `incoming` — Units expected (from transfer orders, POs) — informational only

### `getAvailableStock(productId, variantId)`

```
1. Sum max(0, onHand - reserved) across ALL active, non-deleted locations
2. DROPSHIP locations → return Infinity (unlimited stock)
3. No StockItem docs found → fallback to variant.stock or product.stock field
```

### `adjustStockLevels({ adjustments[], reason, actor, ... })`

Runs in a MongoDB transaction:

```
For each adjustment:
1. Ensure StockItem exists (upsert if needed)
2. Apply changes:
   ├── qtyChange → affects onHand
   ├── reservedChange → affects reserved
   └── incomingChange → affects incoming
3. Guard rails:
   ├── onHand cannot go negative (unless DROPSHIP location)
   ├── reserved cannot go negative
   └── onHand must be ≥ reserved
4. Write StockLedger entry:
   ├── direction: IN/OUT/RESERVE/RELEASE/ADJUST/TRANSFER_IN/TRANSFER_OUT
   └── reason: ORDER/PO/ADJUSTMENT/TRANSFER/RETURN/RESERVATION/FULFILLMENT/RECONCILIATION/SYSTEM
```

### Ledger Directions & Reasons

| Direction | When Used |
|-----------|----------|
| `IN` | Stock added (PO, adjustment, return restock) |
| `OUT` | Stock removed (fulfillment) |
| `RESERVE` | Reservation created |
| `RELEASE` | Reservation cancelled/expired |
| `ADJUST` | Manual stock adjustment |
| `TRANSFER_IN` | Transfer order received at destination |
| `TRANSFER_OUT` | Transfer order shipped from source |

---

## 15. Transfer Orders

### State Machine

```
DRAFT ──── REQUESTED ──── IN_TRANSIT ──── RECEIVED (terminal)
  │            │               │
  └──── CANCELLED (terminal)   │
               └──── CANCELLED │
                               └──── CANCELLED (restores source stock)
```

### Stock Effects

| Transition | Effect |
|-----------|--------|
| `DRAFT → REQUESTED` | No stock movement |
| `REQUESTED → IN_TRANSIT` | Deducts `onHand` from source location |
| `IN_TRANSIT → RECEIVED` | Adds `onHand` to destination location |
| `IN_TRANSIT → CANCELLED` | Restores `onHand` to source location |
| Other → `CANCELLED` | No stock movement needed |

---

## 16. Currency Conversion

### Model

`CurrencyRate` documents: `{ baseCurrency, currency, rate, source }`

### Conversion

```javascript
convertAmount(amount, { fromCurrency, toCurrency })

// Direct rate exists:
result = amount × rate

// Triangulation through base currency:
// e.g., GBP → EUR: GBP → USD (base) → EUR
amountInBase = amount / rateFromBase
result = amountInBase × rateToTarget
```

### Rounding

- Mode: `HALF_UP` (default), `UP`, `DOWN`
- Increment: 0.01 (default)
- Applied after conversion

---

## 17. Product & Variant Rules

### Product Rules

| Rule | Detail |
|------|--------|
| **SKU uniqueness** | Checked globally across all products AND variants |
| **Soft delete** | Sets `deletedAt` + `isActive = false`; can be restored |
| **Delete guards** | Cannot delete if product has: StockItem records, reviews, orders, or shipments |
| **Slug generation** | Auto-generated from product name |
| **Tag normalization** | Trimmed, deduplicated |
| **SKU formatting** | Uppercased automatically |
| **Dimension validation** | If provided, must have all fields (length, width, height, unit) |

### Variant Price Resolution

```
resolveVariantPrice(productPrice, variant):
  1. variant.priceOverride exists → return priceOverride
  2. variant.priceDelta exists   → return productPrice + priceDelta
  3. else                        → return productPrice
```

### Variant Matrix Generation

For products with attributes (Color: Red/Blue, Size: S/M/L):

```
Input options: { Color: ["Red", "Blue"], Size: ["S", "M", "L"] }
SKU prefix: "TSHIRT"

Output (Cartesian product):
  TSHIRT-RED-S    { Color: "Red", Size: "S" }
  TSHIRT-RED-M    { Color: "Red", Size: "M" }
  TSHIRT-RED-L    { Color: "Red", Size: "L" }
  TSHIRT-BLUE-S   { Color: "Blue", Size: "S" }
  TSHIRT-BLUE-M   { Color: "Blue", Size: "M" }
  TSHIRT-BLUE-L   { Color: "Blue", Size: "L" }
```

- Skips combinations that already exist
- Each variant gets a unique `combinationKey`: `Color:Blue|Size:M` (sorted alphabetically)

---

## 18. Category Rules

| Rule | Detail |
|------|--------|
| **Slug generation** | Auto-generated from category name |
| **Hierarchical** | Categories can have parent categories |
| **Soft delete** | Sets `deletedAt`; can be restored |
| **Delete guards** | Cannot delete a category that has child categories (`CATEGORY_HAS_CHILDREN` error) |
| **Reorder** | Child categories can be reordered by providing an ordered array of IDs |
| **Brand delete guards** | Cannot delete a brand that has associated products (`BRAND_HAS_PRODUCTS` error); check references first via `/admin/brands/:id/references` |
