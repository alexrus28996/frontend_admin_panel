Global Error Response JSON:
{
  "error": {
    "name": "...",
    "message": "...",
    "code": "...",
    "details": "...",
    "stack": "..."
  }
}

## GET /api/admin/users
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#listUsers
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization: Bearer <token>
Query Params: page, limit, q
Path Params: none
Body Fields: none
Success Response JSON: { "items": "...", "total": "...", "page": "...", "pages": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/users/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#getUserById
Middleware: authRequired -> requireRole(ADMIN) -> validate(idParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: { "user": { "id": "...", "name": "...", "email": "...", "roles": "...", "isActive": "..." } }
Error Response JSON: { "error": { "message": "User not found" } }

## PATCH /api/admin/users/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#updateUser
Middleware: authRequired -> requireRole(ADMIN) -> validate({ ...idParam, ...updateUserSchema })
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: name, roles, isActive
Success Response JSON: { "user": { "id": "...", "name": "...", "email": "...", "roles": "...", "isActive": "..." } }
Error Response JSON: { "error": { "message": "User not found" } }

## POST /api/admin/users/:id/promote
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#promoteUser
Middleware: authRequired -> requireRole(ADMIN) -> validate(idParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: { "user": { "id": "...", "name": "...", "email": "...", "roles": "..." } }
Error Response JSON: { "error": { "message": "User not found" } }

## POST /api/admin/users/:id/demote
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#demoteUser
Middleware: authRequired -> requireRole(ADMIN) -> validate(idParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: { "user": { "id": "...", "name": "...", "email": "...", "roles": "..." } }
Error Response JSON: { "error": { "message": "User not found" } }

## GET /api/admin/users/:id/permissions
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#getUserPermissionsController
Middleware: authRequired -> requireRole(ADMIN) -> validate(idParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: formatPermissionsResponse(user)
Error Response JSON: { "error": { "message": "User not found" } }

## POST /api/admin/users/:id/permissions
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#replaceUserPermissionsController
Middleware: authRequired -> requireRole(ADMIN) -> validate(permissionsReplaceSchema)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: permissions
Success Response JSON: formatPermissionsResponse(user)
Error Response JSON: { "error": { "message": "User not found" } }

## PATCH /api/admin/users/:id/permissions/add
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#addUserPermissionsController
Middleware: authRequired -> requireRole(ADMIN) -> validate(permissionsModifySchema)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: permissions
Success Response JSON: formatPermissionsResponse(user)
Error Response JSON: { "error": { "message": "User not found" } }

## PATCH /api/admin/users/:id/permissions/remove
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#removeUserPermissionsController
Middleware: authRequired -> requireRole(ADMIN) -> validate(permissionsModifySchema)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: permissions
Success Response JSON: formatPermissionsResponse(user)
Error Response JSON: { "error": { "message": "User not found" } }

## GET /api/admin/metrics
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#metrics
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: none
Path Params: none
Body Fields: none
Success Response JSON: { "usersTotal": "...", "usersActive": "...", "adminsCount": "...", "productsCount": "...", "ordersTotal": "...", "ordersByStatus": "...", "revenueLast7Days": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/orders
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#listOrders
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: page, limit, status, userId
Path Params: none
Body Fields: none
Success Response JSON: { "items": "...", "total": "...", "page": "...", "pages": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/orders/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#getOrder
Middleware: authRequired -> requireRole(ADMIN) -> validate(idParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: { "order": "..." }
Error Response JSON: { "error": { "message": "..." } }

## PATCH /api/admin/orders/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#updateOrder
Middleware: authRequired -> requireRole(ADMIN) -> validate(updateOrderSchema)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: status, paid
Success Response JSON: { "order": "..." }
Error Response JSON: { "error": { "message": "..." } }

## POST /api/admin/orders/:id/timeline
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/order-timeline.controller.js#createTimelineEntry
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(ORDERS_TIMELINE_WRITE) -> validate(orderTimelineCreateSchema)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: status, note
Success Response JSON: { "entry": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/coupons
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#listCouponsController
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: page, limit, active
Path Params: none
Body Fields: none
Success Response JSON: result
Error Response JSON: Global Error Response JSON

## POST /api/admin/coupons
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#createCouponController
Middleware: authRequired -> requireRole(ADMIN) -> validate(couponSchema)
Headers Required: Authorization
Query Params: none
Path Params: none
Body Fields: code, discountType, discountValue, active, expiresAt, maxUses
Success Response JSON: { "coupon": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/coupons/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#getCouponController
Middleware: authRequired -> requireRole(ADMIN) -> validate(idParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: { "coupon": "..." }
Error Response JSON: { "error": { "message": "Coupon not found" } }

## PUT /api/admin/coupons/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#updateCouponController
Middleware: authRequired -> requireRole(ADMIN) -> validate({ ...idParam, ...couponSchema })
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: code, discountType, discountValue, active, expiresAt, maxUses
Success Response JSON: { "coupon": "..." }
Error Response JSON: { "error": { "message": "Coupon not found" } }

## DELETE /api/admin/coupons/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#deleteCouponController
Middleware: authRequired -> requireRole(ADMIN) -> validate(idParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: result
Error Response JSON: Global Error Response JSON

## GET /api/admin/payment-events
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/payment-events.controller.js#listPaymentEvents
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(PAYMENTS_EVENTS_VIEW) -> validate(paymentEventsListSchema)
Headers Required: Authorization
Query Params: orderId, provider, type, from, to, page, limit
Path Params: none
Body Fields: none
Success Response JSON: result
Error Response JSON: Global Error Response JSON

## GET /api/admin/payment-events/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/payment-events.controller.js#getPaymentEvent
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(PAYMENTS_EVENTS_VIEW) -> validate(paymentEventIdSchema)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: { "event": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/shipments
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#listShipmentsController
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: orderId, page, limit
Path Params: none
Body Fields: none
Success Response JSON: { "items": "...", "total": "...", "page": "...", "pages": "..." }
Error Response JSON: Global Error Response JSON

## POST /api/admin/orders/:id/shipments
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#createShipmentController
Middleware: authRequired -> requireRole(ADMIN) -> validate(shipmentCreateSchema)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: carrier, service, trackingNumber, status, shippedAt, deliveredAt, addressSnapshot
Success Response JSON: { "shipment": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/shipments/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#getShipmentController
Middleware: authRequired -> requireRole(ADMIN) -> validate(idParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: { "shipment": "..." }
Error Response JSON: { "error": { "message": "Shipment not found" } }

## GET /api/admin/orders/:id/shipments
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#listOrderShipmentsController
Middleware: authRequired -> requireRole(ADMIN) -> validate(idParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: { "items": "..." }
Error Response JSON: Global Error Response JSON

## POST /api/uploads
Route File: src/interfaces/http/routes/uploads.js
Controller File: src/interfaces/http/controllers/uploads.controller.js#localUploadHandler
Middleware: authRequired -> requireRole(ADMIN) -> uploadImage.single(file)
Headers Required: Authorization
Query Params: none
Path Params: none
Body Fields: multipart/form-data file
Success Response JSON: { "url": "...", "filename": "...", "mimetype": "...", "size": "..." }
Error Response JSON: { "error": { "message": "No file uploaded" } }

## POST /api/uploads/cloudinary
Route File: src/interfaces/http/routes/uploads.js
Controller File: src/interfaces/http/controllers/uploads.controller.js#cloudinaryUploadHandler
Middleware: authRequired -> requireRole(ADMIN) -> multer.memoryStorage.single(file)
Headers Required: Authorization
Query Params: none
Path Params: none
Body Fields: multipart/form-data file
Success Response JSON: { "url": "...", "secure_url": "...", "public_id": "...", "width": "...", "height": "...", "format": "...", "bytes": "..." }
Error Response JSON: { "error": { "message": "...", "details": "..." } }

## POST /api/uploads/cloudinary/delete
Route File: src/interfaces/http/routes/uploads.js
Controller File: src/interfaces/http/controllers/uploads.controller.js#cloudinaryDeleteHandler
Middleware: authRequired -> requireRole(ADMIN) -> validate(cloudinaryDeleteSchema)
Headers Required: Authorization
Query Params: none
Path Params: none
Body Fields: publicId
Success Response JSON: { "result": "..." }
Error Response JSON: { "error": { "message": "...", "details": "..." } }

## POST /api/products/:productId/reviews/:reviewId/approve
Route File: src/interfaces/http/routes/reviews.js
Controller File: src/interfaces/http/controllers/reviews.controller.js#approveReview
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: none
Path Params: productId, reviewId
Body Fields: none
Success Response JSON: { "review": "..." }
Error Response JSON: Global Error Response JSON

## POST /api/products/:productId/reviews/:reviewId/hide
Route File: src/interfaces/http/routes/reviews.js
Controller File: src/interfaces/http/controllers/reviews.controller.js#hideReview
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: none
Path Params: productId, reviewId
Body Fields: none
Success Response JSON: { "review": "..." }
Error Response JSON: Global Error Response JSON

## POST /api/brands
Route File: src/interfaces/http/routes/brands.js
Controller File: src/interfaces/http/controllers/brands.controller.js#createBrand
Middleware: authRequired -> requireRole(ADMIN) -> validate(brandSchema)
Headers Required: Authorization
Query Params: none
Path Params: none
Body Fields: name, slug, description, isActive
Success Response JSON: { "brand": "..." }
Error Response JSON: Global Error Response JSON

## PUT /api/brands/:id
Route File: src/interfaces/http/routes/brands.js
Controller File: src/interfaces/http/controllers/brands.controller.js#updateBrand
Middleware: authRequired -> requireRole(ADMIN) -> validate(brandUpdateSchema)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: name, slug, description, isActive
Success Response JSON: { "brand": "..." }
Error Response JSON: Global Error Response JSON

## DELETE /api/brands/:id
Route File: src/interfaces/http/routes/brands.js
Controller File: src/interfaces/http/controllers/brands.controller.js#deleteBrand
Middleware: authRequired -> requireRole(ADMIN) -> validate(idParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: result
Error Response JSON: Global Error Response JSON
## GET /api/admin/products
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/products.controller.js#listProducts
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: q, category, minPrice, maxPrice, page, limit, includeDeleted
Path Params: none
Body Fields: none
Success Response JSON: mappedResult
Error Response JSON: Global Error Response JSON

## GET /api/admin/products/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/products.controller.js#getProduct
Middleware: authRequired -> requireRole(ADMIN) -> validate(idParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: { "product": "..." }
Error Response JSON: Global Error Response JSON

## POST /api/admin/products
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/products.controller.js#createProduct
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(PRODUCT_CREATE) -> validate(productCreateSchema)
Headers Required: Authorization
Query Params: none
Path Params: none
Body Fields: name, description, price, stock, category, brand, images, attributes, options, variants
Success Response JSON: { "product": "..." }
Error Response JSON: Global Error Response JSON

## PUT /api/admin/products/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/products.controller.js#updateProduct
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(PRODUCT_EDIT) -> validate({ ...idParam, ...productUpdateSchema })
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: name, description, price, stock, category, brand, images, attributes, options, variants, isDeleted
Success Response JSON: { "product": "..." }
Error Response JSON: Global Error Response JSON

## PATCH /api/admin/products/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/products.controller.js#updateProduct
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(PRODUCT_EDIT) -> validate({ ...idParam, ...productUpdateSchema })
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: name, description, price, stock, category, brand, images, attributes, options, variants, isDeleted
Success Response JSON: { "product": "..." }
Error Response JSON: Global Error Response JSON

## DELETE /api/admin/products/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/products.controller.js#deleteProduct
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(PRODUCT_DELETE) -> validate(idParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: result
Error Response JSON: Global Error Response JSON

## POST /api/admin/products/:id/restore
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/products.controller.js#restoreProduct
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(PRODUCT_EDIT) -> validate(idParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: { "product": "..." }
Error Response JSON: Global Error Response JSON

## POST /api/admin/products/import
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#importProductsController
Middleware: authRequired -> requireRole(ADMIN) -> validate(importSchema)
Headers Required: Authorization
Query Params: none
Path Params: none
Body Fields: items
Success Response JSON: result
Error Response JSON: Global Error Response JSON

## GET /api/admin/products/export
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#exportProductsController
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: none
Path Params: none
Body Fields: none
Success Response JSON: { "items": "..." }
Error Response JSON: Global Error Response JSON

## POST /api/admin/products/price-bulk
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#priceBulkController
Middleware: authRequired -> requireRole(ADMIN) -> validate(priceBulkSchema)
Headers Required: Authorization
Query Params: none
Path Params: none
Body Fields: ids, mode, value
Success Response JSON: { "updated": "..." }
Error Response JSON: Global Error Response JSON

## POST /api/admin/products/category-bulk
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#categoryBulkController
Middleware: authRequired -> requireRole(ADMIN) -> validate(categoryBulkSchema)
Headers Required: Authorization
Query Params: none
Path Params: none
Body Fields: ids, category
Success Response JSON: { "updated": "..." }
Error Response JSON: Global Error Response JSON

## POST /api/admin/products/variants-matrix
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#variantsMatrixController
Middleware: authRequired -> requireRole(ADMIN) -> validate(variantsMatrixSchema)
Headers Required: Authorization
Query Params: none
Path Params: none
Body Fields: options
Success Response JSON: { "items": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/products/:id/references
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#productReferencesController
Middleware: authRequired -> requireRole(ADMIN) -> validate(idParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: result
Error Response JSON: Global Error Response JSON

## GET /api/admin/reports/sales
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#salesReportController
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: from, to
Path Params: none
Body Fields: none
Success Response JSON: result
Error Response JSON: Global Error Response JSON

## GET /api/admin/reports/top-products
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#topProductsReportController
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: from, to, limit
Path Params: none
Body Fields: none
Success Response JSON: { "items": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/reports/top-customers
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#topCustomersReportController
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: from, to, limit
Path Params: none
Body Fields: none
Success Response JSON: { "items": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/categories
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/categories.controller.js#listCategories
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: none
Path Params: none
Body Fields: none
Success Response JSON: { "items": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/categories/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/categories.controller.js#getCategory
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: { "category": "..." }
Error Response JSON: Global Error Response JSON

## POST /api/admin/categories
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/categories.controller.js#createCategory
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(CATEGORY_CREATE) -> validate(categorySchema)
Headers Required: Authorization
Query Params: none
Path Params: none
Body Fields: name, slug, parent, image, sortOrder
Success Response JSON: { "category": "..." }
Error Response JSON: Global Error Response JSON

## PUT /api/admin/categories/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/categories.controller.js#updateCategory
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(CATEGORY_EDIT) -> validate(categorySchema)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: name, slug, parent, image, sortOrder
Success Response JSON: { "category": "..." }
Error Response JSON: Global Error Response JSON

## DELETE /api/admin/categories/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/categories.controller.js#deleteCategory
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(CATEGORY_DELETE)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: result
Error Response JSON: Global Error Response JSON

## POST /api/admin/categories/:id/restore
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/categories.controller.js#restoreCategory
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(CATEGORY_RESTORE)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: { "category": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/categories/:id/children
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/categories.controller.js#listChildren
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: { "items": "..." }
Error Response JSON: Global Error Response JSON

## POST /api/admin/categories/:id/reorder
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/categories.controller.js#reorderChildren
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(CATEGORY_EDIT) -> validate(reorderSchema)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: children
Success Response JSON: { "items": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/brands
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/brands.controller.js#listBrands
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: q, page, limit
Path Params: none
Body Fields: none
Success Response JSON: result
Error Response JSON: Global Error Response JSON

## GET /api/admin/brands/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/brands.controller.js#getBrand
Middleware: authRequired -> requireRole(ADMIN) -> validate(brandIdParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: { "brand": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/brands/:id/references
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#brandReferencesController
Middleware: authRequired -> requireRole(ADMIN) -> validate(brandIdParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: result
Error Response JSON: Global Error Response JSON

## GET /api/admin/reservations
Route File: src/interfaces/http/routes/reservations.js
Controller File: src/interfaces/http/controllers/reservations.controller.js#listReservations
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: orderId, sku
Path Params: none
Body Fields: none
Success Response JSON: result
Error Response JSON: Global Error Response JSON

## POST /api/admin/reservations/:orderId/release
Route File: src/interfaces/http/routes/reservations.js
Controller File: src/interfaces/http/controllers/reservations.controller.js#releaseReservationsForOrder
Middleware: authRequired -> requireRole(ADMIN) -> validate(releaseReservationsSchema)
Headers Required: Authorization
Query Params: none
Path Params: orderId
Body Fields: reason
Success Response JSON: { "released": "..." }
Error Response JSON: Global Error Response JSON
## GET /api/admin/currency-rates
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#listCurrencyRatesController
Middleware: authRequired -> requireRole(ADMIN) -> validate(currencyRateListSchema)
Headers Required: Authorization
Query Params: base, page, limit
Path Params: none
Body Fields: none
Success Response JSON: result
Error Response JSON: Global Error Response JSON

## POST /api/admin/currency-rates
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#upsertCurrencyRateController
Middleware: authRequired -> requireRole(ADMIN) -> validate(currencyRateSchema)
Headers Required: Authorization
Query Params: none
Path Params: none
Body Fields: base, currency, rate, source
Success Response JSON: { "rate": "..." }
Error Response JSON: Global Error Response JSON

## DELETE /api/admin/currency-rates/:currency
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#deleteCurrencyRateController
Middleware: authRequired -> requireRole(ADMIN) -> validate(currencyRateDeleteSchema)
Headers Required: Authorization
Query Params: base
Path Params: currency
Body Fields: none
Success Response JSON: { "success": true }
Error Response JSON: Global Error Response JSON

## GET /api/admin/inventory/adjustments
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#listAdjustmentsController
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: page, limit, sku
Path Params: none
Body Fields: none
Success Response JSON: result
Error Response JSON: Global Error Response JSON

## POST /api/admin/inventory/adjustments
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#createAdjustmentController
Middleware: authRequired -> requireRole(ADMIN) -> validate(adjustSchema)
Headers Required: Authorization
Query Params: none
Path Params: none
Body Fields: sku, qty, reason
Success Response JSON: { "inventory": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/inventory
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#listInventoryController
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: q, page, limit
Path Params: none
Body Fields: none
Success Response JSON: result
Error Response JSON: Global Error Response JSON

## GET /api/admin/inventory/low
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#lowStockController
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: threshold
Path Params: none
Body Fields: none
Success Response JSON: { "items": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/inventory/locations
Route File: src/interfaces/http/routes/admin.js
Controller File: src/modules/inventory/controllers/location.controller.js#listLocationsController
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(INVENTORY_LOCATION_VIEW) -> validate(locationListQuery)
Headers Required: Authorization
Query Params: page, limit, includeDeleted, q, type, isActive
Path Params: none
Body Fields: none
Success Response JSON: response
Error Response JSON: Global Error Response JSON

## POST /api/admin/inventory/locations
Route File: src/interfaces/http/routes/admin.js
Controller File: src/modules/inventory/controllers/location.controller.js#createLocationController
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(INVENTORY_LOCATION_CREATE) -> validate(locationCreateSchema)
Headers Required: Authorization
Query Params: none
Path Params: none
Body Fields: code, name, type, address, geo, handlingCost, priority, isActive
Success Response JSON: { "location": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/inventory/locations/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/modules/inventory/controllers/location.controller.js#getLocationController
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(INVENTORY_LOCATION_VIEW) -> validate(locationIdParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: { "location": "..." }
Error Response JSON: { "error": { "message": "Location not found" } }

## PUT /api/admin/inventory/locations/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/modules/inventory/controllers/location.controller.js#updateLocationController
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(INVENTORY_LOCATION_EDIT) -> validate({ ...locationIdParam, ...locationUpdateSchema })
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: code, name, type, address, geo, handlingCost, priority, isActive
Success Response JSON: { "location": "..." }
Error Response JSON: Global Error Response JSON

## DELETE /api/admin/inventory/locations/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/modules/inventory/controllers/location.controller.js#deleteLocationController
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(INVENTORY_LOCATION_DELETE) -> validate(locationIdParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: result
Error Response JSON: Global Error Response JSON

## POST /api/admin/inventory/locations/:id/restore
Route File: src/interfaces/http/routes/admin.js
Controller File: src/modules/inventory/controllers/location.controller.js#restoreLocationController
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(INVENTORY_LOCATION_EDIT) -> validate(locationIdParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: { "location": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/inventory/transfers
Route File: src/interfaces/http/routes/admin.js
Controller File: src/modules/inventory/controllers/transfer.controller.js#listTransferOrdersController
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(INVENTORY_TRANSFER_VIEW) -> validate(transferListQuery)
Headers Required: Authorization
Query Params: page, limit, status, fromLocationId, toLocationId
Path Params: none
Body Fields: none
Success Response JSON: result
Error Response JSON: Global Error Response JSON

## POST /api/admin/inventory/transfers
Route File: src/interfaces/http/routes/admin.js
Controller File: src/modules/inventory/controllers/transfer.controller.js#createTransferOrderController
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(INVENTORY_TRANSFER_CREATE) -> validate(transferCreateSchema)
Headers Required: Authorization
Query Params: none
Path Params: none
Body Fields: fromLocationId, toLocationId, lines, note
Success Response JSON: { "transfer": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/inventory/transfers/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/modules/inventory/controllers/transfer.controller.js#getTransferOrderController
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(INVENTORY_TRANSFER_VIEW) -> validate(idParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: { "transfer": "..." }
Error Response JSON: Global Error Response JSON

## PUT /api/admin/inventory/transfers/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/modules/inventory/controllers/transfer.controller.js#updateTransferOrderController
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(INVENTORY_TRANSFER_EDIT) -> validate({ ...idParam, ...transferUpdateSchema })
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: lines, note
Success Response JSON: { "transfer": "..." }
Error Response JSON: Global Error Response JSON

## PATCH /api/admin/inventory/transfers/:id/status
Route File: src/interfaces/http/routes/admin.js
Controller File: src/modules/inventory/controllers/transfer.controller.js#transitionTransferOrderController
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(INVENTORY_TRANSFER_EDIT) -> validate(transferStatusSchema)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: status
Success Response JSON: { "transfer": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/inventory/ledger
Route File: src/interfaces/http/routes/admin.js
Controller File: src/modules/inventory/controllers/ledger.controller.js#listLedgerController
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(INVENTORY_LEDGER_VIEW) -> validate(ledgerListQuery)
Headers Required: Authorization
Query Params: sku, locationId, reason, page, limit
Path Params: none
Body Fields: none
Success Response JSON: result
Error Response JSON: Global Error Response JSON

## GET /api/admin/inventory/ledger/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/modules/inventory/controllers/ledger.controller.js#getLedgerEntryController
Middleware: authRequired -> requireRole(ADMIN) -> checkPermission(INVENTORY_LEDGER_VIEW) -> validate(ledgerIdParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: { "entry": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/returns
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#listReturnsController
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: page, limit, status
Path Params: none
Body Fields: none
Success Response JSON: { "items": "...", "total": "...", "page": "...", "pages": "..." }
Error Response JSON: Global Error Response JSON

## POST /api/admin/returns/:id/approve
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#approveReturnController
Middleware: authRequired -> requireRole(ADMIN) -> idempotency -> validate(returnApproveSchema)
Headers Required: Authorization, Idempotency-Key
Query Params: none
Path Params: id
Body Fields: items
Success Response JSON: { "return": "...", "order": "...", "refund": "..." }
Error Response JSON: { "error": { "message": "...", "details": "..." } }

## POST /api/admin/returns/:id/reject
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#rejectReturnController
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: reason
Success Response JSON: { "return": "..." }
Error Response JSON: { "error": { "message": "..." } }

## GET /api/admin/transactions
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#listTransactionsController
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: page, limit, orderId, provider
Path Params: none
Body Fields: none
Success Response JSON: { "items": "...", "total": "...", "page": "...", "pages": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/transactions/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#getTransactionController
Middleware: authRequired -> requireRole(ADMIN) -> validate(idParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: { "transaction": "..." }
Error Response JSON: { "error": { "message": "Transaction not found" } }

## GET /api/admin/refunds
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#listRefundsAdminController
Middleware: authRequired -> requireRole(ADMIN)
Headers Required: Authorization
Query Params: page, limit, status
Path Params: none
Body Fields: none
Success Response JSON: { "items": "...", "total": "...", "page": "...", "pages": "..." }
Error Response JSON: Global Error Response JSON

## GET /api/admin/refunds/:id
Route File: src/interfaces/http/routes/admin.js
Controller File: src/interfaces/http/controllers/admin.controller.js#getRefundAdminController
Middleware: authRequired -> requireRole(ADMIN) -> validate(idParam)
Headers Required: Authorization
Query Params: none
Path Params: id
Body Fields: none
Success Response JSON: { "refund": "..." }
Error Response JSON: { "error": { "message": "Refund not found" } }
