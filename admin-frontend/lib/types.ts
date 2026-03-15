// ============================================================
// Type definitions for the Admin Panel
// Strictly derived from MODELS_REFERENCE.md / ADMIN_PANEL_API.md
// ============================================================

// --- Auth ---
export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  roles: string[];
  permissions: string[];
  isActive: boolean;
  isVerified: boolean;
  failedLoginAttempts?: number;
  lockUntil?: string;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  locale: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

// --- Product ---
export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductDimensions {
  length?: number;
  width?: number;
  height?: number;
  unit?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  longDescription?: string;
  price?: number;
  compareAtPrice?: number;
  costPrice?: number;
  currency?: string;
  images: ProductImage[];
  attributes?: Record<string, string>;
  category?: string | Category;
  brand?: string | Brand;
  vendor?: string;
  sku?: string;
  barcode?: string;
  mpn?: string;
  taxClass?: string;
  tags: string[];
  ratingAvg: number;
  ratingCount: number;
  requiresShipping: boolean;
  weight?: number;
  weightUnit?: string;
  dimensions?: ProductDimensions;
  isActive: boolean;
  hasVariants: boolean;
  visibility: 'visible' | 'hidden';
  deletedAt?: string | null;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  _id: string;
  sku: string;
  price: number;
  stock: number;
  attributes?: Record<string, string>;
  barcode?: string;
  images?: ProductImage[];
  isActive: boolean;
}

// --- Category ---
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string | null;
  image?: ProductImage;
  banner?: ProductImage;
  icon?: string;
  sortOrder?: number;
  metaTitle?: string;
  metaDescription?: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// --- Brand ---
