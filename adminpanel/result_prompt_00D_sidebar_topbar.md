# PROMPT_00D_SIDEBAR_TOPBAR_WORLDCLASS Result

## Files changed
- `src/components/layout/admin-shell.tsx`
- `src/constants/navigation.ts`
- `src/constants/storage-keys.ts`
- `messages/en.json`

## UX behaviors implemented

### Desktop sidebar
- Added two persistent sidebar modes:
  - Expanded (`272px`): icon + label + group heading
  - Collapsed (`72px`): icon-only + hover/focus tooltip
- Added clear active state with:
  - left indicator rail
  - stronger typography
  - subtle active background + border
- Sidebar is fixed and independently scrollable (`overflow-y-auto` on navigation region).
- Group headings now come from i18n-backed groups and navigation config (`main`, `catalog`, `sales`, `system`).
- Collapse/expand now persists in local storage.

### Mobile overlay sidebar
- Added topbar burger button to open the sidebar.
- Sidebar slides in from the left.
- Added backdrop overlay.
- Clicking backdrop closes.
- ESC closes.
- Navigation click closes.
- Body scroll is locked while overlay is open.
- Added best-effort focus trapping for keyboard Tab/Shift+Tab inside the mobile sidebar.

### Topbar
- Sticky topbar retained and stabilized with fixed height container.
- Includes:
  - mobile burger button
  - route-based breadcrumb
  - premium styled search input
  - existing user dropdown
- Breadcrumb is i18n-friendly and route-aware (supports user detail path fallback).

### Navigation wiring
- `src/constants/navigation.ts` is now the single source for:
  - `group`
  - `labelKey`
  - `href` (ROUTES)
  - `icon`
  - `roles`
- Admin shell renders navigation entirely from this constant with no duplicated route grouping logic.

## i18n keys added/updated
- Updated `navigation.groups` keys to:
  - `navigation.groups.main`
  - `navigation.groups.catalog`
  - `navigation.groups.sales`
  - `navigation.groups.system`

## Storage key used
- `STORAGE_KEYS.ui.sidebarCollapsed` (`admin_ui_sidebar_collapsed`)

## Hardcode scan results
- `rg -n "\"/admin|'\/admin" src --glob '!src/constants/routes.ts'`
  - PASS (no matches)
- `rg -n '>\s*[A-Za-z][^<{]*\s*<' src/app src/modules src/components`
  - PASS with 1 known false-positive match in TypeScript generic syntax (`src/app/admin/users/page.tsx:71`), not a UI hardcoded label.
- `rg -n 'text-(blue|red|green|yellow|purple|pink)-|bg-(blue|red|green|yellow|purple|pink)-' src/components/layout src/components/ui`
  - PASS (no matches)

## Manual test checklist
1. Open `/admin/dashboard` on desktop.
2. Verify sidebar is expanded by default.
3. Click collapse toggle and refresh page; verify collapsed mode persists.
4. Hover collapsed items and confirm tooltip appears and is readable.
5. Verify active item has left indicator + emphasized style.
6. Scroll page content and verify sidebar remains fixed with independent scroll.
7. On mobile viewport, open sidebar from burger button.
8. Verify backdrop appears.
9. Click backdrop and verify sidebar closes.
10. Open sidebar again and press `ESC`; verify close.
11. Open sidebar and use Tab/Shift+Tab; verify focus stays within overlay controls.
12. Click a nav item from mobile overlay; verify overlay closes.
13. Verify topbar stays sticky and layout does not jump while scrolling.
14. Verify dashboard and users pages still render.
