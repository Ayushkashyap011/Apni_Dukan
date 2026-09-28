import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Headset } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      {/* Value Proposition Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 border-b border-slate-800 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-brand-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Express Shipping</h4>
              <p className="text-xs text-slate-400">Free delivery on orders over ₹999 across India</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-brand-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">15-Day Easy Returns</h4>
              <p className="text-xs text-slate-400">No hassle return & replacement policy</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-brand-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">100% Secure Checkout</h4>
              <p className="text-xs text-slate-400">Encrypted UPI, Cards & Net Banking</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-brand-400 flex items-center justify-center shrink-0">
              <Headset className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">24/7 Dedicated Support</h4>
              <p className="text-xs text-slate-400">Instant query assistance via chat & email</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div>
          <span className="text-2xl font-black tracking-tight text-white mb-4 block">
            APNI DUKAN
          </span>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            India's premier fashion e-commerce destination for high-street streetwear, ethnic grace, and premium accessories.
          </p>
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} APNI DUKAN. All rights reserved.</p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Shop Collections</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/shop?category=t-shirts" className="hover:text-white transition">Oversized T-Shirts</Link></li>
            <li><Link to="/shop?category=shirts" className="hover:text-white transition">Casual Cotton Shirts</Link></li>
            <li><Link to="/shop?category=jeans" className="hover:text-white transition">Original Fit Jeans</Link></li>
            <li><Link to="/shop?category=kurtas" className="hover:text-white transition">Ethnic Silk Kurtas</Link></li>
            <li><Link to="/shop?category=watches" className="hover:text-white transition">Chronograph Watches</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Customer Care</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/orders" className="hover:text-white transition">Track Order</Link></li>
            <li><Link to="/profile" className="hover:text-white transition">Manage Address</Link></li>
            <li><a href="#" className="hover:text-white transition">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-white transition">Returns & Refunds</a></li>
            <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Stay Connected</h4>
          <p className="text-xs text-slate-400 mb-3">Subscribe for exclusive discount drops and new collection launches.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-slate-800 border border-slate-700 text-white px-3 py-2 text-xs rounded-l-lg focus:outline-none focus:ring-1 focus:ring-brand-500 w-full"
            />
            <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 text-xs font-semibold rounded-r-lg transition">
              Join
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};
