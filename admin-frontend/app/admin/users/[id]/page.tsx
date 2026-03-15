'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { formatDate, handleApiError } from '@/lib/utils';
import { t } from '@/lib/i18n';
import { APP_CONFIG } from '@/lib/config';
import type { User } from '@/lib/types';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Card from '@/components/ui/card';
import Loading from '@/components/ui/loading';
import Modal from '@/components/ui/modal';
import toast from 'react-hot-toast';
import { ArrowLeft, Shield, ShieldOff, UserX, UserCheck } from 'lucide-react';

const ALL_PERMISSIONS = Object.values(APP_CONFIG.permissions);

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [permModalOpen, setPermModalOpen] = useState(false);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [userData, permData] = await Promise.all([
          api.get<{ user: User }>(`/admin/users/${id}`),
          api.get<{ permissions: string[] }>(`/admin/users/${id}/permissions`),
        ]);
        setUser(userData.user);
        setPermissions(permData.permissions || []);
      } catch (err) {
        handleApiError(err, t('common.error'));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleToggleActive = async () => {
    if (!user) return;
    try {
      const data = await api.patch<{ user: User }>(`/admin/users/${user._id}`, { isActive: !user.isActive });
      setUser(data.user);
      toast.success(
        user.isActive ? t('users.deactivatedSuccess') : t('users.activatedSuccess'),
      );
    } catch (err) {
      handleApiError(err, t('common.operationFailed'));
    }
  };

  const handlePromoteDemote = async () => {
    if (!user) return;
    const isAdmin = user.roles.includes('admin');
    try {
      const data = await api.post<{ user: User }>(
        `/admin/users/${user._id}/${isAdmin ? 'demote' : 'promote'}`,
      );
      setUser(data.user);
      toast.success(isAdmin ? t('users.demotedSuccess') : t('users.promotedSuccess'));
    } catch (err) {
      handleApiError(err, t('common.operationFailed'));
    }
  };

  const openPermModal = () => {
    setSelectedPerms([...permissions]);
    setPermModalOpen(true);
  };

  const togglePerm = (perm: string) => {
    setSelectedPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm],
    );
  };

  const savePermissions = async () => {
    setSaving(true);
    try {
      const data = await api.post<{ permissions: string[] }>(
        `/admin/users/${id}/permissions`,
        { permissions: selectedPerms },
      );
      setPermissions(data.permissions);
      setPermModalOpen(false);
      toast.success(t('users.permissionsUpdated'));
    } catch (err) {
      handleApiError(err, t('common.operationFailed'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading text={t('common.loading')} />;
  if (!user) return <p className="text-center text-slate-500 py-12">{t('common.noData')}</p>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" /> {t('common.back')}
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {t('users.userDetails')}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info */}
        <Card title={t('users.profile')} className="lg:col-span-2">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <dt className="text-sm text-slate-500">{t('common.name')}</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">{user.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">{t('common.email')}</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">{t('common.phone')}</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">{user.phone || '—'}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">{t('users.memberSince')}</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">{formatDate(user.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">{t('common.status')}</dt>
              <dd className="mt-1">
                <Badge variant={user.isActive ? 'success' : 'danger'}>
                  {user.isActive ? t('common.active') : t('common.inactive')}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">{t('users.verified')}</dt>
              <dd className="mt-1">
                <Badge variant={user.isVerified ? 'success' : 'warning'}>
                  {user.isVerified ? t('users.verified') : t('users.unverified')}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">{t('users.roles')}</dt>
              <dd className="flex flex-wrap gap-1 mt-1">
                {user.roles.map((role) => (
                  <Badge key={role} variant={role === 'admin' ? 'info' : 'default'}>
                    {role}
                  </Badge>
                ))}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Actions */}
        <Card title={t('common.actions')}>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleToggleActive}
            >
              {user.isActive ? (
                <><UserX className="h-4 w-4 mr-2 text-red-500" /> {t('users.deactivate')}</>
              ) : (
                <><UserCheck className="h-4 w-4 mr-2 text-green-500" /> {t('users.activate')}</>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handlePromoteDemote}
            >
              {user.roles.includes('admin') ? (
                <><ShieldOff className="h-4 w-4 mr-2 text-orange-500" /> {t('users.demote')}</>
              ) : (
                <><Shield className="h-4 w-4 mr-2 text-blue-500" /> {t('users.promote')}</>
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Permissions */}
      <Card
        title={t('users.permissions')}
        action={
          <Button size="sm" onClick={openPermModal}>
            {t('users.managePermissions')}
          </Button>
        }
      >
        {permissions.length === 0 ? (
          <p className="text-sm text-slate-500">{t('users.noPermissions')}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {permissions.map((perm) => (
              <Badge key={perm}>{perm}</Badge>
            ))}
          </div>
        )}
      </Card>

      {/* Permissions Modal */}
      <Modal
        isOpen={permModalOpen}
        onClose={() => setPermModalOpen(false)}
        title={t('users.managePermissions')}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setPermModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={savePermissions} loading={saving}>
              {t('common.save')}
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[28rem] overflow-y-auto">
          {ALL_PERMISSIONS.map((perm) => (
            <label
              key={perm}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedPerms.includes(perm)}
                onChange={() => togglePerm(perm)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="text-sm text-slate-700 font-mono">{perm}</span>
            </label>
          ))}
        </div>
      </Modal>
    </div>
  );
}
