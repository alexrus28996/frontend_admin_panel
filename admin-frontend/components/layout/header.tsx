'use client';

import { Menu, Bell, LogOut, User, Search } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { t } from '@/lib/i18n';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/80">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden rounded-xl p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search hint */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-400 text-[13px] cursor-pointer hover:bg-slate-100 transition-all min-w-[240px]">
            <Search className="h-4 w-4" />
            <span>{t('common.search')}...</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Notifications */}
          <button
            className="relative rounded-xl p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            aria-label={t('common.notifications')}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white" />
          </button>

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-slate-50 transition-all"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <div className="h-8 w-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-[13px] font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() ?? <User className="h-4 w-4 text-white" />}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[13px] font-semibold text-slate-700 leading-tight">{user?.name}</p>
                <p className="text-[11px] text-slate-400 leading-tight font-medium">{user?.roles?.join(', ')}</p>
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200/80 shadow-xl ring-1 ring-black/5 py-1 animate-slide-in-up">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-[13px] font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-[12px] text-slate-500 mt-0.5">{user?.email}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {user?.roles?.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center rounded-lg bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-200"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-red-600 hover:bg-red-50 transition-all rounded-b-2xl"
                >
                  <LogOut className="h-4 w-4" />
                  {t('auth.signOut')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
