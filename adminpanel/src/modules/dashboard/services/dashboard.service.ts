import { apiClient } from "@/src/api/client/axios-client";
import { API_ENDPOINTS } from "@/src/constants/api-endpoints";
import { salesReportQuerySchema } from "@/src/modules/dashboard/schemas/date-range.schema";

import type {
  DashboardMetricRecord,
  DashboardMetricsResponse,
  DashboardReportRow,
  SalesReportResponse,
  TopCustomersResponse,
  TopProductsResponse,
} from "@/src/modules/dashboard/types";
import type { SalesReportQueryInput } from "@/src/modules/dashboard/schemas/date-range.schema";

const withQueryParams = (basePath: string, params: Record<string, string | undefined>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `${basePath}?${query}` : basePath;
};

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetricRecord> {
    const response = await apiClient.get<DashboardMetricsResponse>(API_ENDPOINTS.admin.metrics);
    return response.data;
  },
  async getSalesReport(params: SalesReportQueryInput): Promise<DashboardReportRow[]> {
    const parsedParams = salesReportQuerySchema.parse(params);

    const response = await apiClient.get<SalesReportResponse>(
      withQueryParams(API_ENDPOINTS.admin.reports.sales, {
        from: parsedParams.from,
        to: parsedParams.to,
        groupBy: parsedParams.groupBy,
      }),
    );

    return response.data;
  },
  async getTopProducts(): Promise<DashboardReportRow[]> {
    const response = await apiClient.get<TopProductsResponse>(API_ENDPOINTS.admin.reports.topProducts);
    return response.data;
  },
  async getTopCustomers(): Promise<DashboardReportRow[]> {
    const response = await apiClient.get<TopCustomersResponse>(API_ENDPOINTS.admin.reports.topCustomers);
    return response.data;
  },
};