export interface Brand {
  _id: string;
  name: string;
  slug?: string;
  logo?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Order ---
export interface OrderItem {
  product: string;
  variant?: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  sku?: string;
}

export interface Order {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  orderNumber?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'cod' | 'prepaid';
  paymentProvider?: string;
  transactionId?: string;
  items: OrderItem[];
  shippingAddress?: Address;
  billingAddress?: Address;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  couponCode?: string;
  invoiceNumber?: string;
  invoicePath?: string;
  invoiceUrl?: string;
  placedAt?: string;
  timeline?: OrderTimelineEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderTimelineEntry {
  status?: string;
  note?: string;
  by?: string;
  at: string;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

// --- Address ---
export interface Address {
  _id?: string;
  user?: string;
  type: 'shipping' | 'billing';
  fullName?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  label?: string;
  isDefault?: boolean;
}

// --- Coupon ---
export interface Coupon {
  _id: string;
  code: string;
  description?: string;
  type: 'percent' | 'fixed';
  value: number;
  minSubtotal?: number;
  expiresAt?: string;
  isActive: boolean;
  perUserLimit?: number;
  globalLimit?: number;
  usageCount: number;
  usedBy?: string[];
  includeCategories?: string[];
  excludeCategories?: string[];
  includeProducts?: string[];
  excludeProducts?: string[];
  createdAt: string;
  updatedAt: string;
}

// --- Inventory ---
export interface StockItem {
  _id: string;
  productId: string;
  product?: string | { _id: string; name: string };
  variantId?: string | null;
  locationId: string;
  location?: string | InventoryLocation;
  onHand: number;
  reserved: number;
  incoming: number;
  safetyStock?: number;
  reorderPoint?: number;
  available: number;
}

export interface InventoryLocation {
  _id: string;
  code: string;
  name: string;
  type: 'WAREHOUSE' | 'STORE' | 'DROPSHIP' | 'BUFFER';
  geo?: {
    lat?: number;
    lng?: number;
    pincode?: string;
    country?: string;
    region?: string;
    state?: string;
  };
  priority?: number;
  active: boolean;
  deletedAt?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface TransferOrder {
  _id: string;
  fromLocationId: string | InventoryLocation;
  toLocationId: string | InventoryLocation;
  status: 'DRAFT' | 'REQUESTED' | 'IN_TRANSIT' | 'RECEIVED' | 'CANCELLED';
  lines: TransferLine[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface TransferLine {
  productId: string;
  variantId?: string | null;
  qty: number;
}

export interface LedgerEntry {
  _id: string;
  productId: string;
  variantId?: string | null;
  locationId: string;
  qty: number;
  direction: 'IN' | 'OUT' | 'RESERVE' | 'RELEASE' | 'ADJUST' | 'TRANSFER_IN' | 'TRANSFER_OUT';
  reason: string;
  refType?: string;
  refId?: string;
  occurredAt: string;
  actor?: string;
  metadata?: Record<string, unknown>;
}

// --- Shipping ---
export interface ShippingZone {
  _id: string;
  name: string;
  countries: string[];
  states?: string[];
  postalCodePatterns?: string[];
  isActive: boolean;
  priority?: number;
}

export interface ShippingMethod {
  _id: string;
  name: string;
  code: string;
  description?: string;
  zones: string[];
  rateType: 'flat' | 'weight_based' | 'price_based' | 'free';
  flatRate?: number;
  weightTiers?: WeightTier[];
  priceTiers?: PriceTier[];
  minSubtotal?: number;
  freeAbove?: number;
  currency?: string;
  estimatedMinDays?: number;
  estimatedMaxDays?: number;
  sortOrder?: number;
  isActive: boolean;
}

export interface WeightTier {
  minWeight: number;
  maxWeight?: number;
  price: number;
}

export interface PriceTier {
  minSubtotal: number;
  maxSubtotal?: number;
  price: number;
}

// --- Tax ---
export interface TaxZone {
  _id: string;
  name: string;
  countries: string[];
  states?: string[];
  description?: string;
  isActive: boolean;
  priority?: number;
}

export interface TaxRule {
  _id: string;
  name: string;
  zone: string | TaxZone;
  category?: string | null;
  calcType: 'percentage' | 'fixed';
  rate: number;
  priority?: number;
  isActive: boolean;
  inclusive: boolean;
  label?: string;
}

// --- Currency ---
export interface CurrencyRate {
  _id: string;
  baseCurrency: string;
  currency: string;
  rate: number;
  source: string;
}

// --- Payment ---
export interface PaymentTransaction {
  _id: string;
  order: string;
  provider: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  amount: number;
  currency: string;
  providerRef?: string;
  raw?: Record<string, unknown>;
  createdAt: string;
}

export interface Refund {
  _id: string;
  order: string;
  transaction: string;
  provider: string;
  status: 'pending' | 'succeeded' | 'failed';
  amount: number;
  currency: string;
  reason?: string;
  providerRef?: string;
  raw?: Record<string, unknown>;
  createdAt: string;
}

export interface PaymentEvent {
  _id: string;
  provider: string;
  eventId: string;
  type: string;
  order?: string;
  data?: Record<string, unknown>;
  receivedAt: string;
}

// --- Returns ---
export interface ReturnRequest {
  _id: string;
  order: string | { _id: string; orderNumber?: string };
  user: string | { _id: string; name: string; email: string };
  status: 'requested' | 'approved' | 'rejected' | 'refunded';
  reason: string;
  note?: string;
  items: ReturnItem[];
  refund?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedAt?: string;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnItem {
  product: string;
  variant?: string;
  quantity: number;
  reason?: string;
  name?: string;
}

// --- Shipment ---
export interface Shipment {
  _id: string;
  order: string;
  carrier?: string;
  tracking?: string;
  service?: string;
  status: 'pending' | 'shipped' | 'delivered' | 'returned';
  items: ShipmentItem[];
  shippedAt?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  address?: Address;
  createdAt: string;
}

export interface ShipmentItem {
  product: string;
  variant?: string | null;
  name: string;
  quantity: number;
}

// --- Review ---
export interface Review {
  _id: string;
  product: string | { _id: string; name: string };
  user: string | { _id: string; name: string };
  rating: number;
  title?: string;
  comment?: string;
  isApproved: boolean;
  verifiedPurchase?: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Audit Log ---
export interface AuditLog {
  _id: string;
  user: string | { _id: string; name?: string; email?: string };
  method: string;
  path: string;
  status: number;
  ip?: string;
  requestId?: string;
  query?: Record<string, unknown>;
  params?: Record<string, unknown>;
  body?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  duration?: number;
  createdAt: string;
}

// --- Notification ---
export interface Notification {
  _id: string;
  user: string;
  type: string;
  channel?: string;
  title: string;
  body: string;
  actionUrl?: string;
  refModel?: string;
  refId?: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string;
  meta?: Record<string, unknown>;
  createdAt: string;
}

// --- Reservation ---
export interface Reservation {
  _id: string;
  orderId: string;
  productId: string;
  variantId?: string | null;
  userId?: string;
  locationId: string;
  reservedQty: number;
  status: 'active' | 'cancelled' | 'expired' | 'converted';
  expiryTimestamp: string;
  notes?: string;
  releasedAt?: string;
  convertedAt?: string;
  createdAt?: string;
}

// --- Dashboard ---
export interface DashboardMetrics {
  usersTotal: number;
  usersActive: number;
  adminsCount: number;
  productsCount: number;
  ordersTotal: number;
  ordersByStatus: Record<string, number>;
  revenueLast7Days: number;
}

export interface SalesReport {
  groupBy: string;
  series: SalesDataPoint[];
}

export interface SalesDataPoint {
  _id: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface TopCustomer {
  userId: string;
  name: string;
  email: string;
  totalOrders: number;
  totalRevenue: number;
}

// --- Pagination ---
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}

// --- Product Attribute and Option ---
export interface ProductAttribute {
  _id: string;
  product: string;
  name: string;
  description?: string;
  sortOrder: number;
  isRequired: boolean;
  options?: ProductOption[];
}

export interface ProductOption {
  _id: string;
  attribute: string;
  name: string;
  sortOrder: number;
  metadata?: Record<string, unknown>;
}
