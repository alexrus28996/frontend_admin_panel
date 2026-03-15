# Project Structure & Architecture

> Complete reference for the ecombackend project — a Node.js/Express + MongoDB e-commerce backend API.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js |
| Database | MongoDB (Mongoose ODM) |
| Authentication | JWT (access + refresh tokens, HS256) |
| Payments | Stripe (PaymentIntents + Webhooks) |
| File Uploads | Local disk + Cloudinary |
| Queue | BullMQ + Redis (optional) |
| PDF Generation | PDFKit |
| Logging | Pino (pino-http) |
| Validation | Zod + Joi (dual support) |
| API Docs | OpenAPI 3.0 + Swagger UI |
| Security | Helmet, CORS, Rate Limiting, CSP |

---

## Directory Layout

```
ecombackend/
├── src/
│   ├── app.js                    # Express app factory — middleware stack + route mounting
│   ├── server.js                 # HTTP server bootstrap + DB connection
│   ├── logger.js                 # Pino logger configuration
│   ├── openapi.json              # Generated OpenAPI spec
│   │
│   ├── config/
│   │   ├── index.js              # Loads .env and exports frozen config object
│   │   ├── env.js                # Environment variable validation (envalid)
│   │   ├── constants.js          # Frozen enums: ROLES, ORDER_STATUS, PAYMENT_STATUS, etc.
│   │   └── picking.js            # Warehouse picking algorithm configuration
│   │
│   ├── db/
│   │   └── mongo.js              # MongoDB/Mongoose connection with retry logic
│   │
│   ├── errors/
│   │   ├── index.js              # Error factory: makeError(), errors.badRequest(), etc.
│   │   ├── codes.js              # All 68 error code constants (ERROR_CODES)
│   │   └── messages.js           # Error code → human-readable message mapping
│   │
│   ├── i18n/
│   │   ├── index.js              # t(key, params, locale) translation function
│   │   └── en-US.js              # English locale bundle (errors, timeline, email, pdf, admin)
│   │
│   ├── middleware/
│   │   ├── auth.js               # authRequired, requireRole, requireAnyRole
│   │   ├── checkPermission.js    # Permission-based access control (admin bypasses all)
│   │   ├── validate.js           # Request validation (Zod/Joi dual support)
│   │   ├── errors.js             # HttpError class, 404 handler, global error handler
│   │   ├── audit.js              # Audit logging for admin/critical write operations
│   │   └── idempotency.js        # Idempotency-Key header dedup for POST operations
│   │
│   ├── models/                   # Re-export shims pointing to module models
│   │   ├── User.js               # → modules/users/user.model.js
│   │   ├── Product.js            # → modules/catalog/product.model.js
│   │   ├── Order.js              # → modules/orders/order.model.js
│   │   └── Category.js           # → modules/catalog/category.model.js
│   │
│   ├── modules/                  # Feature modules (model + service + routes + validation)
│   │   ├── audit/                # Audit log model and service
│   │   ├── cart/                 # Shopping cart (model, service, routes, validation)
│   │   ├── catalog/              # Products, Categories, Brands, Attributes, Options, Variants
│   │   ├── checkout/             # Pricing resolution (shipping + tax) for checkout
│   │   ├── coupons/              # Coupon management and validation logic
│   │   ├── inventory/            # Stock management, locations, transfers, ledger, reservations, picking
│   │   ├── notifications/        # In-app notification system
│   │   ├── ops/                  # Idempotency keys, operational tools
│   │   ├── orders/               # Orders, shipments, returns, timeline, invoice generation
│   │   ├── payments/             # Stripe integration, transactions, refunds, payment events
│   │   ├── pricing/              # Currency conversion and exchange rates
│   │   ├── reviews/              # Product reviews with moderation
│   │   ├── shipping/             # Shipping zones, methods, rate calculation
│   │   ├── tax/                  # Tax zones, rules, rate resolution
│   │   └── users/                # User accounts, addresses, wishlist, tokens
│   │
│   ├── interfaces/
│   │   └── http/                 # HTTP route definitions and API router assembly
│   │
│   ├── utils/
│   │   ├── jwt.js                # JWT sign/verify for access & refresh tokens
│   │   ├── permissions.js        # PERMISSIONS enum (38 permissions) + WRITE_PERMISSIONS set
│   │   ├── pagination.js         # Generic paginate(Model, opts) helper
│   │   ├── cloudinary.js         # Cloudinary upload/delete helpers
│   │   ├── uploads.js            # Multer configuration for file uploads
│   │   ├── email.js              # Email sending utilities
│   │   ├── mailer.js             # Email delivery (direct SMTP or BullMQ queue)
│   │   └── errorHandler.js       # Legacy error handler
│   │
│   └── workers/
│       ├── mail.worker.js        # BullMQ mail consumer (concurrency: 5)
│       ├── reservation-cleanup.worker.js  # Periodic sweep of expired reservations
│       └── queues/
│           ├── connection.js     # Redis connection parser for BullMQ
│           └── mail.queue.js     # Mail queue definition and enqueue helper
│
├── uploads/                      # Local file upload storage
│   └── invoices/                 # Generated PDF invoices
│
├── scripts/                      # Maintenance and migration scripts
│   ├── seed-inventory.js         # Seed initial inventory data
│   ├── backfill-inventory.js     # Backfill inventory from legacy product.stock fields
│   ├── check-low-stock.js        # Alert on low stock items
│   ├── migrate-brands.js         # Migration script for brand data
│   ├── order-cleanup.js          # Clean up stale orders
│   ├── remove-product-stock-fields.js  # Remove deprecated stock fields from products
│   └── verify-indexes.js         # Verify MongoDB indexes are correct
│
├── __tests__/                    # Jest test suite
├── docs/                         # Documentation
├── docker-compose.yml            # Docker setup (app + MongoDB)
├── Dockerfile                    # Container build
├── jest.config.mjs               # Jest configuration
├── package.json                  # Dependencies and scripts
└── .env                          # Environment variables (not committed)
```

