import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, CheckCircle2, MessageSquarePlus } from 'lucide-react';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import { ProductVariant } from '../types';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProductBySlug(slug!),
    enabled: !!slug,
  });

  const { data: reviewsData, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', product?.id],
    queryFn: () => reviewService.getReviews(product!.id),
    enabled: !!product?.id,
  });

  if (isLoading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-600">Loading product details...</p>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);
  const mainImage = selectedImage || product.primary_image || product.images?.[0]?.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';

  const effectivePrice = selectedVariant?.effective_price || product.effective_price;
  const currentStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await addItem(product.id, selectedVariant?.id, quantity);
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await addItem(product.id, selectedVariant?.id, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    try {
      await reviewService.addReview({
        product: product.id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      setIsReviewModalOpen(false);
      setReviewTitle('');
      setReviewComment('');
      refetchReviews();
    } catch (err: any) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Product Images Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-slate-100 rounded-3xl overflow-hidden shadow-sm border border-slate-100">
            <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {product.images && product.images.length > 0 && (
            <div className="flex space-x-3 overflow-x-auto pb-2 custom-scrollbar">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.image)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition ${
                    mainImage === img.image ? 'border-brand-600 ring-2 ring-brand-400' : 'border-slate-200'
                  }`}
                >
                  <img src={img.image} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Actions */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              {product.brand?.name || 'APNI DUKAN'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
              {product.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1">SKU: {selectedVariant?.sku || product.sku}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg text-amber-700 font-bold text-xs">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
              <span>{product.rating || '4.8'}</span>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              {product.review_count || 12} Verified Customer Reviews
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline space-x-3 border-y border-slate-100 py-4">
            <span className="text-3xl font-black text-slate-900">₹{effectivePrice}</span>
            {product.discount_price && (
              <span className="text-base text-slate-400 line-through font-semibold">₹{product.price}</span>
            )}
            {product.discount_percentage > 0 && (
              <span className="bg-red-100 text-red-700 text-xs font-black px-2.5 py-1 rounded-full">
                SAVE {product.discount_percentage}%
              </span>
            )}
          </div>

          {/* Short Description */}
          {product.short_description && (
            <p className="text-xs text-slate-600 leading-relaxed">{product.short_description}</p>
          )}

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Select Size & Color</h4>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition ${
                      selectedVariant?.id === variant.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div className="flex items-center space-x-2 text-xs font-bold">
            {currentStock > 0 ? (
              <span className="text-emerald-600 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1" /> In Stock ({currentStock} available)
              </span>
            ) : (
              <span className="text-red-600 font-bold">Currently Out of Stock</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={currentStock <= 0}
              className="w-full sm:flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Shopping Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={currentStock <= 0}
              className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white font-bold py-3.5 px-6 rounded-xl transition text-sm"
            >
              Buy Now
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              className="p-3.5 border border-slate-200 rounded-xl hover:bg-slate-100 transition text-slate-700"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-brand-600" />
              <span>Free Delivery Over ₹999</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>100% Original Products</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Description & Reviews */}
      <div className="border-t border-slate-200 pt-12 space-y-8">
        <div>
          <h3 className="text-lg font-black text-slate-900 mb-3">Product Specifications & Overview</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {/* Customer Reviews Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-slate-900">Verified Customer Reviews</h3>
            {isAuthenticated && (
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-2 transition"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Write a Review</span>
              </button>
            )}
          </div>

          {reviewsData?.results && reviewsData.results.length > 0 ? (
            <div className="space-y-4">
              {reviewsData.results.map((rev) => (
                <div key={rev.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 bg-brand-100 text-brand-800 font-bold rounded-full text-xs flex items-center justify-center">
                        {rev.user_name?.[0]}
                      </div>
                      <span className="text-xs font-bold text-slate-900">{rev.user_name}</span>
                      {rev.is_verified_purchase && (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{rev.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No reviews yet for this product. Be the first to review!</p>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Write a Customer Review</h3>
            {reviewError && <p className="text-xs text-red-600">{reviewError}</p>}
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rating (1 to 5 Stars)</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Terrible</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Review Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Premium quality fabric & perfect fit!"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Review</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share your experience regarding sizing, material, stitching..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
