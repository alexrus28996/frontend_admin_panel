# Result Prompt 03 — Users Enterprise Module

## 1) Files added
- `src/modules/users/types.ts`
- `src/modules/users/services/users.service.ts`
- `src/app/admin/users/page.tsx`
- `src/app/admin/users/[id]/page.tsx`

## 2) Endpoints used
Extracted from `IMPLEMENTED_API_DOCUMENTATION.md` (no guessed fields):
- `GET /api/admin/users`
  - Query params: `q` (string, derived), `page` (integer, derived), `limit` (integer, derived)
  - Success: `200` with unknown schema (`Derived from implementation – verify manually`)
- `GET /api/admin/users/{id}`
  - URL params: `id` (string, derived)
  - Success: `200` with unknown schema (`Derived from implementation – verify manually`)
- `POST /api/admin/users/{id}/promote`
  - URL params: `id` (string, derived)
  - Success: `200` with unknown schema (`Derived from implementation – verify manually`)
- `POST /api/admin/users/{id}/demote`
  - URL params: `id` (string, derived)
  - Success: `200` with unknown schema (`Derived from implementation – verify manually`)
- `GET /api/admin/users/{id}/permissions`
  - URL params: `id` (string, derived)
  - Success: `200` with unknown schema (`Derived from implementation – verify manually`)
- `POST /api/admin/users/{id}/permissions/add`
  - API doc section uses `PATCH` with body `{ permissions: array (required, derived) }`
  - URL params: `id` (string, derived)
  - Success: `200` with unknown schema (`Derived from implementation – verify manually`)
- `POST /api/admin/users/{id}/permissions/remove`
  - API doc section uses `PATCH` with body `{ permissions: array (required, derived) }`
  - URL params: `id` (string, derived)
  - Success: `200` with unknown schema (`Derived from implementation – verify manually`)

## 3) Doc-derived fields
- Users list response fields: **unknown**.
  - TODO reference: `GET /api/admin/users`.
- User details response fields: **unknown**.
  - TODO reference: `GET /api/admin/users/{id}`.
- Promote/demote response fields: **unknown**.
  - TODO references: `POST /api/admin/users/{id}/promote`, `POST /api/admin/users/{id}/demote`.
- Permissions list response fields: **unknown**.
  - TODO reference: `GET /api/admin/users/{id}/permissions`.
- Add/remove permissions response fields: **unknown**.
  - TODO references: `/permissions/add`, `/permissions/remove`.
- Known request fields from doc:
  - `/permissions/add` and `/permissions/remove`: body includes `permissions` array (required, derived; verify manually).

## 4) i18n keys added
- `users.title`
- `users.columns.id`
- `users.columns.primary`
- `users.columns.secondary`
- `users.columns.actions`
- `users.columns.unknown`
- `users.actions.view`
- `users.actions.promote`
- `users.actions.demote`
- `users.actions.loading`
- `users.actions.missingId`
- `users.permissions.title`
- `users.permissions.inputLabel`
- `users.permissions.inputPlaceholder`
- `users.permissions.add`
- `users.permissions.remove`
- `users.permissions.empty`
- `users.promote.success`
- `users.promote.error`
- `users.demote.success`
- `users.demote.error`

## 5) UX checklist
- [x] `/admin/users` list page created.
- [x] `PageTitle` used.
- [x] `DataTable` used for listing users.
- [x] Actions column contains View / Promote / Demote.
- [x] Loading state implemented.
- [x] Error banner implemented.
- [x] Empty state implemented.
- [x] `/admin/users/[id]` detail page created.
- [x] Basic user info card implemented.
- [x] Permissions list implemented.
- [x] Add permission action implemented.
- [x] Remove permission action implemented.
- [x] Loading + error states implemented.
- [x] RoleGuard wraps promote/demote and permission actions.

## 6) Hardcode scan results (PASS/FAIL)
- PASS: `rg -n '"/api/|\'/api/' src --glob '!src/constants/api-endpoints.ts'`
- PASS: `rg -n '"/admin|\'/admin' src --glob '!src/constants/routes.ts'`
- FAIL (pre-existing baseline + broad pattern catches identifiers/usages):
  - `rg -n '"admin"|"user"|\badmin\b|\buser\b' src --glob '!src/constants/roles.ts' --glob '!src/constants/permissions.ts'`
