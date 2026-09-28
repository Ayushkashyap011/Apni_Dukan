import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { IndianRupee, ShoppingBag, Users, AlertTriangle, TrendingUp, Package } from 'lucide-react';
import { adminService } from '../services/adminService';

export const AdminDashboardPage: React.FC = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: () => adminService.getAnalytics(),
  });

  if (isLoading || !analytics) {
    return (
      <div className="text-center py-16">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-600">Loading admin business metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Business Overview</h2>
        <p className="text-xs text-slate-500 mt-1">Real-time performance analytics for APNI DUKAN</p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-emerald-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Revenue</span>
            <div className="p-2 bg-emerald-50 rounded-xl"><IndianRupee className="w-5 h-5" /></div>
          </div>
          <p className="text-2xl font-black text-slate-900">₹{analytics.total_revenue.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-blue-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Orders</span>
            <div className="p-2 bg-blue-50 rounded-xl"><ShoppingBag className="w-5 h-5" /></div>
          </div>
          <p className="text-2xl font-black text-slate-900">{analytics.total_orders}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-amber-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Orders</span>
            <div className="p-2 bg-amber-50 rounded-xl"><Package className="w-5 h-5" /></div>
          </div>
          <p className="text-2xl font-black text-slate-900">{analytics.pending_orders}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-purple-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Customers</span>
            <div className="p-2 bg-purple-50 rounded-xl"><Users className="w-5 h-5" /></div>
          </div>
          <p className="text-2xl font-black text-slate-900">{analytics.total_customers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Recent Customer Orders</span>
            <span className="text-xs font-normal text-slate-400">Top 5 Recent</span>
          </h3>

          <div className="space-y-3">
            {analytics.recent_orders.map((ord) => (
              <div key={ord.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{ord.order_number}</span>
                  <span className="text-slate-500">{ord.shipping_full_name}</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900 block">₹{ord.grand_total}</span>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2 text-amber-700">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Low Stock Inventory Alerts</span>
          </h3>

          {analytics.low_stock_alerts.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center">No inventory alerts. All items adequately stocked!</p>
          ) : (
            <div className="space-y-2">
              {analytics.low_stock_alerts.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{item.name}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{item.sku}</span>
                  </div>
                  <span className="bg-red-600 text-white font-extrabold px-2.5 py-1 rounded-full text-[10px]">
                    Only {item.stock_quantity} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
