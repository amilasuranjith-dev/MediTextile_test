"use client";

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Factory, Archive, Truck, Plus, Trash2, ShieldAlert, CheckCircle2, ChevronRight, AlertTriangle, FileText, Info, X } from 'lucide-react';
import { saveRawMaterial, deleteRawMaterial, saveProductionBatch, saveShipment } from '@/app/actions/erp';

interface RawMaterial {
  id: string;
  name: string;
  sku: string;
  stock_qty: number;
  unit: string;
  reorder_level: number;
}

interface ProductionBatch {
  id: string;
  product_name: string;
  product_id: string;
  lot_number: string;
  quantity_produced: number;
  status: string;
  scheduled_date: string;
  completed_date: string | null;
}

interface ShipmentLog {
  id: string;
  company_name: string;
  quote_request_id: string;
  carrier: string;
  tracking_number: string;
  status: string;
  shipped_at: string | null;
}

interface ErpDashboardManagerProps {
  initialRawMaterials: RawMaterial[];
  initialBatches: ProductionBatch[];
  initialShipments: ShipmentLog[];
  productsList: Array<{ id: string; name: string }>;
  quotesList: Array<{ id: string; company_name: string }>;
  isSimulated: boolean;
}

export default function ErpDashboardManager({
  initialRawMaterials,
  initialBatches,
  initialShipments,
  productsList,
  quotesList,
  isSimulated,
}: ErpDashboardManagerProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'inventory' | 'production' | 'logistics'>('inventory');
  const [isPending, startTransition] = useTransition();

  // State Lists
  const [materials, setMaterials] = useState<RawMaterial[]>(initialRawMaterials);
  const [batches, setBatches] = useState<ProductionBatch[]>(initialBatches);
  const [shipments, setShipments] = useState<ShipmentLog[]>(initialShipments);

  // Modal / Form triggers
  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState<'material' | 'batch' | 'shipment'>('material');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields - Material
  const [matName, setMatName] = useState('');
  const [matSku, setMatSku] = useState('');
  const [matStock, setMatStock] = useState(0);
  const [matUnit, setMatUnit] = useState('kg');
  const [matReorder, setMatReorder] = useState(10);

  // Form Fields - Production Batch
  const [batchProdId, setBatchProdId] = useState(productsList[0]?.id || '');
  const [batchLot, setBatchLot] = useState('');
  const [batchQty, setBatchQty] = useState(100);
  const [batchStatus, setBatchStatus] = useState('scheduled');

  // Form Fields - Shipment
  const [shipQuoteId, setShipQuoteId] = useState(quotesList[0]?.id || '');
  const [shipCarrier, setShipCarrier] = useState('DHL Global Forwarding');
  const [shipTracking, setShipTracking] = useState('');
  const [shipStatus, setShipStatus] = useState('preparing');

  // Open Handlers
  const handleOpenMaterial = (mat?: RawMaterial) => {
    setFormType('material');
    if (mat) {
      setEditingId(mat.id);
      setMatName(mat.name);
      setMatSku(mat.sku);
      setMatStock(mat.stock_qty);
      setMatUnit(mat.unit);
      setMatReorder(mat.reorder_level);
    } else {
      setEditingId(null);
      setMatName('');
      setMatSku('RAW-' + Math.random().toString(36).substring(2, 7).toUpperCase());
      setMatStock(100);
      setMatUnit('kg');
      setMatReorder(20);
    }
    setFormOpen(true);
  };

  const handleOpenBatch = () => {
    setFormType('batch');
    setEditingId(null);
    setBatchProdId(productsList[0]?.id || '');
    setBatchLot('LOT-' + Date.now().toString().slice(-6) + '-' + Math.floor(Math.random() * 100));
    setBatchQty(500);
    setBatchStatus('scheduled');
    setFormOpen(true);
  };

  const handleOpenShipment = () => {
    setFormType('shipment');
    setEditingId(null);
    setShipQuoteId(quotesList[0]?.id || '');
    setShipCarrier('DHL Express');
    setShipTracking('TRK-' + Math.random().toString(36).substring(2, 9).toUpperCase());
    setShipStatus('preparing');
    setFormOpen(true);
  };

  // Submit Handlers
  const handleMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const response = await saveRawMaterial(editingId, {
        name: matName,
        sku: matSku,
        stock_qty: matStock,
        unit: matUnit,
        reorder_level: matReorder,
      });

      if (response.success) {
        if (editingId) {
          setMaterials(prev => prev.map(m => m.id === editingId ? { ...m, name: matName, sku: matSku, stock_qty: matStock, unit: matUnit, reorder_level: matReorder } : m));
        } else {
          setMaterials(prev => [...prev, { id: 'sim-' + Math.random(), name: matName, sku: matSku, stock_qty: matStock, unit: matUnit, reorder_level: matReorder }]);
        }
        setFormOpen(false);
        router.refresh();
      } else {
        alert(response.error || "Failed to save raw material");
      }
    });
  };

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const response = await saveProductionBatch(null, {
        product_id: batchProdId,
        lot_number: batchLot,
        quantity_produced: batchQty,
        status: batchStatus,
      });

      if (response.success) {
        const prodName = productsList.find(p => p.id === batchProdId)?.name || 'Product';
        setBatches(prev => [
          ...prev,
          {
            id: 'sim-' + Math.random(),
            product_id: batchProdId,
            product_name: prodName,
            lot_number: batchLot,
            quantity_produced: batchQty,
            status: batchStatus,
            scheduled_date: new Date().toISOString(),
            completed_date: batchStatus === 'completed' ? new Date().toISOString() : null,
          },
        ]);
        setFormOpen(false);
        router.refresh();
      } else {
        alert(response.error || "Failed to save production batch");
      }
    });
  };

  const handleShipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const response = await saveShipment(null, {
        quote_request_id: shipQuoteId,
        carrier: shipCarrier,
        tracking_number: shipTracking,
        status: shipStatus,
      });

      if (response.success) {
        const companyName = quotesList.find(q => q.id === shipQuoteId)?.company_name || 'Client';
        setShipments(prev => [
          ...prev,
          {
            id: 'sim-' + Math.random(),
            quote_request_id: shipQuoteId,
            company_name: companyName,
            carrier: shipCarrier,
            tracking_number: shipTracking,
            status: shipStatus,
            shipped_at: shipStatus === 'shipped' ? new Date().toISOString() : null,
          },
        ]);
        setFormOpen(false);
        router.refresh();
      } else {
        alert(response.error || "Failed to save shipment");
      }
    });
  };

  const handleDeleteMaterial = (id: string) => {
    if (!confirm("Are you sure you want to delete this raw material item?")) return;
    startTransition(async () => {
      const response = await deleteRawMaterial(id);
      if (response.success) {
        setMaterials(prev => prev.filter(m => m.id !== id));
        router.refresh();
      }
    });
  };

  const handleCompleteBatchState = (batchId: string) => {
    startTransition(async () => {
      const batch = batches.find(b => b.id === batchId);
      if (!batch) return;
      const response = await saveProductionBatch(batchId, {
        product_id: batch.product_id,
        lot_number: batch.lot_number,
        quantity_produced: batch.quantity_produced,
        status: 'completed',
      });
      if (response.success) {
        setBatches(prev => prev.map(b => b.id === batchId ? { ...b, status: 'completed', completed_date: new Date().toISOString() } : b));
        router.refresh();
      }
    });
  };

  const handleCompleteShipmentState = (shipId: string, status: string) => {
    startTransition(async () => {
      const ship = shipments.find(s => s.id === shipId);
      if (!ship) return;
      const response = await saveShipment(shipId, {
        quote_request_id: ship.quote_request_id,
        carrier: ship.carrier,
        tracking_number: ship.tracking_number,
        status: status,
      });
      if (response.success) {
        setShipments(prev => prev.map(s => s.id === shipId ? { ...s, status: status, shipped_at: status === 'shipped' ? new Date().toISOString() : s.shipped_at } : s));
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {isSimulated && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl p-4 text-xs font-semibold flex items-center gap-2">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>Supabase variables are missing. Running ERP system in simulated sandbox view.</span>
        </div>
      )}

      {/* Tabs Layout */}
      <div className="flex border-b border-gray-200 dark:border-slate-700 gap-4 text-sm font-bold">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-4 px-2 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'inventory'
              ? 'border-primary text-primary dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Archive className="w-4 h-4" />
          Raw Materials Inventory
        </button>
        <button
          onClick={() => setActiveTab('production')}
          className={`pb-4 px-2 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'production'
              ? 'border-primary text-primary dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Factory className="w-4 h-4" />
          Manufacturing Batch Runs
        </button>
        <button
          onClick={() => setActiveTab('logistics')}
          className={`pb-4 px-2 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'logistics'
              ? 'border-primary text-primary dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Truck className="w-4 h-4" />
          Logistics & Container Shipping
        </button>
      </div>

      {/* TAB 1: INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-150/60 dark:border-slate-700 shadow-sm">
            <div>
              <h2 className="font-heading font-extrabold text-base text-gray-900 dark:text-white">Raw Materials Stock Control</h2>
              <p className="text-xs text-gray-400 mt-1">Track thread yarns, bleached wool weights, and indicators stock levels.</p>
            </div>
            <button
              onClick={() => handleOpenMaterial()}
              className="inline-flex items-center gap-1 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Material
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-150/60 dark:border-slate-700 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700/60 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Material SKU</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Available Qty</th>
                  <th className="p-4">Reorder Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60 text-sm">
                {materials.map((mat) => {
                  const understocked = mat.stock_qty <= mat.reorder_level;
                  return (
                    <tr key={mat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                      <td className="p-4 pl-6 font-semibold text-gray-900 dark:text-white">{mat.sku}</td>
                      <td className="p-4 text-xs font-semibold">{mat.name}</td>
                      <td className="p-4 font-bold text-xs">
                        {mat.stock_qty} {mat.unit}
                      </td>
                      <td className="p-4">
                        {understocked ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5" /> Reorder Triggered
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Optimal Stock</span>
                        )}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleOpenMaterial(mat)}
                            className="text-gray-400 hover:text-primary dark:hover:text-blue-400 text-xs font-bold"
                          >
                            Adjust
                          </button>
                          <button
                            onClick={() => handleDeleteMaterial(mat.id)}
                            className="text-gray-400 hover:text-accent p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTION */}
      {activeTab === 'production' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-150/60 dark:border-slate-700 shadow-sm">
            <div>
              <h2 className="font-heading font-extrabold text-base text-gray-900 dark:text-white">Active Manufacturing Batches</h2>
              <p className="text-xs text-gray-400 mt-1">Schedule production runs and verify lot-number assignments for quality assurance tracking.</p>
            </div>
            <button
              onClick={handleOpenBatch}
              className="inline-flex items-center gap-1 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Schedule Batch
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-150/60 dark:border-slate-700 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700/60 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Lot Number</th>
                  <th className="p-4">Dressing Model</th>
                  <th className="p-4">Target Quantity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60 text-sm">
                {batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-gray-900 dark:text-white">{batch.lot_number}</td>
                    <td className="p-4 text-xs font-semibold">{batch.product_name}</td>
                    <td className="p-4 font-bold text-xs">{batch.quantity_produced} rolls</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        batch.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : batch.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 animate-pulse'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                      }`}>
                        {batch.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {batch.status !== 'completed' && (
                        <button
                          onClick={() => handleCompleteBatchState(batch.id)}
                          className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-[10px] font-bold tracking-wide uppercase transition-colors cursor-pointer"
                        >
                          Complete Run
                        </button>
                      )}
                      {batch.status === 'completed' && (
                        <span className="text-[10px] text-gray-400">Completed {new Date(batch.completed_date!).toLocaleDateString()}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LOGISTICS */}
      {activeTab === 'logistics' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-150/60 dark:border-slate-700 shadow-sm">
            <div>
              <h2 className="font-heading font-extrabold text-base text-gray-900 dark:text-white">Shipping & Dispatch tracking</h2>
              <p className="text-xs text-gray-400 mt-1">Manage carrier routes, sea containers to Europe, and export custom documents.</p>
            </div>
            <button
              onClick={handleOpenShipment}
              className="inline-flex items-center gap-1 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Log Shipment
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-150/60 dark:border-slate-700 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700/60 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Client Order</th>
                  <th className="p-4">Carrier</th>
                  <th className="p-4">Tracking Number</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60 text-sm">
                {shipments.map((ship) => (
                  <tr key={ship.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-gray-900 dark:text-white">{ship.company_name}</td>
                    <td className="p-4 text-xs font-semibold">{ship.carrier}</td>
                    <td className="p-4 font-semibold text-xs text-gray-450 dark:text-gray-300">{ship.tracking_number || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        ship.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : ship.status === 'shipped' || ship.status === 'in_transit'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 animate-pulse'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                      }`}>
                        {ship.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {ship.status === 'preparing' && (
                        <button
                          onClick={() => handleCompleteShipmentState(ship.id, 'shipped')}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-650 text-white rounded text-[10px] font-bold tracking-wide uppercase transition-colors cursor-pointer"
                        >
                          Mark Shipped
                        </button>
                      )}
                      {ship.status === 'shipped' && (
                        <button
                          onClick={() => handleCompleteShipmentState(ship.id, 'delivered')}
                          className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-[10px] font-bold tracking-wide uppercase transition-colors cursor-pointer"
                        >
                          Mark Delivered
                        </button>
                      )}
                      {ship.status === 'delivered' && (
                        <span className="text-[10px] text-gray-400">Delivered {ship.shipped_at ? new Date(ship.shipped_at).toLocaleDateString() : ''}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dynamic Overlay Form Editor Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-150/60 dark:border-slate-700 shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            
            {/* Modal Header */}
            <div className="h-16 px-6 bg-slate-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700/60 flex justify-between items-center">
              <h3 className="font-heading font-extrabold text-base text-gray-900 dark:text-white">
                {formType === 'material' ? (editingId ? 'Edit Raw Material' : 'Add Raw Material') : formType === 'batch' ? 'Schedule Production Batch' : 'Log Order Shipment'}
              </h3>
              <button
                onClick={() => setFormOpen(false)}
                className="text-gray-400 hover:text-primary dark:hover:text-blue-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM 1: RAW MATERIAL */}
            {formType === 'material' && (
              <form onSubmit={handleMaterialSubmit} className="p-6 space-y-4 text-sm">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Material Name</label>
                  <input
                    type="text"
                    required
                    value={matName}
                    onChange={(e) => setMatName(e.target.value)}
                    placeholder="e.g. Bleached Gauze Loom Roll"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-250 dark:border-slate-750 px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">SKU Code</label>
                    <input
                      type="text"
                      required
                      value={matSku}
                      onChange={(e) => setMatSku(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-250 dark:border-slate-750 px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Inventory Unit</label>
                    <input
                      type="text"
                      required
                      value={matUnit}
                      onChange={(e) => setMatUnit(e.target.value)}
                      placeholder="e.g. kg, rolls"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-250 dark:border-slate-750 px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Initial Stock Qty</label>
                    <input
                      type="number"
                      required
                      value={matStock}
                      onChange={(e) => setMatStock(parseFloat(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-250 dark:border-slate-750 px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Reorder Level Threshold</label>
                    <input
                      type="number"
                      required
                      value={matReorder}
                      onChange={(e) => setMatReorder(parseFloat(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-250 dark:border-slate-750 px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <div className="pt-4 flex gap-3 border-t border-gray-100 dark:border-slate-700/60">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-5 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Save Material
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 text-gray-500 dark:text-white rounded-xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* FORM 2: PRODUCTION BATCH */}
            {formType === 'batch' && (
              <form onSubmit={handleBatchSubmit} className="p-6 space-y-4 text-sm">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Select Dressing Model</label>
                  <select
                    value={batchProdId}
                    onChange={(e) => setBatchProdId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-250 dark:border-slate-750 px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                  >
                    {productsList.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Batch Lot Number</label>
                  <input
                    type="text"
                    required
                    value={batchLot}
                    onChange={(e) => setBatchLot(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-250 dark:border-slate-750 px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Target Output Qty (rolls)</label>
                    <input
                      type="number"
                      required
                      value={batchQty}
                      onChange={(e) => setBatchQty(parseInt(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-250 dark:border-slate-750 px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Initial Status</label>
                    <select
                      value={batchStatus}
                      onChange={(e) => setBatchStatus(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-250 dark:border-slate-750 px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed (Instantly logs to finished inventory)</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex gap-3 border-t border-gray-100 dark:border-slate-700/60">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-5 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Schedule Batch Run
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 text-gray-500 dark:text-white rounded-xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* FORM 3: SHIPMENT */}
            {formType === 'shipment' && (
              <form onSubmit={handleShipmentSubmit} className="p-6 space-y-4 text-sm">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Select Client Order Request</label>
                  <select
                    value={shipQuoteId}
                    onChange={(e) => setShipQuoteId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-250 dark:border-slate-750 px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                  >
                    {quotesList.map(q => (
                      <option key={q.id} value={q.id}>{q.company_name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Logistics Carrier</label>
                  <input
                    type="text"
                    required
                    value={shipCarrier}
                    onChange={(e) => setShipCarrier(e.target.value)}
                    placeholder="e.g. DHL Ocean Freight"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-250 dark:border-slate-750 px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Container / Air Tracking Code</label>
                    <input
                      type="text"
                      required
                      value={shipTracking}
                      onChange={(e) => setShipTracking(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-250 dark:border-slate-750 px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Status</label>
                    <select
                      value={shipStatus}
                      onChange={(e) => setShipStatus(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-250 dark:border-slate-750 px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                    >
                      <option value="preparing">Preparing Cargo</option>
                      <option value="shipped">Shipped (Departed SL Port)</option>
                      <option value="in_transit">In Transit (Sea/Air freight)</option>
                      <option value="delivered">Delivered to hospital</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex gap-3 border-t border-gray-100 dark:border-slate-700/60">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-5 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Save Shipment Log
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 text-gray-500 dark:text-white rounded-xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
