import { create } from 'zustand';
import { Wishlist } from '../types';
import { wishlistService } from '../services/wishlistService';

interface WishlistState {
  wishlist: Wishlist | null;
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: null,
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const wishlist = await wishlistService.getWishlist();
      set({ wishlist, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  toggleWishlist: async (productId) => {
    try {
      const res = await wishlistService.toggleWishlist(productId);
      set({ wishlist: res.data });
      return res.added;
    } catch (err: any) {
      throw err;
    }
  },

  isInWishlist: (productId) => {
    const wishlist = get().wishlist;
    if (!wishlist || !wishlist.items) return false;
    return wishlist.items.some((item) => item.product.id === productId);
  },
}));
