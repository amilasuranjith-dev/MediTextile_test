"use server";

import { createClient } from '@/utils/supabase/server';

export async function submitQuoteRequest(formData: {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  message?: string;
  items: Array<{
    id: string;
    quantity: number;
    specifications?: string;
  }>;
}) {
  // Check if Supabase is configured
  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured) {
    console.warn("Supabase credentials not configured. Simulating quote submission.");
    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      simulated: true,
      id: "simulated-" + Math.random().toString(36).substring(2, 9),
    };
  }

  try {
    const supabase = await createClient();

    // 1. Insert into quote_requests
    const { data: requestData, error: requestError } = await supabase
      .from('quote_requests')
      .insert({
        company_name: formData.companyName,
        contact_name: formData.contactName,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message || null,
        status: 'pending'
      })
      .select()
      .single();

    if (requestError || !requestData) {
      console.error("Failed to insert quote request record", requestError);
      return { success: false, error: requestError?.message || "Failed to log quote request" };
    }

    const quoteRequestId = requestData.id;

    // 2. Prepare items for database insert
    // Note: If our product ID is a mock ID (like "1", "2"), we cannot insert it as a valid UUID in Supabase products reference
    // So we try to parse it, or check if it's a valid UUID. If not, we set it to NULL.
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    const itemsToInsert = formData.items.map(item => ({
      quote_request_id: quoteRequestId,
      product_id: uuidRegex.test(item.id) ? item.id : null,
      quantity: item.quantity,
      specifications: item.specifications || null
    }));

    // Insert into quote_request_items
    const { error: itemsError } = await supabase
      .from('quote_request_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error("Failed to insert items lists for request", itemsError);
    }

    return { success: true, id: quoteRequestId };
  } catch (err: any) {
    console.error("Quote submission catch block error", err);
    return { success: false, error: err?.message || "An unexpected error occurred during submission" };
  }
}

export async function updateQuoteStatus(id: string, status: string) {
  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured) {
    return { success: true, simulated: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('quote_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update status" };
  }
}

export async function deleteQuote(id: string) {
  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured) {
    return { success: true, simulated: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('quote_requests')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete quote request" };
  }
}
