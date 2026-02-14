import { apiClient } from "@/src/api/client/axios-client";
import { API_ENDPOINTS } from "@/src/constants/api-endpoints";
import { salesReportQuerySchema } from "@/src/modules/dashboard/schemas/date-range.schema";

import type {
  DashboardMetricsResponse,
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
  getMetrics(): Promise<DashboardMetricsResponse> {
    return apiClient.get<DashboardMetricsResponse>(API_ENDPOINTS.admin.metrics);
  },
  getSalesReport(params: SalesReportQueryInput): Promise<SalesReportResponse> {
    const parsedParams = salesReportQuerySchema.parse(params);

    return apiClient.get<SalesReportResponse>(
      withQueryParams(API_ENDPOINTS.admin.reports.sales, {
        from: parsedParams.from,
        to: parsedParams.to,
        groupBy: parsedParams.groupBy,
      }),
    );
  },
  getTopProducts(): Promise<TopProductsResponse> {
    return apiClient.get<TopProductsResponse>(API_ENDPOINTS.admin.reports.topProducts);
  },
  getTopCustomers(): Promise<TopCustomersResponse> {
    return apiClient.get<TopCustomersResponse>(API_ENDPOINTS.admin.reports.topCustomers);
  },
};
