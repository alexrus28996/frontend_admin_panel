"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/src/components/data-table/data-table";
import { Skeleton } from "@/src/components/states/skeleton";
import { AlertBanner } from "@/src/components/ui/alert-banner";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { PageTitle, SectionTitle, Text } from "@/src/components/ui/typography";
import { useI18n } from "@/src/i18n/providers/i18n-provider";
import { dashboardService } from "@/src/modules/dashboard/services/dashboard.service";

import type {
  DashboardPrimitive,
  SalesReportEntry,
  SalesReportResponse,
  TopCustomerEntry,
  TopCustomersResponse,
  TopProductEntry,
  TopProductsResponse,
} from "@/src/modules/dashboard/types";

const defaultPagination = { page: 1, pageSize: 10, totalItems: 1, totalPages: 1 };

type GroupBy = "day" | "week" | "month";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const formatCellValue = (value: unknown): string => {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (value === null || value === undefined) {
    return "-";
  }

  return JSON.stringify(value);
};

const extractArray = <TItem,>(response: Record<string, unknown>): TItem[] => {
  const items = response.items;
  if (Array.isArray(items)) return items as TItem[];

  const data = response.data;
  if (Array.isArray(data)) return data as TItem[];

  return [];
};

const statusVariant = (value: string): "default" | "success" | "warning" | "destructive" => {
  const normalized = value.toLowerCase();

  if (["success", "completed", "paid", "active"].includes(normalized)) return "success";
  if (["pending", "processing", "draft"].includes(normalized)) return "warning";
  if (["failed", "cancelled", "inactive"].includes(normalized)) return "destructive";

  return "default";
};

