import { apiClient } from './apiClient';
import { Review, PaginatedResponse } from '../types';

export const reviewService = {
  async getReviews(productId: string): Promise<PaginatedResponse<Review>> {
    const response = await apiClient.get('/reviews/', { params: { product_id: productId } });
    return response.data;
  },

  async addReview(data: { product: string; rating: number; title: string; comment: string }) {
    const response = await apiClient.post('/reviews/', data);
    return response.data;
  },
};
