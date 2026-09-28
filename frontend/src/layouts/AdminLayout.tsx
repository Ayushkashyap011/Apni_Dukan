import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="text-xl font-black text-white">APNI DUKAN</Link>
          <span className="block text-[10px] font-bold text-purple-400 tracking-wider mt-0.5">ADMIN PORTAL</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 text-sm font-medium">
          <Link
            to="/admin"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${location.pathname === '/admin' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard & Analytics</span>
          </Link>

          <Link
            to="/admin/orders"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${location.pathname === '/admin/orders' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Order Fulfillment</span>
          </Link>

          <Link
            to="/admin/products"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${location.pathname === '/admin/products' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Package className="w-5 h-5" />
            <span>Product Catalog</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link to="/" className="flex items-center space-x-2 text-xs text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
          <h1 className="text-lg font-extrabold text-slate-900">Admin Control Center</h1>
          <div className="text-xs text-slate-600 font-semibold">
            Logged in as: <span className="text-purple-700">{user?.email}</span>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
