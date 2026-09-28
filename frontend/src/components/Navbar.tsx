import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, X, LogOut, ShieldCheck, Package } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { cart, openDrawer, fetchCart } = useCartStore();
  const { wishlist, fetchWishlist } = useWishlistStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    navigate('/login');
  };

  const cartCount = cart?.total_items || 0;
  const wishlistCount = wishlist?.total_items || 0;

  return (
    <header className="sticky top-0 z-40 w-full glass-header border-b border-slate-200/80 transition-all">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide">
        🚀 FREE SHIPPING ON ORDERS ABOVE ₹999 | USE CODE <span className="text-amber-400 font-bold">WELCOME10</span> FOR 10% OFF
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-brand-700 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                APNI DUKAN
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex space-x-6 text-sm font-semibold text-slate-700">
              <Link to="/" className={`hover:text-brand-600 transition ${location.pathname === '/' ? 'text-brand-600 font-bold' : ''}`}>
                Home
              </Link>
              <Link to="/shop" className={`hover:text-brand-600 transition ${location.pathname === '/shop' ? 'text-brand-600 font-bold' : ''}`}>
                Shop Catalog
              </Link>
              <Link to="/shop?category=clothing" className="hover:text-brand-600 transition">
                Clothing
              </Link>
              <Link to="/shop?category=accessories" className="hover:text-brand-600 transition">
                Accessories
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search t-shirts, jeans, watches, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-slate-400 hover:text-brand-600">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* User & Actions */}
          <div className="flex items-center space-x-5">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-1.5 text-slate-700 hover:text-brand-600 transition">
              <Heart className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button onClick={openDrawer} className="relative p-1.5 text-slate-700 hover:text-brand-600 transition">
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center shadow">
                    {user?.first_name?.[0] || 'U'}
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-premium border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900">{user?.first_name} {user?.last_name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Package className="w-4 h-4 text-slate-500" />
                      <span>My Orders</span>
                    </Link>

                    {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-purple-700 font-semibold bg-purple-50 hover:bg-purple-100"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <span>Admin Portal</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition shadow-sm"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-700"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="mb-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-lg py-2 px-3 text-sm"
            />
          </form>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 font-medium text-slate-700">Home</Link>
          <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 font-medium text-slate-700">Shop Catalog</Link>
          <Link to="/shop?category=clothing" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 font-medium text-slate-700">Clothing</Link>
          <Link to="/shop?category=accessories" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 font-medium text-slate-700">Accessories</Link>
        </div>
      )}
    </header>
  );
};
