# Prompt 02 — Dashboard Enterprise

## Files added/updated
- Added `src/modules/dashboard/services/dashboard.service.ts`
- Added `src/modules/dashboard/types.ts`
- Added `src/modules/dashboard/schemas/date-range.schema.ts`
- Updated `src/app/(admin)/dashboard/page.tsx`
- Updated `messages/en.json`

## Endpoints used (API_ENDPOINTS constants)
- `API_ENDPOINTS.admin.metrics`
- `API_ENDPOINTS.admin.reports.sales`
- `API_ENDPOINTS.admin.reports.topProducts`
- `API_ENDPOINTS.admin.reports.topCustomers`

## i18n keys added
- `dashboard.title`
- `dashboard.kpis.section`
- `dashboard.kpis.errorTitle`
- `dashboard.kpis.empty`
- `dashboard.sales.title`
- `dashboard.sales.filtersTitle`
- `dashboard.sales.from`
- `dashboard.sales.to`
- `dashboard.sales.groupBy`
- `dashboard.sales.groupByOptions.day`
- `dashboard.sales.groupByOptions.week`
- `dashboard.sales.groupByOptions.month`
- `dashboard.sales.columns.period`
- `dashboard.sales.columns.totalSales`
- `dashboard.sales.columns.orderCount`
- `dashboard.sales.columns.status`
- `dashboard.topProducts.title`
- `dashboard.topProducts.columns.productName`
- `dashboard.topProducts.columns.quantitySold`
- `dashboard.topProducts.columns.revenue`
- `dashboard.topProducts.columns.status`
- `dashboard.topCustomers.title`
- `dashboard.topCustomers.columns.customerName`
- `dashboard.topCustomers.columns.orders`
- `dashboard.topCustomers.columns.spent`
- `dashboard.topCustomers.columns.status`

## UX states implemented
- Loading state per widget (KPI cards, sales report, top products, top customers)
- Error state per widget via `AlertBanner` or `DataTable` error handling
- Empty state for KPIs and tables (`DataTable` built-in empty state)
- Responsive layout grid for KPI cards and dashboard sections

## TODOs (doc unclear)
- Metrics response field names are unknown in API documentation.
- Sales report response root keys and row structure are unknown.
- Top products response root keys and row structure are unknown.
- Top customers response root keys and row structure are unknown.
