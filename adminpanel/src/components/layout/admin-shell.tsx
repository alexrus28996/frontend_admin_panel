"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/src/auth/providers/auth-provider";
import { NAVIGATION_ITEMS } from "@/src/constants/navigation";
import { APP_ROUTES } from "@/src/constants/routes";
import { useI18n } from "@/src/i18n/providers/i18n-provider";
import { hasAnyRole } from "@/src/permissions/permission-service";

export const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { t } = useI18n();
  const { user } = useAuth();

  const visibleItems = NAVIGATION_ITEMS.filter((item) => {
    if (!user) {
      return item.route === APP_ROUTES.app.dashboard;
    }

    return hasAnyRole(user.roles, item.roles);
  });

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900">
      <aside className="hidden w-64 border-r border-zinc-200 bg-white p-4 md:block" aria-label={t("navigation.sidebar")}>
        <p className="mb-4 text-sm font-semibold">{t("app.name")}</p>
        <nav className="space-y-1" aria-label={t("navigation.main")}>
          {visibleItems.map((item) => {
            const isActive = pathname === item.route;

            return (
              <Link
                key={item.route}
                href={item.route}
                className={`block rounded-md px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 ${
                  isActive ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3" aria-label={t("navigation.topbar")}>
          <p className="text-sm font-medium">{t("app.description")}</p>
          <p className="text-xs text-zinc-500">{user?.email ?? t("auth.guest")}</p>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};
