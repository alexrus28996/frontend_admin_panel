// API Endpoints from ADMIN_API_CONTRACT.md
export const API_ENDPOINTS = {
  // Users
  USERS: '/api/admin/users',
  USER_BY_ID: (id: string) => `/api/admin/users/${id}`,
  PROMOTE_USER: (id: string) => `/api/admin/users/${id}/promote`,
  DEMOTE_USER: (id: string) => `/api/admin/users/${id}/demote`,
  USER_PERMISSIONS: (id: string) => `/api/admin/users/${id}/permissions`,
  ADD_USER_PERMISSIONS: (id: string) => `/api/admin/users/${id}/permissions/add`,
  REMOVE_USER_PERMISSIONS: (id: string) => `/api/admin/users/${id}/permissions/remove`,

  // Metrics
  METRICS: '/api/admin/metrics',

  // Orders
  ORDERS: '/api/admin/orders',
  ORDER_BY_ID: (id: string) => `/api/admin/orders/${id}`,
  ORDER_TIMELINE: (id: string) => `/api/admin/orders/${id}/timeline`,
  ORDER_SHIPMENTS: (id: string) => `/api/admin/orders/${id}/shipments`,

  // Coupons
  COUPONS: '/api/admin/coupons',
  COUPON_BY_ID: (id: string) => `/api/admin/coupons/${id}`,

  // Payment Events
  PAYMENT_EVENTS: '/api/admin/payment-events',
  PAYMENT_EVENT_BY_ID: (id: string) => `/api/admin/payment-events/${id}`,

  // Shipments
  SHIPMENTS: '/api/admin/shipments',
  SHIPMENT_BY_ID: (id: string) => `/api/admin/shipments/${id}`,

  // Products
  PRODUCTS: '/api/admin/products',
  PRODUCT_BY_ID: (id: string) => `/api/admin/products/${id}`,
  PRODUCT_RESTORE: (id: string) => `/api/admin/products/${id}/restore`,
  PRODUCTS_IMPORT: '/api/admin/products/import',
  PRODUCTS_EXPORT: '/api/admin/products/export',
  PRODUCTS_PRICE_BULK: '/api/admin/products/price-bulk',
  PRODUCTS_STOCK_BULK: '/api/admin/products/stock-bulk',

  // Uploads
  UPLOAD: '/api/uploads',
  UPLOAD_CLOUDINARY: '/api/uploads/cloudinary',
  UPLOAD_CLOUDINARY_DELETE: '/api/uploads/cloudinary/delete',

  // Reviews
  APPROVE_REVIEW: (productId: string, reviewId: string) =>
    `/api/products/${productId}/reviews/${reviewId}/approve`,
  HIDE_REVIEW: (productId: string, reviewId: string) =>
    `/api/products/${productId}/reviews/${reviewId}/hide`,

  // Brands
  BRANDS: '/api/brands',
  BRAND_BY_ID: (id: string) => `/api/brands/${id}`,

  // Categories
  CATEGORIES: '/api/categories',
  CATEGORY_BY_ID: (id: string) => `/api/categories/${id}`,

  // Analytics
  ANALYTICS_REVENUE: '/api/admin/analytics/revenue',
  ANALYTICS_SALES: '/api/admin/analytics/sales',
} as const;
