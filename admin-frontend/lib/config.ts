// ============================================================
// Application Configuration
// All configurable values in one place — NO hardcoded values
// ============================================================

export const APP_CONFIG = {
  /** API base URL — from environment or fallback */
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api',

  /** Application name */
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Admin Panel',

  /** Default locale */
  defaultLocale: 'en-US',

  /** Supported locales */
  supportedLocales: ['en-US'] as const,

  /** Default currency */
  defaultCurrency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'USD',

  /** Token refresh interval in ms (14 min — token lives 15 min) */
  tokenRefreshInterval: 14 * 60 * 1000,

  /** Retry delay when token refresh fails (30 seconds) */
  refreshRetryDelay: 30_000,

  /** Default page size for paginated lists */
  defaultPageSize: 20,

  /** Max page size for paginated lists */
  maxPageSize: 100,

  /** Toast notification duration in ms */
  toastDuration: 4000,

  /** Debounce delay for search inputs in ms */
  searchDebounceMs: 300,

  /** Low stock threshold default */
  lowStockThreshold: 5,

  /** All available permissions from the backend (38 total) */
  permissions: {
    // Catalog
    PRODUCT_CREATE: 'product:create',
    PRODUCT_EDIT: 'product:edit',
    PRODUCT_DELETE: 'product:delete',
    CATEGORY_CREATE: 'category:create',
    CATEGORY_EDIT: 'category:edit',
    CATEGORY_DELETE: 'category:delete',
    CATEGORY_RESTORE: 'category:restore',
    BRAND_CREATE: 'brand:create',
    BRAND_EDIT: 'brand:edit',
    BRAND_DELETE: 'brand:delete',
    // Inventory
    INVENTORY_MANAGE: 'inventory:manage',
    INVENTORY_LOCATION_VIEW: 'inventory:location:view',
    INVENTORY_LOCATION_CREATE: 'inventory:location:create',
    INVENTORY_LOCATION_EDIT: 'inventory:location:edit',
    INVENTORY_LOCATION_DELETE: 'inventory:location:delete',
    INVENTORY_TRANSFER_VIEW: 'inventory:transfer:view',
    INVENTORY_TRANSFER_CREATE: 'inventory:transfer:create',
    INVENTORY_TRANSFER_EDIT: 'inventory:transfer:edit',
    INVENTORY_TRANSFER_DELETE: 'inventory:transfer:delete',
    INVENTORY_LEDGER_VIEW: 'inventory:ledger:view',
    // Orders
    ORDER_VIEW: 'order:view',
    ORDER_CREATE: 'order:create',
    ORDER_MANAGE: 'order:manage',
    ORDERS_TIMELINE_WRITE: 'orders:timeline:write',
    // Coupons
    COUPON_VIEW: 'coupon:view',
    COUPON_CREATE: 'coupon:create',
    COUPON_EDIT: 'coupon:edit',
    COUPON_DELETE: 'coupon:delete',
    // Reviews
    REVIEW_MODERATE: 'review:moderate',
    REVIEW_DELETE: 'review:delete',
    // Returns
    RETURN_VIEW: 'return:view',
    RETURN_MANAGE: 'return:manage',
    // Shipments
    SHIPMENT_VIEW: 'shipment:view',
    SHIPMENT_CREATE: 'shipment:create',
    SHIPMENT_EDIT: 'shipment:edit',
    // Users
    USER_VIEW: 'user:view',
    USER_EDIT: 'user:edit',
    USER_MANAGE: 'user:manage',
    // Uploads
    UPLOAD_CREATE: 'upload:create',
    UPLOAD_DELETE: 'upload:delete',
    // Payments
    PAYMENTS_EVENTS_VIEW: 'payments:events:view',
    PAYMENTS_REFUND: 'payments:refund',
    // Audit
    AUDIT_VIEW: 'audit:view',
    // Reports
    REPORT_VIEW: 'report:view',
  },

  /** Order status transition rules */
  orderStatusTransitions: {
    pending: ['paid', 'shipped', 'cancelled'],
    paid: ['shipped', 'cancelled'],
    shipped: ['delivered', 'cancelled'],
    delivered: [],
    cancelled: [],
    refunded: [],
  } as Record<string, string[]>,

  /** Transfer order status transitions */
  transferStatusTransitions: {
    DRAFT: ['REQUESTED', 'CANCELLED'],
    REQUESTED: ['IN_TRANSIT', 'CANCELLED'],
    IN_TRANSIT: ['RECEIVED', 'CANCELLED'],
    RECEIVED: [],
    CANCELLED: [],
  } as Record<string, string[]>,

  /** Inventory location types */
  locationTypes: ['WAREHOUSE', 'STORE', 'DROPSHIP', 'BUFFER'] as const,

  /** Shipping rate types */
  shippingRateTypes: ['flat', 'weight_based', 'price_based', 'free'] as const,

  /** Tax calculation types */
  taxCalcTypes: ['percentage', 'fixed'] as const,

  /** Coupon types */
  couponTypes: ['percent', 'fixed'] as const,

  /** Order statuses */
  orderStatuses: ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'] as const,

  /** Payment statuses */
  paymentStatuses: ['unpaid', 'paid', 'refunded'] as const,

  /** Return statuses */
  returnStatuses: ['requested', 'approved', 'rejected', 'refunded'] as const,

  /** Reservation statuses */
  reservationStatuses: ['active', 'cancelled', 'expired', 'converted'] as const,

  /** Transfer statuses */
  transferStatuses: ['DRAFT', 'REQUESTED', 'IN_TRANSIT', 'RECEIVED', 'CANCELLED'] as const,

  /** Ledger directions */
  ledgerDirections: ['IN', 'OUT', 'RESERVE', 'RELEASE', 'ADJUST', 'TRANSFER_IN', 'TRANSFER_OUT'] as const,

  /** Audit log HTTP methods */
  auditMethods: ['POST', 'PUT', 'PATCH', 'DELETE'] as const,

  /** Product visibility options */
  productVisibility: ['visible', 'hidden'] as const,

  /** Roles that can access admin panel */
  adminRoles: ['admin', 'warehouse_manager', 'ops_admin', 'support'] as const,
} as const;

export type Permission = (typeof APP_CONFIG.permissions)[keyof typeof APP_CONFIG.permissions];
export type OrderStatus = (typeof APP_CONFIG.orderStatuses)[number];
export type PaymentStatus = (typeof APP_CONFIG.paymentStatuses)[number];
export type LocationType = (typeof APP_CONFIG.locationTypes)[number];
export type ShippingRateType = (typeof APP_CONFIG.shippingRateTypes)[number];
