import { apiClient } from './apiClient';
import { Cart } from '../types';

export const cartService = {
  async getCart(): Promise<Cart> {
    const response = await apiClient.get('/cart/');
    return response.data.data;
  },

  async addItem(productId: string, variantId?: string, quantity = 1): Promise<Cart> {
    const response = await apiClient.post('/cart/items/', {
      product_id: productId,
      variant_id: variantId,
      quantity,
    });
    return response.data.data;
  },

  async updateQuantity(itemId: string, quantity: number): Promise<Cart> {
    const response = await apiClient.patch(`/cart/items/${itemId}/`, { quantity });
    return response.data.data;
  },

  async removeItem(itemId: string): Promise<Cart> {
    const response = await apiClient.delete(`/cart/items/${itemId}/remove/`);
    return response.data.data;
  },

  async clearCart(): Promise<Cart> {
    const response = await apiClient.post('/cart/clear/');
    return response.data.data;
  },
};
