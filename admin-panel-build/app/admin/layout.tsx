'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import en from '@/messages/en.json';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Ticket,
  Truck,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: en.navigation.dashboard, href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { name: en.navigation.users, href: ROUTES.USERS, icon: Users },
  { name: en.navigation.orders, href: ROUTES.ORDERS, icon: ShoppingCart },
  { name: en.navigation.products, href: ROUTES.PRODUCTS, icon: Package },
  { name: en.navigation.coupons, href: ROUTES.COUPONS, icon: Ticket },
  { name: en.navigation.shipments, href: ROUTES.SHIPMENTS, icon: Truck },
  { name: en.navigation.paymentEvents, href: ROUTES.PAYMENT_EVENTS, icon: CreditCard },
  { name: en.navigation.analytics, href: ROUTES.ANALYTICS, icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {sidebarOpen && (
            <span className="text-lg font-bold text-primary">Admin</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-2">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-2 py-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <Settings size={20} />
            {sidebarOpen && <span className="text-sm">{en.navigation.settings}</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm">{en.navigation.logout}</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-card border-b border-border flex items-center px-6 sticky top-0 z-10">
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
