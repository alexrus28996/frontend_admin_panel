import { apiClient } from '../client/axios-client';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

export interface Order {
  [key: string]: any;
}

export interface OrdersListResponse {
  items: Order[];
  total: number;
  page: number;
  pages: number;
}

export interface OrderDetailResponse {
  order: Order;
}

export interface TimelineEntry {
  [key: string]: any;
}

export interface TimelineEntryResponse {
  entry: TimelineEntry;
}

export interface Shipment {
  [key: string]: any;
}

export interface ShipmentsListResponse {
  items: Shipment[];
}

class OrdersService {
  async getOrders(
    page: number = 1,
    limit: number = 10,
    status?: string,
    userId?: string
  ): Promise<OrdersListResponse> {
    const response = await apiClient.get<OrdersListResponse>(
      API_ENDPOINTS.ORDERS,
      {
        params: {
          page,
          limit,
          ...(status && { status }),
          ...(userId && { userId }),
        },
      }
    );
    return response.data;
  }

  async getOrderById(id: string): Promise<Order> {
    const response = await apiClient.get<OrderDetailResponse>(
      API_ENDPOINTS.ORDER_BY_ID(id)
    );
    return response.data.order;
  }

  async updateOrder(
    id: string,
    data: { status?: string; paid?: boolean }
  ): Promise<Order> {
    const response = await apiClient.patch<OrderDetailResponse>(
      API_ENDPOINTS.ORDER_BY_ID(id),
      data
    );
    return response.data.order;
  }

  async addTimelineEntry(
    id: string,
    data: { status: string; note: string }
  ): Promise<TimelineEntry> {
    const response = await apiClient.post<TimelineEntryResponse>(
      API_ENDPOINTS.ORDER_TIMELINE(id),
      data
    );
    return response.data.entry;
  }

  async getOrderShipments(id: string): Promise<Shipment[]> {
    const response = await apiClient.get<ShipmentsListResponse>(
      API_ENDPOINTS.ORDER_SHIPMENTS(id)
    );
    return response.data.items;
  }

  async createShipment(
    id: string,
    data: {
      carrier: string;
      service: string;
      trackingNumber: string;
      status: string;
      shippedAt?: string;
      deliveredAt?: string;
      addressSnapshot?: any;
    }
  ): Promise<Shipment> {
    const response = await apiClient.post<{ shipment: Shipment }>(
      API_ENDPOINTS.ORDER_SHIPMENTS(id),
      data
    );
    return response.data.shipment;
  }
}

export const ordersService = new OrdersService();
