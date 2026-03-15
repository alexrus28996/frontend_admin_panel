# Admin Panel API Reference

> All API endpoints needed for the **admin dashboard / admin panel**.  
> Base URL: `http://localhost:4001/api`  
> **All admin endpoints require:** `Authorization: Bearer <token>` with a user who has the `admin` role.  
> Admin users bypass all permission checks automatically.

---

## Table of Contents

1. [Dashboard & Metrics](#1-dashboard--metrics)
2. [User Management](#2-user-management)
3. [Product Management](#3-product-management)
4. [Category Management](#4-category-management)
5. [Brand Management](#5-brand-management)
6. [Order Management](#6-order-management)
7. [Coupon Management](#7-coupon-management)
8. [Inventory Management](#8-inventory-management)
9. [Shipping Configuration](#9-shipping-configuration)
10. [Tax Configuration](#10-tax-configuration)
11. [Currency & Pricing](#11-currency--pricing)
12. [Payment & Transaction Management](#12-payment--transaction-management)
13. [Returns & Refunds](#13-returns--refunds)
14. [Shipment Management](#14-shipment-management)
15. [Review Moderation](#15-review-moderation)
16. [File Uploads](#16-file-uploads)
17. [Audit Logs](#17-audit-logs)
18. [Reports](#18-reports)
19. [Reservations](#19-reservations)

---

## 1. Dashboard & Metrics

### GET `/admin/metrics`
Get dashboard overview metrics.

**Response (200):**
```json
{
  "usersTotal": 1250,
  "usersActive": 1180,
  "adminsCount": 3,
  "productsCount": 450,
  "ordersTotal": 3200,
  "ordersByStatus": {
    "pending": 45,
    "paid": 120,
    "shipped": 85,
    "delivered": 2890,
    "cancelled": 50,
    "refunded": 10
  },
  "revenueLast7Days": 15230.50
}
```

---

### GET `/admin/reports/sales`
Sales report with date grouping.

**Query:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `from` | string | — | Start date (ISO format) |
| `to` | string | — | End date (ISO format) |
| `groupBy` | string | `'day'` | Grouping: `'day'`, `'week'`, `'month'` |

**Response (200):**
```json
{
  "groupBy": "day",
  "series": [
    { "_id": "2026-03-14", "revenue": 2150.00, "orders": 15 },
    { "_id": "2026-03-15", "revenue": 3200.00, "orders": 22 }
  ]
}
```

---

### GET `/admin/reports/top-products`
Top-selling products.

**Query:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `from` | string | — | Start date |
| `to` | string | — | End date |
| `by` | string | `'quantity'` | Sort by: `'quantity'` or `'revenue'` |
| `limit` | number | 10 | Number of results |

**Response (200):**
```json
{
  "by": "quantity",
  "items": [
    { "productId": "...", "name": "Premium T-Shirt", "totalQuantity": 250, "totalRevenue": 7497.50 }
  ]
}
```

---

### GET `/admin/reports/top-customers`
Top customers by revenue or order count.

**Query:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `from` | string | — | Start date |
| `to` | string | — | End date |
| `by` | string | `'revenue'` | Sort by: `'revenue'` or `'orders'` |
| `limit` | number | 10 | Number of results |

**Response (200):**
```json
{
  "by": "revenue",
  "items": [
    { "userId": "...", "name": "John Doe", "email": "john@example.com", "totalOrders": 15, "totalRevenue": 2350.00 }
  ]
}
```

---

## 2. User Management

### GET `/admin/users`
List all users with search.

**Query:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | — | Search by name or email |
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |

**Response (200):**
```json
{
  "items": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "roles": ["customer"],
      "permissions": [],
      "isActive": true,
      "isVerified": true,
      "createdAt": "2026-01-10T..."
    }
  ],
  "total": 1250,
  "page": 1,
  "pages": 63
}
```

---

### GET `/admin/users/:id`
Get user details by ID.

**Response (200):**
```json
{ "user": { ... } }
```

---

### PATCH `/admin/users/:id`
Update user (activate/deactivate).

**Body:**
```json
{
  "isActive": false
}
```
**Response (200):**
```json
{ "user": { ... } }
```

---

### POST `/admin/users/:id/promote`
Promote a user to admin role.

**Response (200):**
```json
{ "user": { "roles": ["customer", "admin"], ... } }
```

---

### POST `/admin/users/:id/demote`
Remove admin role from a user.

**Response (200):**
```json
{ "user": { "roles": ["customer"], ... } }
```

---

### GET `/admin/users/:id/permissions`
Get a user's assigned permissions.

**Response (200):**
```json
{
  "userId": "...",
  "permissions": ["product:create", "product:edit", "order:view"]
}
```

---

### POST `/admin/users/:id/permissions`
Replace a user's permissions entirely.

**Body:**
```json
{
  "permissions": ["product:create", "product:edit", "product:delete", "order:view"]
}
```
**Response (200):**
```json
{ "userId": "...", "permissions": [...] }
```

---

### PATCH `/admin/users/:id/permissions/add`
Add permissions to a user (append).

**Body:**
```json
{
  "permissions": ["coupon:create", "coupon:edit"]
}
```
**Response (200):**
```json
{ "userId": "...", "permissions": [...] }
```

---

### PATCH `/admin/users/:id/permissions/remove`
Remove specific permissions from a user.

**Body:**
```json
{
  "permissions": ["coupon:create"]
}
```
**Response (200):**
```json
{ "userId": "...", "permissions": [...] }
```

---

### Available Permissions (38 total)

| Permission Key | Value | Category |
|---------------|-------|----------|
| `PRODUCT_CREATE` | `product:create` | Catalog |
| `PRODUCT_EDIT` | `product:edit` | Catalog |
| `PRODUCT_DELETE` | `product:delete` | Catalog |
| `CATEGORY_CREATE` | `category:create` | Catalog |
| `CATEGORY_EDIT` | `category:edit` | Catalog |
| `CATEGORY_DELETE` | `category:delete` | Catalog |
| `CATEGORY_RESTORE` | `category:restore` | Catalog |
| `BRAND_CREATE` | `brand:create` | Catalog |
| `BRAND_EDIT` | `brand:edit` | Catalog |
| `BRAND_DELETE` | `brand:delete` | Catalog |
| `INVENTORY_MANAGE` | `inventory:manage` | Inventory |
| `INVENTORY_LOCATION_VIEW` | `inventory:location:view` | Inventory |
| `INVENTORY_LOCATION_CREATE` | `inventory:location:create` | Inventory |
| `INVENTORY_LOCATION_EDIT` | `inventory:location:edit` | Inventory |
| `INVENTORY_LOCATION_DELETE` | `inventory:location:delete` | Inventory |
| `INVENTORY_TRANSFER_VIEW` | `inventory:transfer:view` | Inventory |
| `INVENTORY_TRANSFER_CREATE` | `inventory:transfer:create` | Inventory |
| `INVENTORY_TRANSFER_EDIT` | `inventory:transfer:edit` | Inventory |
| `INVENTORY_TRANSFER_DELETE` | `inventory:transfer:delete` | Inventory |
| `INVENTORY_LEDGER_VIEW` | `inventory:ledger:view` | Inventory |
| `ORDER_VIEW` | `order:view` | Orders |
| `ORDER_CREATE` | `order:create` | Orders |
| `ORDER_MANAGE` | `order:manage` | Orders |
| `ORDERS_TIMELINE_WRITE` | `orders:timeline:write` | Orders |
| `COUPON_VIEW` | `coupon:view` | Coupons |
| `COUPON_CREATE` | `coupon:create` | Coupons |
| `COUPON_EDIT` | `coupon:edit` | Coupons |
| `COUPON_DELETE` | `coupon:delete` | Coupons |
| `REVIEW_MODERATE` | `review:moderate` | Reviews |
| `REVIEW_DELETE` | `review:delete` | Reviews |
| `RETURN_VIEW` | `return:view` | Returns |
| `RETURN_MANAGE` | `return:manage` | Returns |
| `SHIPMENT_VIEW` | `shipment:view` | Shipments |
| `SHIPMENT_CREATE` | `shipment:create` | Shipments |
| `SHIPMENT_EDIT` | `shipment:edit` | Shipments |
| `USER_VIEW` | `user:view` | Users |
| `USER_EDIT` | `user:edit` | Users |
| `USER_MANAGE` | `user:manage` | Users |
| `UPLOAD_CREATE` | `upload:create` | Uploads |
| `UPLOAD_DELETE` | `upload:delete` | Uploads |
| `PAYMENTS_EVENTS_VIEW` | `payments:events:view` | Payments |
| `PAYMENTS_REFUND` | `payments:refund` | Payments |
| `AUDIT_VIEW` | `audit:view` | Audit |
| `REPORT_VIEW` | `report:view` | Reports |

**Note:** Admin-role users bypass all permission checks. Permissions are for non-admin staff roles (warehouse_manager, ops_admin, support).

---

## 3. Product Management

### GET `/admin/products`
List all products (includes hidden, inactive, soft-deleted).

**Query:** `q`, `category`, `visibility`, `hasVariants`, `page`, `limit`  
**Response (200):**
```json
{
  "items": [ ... ],
  "total": 450,
  "page": 1,
  "pages": 23
}
```

---

### GET `/admin/products/:id`
Get product details (admin view — includes deleted products).

**Response (200):**
```json
{ "product": { ... } }
```

---

### POST `/admin/products`
Create a new product.

**Permission:** `PRODUCT_CREATE`  
**Body:**
```json
{
  "name": "Premium T-Shirt",
  "description": "High quality cotton t-shirt",
  "longDescription": "<p>Detailed description in HTML</p>",
  "price": 29.99,
  "compareAtPrice": 39.99,
  "costPrice": 12.00,
  "currency": "USD",
  "images": [
    { "url": "https://cdn.example.com/tshirt.jpg", "alt": "T-shirt front" }
  ],
  "category": "category-object-id",
  "brand": "brand-object-id",
  "sku": "TSHIRT-001",
  "barcode": "1234567890123",
  "tags": ["cotton", "premium", "men"],
  "requiresShipping": true,
  "weight": 0.3,
  "weightUnit": "kg",
  "dimensions": { "length": 30, "width": 20, "height": 5, "unit": "cm" },
  "hasVariants": false,
  "visibility": "visible",
  "taxClass": "standard",
  "metaTitle": "Premium Cotton T-Shirt | MyStore",
  "metaDescription": "Shop premium cotton t-shirts...",
  "metaKeywords": ["t-shirt", "cotton"]
}
```
**Response (201):**
```json
{ "product": { ... } }
```

---

### PUT `/admin/products/:id`
Full update product (all fields).

**Permission:** `PRODUCT_EDIT`  
**Body:** Same as POST  
**Response (200):**
```json
{ "product": { ... } }
```

---

### PATCH `/admin/products/:id`
Partial update product.

**Permission:** `PRODUCT_EDIT`  
**Body:** Any subset of product fields  
**Response (200):**
```json
{ "product": { ... } }
```

---

### DELETE `/admin/products/:id`
Soft-delete a product (sets `deletedAt`).

**Permission:** `PRODUCT_DELETE`  
**Response (200):**
```json
{ "result": { ... } }
```

---

### POST `/admin/products/:id/restore`
Restore a soft-deleted product.

**Permission:** `PRODUCT_EDIT`  
**Response (200):**
```json
{ "product": { ... } }
```

---

### GET `/admin/products/:id/references`
Check if a product is referenced elsewhere (before deletion).

**Response (200):**
```json
{
  "inventory": 5,
  "reviews": 12,
  "orders": 45,
  "shipments": 38
}
```

---

### POST `/admin/products/import`
Bulk import products.

**Body:**
```json
{
  "items": [
    { "name": "Product 1", "price": 19.99, "sku": "P001" },
    { "name": "Product 2", "price": 29.99, "sku": "P002" }
  ]
}
```
**Response (201):**
```json
{
  "inserted": 2,
  "failed": 0,
  "errors": []
}
```

---

### GET `/admin/products/export`
Export all products as JSON or CSV.

**Query:** `format` — `'json'` (default) or `'csv'`  
**Response:** File download

---

### POST `/admin/products/price-bulk`
Bulk price adjustment by percentage.

**Body:**
```json
{
  "factorPercent": 10,
  "filter": {
    "q": "t-shirt",
    "category": "category-id"
  }
}
```
**Response (200):**
```json
{
  "matched": 25,
  "modified": 25,
  "factor": 1.10
}
```

---

### POST `/admin/products/category-bulk`
Bulk reassign products to a category.

**Body:**
```json
{
  "categoryId": "new-category-id",
  "productIds": ["id1", "id2", "id3"]
}
```
**Response (200):**
```json
{
  "matched": 3,
  "modified": 3
}
```

---

### POST `/admin/products/variants-matrix`
Generate a variant matrix preview.

**Body:**
```json
{
  "options": {
    "Color": ["Red", "Blue"],
    "Size": ["S", "M", "L"]
  },
  "base": {
    "skuPrefix": "TSHIRT"
  }
}
```
**Response (200):**
```json
{
  "count": 6,
  "variants": [
    { "sku": "TSHIRT-RED-S", "attributes": { "Color": "Red", "Size": "S" } },
    { "sku": "TSHIRT-RED-M", "attributes": { "Color": "Red", "Size": "M" } }
  ]
}
```

---

### Product Variants (Embedded)

#### POST `/products/:id/variants`
Add a variant to a product.

**Permission:** `PRODUCT_EDIT`  
**Body:**
```json
{
  "sku": "TSHIRT-RED-M",
  "price": 29.99,
  "stock": 50,
  "attributes": { "color": "Red", "size": "M" },
  "isActive": true
}
```
**Response (201):** `{ "product": { ... } }`

#### PUT `/products/:id/variants/:variantId`
Update a variant.

#### DELETE `/products/:id/variants/:variantId`
Remove a variant.

#### POST `/products/:id/variants/generate`
Auto-generate variants from a matrix.

---

### Product Attributes & Options

#### POST `/products/:productId/attributes`
Create an attribute (e.g., "Color", "Size").

**Permission:** `PRODUCT_EDIT`  
**Body:**
```json
{
  "name": "Color",
  "description": "Product color options",
  "sortOrder": 0,
  "isRequired": true
}
```
**Response (201):** `{ "attribute": { ... } }`

#### PUT `/products/:productId/attributes/:attributeId`
Update an attribute.

#### DELETE `/products/:productId/attributes/:attributeId`
Delete an attribute (cascades to options and variants).

#### POST `/products/:productId/attributes/:attributeId/options`
Create an option for an attribute.

**Body:**
```json
{
  "name": "Red",
  "sortOrder": 0,
  "metadata": { "hex": "#FF0000" }
}
```
**Response (201):** `{ "option": { ... } }`

#### PUT `/products/:productId/attributes/:attributeId/options/:optionId`
Update an option.

#### DELETE `/products/:productId/attributes/:attributeId/options/:optionId`
Delete an option (cascades to variants).

---

## 4. Category Management

### GET `/admin/categories`
List categories (supports `includeDeleted` flag).

**Query:**

| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Search by name |
| `parent` | string | Filter by parent ID |
| `includeDeleted` | boolean | Include soft-deleted categories |
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response (200):** `{ "items": [...], "total": ..., "page": ..., "pages": ... }`

---

### GET `/admin/categories/:id`
Get category by ID.

**Query:** `includeDeleted` — boolean  
**Response (200):** `{ "category": { ... } }`

---

### POST `/admin/categories`
Create a category.

**Permission:** `CATEGORY_CREATE`  
**Body:**
```json
{
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "parent": null,
  "image": { "url": "https://...", "alt": "Electronics" },
  "banner": { "url": "https://...", "alt": "Electronics banner" },
  "icon": "laptop",
  "metaTitle": "Electronics | MyStore",
  "metaDescription": "Shop electronics..."
}
```
**Response (201):** `{ "category": { ... } }`

**Notes:** Slug is auto-generated from name.

---

### PUT `/admin/categories/:id`
Update a category.

**Permission:** `CATEGORY_EDIT`  
**Body:** Same structure as POST  
**Response (200):** `{ "category": { ... } }`

---

### DELETE `/admin/categories/:id`
Soft-delete a category.

**Permission:** `CATEGORY_DELETE`  
**Error:** `CATEGORY_HAS_CHILDREN` (400) — Cannot delete a category that has children  
**Response (200):** `{ "result": { ... } }`

---

### POST `/admin/categories/:id/restore`
Restore a soft-deleted category.

**Permission:** `CATEGORY_RESTORE`  
**Response (200):** `{ "category": { ... } }`

---

### GET `/admin/categories/:id/children`
List child categories.

**Response (200):** `{ "items": [...], ... }`

---

### POST `/admin/categories/:id/reorder`
Reorder child categories.

**Permission:** `CATEGORY_EDIT`  
**Body:**
```json
{
  "ids": ["child-id-3", "child-id-1", "child-id-2"]
}
```
**Response (200):** `{ "items": [...], ... }`

---

## 5. Brand Management

### GET `/admin/brands`
List brands.

**Query:** `q` (search), `page`, `limit`  
**Response (200):** `{ "items": [...], ... }`

---

### POST `/admin/brands`
Create a brand.

**Body:**
```json
{
  "name": "Nike",
  "logo": "https://cdn.example.com/nike-logo.png",
  "description": "Just do it"
}
```
**Response (201):** `{ "brand": { ... } }`

---

### GET `/admin/brands/:id`
Get brand by ID.

---

### PUT `/admin/brands/:id`
Update a brand.

---

### DELETE `/admin/brands/:id`
Delete a brand.

**Error:** `BRAND_HAS_PRODUCTS` — Cannot delete brand with associated products  
**Check references first:** `GET /admin/brands/:id/references`

---

### GET `/admin/brands/:id/references`
Check brand references before deletion.

**Response (200):**
```json
{ "products": 15 }
```

---

## 6. Order Management

### GET `/admin/orders`
List all orders (all users, filterable).

**Query:**

| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter: `pending`, `paid`, `shipped`, `delivered`, `cancelled`, `refunded` |
| `paymentStatus` | string | Filter: `unpaid`, `paid`, `refunded` |
| `user` | string | Filter by user ID |
| `from` | string | Start date (ISO) |
| `to` | string | End date (ISO) |
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response (200):**
```json
{
  "items": [
    {
      "_id": "...",
      "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" },
      "status": "pending",
      "paymentStatus": "unpaid",
      "total": 57.82,
      "currency": "USD",
      "items": [...],
      "placedAt": "2026-03-15T..."
    }
  ],
  "total": 3200,
  "page": 1,
  "pages": 160
}
```

---

### GET `/admin/orders/:id`
Get any order by ID (any user's order).

**Response (200):** `{ "order": { ... } }`

---

### PATCH `/admin/orders/:id`
Update order status and/or payment status.

**Body:**
```json
{
  "status": "shipped",
  "paymentStatus": "paid"
}
```
**Response (200):** `{ "order": { ... } }`

**Allowed status transitions:**

| From | Allowed To |
|------|-----------|
| `pending` | `paid`, `shipped`, `cancelled` |
| `paid` | `shipped`, `cancelled` |
| `shipped` | `delivered`, `cancelled` |
| `delivered` | *(terminal state)* |
| `cancelled` | *(terminal state)* |
| `refunded` | *(terminal state)* |

**Side effects:**
- Creates timeline entry with `from` and `to` states
- If cancelling → releases inventory reservations
- Creates in-app notification for the customer

---

### POST `/admin/orders/:id/timeline`
Add a manual timeline entry to an order.

**Permission:** `ORDERS_TIMELINE_WRITE`  
**Body:**
```json
{
  "type": "note",
  "message": "Customer called about shipping address change",
  "meta": { "agentName": "Support Agent" }
}
```
**Response (201):** `{ "success": true }`

---

## 7. Coupon Management

### GET `/admin/coupons`
List coupons.

**Query:** `q` (search), `page`, `limit`  
**Response (200):**
```json
{
  "items": [
    {
      "_id": "...",
      "code": "SUMMER20",
      "description": "20% off summer sale",
      "type": "percent",
      "value": 20,
      "minSubtotal": 50,
      "expiresAt": "2026-09-01T...",
      "isActive": true,
      "perUserLimit": 1,
      "globalLimit": 100,
      "usageCount": 45,
      "includeCategories": [],
      "excludeCategories": [],
      "includeProducts": [],
      "excludeProducts": []
    }
  ],
  "total": 12,
  "page": 1,
  "pages": 1
}
```

---

### POST `/admin/coupons`
Create a coupon.

**Body:**
```json
{
  "code": "SUMMER20",
  "description": "20% off summer sale",
  "type": "percent",
  "value": 20,
  "minSubtotal": 50,
  "expiresAt": "2026-09-01T00:00:00Z",
  "isActive": true,
  "perUserLimit": 1,
  "globalLimit": 100,
  "includeCategories": ["category-id"],
  "excludeCategories": [],
  "includeProducts": [],
  "excludeProducts": ["product-id"]
}
```
**Response (201):** `{ "coupon": { ... } }`

**Coupon types:**
- `percent` — percentage discount (value must be ≤ 100)
- `fixed` — fixed amount discount (capped at cart subtotal)

---

### GET `/admin/coupons/:id`
Get coupon by ID.

---

### PUT `/admin/coupons/:id`
Update a coupon.

**Body:** Same structure as POST  
**Response (200):** `{ "coupon": { ... } }`

---

### DELETE `/admin/coupons/:id`
Delete a coupon.

**Response (200):** `{ "result": { ... } }`

---

## 8. Inventory Management

### GET `/admin/inventory`
List inventory items (stock levels across locations).

**Query:**

| Param | Type | Description |
|-------|------|-------------|
| `product` | string | Filter by product ID |
| `variant` | string | Filter by variant ID |
| `locationId` | string | Filter by location |
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response (200):**
```json
{
  "items": [
    {
      "_id": "...",
      "productId": "...",
      "variantId": null,
      "locationId": "...",
      "onHand": 100,
      "reserved": 5,
      "incoming": 50,
      "safetyStock": 10,
      "reorderPoint": 20,
      "available": 95
    }
  ],
  "total": 200,
  "page": 1,
  "pages": 10
}
```

---

### POST `/admin/inventory/adjustments`
Create a stock adjustment.

**Body:**
```json
{
  "productId": "product-id",
  "variantId": null,
  "locationId": "location-id",
  "qtyChange": 50,
  "reservedChange": 0,
  "reason": "PO received",
  "refId": "po-12345"
}
```
**Response (201):** `{ "inventory": { ... } }`

**Notes:** `qtyChange` can be positive (add stock) or negative (remove stock).

---

### GET `/admin/inventory/adjustments`
List stock adjustment history.

**Query:** `product`, `variant`, `reason`, `direction`, `locationId`, `page`, `limit`  
**Response (200):** `{ "items": [...], ... }`

---

### GET `/admin/inventory/low`
List items below the low-stock threshold.

**Query:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `threshold` | number | 5 | Low stock threshold |
| `page` | number | 1 | |
| `limit` | number | 20 | |

**Response (200):**
```json
{
  "items": [...],
  "total": 15,
  "page": 1,
  "pages": 1,
  "threshold": 5
}
```

---

### Inventory Locations

#### GET `/admin/inventory/locations`
List inventory locations.

**Permission:** `INVENTORY_LOCATION_VIEW`  
**Query:** `type`, `active`, `region`, `country`, `state`, `page`, `limit`  

**Response (200):**
```json
{
  "items": [
    {
      "_id": "...",
      "code": "WH-NYC",
      "name": "New York Warehouse",
      "type": "WAREHOUSE",
      "geo": {
        "lat": 40.7128,
        "lng": -74.006,
        "pincode": "10001",
        "country": "US",
        "region": "Northeast"
      },
      "priority": 10,
      "active": true
    }
  ]
}
```

---

#### POST `/admin/inventory/locations`
Create a location.

**Permission:** `INVENTORY_LOCATION_CREATE`  
**Body:**
```json
{
  "code": "WH-NYC",
  "name": "New York Warehouse",
  "type": "WAREHOUSE",
  "geo": {
    "lat": 40.7128,
    "lng": -74.006,
    "pincode": "10001",
    "country": "US",
    "region": "Northeast"
  },
  "priority": 10,
  "active": true,
  "metadata": { "handlingCost": 2.50 }
}
```
**Response (201):** `{ "location": { ... } }`

**Location types:** `WAREHOUSE`, `STORE`, `DROPSHIP`, `BUFFER`

---

#### GET `/admin/inventory/locations/:id`
Get location details.

#### PUT `/admin/inventory/locations/:id`
Update a location. **Permission:** `INVENTORY_LOCATION_EDIT`

#### DELETE `/admin/inventory/locations/:id`
Soft-delete a location. **Permission:** `INVENTORY_LOCATION_DELETE`

#### POST `/admin/inventory/locations/:id/restore`
Restore a soft-deleted location. **Permission:** `INVENTORY_LOCATION_EDIT`

---

### Inventory Transfers

#### GET `/admin/inventory/transfers`
List transfer orders.

**Permission:** `INVENTORY_TRANSFER_VIEW`  
**Query:** `status`, `fromLocationId`, `toLocationId`, `from`, `to`, `page`, `limit`

---

#### POST `/admin/inventory/transfers`
Create a transfer order.

**Permission:** `INVENTORY_TRANSFER_CREATE`  
**Body:**
```json
{
  "fromLocationId": "source-location-id",
  "toLocationId": "destination-location-id",
  "lines": [
    { "productId": "prod-id", "variantId": null, "qty": 50 },
    { "productId": "prod-id-2", "qty": 25 }
  ],
  "metadata": { "reason": "Restock low-stock location" }
}
```
**Response (201):** `{ "transfer": { ... } }`

---

#### PUT `/admin/inventory/transfers/:id`
Update transfer order (only DRAFT status).

---

#### PATCH `/admin/inventory/transfers/:id/status`
Transition transfer order status.

**Body:**
```json
{ "status": "IN_TRANSIT" }
```

**Status transitions and stock effects:**

| From | Allowed To | Stock Effect |
|------|-----------|-------------|
| `DRAFT` | `REQUESTED`, `CANCELLED` | None |
| `REQUESTED` | `IN_TRANSIT`, `CANCELLED` | None |
| `IN_TRANSIT` | `RECEIVED`, `CANCELLED` | IN_TRANSIT: deducts from source. CANCELLED: restores to source |
| `RECEIVED` | *(terminal)* | Adds to destination |

---

### Inventory Ledger

#### GET `/admin/inventory/ledger`
List all stock movement ledger entries.

**Permission:** `INVENTORY_LEDGER_VIEW`  
**Query:** `productId`, `variantId`, `locationId`, `direction`, `from`, `to`, `page`, `limit`

**Response (200):**
```json
{
  "items": [
    {
      "_id": "...",
      "productId": "...",
      "locationId": "...",
      "qty": 50,
      "direction": "IN",
      "reason": "PO",
      "refType": "PO",
      "refId": "po-123",
      "occurredAt": "2026-03-15T...",
      "actor": "admin-user-id"
    }
  ]
}
```

**Direction values:** `IN`, `OUT`, `RESERVE`, `RELEASE`, `ADJUST`, `TRANSFER_IN`, `TRANSFER_OUT`  
**Reason values:** `ORDER`, `PO`, `ADJUSTMENT`, `TRANSFER`, `RETURN`, `RESERVATION`, `FULFILLMENT`, `RECONCILIATION`, `SYSTEM`

#### GET `/admin/inventory/ledger/:id`
Get single ledger entry.

---

## 9. Shipping Configuration

### Shipping Zones

#### GET `/shipping/zones`
List shipping zones.

**Query:** `active` — boolean filter  
**Response (200):**
```json
{
  "zones": [
    {
      "_id": "...",
      "name": "USA Domestic",
      "countries": ["US"],
      "states": [],
      "postalCodePatterns": [],
      "isActive": true,
      "priority": 10
    }
  ]
}
```

---

#### POST `/shipping/zones`
Create a shipping zone.

**Body:**
```json
{
  "name": "USA Domestic",
  "countries": ["US"],
  "states": ["NY", "CA", "TX"],
  "postalCodePatterns": ["^1\\d{4}$"],
  "isActive": true,
  "priority": 10
}
```
**Response (201):** `{ "zone": { ... } }`

---

#### GET `/shipping/zones/:id`
Get shipping zone.

#### PATCH `/shipping/zones/:id`
Update shipping zone.

#### DELETE `/shipping/zones/:id`
Delete shipping zone (removes from all associated methods).

---

### Shipping Methods

#### GET `/shipping/methods`
List shipping methods.

**Query:** `zone` (filter by zone ID), `active` (boolean)

---

#### POST `/shipping/methods`
Create a shipping method.

**Body:**
```json
{
  "name": "Standard Shipping",
  "code": "STANDARD",
  "description": "5-7 business days",
  "zones": ["zone-id-1", "zone-id-2"],
  "rateType": "flat",
  "flatRate": 5.99,
  "minSubtotal": 0,
  "freeAbove": 75.00,
  "currency": "USD",
  "estimatedMinDays": 5,
  "estimatedMaxDays": 7,
  "sortOrder": 0,
  "isActive": true
}
```

**Rate types:**
- `flat` — Fixed rate (uses `flatRate` field)
- `weight_based` — Rate by total weight (uses `weightTiers` array)
- `price_based` — Rate by cart subtotal (uses `priceTiers` array)
- `free` — Always free

**Weight tiers example:**
```json
{
  "rateType": "weight_based",
  "weightTiers": [
    { "minWeight": 0, "maxWeight": 500, "price": 5.99 },
    { "minWeight": 500, "maxWeight": 2000, "price": 9.99 },
    { "minWeight": 2000, "maxWeight": 10000, "price": 14.99 }
  ]
}
```

**Price tiers example:**
```json
{
  "rateType": "price_based",
  "priceTiers": [
    { "minSubtotal": 0, "maxSubtotal": 50, "price": 7.99 },
    { "minSubtotal": 50, "maxSubtotal": 100, "price": 4.99 },
    { "minSubtotal": 100, "price": 0 }
  ]
}
```

---

#### GET `/shipping/methods/:id`
#### PATCH `/shipping/methods/:id`
#### DELETE `/shipping/methods/:id`

---

## 10. Tax Configuration

### Tax Zones

#### GET `/admin/tax/zones`
List tax zones.

**Query:** `active` — boolean  
**Response (200):**
```json
{
  "zones": [
    {
      "_id": "...",
      "name": "US Federal",
      "countries": ["US"],
      "states": [],
      "isActive": true,
      "priority": 0
    }
  ]
}
```

---

#### POST `/admin/tax/zones`
Create a tax zone.

**Body:**
```json
{
  "name": "California State Tax",
  "countries": ["US"],
  "states": ["CA"],
  "description": "California state sales tax",
  "isActive": true,
  "priority": 10
}
```

---

#### GET `/admin/tax/zones/:id`
#### PATCH `/admin/tax/zones/:id`
#### DELETE `/admin/tax/zones/:id` — Cascading: deactivates all rules in the zone

---

### Tax Rules

#### GET `/admin/tax/rules`
List tax rules.

**Query:** `zone` (filter by zone ID), `active` (boolean)

---

#### POST `/admin/tax/rules`
Create a tax rule.

**Body:**
```json
{
  "name": "CA Sales Tax",
  "zone": "zone-id",
  "category": null,
  "calcType": "percentage",
  "rate": 0.0725,
  "priority": 0,
  "isActive": true,
  "inclusive": false,
  "label": "CA Tax"
}
```

**Calculation types:**
- `percentage` — `rate` is a decimal (0.0725 = 7.25%). Must be ≤ 1.
- `fixed` — `rate` is a fixed amount per order.

**Inclusive vs Exclusive:**
- `inclusive: false` (default) — Tax added on top (sales-tax style): `tax = subtotal × rate`
- `inclusive: true` — Tax included in price (VAT-style): `tax = subtotal - (subtotal / (1 + rate))`

---

#### GET `/admin/tax/rules/:id`
#### PATCH `/admin/tax/rules/:id`
#### DELETE `/admin/tax/rules/:id`

---

### Tax Resolution Preview

#### POST `/admin/tax/resolve`
Preview the resolved tax rate for a given location/category combination.

**Body:**
```json
{
  "country": "US",
  "state": "CA",
  "categoryId": "category-id"
}
```
**Response (200):**
```json
{
  "tax": {
    "rate": 0.0725,
    "label": "CA Tax",
    "inclusive": false,
    "calcType": "percentage"
  }
}
```
or
```json
{ "tax": null }
```

---

## 11. Currency & Pricing

### GET `/admin/currency-rates`
List exchange rates.

**Query:** `baseCurrency` — optional filter  
**Response (200):**
```json
{
  "rates": [
    {
      "_id": "...",
      "baseCurrency": "USD",
      "currency": "EUR",
      "rate": 0.92,
      "source": "manual"
    }
  ]
}
```

---

### POST `/admin/currency-rates`
Create or update an exchange rate (upsert).

**Body:**
```json
{
  "baseCurrency": "USD",
  "currency": "EUR",
  "rate": 0.92,
  "source": "manual"
}
```
**Response (201):** `{ "rate": { ... } }`

**Error:** `FX_RATE_SELF_REFERENCE` — Cannot create rate from a currency to itself

---

### DELETE `/admin/currency-rates/:currency`
Delete an exchange rate.

**Query:** `baseCurrency` — optional (defaults to config base currency)  
**Response (200):** `{ "success": true }`

---

## 12. Payment & Transaction Management

### GET `/admin/transactions`
List payment transactions.

**Query:** `order`, `orderId`, `provider`, `status`, `page`, `limit`  
**Response (200):**
```json
{
  "items": [
    {
      "_id": "...",
      "order": "...",
      "provider": "stripe",
      "status": "succeeded",
      "amount": 5782,
      "currency": "USD",
      "providerRef": "pi_xxx",
      "createdAt": "2026-03-15T..."
    }
  ]
}
```

---

### GET `/admin/transactions/:id`
Get transaction details.

---

### GET `/admin/refunds`
List refunds.

**Query:** `order`, `orderId`, `provider`, `status`, `page`, `limit`

---

### GET `/admin/refunds/:id`
Get refund details.

---

### GET `/admin/payment-events`
List payment webhook events.

**Permission:** `PAYMENTS_EVENTS_VIEW`  
**Query:** `provider`, `type`, `from`, `to`, `page`, `limit`

---

### GET `/admin/payment-events/:id`
Get single payment event.

---

## 13. Returns & Refunds

### GET `/admin/returns`
List all return requests.

**Query:** `status` (filter: `requested`, `approved`, `rejected`, `refunded`), `page`, `limit`  
**Response (200):**
```json
{
  "items": [
    {
      "_id": "...",
      "order": "...",
      "user": "...",
      "status": "requested",
      "reason": "Product does not match description",
      "items": [...],
      "createdAt": "2026-03-15T..."
    }
  ]
}
```

---

### POST `/admin/returns/:id/approve`
Approve a return request. Issues refund and restocks inventory.

**Headers:** `Idempotency-Key` (recommended)  
**Body:**
```json
{
  "locationId": "location-to-restock",
  "items": [
    { "product": "prod-id", "quantity": 1 }
  ],
  "amount": 29.99
}
```
**Response (200):**
```json
{
  "return": { "status": "approved", ... },
  "order": { ... },
  "refund": { ... }
}
```

**Side effects:**
- Creates Stripe refund if payment was via Stripe
- Restocks inventory at specified location
- Updates return status to `approved` and eventually `refunded`
- Updates order payment status if fully refunded

---

### POST `/admin/returns/:id/reject`
Reject a return request.

**Response (200):**
```json
{ "return": { "status": "rejected", ... } }
```

---

## 14. Shipment Management

### GET `/admin/shipments`
List all shipments.

**Query:** `order`, `orderId`, `page`, `limit`

---

### POST `/admin/orders/:id/shipments`
Create a shipment for an order.

**Body:**
```json
{
  "carrier": "DHL",
  "tracking": "DHL1234567890",
  "service": "Express",
  "items": [
    { "product": "prod-id", "variant": null, "name": "Premium T-Shirt", "quantity": 2 }
  ]
}
```
**Response (201):** `{ "shipment": { ... } }`

---

### GET `/admin/orders/:id/shipments`
List shipments for a specific order.

---

### GET `/admin/shipments/:id`
Get shipment details.

---

## 15. Review Moderation

### POST `/products/:productId/reviews/:reviewId/approve`
Approve a review (makes it publicly visible).

**Role:** `ADMIN` (uses `requireRole`)  
**Response (200):** `{ "review": { "isApproved": true, ... } }`

---

### POST `/products/:productId/reviews/:reviewId/hide`
Hide/reject a review.

**Role:** `ADMIN`  
**Response (200):** `{ "review": { "isApproved": false, ... } }`

---

## 16. File Uploads

### POST `/uploads`
Upload an image to local storage.

**Role:** `ADMIN`  
**Content-Type:** `multipart/form-data`  
**Field:** `file`  
**Response (201):**
```json
{
  "url": "/uploads/filename.jpg",
  "filename": "filename.jpg",
  "mimetype": "image/jpeg",
  "size": 124567
}
```

---

### POST `/uploads/cloudinary`
Upload an image to Cloudinary.

**Role:** `ADMIN`  
**Content-Type:** `multipart/form-data`  
**Field:** `file`  
**Response (201):**
```json
{
  "url": "https://res.cloudinary.com/...",
  "publicId": "ecombackend/abc123",
  "width": 800,
  "height": 600,
  "format": "jpg",
  "bytes": 124567
}
```

---

### POST `/uploads/cloudinary/delete`
Delete a Cloudinary asset.

**Role:** `ADMIN`  
**Body:**
```json
{ "publicId": "ecombackend/abc123" }
```
**Response (200):** `{ "result": { ... } }`

---

## 17. Audit Logs

### GET `/admin/audit`
List audit log entries.

**Permission:** `AUDIT_VIEW`  
**Query:**

| Param | Type | Description |
|-------|------|-------------|
| `user` | string | Filter by user ID |
| `method` | string | Filter: `POST`, `PUT`, `PATCH`, `DELETE` |
| `status` | number | Filter by HTTP response status |
| `path` | string | Filter by request path |
| `from` | string | Start date |
| `to` | string | End date |
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response (200):**
```json
{
  "items": [
    {
      "_id": "...",
      "user": "...",
      "method": "POST",
      "path": "/api/admin/products",
      "status": 201,
      "ip": "192.168.1.1",
      "requestId": "uuid",
      "body": { "name": "...", "password": "[REDACTED]" },
      "meta": { "durationMs": 45 },
      "createdAt": "2026-03-15T..."
    }
  ]
}
```

**Notes:**
- Sensitive fields are redacted: `password`, `newPassword`, `currentPassword`, `token`, `refreshToken`, `jwt`, `secret`
- Only write operations are audited: `POST`, `PUT`, `PATCH`, `DELETE`
- Audited paths: `/api/admin`, `/api/orders`, `/api/payments`, `/api/auth`, `/api/users`, `/api/cart`

---

### GET `/admin/audit/:id`
Get single audit log entry.

---

## 18. Reports

(See [Dashboard & Metrics](#1-dashboard--metrics) for report endpoints)

| Endpoint | Purpose |
|----------|---------|
| `GET /admin/metrics` | Dashboard overview numbers |
| `GET /admin/reports/sales` | Sales over time (day/week/month grouping) |
| `GET /admin/reports/top-products` | Top products by quantity or revenue |
| `GET /admin/reports/top-customers` | Top customers by revenue or order count |

---

## 19. Reservations

### GET `/admin/reservations`
List inventory reservations.

**Query:** `orderId`, `productId`, `status` (`active`, `cancelled`, `expired`, `converted`), `page`, `limit`

**Response (200):**
```json
{
  "items": [
    {
      "_id": "...",
      "orderId": "...",
      "productId": "...",
      "locationId": "...",
      "reservedQty": 2,
      "status": "active",
      "expiryTimestamp": "2026-03-15T10:30:00Z"
    }
  ]
}
```

---

### POST `/admin/reservations/:orderId/release`
Manually release reservations for an order.

**Body:**
```json
{
  "reason": "Manual stock release",
  "notes": "Customer contacted support"
}
```
**Response (200):**
```json
{ "released": 3 }
```

---

## Rate Limits

| Route Group | Window | Max Requests |
|-------------|--------|-------------|
| `/api/*` (global) | 15 min | 200 |
| `/api/auth/*` | 1 min | 20 |
| `/api/uploads/*` | 5 min | 50 |
| `/api/payments/*` | 5 min | 50 |
| `/api/admin/*` | 15 min | ~67 |
