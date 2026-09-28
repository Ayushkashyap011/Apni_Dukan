import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('customer@apnidukan.com');
  const [password, setPassword] = useState('Customer@123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed.');
    }
  };

  const handleAdminQuickFill = () => {
    setEmail('admin@apnidukan.com');
    setPassword('Admin@123');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Sign In to Your Account</h2>
        <p className="text-xs text-slate-500 mt-1">Welcome back! Please enter your credentials.</p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3 rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* Quick Fill Credentials Banner */}
      <div className="bg-brand-50 border border-brand-200 p-3 rounded-xl space-y-1 text-xs text-brand-900">
        <p className="font-bold">⚡ Quick Demo Accounts:</p>
        <div className="flex justify-between items-center text-[11px] text-slate-600">
          <span>Customer: customer@apnidukan.com / Customer@123</span>
        </div>
        <div className="flex justify-between items-center text-[11px] text-slate-600">
          <span>Admin: admin@apnidukan.com / Admin@123</span>
          <button onClick={handleAdminQuickFill} className="text-brand-700 font-bold underline">Fill Admin</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-extrabold py-3 px-4 rounded-xl shadow-lg transition text-xs"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        Don't have an account yet?{' '}
        <Link to="/register" className="font-bold text-brand-600 hover:text-brand-800">
          Create Account
        </Link>
      </div>
    </div>
  );
};
