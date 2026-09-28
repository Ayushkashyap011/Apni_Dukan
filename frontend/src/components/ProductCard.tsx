import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const isLiked = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleWishlist(product.id);
  };

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // If product has variants, default to first active variant or base
    const defaultVariant = product.variants?.[0]?.id;
    await addItem(product.id, defaultVariant, 1);
  };

  const imageSrc =
    product.primary_image ||
    (product.images?.[0]?.image) ||
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600';

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-premium transition-all duration-300 flex flex-col h-full">
      {/* Thumbnail & Badges */}
      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
        <Link to={`/product/${product.slug}`}>
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800';
            }}
          />
        </Link>

        {/* Discount Badge */}
        {product.discount_percentage > 0 && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
            {product.discount_percentage}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-700 hover:text-red-500 hover:bg-white shadow transition"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Quick Add overlay button */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-slate-900/90 backdrop-blur-md hover:bg-black text-white text-xs font-bold py-2.5 rounded-xl shadow-lg flex items-center justify-center space-x-1.5 transition"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand */}
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 mb-1 block">
            {product.brand?.name || 'APNI DUKAN'}
          </span>

          {/* Title */}
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-xs font-semibold text-slate-900 line-clamp-2 hover:text-brand-600 transition mb-2">
              {product.name}
            </h3>
          </Link>
        </div>

        <div>
          {/* Rating */}
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-800">{product.rating || '4.8'}</span>
            <span className="text-[11px] text-slate-400">({product.review_count || 12})</span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline space-x-2">
            <span className="text-sm font-extrabold text-slate-900">₹{product.effective_price}</span>
            {product.discount_price && (
              <span className="text-xs text-slate-400 line-through">₹{product.price}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
