import React from 'react';
import Link from 'next/link';
import { Search, RotateCcw, Filter } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { mockProducts, Product } from '@/utils/mockData';
import ProductCard from '@/components/ProductCard';

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

function filterMockProducts(category?: string, search?: string): Product[] {
  let list = [...mockProducts];
  if (category && category !== 'All') {
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q)
    );
  }
  return list;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category || 'All';
  const search = resolvedParams.search || '';

  let products: Product[] = [];
  let fetchError = false;

  try {
    const supabase = await createClient();
    let query = supabase.from('products').select('*');

    if (category !== 'All') {
      query = query.eq('category', category);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error || !data) {
      products = filterMockProducts(category, search);
      if (error) fetchError = true;
    } else {
      // Map specifications if it's text or json
      products = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        category: item.category,
        description: item.description,
        image_url: item.image_url,
        is_sterile: item.is_sterile,
        certifications: item.certifications || [],
        specifications: typeof item.specifications === 'string' 
          ? JSON.parse(item.specifications) 
          : item.specifications || []
      }));
    }
  } catch (err) {
    products = filterMockProducts(category, search);
    fetchError = true;
  }

  const categories = ['All', 'Bandages', 'Cotton Products', 'Gauze Products'];

  return (
    <div className="bg-surface dark:bg-slate-900 transition-colors py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-gray-900 dark:text-white">
            Medical Dressing Catalogue
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl">
            Filter or search our premium collection of B2B surgical dressings. Select items to add to your custom quote request basket.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-150/60 dark:border-slate-700 shadow-sm flex flex-col lg:flex-row gap-6 justify-between items-stretch lg:items-center">
          
          {/* Categories Links */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mr-2 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              Categories:
            </span>
            {categories.map((cat) => {
              const isSelected = category === cat;
              const linkHref = cat === 'All' 
                ? `/products${search ? `?search=${encodeURIComponent(search)}` : ''}`
                : `/products?category=${encodeURIComponent(cat)}${search ? `&search=${encodeURIComponent(search)}` : ''}`;

              return (
                <Link
                  key={cat}
                  href={linkHref}
                  className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-primary text-white shadow-md shadow-primary/10'
                      : 'bg-slate-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>

          {/* Search Form */}
          <form method="GET" action="/products" className="relative flex-grow max-w-md">
            {category !== 'All' && (
              <input type="hidden" name="category" value={category} />
            )}
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search products..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 px-4 py-3 pl-11 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 text-gray-800 dark:text-gray-100 placeholder-gray-400"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </form>

        </div>

        {/* Connection status note if relevant */}
        {fetchError && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl p-4 text-xs font-medium">
            Note: Database connection is not established yet. Showing cached static product listings.
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-gray-150/60 dark:border-slate-700 space-y-4">
            <p className="text-lg text-gray-600 dark:text-gray-400 font-semibold">No products found matching your filters</p>
            <p className="text-sm text-gray-400">Try adjusting your category filter or search query string.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl text-sm font-bold transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Search
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
