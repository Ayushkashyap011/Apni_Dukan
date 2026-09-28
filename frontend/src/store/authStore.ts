import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  accessToken: localStorage.getItem('access_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));

      set({
        user: data.user,
        accessToken: data.access,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.detail || 'Invalid email or password.';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const resp = await authService.register(data);
      localStorage.setItem('access_token', resp.access);
      localStorage.setItem('refresh_token', resp.refresh);
      localStorage.setItem('user', JSON.stringify(resp.user));

      set({
        user: resp.user,
        accessToken: resp.access,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.password_confirm?.[0] || 'Registration failed.';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token') || undefined;
    try {
      await authService.logout(refreshToken);
    } catch (e) {
      // Ignore logout API error
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      set({ user: null, accessToken: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    try {
      const user = await authService.getProfile();
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } catch (e) {
      set({ user: null, isAuthenticated: false });
    }
  },
}));
