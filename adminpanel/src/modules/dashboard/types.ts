export type DashboardPrimitive = string | number | boolean | null;

export interface DashboardMetricsResponse {
  // TODO: API documentation does not define concrete metric fields.
  [metricName: string]: DashboardPrimitive | unknown;
}

export interface SalesReportEntry {
  // TODO: Exact sales report payload shape is undocumented.
  period?: string;
  totalSales?: number;
  orderCount?: number;
  status?: string;
  [key: string]: unknown;
}

export interface SalesReportResponse {
  // TODO: API documentation does not confirm response root key.
  items?: SalesReportEntry[];
  data?: SalesReportEntry[];
  summary?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface TopProductEntry {
  // TODO: Exact product report payload shape is undocumented.
  productId?: string | number;
  productName?: string;
  quantitySold?: number;
  revenue?: number;
  status?: string;
  [key: string]: unknown;
}

export interface TopProductsResponse {
  // TODO: API documentation does not confirm response root key.
  items?: TopProductEntry[];
  data?: TopProductEntry[];
  [key: string]: unknown;
}

export interface TopCustomerEntry {
  // TODO: Exact customer report payload shape is undocumented.
  customerId?: string | number;
  customerName?: string;
  orders?: number;
  spent?: number;
  status?: string;
  [key: string]: unknown;
}

export interface TopCustomersResponse {
  // TODO: API documentation does not confirm response root key.
  items?: TopCustomerEntry[];
  data?: TopCustomerEntry[];
  [key: string]: unknown;
}
