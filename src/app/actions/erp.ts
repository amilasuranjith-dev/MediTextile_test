"use server";

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// --- RAW MATERIALS ---
export async function saveRawMaterial(
  id: string | null,
  materialData: {
    name: string;
    sku: string;
    stock_qty: number;
    unit: string;
    reorder_level: number;
  }
) {
  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured) {
    return { success: true, simulated: true };
  }

  try {
    const supabase = await createClient();
    let error;

    if (id) {
      const { error: err } = await supabase
        .from('raw_materials')
        .update({
          name: materialData.name,
          sku: materialData.sku,
          stock_qty: materialData.stock_qty,
          unit: materialData.unit,
          reorder_level: materialData.reorder_level,
        })
        .eq('id', id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from('raw_materials')
        .insert({
          name: materialData.name,
          sku: materialData.sku,
          stock_qty: materialData.stock_qty,
          unit: materialData.unit,
          reorder_level: materialData.reorder_level,
        });
      error = err;
    }

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteRawMaterial(id: string) {
  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured) {
    return { success: true, simulated: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('raw_materials').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// --- PRODUCTION BATCHES ---
export async function saveProductionBatch(
  id: string | null,
  batchData: {
    product_id: string;
    lot_number: string;
    quantity_produced: number;
    status: string;
  }
) {
  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured) {
    return { success: true, simulated: true };
  }

  try {
    const supabase = await createClient();
    let error;

    const payload: any = {
      product_id: batchData.product_id,
      lot_number: batchData.lot_number,
      quantity_produced: batchData.quantity_produced,
      status: batchData.status,
    };

    if (batchData.status === 'completed') {
      payload.completed_date = new Date().toISOString();
    }

    if (id) {
      const { error: err } = await supabase
        .from('production_batches')
        .update(payload)
        .eq('id', id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from('production_batches')
        .insert(payload);
      error = err;
    }

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// --- LOGISTICS / SHIPMENTS ---
export async function saveShipment(
  id: string | null,
  shipmentData: {
    quote_request_id: string;
    carrier: string;
    tracking_number: string;
    status: string;
    customs_documents?: string;
  }
) {
  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured) {
    return { success: true, simulated: true };
  }

  try {
    const supabase = await createClient();
    let error;

    const payload: any = {
      quote_request_id: shipmentData.quote_request_id,
      carrier: shipmentData.carrier,
      tracking_number: shipmentData.tracking_number,
      status: shipmentData.status,
      customs_documents: shipmentData.customs_documents || null,
    };

    if (shipmentData.status === 'shipped') {
      payload.shipped_at = new Date().toISOString();
    }

    if (id) {
      const { error: err } = await supabase
        .from('shipments')
        .update(payload)
        .eq('id', id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from('shipments')
        .insert(payload);
      error = err;
    }

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
