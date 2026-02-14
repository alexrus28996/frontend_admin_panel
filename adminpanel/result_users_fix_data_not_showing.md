# Users module fix result (data not showing)

## 1) Endpoint/method list confirmed from IMPLEMENTED_API_DOCUMENTATION.md
- `GET /api/admin/users` with query params: `q`, `page`, `limit`
- `GET /api/admin/users/{id}`
- `POST /api/admin/users/{id}/promote` (no body)
- `POST /api/admin/users/{id}/demote` (no body)
- `GET /api/admin/users/{id}/permissions`
- `POST /api/admin/users/{id}/permissions` with body `{ permissions: array }`
- `PATCH /api/admin/users/{id}/permissions/add` with body `{ permissions: array }`
- `PATCH /api/admin/users/{id}/permissions/remove` with body `{ permissions: array }`

## 2) Client PATCH support proof
- `apiClient` now supports: `get`, `post`, `put`, `patch`, and `delete`.
- Added typed helper: `apiClient.patch<TResponse, TPayload>(path, payload, config)`.
- Existing auth header and bearer token flow is unchanged.

## 3) Service methods changed
- `getUsers` still sends exact params `q`, `page`, `limit`.
- Added `replacePermissions(id, permissions)` -> `POST /api/admin/users/{id}/permissions`.
- Updated `addUserPermission` -> `PATCH /api/admin/users/{id}/permissions/add`.
- Updated `removeUserPermission` -> `PATCH /api/admin/users/{id}/permissions/remove`.

## 4) Runtime-safe normalizer behavior
Created `src/modules/users/utils/response-normalizer.ts`:
- `normalizeList(response)`
  - accepts `{ success, data: array }`, `{ data: array }`, or `array`
  - fallback: `[]`
- `normalizeObject(response)`
  - accepts `{ success, data: object }`, `{ data: object }`, or `object`
  - fallback: `null`
- `normalizePermissions(response)`
  - accepts `{ success, data: string[] }`, `{ data: string[] }`, `string[]`, or object with `permissions`/`items`
  - fallback: `[]`

## 5) Logs added + disable switch
- Added temporary logs in users service:
  - `[Users] list raw response:`
  - `[Users] list normalized count:`
- Logs are controlled by `env.enableUsersDebugLogs` from env var:
  - `NEXT_PUBLIC_ENABLE_USERS_DEBUG_LOGS=true` to enable
  - default (unset/other) disables logs

## 6) Hardcode scan output summary
- API hardcode scan (excluding constants file): no matches.
- Admin route hardcode scan (excluding routes constants file): no matches.
- Raw `Users` token scan returns type/function identifiers and log prefix only; UI labels remain i18n-driven.

## 7) Manual test steps (3 pages)
1. Open `/admin/users` and confirm table rows render when backend returns list data.
2. Open `/admin/users/<realId>` and confirm user object fields render.
3. In `/admin/users/<realId>`, verify permissions list renders and add/remove use patch endpoints.
