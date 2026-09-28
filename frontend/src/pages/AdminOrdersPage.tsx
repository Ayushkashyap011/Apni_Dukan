import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import { adminService } from '../services/adminService';
import { OrderStatus } from '../types';

export const AdminOrdersPage: React.FC = () => {
  const { data: ordersData, refetch } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: () => orderService.getOrders(),
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      refetch();
    } catch (e) {
      alert('Failed to update order status.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Order Fulfillment & Status Workflow</h2>
        <p className="text-xs text-slate-500 mt-1">Manage order statuses from Pending to Shipped and Delivered</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-600">
              <th className="p-4">Order Number</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Grand Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Order Status</th>
              <th className="p-4 text-right">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {ordersData?.results.map((ord) => (
              <tr key={ord.id} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-brand-700">{ord.order_number}</td>
                <td className="p-4">
                  <span className="font-bold text-slate-900 block">{ord.shipping_full_name}</span>
                  <span className="text-[11px] text-slate-500">{ord.shipping_phone}</span>
                </td>
                <td className="p-4 font-black text-slate-900">₹{ord.grand_total}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ord.payment_status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ord.payment_status} ({ord.payment_method})
                  </span>
                </td>
                <td className="p-4">
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                    {ord.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <select
                    value={ord.status}
                    onChange={(e: any) => handleStatusChange(ord.id, e.target.value)}
                    className="bg-slate-100 border border-slate-200 rounded-lg p-1.5 text-xs font-bold text-slate-900 cursor-pointer focus:outline-none"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
