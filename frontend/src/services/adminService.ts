import { apiClient } from './apiClient';
import { AnalyticsData, OrderStatus } from '../types';

export const adminService = {
  async getAnalytics(): Promise<AnalyticsData> {
    const response = await apiClient.get('/admin/analytics/');
    return response.data.data;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus, paymentStatus?: string) {
    const response = await apiClient.patch(`/orders/${orderId}/update-status/`, {
      status,
      payment_status: paymentStatus,
    });
    return response.data;
  },
};
