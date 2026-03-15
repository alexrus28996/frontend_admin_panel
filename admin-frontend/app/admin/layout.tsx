'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import Loading from '@/components/ui/loading';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading text="Loading admin panel..." />
      </div>
    );
  }

  if (!user) return null;

  return <AdminLayout>{children}</AdminLayout>;
}
