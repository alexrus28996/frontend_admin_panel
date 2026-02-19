import { apiClient } from '../client/axios-client';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

export interface DashboardMetrics {
  usersTotal: number;
  usersActive: number;
  adminsCount: number;
  productsCount: number;
  ordersTotal: number;
  ordersByStatus: Record<string, number>;
  revenueLast7Days: number;
}

class DashboardService {
  async getMetrics(): Promise<DashboardMetrics> {
    const response = await apiClient.get<DashboardMetrics>(API_ENDPOINTS.METRICS);
    return response.data;
  }
}

export const dashboardService = new DashboardService();
