"use client";

import { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/src/auth/providers/auth-provider";
import { Button } from "@/src/components/ui/button";
import { DropdownMenu } from "@/src/components/ui/dropdown-menu";
import { Input } from "@/src/components/ui/input";
import { MutedText } from "@/src/components/ui/typography";
import { NAVIGATION_ITEMS } from "@/src/constants/navigation";
import { APP_ROUTES } from "@/src/constants/routes";
import { useI18n } from "@/src/i18n/providers/i18n-provider";
import { hasAnyRole } from "@/src/permissions/permission-service";

import type { NavigationItem } from "@/src/constants/navigation";
import type { MessageKey } from "@/src/i18n/types/messages";

const NAVIGATION_GROUPS: Array<{ labelKey: MessageKey; matcher: (item: NavigationItem) => boolean }> = [
  { labelKey: "navigation.groups.overview", matcher: (item) => item.route === APP_ROUTES.admin.dashboard },
  {
    labelKey: "navigation.groups.management",
    matcher: (item) => [APP_ROUTES.admin.users, APP_ROUTES.admin.roles].includes(item.route),
  },
  {
    labelKey: "navigation.groups.commerce",
    matcher: (item) =>
      [APP_ROUTES.admin.products, APP_ROUTES.admin.categories, APP_ROUTES.admin.orders, APP_ROUTES.admin.inventory, APP_ROUTES.admin.reports].includes(item.route),
  },
  { labelKey: "navigation.groups.system", matcher: (item) => item.route === APP_ROUTES.admin.settings },
];

export const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { t } = useI18n();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const visibleItems = NAVIGATION_ITEMS.filter((item) => {
    if (!user) {
      return item.route === APP_ROUTES.admin.dashboard;
    }

    return hasAnyRole(user.roles, item.roles);
  });

  const groupedItems = NAVIGATION_GROUPS.map((group) => ({
    ...group,
    items: visibleItems.filter(group.matcher),
  })).filter((group) => group.items.length > 0);

  const activeNavigationItem = visibleItems.find((item) => item.route === pathname);
  const breadcrumb = [t("app.name"), activeNavigationItem ? t(activeNavigationItem.labelKey) : t("app.description")];

  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      <aside
        className={`fixed inset-y-0 left-0 z-30 border-r border-border bg-surface-elevated/95 px-4 py-5 shadow-[0_12px_28px_rgba(15,23,42,0.08)] backdrop-blur transition-all duration-200 md:static md:translate-x-0 ${sidebarCollapsed ? "w-20" : "w-72"} ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-label={t("navigation.sidebar")}
      >
        <div className="mb-6 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">A</div>
            {!sidebarCollapsed ? <p className="truncate text-sm font-semibold">{t("app.name")}</p> : null}
          </div>
          <Button
            variant="ghost"
            className="h-8 w-8 px-0"
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            ariaLabel={sidebarCollapsed ? t("common.expandSidebar") : t("common.collapseSidebar")}
          >
            {sidebarCollapsed ? "→" : "←"}
          </Button>
        </div>

        <nav className="space-y-6" aria-label={t("navigation.main")}>
          {groupedItems.map((group) => (
            <div key={group.labelKey} className="space-y-2">
              {!sidebarCollapsed ? <MutedText className="px-2 uppercase tracking-wide">{t(group.labelKey)}</MutedText> : null}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.route;

                  return (
                    <Link
                      key={item.route}
                      href={item.route}
                      className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${isActive ? "bg-primary/10 text-primary" : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${isActive ? "bg-primary" : "bg-border group-hover:bg-primary/40"}`} />
                      {!sidebarCollapsed ? <span>{t(item.labelKey)}</span> : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {sidebarOpen ? (
        <button className="fixed inset-0 z-20 bg-text-primary/20 md:hidden" aria-label={t("common.closeMenuOverlay")} onClick={() => setSidebarOpen(false)} />
      ) : null}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-border bg-surface/90 px-4 py-3 backdrop-blur md:px-8" aria-label={t("navigation.topbar")}>
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="md:hidden" onClick={() => setSidebarOpen(true)} ariaLabel={t("common.openSidebar")}>
                ☰
              </Button>
              <p className="text-sm text-text-secondary" aria-label={t("common.breadcrumb")}>
                {breadcrumb.join(` ${t("shell.breadcrumbSeparator")} `)}
              </p>
            </div>
            <div className="flex w-full max-w-xl items-center justify-end gap-2">
              <Input id="admin-shell-search" ariaLabel={t("common.search")} placeholder={t("shell.searchPlaceholder")} className="hidden md:block" />
              <Button variant="secondary" className="h-9 px-3" ariaLabel={t("common.openThemeMenu")}>
                ◐
              </Button>
              <DropdownMenu triggerLabel={user?.email ?? t("auth.guest")} items={[{ label: t("navigation.topbarMenuLabel"), onSelect: () => undefined }]} />
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="animate-fade-in mx-auto flex w-full max-w-7xl flex-col gap-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
