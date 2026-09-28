import { apiClient } from './apiClient';
import { Product, Category, Brand, PaginatedResponse } from '../types';

export interface ProductFilters {
  category?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  size?: string;
  color?: string;
  featured?: boolean;
  in_stock?: boolean;
  search?: string;
  sort_by?: 'price_low' | 'price_high' | 'newest' | 'rating';
  page?: number;
  page_size?: number;
}

export const productService = {
  async getProducts(params?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get('/products/', { params });
    return response.data;
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const response = await apiClient.get(`/products/${slug}/`);
    return response.data;
  },

  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get('/categories/');
    return response.data.results || response.data;
  },

  async getBrands(): Promise<Brand[]> {
    const response = await apiClient.get('/brands/');
    return response.data.results || response.data;
  },
};
