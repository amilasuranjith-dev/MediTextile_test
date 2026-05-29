import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ShieldCheck, ChevronRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { mockProducts, Product } from '@/utils/mockData';
import ProductDetailsInteraction from '@/components/ProductDetailsInteraction';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  let product: Product | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (data && !error) {
      product = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        category: data.category,
        description: data.description,
        image_url: data.image_url,
        is_sterile: data.is_sterile,
        certifications: data.certifications || [],
        specifications: typeof data.specifications === 'string'
          ? JSON.parse(data.specifications)
          : data.specifications || []
      };
    } else {
      product = mockProducts.find(p => p.slug === slug) || null;
    }
  } catch (err) {
    product = mockProducts.find(p => p.slug === slug) || null;
  }

  if (!product) {
    return notFound();
  }

  return (
    <div className="bg-surface dark:bg-slate-900 transition-colors py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to catalogue
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-450 dark:text-gray-500">
            <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/products" className="hover:text-gray-700 dark:hover:text-gray-300">Catalogue</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900 dark:text-gray-200">{product.name}</span>
          </div>
        </div>

        {/* Product Visual & Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column - Image & Tech Specs */}
          <div className="lg:col-span-7 space-y-8 animate-fade-in-up">
            
            {/* Image Wrapper */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-white/20 dark:border-slate-800 bg-white dark:bg-slate-800">
              <Image
                src={product.image_url || '/assets/favicon.png'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.is_sterile && (
                <span className="absolute top-6 right-6 bg-emerald-500 text-white text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow flex items-center gap-1.5 z-10">
                  <ShieldCheck className="w-4 h-4" />
                  Sterile Device
                </span>
              )}
            </div>

            {/* Complete Specifications Grid */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-150/60 dark:border-slate-700 shadow-sm space-y-6">
              <h3 className="font-heading font-bold text-xl text-gray-900 dark:text-white">Technical Specifications</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                {product.specifications && product.specifications.length > 0 ? (
                  product.specifications.map((spec, idx) => (
                    <div key={idx} className="border-b border-gray-50 dark:border-slate-750 pb-3 flex justify-between gap-4">
                      <span className="text-gray-400 dark:text-gray-500 font-medium">{spec.label}</span>
                      <span className="text-gray-800 dark:text-gray-200 font-semibold text-right">{spec.value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-xs">No specifications recorded.</p>
                )}
              </div>
            </div>

          </div>

          {/* Right Column - Info, Description, and cart */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Title & Description card */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-primary dark:text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded">
                {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-gray-900 dark:text-white mt-2">
                {product.name}
              </h1>
              <p className="text-base text-gray-650 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Certifications row */}
            <div className="flex flex-wrap gap-2.5">
              {product.certifications.map((cert) => (
                <span
                  key={cert}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                  {cert}
                </span>
              ))}
            </div>

            {/* Interactive cart client component */}
            <ProductDetailsInteraction product={product} />

          </div>

        </div>

      </div>
    </div>
  );
}
