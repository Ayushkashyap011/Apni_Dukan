import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Filter, SlidersHorizontal, Search, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { productService, ProductFilters } from '../services/productService';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/SkeletonLoader';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryQuery = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryQuery);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'price_low' | 'price_high' | 'newest' | 'rating'>('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSelectedCategory(categoryQuery);
  }, [categoryQuery]);

  const filters: ProductFilters = {
    category: selectedCategory || undefined,
    brand: selectedBrand || undefined,
    size: selectedSize || undefined,
    color: selectedColor || undefined,
    min_price: minPrice,
    max_price: maxPrice,
    search: searchQuery || undefined,
    sort_by: sortBy,
    page,
    page_size: 12,
  };

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['shopProducts', filters],
    queryFn: () => productService.getProducts(filters),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
  });

  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: () => productService.getBrands(),
  });

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedSize('');
    setSelectedColor('');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">SHOP CATALOG</h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {productsData?.count || 0} premium items
          </p>
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="space-y-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <Filter className="w-4 h-4 text-brand-600" />
              <span>Filters</span>
            </div>
            <button onClick={handleResetFilters} className="text-xs text-brand-600 hover:text-brand-800 font-semibold flex items-center space-x-1">
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Categories Filter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Categories</h4>
            <div className="space-y-2 text-xs text-slate-600 font-medium">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === ''}
                  onChange={() => setSelectedCategory('')}
                  className="accent-brand-600"
                />
                <span>All Categories</span>
              </label>
              {categories?.map((cat) => (
                <label key={cat.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat.slug}
                    onChange={() => setSelectedCategory(cat.slug)}
                    className="accent-brand-600"
                  />
                  <span>{cat.name} ({cat.product_count || 0})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brands Filter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Brands</h4>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
            >
              <option value="">All Brands</option>
              {brands?.map((b) => (
                <option key={b.id} value={b.slug}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Size</h4>
            <div className="flex flex-wrap gap-2">
              {['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                    selectedSize === sz
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Max Price (₹)</h4>
            <input
              type="range"
              min="500"
              max="10000"
              step="500"
              value={maxPrice || 10000}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
            <div className="flex justify-between text-xs text-slate-500 font-semibold mt-1">
              <span>₹500</span>
              <span>₹{maxPrice || 10000}</span>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3 space-y-8">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : !productsData || productsData.results.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-slate-100 shadow-sm">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No products found</h3>
              <p className="text-xs text-slate-500 mb-6">Try adjusting your category, brand or price filters.</p>
              <button
                onClick={handleResetFilters}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-2.5 rounded-full shadow transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {productsData.results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {productsData.total_pages > 1 && (
                <div className="flex justify-center items-center space-x-3 pt-6 border-t border-slate-200">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-slate-700">
                    Page {page} of {productsData.total_pages}
                  </span>
                  <button
                    disabled={page === productsData.total_pages}
                    onClick={() => setPage(page + 1)}
                    className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
