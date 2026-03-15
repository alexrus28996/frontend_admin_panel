# Frontend Integration Guide

> Everything a frontend developer (or AI) needs to know to build admin and user panels that integrate with this backend.  
> Covers: API calling patterns, authentication handling, Stripe integration, file uploads, pagination, error handling, and real-time data patterns.

---

## Table of Contents

1. [API Base Configuration](#1-api-base-configuration)
2. [Authentication Integration](#2-authentication-integration)
3. [API Calling Patterns](#3-api-calling-patterns)
4. [Error Handling](#4-error-handling)
5. [Pagination](#5-pagination)
6. [Stripe Payment Integration](#6-stripe-payment-integration)
7. [File Upload Integration](#7-file-upload-integration)
8. [Notification Polling](#8-notification-polling)
9. [Search & Filtering Patterns](#9-search--filtering-patterns)
10. [Panel Routing & Layout](#10-panel-routing--layout)
11. [User Panel Pages](#11-user-panel-pages)
12. [Admin Panel Pages](#12-admin-panel-pages)
13. [Environment Variables](#13-environment-variables)
14. [Common Patterns & Utilities](#14-common-patterns--utilities)

---

## 1. API Base Configuration

```javascript
// config.js
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
```

| Setting | Value |
|---------|-------|
| API prefix | `/api` |
| Default port | `4000` |
| Content-Type | `application/json` (except file uploads) |
| Auth header | `Authorization: Bearer <accessToken>` |
| CORS | Configured via `CORS_ORIGINS` on the backend |

---

## 2. Authentication Integration

### Token Storage Strategy

```javascript
// RECOMMENDED: Store in memory (most secure)
let accessToken = null;   // In-memory variable
let refreshToken = null;  // In-memory variable (or httpOnly cookie)
let currentUser = null;   // User object from login response

// DO NOT use localStorage for tokens (XSS vulnerable)
```

### Login

```javascript
async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const error = await res.json();
    // error.code = 'INVALID_CREDENTIALS' | 'VALIDATION_ERROR'
    throw error;
  }

  const data = await res.json();
  accessToken = data.token;
  refreshToken = data.refreshToken;
  currentUser = data.user;

  // Schedule auto-refresh (token expires in 15 min)
  scheduleTokenRefresh();

  return data;
}
```

### Registration

```javascript
async function register(name, email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  if (!res.ok) throw await res.json();

  const data = await res.json();
  // NOTE: Registration does NOT return tokens
  // User must call login() separately
  return data.user;
}
```

### Automatic Token Refresh

```javascript
let refreshTimer = null;

function scheduleTokenRefresh() {
  // Refresh 1 minute before expiry (token lives 15 min)
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(performRefresh, 14 * 60 * 1000); // 14 minutes
}

async function performRefresh() {
  if (!refreshToken) return;

  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (res.ok) {
      const data = await res.json();
      accessToken = data.token;
      refreshToken = data.refreshToken; // New refresh token (rotation!)
      currentUser = data.user;
      scheduleTokenRefresh();
    } else {
      // Refresh failed → force re-login
      handleSessionExpired();
    }
  } catch {
    // Network error → try again later
    refreshTimer = setTimeout(performRefresh, 30000);
  }
}

function handleSessionExpired() {
  accessToken = null;
  refreshToken = null;
  currentUser = null;
  clearTimeout(refreshTimer);
  window.location.href = '/login';
}
```

### Logout

```javascript
async function logout() {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
      },
      body: JSON.stringify({ refreshToken })
    });
  } catch {
    // Proceed with local cleanup even if API call fails
  }

  accessToken = null;
  refreshToken = null;
  currentUser = null;
  clearTimeout(refreshTimer);
  window.location.href = '/login';
}
```

### Role-Based Routing

```javascript
function getDefaultRoute(user) {
  if (user.roles.includes('admin')) return '/admin/dashboard';
  if (user.roles.includes('warehouse_manager')) return '/admin/inventory';
  if (user.roles.includes('ops_admin')) return '/admin/inventory';
  if (user.roles.includes('support')) return '/admin/orders';
  return '/';  // Customer → user panel
}

function canAccessAdminPanel(user) {
  return user.roles.some(r =>
    ['admin', 'warehouse_manager', 'ops_admin', 'support'].includes(r)
  );
}

function hasPermission(user, permission) {
  if (user.roles.includes('admin')) return true; // Admin bypasses
  return user.permissions.includes(permission);
}
```

---

## 3. API Calling Patterns

### Base API Client

```javascript
async function apiCall(method, path, body, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    ...(options.isFormData ? {} : { 'Content-Type': 'application/json' }),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // Idempotency key for mutations
  if (options.idempotencyKey) {
    headers['Idempotency-Key'] = options.idempotencyKey;
  }

  const fetchOptions = { method, headers };
  if (body) {
    fetchOptions.body = options.isFormData ? body : JSON.stringify(body);
  }

  let res = await fetch(url, fetchOptions);

  // Auto-refresh on 401
  if (res.status === 401 && refreshToken) {
    await performRefresh();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      res = await fetch(url, { ...fetchOptions, headers });
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({
      code: 'UNKNOWN_ERROR',
      message: res.statusText
    }));
    error.httpStatus = res.status;
    throw error;
  }

  // Handle empty responses (204)
  if (res.status === 204) return null;

  // Handle file downloads
  if (options.responseType === 'blob') return res.blob();

  return res.json();
}

// Convenience methods
const api = {
  get: (path, options) => apiCall('GET', path, null, options),
  post: (path, body, options) => apiCall('POST', path, body, options),
  put: (path, body, options) => apiCall('PUT', path, body, options),
  patch: (path, body, options) => apiCall('PATCH', path, body, options),
  delete: (path, options) => apiCall('DELETE', path, null, options),
};
```

### Usage Examples

```javascript
// Get products with pagination
const products = await api.get('/products?page=1&limit=20');

// Create a product (admin)
const product = await api.post('/admin/products', {
  name: 'New Product',
  price: 29.99,
  category: 'category-id'
});

// Update order status (admin)
const order = await api.patch('/admin/orders/order-id', {
  status: 'shipped'
});

// Idempotent return approval
const result = await api.post('/admin/returns/return-id/approve', body, {
  idempotencyKey: `approve-return-${returnId}-${Date.now()}`
});
```

---

## 4. Error Handling

### Error Response Format

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    { "path": "email", "message": "Invalid email format" }
  ]
}
```

### Error Codes by Category

#### Authentication Errors
| Code | HTTP | User-Facing Message |
|------|------|-------------------|
| `AUTH_HEADER_MISSING` | 401 | "Please log in to continue" |
| `TOKEN_INVALID` | 401 | "Session expired. Please log in again" |
| `INVALID_CREDENTIALS` | 401 | "Invalid email or password" |
| `EMAIL_IN_USE` | 409 | "This email is already registered" |
| `FORBIDDEN` | 403 | "You don't have permission to do this" |

#### Catalog Errors
| Code | HTTP | User-Facing Message |
|------|------|-------------------|
| `PRODUCT_NOT_FOUND` | 404 | "Product not found" |
| `CATEGORY_NOT_FOUND` | 404 | "Category not found" |
| `BRAND_NOT_FOUND` | 404 | "Brand not found" |
| `CATEGORY_HAS_CHILDREN` | 400 | "Cannot delete category with subcategories" |
| `BRAND_HAS_PRODUCTS` | 400 | "Cannot delete brand with products" |
| `DUPLICATE_SKU` | 409 | "This SKU is already in use" |
| `VARIANT_COMBINATION_EXISTS` | 409 | "This variant combination already exists" |

#### Cart & Checkout Errors
| Code | HTTP | User-Facing Message |
|------|------|-------------------|
| `CART_EMPTY` | 400 | "Your cart is empty" |
| `INSUFFICIENT_STOCK` | 400 | "Not enough stock available" |
| `INVALID_QUANTITY` | 400 | "Invalid quantity" |

#### Order Errors
| Code | HTTP | User-Facing Message |
|------|------|-------------------|
| `ORDER_NOT_FOUND` | 404 | "Order not found" |
| `INVALID_STATUS_TRANSITION` | 400 | "This status change is not allowed" |
| `CANCEL_WINDOW_EXPIRED` | 400 | "Cancellation window has expired" |

#### Coupon Errors
| Code | HTTP | User-Facing Message |
|------|------|-------------------|
| `INVALID_COUPON` | 400 | "Coupon is invalid or expired" |
| `COUPON_MIN_SUBTOTAL` | 400 | "Minimum order amount not met" |
| `COUPON_USAGE_LIMIT` | 400 | "Coupon usage limit reached" |

#### Payment Errors
| Code | HTTP | User-Facing Message |
|------|------|-------------------|
| `PAYMENT_INTENT_FAILED` | 400 | "Payment could not be processed" |
| `ALREADY_PAID` | 400 | "This order has already been paid" |
| `REFUND_FAILED` | 502 | "Refund could not be processed" |

### Global Error Handler

```javascript
function handleApiError(error) {
  switch (error.httpStatus) {
    case 401:
      handleSessionExpired();
      break;
    case 403:
      showToast('You don\'t have permission to perform this action', 'error');
      break;
    case 409:
      showToast(error.message || 'Conflict: duplicate operation', 'warning');
      break;
    case 429:
      showToast('Too many requests. Please wait a moment.', 'warning');
      break;
    case 422:
    case 400:
      // Validation or business rule error
      if (error.details) {
        // Field-level validation errors
        return error.details; // Display per-field errors in forms
      }
      showToast(error.message, 'error');
      break;
    default:
      showToast('Something went wrong. Please try again.', 'error');
  }
}
```

---

## 5. Pagination

### Standard Pagination Pattern

All list endpoints follow the same pattern:

**Request:** `GET /api/resource?page=1&limit=20`

**Response:**
```json
{
  "items": [...],
  "total": 150,
  "page": 1,
  "pages": 8
}
```

### Frontend Pagination Component Data

```javascript
async function fetchPaginatedData(endpoint, page = 1, limit = 20, filters = {}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });
  return api.get(`${endpoint}?${params}`);
}

// Usage
const { items, total, page, pages } = await fetchPaginatedData(
  '/admin/orders',
  1,
  20,
  { status: 'pending', from: '2026-01-01' }
);
```

### Default Limits

- Most endpoints: `limit` defaults to `20`, max is `100`
- Products (public): defaults to `20`
- Notifications: defaults to `20`

---

## 6. Stripe Payment Integration

### Prerequisites

- Install Stripe.js: `npm install @stripe/stripe-js` (or use `@stripe/react-stripe-js` for React)
- Get your publishable key from Stripe dashboard
- Backend needs: `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`

### Payment Flow

```javascript
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_your_publishable_key');

async function processPayment(orderId) {
  const stripe = await stripePromise;

  // Step 1: Create PaymentIntent on backend
  const { clientSecret } = await api.post('/payments/stripe/intent', {
    orderId
  });

  // Step 2: Confirm payment with Stripe.js
  const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: cardElement,  // Stripe Elements card component
      billing_details: {
        name: 'John Doe',
        email: 'john@example.com'
      }
    }
  });

  if (error) {
    // Payment failed on client side
    showToast(error.message, 'error');
    return { success: false, error };
  }

  if (paymentIntent.status === 'succeeded') {
    // Payment succeeded!
    // The backend webhook will update the order automatically
    // Poll or redirect to order confirmation
    return { success: true };
  }

  // Handle other statuses (requires_action, processing, etc.)
  return { success: false, status: paymentIntent.status };
}
```

### React Integration Example

```jsx
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_...');

function CheckoutForm({ orderId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      // Get client secret from backend
      const { clientSecret } = await api.post('/payments/stripe/intent', { orderId });

      // Confirm with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) }
      });

      if (error) {
        showToast(error.message, 'error');
      } else if (paymentIntent.status === 'succeeded') {
        // Redirect to order confirmation
        window.location.href = `/orders/${orderId}/confirmation`;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

// Wrap in Elements provider
function CheckoutPage({ orderId }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm orderId={orderId} />
    </Elements>
  );
}
```

### Post-Payment: Polling for Status

The webhook updates the order asynchronously. Poll to confirm:

```javascript
async function waitForPaymentConfirmation(orderId, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 2000)); // Wait 2s between polls
    const { order } = await api.get(`/orders/${orderId}`);
    if (order.paymentStatus === 'paid') return order;
    if (order.status === 'cancelled') throw new Error('Order cancelled');
  }
  throw new Error('Payment confirmation timeout');
}
```

---

## 7. File Upload Integration

### Upload to Local Storage

```javascript
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const result = await apiCall('POST', '/uploads', formData, { isFormData: true });
  // result: { url: "/uploads/filename.jpg", filename, mimetype, size }
  return result;
}
```

### Upload to Cloudinary

```javascript
async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);

  const result = await apiCall('POST', '/uploads/cloudinary', formData, { isFormData: true });
  // result: { url: "https://res.cloudinary.com/...", publicId, width, height, format, bytes }
  return result;
}
```

### Delete from Cloudinary

```javascript
async function deleteCloudinaryImage(publicId) {
  return api.post('/uploads/cloudinary/delete', { publicId });
}
```

### Image Upload Component Pattern

```javascript
function ImageUpload({ onUpload, useCloudinary = false }) {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }

    try {
      const endpoint = useCloudinary ? '/uploads/cloudinary' : '/uploads';
      const formData = new FormData();
      formData.append('file', file);

      const result = await apiCall('POST', endpoint, formData, { isFormData: true });
      onUpload(result); // Pass result to parent
    } catch (error) {
      handleApiError(error);
    }
  };

  return <input type="file" accept="image/*" onChange={handleFileChange} />;
}
```

---

## 8. Notification Polling

The backend uses **in-app notifications** (no WebSockets). Use polling:

```javascript
// Poll for unread count (for notification badge)
let notificationTimer = null;

