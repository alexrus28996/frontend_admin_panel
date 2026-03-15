'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatDate, handleApiError } from '@/lib/utils';
import type { Review, PaginatedResponse } from '@/lib/types';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Pagination from '@/components/ui/pagination';
import Loading from '@/components/ui/loading';
import EmptyState from '@/components/ui/empty-state';
import toast from 'react-hot-toast';
import { Star, Check, EyeOff, MessageSquare } from 'lucide-react';
import { t } from '@/lib/i18n';
import { APP_CONFIG } from '@/lib/config';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const limit = APP_CONFIG.defaultPageSize;

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (statusFilter) params.set('status', statusFilter);
      const data = await api.get<PaginatedResponse<Review>>(`/admin/reviews?${params}`);
      setReviews(data.items || []);
      setTotal(data.total);
    } catch (err) {
      handleApiError(err, t('reviews.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const getProductId = (review: Review) => typeof review.product === 'object' ? review.product._id : review.product;

  const approveReview = async (review: Review) => {
    try {
      const productId = getProductId(review);
      await api.post(`/products/${productId}/reviews/${review._id}/approve`, {});
      toast.success(t('reviews.reviewApproved'));
      fetchReviews();
    } catch (err) {
      handleApiError(err, t('reviews.approveFailed'));
    }
  };

  const hideReview = async (review: Review) => {
    try {
      const productId = getProductId(review);
      await api.post(`/products/${productId}/reviews/${review._id}/hide`, {});
      toast.success(t('reviews.reviewHidden'));
      fetchReviews();
    } catch (err) {
      handleApiError(err, t('reviews.hideFailed'));
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`h-4 w-4 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('reviews.title')}</h1>
        <p className="mt-1 text-[13px] text-slate-500">{t('reviews.subtitle')}</p>
      </div>

      <Card>
        <div className="mb-4 max-w-xs">
          <Select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            options={[
              { value: '', label: t('reviews.allStatuses') },
              { value: 'pending', label: t('reviews.pending') },
              { value: 'approved', label: t('reviews.approved') },
              { value: 'hidden', label: t('reviews.hidden') },
            ]}
          />
        </div>

        {loading ? <Loading text={t('common.loading')} /> : reviews.length === 0 ? (
          <EmptyState icon={MessageSquare} title={t('reviews.noReviews')} description={t('reviews.noReviewsDesc')} />
        ) : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r._id} className="border rounded-lg p-4 hover:bg-slate-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {renderStars(r.rating)}
                      <Badge variant={r.isApproved ? 'success' : 'warning'}>
                        {r.isApproved ? t('reviews.approved') : t('reviews.pending')}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-900 font-medium mb-1">
                      {t('reviews.product')}: <span className="font-mono text-slate-500">{typeof r.product === 'object' ? r.product.name : r.product}</span>
                    </p>
                    {r.title && <p className="text-sm font-medium text-slate-700">{r.title}</p>}
                    {r.comment && <p className="text-sm text-slate-600 mt-1">{r.comment}</p>}
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span>{t('reviews.by')} {typeof r.user === 'object' ? r.user.name : t('reviews.unknownUser')}</span>
                      <span>{formatDate(r.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-4">
                    {!r.isApproved && (
                      <Button variant="ghost" size="sm" onClick={() => approveReview(r)} title={t('reviews.approve')}>
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                    {r.isApproved && (
                      <Button variant="ghost" size="sm" onClick={() => hideReview(r)} title={t('reviews.hide')}>
                        <EyeOff className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {total > limit && <div className="mt-4"><Pagination page={page} pages={Math.ceil(total / limit)} onPageChange={setPage} total={total} /></div>}
      </Card>
    </div>
  );
}
