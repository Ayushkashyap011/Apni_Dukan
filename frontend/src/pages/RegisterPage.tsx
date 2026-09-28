import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (password !== passwordConfirm) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    try {
      await register({
        email,
        password,
        password_confirm: passwordConfirm,
        first_name: firstName,
        last_name: lastName,
        phone,
      });
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Create New Account</h2>
        <p className="text-xs text-slate-500 mt-1">Join APNI DUKAN for instant discounts & fast checkout.</p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3 rounded-xl">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">First Name</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
          <input
            type="text"
            required
            placeholder="+91 9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-extrabold py-3 px-4 rounded-xl shadow-lg transition text-xs mt-2"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-brand-600 hover:text-brand-800">
          Sign In
        </Link>
      </div>
    </div>
  );
};
