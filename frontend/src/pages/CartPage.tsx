import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { couponService } from '../services/couponService';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeItem } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMsg, setCouponMsg] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim() || !cart) return;
    setCouponMsg('');
    setCouponError('');
    try {
      const res = await couponService.validateCoupon(couponCode, Number(cart.subtotal));
      setCouponDiscount(Number(res.coupon.discount_amount));
      setAppliedCoupon(res.coupon.code);
      setCouponMsg(res.message);
    } catch (err: any) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code.');
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-slate-500 mb-8 max-w-sm mx-auto">
          Explore our trending streetwear collection and add your favorite t-shirts, jeans, and watches!
        </p>
        <Link
          to="/shop"
          className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold px-8 py-3.5 rounded-full shadow-lg transition"
        >
          Explore Shop Catalog
        </Link>
      </div>
    );
  }

  const subtotal = Number(cart.subtotal);
  const shippingFee = cart.shipping_fee;
  const grandTotal = Math.max(0, subtotal - couponDiscount) + shippingFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-8">SHOPPING CART</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-4">
              <img
                src={item.product.primary_image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300'}
                alt={item.product.name}
                className="w-24 h-28 object-cover rounded-xl bg-slate-100 shrink-0"
              />

              <div className="flex-1 w-full space-y-1">
                <div className="flex justify-between items-start">
                  <Link to={`/product/${item.product.slug}`} className="text-sm font-bold text-slate-900 hover:text-brand-600">
                    {item.product.name}
                  </Link>
                  <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-600 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {item.variant && (
                  <p className="text-xs text-slate-500">Variant: <span className="font-semibold text-slate-700">{item.variant.name}</span></p>
                )}
                <p className="text-sm font-extrabold text-slate-900">₹{item.unit_price}</p>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 text-slate-600 hover:text-black">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-900">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 text-slate-600 hover:text-black">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-sm font-black text-brand-700">Total: ₹{item.total_price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Coupons */}
        <div className="space-y-6">
          {/* Coupon Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
              <Tag className="w-4 h-4 text-brand-600" />
              <span>Apply Promo Coupon</span>
            </h3>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon (e.g. WELCOME10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold uppercase focus:outline-none"
              />
              <button type="submit" className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition">
                Apply
              </button>
            </form>
            {couponMsg && <p className="text-xs font-semibold text-emerald-600">{couponMsg}</p>}
            {couponError && <p className="text-xs font-semibold text-red-600">{couponError}</p>}
          </div>

          {/* Summary Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">Order Summary</h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">₹{subtotal}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount ({appliedCoupon})</span>
                  <span>- ₹{couponDiscount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-bold text-emerald-600">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>Grand Total</span>
              <span className="text-brand-700">₹{grandTotal}</span>
            </div>

            <button
              onClick={() => navigate('/checkout', { state: { couponCode: appliedCoupon } })}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center space-x-1 text-[11px] text-slate-400 font-medium pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Guaranteed Safe & Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
