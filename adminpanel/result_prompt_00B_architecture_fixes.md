# result_prompt_00B_architecture_fixes

## Summary of issues found from result_prompt_00_architecture
- Application routing used mixed folder convention (`app/` at root) instead of the required single `src/app` convention.
- Localization coverage was incomplete for newly required table, navigation accessibility, auth fallback, and error keys.
- Roles and permissions relied on scattered string literals in permission mapping.
- Storage key defaults and domain status constants were not centralized.
- API client lacked explicit queued refresh handling semantics, abort support, and redirect-on-refresh-failure behavior.
- DataTable lacked enterprise interaction patterns (debounced search, filter region, toolbar slot, standardized error handling, and consistent server pagination footer behavior).
- Sidebar/topbar navigation patterns and role-based visibility wiring were missing.
- Middleware gate relied on cookie-only detection rather than lightweight token indicators.

## Exact files changed/added
### Added
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
- `src/app/favicon.ico`
- `src/components/layout/admin-shell.tsx`
- `src/constants/navigation.ts`
- `src/constants/roles.ts`
- `src/constants/permissions.ts`
- `src/constants/status.ts`
- `src/constants/storage-keys.ts`

### Updated
- `messages/en.json`
- `middleware.ts`
- `src/api/client/axios-client.ts`
- `src/api/client/refresh-queue.ts`
- `src/api/types/common.ts`
- `src/api/utils/error-normalizer.ts`
- `src/auth/types/auth.ts`
- `src/components/data-table/data-table.tsx`
- `src/config/env.ts`
- `src/i18n/types/messages.ts`
- `src/permissions/permission-map.ts`
- `src/permissions/permission-service.ts`
- `src/permissions/role-guard.tsx`
- `src/permissions/types.ts`

### Removed (migrated)
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `app/favicon.ico`

## Key architecture decisions
- Standardized app router structure to `src/app` only.
- Consolidated domain constants for roles, permissions, status sets, and storage keys to remove magic strings and improve reusability.
- Tightened typing by deriving i18n key unions from `messages/en.json` recursively.
- Kept middleware as a lightweight indicator gate (cookie or bearer header presence), with backend and UI permission checks remaining the source of truth for privileged access.
- Upgraded API client behavior with:
  - request timeout + cancellation support via `AbortSignal`
  - single-flight refresh queue that resolves waiting requests after refresh
  - refresh-failure cleanup and login redirect
  - normalized API error shape contract `{ code, message, details?, status? }`
- Upgraded DataTable to a consistent enterprise pattern including:
  - debounced search
  - filter slot region
  - toolbar slot
  - loading skeleton
  - empty state
  - error banner
  - server pagination footer contract
- Added shell layout components (sidebar/topbar) bound to i18n labels and role-based nav visibility.

## Localization keys added/updated
- Added/updated groups in `messages/en.json`:
  - `app`: `name`, `description`, `foundationTitle`, `foundationSubtitle`
  - `navigation`: `main`, `sidebar`, `topbar`, `dashboard`, `users`, `roles`, `products`, `categories`, `orders`, `inventory`, `reports`, `settings`
  - `common`: `loading`, `retry`, `noData`, `emptyDescription`, `unauthorized`
  - `auth`: `guest`
  - `table`: `dataGrid`, `id`, `name`, `searchPlaceholder`, `filters`, `filtersHint`, `toolbarHint`, `page`, `of`, `rowsPerPage`, `previous`, `next`
  - `errors`: `general`
  - `validation`: `required`, `invalidEmail`

## TODOs requiring manual verification from IMPLEMENTED_API_DOCUMENTATION.md
- Verify final backend response envelope conventions for all auth endpoints (several sections still indicate “Derived from implementation – verify manually”).
- Confirm whether refresh-token transport should remain body-based (`{ refreshToken }`) or move to a secure cookie-only transport expected by backend policy.
- Confirm backend error payload consistency (`code`, `message`, `details`, `status`) across all endpoint families beyond auth.
- Validate exact unauthorized/forbidden response semantics (401 vs 403) for UI permission messaging and future route-level behavior.
