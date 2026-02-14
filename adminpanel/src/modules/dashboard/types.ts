export type DashboardPrimitive = string | number | boolean | null;

export interface DashboardApiEnvelope<TData> {
  success: boolean;
  data: TData;
}

export type DashboardMetricRecord = Record<string, DashboardPrimitive>;

// TODO(/api/admin/metrics): IMPLEMENTED_API_DOCUMENTATION.md does not provide metric field names.
export type DashboardMetricsResponse = DashboardApiEnvelope<DashboardMetricRecord>;

export type DashboardReportRow = Record<string, DashboardPrimitive>;

// TODO(/api/admin/reports/sales): IMPLEMENTED_API_DOCUMENTATION.md does not provide row field names.
export type SalesReportResponse = DashboardApiEnvelope<DashboardReportRow[]>;

// TODO(/api/admin/reports/top-products): IMPLEMENTED_API_DOCUMENTATION.md does not provide row field names.
export type TopProductsResponse = DashboardApiEnvelope<DashboardReportRow[]>;

// TODO(/api/admin/reports/top-customers): IMPLEMENTED_API_DOCUMENTATION.md does not provide row field names.
export type TopCustomersResponse = DashboardApiEnvelope<DashboardReportRow[]>;
