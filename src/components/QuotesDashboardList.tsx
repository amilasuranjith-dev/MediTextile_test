"use client";

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, Calendar, Trash2, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Clock, Archive } from 'lucide-react';
import { updateQuoteStatus, deleteQuote } from '@/app/actions/quotes';

interface QuoteItem {
  id: string;
  product_name: string;
  quantity: number;
  specifications: string | null;
}

interface QuoteRequest {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: string;
  created_at: string;
  items?: QuoteItem[];
}

interface QuotesDashboardListProps {
  initialQuotes: QuoteRequest[];
  isSimulated: boolean;
}

export default function QuotesDashboardList({ initialQuotes, isSimulated }: QuotesDashboardListProps) {
  const router = useRouter();
  const [quotes, setQuotes] = useState<QuoteRequest[]>(initialQuotes);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    startTransition(async () => {
      const result = await updateQuoteStatus(id, newStatus);
      if (result.success) {
        setQuotes(prev =>
          prev.map(q => (q.id === id ? { ...q, status: newStatus } : q))
        );
        router.refresh();
      } else {
        alert(result.error || "Failed to update status");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this quote request?")) return;
    
    startTransition(async () => {
      const result = await deleteQuote(id);
      if (result.success) {
        setQuotes(prev => prev.filter(q => q.id !== id));
        router.refresh();
      } else {
        alert(result.error || "Failed to delete quote");
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {isSimulated && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl p-4 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Showing simulated records. Live database edits are running locally in UI-only state.</span>
        </div>
      )}

      {quotes.length > 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-150/60 dark:border-slate-700 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-slate-700/60">
          {quotes.map((quote) => {
            const isExpanded = expandedId === quote.id;
            const formattedDate = new Date(quote.created_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });

            return (
              <div key={quote.id} className="transition-colors">
                
                {/* Header Line (always visible) */}
                <div
                  onClick={() => toggleExpand(quote.id)}
                  className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30"
                >
                  <div className="space-y-1.5 flex-grow">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-heading font-bold text-gray-900 dark:text-white text-base">
                        {quote.company_name}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        quote.status === 'pending'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          : quote.status === 'contacted'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      }`}>
                        {quote.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                      <span className="font-semibold text-gray-500 dark:text-gray-300">{quote.contact_name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formattedDate}</span>
                    </div>
                  </div>

                  {/* Right hand expand controls */}
                  <div className="flex items-center gap-3 ml-auto sm:ml-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleExpand(quote.id)}
                      className="text-gray-400 hover:text-primary dark:hover:text-blue-400 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
                      aria-label="Expand info"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    
                    <button
                      onClick={() => handleDelete(quote.id)}
                      className="text-gray-400 hover:text-accent p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                      aria-label="Delete request"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Drawer (details, items, and status updating) */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 bg-slate-50/50 dark:bg-slate-900/10 border-t border-gray-50 dark:border-slate-750 space-y-6">
                    
                    {/* Contacts & Messages Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div className="space-y-3.5 bg-white dark:bg-slate-800/60 p-4 rounded-xl border border-gray-100 dark:border-slate-750">
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Contact Coordinates</p>
                        <div className="space-y-2 text-gray-600 dark:text-gray-300">
                          <a href={`mailto:${quote.email}`} className="flex items-center gap-2 hover:text-primary dark:hover:text-blue-400 transition-colors">
                            <Mail className="w-4 h-4 text-gray-450" />
                            {quote.email}
                          </a>
                          {quote.phone && (
                            <p className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-450" />
                              {quote.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 bg-white dark:bg-slate-800/60 p-4 rounded-xl border border-gray-100 dark:border-slate-750">
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Client Inquiry Message</p>
                        <p className="text-gray-600 dark:text-gray-300 italic text-xs leading-relaxed">
                          {quote.message ? `"${quote.message}"` : "No special message provided."}
                        </p>
                      </div>
                    </div>

                    {/* Requested Items Checklist */}
                    <div className="bg-white dark:bg-slate-800/60 p-5 rounded-2xl border border-gray-100 dark:border-slate-750 space-y-4">
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Requested Products Basket</p>
                      
                      <div className="divide-y divide-gray-50 dark:divide-slate-750">
                        {quote.items && quote.items.length > 0 ? (
                          quote.items.map((item) => (
                            <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between gap-2">
                              <div className="space-y-1">
                                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{item.product_name}</p>
                                {item.specifications && (
                                  <p className="text-xs text-gray-400 dark:text-gray-500 italic">Custom Specs: {item.specifications}</p>
                                )}
                              </div>
                              <div className="text-sm font-bold text-gray-900 dark:text-white">
                                Quantity: {item.quantity} units
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-400 italic">No associated product listings.</p>
                        )}
                      </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-slate-750">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wider">Change Status:</span>
                        <div className="flex gap-1">
                          {['pending', 'contacted', 'fulfilled'].map((statusOption) => (
                            <button
                              key={statusOption}
                              onClick={() => handleUpdateStatus(quote.id, statusOption)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
                                quote.status === statusOption
                                  ? 'bg-primary text-white dark:bg-blue-600'
                                  : 'bg-slate-100 dark:bg-slate-700 text-gray-500 dark:text-gray-450 hover:bg-slate-200 dark:hover:bg-slate-650'
                              }`}
                            >
                              {statusOption}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-gray-150/60 dark:border-slate-700/60 space-y-4">
          <p className="text-lg text-gray-600 dark:text-gray-400 font-semibold">No B2B Inquiries Found</p>
          <p className="text-sm text-gray-400">All submitted customer quote requests will appear in this log.</p>
        </div>
      )}

    </div>
  );
}
