"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { useQuoteCart } from '@/context/QuoteCartContext';
import { Product } from '@/utils/mockData';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useQuoteCart();
  const [added, setAdded] = useState(false);

  const handleAddToQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image_url: product.image_url,
      category: product.category,
    }, 1);
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-150/60 dark:border-slate-700 shadow-sm hover:shadow-xl dark:shadow-slate-900/40 hover:-translate-y-1 transition-all duration-300">
      
      {/* Product Image Wrapper */}
      <div className="aspect-[4/3] relative bg-slate-50 dark:bg-slate-900 overflow-hidden border-b border-gray-100 dark:border-slate-700/60">
        <Image
          src={product.image_url || '/assets/favicon.png'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transform group-hover:scale-104 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.is_sterile && (
            <span className="bg-emerald-500 text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Sterile
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] text-primary dark:text-blue-400 font-extrabold tracking-widest uppercase bg-blue-500/10 px-2 py-1 rounded">
            {product.category}
          </span>
          <h4 className="text-xl font-heading font-bold text-gray-900 dark:text-white mt-2">
            {product.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Specifications snippet */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-gray-100 dark:border-slate-700/40">
            <p className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Key Specifications</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-600 dark:text-gray-400">
              {product.specifications.slice(0, 2).map((spec, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="font-medium text-gray-400 dark:text-gray-500 text-[10px]">{spec.label}</span>
                  <span className="font-semibold truncate">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions row */}
        <div className="pt-4 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-between gap-4">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
          >
            Details
            <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-0.5 transition-transform" />
          </Link>
          
          <button
            onClick={handleAddToQuote}
            className={`inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              added
                ? 'bg-emerald-500 text-white shadow-emerald-500/10'
                : 'bg-primary hover:bg-blue-700 text-white shadow-primary/10'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            {added ? 'Added to Quote' : 'Add to Quote'}
          </button>
        </div>
      </div>
    </div>
  );
}
