import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { cart, isDrawerOpen, closeDrawer, updateQuantity, removeItem } = useCartStore();

  if (!isDrawerOpen) return null;

  const handleCheckoutClick = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const handleShopClick = () => {
    closeDrawer();
    navigate('/shop');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={closeDrawer} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-bold text-slate-900">Your Shopping Cart</h2>
              <span className="bg-brand-50 text-brand-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {cart?.total_items || 0} items
              </span>
            </div>
            <button onClick={closeDrawer} className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
            {!cart || cart.items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">Your cart is empty</h3>
                <p className="text-xs text-slate-500 mb-6">Looks like you haven't added any items yet.</p>
                <button
                  onClick={handleShopClick}
                  className="bg-slate-900 hover:bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-full transition"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.items.map((item) => (
                <div key={item.id} className="flex space-x-4 border-b border-slate-100 pb-4">
                  <div className="w-20 h-24 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item.product.primary_image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.product.name}</h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-red-600 transition p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.variant && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Variant: <span className="font-semibold text-slate-700">{item.variant.name}</span>
                        </p>
                      )}
                      <p className="text-xs font-extrabold text-slate-900 mt-1">₹{item.unit_price}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-slate-600 hover:text-black"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-slate-600 hover:text-black"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-brand-700">₹{item.total_price}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cart && cart.items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 space-y-3">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{cart.subtotal}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Shipping Fee</span>
                <span className="font-bold text-emerald-600">
                  {cart.shipping_fee === 0 ? 'FREE' : `₹${cart.shipping_fee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-brand-700">₹{cart.grand_total}</span>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-sm mt-4"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
