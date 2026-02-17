# Result — PROMPT_04_USERS_REAL_BACKEND_SMOKE_TEST_THEN_UI

## 1) Exact files changed
- `.env.example`
- `package.json`
- `scripts/api-smoke-test.ts`
- `src/config/env.ts`
- `src/api/client/axios-client.ts`
- `src/modules/users/types.ts`
- `src/modules/users/services/users.service.ts`
- `src/app/admin/users/page.tsx`
- `src/components/ui/dialog.tsx`
- `src/schemas/users/create-user.schema.ts`
- `messages/en.json`

## 2) Exact endpoints called/used
### Smoke test harness (`scripts/api-smoke-test.ts`)
- `POST /api/auth/login` (body: `{ email, password }`)
- `GET /api/admin/users` (header: `Authorization: Bearer <token>`)

### UI wiring (`src/modules/users/services/users.service.ts` + users page)
- `GET /api/admin/users` with optional query params: `q`, `page`, `limit`
- `POST /api/admin/users/{id}/promote`
- `POST /api/admin/users/{id}/demote`
- `POST /api/auth/register` (Create User modal)

## 3) Documentation verification (IMPLEMENTED_API_DOCUMENTATION.md)
Confirmed from the documentation file:
- Base URL is `/api`.
- `POST /api/auth/login` exists.
- `GET /api/admin/users` exists with bearer auth and params `q`, `page`, `limit`.
- `POST /api/auth/register` exists.
- `POST /api/admin/users/{id}/promote` and `POST /api/admin/users/{id}/demote` exist.

## 4) Commands run and outputs
### Lint
```bash
npm run lint
```
Output: pass.

### Smoke script
```bash
npm run smoke:api
```
Output in this environment:
- Fails early and clearly because env vars were not provided:
  - `[SMOKE] Missing required env var: NEXT_PUBLIC_API_BASE_URL`
- Script is runnable and provides explicit failure reason.

### Hardcode and quality scans
1. API hardcode scan
```bash
rg -n "\"/api|'/api" src --glob '!src/constants/api-endpoints.ts'
```
Output: no matches.

2. Route hardcode scan
```bash
rg -n "\"/admin|'/admin" src --glob '!src/constants/routes.ts'
```
Output: no matches.

3. UI raw label scan (best-effort)
```bash
rg -n '>\s*[A-Za-z][^<{]*\s*<' src/app src/components src/modules
```
Output:
- `src/app/admin/users/page.tsx:141:  const withActionLoading = useCallback(async (id: string, action: () => Promise<void>) => {`
- This is a code false-positive from TypeScript generic syntax, not a rendered hardcoded UI label.

## 5) How to run smoke test against real backend
1. Set environment variables (example):
```bash
export NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
export NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
export NEXT_PUBLIC_ADMIN_PASSWORD='your_password'
export NEXT_PUBLIC_ENABLE_API_SMOKE_TEST_LOGS=true
```
2. Run:
```bash
npm run smoke:api
```
3. Expected success output includes:
- Login status
- Users status
- First 2 records keys
- Users array length
- First 5 user IDs
