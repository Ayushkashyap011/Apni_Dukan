import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { ProductCard } from '../components/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist } = useWishlistStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <Heart className="w-7 h-7 text-red-500 fill-red-500" />
          <span>MY WISHLIST</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">Saved items you love</p>
      </div>

      {!wishlist || !wishlist.items || wishlist.items.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-slate-100 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Your wishlist is empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Save items while browsing to easily find and purchase them later!
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-2.5 rounded-full transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Products</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.items.map((item) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
};