---

## Module Architecture Pattern

Each module in `src/modules/` follows a consistent pattern:

```
modules/{feature}/
├── {feature}.model.js          # Mongoose schema and model definition
├── {feature}.service.js        # Business logic layer (no HTTP concerns)
├── {feature}.routes.js         # Express route definitions with middleware
└── {feature}.validation.js     # Zod/Joi schemas for request validation
```

**Separation of concerns:**
- **Model** — Schema definition, indexes, hooks, virtuals, instance methods
- **Service** — Pure business logic, database operations, transaction management
- **Routes** — HTTP layer only — parses request, calls service, sends response
- **Validation** — Request shape validation schemas (body, params, query)

---

## API Prefix & Base URL

All API routes are mounted under a configurable prefix:

```
Default: /api
Full URL pattern: http://localhost:4000/api/{resource}
```

Environment variable: `API_PREFIX` (default: `/api`)

---

## Request/Response Format

### Standard Success Response

```json
{
  "items": [...],        // For list endpoints
  "total": 42,           // Total matching records
  "page": 1,             // Current page
  "pages": 3             // Total pages
}
```

or for single resource:

```json
{
  "user": { ... },
  "product": { ... },
  "order": { ... }
}
```

### Standard Error Response

```json
{
  "error": {
    "name": "HttpError",
    "message": "Human readable message",
    "code": "ERROR_CODE_CONSTANT",
    "details": { ... },
    "requestId": "uuid-v4"
  }
}
```

- 5xx errors always return `"Internal Server Error"` (real error hidden)
- 4xx errors return descriptive messages
- `requestId` is echoed from `X-Request-Id` header (auto-generated if not provided)

---

## Middleware Stack Order

Applied in this exact order in `src/app.js`:

