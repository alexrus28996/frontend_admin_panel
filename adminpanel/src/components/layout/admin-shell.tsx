"use client";

import { useMemo, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/src/auth/providers/auth-provider";
import { Button } from "@/src/components/ui/button";
import { DropdownMenu } from "@/src/components/ui/dropdown-menu";
import { NAVIGATION_ITEMS } from "@/src/constants/navigation";
import { APP_ROUTES } from "@/src/constants/routes";
import { useI18n } from "@/src/i18n/providers/i18n-provider";
import { hasAnyRole } from "@/src/permissions/permission-service";

export const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { t } = useI18n();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const visibleItems = NAVIGATION_ITEMS.filter((item) => {
    if (!user) {
      return item.route === APP_ROUTES.admin.dashboard;
    }

    return hasAnyRole(user.roles, item.roles);
  });

  const breadcrumb = useMemo(() => {
    const active = visibleItems.find((item) => item.route === pathname);
    return [t("app.name"), active ? t(active.labelKey) : t("app.description")];
  }, [pathname, t, visibleItems]);

  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 border-r border-border bg-surface p-4 transition-transform duration-200 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label={t("navigation.sidebar")}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold">{t("app.name")}</p>
          <Button variant="ghost" className="md:hidden" onClick={() => setSidebarOpen(false)} ariaLabel={t("common.closeSidebar")}>
            ✕
          </Button>
        </div>
        <nav className="space-y-1" aria-label={t("navigation.main")}>
          {visibleItems.map((item) => {
            const isActive = pathname === item.route;

            return (
              <Link
                key={item.route}
                href={item.route}
                className={`block rounded-md px-3 py-2 text-sm transition-colors duration-200 ${
                  isActive ? "bg-primary text-surface" : "text-text-secondary hover:bg-surface-muted"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
      </aside>

      {sidebarOpen ? <button className="fixed inset-0 z-20 bg-text-primary/20 md:hidden" aria-label={t("common.closeMenuOverlay")} onClick={() => setSidebarOpen(false)} /> : null}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-4 py-3" aria-label={t("navigation.topbar")}>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="md:hidden" onClick={() => setSidebarOpen(true)} ariaLabel={t("common.openSidebar")}>
              ☰
            </Button>
            <p className="text-sm text-text-secondary" aria-label={t("common.breadcrumb")}>
              {breadcrumb.join(" / ")}
            </p>
          </div>
          <DropdownMenu
            triggerLabel={user?.email ?? t("auth.guest")}
            items={[{ label: t("navigation.topbar"), onSelect: () => undefined }]}
          />
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};
