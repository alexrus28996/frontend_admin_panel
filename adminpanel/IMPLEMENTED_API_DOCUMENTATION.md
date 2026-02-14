# Project API Documentation

## Base Configuration

- Base URL: `/api`
- Authentication Type: `JWT Bearer token`
- Global Middleware: `helmet`, `cors`, `pino-http`, request timing logger, `express-rate-limit` (`/api`, stricter on `/api/auth`, `/api/uploads`, `/api/payments`), `express.json`, Stripe raw-body middleware on `/api/payments/stripe/webhook`, audit middleware

---

# Authentication Endpoints

---

## 1️⃣ Request email change (sends verification)

**URL:** `/api/auth/email/change/request`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Request email change (sends verification)

---

### Request

#### JSON Schema (application/json)
```json
{
  "newEmail": "string — required — Derived from implementation – verify manually"
  "baseUrl": "string — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
409 — Email in use
500 — generic server error

---

## 2️⃣ Verify email using token

**URL:** `/api/auth/email/verify`  
**Method:** `POST`  
**Auth Required:** `No`  
**Roles Required:** `None`  

### Description
Verify email using token

---

### Request

#### JSON Schema (application/json)
```json
{
  "token": "string — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- None

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 3️⃣ Request email verification link

**URL:** `/api/auth/email/verify/request`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Request email verification link

---

### Request

#### JSON Schema (application/json)
```json
{
  "baseUrl": "string — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
500 — generic server error

---

## 4️⃣ Login and receive JWT

**URL:** `/api/auth/login`  
**Method:** `POST`  
**Auth Required:** `No`  
**Roles Required:** `None`  

### Description
Login and receive JWT

---

### Request

#### JSON Schema (application/json)
```json
{
  "email": "string — required — Derived from implementation – verify manually"
  "password": "string — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- None

Success Response
Status Code: 200
JSON Schema
```json
{
  "token": "string — optional — Derived from implementation – verify manually"
  "refreshToken": "string — optional — Derived from implementation – verify manually"
  "user": "object — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Invalid credentials
500 — generic server error

---

## 5️⃣ Revoke refresh token (logout)

**URL:** `/api/auth/logout`  
**Method:** `POST`  
**Auth Required:** `No`  
**Roles Required:** `None`  

### Description
Revoke refresh token (logout)

---

### Request

#### JSON Schema (application/json)
```json
{
  "refreshToken": "string — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- None

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 6️⃣ Get current user

**URL:** `/api/auth/me`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Get current user

---

### Request

No request body.

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
{
  "user": "object — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
500 — generic server error

---

## 7️⃣ Change my password

**URL:** `/api/auth/password/change`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Change my password

---

### Request

#### JSON Schema (application/json)
```json
{
  "currentPassword": "string — required — Derived from implementation – verify manually"
  "newPassword": "string — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
500 — generic server error

---

## 8️⃣ Request password reset

**URL:** `/api/auth/password/forgot`  
**Method:** `POST`  
**Auth Required:** `No`  
**Roles Required:** `None`  

### Description
Request password reset

---

### Request

#### JSON Schema (application/json)
```json
{
  "email": "string — required — Derived from implementation – verify manually"
  "baseUrl": "string — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- None

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 9️⃣ Reset password using token

**URL:** `/api/auth/password/reset`  
**Method:** `POST`  
**Auth Required:** `No`  
**Roles Required:** `None`  

### Description
Reset password using token

---

### Request

#### JSON Schema (application/json)
```json
{
  "token": "string — required — Derived from implementation – verify manually"
  "password": "string — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- None

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
500 — generic server error

---

## 10️⃣ Get my preferences

**URL:** `/api/auth/preferences`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Get my preferences

---

### Request

No request body.

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
{
  "preferences": "object — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
500 — generic server error

---

## 11️⃣ Update my preferences

**URL:** `/api/auth/preferences`  
**Method:** `PATCH`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Update my preferences

---

### Request

#### JSON Schema (application/json)
```json
{
  "locale": "string — optional — Derived from implementation – verify manually"
  "notifications": "object — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
500 — generic server error

---

## 12️⃣ Update my profile (name)

**URL:** `/api/auth/profile`  
**Method:** `PATCH`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Update my profile (name)

---

### Request

#### JSON Schema (application/json)
```json
{
  "name": "string — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
500 — generic server error

---

## 13️⃣ Rotate refresh token and get new access token

**URL:** `/api/auth/refresh`  
**Method:** `POST`  
**Auth Required:** `No`  
**Roles Required:** `None`  

### Description
Rotate refresh token and get new access token

---

### Request

#### JSON Schema (application/json)
```json
{
  "refreshToken": "string — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- None

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
500 — generic server error

---

## 14️⃣ Register a new user

**URL:** `/api/auth/register`  
**Method:** `POST`  
**Auth Required:** `No`  
**Roles Required:** `None`  

### Description
Register a new user

---

### Request

#### JSON Schema (application/json)
```json
{
  "name": "string — required — Derived from implementation – verify manually"
  "email": "string — required — Derived from implementation – verify manually"
  "password": "string — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- None

Success Response
Status Code: 201
JSON Schema
```json
{
  "user": "object — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
400 — Validation error
409 — Email exists
500 — generic server error

# Users Endpoints

---

## 15️⃣ List my addresses

**URL:** `/api/addresses`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
List my addresses

---

### Request

No request body.

URL Params
- None

Query Params
- `type` (string) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
500 — generic server error

---

## 16️⃣ Create address

**URL:** `/api/addresses`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Create address

---

### Request

#### JSON Schema (application/json)
```json
{
  "_id": "string — optional — Derived from implementation – verify manually"
  "type": "string — required — Derived from implementation – verify manually"
  "fullName": "string — optional — Derived from implementation – verify manually"
  "line1": "string — required — Derived from implementation – verify manually"
  "line2": "string — optional — Derived from implementation – verify manually"
  "city": "string — optional — Derived from implementation – verify manually"
  "state": "string — optional — Derived from implementation – verify manually"
  "postalCode": "string — optional — Derived from implementation – verify manually"
  "country": "string — optional — Derived from implementation – verify manually"
  "phone": "string — optional — Derived from implementation – verify manually"
  "label": "string — optional — Derived from implementation – verify manually"
  "isDefault": "boolean — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
500 — generic server error

---

## 17️⃣ Delete address

**URL:** `/api/addresses/{id}`  
**Method:** `DELETE`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Delete address

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
404 — Not Found
500 — generic server error

---

## 18️⃣ Get address by id

**URL:** `/api/addresses/{id}`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Get address by id

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
404 — Not Found
500 — generic server error

---

## 19️⃣ Update address

**URL:** `/api/addresses/{id}`  
**Method:** `PUT`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Update address

---

### Request

#### JSON Schema (application/json)
```json
{
  "_id": "string — optional — Derived from implementation – verify manually"
  "type": "string — required — Derived from implementation – verify manually"
  "fullName": "string — optional — Derived from implementation – verify manually"
  "line1": "string — required — Derived from implementation – verify manually"
  "line2": "string — optional — Derived from implementation – verify manually"
  "city": "string — optional — Derived from implementation – verify manually"
  "state": "string — optional — Derived from implementation – verify manually"
  "postalCode": "string — optional — Derived from implementation – verify manually"
  "country": "string — optional — Derived from implementation – verify manually"
  "phone": "string — optional — Derived from implementation – verify manually"
  "label": "string — optional — Derived from implementation – verify manually"
  "isDefault": "boolean — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
404 — Not Found
500 — generic server error

---

## 20️⃣ Set address as default (by type)

**URL:** `/api/addresses/{id}/default`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Set address as default (by type)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
404 — Not Found
500 — generic server error

# Permissions / Roles Endpoints

---

## 21️⃣ List user permissions

**URL:** `/api/admin/users/{id}/permissions`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List user permissions

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 22️⃣ Replace user permissions

**URL:** `/api/admin/users/{id}/permissions`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Replace user permissions

---

### Request

#### JSON Schema (application/json)
```json
{
  "permissions": "array — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 23️⃣ Add permissions to user

**URL:** `/api/admin/users/{id}/permissions/add`  
**Method:** `PATCH`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Add permissions to user

---

### Request

#### JSON Schema (application/json)
```json
{
  "permissions": "array — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 24️⃣ Remove permissions from user

**URL:** `/api/admin/users/{id}/permissions/remove`  
**Method:** `PATCH`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Remove permissions from user

---

### Request

#### JSON Schema (application/json)
```json
{
  "permissions": "array — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

# Products Endpoints

---

## 25️⃣ List brands (admin)

**URL:** `/api/admin/brands`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List brands (admin)

---

### Request

No request body.

URL Params
- None

Query Params
- `q` (string) — Derived from implementation – verify manually
- `page` (integer) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 26️⃣ Create brand (admin)

**URL:** `/api/admin/brands`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Create brand (admin)

---

### Request

#### JSON Schema (application/json)
```json
{
  "name": "string — required — Derived from implementation – verify manually"
  "slug": "string — optional — Derived from implementation – verify manually"
  "description": "string — optional — Derived from implementation – verify manually"
  "isActive": "boolean — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 27️⃣ Delete brand (admin)

**URL:** `/api/admin/brands/{id}`  
**Method:** `DELETE`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Delete brand (admin)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
409 — Conflict (brand has products)
500 — generic server error

---

## 28️⃣ Get brand (admin)

**URL:** `/api/admin/brands/{id}`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Get brand (admin)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 29️⃣ Update brand (admin)

**URL:** `/api/admin/brands/{id}`  
**Method:** `PUT`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Update brand (admin)

---

### Request

#### JSON Schema (application/json)
```json
{
  "name": "string — optional — Derived from implementation – verify manually"
  "slug": "string — optional — Derived from implementation – verify manually"
  "description": "string — optional — Derived from implementation – verify manually"
  "isActive": "boolean — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 30️⃣ List brand references (admin)

**URL:** `/api/admin/brands/{id}/references`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List brand references (admin)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 31️⃣ List products (admin)

**URL:** `/api/admin/products`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List products (admin)

---

### Request

No request body.

URL Params
- None

Query Params
- `q` (string) — Derived from implementation – verify manually
- `category` (string) — Derived from implementation – verify manually
- `page` (integer) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
500 — generic server error

---

## 32️⃣ Create product (admin)

**URL:** `/api/admin/products`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Create product (admin)

---

### Request

#### JSON Schema (application/json)
```json
{
  "name": "string — required — Derived from implementation – verify manually"
  "description": "string — optional — Derived from implementation – verify manually"
  "longDescription": "string — optional — Derived from implementation – verify manually"
  "price": "number — required — Derived from implementation – verify manually"
  "compareAtPrice": "number — optional — Derived from implementation – verify manually"
  "costPrice": "number — optional — Derived from implementation – verify manually"
  "currency": "string — optional — Derived from implementation – verify manually"
  "images": "array — optional — Derived from implementation – verify manually"
  "attributes": "object — optional — Derived from implementation – verify manually"
  "category": "string — required — Category id"
  "brand": "string — optional — Derived from implementation – verify manually"
  "vendor": "string — optional — Derived from implementation – verify manually"
  "sku": "string — optional — Derived from implementation – verify manually"
  "barcode": "string — optional — Derived from implementation – verify manually"
  "taxClass": "string — optional — Derived from implementation – verify manually"
  "tags": "array — optional — Derived from implementation – verify manually"
  "variants": "array — optional — Derived from implementation – verify manually"
  "requiresShipping": "boolean — optional — Derived from implementation – verify manually"
  "weight": "number — optional — Derived from implementation – verify manually"
  "weightUnit": "string — optional — Derived from implementation – verify manually"
  "dimensions": "object — optional — Derived from implementation – verify manually"
  "isActive": "boolean — optional — Derived from implementation – verify manually"
  "metaTitle": "string — optional — Derived from implementation – verify manually"
  "metaDescription": "string — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
500 — generic server error

---

## 33️⃣ Bulk assign category to products

**URL:** `/api/admin/products/category-bulk`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Bulk assign category to products

---

### Request

#### JSON Schema (application/json)
```json
{
  "categoryId": "string — required — Derived from implementation – verify manually"
  "productIds": "array — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 34️⃣ Export products (json|csv)

**URL:** `/api/admin/products/export`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Export products (json|csv)

---

### Request

No request body.

URL Params
- None

Query Params
- `format` (string) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 35️⃣ Bulk import products (admin)

**URL:** `/api/admin/products/import`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Bulk import products (admin)

---

### Request

#### JSON Schema (application/json)
```json
{
  "items": "array — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 36️⃣ Bulk price update (percent)

**URL:** `/api/admin/products/price-bulk`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Bulk price update (percent)

---

### Request

#### JSON Schema (application/json)
```json
{
  "factorPercent": "number — required — Derived from implementation – verify manually"
  "filter": "object — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 37️⃣ Delete product (admin)

**URL:** `/api/admin/products/{id}`  
**Method:** `DELETE`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Delete product (admin)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
404 — Not Found
409 — Conflict (product referenced by inventory/reviews/orders/shipments)
500 — generic server error

---

## 38️⃣ Get product by id (admin)

**URL:** `/api/admin/products/{id}`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Get product by id (admin)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
404 — Not Found
500 — generic server error

---

## 39️⃣ Partially update product (admin)

**URL:** `/api/admin/products/{id}`  
**Method:** `PATCH`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Partially update product (admin)

---

### Request

#### JSON Schema (application/json)
```json
{
  "name": "string — required — Derived from implementation – verify manually"
  "description": "string — optional — Derived from implementation – verify manually"
  "longDescription": "string — optional — Derived from implementation – verify manually"
  "price": "number — required — Derived from implementation – verify manually"
  "compareAtPrice": "number — optional — Derived from implementation – verify manually"
  "costPrice": "number — optional — Derived from implementation – verify manually"
  "currency": "string — optional — Derived from implementation – verify manually"
  "images": "array — optional — Derived from implementation – verify manually"
  "attributes": "object — optional — Derived from implementation – verify manually"
  "category": "string — required — Category id"
  "brand": "string — optional — Derived from implementation – verify manually"
  "vendor": "string — optional — Derived from implementation – verify manually"
  "sku": "string — optional — Derived from implementation – verify manually"
  "barcode": "string — optional — Derived from implementation – verify manually"
  "taxClass": "string — optional — Derived from implementation – verify manually"
  "tags": "array — optional — Derived from implementation – verify manually"
  "variants": "array — optional — Derived from implementation – verify manually"
  "requiresShipping": "boolean — optional — Derived from implementation – verify manually"
  "weight": "number — optional — Derived from implementation – verify manually"
  "weightUnit": "string — optional — Derived from implementation – verify manually"
  "dimensions": "object — optional — Derived from implementation – verify manually"
  "isActive": "boolean — optional — Derived from implementation – verify manually"
  "metaTitle": "string — optional — Derived from implementation – verify manually"
  "metaDescription": "string — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
404 — Not Found
500 — generic server error

---

## 40️⃣ Update product (admin)

**URL:** `/api/admin/products/{id}`  
**Method:** `PUT`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Update product (admin)

---

### Request

#### JSON Schema (application/json)
```json
{
  "name": "string — required — Derived from implementation – verify manually"
  "description": "string — optional — Derived from implementation – verify manually"
  "longDescription": "string — optional — Derived from implementation – verify manually"
  "price": "number — required — Derived from implementation – verify manually"
  "compareAtPrice": "number — optional — Derived from implementation – verify manually"
  "costPrice": "number — optional — Derived from implementation – verify manually"
  "currency": "string — optional — Derived from implementation – verify manually"
  "images": "array — optional — Derived from implementation – verify manually"
  "attributes": "object — optional — Derived from implementation – verify manually"
  "category": "string — required — Category id"
  "brand": "string — optional — Derived from implementation – verify manually"
  "vendor": "string — optional — Derived from implementation – verify manually"
  "sku": "string — optional — Derived from implementation – verify manually"
  "barcode": "string — optional — Derived from implementation – verify manually"
  "taxClass": "string — optional — Derived from implementation – verify manually"
  "tags": "array — optional — Derived from implementation – verify manually"
  "variants": "array — optional — Derived from implementation – verify manually"
  "requiresShipping": "boolean — optional — Derived from implementation – verify manually"
  "weight": "number — optional — Derived from implementation – verify manually"
  "weightUnit": "string — optional — Derived from implementation – verify manually"
  "dimensions": "object — optional — Derived from implementation – verify manually"
  "isActive": "boolean — optional — Derived from implementation – verify manually"
  "metaTitle": "string — optional — Derived from implementation – verify manually"
  "metaDescription": "string — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
404 — Not Found
500 — generic server error

---

## 41️⃣ List product references (admin)

**URL:** `/api/admin/products/{id}/references`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List product references (admin)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 42️⃣ Restore soft-deleted product

**URL:** `/api/admin/products/{id}/restore`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Restore soft-deleted product

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 43️⃣ List products (category and brand populated)

**URL:** `/api/products`  
**Method:** `GET`  
**Auth Required:** `No`  
**Roles Required:** `None`  

### Description
List products (category and brand populated)

---

### Request

No request body.

URL Params
- None

Query Params
- `q` (string) — Derived from implementation – verify manually
- `category` (string) — Derived from implementation – verify manually
- `page` (integer) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- None

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 44️⃣ Create product

**URL:** `/api/products`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Create product

---

### Request

#### JSON Schema (application/json)
```json
{
  "name": "string — required — Derived from implementation – verify manually"
  "description": "string — optional — Derived from implementation – verify manually"
  "longDescription": "string — optional — Derived from implementation – verify manually"
  "price": "number — required — Derived from implementation – verify manually"
  "compareAtPrice": "number — optional — Derived from implementation – verify manually"
  "costPrice": "number — optional — Derived from implementation – verify manually"
  "currency": "string — optional — Derived from implementation – verify manually"
  "images": "array — optional — Derived from implementation – verify manually"
  "attributes": "object — optional — Derived from implementation – verify manually"
  "category": "string — required — Category id"
  "brand": "string — optional — Derived from implementation – verify manually"
  "vendor": "string — optional — Derived from implementation – verify manually"
  "sku": "string — optional — Derived from implementation – verify manually"
  "barcode": "string — optional — Derived from implementation – verify manually"
  "taxClass": "string — optional — Derived from implementation – verify manually"
  "tags": "array — optional — Derived from implementation – verify manually"
  "variants": "array — optional — Derived from implementation – verify manually"
  "requiresShipping": "boolean — optional — Derived from implementation – verify manually"
  "weight": "number — optional — Derived from implementation – verify manually"
  "weightUnit": "string — optional — Derived from implementation – verify manually"
  "dimensions": "object — optional — Derived from implementation – verify manually"
  "isActive": "boolean — optional — Derived from implementation – verify manually"
  "metaTitle": "string — optional — Derived from implementation – verify manually"
  "metaDescription": "string — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
500 — generic server error

---

## 45️⃣ Delete product

**URL:** `/api/products/{id}`  
**Method:** `DELETE`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Delete product

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
404 — Not Found
409 — Conflict (product referenced by inventory/reviews/orders/shipments)
500 — generic server error

---

## 46️⃣ Get product by id

**URL:** `/api/products/{id}`  
**Method:** `GET`  
**Auth Required:** `No`  
**Roles Required:** `None`  

### Description
Get product by id

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- None

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 47️⃣ Update product

**URL:** `/api/products/{id}`  
**Method:** `PUT`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Update product

---

### Request

#### JSON Schema (application/json)
```json
{
  "name": "string — required — Derived from implementation – verify manually"
  "description": "string — optional — Derived from implementation – verify manually"
  "longDescription": "string — optional — Derived from implementation – verify manually"
  "price": "number — required — Derived from implementation – verify manually"
  "compareAtPrice": "number — optional — Derived from implementation – verify manually"
  "costPrice": "number — optional — Derived from implementation – verify manually"
  "currency": "string — optional — Derived from implementation – verify manually"
  "images": "array — optional — Derived from implementation – verify manually"
  "attributes": "object — optional — Derived from implementation – verify manually"
  "category": "string — required — Category id"
  "brand": "string — optional — Derived from implementation – verify manually"
  "vendor": "string — optional — Derived from implementation – verify manually"
  "sku": "string — optional — Derived from implementation – verify manually"
  "barcode": "string — optional — Derived from implementation – verify manually"
  "taxClass": "string — optional — Derived from implementation – verify manually"
  "tags": "array — optional — Derived from implementation – verify manually"
  "variants": "array — optional — Derived from implementation – verify manually"
  "requiresShipping": "boolean — optional — Derived from implementation – verify manually"
  "weight": "number — optional — Derived from implementation – verify manually"
  "weightUnit": "string — optional — Derived from implementation – verify manually"
  "dimensions": "object — optional — Derived from implementation – verify manually"
  "isActive": "boolean — optional — Derived from implementation – verify manually"
  "metaTitle": "string — optional — Derived from implementation – verify manually"
  "metaDescription": "string — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
404 — Not Found
500 — generic server error

---

## 48️⃣ List approved reviews for product

**URL:** `/api/products/{id}/reviews`  
**Method:** `GET`  
**Auth Required:** `No`  
**Roles Required:** `None`  

### Description
List approved reviews for product

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- `page` (integer) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- None

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 49️⃣ Create or update my review

**URL:** `/api/products/{id}/reviews`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Create or update my review

---

### Request

#### JSON Schema (application/json)
```json
{
  "rating": "integer — required — Derived from implementation – verify manually"
  "comment": "string — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
500 — generic server error

---

## 50️⃣ Delete a review (owner or admin)

**URL:** `/api/products/{id}/reviews/{reviewId}`  
**Method:** `DELETE`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Delete a review (owner or admin)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually
- `reviewId` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
500 — generic server error

---

## 51️⃣ Approve review (admin)

**URL:** `/api/products/{id}/reviews/{reviewId}/approve`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Approve review (admin)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually
- `reviewId` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
500 — generic server error

---

## 52️⃣ Hide review (admin)

**URL:** `/api/products/{id}/reviews/{reviewId}/hide`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Hide review (admin)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually
- `reviewId` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
500 — generic server error

# Categories Endpoints

---

## 53️⃣ List categories (admin alias)

**URL:** `/api/admin/categories`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List categories (admin alias)

---

### Request

No request body.

URL Params
- None

Query Params
- `q` (string) — Derived from implementation – verify manually
- `parent` (string) — Derived from implementation – verify manually
- `page` (integer) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
500 — generic server error

---

## 54️⃣ Create category (admin alias)

**URL:** `/api/admin/categories`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Create category (admin alias)

---

### Request

#### JSON Schema (application/json)
```json
{
  "name": "string — required — Derived from implementation – verify manually"
  "slug": "string — optional — Derived from implementation – verify manually"
  "description": "string — optional — Derived from implementation – verify manually"
  "parent": "string — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
500 — generic server error

---

## 55️⃣ Delete category (admin alias)

**URL:** `/api/admin/categories/{id}`  
**Method:** `DELETE`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Delete category (admin alias)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
404 — Not Found
500 — generic server error

---

## 56️⃣ Get category by id (admin alias)

**URL:** `/api/admin/categories/{id}`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Get category by id (admin alias)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
404 — Not Found
500 — generic server error

---

## 57️⃣ Update category (admin alias)

**URL:** `/api/admin/categories/{id}`  
**Method:** `PUT`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Update category (admin alias)

---

### Request

#### JSON Schema (application/json)
```json
{
  "name": "string — optional — Derived from implementation – verify manually"
  "slug": "string — optional — Derived from implementation – verify manually"
  "description": "string — optional — Derived from implementation – verify manually"
  "parent": "string — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
404 — Not Found
500 — generic server error

---

## 58️⃣ List children (admin alias)

**URL:** `/api/admin/categories/{id}/children`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List children (admin alias)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- `page` (integer) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
500 — generic server error

---

## 59️⃣ Reorder children (admin alias)

**URL:** `/api/admin/categories/{id}/reorder`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Reorder children (admin alias)

---

### Request

#### JSON Schema (application/json)
```json
{
  "ids": "array — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
500 — generic server error

---

## 60️⃣ Restore category (admin alias)

**URL:** `/api/admin/categories/{id}/restore`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Restore category (admin alias)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
404 — Not Found
500 — generic server error

---

## 61️⃣ List categories

**URL:** `/api/categories`  
**Method:** `GET`  
**Auth Required:** `No`  
**Roles Required:** `None`  

### Description
List categories

---

### Request

No request body.

URL Params
- None

Query Params
- `q` (string) — Derived from implementation – verify manually
- `parent` (string) — Derived from implementation – verify manually
- `page` (integer) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- None

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 62️⃣ Create category

**URL:** `/api/categories`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Create category

---

### Request

#### JSON Schema (application/json)
```json
{
  "name": "string — required — Derived from implementation – verify manually"
  "slug": "string — optional — Derived from implementation – verify manually"
  "description": "string — optional — Derived from implementation – verify manually"
  "parent": "string — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
500 — generic server error

---

## 63️⃣ Delete category

**URL:** `/api/categories/{id}`  
**Method:** `DELETE`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Delete category

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
404 — Not Found
500 — generic server error

---

## 64️⃣ Get category by id

**URL:** `/api/categories/{id}`  
**Method:** `GET`  
**Auth Required:** `No`  
**Roles Required:** `None`  

### Description
Get category by id

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- None

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 65️⃣ Update category

**URL:** `/api/categories/{id}`  
**Method:** `PUT`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Update category

---

### Request

#### JSON Schema (application/json)
```json
{
  "name": "string — optional — Derived from implementation – verify manually"
  "slug": "string — optional — Derived from implementation – verify manually"
  "description": "string — optional — Derived from implementation – verify manually"
  "parent": "string — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
404 — Not Found
500 — generic server error

---

## 66️⃣ List children of a category

**URL:** `/api/categories/{id}/children`  
**Method:** `GET`  
**Auth Required:** `No`  
**Roles Required:** `None`  

### Description
List children of a category

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- `page` (integer) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- None

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 67️⃣ Reorder child categories under parent (admin)

**URL:** `/api/categories/{id}/reorder`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Reorder child categories under parent (admin)

---

### Request

#### JSON Schema (application/json)
```json
{
  "ids": "array — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

# Cart Endpoints

---

## 68️⃣ Get current user cart

**URL:** `/api/cart`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Get current user cart

---

### Request

No request body.

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
500 — generic server error

---

## 69️⃣ Remove coupon from cart

**URL:** `/api/cart/coupon`  
**Method:** `DELETE`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Remove coupon from cart

---

### Request

No request body.

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 70️⃣ Apply coupon to cart

**URL:** `/api/cart/coupon`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Apply coupon to cart

---

### Request

#### JSON Schema (application/json)
```json
{
  "code": "string — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 71️⃣ Estimate shipping/tax for current cart

**URL:** `/api/cart/estimate`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Estimate shipping/tax for current cart

---

### Request

#### JSON Schema (application/json)
```json
{
  "shipping": "number — optional — Derived from implementation – verify manually"
  "taxRate": "number — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 72️⃣ Add item to cart

**URL:** `/api/cart/items`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Add item to cart

---

### Request

#### JSON Schema (application/json)
```json
{
  "productId": "string — required — Derived from implementation – verify manually"
  "variantId": "string — optional — Derived from implementation – verify manually"
  "quantity": "integer — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
500 — generic server error

---

## 73️⃣ Remove item from cart

**URL:** `/api/cart/items/{productId}`  
**Method:** `DELETE`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Remove item from cart

---

### Request

No request body.

URL Params
- `productId` (string) — Derived from implementation – verify manually

Query Params
- `variantId` (string) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
500 — generic server error

---

## 74️⃣ Update cart item quantity

**URL:** `/api/cart/items/{productId}`  
**Method:** `PATCH`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Update cart item quantity

---

### Request

#### JSON Schema (application/json)
```json
{
  "quantity": "integer — required — Derived from implementation – verify manually"
  "variantId": "string — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `productId` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
500 — generic server error

# Orders Endpoints

---

## 75️⃣ List orders (admin)

**URL:** `/api/admin/orders`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List orders (admin)

---

### Request

No request body.

URL Params
- None

Query Params
- `status` (string) — Derived from implementation – verify manually
- `paymentStatus` (string) — Derived from implementation – verify manually
- `user` (string) — Derived from implementation – verify manually
- `from` (string) — Derived from implementation – verify manually
- `to` (string) — Derived from implementation – verify manually
- `page` (integer) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
500 — generic server error

---

## 76️⃣ Get order by id (admin)

**URL:** `/api/admin/orders/{id}`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Get order by id (admin)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
404 — Not Found
500 — generic server error

---

## 77️⃣ Update order status/paymentStatus (admin)

**URL:** `/api/admin/orders/{id}`  
**Method:** `PATCH`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Update order status/paymentStatus (admin)

---

### Request

#### JSON Schema (application/json)
```json
{
  "status": "string — optional — Derived from implementation – verify manually"
  "paymentStatus": "string — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
404 — Not Found
500 — generic server error

---

## 78️⃣ List shipments for order (admin)

**URL:** `/api/admin/orders/{id}/shipments`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List shipments for order (admin)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- `page` (integer) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Order not found
500 — generic server error

---

## 79️⃣ Create shipment for order (admin)

**URL:** `/api/admin/orders/{id}/shipments`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Create shipment for order (admin)

---

### Request

#### JSON Schema (application/json)
```json
{
  "carrier": "string — optional — Derived from implementation – verify manually"
  "tracking": "string — optional — Derived from implementation – verify manually"
  "service": "string — optional — Derived from implementation – verify manually"
  "items": "array — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
400 — Order must be paid
404 — Order not found
500 — generic server error

---

## 80️⃣ Add order timeline entry

**URL:** `/api/admin/orders/{id}/timeline`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Add order timeline entry

---

### Request

#### JSON Schema (application/json)
```json
{
  "type": "string — required — Derived from implementation – verify manually"
  "message": "string — required — Derived from implementation – verify manually"
  "meta": "object — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 81️⃣ List return requests (admin)

**URL:** `/api/admin/returns`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List return requests (admin)

---

### Request

No request body.

URL Params
- None

Query Params
- `status` (string) — Derived from implementation – verify manually
- `page` (integer) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 82️⃣ Approve return and refund (admin)

**URL:** `/api/admin/returns/{id}/approve`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Approve return and refund (admin)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`
- `Idempotency-Key` or `X-Idempotency-Key` (optional; duplicate key returns 409)

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
400 — Bad Request
404 — Not Found
500 — generic server error

---

## 83️⃣ Reject return (admin)

**URL:** `/api/admin/returns/{id}/reject`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Reject return (admin)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
400 — Bad Request
404 — Not Found
500 — generic server error

---

## 84️⃣ List shipments (admin)

**URL:** `/api/admin/shipments`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List shipments (admin)

---

### Request

No request body.

URL Params
- None

Query Params
- `orderId` (string) — Derived from implementation – verify manually
- `page` (integer) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 85️⃣ Get shipment by id (admin)

**URL:** `/api/admin/shipments/{id}`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Get shipment by id (admin)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 86️⃣ List my orders

**URL:** `/api/orders`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
List my orders

---

### Request

No request body.

URL Params
- None

Query Params
- `page` (integer) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`
- `Idempotency-Key` or `X-Idempotency-Key` (optional; duplicate key returns 409)

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
500 — generic server error

---

## 87️⃣ Create order from cart

**URL:** `/api/orders`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Create order from cart

---

### Request

#### JSON Schema (application/json)
```json
{
  "shippingAddress": "object — optional — Derived from implementation – verify manually"
  "shipping": "number — optional — Derived from implementation – verify manually"
  "taxRate": "number — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`
- `Idempotency-Key` or `X-Idempotency-Key` (optional; duplicate key returns 409)

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
500 — generic server error

---

## 88️⃣ Get order by id

**URL:** `/api/orders/{id}`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Get order by id

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
404 — Not Found
500 — generic server error

---

## 89️⃣ Get order invoice (PDF)

**URL:** `/api/orders/{id}/invoice`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Get order invoice (PDF)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: Derived from implementation – verify manually
Possible Errors
401 — Unauthorized
404 — Not Found
500 — generic server error

---

## 90️⃣ Request return/refund for order

**URL:** `/api/orders/{id}/returns`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Request return/refund for order

---

### Request

#### JSON Schema (application/json)
```json
{
  "reason": "string — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
400 — Bad Request
401 — Unauthorized
500 — generic server error

---

## 91️⃣ Get order timeline

**URL:** `/api/orders/{id}/timeline`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Get order timeline

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- `page` (integer) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
500 — generic server error

# Payments Endpoints

---

## 92️⃣ List payment events

**URL:** `/api/admin/payment-events`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List payment events

---

### Request

No request body.

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
{
  "items": "array — optional — Derived from implementation – verify manually"
  "total": "integer — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 93️⃣ Get payment event

**URL:** `/api/admin/payment-events/{id}`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Get payment event

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 94️⃣ List refunds (admin)

**URL:** `/api/admin/refunds`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List refunds (admin)

---

### Request

No request body.

URL Params
- None

Query Params
- `orderId` (string) — Derived from implementation – verify manually
- `provider` (string) — Derived from implementation – verify manually
- `status` (string) — Derived from implementation – verify manually
- `page` (integer) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 95️⃣ Get refund by id (admin)

**URL:** `/api/admin/refunds/{id}`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Get refund by id (admin)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 96️⃣ List payment transactions (admin)

**URL:** `/api/admin/transactions`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List payment transactions (admin)

---

### Request

No request body.

URL Params
- None

Query Params
- `orderId` (string) — Derived from implementation – verify manually
- `provider` (string) — Derived from implementation – verify manually
- `status` (string) — Derived from implementation – verify manually
- `page` (integer) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 97️⃣ Get transaction by id (admin)

**URL:** `/api/admin/transactions/{id}`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Get transaction by id (admin)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 98️⃣ Create Stripe PaymentIntent for an order

**URL:** `/api/payments/stripe/intent`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Create Stripe PaymentIntent for an order

---

### Request

#### JSON Schema (application/json)
```json
{
  "orderId": "string — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
500 — generic server error

---

## 99️⃣ Stripe webhook endpoint

**URL:** `/api/payments/stripe/webhook`  
**Method:** `POST`  
**Auth Required:** `No`  
**Roles Required:** `None`  

### Description
Stripe webhook endpoint

---

### Request

No request body.

URL Params
- None

Query Params
- None

Headers (if required)
- `Stripe-Signature`
- Raw request body (`application/json`) required

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

# Reviews Endpoints

# Inventory Endpoints

---

## 100️⃣ List inventory levels (admin)

**URL:** `/api/admin/inventory`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List inventory levels (admin)

---

### Request

No request body.

URL Params
- None

Query Params
- `product` (string) — Derived from implementation – verify manually
- `variant` (string) — Derived from implementation – verify manually
- `locationId` (string) — Derived from implementation – verify manually
- `page` (integer) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 101️⃣ List inventory adjustments (admin)

**URL:** `/api/admin/inventory/adjustments`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List inventory adjustments (admin)

---

### Request

No request body.

URL Params
- None

Query Params
- `product` (string) — Derived from implementation – verify manually
- `variant` (string) — Derived from implementation – verify manually
- `reason` (string) — Derived from implementation – verify manually
- `direction` (string) — Derived from implementation – verify manually
- `locationId` (string) — Derived from implementation – verify manually
- `page` (integer) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 102️⃣ Create inventory adjustment (admin)

**URL:** `/api/admin/inventory/adjustments`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Create inventory adjustment (admin)

---

### Request

#### JSON Schema (application/json)
```json
{
  "productId": "string — required — Derived from implementation – verify manually"
  "variantId": "string — optional — Derived from implementation – verify manually"
  "locationId": "string — required — Derived from implementation – verify manually"
  "qtyChange": "integer — required — Derived from implementation – verify manually"
  "reservedChange": "integer — optional — Derived from implementation – verify manually"
  "reason": "string — optional — Derived from implementation – verify manually"
  "refId": "string — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 103️⃣ List stock ledger entries

**URL:** `/api/admin/inventory/ledger`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List stock ledger entries

---

### Request

No request body.

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
{
  "items": "array — optional — Derived from implementation – verify manually"
  "total": "integer — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 104️⃣ Get stock ledger entry

**URL:** `/api/admin/inventory/ledger/{id}`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Get stock ledger entry

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 105️⃣ List inventory locations

**URL:** `/api/admin/inventory/locations`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List inventory locations

---

### Request

No request body.

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
{
  "items": "array — optional — Derived from implementation – verify manually"
  "total": "integer — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 106️⃣ Create inventory location

**URL:** `/api/admin/inventory/locations`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Create inventory location

---

### Request

#### JSON Schema (application/json)
```json
{
  "_id": "string — optional — Derived from implementation – verify manually"
  "code": "string — optional — Derived from implementation – verify manually"
  "name": "string — optional — Derived from implementation – verify manually"
  "type": "string — optional — Derived from implementation – verify manually"
  "geo": "object — optional — Derived from implementation – verify manually"
  "priority": "integer — optional — Derived from implementation – verify manually"
  "active": "boolean — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 107️⃣ Soft delete location

**URL:** `/api/admin/inventory/locations/{id}`  
**Method:** `DELETE`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Soft delete location

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 108️⃣ Get inventory location

**URL:** `/api/admin/inventory/locations/{id}`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Get inventory location

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 109️⃣ Update inventory location

**URL:** `/api/admin/inventory/locations/{id}`  
**Method:** `PUT`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Update inventory location

---

### Request

#### JSON Schema (application/json)
```json
{
  "_id": "string — optional — Derived from implementation – verify manually"
  "code": "string — optional — Derived from implementation – verify manually"
  "name": "string — optional — Derived from implementation – verify manually"
  "type": "string — optional — Derived from implementation – verify manually"
  "geo": "object — optional — Derived from implementation – verify manually"
  "priority": "integer — optional — Derived from implementation – verify manually"
  "active": "boolean — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 110️⃣ Restore location

**URL:** `/api/admin/inventory/locations/{id}/restore`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Restore location

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 111️⃣ List low-stock inventory

**URL:** `/api/admin/inventory/low`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List low-stock inventory

---

### Request

No request body.

URL Params
- None

Query Params
- `threshold` (integer) — Derived from implementation – verify manually
- `page` (integer) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 112️⃣ List transfer orders

**URL:** `/api/admin/inventory/transfers`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List transfer orders

---

### Request

No request body.

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
{
  "items": "array — optional — Derived from implementation – verify manually"
  "total": "integer — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 113️⃣ Create transfer order

**URL:** `/api/admin/inventory/transfers`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Create transfer order

---

### Request

#### JSON Schema (application/json)
```json
{
  "_id": "string — optional — Derived from implementation – verify manually"
  "fromLocationId": "string — optional — Derived from implementation – verify manually"
  "toLocationId": "string — optional — Derived from implementation – verify manually"
  "status": "string — optional — Derived from implementation – verify manually"
  "lines": "array — optional — Derived from implementation – verify manually"
  "createdAt": "string — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 114️⃣ Get transfer order

**URL:** `/api/admin/inventory/transfers/{id}`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Get transfer order

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 115️⃣ Update transfer order

**URL:** `/api/admin/inventory/transfers/{id}`  
**Method:** `PUT`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Update transfer order

---

### Request

#### JSON Schema (application/json)
```json
{
  "_id": "string — optional — Derived from implementation – verify manually"
  "fromLocationId": "string — optional — Derived from implementation – verify manually"
  "toLocationId": "string — optional — Derived from implementation – verify manually"
  "status": "string — optional — Derived from implementation – verify manually"
  "lines": "array — optional — Derived from implementation – verify manually"
  "createdAt": "string — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 116️⃣ Transition transfer order status

**URL:** `/api/admin/inventory/transfers/{id}/status`  
**Method:** `PATCH`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Transition transfer order status

---

### Request

#### JSON Schema (application/json)
```json
{
  "status": "string — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 117️⃣ List inventory locations

**URL:** `/api/inventory/locations`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
List inventory locations

---

### Request

No request body.

URL Params
- None

Query Params
- `type` (string) — Derived from implementation – verify manually
- `active` (boolean) — Derived from implementation – verify manually
- `region` (string) — Derived from implementation – verify manually
- `country` (string) — Derived from implementation – verify manually
- `page` (integer) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
{
  "items": "array — optional — Derived from implementation – verify manually"
  "total": "integer — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 118️⃣ Create location

**URL:** `/api/inventory/locations`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Create location

---

### Request

#### JSON Schema (application/json)
```json
{
  "_id": "string — optional — Derived from implementation – verify manually"
  "code": "string — optional — Derived from implementation – verify manually"
  "name": "string — optional — Derived from implementation – verify manually"
  "type": "string — optional — Derived from implementation – verify manually"
  "geo": "object — optional — Derived from implementation – verify manually"
  "priority": "integer — optional — Derived from implementation – verify manually"
  "active": "boolean — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 119️⃣ Soft delete location

**URL:** `/api/inventory/locations/{id}`  
**Method:** `DELETE`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Soft delete location

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 120️⃣ Get location

**URL:** `/api/inventory/locations/{id}`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Get location

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
{
  "_id": "string — optional — Derived from implementation – verify manually"
  "code": "string — optional — Derived from implementation – verify manually"
  "name": "string — optional — Derived from implementation – verify manually"
  "type": "string — optional — Derived from implementation – verify manually"
  "geo": "object — optional — Derived from implementation – verify manually"
  "priority": "integer — optional — Derived from implementation – verify manually"
  "active": "boolean — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 121️⃣ Update location

**URL:** `/api/inventory/locations/{id}`  
**Method:** `PATCH`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Update location

---

### Request

#### JSON Schema (application/json)
```json
{
  "code": "string — optional — Derived from implementation – verify manually"
  "description": "string — optional — Derived from implementation – verify manually"
  "type": "string — optional — Derived from implementation – verify manually"
  "value": "number — optional — Derived from implementation – verify manually"
  "minSubtotal": "number — optional — Derived from implementation – verify manually"
  "expiresAt": "string — optional — Derived from implementation – verify manually"
  "isActive": "boolean — optional — Derived from implementation – verify manually"
  "includeCategories": "array — optional — Derived from implementation – verify manually"
  "excludeCategories": "array — optional — Derived from implementation – verify manually"
  "includeProducts": "array — optional — Derived from implementation – verify manually"
  "excludeProducts": "array — optional — Derived from implementation – verify manually"
  "perUserLimit": "integer — optional — Derived from implementation – verify manually"
  "globalLimit": "integer — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 122️⃣ Allocate picking plan

**URL:** `/api/inventory/picking/allocate`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Allocate picking plan

---

### Request

#### JSON Schema (application/json)
```json
{
  "orderId": "string — optional — Derived from implementation – verify manually"
  "plan": "array — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 123️⃣ Quote picking plan

**URL:** `/api/inventory/picking/quote`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Quote picking plan

---

### Request

#### JSON Schema (application/json)
```json
{
  "shipTo": "object — optional — Derived from implementation – verify manually"
  "items": "array — required — Derived from implementation – verify manually"
  "splitAllowed": "boolean — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
{
  "plan": "array — optional — Derived from implementation – verify manually"
  "fillRate": "number — optional — Derived from implementation – verify manually"
  "split": "boolean — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 124️⃣ Query stock by location

**URL:** `/api/inventory/stock`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Query stock by location

---

### Request

No request body.

URL Params
- None

Query Params
- `productId` (string) — Derived from implementation – verify manually
- `variantId` (string) — Derived from implementation – verify manually
- `locationId` (array) — Derived from implementation – verify manually
- `region` (string) — Derived from implementation – verify manually
- `country` (string) — Derived from implementation – verify manually
- `radius` (number) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
{
  "items": "array — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 125️⃣ Adjust stock levels

**URL:** `/api/inventory/stock/adjust`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Adjust stock levels

---

### Request

#### JSON Schema (application/json)
```json
{
  "reason": "string — required — Derived from implementation – verify manually"
  "adjustments": "array — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 202
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 126️⃣ Reconcile physical count

**URL:** `/api/inventory/stock/reconcile`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Reconcile physical count

---

### Request

#### JSON Schema (application/json)
```json
{
  "productId": "string — required — Derived from implementation – verify manually"
  "variantId": "string — optional — Derived from implementation – verify manually"
  "locationId": "string — required — Derived from implementation – verify manually"
  "countedOnHand": "integer — required — Derived from implementation – verify manually"
  "countedReserved": "integer — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 127️⃣ List transfer orders

**URL:** `/api/inventory/stock/transfer-orders`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
List transfer orders

---

### Request

No request body.

URL Params
- None

Query Params
- `status` (string) — Derived from implementation – verify manually
- `fromLocationId` (string) — Derived from implementation – verify manually
- `toLocationId` (string) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
{
  "items": "array — optional — Derived from implementation – verify manually"
  "total": "integer — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 128️⃣ Create transfer order

**URL:** `/api/inventory/stock/transfer-orders`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Create transfer order

---

### Request

#### JSON Schema (application/json)
```json
{
  "_id": "string — optional — Derived from implementation – verify manually"
  "fromLocationId": "string — optional — Derived from implementation – verify manually"
  "toLocationId": "string — optional — Derived from implementation – verify manually"
  "status": "string — optional — Derived from implementation – verify manually"
  "lines": "array — optional — Derived from implementation – verify manually"
  "createdAt": "string — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 129️⃣ Transition transfer order status

**URL:** `/api/inventory/stock/transfer-orders/{id}`  
**Method:** `PATCH`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Transition transfer order status

---

### Request

#### JSON Schema (application/json)
```json
{
  "status": "string — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

# Admin Endpoints

---

## 130️⃣ List admin audit logs

**URL:** `/api/admin/audit`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List admin audit logs

---

### Request

No request body.

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
{
  "items": "array — optional — Derived from implementation – verify manually"
  "total": "integer — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 131️⃣ Get a single audit log entry

**URL:** `/api/admin/audit/{id}`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Get a single audit log entry

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
{
  "log": "object — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 132️⃣ List coupons (admin)

**URL:** `/api/admin/coupons`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List coupons (admin)

---

### Request

No request body.

URL Params
- None

Query Params
- `q` (string) — Derived from implementation – verify manually
- `page` (integer) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 133️⃣ Create coupon (admin)

**URL:** `/api/admin/coupons`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Create coupon (admin)

---

### Request

#### JSON Schema (application/json)
```json
{
  "code": "string — required — Derived from implementation – verify manually"
  "description": "string — optional — Derived from implementation – verify manually"
  "type": "string — required — Derived from implementation – verify manually"
  "value": "number — required — Derived from implementation – verify manually"
  "minSubtotal": "number — optional — Derived from implementation – verify manually"
  "expiresAt": "string — optional — Derived from implementation – verify manually"
  "isActive": "boolean — optional — Derived from implementation – verify manually"
  "includeCategories": "array — optional — Derived from implementation – verify manually"
  "excludeCategories": "array — optional — Derived from implementation – verify manually"
  "includeProducts": "array — optional — Derived from implementation – verify manually"
  "excludeProducts": "array — optional — Derived from implementation – verify manually"
  "perUserLimit": "integer — optional — Derived from implementation – verify manually"
  "globalLimit": "integer — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 134️⃣ Delete coupon (admin)

**URL:** `/api/admin/coupons/{id}`  
**Method:** `DELETE`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Delete coupon (admin)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 135️⃣ Get coupon (admin)

**URL:** `/api/admin/coupons/{id}`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Get coupon (admin)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 136️⃣ Update coupon (admin)

**URL:** `/api/admin/coupons/{id}`  
**Method:** `PUT`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Update coupon (admin)

---

### Request

#### JSON Schema (application/json)
```json
{
  "code": "string — optional — Derived from implementation – verify manually"
  "description": "string — optional — Derived from implementation – verify manually"
  "type": "string — optional — Derived from implementation – verify manually"
  "value": "number — optional — Derived from implementation – verify manually"
  "minSubtotal": "number — optional — Derived from implementation – verify manually"
  "expiresAt": "string — optional — Derived from implementation – verify manually"
  "isActive": "boolean — optional — Derived from implementation – verify manually"
  "includeCategories": "array — optional — Derived from implementation – verify manually"
  "excludeCategories": "array — optional — Derived from implementation – verify manually"
  "includeProducts": "array — optional — Derived from implementation – verify manually"
  "excludeProducts": "array — optional — Derived from implementation – verify manually"
  "perUserLimit": "integer — optional — Derived from implementation – verify manually"
  "globalLimit": "integer — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
404 — Not Found
500 — generic server error

---

## 137️⃣ List currency rates (admin)

**URL:** `/api/admin/currency-rates`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List currency rates (admin)

---

### Request

No request body.

URL Params
- None

Query Params
- `baseCurrency` (string) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 138️⃣ Upsert currency rate (admin)

**URL:** `/api/admin/currency-rates`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Upsert currency rate (admin)

---

### Request

#### JSON Schema (application/json)
```json
{
  "baseCurrency": "string — optional — Derived from implementation – verify manually"
  "currency": "string — required — Derived from implementation – verify manually"
  "rate": "number — required — Derived from implementation – verify manually"
  "source": "string — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 139️⃣ Delete currency rate (admin)

**URL:** `/api/admin/currency-rates/{currency}`  
**Method:** `DELETE`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Delete currency rate (admin)

---

### Request

No request body.

URL Params
- `currency` (string) — Derived from implementation – verify manually

Query Params
- `baseCurrency` (string) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## 140️⃣ Admin metrics

**URL:** `/api/admin/metrics`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Admin metrics

---

### Request

No request body.

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
500 — generic server error

---

## 141️⃣ Sales report by period

**URL:** `/api/admin/reports/sales`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Sales report by period

---

### Request

No request body.

URL Params
- None

Query Params
- `from` (string) — Derived from implementation – verify manually
- `to` (string) — Derived from implementation – verify manually
- `groupBy` (string) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
500 — generic server error

---

## 142️⃣ Top customers report

**URL:** `/api/admin/reports/top-customers`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Top customers report

---

### Request

No request body.

URL Params
- None

Query Params
- `from` (string) — Derived from implementation – verify manually
- `to` (string) — Derived from implementation – verify manually
- `by` (string) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
500 — generic server error

---

## 143️⃣ Top products report

**URL:** `/api/admin/reports/top-products`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Top products report

---

### Request

No request body.

URL Params
- None

Query Params
- `from` (string) — Derived from implementation – verify manually
- `to` (string) — Derived from implementation – verify manually
- `by` (string) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
500 — generic server error

---

## 144️⃣ List users (admin)

**URL:** `/api/admin/users`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
List users (admin)

---

### Request

No request body.

URL Params
- None

Query Params
- `q` (string) — Derived from implementation – verify manually
- `page` (integer) — Derived from implementation – verify manually
- `limit` (integer) — Derived from implementation – verify manually

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
500 — generic server error

---

## 145️⃣ Get user by id (admin)

**URL:** `/api/admin/users/{id}`  
**Method:** `GET`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Get user by id (admin)

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
404 — Not Found
500 — generic server error

---

## 146️⃣ Update user (admin)

**URL:** `/api/admin/users/{id}`  
**Method:** `PATCH`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Update user (admin)

---

### Request

#### JSON Schema (application/json)
```json
{
  "isActive": "boolean — optional — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
404 — Not Found
500 — generic server error

---

## 147️⃣ Remove admin role from user

**URL:** `/api/admin/users/{id}/demote`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Remove admin role from user

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
404 — Not Found
500 — generic server error

---

## 148️⃣ Promote a user to admin

**URL:** `/api/admin/users/{id}/promote`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `Admin`  

### Description
Promote a user to admin

---

### Request

No request body.

URL Params
- `id` (string) — Derived from implementation – verify manually

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
404 — Not Found
500 — generic server error

# Miscellaneous Endpoints

---

## 149️⃣ Upload image (admin)

**URL:** `/api/uploads`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Upload image (admin)

---

### Request

#### JSON Schema (multipart/form-data)
```json
{
  "file": "string — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
401 — Unauthorized
403 — Forbidden
500 — generic server error

---

## 150️⃣ Upload image to Cloudinary (admin)

**URL:** `/api/uploads/cloudinary`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Upload image to Cloudinary (admin)

---

### Request

#### JSON Schema (multipart/form-data)
```json
{
  "file": "string — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 201
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
400 — Invalid upload request
401 — Cloudinary authentication failed
500 — Cloudinary error

---

## 151️⃣ Delete Cloudinary asset (admin)

**URL:** `/api/uploads/cloudinary/delete`  
**Method:** `POST`  
**Auth Required:** `Yes`  
**Roles Required:** `None`  

### Description
Delete Cloudinary asset (admin)

---

### Request

#### JSON Schema (application/json)
```json
{
  "publicId": "string — required — Derived from implementation – verify manually"
}
```
Example
```json
"Derived from implementation – verify manually"
```

URL Params
- None

Query Params
- None

Headers (if required)
- `Authorization: Bearer <token>`

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
400 — Missing or invalid publicId
401 — Cloudinary authentication failed
500 — Cloudinary error

---

## 152️⃣ Health check

**URL:** `/health`  
**Method:** `GET`  
**Auth Required:** `No`  
**Roles Required:** `None`  

### Description
Health check

---

### Request

No request body.

URL Params
- None

Query Params
- None

Headers (if required)
- None

Success Response
Status Code: 200
JSON Schema
```json
"Derived from implementation – verify manually"
```
Example
```json
"Derived from implementation – verify manually"
```
Possible Errors
500 — generic server error

---

## Security Notes

- Auth strategy detected: JWT Bearer access tokens, role checks (`requireRole`), and permission checks (`checkPermission`).
- Rate limiting detected: global limiter on `/api` and stricter per-scope limiters on auth, uploads, and payments routes.
- CORS detected: enabled globally with configurable origins and credentials.
- Sensitive fields redacted: Derived from implementation – verify manually.
- Any risky implementation found: webhook endpoint depends on raw body for signature verification and must remain before JSON parser.

## Architectural Observations

- Controller-Service separation: implemented across route/controller/service layers.
- Validation approach: centralized `validate` middleware using schema `.parse` or `.validate` contracts.
- Error handling style: centralized async error handling with `express-async-errors`, `notFound`, and `errorHandler` middleware.