'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatDate, handleApiError } from '@/lib/utils';
import { t } from '@/lib/i18n';
import { APP_CONFIG } from '@/lib/config';
import type { User, PaginatedResponse } from '@/lib/types';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import Pagination from '@/components/ui/pagination';
import Loading from '@/components/ui/loading';
import EmptyState from '@/components/ui/empty-state';
import Card from '@/components/ui/card';
import toast from 'react-hot-toast';
import { Search, Eye, Shield, ShieldOff, UserX, UserCheck, Users } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: APP_CONFIG.defaultPageSize.toString(),
      });
      if (search) params.set('q', search);
      const data = await api.get<PaginatedResponse<User>>(`/admin/users?${params}`);
      setUsers(data.items || []);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      handleApiError(err, t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleActive = async (user: User) => {
    try {
      await api.patch(`/admin/users/${user._id}`, { isActive: !user.isActive });
      toast.success(
        user.isActive ? t('users.deactivatedSuccess') : t('users.activatedSuccess'),
      );
      fetchUsers();
    } catch (err) {
      handleApiError(err, t('common.operationFailed'));
    }
  };

  const handlePromote = async (userId: string) => {
    try {
      await api.post(`/admin/users/${userId}/promote`);
      toast.success(t('users.promotedSuccess'));
      fetchUsers();
    } catch (err) {
      handleApiError(err, t('common.operationFailed'));
    }
  };

  const handleDemote = async (userId: string) => {
    try {
      await api.post(`/admin/users/${userId}/demote`);
      toast.success(t('users.demotedSuccess'));
      fetchUsers();
    } catch (err) {
      handleApiError(err, t('common.operationFailed'));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('users.title')}</h1>
        <p className="mt-1 text-[13px] text-slate-500">
          {t('common.totalResults', { count: String(total) })}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder={t('users.searchPlaceholder')}
            className="pl-10"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {loading ? (
        <Loading text={t('common.loading')} />
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title={t('users.noUsers')}
          description={t('users.noUsersDesc')}
        />
      ) : (
        <>
          <Card noPadding>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {t('common.name')}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {t('users.roles')}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {t('common.status')}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {t('users.verified')}
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {t('users.memberSince')}
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {t('common.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{user.name}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <Badge key={role} variant={role === 'admin' ? 'info' : 'default'}>
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={user.isActive ? 'success' : 'danger'}>
                          {user.isActive ? t('common.active') : t('common.inactive')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={user.isVerified ? 'success' : 'warning'}>
                          {user.isVerified ? t('users.verified') : t('users.unverified')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/users/${user._id}`}>
                            <Button variant="ghost" size="sm" title={t('common.view')}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(user)}
                            title={user.isActive ? t('users.deactivate') : t('users.activate')}
                          >
                            {user.isActive
                              ? <UserX className="h-4 w-4 text-red-500" />
                              : <UserCheck className="h-4 w-4 text-green-500" />
                            }
                          </Button>
                          {user.roles.includes('admin') ? (
                            <Button variant="ghost" size="sm" onClick={() => handleDemote(user._id)} title={t('users.demote')}>
                              <ShieldOff className="h-4 w-4 text-orange-500" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => handlePromote(user._id)} title={t('users.promote')}>
                              <Shield className="h-4 w-4 text-blue-500" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Pagination page={page} pages={pages} total={total} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
