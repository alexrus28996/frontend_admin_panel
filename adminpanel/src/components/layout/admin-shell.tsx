"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/src/auth/providers/auth-provider";
import { Button } from "@/src/components/ui/button";
import { DropdownMenu } from "@/src/components/ui/dropdown-menu";
import { Input } from "@/src/components/ui/input";
import { NAVIGATION_GROUP_LABELS, NAVIGATION_ITEMS } from "@/src/constants/navigation";
import { ROUTES } from "@/src/constants/routes";
import { useI18n } from "@/src/i18n/providers/i18n-provider";
import { cn } from "@/src/lib/cn";
import { hasAnyRole } from "@/src/permissions/permission-service";

import type { NavigationGroup, NavigationIcon } from "@/src/constants/navigation";
import type { MessageKey } from "@/src/i18n/types/messages";

const NAVIGATION_GROUP_ORDER: NavigationGroup[] = ["main", "catalog", "sales", "system"];

const iconClassName = "h-5 w-5 shrink-0";

interface BreadcrumbItem {
  key: MessageKey;
  href?: string;
}

const isRouteMatch = (pathname: string, route: string): boolean => pathname === route || pathname.startsWith(`${route}/`);

const isUsersDetailRoute = (pathname: string): boolean => new RegExp(`^${ROUTES.admin.users}/[^/]+$`).test(pathname);

const getBreadcrumbItems = (pathname: string, navLabelKey?: MessageKey): BreadcrumbItem[] => {
  const adminRoot: BreadcrumbItem = { key: "navigation.admin", href: ROUTES.admin.dashboard };

  if (pathname === ROUTES.admin.users) {
    return [adminRoot, { key: "navigation.users" }];
  }

  if (pathname.startsWith(`${ROUTES.admin.users}/`)) {
    return [adminRoot, { key: "navigation.users", href: ROUTES.admin.users }, { key: "users.detail.title" }];
  }

  if (pathname === ROUTES.admin.dashboard) {
    return [adminRoot, { key: "navigation.dashboard" }];
  }

  if (navLabelKey) {
    return [adminRoot, { key: navLabelKey }];
  }

  return [{ key: "navigation.admin" }];
};

const NavigationIconGlyph = ({ icon }: { icon: NavigationIcon }) => {
  if (icon === "dashboard") {
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={iconClassName}>
        <path d="M3 3h6v6H3V3Zm8 0h6v4h-6V3Zm0 6h6v8h-6V9Zm-8 2h6v6H3v-6Z" className="fill-current" />
      </svg>
    );
  }

  if (icon === "users") {
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={iconClassName}>
        <path d="M7 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm6 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM2.5 16.5c0-2.5 2.1-4.5 4.5-4.5s4.5 2 4.5 4.5v.5h-9v-.5Zm10 0c0-1.5.8-2.8 2.1-3.6a4.7 4.7 0 0 1 2.9-.6c.7.1 1.4.3 2 .7v3.9h-7v-.4Z" className="fill-current" />
      </svg>
    );
  }

  if (icon === "roles") {
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={iconClassName}>
        <path d="M10 2 3 5.5V10c0 4.4 3 7.9 7 8.9 4-1 7-4.5 7-8.9V5.5L10 2Zm0 3.2 3.5 1.8V10c0 2.4-1.4 4.4-3.5 5.2C7.9 14.4 6.5 12.4 6.5 10V7l3.5-1.8Z" className="fill-current" />
      </svg>
    );
  }

  if (icon === "products") {
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={iconClassName}>
        <path d="m10 2 7 3.6v8.8L10 18l-7-3.6V5.6L10 2Zm0 2.5L5.2 7 10 9.4 14.8 7 10 4.5Zm-5 4.1v4.2l4 2.1v-4.1l-4-2.2Zm10 0-4 2.2V15l4-2.1V8.6Z" className="fill-current" />
      </svg>
    );
  }

  if (icon === "categories") {
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={iconClassName}>
        <path d="M3 3h6v6H3V3Zm8 0h6v6h-6V3ZM3 11h6v6H3v-6Zm8 0h6v6h-6v-6Z" className="fill-current" />
      </svg>
    );
  }

  if (icon === "orders") {
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={iconClassName}>
        <path d="M4 3h12v2H4V3Zm0 4h12v2H4V7Zm0 4h8v2H4v-2Zm0 4h12v2H4v-2Zm10-4 3 3-3 3v-2h-2v-2h2v-2Z" className="fill-current" />
      </svg>
    );
  }

  if (icon === "inventory") {
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={iconClassName}>
        <path d="M3 4h14v3H3V4Zm0 5h14v3H3V9Zm0 5h14v3H3v-3Zm2-9h2v1H5V5Zm0 5h2v1H5v-1Zm0 5h2v1H5v-1Z" className="fill-current" />
      </svg>
    );
  }

  if (icon === "reports") {
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={iconClassName}>
        <path d="M3 3h14v14H3V3Zm2 2v10h10V5H5Zm2 7h2V8H7v4Zm4 0h2V6h-2v6Z" className="fill-current" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={iconClassName}>
      <path d="M10 2.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm14 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM10 13.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0-3.5 3-3m-6 6-3 3m6 0 3 3m-6-6-3-3" className="stroke-current" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
};

