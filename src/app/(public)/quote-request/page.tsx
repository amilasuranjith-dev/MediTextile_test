"use client";

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuoteCart } from '@/context/QuoteCartContext';
import { Trash2, FileText, Send, Building2, User, Mail, Phone, CheckCircle, Info, ChevronRight } from 'lucide-react';
import { submitQuoteRequest } from '@/app/actions/quotes';

export default function QuoteRequestPage() {
  const { cartItems, removeFromCart, updateQuantity, updateCustomSpecs, clearCart } = useQuoteCart();
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [simulated, setSimulated] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setSubmitError('');

    startTransition(async () => {
      const response = await submitQuoteRequest({
        companyName,
        contactName,
        email,
        phone,
        message,
        items: cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          specifications: item.specifications
        }))
      });

      if (response.success) {
        setReferenceId(response.id || '');
        setSimulated(!!response.simulated);
        setSuccess(true);
        clearCart();
      } else {
        setSubmitError(response.error || "Failed to submit request.");
      }
    });
  };

  // If successfully submitted
  if (success) {
    return (
      <div className="bg-surface dark:bg-slate-900 transition-colors py-20 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-8 animate-fade-in-up">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle className="w-12 h-12" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-heading font-extrabold text-gray-900 dark:text-white">
              Quote Request Logged
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Thank you for submitting your custom B2B inquiry. Our medical logistics representatives will inspect your requirements and respond with a formal quote within 12 business hours.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-150/60 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-slate-700/60 pb-3">
              <span className="text-gray-400 font-semibold">Reference ID:</span>
              <span className="font-heading font-bold text-gray-900 dark:text-white">{referenceId}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-slate-700/60 pb-3">
              <span className="text-gray-400 font-semibold">Status:</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                Pending Review
              </span>
            </div>
            <p className="text-xs text-gray-450 leading-relaxed pt-2">
              A copy of this confirmation receipt along with device datasheet references has been compiled for our export sales office.
            </p>
          </div>

          {simulated && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl p-4 text-xs font-semibold flex items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>Simulated submission: Supabase database variables are not configured in your environment.</span>
            </div>
          )}

          <div className="pt-4">
            <Link
              href="/products"
              className="inline-flex justify-center items-center gap-1.5 px-6 py-3 bg-primary text-white hover:bg-opacity-95 rounded-full font-bold text-sm transition-all"
            >
              Return to Catalog
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface dark:bg-slate-900 transition-colors py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-gray-900 dark:text-white">
            Your Quote Request Basket
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
            Configure custom sizing or quantities for B2B medical dressings. Provide your business contact coordinates to submit.
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Hand: Cart Items Checklist */}
            <div className="lg:col-span-7 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-150/60 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-5"
                >
                  {/* Image */}
                  <div className="w-24 h-20 relative bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 dark:border-slate-750">
                    <Image
                      src={item.image_url || '/assets/favicon.png'}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  {/* Detail Inputs */}
                  <div className="flex-grow space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">{item.category}</span>
                        <h3 className="font-heading font-bold text-gray-900 dark:text-white text-lg">{item.name}</h3>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-accent p-1 rounded-lg transition-colors focus:outline-none"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    {/* Specs & Qty adjustments */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-gray-50 dark:border-slate-700/60">
                      
                      {/* Quantity display adjust */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-gray-650 dark:text-gray-200 flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-gray-800 dark:text-gray-200">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-gray-650 dark:text-gray-200 flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Specifications inline editor */}
                      <div className="flex-grow max-w-xs">
                        <input
                          type="text"
                          defaultValue={item.specifications || ''}
                          onBlur={(e) => updateCustomSpecs(item.id, e.target.value)}
                          placeholder="e.g. Dimensions: 10cm x 4m"
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-750 px-3 py-1.5 rounded-lg text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Hand: B2B Submission Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-5 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-150/60 dark:border-slate-700 shadow-md space-y-6">
              <h2 className="font-heading font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-slate-700/60 pb-4">
                <FileText className="w-5 h-5 text-primary dark:text-blue-400" />
                Contact Coordinates
              </h2>

              {submitError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400 text-xs p-4 rounded-xl font-medium">
                  {submitError}
                </div>
              )}

              {/* Company Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Company Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. European Care Ltd"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 text-gray-800 dark:text-gray-100 placeholder-gray-400"
                  />
                  <Building2 className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Contact Person Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Contact Person</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Dr. John Doe"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 text-gray-800 dark:text-gray-100 placeholder-gray-400"
                  />
                  <User className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Contact Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Corporate Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. procurement@healthcare.eu"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 text-gray-800 dark:text-gray-100 placeholder-gray-400"
                  />
                  <Mail className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Phone Number (Optional)</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +32 2 555 0199"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 text-gray-800 dark:text-gray-100 placeholder-gray-400"
                  />
                  <Phone className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Special Instructions</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Private label requirements, sterilization documentation, packaging preferences, or logistical notes..."
                  rows={4}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 text-gray-800 dark:text-gray-100 placeholder-gray-400"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 bg-primary hover:bg-blue-700 disabled:bg-blue-450 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer"
              >
                <Send className="w-4 h-4" />
                {isPending ? 'Logging Inquiry...' : 'Submit Quote Request'}
              </button>
            </form>

          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border border-gray-150/60 dark:border-slate-700 space-y-6">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 text-gray-400 flex items-center justify-center mx-auto shadow-inner">
              <FileText className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Basket is Empty</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                Browse our surgical dressing catalogue and select products to request wholesale pricing proposals.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex justify-center items-center gap-1.5 px-6 py-3 bg-primary text-white hover:bg-blue-700 rounded-full font-bold text-sm transition-all"
              >
                Explore Products
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
