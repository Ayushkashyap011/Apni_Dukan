import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import { orderService } from '../services/orderService';

export const OrdersHistoryPage: React.FC = () => {
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['myOrders'],
    queryFn: () => orderService.getOrders(),
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">MY ORDERS HISTORY</h1>
        <p className="text-xs text-slate-500 mt-1">Track and manage all your past e-commerce orders</p>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading order history...</p>
        </div>
      ) : !ordersData || ordersData.results.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-slate-100 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No orders placed yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse our catalog to place your first order!
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-2.5 rounded-full transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Shop Catalog</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {ordersData.results.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                <div>
                  <span className="text-xs font-bold text-slate-500">Order Number:</span>
                  <span className="text-xs font-black text-brand-700 ml-2">{order.order_number}</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Placed on: {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                    order.status === 'CONFIRMED' || order.status === 'DELIVERED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-sm font-black text-slate-900">₹{order.grand_total}</span>
                </div>
              </div>

              {/* Items summary */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs text-slate-700">
                    <span>{item.quantity}x {item.product_name} {item.variant_name && `(${item.variant_name})`}</span>
                    <span className="font-bold text-slate-900">₹{item.total_price}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <Link
                  to={`/orders/${order.id}`}
                  className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center space-x-1"
                >
                  <span>View Full Order Invoice</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
