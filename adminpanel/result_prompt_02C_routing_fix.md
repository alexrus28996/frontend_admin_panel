# PROMPT_02C Routing Fix Result

## Files moved
- `src/app/(admin)/layout.tsx` → `src/app/admin/layout.tsx`
- `src/app/(admin)/dashboard/page.tsx` → `src/app/admin/dashboard/page.tsx`
- `src/app/(admin)/forbidden/page.tsx` → `src/app/admin/forbidden/page.tsx`

## Updated constants
- Added `ROUTES` export in `src/constants/routes.ts` and kept backward compatibility with `APP_ROUTES = ROUTES`.
- Confirmed `ROUTES.admin.dashboard = "/admin/dashboard"`.
- Updated navigation to consume `ROUTES` directly in `src/constants/navigation.ts`.

## Middleware matcher logic
- Middleware now protects admin paths via matcher `"/admin/:path*"`.
- Middleware still checks `"/login"` to redirect authenticated users to dashboard.
- It does not match `"/session-expired"`, so that route is never blocked or rewritten.
- Redirects use `redirectIfDifferent` to avoid loops.

## Final route structure
- `src/app/admin/layout.tsx`
- `src/app/admin/dashboard/page.tsx`
- `src/app/admin/forbidden/page.tsx`
- Old `src/app/(admin)` folder removed.

## Restart instructions
1. Stop dev server.
2. Clear Next build cache:
   ```bash
   rm -rf .next
   ```
3. Restart dev server:
   ```bash
   npm run dev
   ```
4. Verify route:
   - `http://localhost:3000/admin/dashboard`
