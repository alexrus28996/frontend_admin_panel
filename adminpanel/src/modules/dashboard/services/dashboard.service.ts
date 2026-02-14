import { apiClient } from "@/src/api/client/axios-client";
import { API_ENDPOINTS } from "@/src/constants/api-endpoints";
import { salesReportQuerySchema } from "@/src/modules/dashboard/schemas/date-range.schema";

import type {
  DashboardMetricRecord,
  DashboardReportRow,
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const unwrapResponseData = (response: unknown): unknown => {
  if (isRecord(response) && "data" in response) {
    return response.data;
  }

  return response;
};

const normalizeMetrics = (response: unknown): DashboardMetricRecord => {
  const payload = unwrapResponseData(response);

  if (!isRecord(payload)) {
    return {};
  }

  if ("metrics" in payload && isRecord(payload.metrics)) {
    return payload.metrics as DashboardMetricRecord;
  }

  if ("kpis" in payload && isRecord(payload.kpis)) {
    return payload.kpis as DashboardMetricRecord;
  }

  return payload as DashboardMetricRecord;
};

const normalizeReportRows = (response: unknown): DashboardReportRow[] => {
  const payload = unwrapResponseData(response);

  if (Array.isArray(payload)) {
    return payload.filter((item): item is DashboardReportRow => isRecord(item));
  }

  if (!isRecord(payload)) {
    return [];
  }

  if (Array.isArray(payload.rows)) {
    return payload.rows.filter((item): item is DashboardReportRow => isRecord(item));
  }

  if (Array.isArray(payload.items)) {
    return payload.items.filter((item): item is DashboardReportRow => isRecord(item));
  }

  return [];
};

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetricRecord> {
    const response = await apiClient.get<unknown>(API_ENDPOINTS.admin.metrics);
    return normalizeMetrics(response);
  },
  async getSalesReport(params: SalesReportQueryInput): Promise<DashboardReportRow[]> {
    const parsedParams = salesReportQuerySchema.parse(params);

    const response = await apiClient.get<unknown>(
      withQueryParams(API_ENDPOINTS.admin.reports.sales, {
        from: parsedParams.from,
        to: parsedParams.to,
        groupBy: parsedParams.groupBy,
      }),
    );

    return normalizeReportRows(response);
  },
  async getTopProducts(): Promise<DashboardReportRow[]> {
    const response = await apiClient.get<unknown>(API_ENDPOINTS.admin.reports.topProducts);
    return normalizeReportRows(response);
  },
  async getTopCustomers(): Promise<DashboardReportRow[]> {
    const response = await apiClient.get<unknown>(API_ENDPOINTS.admin.reports.topCustomers);
    return normalizeReportRows(response);
  },
};
