import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-600/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <Link to="/" className="inline-block">
          <span className="text-3xl font-black tracking-tight text-white">
            APNI DUKAN
          </span>
        </Link>
        <p className="text-xs text-slate-400 mt-1 font-medium">India's Premier Fashion E-Commerce Platform</p>
      </div>

      {/* Auth Card Outlet */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 relative z-10">
        <Outlet />
      </div>
    </div>
  );
};