const getFocusableElements = (container: HTMLElement): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(
    (element) => !element.hasAttribute("disabled") && !element.getAttribute("aria-hidden"),
  );

export const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { t } = useI18n();
  const { user } = useAuth();

  const sidebarRef = useRef<HTMLElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const sidebarElement = sidebarRef.current;
      if (!sidebarElement) {
        return;
      }

      const focusableElements = getFocusableElements(sidebarElement);
      if (!focusableElements.length) {
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      }

      if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const focusableElements = sidebarRef.current ? getFocusableElements(sidebarRef.current) : [];
    focusableElements[0]?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [sidebarOpen]);

  const visibleItems = useMemo(
    () =>
      NAVIGATION_ITEMS.filter((item) => {
        if (!user) {
          return item.href === ROUTES.admin.dashboard;
        }

        if (!item.roles || item.roles.length === 0) {
          return true;
        }

        return hasAnyRole(user.roles, item.roles);
      }),
    [user],
  );

  const groupedItems = useMemo(
    () =>
      NAVIGATION_GROUP_ORDER.map((group) => ({
        group,
        labelKey: NAVIGATION_GROUP_LABELS[group],
        items: visibleItems.filter((item) => item.group === group),
      })).filter((group) => group.items.length > 0),
    [visibleItems],
  );

  const activeNavigationItem = visibleItems.find((item) => isRouteMatch(pathname, item.href));
  const isKnownRoute = visibleItems.some((item) => isRouteMatch(pathname, item.href)) || isUsersDetailRoute(pathname);
  const breadcrumbItems = getBreadcrumbItems(pathname, isKnownRoute ? activeNavigationItem?.labelKey : undefined);

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed((previous) => !previous);
  };

  const shellWordmark = t("app.name").charAt(0);

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <aside
        ref={sidebarRef}
        aria-label={t("navigation.sidebar")}
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex overflow-hidden border-r border-border bg-surface-elevated/95 backdrop-blur transition-all duration-200",
          sidebarCollapsed ? "w-[72px]" : "w-[272px]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex w-full flex-col px-3 py-4">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-sm font-semibold text-primary">{shellWordmark}</div>
              {!sidebarCollapsed ? <p className="truncate text-sm font-semibold text-text-primary">{t("app.name")}</p> : null}
            </div>
            <Button
              variant="ghost"
              className="hidden h-9 w-9 shrink-0 px-0 md:inline-flex"
              onClick={toggleSidebarCollapsed}
              ariaLabel={sidebarCollapsed ? t("common.expandSidebar") : t("common.collapseSidebar")}
            >
              <span aria-hidden="true" className="text-base leading-none">{sidebarCollapsed ? "→" : "←"}</span>
            </Button>
            <Button variant="ghost" className="h-9 w-9 shrink-0 px-0 md:hidden" onClick={() => setSidebarOpen(false)} ariaLabel={t("common.closeSidebar")}>
              <span aria-hidden="true" className="text-base leading-none">×</span>
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto pr-1" aria-label={t("navigation.main")}>
            <div className="space-y-5 pb-4">
              {groupedItems.map((group) => (
                <section key={group.group} className="mt-1 space-y-2 first:mt-0">
                  {!sidebarCollapsed ? <p className="px-2 text-xs font-semibold uppercase tracking-[0.08em] text-text-secondary/80">{t(group.labelKey)}</p> : null}
                  <ul className="space-y-1.5" role="list">
                    {group.items.map((item) => {
                      const isActive = isRouteMatch(pathname, item.href);

                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            aria-label={t(item.labelKey)}
                            onClick={() => setSidebarOpen(false)}
                            className={cn(
                              "group relative flex min-h-[44px] items-center gap-3 overflow-visible rounded-lg border px-3 text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                              sidebarCollapsed ? "justify-center" : "justify-start",
                              isActive
                                ? "border-primary/35 bg-surface-muted text-primary"
                                : "border-transparent text-text-secondary hover:bg-surface-muted/60 hover:text-text-primary",
                            )}
                          >
                            <span className={cn("absolute inset-y-1 left-0 w-[3px] rounded-r-md transition-all duration-150", isActive ? "bg-primary" : "bg-transparent")} aria-hidden="true" />
                            <span className={cn("transition-colors duration-150", isActive ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary")}>
                              <NavigationIconGlyph icon={item.icon} />
                            </span>
                            {!sidebarCollapsed ? <span className={cn("truncate", isActive ? "font-semibold text-text-primary" : "font-medium")}>{t(item.labelKey)}</span> : null}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </nav>
        </div>
      </aside>

      {sidebarOpen ? (
        <button
          type="button"
          aria-label={t("common.closeMenuOverlay")}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-text-primary/35 md:hidden"
        />
      ) : null}

      <div className={cn("min-h-screen transition-all duration-200", sidebarCollapsed ? "md:pl-[72px]" : "md:pl-[272px]")}>
        <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur" aria-label={t("navigation.topbar")}>
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 md:px-8">
            <Button variant="ghost" className="h-9 w-9 shrink-0 px-0 md:hidden" onClick={() => setSidebarOpen(true)} ariaLabel={t("common.openSidebar")}>
              <span aria-hidden="true" className="text-base leading-none">☰</span>
            </Button>

            <nav className="min-w-0 flex-1" aria-label={t("common.breadcrumb")}>
              <ol className="flex min-w-0 items-center gap-2 text-sm text-text-secondary">
                {breadcrumbItems.map((item, index) => {
                  const isLast = index === breadcrumbItems.length - 1;

                  return (
                    <li key={`${item.key}-${item.href ?? "leaf"}`} className="flex min-w-0 items-center gap-2">
                      {index > 0 ? <span aria-hidden="true">{t("shell.breadcrumbSeparator")}</span> : null}
                      {item.href && !isLast ? (
                        <Link href={item.href} className="truncate hover:text-text-primary">
                          {t(item.key)}
                        </Link>
                      ) : (
                        <span className={cn("truncate", isLast ? "font-medium text-text-primary" : undefined)}>{t(item.key)}</span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>

            <div className="hidden w-full max-w-xl items-center md:flex">
              <div className="relative w-full">
                <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">⌕</span>
                <Input
                  id="admin-shell-search"
                  ariaLabel={t("common.search")}
                  placeholder={t("shell.searchPlaceholder")}
                  className="h-10 pl-9"
                />
              </div>
            </div>

            <DropdownMenu triggerLabel={user?.email ?? t("auth.guest")} items={[{ label: t("navigation.topbarMenuLabel"), onSelect: () => undefined }]} />
          </div>
        </header>

        <main className="px-4 py-6 md:px-8 md:py-8">
          <div className="animate-fade-in mx-auto flex w-full max-w-7xl flex-col gap-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
