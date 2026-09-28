import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Package, MapPin, Truck, ArrowRight } from 'lucide-react';
import { orderService } from '../services/orderService';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id!),
    enabled: !!id,
  });

  if (isLoading || !order) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-semibold text-slate-600">Retrieving order details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success Badge Banner */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">ORDER CONFIRMED!</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Thank you for shopping with APNI DUKAN! Your order <span className="font-bold text-brand-700">{order.order_number}</span> has been confirmed and is being processed for dispatch.
        </p>

        <div className="flex justify-center items-center space-x-4 pt-2">
          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
            Payment Status: {order.payment_status}
          </span>
          <span className="bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1 rounded-full border border-brand-200">
            Order Status: {order.status}
          </span>
        </div>
      </div>

      {/* Order Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Items Purchased */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Package className="w-4 h-4 text-brand-600" />
            <span>Items Ordered</span>
          </h3>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 line-clamp-1">{item.product_name}</h4>
                  {item.variant_name && <p className="text-[11px] text-slate-500">{item.variant_name}</p>}
                  <p className="text-[11px] text-slate-400">Qty: {item.quantity} x ₹{item.unit_price}</p>
                </div>
                <span className="font-extrabold text-slate-900">₹{item.total_price}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">₹{order.subtotal}</span>
            </div>
            {Number(order.discount_amount) > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount</span>
                <span>- ₹{order.discount_amount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-bold text-emerald-600">₹{order.shipping_fee}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Grand Total</span>
              <span className="text-brand-700">₹{order.grand_total}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <MapPin className="w-4 h-4 text-brand-600" />
            <span>Shipping Address</span>
          </h3>

          <div className="text-xs space-y-1 text-slate-700">
            <p className="font-bold text-slate-900 text-sm">{order.shipping_full_name}</p>
            <p className="text-slate-500">{order.shipping_phone}</p>
            <p className="mt-2 leading-relaxed">
              {order.shipping_address_line_1}, {order.shipping_address_line_2 && `${order.shipping_address_line_2}, `}{order.shipping_city}, {order.shipping_state} - {order.shipping_postal_code}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center space-x-3 text-xs text-slate-600 mt-4">
            <Truck className="w-5 h-5 text-brand-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900 block">Estimated Delivery</span>
              <span>Within 3 - 5 business days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Link
          to="/orders"
          className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-6 py-3 rounded-full transition"
        >
          View All Orders
        </Link>
        <Link
          to="/shop"
          className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-6 py-3 rounded-full shadow transition flex items-center space-x-1.5"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
