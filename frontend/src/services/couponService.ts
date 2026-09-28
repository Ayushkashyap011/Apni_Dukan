import { apiClient } from './apiClient';

export const couponService = {
  async validateCoupon(code: string, subtotal: number) {
    const response = await apiClient.post('/coupons/validate/', { code, subtotal });
    return response.data;
  },
};
