import { create } from 'zustand';
import { Cart } from '../types';
import { cartService } from '../services/cartService';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, variantId?: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  isDrawerOpen: false,

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const cart = await cartService.getCart();
      set({ cart, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, variantId, quantity = 1) => {
    set({ isLoading: true });
    try {
      const cart = await cartService.addItem(productId, variantId, quantity);
      set({ cart, isLoading: false, isDrawerOpen: true });
    } catch (err: any) {
      set({ isLoading: false });
      throw err;
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      const cart = await cartService.updateQuantity(itemId, quantity);
      set({ cart });
    } catch (err: any) {
      throw err;
    }
  },

  removeItem: async (itemId) => {
    try {
      const cart = await cartService.removeItem(itemId);
      set({ cart });
    } catch (err: any) {
      throw err;
    }
  },

  clearCart: async () => {
    try {
      const cart = await cartService.clearCart();
      set({ cart });
    } catch (err: any) {
      throw err;
    }
  },
}));
