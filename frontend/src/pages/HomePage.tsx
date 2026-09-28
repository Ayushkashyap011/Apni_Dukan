import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, Flame } from 'lucide-react';
import { productService } from '../services/productService';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/SkeletonLoader';

export const HomePage: React.FC = () => {
  const { data: featuredData, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => productService.getProducts({ featured: true, page_size: 8 }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
  });

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/50 to-purple-900/50" />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-brand-600/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <span className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold text-amber-400 mb-6 animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span>FESTIVE FASHION DROPS 2026</span>
          </span>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-4xl mb-6">
            ELEVATE YOUR EVERYDAY STYLE WITH{' '}
            <span className="bg-gradient-to-r from-brand-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
              APNI DUKAN
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mb-8 leading-relaxed">
            Discover India's finest collection of heavyweight graphic tees, crisp cotton shirts, original fit denim, and luxury accessories.
          </p>

          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-8 py-4 rounded-full shadow-lg hover:shadow-brand-500/50 transition flex items-center justify-center space-x-2 text-sm"
            >
              <span>Explore Shop Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/shop?category=clothing"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-full backdrop-blur-md border border-white/20 transition text-sm"
            >
              View Clothing Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">SHOP BY CATEGORY</h2>
            <p className="text-xs text-slate-500 mt-1">Curated collections tailored for your wardrobe</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <Link
            to="/shop?category=clothing"
            className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition"
          >
            <img
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600"
              alt="T-Shirts & Apparel"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent p-6 flex flex-col justify-end">
              <h3 className="text-lg font-bold text-white">Heavyweight Tees</h3>
              <p className="text-xs text-amber-300 font-semibold">Flat 40% OFF</p>
            </div>
          </Link>

          <Link
            to="/shop?category=clothing"
            className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition"
          >
            <img
              src="https://images.unsplash.com/photo-1542272604-780c36856842?w=600"
              alt="Denim Jeans"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent p-6 flex flex-col justify-end">
              <h3 className="text-lg font-bold text-white">Original Fit Jeans</h3>
              <p className="text-xs text-amber-300 font-semibold">Starting ₹1,499</p>
            </div>
          </Link>

          <Link
            to="/shop?category=accessories"
            className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition"
          >
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600"
              alt="Watches"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent p-6 flex flex-col justify-end">
              <h3 className="text-lg font-bold text-white">Luxury Watches</h3>
              <p className="text-xs text-amber-300 font-semibold">Titan & Fastrack</p>
            </div>
          </Link>

          <Link
            to="/shop?category=accessories"
            className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition"
          >
            <img
              src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600"
              alt="Footwear"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent p-6 flex flex-col justify-end">
              <h3 className="text-lg font-bold text-white">Sneakers & Kicks</h3>
              <p className="text-xs text-amber-300 font-semibold">Nike & Puma</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Trending Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center space-x-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4" />
              <span>MOST POPULAR</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">TRENDING THIS WEEK</h2>
          </div>

          <Link to="/shop" className="text-xs font-bold text-brand-600 hover:text-brand-800 transition flex items-center space-x-1">
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isFeaturedLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {featuredData?.results?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-purple-900 via-brand-900 to-slate-950 p-8 sm:p-12 overflow-hidden shadow-2xl text-white">
          <div className="relative z-10 max-w-xl">
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
              LIMITED TIME OFFER
            </span>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
              Get ₹500 OFF On Orders Above ₹1,999
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-6">
              Apply coupon code <span className="bg-white/20 text-amber-300 px-2.5 py-1 rounded font-mono font-bold">FASHION500</span> at checkout to unlock instant flat savings.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 bg-white text-slate-900 font-extrabold px-6 py-3 rounded-full text-xs hover:bg-slate-100 transition shadow-lg"
            >
              <span>Shop Discount Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
