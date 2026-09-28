import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, CreditCard, ShieldCheck, Plus, Check, ArrowRight } from 'lucide-react';
import { authService } from '../services/authService';
import { orderService } from '../services/orderService';
import { useCartStore } from '../store/cartStore';
import { Address } from '../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, fetchCart } = useCartStore();

  const couponCodeState = (location.state as any)?.couponCode || '';

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('MOCK');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Add Address Modal state
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const { data: addresses, refetch: refetchAddresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => authService.getAddresses(),
  });

  // Auto select default address
  React.useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses]);

  const handleAddAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAddr = await authService.addAddress({
        full_name: fullName,
        phone,
        address_line_1: addressLine1,
        address_line_2: addressLine2,
        city,
        state,
        postal_code: postalCode,
        country: 'India',
        is_default: true,
      });
      setIsAddAddressOpen(false);
      refetchAddresses();
      setSelectedAddressId(newAddr.id);
    } catch (err: any) {
      alert('Failed to add address.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setCheckoutError('Please select or add a shipping address.');
      return;
    }
    setCheckoutError('');
    setIsSubmitting(true);
    try {
      const res = await orderService.checkout(selectedAddressId, paymentMethod, couponCodeState, notes);
      await fetchCart();
      navigate(`/orders/${res.order.id}`, { state: { justPlaced: true } });
    } catch (err: any) {
      setIsSubmitting(false);
      setCheckoutError(err.response?.data?.message || 'Order checkout failed.');
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/shop')} className="bg-brand-600 text-white font-bold text-xs px-6 py-2.5 rounded-full">
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-8">SECURE CHECKOUT</h1>

      {checkoutError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-4 rounded-xl mb-6">
          {checkoutError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Address & Payment Selection */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Shipping Address */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>1. Select Shipping Address</span>
              </h2>
              <button
                onClick={() => setIsAddAddressOpen(true)}
                className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            {addresses && addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition relative ${
                      selectedAddressId === addr.id
                        ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-400'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {selectedAddressId === addr.id && (
                      <span className="absolute top-3 right-3 bg-brand-600 text-white rounded-full p-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <h4 className="text-xs font-bold text-slate-900">{addr.full_name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{addr.phone}</p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {addr.address_line_1}, {addr.address_line_2 && `${addr.address_line_2}, `}{addr.city}, {addr.state} - {addr.postal_code}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-slate-500 mb-3">No saved address found.</p>
                <button
                  onClick={() => setIsAddAddressOpen(true)}
                  className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Add Address Now
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-brand-600" />
              <span>2. Choose Payment Method</span>
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${
                  paymentMethod === 'MOCK' ? 'border-brand-600 bg-brand-50/40' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    value="MOCK"
                    checked={paymentMethod === 'MOCK'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-brand-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Instant Payment Gateway (Card / NetBanking)</span>
                    <span className="text-[11px] text-slate-500">Fast 1-click test checkout simulation</span>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">RECOMMENDED</span>
              </label>

              <label
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${
                  paymentMethod === 'COD' ? 'border-brand-600 bg-brand-50/40' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-brand-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Cash on Delivery (COD)</span>
                    <span className="text-[11px] text-slate-500">Pay cash upon home delivery</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Summary Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 h-fit">
          <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">Review Order Items</h3>

          <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-1">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between text-xs">
                <span className="font-semibold text-slate-800 line-clamp-1">
                  {item.quantity}x {item.product.name}
                </span>
                <span className="font-bold text-slate-900">₹{item.total_price}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">₹{cart.subtotal}</span>
            </div>
            {couponCodeState && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Applied Coupon</span>
                <span>{couponCodeState}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-bold text-emerald-600">
                {cart.shipping_fee === 0 ? 'FREE' : `₹${cart.shipping_fee}`}
              </span>
            </div>
          </div>

          <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
            <span>Total Payable</span>
            <span className="text-brand-700">₹{cart.grand_total}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-sm mt-4"
          >
            <span>{isSubmitting ? 'Processing Order...' : 'Place Order & Pay Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center space-x-1 text-[11px] text-slate-400 font-medium pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Guaranteed 256-Bit Encrypted Payment</span>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add New Shipping Address</h3>
            <form onSubmit={handleAddAddressSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                />
                <input
                  type="text"
                  required
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                />
              </div>

              <input
                type="text"
                required
                placeholder="Address Line 1 (House/Flat #, Building, Street)"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
              />

              <input
                type="text"
                placeholder="Address Line 2 (Landmark, Area)"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
              />

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                />
                <input
                  type="text"
                  required
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                />
                <input
                  type="text"
                  required
                  placeholder="Pincode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
