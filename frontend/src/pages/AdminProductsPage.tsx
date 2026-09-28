import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';

export const AdminProductsPage: React.FC = () => {
  const { data: productsData } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: () => productService.getProducts({ page_size: 50 }),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Product Catalog Management</h2>
          <p className="text-xs text-slate-500 mt-1">View and manage product items, stock quantities, and prices</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-600">
              <th className="p-4">Item</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {productsData?.results.map((prod) => (
              <tr key={prod.id} className="hover:bg-slate-50">
                <td className="p-4 flex items-center space-x-3">
                  <img src={prod.primary_image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100'} alt="" className="w-10 h-10 object-cover rounded-lg bg-slate-100 shrink-0" />
                  <span className="font-bold text-slate-900 line-clamp-1">{prod.name}</span>
                </td>
                <td className="p-4 font-mono font-semibold text-slate-600">{prod.sku}</td>
                <td className="p-4 font-semibold text-purple-700">{prod.brand?.name || 'Generic'}</td>
                <td className="p-4 font-black text-slate-900">₹{prod.effective_price}</td>
                <td className="p-4 font-bold">
                  <span className={`px-2 py-0.5 rounded text-[11px] ${
                    prod.stock_quantity <= 5 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {prod.stock_quantity} units
                  </span>
                </td>
                <td className="p-4 font-bold text-amber-600">★ {prod.rating} ({prod.review_count})</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
