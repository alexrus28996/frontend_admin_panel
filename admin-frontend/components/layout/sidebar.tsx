'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderTree,
  Tag,
  Warehouse,
  Users,
  Ticket,
  Truck,
  Receipt,
  DollarSign,
  RotateCcw,
  CreditCard,
  Star,
  ClipboardList,
  BarChart3,
  MapPin,
  ArrowRightLeft,
  AlertTriangle,
  Globe,
  Calculator,
  BookOpen,
  X,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  labelKey: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { labelKey: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
}

const navigation: NavItem[] = [
  { labelKey: 'nav.dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { labelKey: 'nav.orders', href: '/admin/orders', icon: ShoppingCart },
  { labelKey: 'nav.products', href: '/admin/products', icon: Package },
  { labelKey: 'nav.categories', href: '/admin/categories', icon: FolderTree },
  { labelKey: 'nav.brands', href: '/admin/brands', icon: Tag },
  { labelKey: 'nav.coupons', href: '/admin/coupons', icon: Ticket },
  { labelKey: 'nav.users', href: '/admin/users', icon: Users },
  {
    labelKey: 'nav.inventory',
    icon: Warehouse,
    children: [
      { labelKey: 'nav.inventoryOverview', href: '/admin/inventory', icon: Warehouse },
      { labelKey: 'nav.inventoryLocations', href: '/admin/inventory/locations', icon: MapPin },
      { labelKey: 'nav.inventoryTransfers', href: '/admin/inventory/transfers', icon: ArrowRightLeft },
      { labelKey: 'nav.inventoryLowStock', href: '/admin/inventory/low-stock', icon: AlertTriangle },
    ],
  },
  { labelKey: 'nav.shipping', href: '/admin/shipping', icon: Truck },
  { labelKey: 'nav.tax', href: '/admin/tax', icon: Calculator },
  { labelKey: 'nav.currency', href: '/admin/currency', icon: DollarSign },
  { labelKey: 'nav.returns', href: '/admin/returns', icon: RotateCcw },
  { labelKey: 'nav.transactions', href: '/admin/transactions', icon: CreditCard },
  { labelKey: 'nav.shipments', href: '/admin/shipments', icon: Receipt },
  { labelKey: 'nav.reviews', href: '/admin/reviews', icon: Star },
  { labelKey: 'nav.auditLogs', href: '/admin/audit', icon: ClipboardList },
  { labelKey: 'nav.reports', href: '/admin/reports', icon: BarChart3 },
  { labelKey: 'nav.reservations', href: '/admin/reservations', icon: BookOpen },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'nav.inventory': true,
  });

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[260px] bg-white flex flex-col',
          'border-r border-slate-200/80',
          'transform transition-transform duration-200 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-100 flex-shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-9 w-9 bg-gradient-to-b from-blue-500 to-blue-600 rounded-xl shadow-[0_2px_8px_rgba(59,130,246,0.3)]">
              <Globe className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <span className="text-[15px] font-bold text-slate-900 tracking-tight block leading-tight">{t('common.appName')}</span>
              <span className="text-[11px] text-slate-400 font-medium leading-tight">v1.0.0</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden rounded-xl p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Main navigation">
          <ul className="space-y-0.5">
            {navigation.map((item) => {
              if (item.children) {
                const isExpanded = expandedGroups[item.labelKey] ?? false;
                const isParentActive = item.children.some((child) =>
                  pathname.startsWith(child.href),
                );

                return (
                  <li key={item.labelKey}>
                    <button
                      onClick={() => toggleGroup(item.labelKey)}
                      className={cn(
                        'w-full flex items-center justify-between gap-3 px-3 py-2 text-[13px] rounded-xl transition-all',
                        isParentActive
                          ? 'text-blue-700 font-semibold'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
                      )}
                      aria-expanded={isExpanded}
                    >
                      <span className="flex items-center gap-3">
                        <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                        {t(item.labelKey)}
                      </span>
                      <ChevronDown
                        className={cn(
                          'h-3.5 w-3.5 text-slate-400 transition-transform duration-200',
                          isExpanded && 'rotate-180',
                        )}
                      />
                    </button>
                    {isExpanded && (
                      <ul className="mt-0.5 ml-[18px] space-y-0.5 border-l-2 border-slate-100 pl-3">
                        {item.children.map((child) => {
                          const isActive =
                            pathname === child.href ||
                            (child.href !== '/admin/inventory' &&
                              pathname.startsWith(child.href));
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={onClose}
                                className={cn(
                                  'flex items-center gap-2.5 px-3 py-1.5 text-[13px] rounded-lg transition-all',
                                  isActive
                                    ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600 -ml-[calc(0.75rem+2px)] pl-[calc(0.75rem)]'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
                                )}
                              >
                                <child.icon className="h-3.5 w-3.5 flex-shrink-0" />
                                {t(child.labelKey)}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }

              const isActive =
                pathname === item.href ||
                (item.href !== '/admin/dashboard' &&
                  pathname.startsWith(item.href + '/'));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href!}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 text-[13px] rounded-xl transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-blue-50/50 text-blue-700 font-semibold shadow-[inset_3px_0_0_0_#2563eb] -ml-px pl-[calc(0.75rem+1px)]'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                    {t(item.labelKey)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-slate-100 px-5 py-3">
          <p className="text-[11px] text-slate-400 text-center font-medium">{t('common.appName')}</p>
        </div>
      </aside>
    </>
  );
}
