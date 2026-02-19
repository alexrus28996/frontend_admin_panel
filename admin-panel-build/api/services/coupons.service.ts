import { apiClient } from '../client/axios-client';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

export interface Coupon {
  [key: string]: any;
}

export interface CouponsListResponse {
  items: Coupon[];
  total: number;
  page: number;
  pages: number;
}

export interface CouponDetailResponse {
  coupon: Coupon;
}

export interface CouponCreateData {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  active: boolean;
  expiresAt?: string;
  maxUses?: number;
}

class CouponsService {
  async getCoupons(
    page: number = 1,
    limit: number = 10,
    active?: boolean
  ): Promise<CouponsListResponse> {
    const response = await apiClient.get<CouponsListResponse>(
      API_ENDPOINTS.COUPONS,
      {
        params: {
          page,
          limit,
          ...(active !== undefined && { active }),
        },
      }
    );
    return response.data;
  }

  async getCouponById(id: string): Promise<Coupon> {
    const response = await apiClient.get<CouponDetailResponse>(
      API_ENDPOINTS.COUPON_BY_ID(id)
    );
    return response.data.coupon;
  }

  async createCoupon(data: CouponCreateData): Promise<Coupon> {
    const response = await apiClient.post<CouponDetailResponse>(
      API_ENDPOINTS.COUPONS,
      data
    );
    return response.data.coupon;
  }

  async updateCoupon(id: string, data: Partial<CouponCreateData>): Promise<Coupon> {
    const response = await apiClient.put<CouponDetailResponse>(
      API_ENDPOINTS.COUPON_BY_ID(id),
      data
    );
    return response.data.coupon;
  }

  async deleteCoupon(id: string): Promise<any> {
    const response = await apiClient.delete(API_ENDPOINTS.COUPON_BY_ID(id));
    return response.data;
  }
}

export const couponsService = new CouponsService();
