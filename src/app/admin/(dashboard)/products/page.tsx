import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { mockProducts, Product } from '@/utils/mockData';
import ProductsDashboardManager from '@/components/ProductsDashboardManager';

async function fetchProducts() {
  let products: Product[] = [];
  let isSimulated = false;

  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured) {
    return { products: mockProducts, isSimulated: true };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn("Failed to load products from database, falling back to mock listings", error);
      products = mockProducts;
      if (error) isSimulated = true;
    } else {
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
    console.error("Products query try-catch block failure", err);
    products = mockProducts;
    isSimulated = true;
  }

  return { products, isSimulated };
}

export default async function AdminProductsPage() {
  const { products, isSimulated } = await fetchProducts();

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-extrabold text-gray-900 dark:text-white">
          Manage Dressing Catalogue
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add new medical supply models, customize specifications matrices, edit categories, and delete existing items.
        </p>
      </div>

      <ProductsDashboardManager initialProducts={products} isSimulated={isSimulated} />
    </div>
  );
}
