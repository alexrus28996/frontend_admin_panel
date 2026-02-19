'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usersService, User, UsersListResponse } from '@/api/services/users.service';
import en from '@/messages/en.json';
import { ROUTES } from '@/constants/routes';
import { Search, ChevronLeft, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';

export default function UsersPage() {
  const [data, setData] = useState<UsersListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 10;

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await usersService.getUsers(page, limit, search);
      setData(result);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || en.errors.loadingFailed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{en.users.title}</h1>
          <p className="text-muted-foreground mt-1">{en.users.pageTitle}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder={en.common.search}
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg mb-6">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-muted-foreground" size={24} />
        </div>
      )}

      {/* Empty state */}
      {!loading && data && data.items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{en.users.noUsers}</p>
        </div>
      )}

      {/* Table */}
      {!loading && data && data.items.length > 0 && (
        <>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.users.id}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.users.name}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.users.email}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.users.roles}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.users.status}</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">{en.users.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.items.map((user) => (
                  <tr key={user.id} className="hover:bg-muted transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{user.id.slice(0, 8)}...</td>
                    <td className="px-6 py-4 text-sm font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role: string) => (
                            <span
                              key={role}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary"
                            >
                              {role}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.isActive ? en.users.active : en.users.inactive}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={ROUTES.USER_DETAIL(user.id)}
                        className="text-primary hover:underline"
                      >
                        {en.users.view}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.pages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {data.page} of {data.pages} • Total: {data.total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setPage(Math.min(data.pages, page + 1))}
                  disabled={page === data.pages}
                  className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
