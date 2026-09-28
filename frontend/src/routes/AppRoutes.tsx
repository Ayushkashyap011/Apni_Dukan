import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { AdminLayout } from '../layouts/AdminLayout';

import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';
import { OrdersHistoryPage } from '../pages/OrdersHistoryPage';
import { WishlistPage } from '../pages/WishlistPage';
import { ProfilePage } from '../pages/ProfilePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { AdminOrdersPage } from '../pages/AdminOrdersPage';
import { AdminProductsPage } from '../pages/AdminProductsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'STAFF';
  return isAuthenticated && isAdmin ? <>{children}</> : <Navigate to="/" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Customer Storefront */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="product/:slug" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />

        {/* Protected Customer Routes */}
        <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute><OrdersHistoryPage /></ProtectedRoute>} />
        <Route path="orders/:id" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
        <Route path="wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Route>

      {/* Auth Layout */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Admin Portal */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="products" element={<AdminProductsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
