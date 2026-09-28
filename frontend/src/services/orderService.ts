import { apiClient } from './apiClient';
import { Order, PaginatedResponse } from '../types';

export const orderService = {
  async checkout(addressId: string, paymentMethod: string, couponCode?: string, notes?: string) {
    const response = await apiClient.post('/orders/checkout/', {
      address_id: addressId,
      payment_method: paymentMethod,
      coupon_code: couponCode,
      notes,
    });
    return response.data;
  },

  async getOrders(): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.get('/orders/');
    return response.data;
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await apiClient.get(`/orders/${id}/`);
    return response.data;
  },
};
