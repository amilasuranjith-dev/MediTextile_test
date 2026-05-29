import React from 'react';
import { createClient } from '@/utils/supabase/server';
import ErpDashboardManager from '@/components/ErpDashboardManager';

async function fetchErpData() {
  let rawMaterials: any[] = [];
  let productionBatches: any[] = [];
  let shipments: any[] = [];
  let productsList: any[] = [];
  let quotesList: any[] = [];
  let isSimulated = false;

  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured) {
    // Return simulated lists for sandbox testing
    return {
      rawMaterials: [
        { id: "rm-1", name: "Raw Medical Grade Cotton", sku: "RAW-COTTON-01", stock_qty: 1250, unit: "kg", reorder_level: 200 },
        { id: "rm-2", name: "Elastic Crepe Spandex Yarn", sku: "SPANDEX-YARN-02", stock_qty: 45, unit: "kg", reorder_level: 80 }, // Alert: Understocked
        { id: "rm-3", name: "Sterile EO Indicators", sku: "STERILE-EO-IND", stock_qty: 2500, unit: "units", reorder_level: 500 }
      ],
      productionBatches: [
        { id: "pb-1", product_name: "Cotton Bandage", product_id: "1", lot_number: "LOT-904812", quantity_produced: 500, status: "completed", scheduled_date: new Date(Date.now() - 3600000 * 20).toISOString(), completed_date: new Date().toISOString() },
        { id: "pb-2", product_name: "Crepe Bandage", product_id: "2", lot_number: "LOT-112089", quantity_produced: 300, status: "in_progress", scheduled_date: new Date().toISOString(), completed_date: null }
      ],
      shipments: [
        { id: "s-1", company_name: "Ghent University Hospital", quote_request_id: "q-1", carrier: "DHL Ocean Cargo", tracking_number: "TRK-EXP-4890", status: "in_transit", shipped_at: new Date().toISOString() }
      ],
      productsList: [
        { id: "1", name: "Cotton Bandage" },
        { id: "2", name: "Crepe Bandage" }
      ],
      quotesList: [
        { id: "q-1", company_name: "Ghent University Hospital" }
      ],
      isSimulated: true
    };
  }

  try {
    const supabase = await createClient();

    // 1. Fetch raw materials
    const { data: rawData } = await supabase.from('raw_materials').select('*').order('name', { ascending: true });
    rawMaterials = rawData || [];

    // 2. Fetch production runs joined with products
    const { data: batchData } = await supabase
      .from('production_batches')
      .select(`
        *,
        products(name)
      `)
      .order('scheduled_date', { ascending: false });
    
    productionBatches = (batchData || []).map((b: any) => ({
      id: b.id,
      product_id: b.product_id,
      product_name: b.products ? b.products.name : 'Unknown Product',
      lot_number: b.lot_number,
      quantity_produced: b.quantity_produced,
      status: b.status,
      scheduled_date: b.scheduled_date,
      completed_date: b.completed_date
    }));

    // 3. Fetch shipments joined with quote requests
    const { data: shipData } = await supabase
      .from('shipments')
      .select(`
        *,
        quote_requests(company_name)
      `)
      .order('shipped_at', { ascending: false });

    shipments = (shipData || []).map((s: any) => ({
      id: s.id,
      quote_request_id: s.quote_request_id,
      company_name: s.quote_requests ? s.quote_requests.company_name : 'Unknown Customer',
      carrier: s.carrier,
      tracking_number: s.tracking_number,
      status: s.status,
      shipped_at: s.shipped_at
    }));

    // 4. Fetch list selectors
    const { data: simpleProds } = await supabase.from('products').select('id, name');
    productsList = simpleProds || [];

    const { data: simpleQuotes } = await supabase.from('quote_requests').select('id, company_name');
    quotesList = simpleQuotes || [];

  } catch (err) {
    console.error("Failed to load ERP server data", err);
    isSimulated = true;
  }

  return { rawMaterials, productionBatches, shipments, productsList, quotesList, isSimulated };
}

export default async function AdminErpPage() {
  const data = await fetchErpData();

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-extrabold text-gray-900 dark:text-white">
          Enterprise ERP Portal
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Internal management control center for raw materials stockpiles, manufacturing lot batch schedules, and container dispatch logistics.
        </p>
      </div>

      <ErpDashboardManager
        initialRawMaterials={data.rawMaterials}
        initialBatches={data.productionBatches}
        initialShipments={data.shipments}
        productsList={data.productsList}
        quotesList={data.quotesList}
        isSimulated={data.isSimulated}
      />
    </div>
  );
}
