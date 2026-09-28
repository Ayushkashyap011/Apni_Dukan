import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User as UserIcon, MapPin, Key, Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';

export const ProfilePage: React.FC = () => {
  const { user, checkAuth } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'security'>('profile');

  // Profile Edit State
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileMsg, setProfileMsg] = useState('');

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { data: addresses, refetch: refetchAddresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => authService.getAddresses(),
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone,
      });
      await checkAuth();
      setProfileMsg('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');
    try {
      await authService.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      setPasswordMsg('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Password change failed.');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (confirm('Delete this address?')) {
      await authService.deleteAddress(id);
      refetchAddresses();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">MY ACCOUNT</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your profile, shipping addresses, and security settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Profile Sidebar */}
        <div className="space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition text-left ${
              activeTab === 'profile' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile Information</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition text-left ${
              activeTab === 'addresses' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition text-left ${
              activeTab === 'security' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Change Password</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="md:col-span-3 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">Personal Profile</h3>
              {profileMsg && <p className="text-xs font-bold text-emerald-600">{profileMsg}</p>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Read only)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                />
              </div>

              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow transition"
              >
                Save Profile Changes
              </button>
            </form>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">Your Saved Shipping Addresses</h3>
              <div className="space-y-3">
                {addresses?.map((addr) => (
                  <div key={addr.id} className="p-4 rounded-xl border border-slate-200 flex justify-between items-start">
                    <div className="space-y-1 text-xs">
                      <h4 className="font-bold text-slate-900">{addr.full_name} ({addr.phone})</h4>
                      <p className="text-slate-600">
                        {addr.address_line_1}, {addr.address_line_2 && `${addr.address_line_2}, `}{addr.city}, {addr.state} - {addr.postal_code}
                      </p>
                    </div>
                    <button onClick={() => handleDeleteAddress(addr.id)} className="text-slate-400 hover:text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">Security & Password</h3>
              {passwordMsg && <p className="text-xs font-bold text-emerald-600">{passwordMsg}</p>}
              {passwordError && <p className="text-xs font-bold text-red-600">{passwordError}</p>}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Password (Min 8 characters)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                />
              </div>

              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow transition"
              >
                Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
