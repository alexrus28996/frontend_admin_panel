"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/src/components/data-table/data-table";
import { Skeleton } from "@/src/components/states/skeleton";
import { AlertBanner } from "@/src/components/ui/alert-banner";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { CardTitle, MutedText, PageTitle, SectionTitle, Text } from "@/src/components/ui/typography";
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

  return Object.keys(rows[0]).map((key) => ({
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
        setMetrics(await dashboardService.getMetrics());
      } catch (error) {
        setMetricsError(error instanceof Error ? error.message : t("errors.general"));
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
        setSalesError(error instanceof Error ? error.message : t("errors.general"));
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
        setTopProductsRows(await dashboardService.getTopProducts());
      } catch (error) {
        setTopProductsError(error instanceof Error ? error.message : t("errors.general"));
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
        setTopCustomersRows(await dashboardService.getTopCustomers());
      } catch (error) {
        setTopCustomersError(error instanceof Error ? error.message : t("errors.general"));
      } finally {
        setTopCustomersLoading(false);
      }
    };

    void loadTopCustomers();
  }, [t]);

  const metricEntries = useMemo(() => Object.entries(metrics ?? {}).slice(0, 4), [metrics]);
  const salesColumns = useMemo(() => createColumns(salesRows), [salesRows]);
  const topProductsColumns = useMemo(() => createColumns(topProductsRows), [topProductsRows]);
  const topCustomersColumns = useMemo(() => createColumns(topCustomersRows), [topCustomersRows]);

  return (
    <div className="space-y-8">
      <section className="space-y-1">
        <PageTitle>{t("dashboard.title")}</PageTitle>
        <MutedText>{t("dashboard.kpis.subtitle")}</MutedText>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label={t("dashboard.kpis.section")}>
        {metricsLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card key={`kpi-skeleton-${index}`}>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))
          : metricsError
            ? (
              <div className="sm:col-span-2 xl:col-span-4">
                <AlertBanner title={t("dashboard.kpis.errorTitle")} description={metricsError} variant="error" />
              </div>
              )
            : metricEntries.map(([key, value]) => {
                const numericValue = Number(value);
                const isPositive = Number.isFinite(numericValue) ? numericValue >= 0 : true;

                return (
                  <Card key={`metric-${key}`}>
                    <CardContent className="space-y-2">
                      <MutedText>{key}</MutedText>
                      <Text className="text-3xl font-semibold leading-none">{formatCellValue(value as DashboardPrimitive)}</Text>
                      <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                        {isPositive ? t("common.trendUp") : t("common.trendDown")} · {t("dashboard.kpis.trendPositive")}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
      </section>

      <Card>
        <CardHeader
          description={t("dashboard.sales.subtitle")}
          actions={(
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <Input id="sales-from-date" type="date" ariaLabel={t("dashboard.sales.from")} value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
              <Input id="sales-to-date" type="date" ariaLabel={t("dashboard.sales.to")} value={toDate} onChange={(event) => setToDate(event.target.value)} />
              <select
                id="sales-group-by"
                className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-text-primary transition-all duration-200 hover:border-focus-ring/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35"
                aria-label={t("dashboard.sales.groupBy")}
                value={groupBy}
                onChange={(event) => setGroupBy(event.target.value as GroupBy)}
              >
                <option value="day">{t("dashboard.sales.groupByOptions.day")}</option>
                <option value="week">{t("dashboard.sales.groupByOptions.week")}</option>
                <option value="month">{t("dashboard.sales.groupByOptions.month")}</option>
              </select>
            </div>
          )}
        >
          <SectionTitle>{t("dashboard.sales.title")}</SectionTitle>
        </CardHeader>
        <CardContent>
          <DataTable<DashboardReportRow>
            columns={salesColumns}
            rows={salesRows}
            loading={salesLoading}
            error={salesError}
            pagination={defaultPagination}
            onPaginationChange={() => undefined}
          />
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader description={t("dashboard.topProducts.subtitle")}>
            <CardTitle>{t("dashboard.topProducts.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable<DashboardReportRow>
              columns={topProductsColumns}
              rows={topProductsRows}
              loading={topProductsLoading}
              error={topProductsError}
              pagination={defaultPagination}
              onPaginationChange={() => undefined}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader description={t("dashboard.topCustomers.subtitle")}>
            <CardTitle>{t("dashboard.topCustomers.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable<DashboardReportRow>
              columns={topCustomersColumns}
              rows={topCustomersRows}
              loading={topCustomersLoading}
              error={topCustomersError}
              pagination={defaultPagination}
              onPaginationChange={() => undefined}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