function startNotificationPolling(intervalMs = 30000) {
  async function poll() {
    try {
      const { count } = await api.get('/notifications/unread-count');
      updateBadge(count); // Update UI badge
    } catch {
      // Silently ignore polling errors
    }
  }

  poll(); // Initial fetch
  notificationTimer = setInterval(poll, intervalMs);
}

function stopNotificationPolling() {
  clearInterval(notificationTimer);
}

// Fetch notification feed
async function getNotifications(page = 1, unreadOnly = false) {
  const params = new URLSearchParams({ page, limit: 20 });
  if (unreadOnly) params.set('unreadOnly', 'true');
  return api.get(`/notifications?${params}`);
}

// Mark as read
async function markAsRead(notificationId) {
  return api.patch(`/notifications/${notificationId}/read`);
}

// Mark all as read
async function markAllAsRead() {
  return api.patch('/notifications/read-all');
}
```

---

## 9. Search & Filtering Patterns

### Product Search (Public)

```javascript
// Full-text search + category filter + sort + pagination
const products = await api.get('/products?' + new URLSearchParams({
  q: 'cotton shirt',           // Search in name, description, tags
  category: 'category-id',     // Filter by category
  brand: 'brand-id',           // Filter by brand
  minPrice: '10',              // Price range
  maxPrice: '100',
  sort: 'price_asc',           // Sort: price_asc, price_desc, newest, name_asc
  page: '1',
  limit: '20'
}));
```

### Admin Order Filtering

```javascript
const orders = await api.get('/admin/orders?' + new URLSearchParams({
  status: 'pending',
  paymentStatus: 'unpaid',
  user: 'user-id',
  from: '2026-01-01',
  to: '2026-12-31',
  page: '1',
  limit: '20'
}));
```

### Admin User Search

```javascript
const users = await api.get('/admin/users?' + new URLSearchParams({
  q: 'john',   // Search by name or email
  page: '1',
  limit: '20'
}));
```

### Admin Inventory Filtering

```javascript
const inventory = await api.get('/admin/inventory?' + new URLSearchParams({
  product: 'product-id',
  locationId: 'location-id',
  page: '1',
  limit: '20'
}));
```

---

## 10. Panel Routing & Layout

### URL Structure

**User Panel (customer-facing):**
```
/                          → Home / Product Listing
/products/:slug            → Product Detail
/categories/:slug          → Category Listing
/cart                      → Shopping Cart
/checkout                  → Checkout
/orders                    → My Orders
/orders/:id                → Order Detail
/orders/:id/confirmation   → Post-payment Confirmation
/profile                   → My Profile
/addresses                 → My Addresses
/wishlist                  → Wishlist
/notifications             → Notifications
/login                     → Login
/register                  → Register
/forgot-password           → Forgot Password
/reset-password            → Password Reset Form
/verify-email              → Email Verification
```

**Admin Panel:**
```
/admin/dashboard           → Dashboard & Metrics
/admin/orders              → Order Management
/admin/orders/:id          → Order Detail (admin view)
/admin/products            → Product Management
/admin/products/new        → Create Product
/admin/products/:id/edit   → Edit Product
/admin/categories          → Category Management
/admin/brands              → Brand Management
/admin/inventory           → Inventory Overview
/admin/inventory/locations → Location Management
/admin/inventory/transfers → Transfer Orders
/admin/inventory/low-stock → Low Stock Alerts
/admin/coupons             → Coupon Management
/admin/users               → User Management
/admin/users/:id           → User Detail & Permissions
/admin/shipping            → Shipping Zones & Methods
/admin/tax                 → Tax Configuration
/admin/currency            → Currency Rates
/admin/returns             → Return Requests
/admin/transactions        → Payment Transactions
/admin/shipments           → Shipment Management
/admin/reviews             → Review Moderation
/admin/audit               → Audit Logs
/admin/reports             → Sales Reports
```

---

## 11. User Panel Pages

### Page → API Mapping

| Page | APIs Used |
|------|----------|
| **Home** | `GET /products`, `GET /categories` |
| **Product Detail** | `GET /products/:slug`, `GET /products/:id/reviews`, `POST /cart/items` |
| **Cart** | `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:id`, `DELETE /cart/items/:id`, `POST /cart/coupon`, `DELETE /cart/coupon` |
| **Checkout** | `POST /checkout`, `GET /addresses`, `GET /shipping/rates` |
| **Payment** | `POST /payments/stripe/intent` + Stripe.js |
| **My Orders** | `GET /orders` |
| **Order Detail** | `GET /orders/:id`, `GET /orders/:id/invoice`, `POST /orders/:id/cancel`, `POST /orders/:id/returns` |
| **Profile** | `GET /auth/me`, `PATCH /auth/profile`, `POST /auth/password/change` |
| **Addresses** | `GET /addresses`, `POST /addresses`, `PUT /addresses/:id`, `DELETE /addresses/:id`, `PATCH /addresses/:id/default` |
| **Wishlist** | `GET /wishlist`, `POST /wishlist`, `DELETE /wishlist/:productId` |
| **Notifications** | `GET /notifications`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`, `GET /notifications/unread-count` |

