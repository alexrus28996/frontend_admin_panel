"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/src/components/data-table/data-table";
import { Skeleton } from "@/src/components/states/skeleton";
import { AlertBanner } from "@/src/components/ui/alert-banner";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { PageTitle, SectionTitle, Text } from "@/src/components/ui/typography";
import { useI18n } from "@/src/i18n/providers/i18n-provider";
import { dashboardService } from "@/src/modules/dashboard/services/dashboard.service";

import type { DataTableColumn } from "@/src/components/data-table/data-table";
import type { DashboardMetricRecord, DashboardPrimitive, DashboardReportRow } from "@/src/modules/dashboard/types";

const defaultPagination = { page: 1, pageSize: 10, totalItems: 1, totalPages: 1 };

type GroupBy = "day" | "week" | "month";

const formatCellValue = (value: unknown): string => {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (value === null || value === undefined) {
    return "-";
  }

  return JSON.stringify(value);
};

const createColumns = (rows: DashboardReportRow[] | null | undefined): DataTableColumn<DashboardReportRow>[] => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return [];
  }

  const firstRow = rows[0];

  return Object.keys(firstRow).map((key) => ({
    id: key,
    header: key,
    cell: (item) => formatCellValue(item[key]),
  }));
};

export default function DashboardPage() {
  const { t } = useI18n();

  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [groupBy, setGroupBy] = useState<GroupBy>("day");

  const [metrics, setMetrics] = useState<DashboardMetricRecord | null>(null);
  const [metricsLoading, setMetricsLoading] = useState<boolean>(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  const [salesRows, setSalesRows] = useState<DashboardReportRow[]>([]);
  const [salesLoading, setSalesLoading] = useState<boolean>(true);
  const [salesError, setSalesError] = useState<string | null>(null);

  const [topProductsRows, setTopProductsRows] = useState<DashboardReportRow[]>([]);
  const [topProductsLoading, setTopProductsLoading] = useState<boolean>(true);
  const [topProductsError, setTopProductsError] = useState<string | null>(null);

  const [topCustomersRows, setTopCustomersRows] = useState<DashboardReportRow[]>([]);
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
        const response = await dashboardService.getSalesReport({
          from: fromDate || undefined,
          to: toDate || undefined,
          groupBy,
        });

        setSalesRows(response);
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
        const response = await dashboardService.getTopProducts();
        setTopProductsRows(response);
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
        const response = await dashboardService.getTopCustomers();
        setTopCustomersRows(response);
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
  const salesColumns = useMemo(() => createColumns(salesRows), [salesRows]);
  const topProductsColumns = useMemo(() => createColumns(topProductsRows), [topProductsRows]);
  const topCustomersColumns = useMemo(() => createColumns(topCustomersRows), [topCustomersRows]);

  return (
    <div className="space-y-6">
      <PageTitle>{t("dashboard.title")}</PageTitle>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label={t("dashboard.kpis.section")}>
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
                      <Text className="text-2xl font-semibold">{formatCellValue(value as DashboardPrimitive)}</Text>
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
          <DataTable<DashboardReportRow>
            columns={salesColumns}
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
          <DataTable<DashboardReportRow>
            columns={topProductsColumns}
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
          <DataTable<DashboardReportRow>
            columns={topCustomersColumns}
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
