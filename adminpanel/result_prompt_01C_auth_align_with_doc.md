# Result — PROMPT_01C_AUTH_ALIGN_WITH_DOC

## Files changed
- `src/auth/storage/token-storage.ts`
- `src/auth/services/auth-service.ts`
- `src/api/client/refresh-queue.ts`
- `src/api/client/axios-client.ts`
- `src/auth/providers/auth-provider.tsx`

## Exact endpoints used
- `POST /api/auth/login`
- `POST /api/auth/refresh` with JSON body `{ "refreshToken": "..." }`
- `POST /api/auth/logout` with JSON body `{ "refreshToken": "..." }`
- `GET /api/auth/me` with `Authorization: Bearer <accessToken>`

## Storage decisions
- Token keys are read/written exclusively via `src/constants/storage-keys.ts`.
- `accessToken` is stored in `sessionStorage` and `localStorage` for compatibility and boot reliability.
- `refreshToken` is stored in `sessionStorage` only (preferred safer default).
- Legacy `refreshToken` values in `localStorage` are still read during bootstrap/migration but immediately normalized to session-based storage on next token write.
- All token clear paths remove both token keys from both `sessionStorage` and `localStorage`.

## TODOs
- Add an explicit “Remember me” UX flag and thread it through `tokenStorage.setTokens(...)` to allow opt-in persistent refresh token storage.
- Consider removing legacy localStorage refresh-token fallback once all active sessions have migrated.
- Optionally remove deprecated auth cookie env settings if backend/client no longer rely on them anywhere.
