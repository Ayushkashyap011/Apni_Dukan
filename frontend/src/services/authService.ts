import { apiClient } from './apiClient';
import { User, Address } from '../types';

export const authService = {
  async register(data: any) {
    const response = await apiClient.post('/auth/register/', data);
    return response.data;
  },

  async login(data: any) {
    const response = await apiClient.post('/auth/login/', data);
    return response.data;
  },

  async logout(refreshToken?: string) {
    const response = await apiClient.post('/auth/logout/', { refresh: refreshToken });
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get('/auth/profile/');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.patch('/auth/profile/', data);
    return response.data;
  },

  async changePassword(data: any) {
    const response = await apiClient.post('/auth/change-password/', data);
    return response.data;
  },

  async getAddresses(): Promise<Address[]> {
    const response = await apiClient.get('/addresses/');
    return response.data.results || response.data;
  },

  async addAddress(data: Omit<Address, 'id' | 'created_at'>): Promise<Address> {
    const response = await apiClient.post('/addresses/', data);
    return response.data;
  },

  async deleteAddress(id: string) {
    await apiClient.delete(`/addresses/${id}/`);
  },
};