export default function DashboardPage() {
  const { t } = useI18n();

  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [groupBy, setGroupBy] = useState<GroupBy>("day");

  const [metrics, setMetrics] = useState<Record<string, DashboardPrimitive | unknown> | null>(null);
  const [metricsLoading, setMetricsLoading] = useState<boolean>(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  const [salesRows, setSalesRows] = useState<SalesReportEntry[]>([]);
  const [salesLoading, setSalesLoading] = useState<boolean>(true);
  const [salesError, setSalesError] = useState<string | null>(null);

  const [topProductsRows, setTopProductsRows] = useState<TopProductEntry[]>([]);
  const [topProductsLoading, setTopProductsLoading] = useState<boolean>(true);
  const [topProductsError, setTopProductsError] = useState<string | null>(null);

  const [topCustomersRows, setTopCustomersRows] = useState<TopCustomerEntry[]>([]);
  const [topCustomersLoading, setTopCustomersLoading] = useState<boolean>(true);
  const [topCustomersError, setTopCustomersError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setMetricsLoading(true);
        setMetricsError(null);
        const response = await dashboardService.getMetrics();
        setMetrics(response);
      } catch (error) {
        const message = error instanceof Error ? error.message : t("errors.general");
        setMetricsError(message);
      } finally {
        setMetricsLoading(false);
      }
    };

    void loadMetrics();
  }, [t]);

  useEffect(() => {
    const loadSalesReport = async () => {
      try {
        setSalesLoading(true);
        setSalesError(null);
        const response: SalesReportResponse = await dashboardService.getSalesReport({
          from: fromDate || undefined,
          to: toDate || undefined,
          groupBy,
        });

        if (isRecord(response)) {
          setSalesRows(extractArray<SalesReportEntry>(response));
        } else {
          setSalesRows([]);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : t("errors.general");
        setSalesError(message);
      } finally {
        setSalesLoading(false);
      }
    };

    void loadSalesReport();
  }, [fromDate, groupBy, t, toDate]);

  useEffect(() => {
    const loadTopProducts = async () => {
      try {
        setTopProductsLoading(true);
        setTopProductsError(null);
        const response: TopProductsResponse = await dashboardService.getTopProducts();

        if (isRecord(response)) {
          setTopProductsRows(extractArray<TopProductEntry>(response));
        } else {
          setTopProductsRows([]);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : t("errors.general");
        setTopProductsError(message);
      } finally {
        setTopProductsLoading(false);
      }
    };

    void loadTopProducts();
  }, [t]);

  useEffect(() => {
    const loadTopCustomers = async () => {
      try {
        setTopCustomersLoading(true);
        setTopCustomersError(null);
        const response: TopCustomersResponse = await dashboardService.getTopCustomers();

        if (isRecord(response)) {
          setTopCustomersRows(extractArray<TopCustomerEntry>(response));
        } else {
          setTopCustomersRows([]);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : t("errors.general");
        setTopCustomersError(message);
      } finally {
        setTopCustomersLoading(false);
      }
    };

    void loadTopCustomers();
  }, [t]);

  const metricEntries = useMemo(() => Object.entries(metrics ?? {}), [metrics]);

  return (
    <div className="space-y-6">
      <PageTitle>{t("dashboard.title")}</PageTitle>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label={t("dashboard.kpis.section") }>
        {metricsLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card key={`kpi-skeleton-${index}`}>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))
          : metricsError
            ? (
              <div className="sm:col-span-2 lg:col-span-4">
                <AlertBanner title={t("dashboard.kpis.errorTitle")} description={metricsError} variant="error" />
              </div>
              )
            : metricEntries.length
              ? metricEntries.map(([key, value]) => (
                  <Card key={`metric-${key}`}>
                    <CardContent>
                      <Text className="text-text-secondary">{key}</Text>
                      <Text className="text-2xl font-semibold">{formatCellValue(value)}</Text>
                    </CardContent>
                  </Card>
                ))
              : (
                <div className="sm:col-span-2 lg:col-span-4">
                  <Card>
                    <CardContent>
                      <Text>{t("dashboard.kpis.empty")}</Text>
                    </CardContent>
                  </Card>
                </div>
                )}
      </section>

      <Card>
        <CardHeader>
          <SectionTitle>{t("dashboard.sales.filtersTitle")}</SectionTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input
              id="sales-from-date"
              type="date"
              ariaLabel={t("dashboard.sales.from")}
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
            />
            <Input
              id="sales-to-date"
              type="date"
              ariaLabel={t("dashboard.sales.to")}
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
            />
            <div className="w-full">
              <label htmlFor="sales-group-by" className="mb-1 block text-sm text-text-secondary">
                {t("dashboard.sales.groupBy")}
              </label>
              <select
                id="sales-group-by"
                className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-text-primary"
                value={groupBy}
                onChange={(event) => setGroupBy(event.target.value as GroupBy)}
              >
                <option value="day">{t("dashboard.sales.groupByOptions.day")}</option>
                <option value="week">{t("dashboard.sales.groupByOptions.week")}</option>
                <option value="month">{t("dashboard.sales.groupByOptions.month")}</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>{t("dashboard.sales.title")}</SectionTitle>
        </CardHeader>
        <CardContent>
          <DataTable<SalesReportEntry>
            columns={[
              { id: "period", header: t("dashboard.sales.columns.period"), cell: (item) => formatCellValue(item.period) },
              {
                id: "totalSales",
                header: t("dashboard.sales.columns.totalSales"),
                cell: (item) => formatCellValue(item.totalSales),
              },
              {
                id: "orderCount",
                header: t("dashboard.sales.columns.orderCount"),
                cell: (item) => formatCellValue(item.orderCount),
              },
              {
                id: "status",
                header: t("dashboard.sales.columns.status"),
                cell: (item) =>
                  item.status ? <Badge variant={statusVariant(item.status)}>{item.status}</Badge> : formatCellValue(item.status),
              },
            ]}
            rows={salesRows}
            loading={salesLoading}
            error={salesError}
            searchValue=""
            pagination={defaultPagination}
            onSearchChange={() => undefined}
            onPaginationChange={() => undefined}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>{t("dashboard.topProducts.title")}</SectionTitle>
        </CardHeader>
        <CardContent>
          <DataTable<TopProductEntry>
            columns={[
              { id: "productName", header: t("dashboard.topProducts.columns.productName"), cell: (item) => formatCellValue(item.productName) },
              { id: "quantitySold", header: t("dashboard.topProducts.columns.quantitySold"), cell: (item) => formatCellValue(item.quantitySold) },
              { id: "revenue", header: t("dashboard.topProducts.columns.revenue"), cell: (item) => formatCellValue(item.revenue) },
              {
                id: "status",
                header: t("dashboard.topProducts.columns.status"),
                cell: (item) =>
                  item.status ? <Badge variant={statusVariant(item.status)}>{item.status}</Badge> : formatCellValue(item.status),
              },
            ]}
            rows={topProductsRows}
            loading={topProductsLoading}
            error={topProductsError}
            searchValue=""
            pagination={defaultPagination}
            onSearchChange={() => undefined}
            onPaginationChange={() => undefined}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>{t("dashboard.topCustomers.title")}</SectionTitle>
        </CardHeader>
        <CardContent>
          <DataTable<TopCustomerEntry>
            columns={[
              { id: "customerName", header: t("dashboard.topCustomers.columns.customerName"), cell: (item) => formatCellValue(item.customerName) },
              { id: "orders", header: t("dashboard.topCustomers.columns.orders"), cell: (item) => formatCellValue(item.orders) },
              { id: "spent", header: t("dashboard.topCustomers.columns.spent"), cell: (item) => formatCellValue(item.spent) },
              {
                id: "status",
                header: t("dashboard.topCustomers.columns.status"),
                cell: (item) =>
                  item.status ? <Badge variant={statusVariant(item.status)}>{item.status}</Badge> : formatCellValue(item.status),
              },
            ]}
            rows={topCustomersRows}
            loading={topCustomersLoading}
            error={topCustomersError}
            searchValue=""
            pagination={defaultPagination}
            onSearchChange={() => undefined}
            onPaginationChange={() => undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
}
