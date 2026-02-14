# result_prompt_00_architecture

## 1) Folder structure

```text
adminpanel/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── messages/
│   └── en.json
├── src/
│   ├── api/
│   │   ├── client/
│   │   │   ├── axios-client.ts
│   │   │   └── refresh-queue.ts
│   │   ├── types/
│   │   │   └── common.ts
│   │   └── utils/
│   │       └── error-normalizer.ts
│   ├── auth/
│   │   ├── providers/
│   │   │   └── auth-provider.tsx
│   │   ├── services/
│   │   │   └── auth-service.ts
│   │   ├── storage/
│   │   │   └── token-storage.ts
│   │   └── types/
│   │       └── auth.ts
│   ├── components/
│   │   ├── data-table/
│   │   │   └── data-table.tsx
│   │   ├── layout/
│   │   │   └── app-providers.tsx
│   │   ├── states/
│   │   │   ├── empty-state.tsx
│   │   │   └── skeleton.tsx
│   │   └── ui/
│   │       ├── alert.tsx
│   │       ├── button.tsx
│   │       └── card.tsx
│   ├── config/
│   │   └── env.ts
│   ├── constants/
│   │   ├── api-endpoints.ts
│   │   └── routes.ts
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── providers/
│   │   │   └── i18n-provider.tsx
│   │   └── types/
│   │       └── messages.ts
│   ├── lib/
│   │   └── cn.ts
│   ├── permissions/
│   │   ├── permission-map.ts
│   │   ├── permission-service.ts
│   │   ├── role-guard.tsx
│   │   └── types.ts
│   └── types/
│       └── pagination.ts
├── middleware.ts
├── .env.example
└── result_prompt_00_architecture.md
```

## 2) Architecture decisions

- Centralized environment access in `src/config/env.ts` and mirrored sample keys in `.env.example`.
- Route constants and API endpoints are isolated in `src/constants/*` to avoid inline path strings.
- API integration is standardized through `src/api/client/axios-client.ts`.
- Refresh token behavior uses single-flight queueing in `src/api/client/refresh-queue.ts`.
- API error shapes are normalized by `src/api/utils/error-normalizer.ts`.
- Authentication state is centralized with `AuthProvider` in `src/auth/providers/auth-provider.tsx`.
- Middleware route protection is implemented in `middleware.ts` using auth cookie checks.
- Localization is initialized with `messages/en.json` + `I18nProvider` + `useI18n`.
- Role-based UI controls are implemented via permission map/service and `RoleGuard`.
- Reusable UI primitives (button/card/alert) and generic states (skeleton/empty) are extracted to components.
- Reusable `DataTable` includes typed columns, loading state, empty state, and server-side pagination contract.

## 3) API endpoints referenced

- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/me`
- `/api/auth/refresh`
- `/api/auth/register`
- `/api/auth/email/verify`
- `/api/auth/email/verify/request`
- `/api/auth/email/change/request`
- `/api/auth/password/change`
- `/api/auth/password/forgot`
- `/api/auth/password/reset`
- `/api/auth/preferences`
- `/api/auth/profile`
- `/api/admin/users`
- `/api/admin/users/{id}`
- `/api/admin/users/{id}/promote`
- `/api/admin/users/{id}/demote`
- `/api/admin/users/{id}/permissions`
- `/api/admin/metrics`
- `/api/admin/reports/sales`
- `/api/admin/reports/top-products`
- `/api/admin/reports/top-customers`
- `/health`

## 4) Localization keys used

- `app.name`
- `app.description`
- `navigation.dashboard`
- `navigation.users`
- `navigation.roles`
- `navigation.products`
- `navigation.categories`
- `navigation.orders`
- `navigation.inventory`
- `navigation.reports`
- `navigation.settings`
- `common.loading`
- `common.retry`
- `common.noData`
- `common.emptyDescription`
- `common.unauthorized`
- `home.title`
- `home.subtitle`
- `table.searchPlaceholder`
- `table.page`
- `table.of`
- `table.rowsPerPage`
- `table.previous`
- `table.next`
