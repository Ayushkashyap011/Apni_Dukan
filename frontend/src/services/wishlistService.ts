import { apiClient } from './apiClient';
import { Wishlist } from '../types';

export const wishlistService = {
  async getWishlist(): Promise<Wishlist> {
    const response = await apiClient.get('/wishlist/');
    return response.data.data;
  },

  async toggleWishlist(productId: string) {
    const response = await apiClient.post('/wishlist/toggle/', { product_id: productId });
    return response.data;
  },

  async moveToCart(productId: string, variantId?: string) {
    const response = await apiClient.post('/wishlist/move-to-cart/', {
      product_id: productId,
      variant_id: variantId,
    });
    return response.data;
  },
};