---

## 12. Admin Panel Pages

### Page → API Mapping

| Page | APIs Used |
|------|----------|
| **Dashboard** | `GET /admin/metrics`, `GET /admin/reports/sales`, `GET /admin/reports/top-products`, `GET /admin/reports/top-customers` |
| **Orders** | `GET /admin/orders`, `GET /admin/orders/:id`, `PATCH /admin/orders/:id`, `POST /admin/orders/:id/timeline` |
| **Products** | `GET /admin/products`, `POST /admin/products`, `PUT /admin/products/:id`, `DELETE /admin/products/:id`, `POST /admin/products/:id/restore`, `POST /admin/products/import`, `GET /admin/products/export`, `POST /admin/products/price-bulk`, `POST /admin/products/category-bulk`, `POST /admin/products/variants-matrix` |
| **Product Edit** | `GET /admin/products/:id`, `PUT /admin/products/:id`, variants CRUD, attributes CRUD |
| **Categories** | `GET /admin/categories`, `POST /admin/categories`, `PUT /admin/categories/:id`, `DELETE /admin/categories/:id`, `POST /admin/categories/:id/restore`, `POST /admin/categories/:id/reorder` |
| **Brands** | `GET /admin/brands`, `POST /admin/brands`, `PUT /admin/brands/:id`, `DELETE /admin/brands/:id`, `GET /admin/brands/:id/references` |
| **Inventory** | `GET /admin/inventory`, `POST /admin/inventory/adjustments`, `GET /admin/inventory/adjustments`, `GET /admin/inventory/low` |
| **Locations** | `GET /admin/inventory/locations`, `POST /admin/inventory/locations`, `PUT /admin/inventory/locations/:id`, `DELETE /admin/inventory/locations/:id`, `POST /admin/inventory/locations/:id/restore` |
| **Transfers** | `GET /admin/inventory/transfers`, `POST /admin/inventory/transfers`, `PUT /admin/inventory/transfers/:id`, `PATCH /admin/inventory/transfers/:id/status` |
| **Coupons** | `GET /admin/coupons`, `POST /admin/coupons`, `PUT /admin/coupons/:id`, `DELETE /admin/coupons/:id` |
| **Users** | `GET /admin/users`, `GET /admin/users/:id`, `PATCH /admin/users/:id`, `POST /admin/users/:id/promote`, `POST /admin/users/:id/demote`, permissions CRUD |
| **Shipping** | `GET /shipping/zones`, `POST /shipping/zones`, `PATCH /shipping/zones/:id`, `DELETE /shipping/zones/:id`, methods CRUD |
| **Tax** | `GET /admin/tax/zones`, zone CRUD, `GET /admin/tax/rules`, rule CRUD, `POST /admin/tax/resolve` |
| **Currency** | `GET /admin/currency-rates`, `POST /admin/currency-rates`, `DELETE /admin/currency-rates/:currency` |
| **Returns** | `GET /admin/returns`, `POST /admin/returns/:id/approve`, `POST /admin/returns/:id/reject` |
| **Transactions** | `GET /admin/transactions`, `GET /admin/refunds`, `GET /admin/payment-events` |
| **Shipments** | `GET /admin/shipments`, `POST /admin/orders/:id/shipments`, `GET /admin/shipments/:id` |
| **Reviews** | product reviews list + `POST /products/:id/reviews/:reviewId/approve`, `POST /products/:id/reviews/:reviewId/hide` |
| **Audit Logs** | `GET /admin/audit` |
| **Reports** | `GET /admin/reports/sales`, `GET /admin/reports/top-products`, `GET /admin/reports/top-customers` |
| **Reservations** | `GET /admin/reservations`, `POST /admin/reservations/:orderId/release` |

