export const ORDER_STATUS = {
  pending: "PENDING",
  processing: "PROCESSING",
  completed: "COMPLETED",
  cancelled: "CANCELLED",
  refunded: "REFUNDED",
} as const;

export const PAYMENT_STATUS = {
  pending: "PENDING",
  paid: "PAID",
  failed: "FAILED",
  refunded: "REFUNDED",
} as const;

export const RETURN_STATUS = {
  requested: "REQUESTED",
  approved: "APPROVED",
  rejected: "REJECTED",
  completed: "COMPLETED",
} as const;

export const SHIPMENT_STATUS = {
  pending: "PENDING",
  packed: "PACKED",
  shipped: "SHIPPED",
  delivered: "DELIVERED",
  returned: "RETURNED",
} as const;
