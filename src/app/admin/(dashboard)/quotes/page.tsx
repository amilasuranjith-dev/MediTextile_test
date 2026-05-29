import React from 'react';
import { createClient } from '@/utils/supabase/server';
import QuotesDashboardList from '@/components/QuotesDashboardList';

async function fetchQuotes() {
  let quotes: any[] = [];
  let isSimulated = false;

  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured) {
    return {
      quotes: [
        {
          id: "sim-q1",
          company_name: "Ghent University Hospital",
          contact_name: "Dr. Jan Dupont",
          email: "j.dupont@uzgent.be",
          phone: "+32 9 332 1111",
          message: "Require documentation detailing biological compatibility for cotton crepe bandages.",
          status: "pending",
          created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
          items: [
            { id: "sim-item-1", product_name: "Crepe Bandage", quantity: 500, specifications: "Size: 10cm x 4m" },
            { id: "sim-item-2", product_name: "Cotton Bandage", quantity: 200, specifications: "Size: 7.5cm x 4m" }
          ]
        },
        {
          id: "sim-q2",
          company_name: "Sanita Care Distribution",
          contact_name: "Marie Dubois",
          email: "m.dubois@sanitacare.fr",
          phone: "+33 1 4567 8900",
          message: "Requesting immediate shipping rates to Paris central hospital units.",
          status: "fulfilled",
          created_at: new Date(Date.now() - 3600000 * 25).toISOString(),
          items: [
            { id: "sim-item-3", product_name: "Surgical Cotton Wool", quantity: 1500, specifications: "Weight: 500g rolls" }
          ]
        }
      ],
      isSimulated: true
    };
  }

  try {
    const supabase = await createClient();

    // Query quote requests and join on items and products
    const { data, error } = await supabase
      .from('quote_requests')
      .select(`
        *,
        items:quote_request_items(
          id,
          quantity,
          specifications,
          product_id,
          products(name)
        )
      `)
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error("Failed to query quote requests from Supabase", error);
      isSimulated = true;
    } else {
      quotes = data.map((quote: any) => ({
        id: quote.id,
        company_name: quote.company_name,
        contact_name: quote.contact_name,
        email: quote.email,
        phone: quote.phone,
        message: quote.message,
        status: quote.status,
        created_at: quote.created_at,
        items: (quote.items || []).map((item: any) => ({
          id: item.id,
          product_name: item.products ? item.products.name : 'Unknown Product',
          quantity: item.quantity,
          specifications: item.specifications
        }))
      }));
    }
  } catch (err) {
    console.error("Quotes fetch try-catch block error", err);
    isSimulated = true;
  }

  if (isSimulated && quotes.length === 0) {
    // If catch error occurred and we had no simulated data
    quotes = [
      {
        id: "sim-q1",
        company_name: "Ghent University Hospital (Failed DB)",
        contact_name: "Dr. Jan Dupont",
        email: "j.dupont@uzgent.be",
        phone: "+32 9 332 1111",
        message: "Require documentation detailing biological compatibility for cotton crepe bandages.",
        status: "pending",
        created_at: new Date().toISOString(),
        items: [
          { id: "sim-item-1", product_name: "Crepe Bandage", quantity: 500, specifications: "Size: 10cm x 4m" }
        ]
      }
    ];
  }

  return { quotes, isSimulated };
}

export default async function AdminQuotesPage() {
  const { quotes, isSimulated } = await fetchQuotes();

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-extrabold text-gray-900 dark:text-white">
          Quote Requests Log
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Review, expand, manage workflow statuses, and delete incoming B2B medical supply inquiries.
        </p>
      </div>

      <QuotesDashboardList initialQuotes={quotes} isSimulated={isSimulated} />
    </div>
  );
}
