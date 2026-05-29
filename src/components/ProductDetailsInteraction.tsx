"use client";

import React, { useState } from 'react';
import { Plus, Minus, FileText, CheckCircle2 } from 'lucide-react';
import { useQuoteCart } from '@/context/QuoteCartContext';
import { Product } from '@/utils/mockData';

interface ProductDetailsInteractionProps {
  product: Product;
}

export default function ProductDetailsInteraction({ product }: ProductDetailsInteractionProps) {
  const { addToCart } = useQuoteCart();
  const [quantity, setQuantity] = useState(1);
  const [customSpecs, setCustomSpecs] = useState('');
  const [added, setAdded] = useState(false);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        image_url: product.image_url,
        category: product.category,
        specifications: customSpecs.trim() || undefined,
      },
      quantity
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-150/60 dark:border-slate-700 shadow-sm">
      <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white">B2B Order Quote Request</h3>
      
      {/* Quantity Adjuster */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Inquiry Quantity</label>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDecrement}
            className="w-11 h-11 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-bold text-lg text-gray-900 dark:text-white">{quantity}</span>
          <button
            onClick={handleIncrement}
            className="w-11 h-11 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Custom Specifications Textbox */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Custom Specifications (Optional)</label>
        <textarea
          value={customSpecs}
          onChange={(e) => setCustomSpecs(e.target.value)}
          placeholder="Specify custom sizes (e.g. 10cm x 10m), packaging requirements, or Private Labeling details..."
          rows={3}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 text-gray-800 dark:text-gray-100 placeholder-gray-400"
        />
      </div>

      {/* Submission CTA */}
      <button
        onClick={handleAddToCart}
        className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
          added
            ? 'bg-emerald-500 text-white shadow-emerald-500/10'
            : 'bg-primary hover:bg-blue-700 text-white shadow-primary/20 hover:scale-[1.01]'
        }`}
      >
        {added ? (
          <>
            <CheckCircle2 className="w-4.5 h-4.5 animate-bounce" />
            Added to Basket
          </>
        ) : (
          <>
            <FileText className="w-4.5 h-4.5" />
            Add to Quote Basket
          </>
        )}
      </button>
    </div>
  );
}
