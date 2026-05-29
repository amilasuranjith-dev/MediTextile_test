import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Briefcase, FileText, CheckCircle2, ChevronRight, AlertCircle, Clock } from 'lucide-react';

async function getDashboardData() {
  let stats = { totalProducts: 5, pendingQuotes: 1, fulfilledQuotes: 1 };
  let recentQuotes: any[] = [];
  let isSimulated = false;

  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured) {
    isSimulated = true;
    recentQuotes = [
      {
        id: "sim-q1",
        company_name: "Ghent University Hospital",
        contact_name: "Dr. Jan Dupont",
        email: "j.dupont@uzgent.be",
        phone: "+32 9 332 1111",
        status: "pending",
        created_at: new Date(Date.now() - 3600000 * 3).toISOString() // 3 hours ago
      },
      {
        id: "sim-q2",
        company_name: "Sanita Care Distribution",
        contact_name: "Marie Dubois",
        email: "m.dubois@sanitacare.fr",
        phone: "+33 1 4567 8900",
        status: "fulfilled",
        created_at: new Date(Date.now() - 3600000 * 25).toISOString() // 25 hours ago
      }
    ];
    return { stats, recentQuotes, isSimulated };
  }

  try {
    const supabase = await createClient();

    // Fetch counts
    const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
    const { count: pendingCount } = await supabase.from('quote_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending');
    const { count: fulfilledCount } = await supabase.from('quote_requests').select('*', { count: 'exact', head: true }).eq('status', 'fulfilled');

    // Fetch recent 5 quotes
    const { data: requestData } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    stats = {
      totalProducts: prodCount || 0,
      pendingQuotes: pendingCount || 0,
      fulfilledQuotes: fulfilledCount || 0
    };
    recentQuotes = requestData || [];

  } catch (err) {
    console.error("Failed to load dashboard data", err);
    isSimulated = true;
  }

  return { stats, recentQuotes, isSimulated };
}

export default async function AdminDashboardPage() {
  const { stats, recentQuotes, isSimulated } = await getDashboardData();

  return (
    <div className="space-y-10 animate-fade-in-up">
      
      {/* Welcome Banner */}
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-extrabold text-gray-900 dark:text-white">
          Overview Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Real-time metrics, active catalogue counts, and pending B2B quote inquiries.
        </p>
      </div>

      {/* Database Setup Status Banner */}
      {isSimulated && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-2xl p-5 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Supabase Sandbox Mode</p>
            <p className="text-xs text-gray-650 dark:text-gray-400 leading-relaxed">
              The database parameters are not set. The dashboard is demonstrating simulated B2B records. Insert Supabase settings in `.env.local` to connect your active server.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Products */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-150/60 dark:border-slate-700 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-400/10 text-primary dark:text-blue-400 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Products</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.totalProducts}</p>
          </div>
        </div>

        {/* Pending Inquiries */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-150/60 dark:border-slate-700 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Pending Quotes</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.pendingQuotes}</p>
          </div>
        </div>

        {/* Fulfilled Inquiries */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-150/60 dark:border-slate-700 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Fulfilled Quotes</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{stats.fulfilledQuotes}</p>
          </div>
        </div>

      </div>

      {/* Two Column details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Recent Quote Inquiries (2/3 width) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-150/60 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-700 pb-4">
            <h2 className="font-heading font-extrabold text-lg text-gray-900 dark:text-white">
              Recent B2B Inquiries
            </h2>
            <Link
              href="/admin/quotes"
              className="inline-flex items-center gap-1 text-xs text-primary dark:text-blue-400 font-bold hover:underline"
            >
              Manage quotes
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-50 dark:divide-slate-750">
            {recentQuotes.length > 0 ? (
              recentQuotes.map((quote) => (
                <div key={quote.id} className="py-4.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900 dark:text-white text-base">{quote.company_name}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{quote.contact_name}</span>
                      <span>•</span>
                      <span>{quote.email}</span>
                      <span>•</span>
                      <span>{new Date(quote.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      quote.status === 'pending'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                    }`}>
                      {quote.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-xs py-4">No recent inquiries recorded.</p>
            )}
          </div>
        </div>

        {/* Right Side: Quick Action Panel (1/3 width) */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-150/60 dark:border-slate-700 shadow-sm space-y-6">
          <h2 className="font-heading font-extrabold text-lg text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-700 pb-4">
            Quick Actions
          </h2>
          <div className="flex flex-col gap-3">
            <Link
              href="/admin/products"
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-gray-700 dark:text-white font-bold text-sm rounded-xl text-center transition-colors block"
            >
              Add New Product
            </Link>
            <Link
              href="/admin/quotes"
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-gray-700 dark:text-white font-bold text-sm rounded-xl text-center transition-colors block"
            >
              Review Open Quotes
            </Link>
            <div className="pt-4 border-t border-gray-50 dark:border-slate-700/60 space-y-2 text-xs text-gray-400">
              <p className="font-bold uppercase tracking-wider text-[10px]">Setup checklist</p>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Next.js App initialized</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Public routes configured</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Admin controls constructed</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