1. **Pino HTTP Logger** — Structured request logging with `X-Request-Id`
2. **Request Timing** — Logs `responseTimeMs` on finish
3. **X-Request-Id Header** — Echo request ID back in response
4. **Helmet** — Security headers (CSP optional via `CSP_ENABLED`)
5. **CORS** — Configurable origins via `CORS_ORIGIN` (comma-separated or `*`)
6. **Stripe Webhook Raw Body** — `express.raw()` on `POST /api/payments/stripe/webhook` (before JSON parser)
7. **express.json** — Body parser with configurable size limit (`JSON_BODY_LIMIT`, default `1mb`)
8. **Global Rate Limiter** — 200 req/15min on `API_PREFIX`
9. **Auth Rate Limiter** — 20 req/1min on `/api/auth`
10. **Uploads Rate Limiter** — 50 req/5min on `/api/uploads`
11. **Payments Rate Limiter** — 50 req/5min on `/api/payments`
12. **Admin Rate Limiter** — ~67 req/15min on `/api/admin`
13. **Health Endpoint** — `GET /health` returns `{ status: 'ok', name }`
14. **Static Files** — Serves uploaded files from `/uploads`
15. **Audit Middleware** — Logs admin & critical write operations
16. **Swagger UI** — API docs at `GET /docs`
17. **API Router** — All API routes under `API_PREFIX`
18. **404 Handler** — Catches unmatched routes
19. **Error Handler** — Global error handler

---

## Roles & Access Control

### User Roles

| Role | Value | Description |
|------|-------|-------------|
| `ADMIN` | `'admin'` | Full system access — bypasses all permission checks |
| `CUSTOMER` | `'customer'` | Default role for registered users |
| `WAREHOUSE_MANAGER` | `'warehouse_manager'` | Inventory and warehouse operations |
| `OPS_ADMIN` | `'ops_admin'` | Operations administration |
| `SUPPORT` | `'support'` | Customer support — read-only inventory access |

### Access Control Flow

```
Request → authRequired (JWT verify) → requireRole/requireAnyRole → checkPermission → Handler
```

1. **authRequired** — Verifies JWT, checks blacklist, sets `req.user`
2. **requireRole(role)** — Checks user has specific role
3. **requireAnyRole([roles])** — Checks user has at least one of the roles
4. **checkPermission(permission)** — Checks user has specific permission string; **admin role auto-bypasses**

### Important: Admin Superuser

Users with the `admin` role **automatically bypass all permission checks**. The `checkPermission` middleware short-circuits for admin users, so they never need individual permissions assigned.

---

## Environment Variables

### Required (No Default)

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing access JWTs |

### Key Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Server port |
| `NODE_ENV` | `'development'` | Environment mode |
| `API_PREFIX` | `'/api'` | API route prefix |
| `JWT_EXPIRES_IN` | `'15m'` | Access token TTL |
| `REFRESH_TOKEN_EXPIRES_IN` | `'7d'` | Refresh token TTL |
| `DEFAULT_CURRENCY` | `'USD'` | Default currency code |
| `CORS_ORIGIN` | `'*'` | Allowed CORS origins |
| `API_DEFAULT_PAGE_SIZE` | `20` | Default pagination size |
| `API_MAX_PAGE_SIZE` | `100` | Maximum pagination size |
| `ORDER_AUTO_CANCEL_MINUTES` | `120` | Max time to cancel order (customer) |
| `RESERVATION_EXPIRES_MINUTES` | `30` | Stock reservation expiry |
| `STRIPE_SECRET_KEY` | `''` | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | `''` | Stripe webhook verification secret |
| `LOW_STOCK_THRESHOLD` | `5` | Low stock alert threshold |

See `src/config/env.js` for the complete list of 70+ environment variables.

---

## Database

- **MongoDB** with Mongoose ODM
- **36 Mongoose models** across all modules
- Supports **MongoDB transactions** with standalone fallback
- Uses **TTL indexes** for automatic token/key cleanup
- **Soft delete** pattern (`deletedAt` field) for Products, Categories, Brands, Locations
- **Text indexes** on Product (name, description) for search