---

## 13. Environment Variables

### Backend (.env)

```env
# Server
PORT=4000
NODE_ENV=development
API_PREFIX=/api
APP_NAME=ecombackend

# Database
MONGO_URI=mongodb://localhost:27017/ecombackend

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
PASSWORD_RESET_EXPIRES_IN=1h

# Security
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME_MS=900000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
AUTH_RATE_LIMIT_WINDOW_MS=60000
AUTH_RATE_LIMIT_MAX=20

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your-user
SMTP_PASS=your-pass
EMAIL_FROM=noreply@mystore.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret

# Redis (optional, for BullMQ email queue)
REDIS_URL=redis://localhost:6379
QUEUE_ENABLED=true

# Pricing/Shipping defaults
SHIPPING_FLAT_RATE=5.99
SHIPPING_FREE_LIMIT=75
TAX_DEFAULT_RATE=0
BASE_CURRENCY=USD

# Inventory
RESERVATION_TTL_MS=1800000
RESERVATION_SWEEP_INTERVAL_MS=60000
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 14. Common Patterns & Utilities

### Date Formatting

The backend returns ISO 8601 dates. Format them for display:

```javascript
function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

function formatDateTime(isoString) {
  return new Date(isoString).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}
```

### Currency Formatting

```javascript
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}
```

### Order Status Badges

```javascript
const statusColors = {
  pending: 'yellow',
  paid: 'blue',
  shipped: 'indigo',
  delivered: 'green',
  cancelled: 'red',
  refunded: 'gray'
};

const paymentStatusColors = {
  unpaid: 'yellow',
  paid: 'green',
  refunded: 'gray'
};
```

### Debounced Search

```javascript
function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

const debouncedSearch = debounce(async (query) => {
  const results = await api.get(`/products?q=${encodeURIComponent(query)}`);
  setProducts(results.items);
});
```

### Idempotency Key Generation

```javascript
// Use for critical mutations to prevent duplicates
function generateIdempotencyKey(action, resourceId) {
  return `${action}-${resourceId}-${Date.now()}`;
}

// Usage
await api.post('/admin/returns/return-id/approve', body, {
  idempotencyKey: generateIdempotencyKey('approve-return', returnId)
});
```

### Quantity Input with Stock Validation

```javascript
function QuantityInput({ max, value, onChange }) {
  return (
    <input
      type="number"
      min={1}
      max={max}
      value={value}
      onChange={(e) => {
        const qty = Math.min(Math.max(1, parseInt(e.target.value) || 1), max);
        onChange(qty);
      }}
    />
  );
}
```
