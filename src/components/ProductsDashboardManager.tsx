"use client";

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Edit2, Trash2, ShieldCheck, X, FileText, PlusCircle, MinusCircle, AlertCircle, Search } from 'lucide-react';
import { saveProduct, deleteProduct } from '@/app/actions/products';
import { Product } from '@/utils/mockData';

interface ProductsDashboardManagerProps {
  initialProducts: Product[];
  isSimulated: boolean;
}

export default function ProductsDashboardManager({ initialProducts, isSimulated }: ProductsDashboardManagerProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();

  // Form Editor States
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // null = create, string = edit
  
  // Editor form values
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Bandages');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSterile, setIsSterile] = useState(false);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState<Array<{ label: string; value: string }>>([
    { label: 'Material', value: '100% Cotton' }
  ]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!editingId) {
      // Auto-generate slug from name during creation
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleAddSpecRow = () => {
    setSpecifications(prev => [...prev, { label: '', value: '' }]);
  };

  const handleRemoveSpecRow = (idx: number) => {
    setSpecifications(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSpecChange = (idx: number, field: 'label' | 'value', val: string) => {
    setSpecifications(prev =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  };

  const handleCertChange = (certName: string) => {
    setCertifications(prev =>
      prev.includes(certName)
        ? prev.filter(c => c !== certName)
        : [...prev, certName]
    );
  };

  const openCreateEditor = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setCategory('Bandages');
    setDescription('');
    setImageUrl('');
    setIsSterile(false);
    setCertifications(['CE', 'ISO 13485']);
    setSpecifications([{ label: 'Material', value: '100% Cotton' }]);
    setEditorOpen(true);
  };

  const openEditEditor = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setSlug(product.slug);
    setCategory(product.category);
    setDescription(product.description);
    setImageUrl(product.image_url || '');
    setIsSterile(product.is_sterile);
    setCertifications(product.certifications || []);
    setSpecifications(product.specifications || []);
    setEditorOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    startTransition(async () => {
      const response = await saveProduct(editingId, {
        name,
        slug,
        category,
        description,
        specifications,
        image_url: imageUrl,
        is_sterile: isSterile,
        certifications
      });

      if (response.success) {
        if (editingId) {
          // Edit update in list
          setProducts(prev =>
            prev.map(p =>
              p.id === editingId
                ? { ...p, name, slug, category, description, specifications, image_url: imageUrl, is_sterile: isSterile, certifications }
                : p
            )
          );
        } else {
          // Insert simulation item added
          const simulatedNewId = response.simulated ? "sim-p" + Math.random().toString(36).substring(2, 7) : "real-added-id";
          setProducts(prev => [
            ...prev,
            { id: editingId || simulatedNewId, name, slug, category, description, specifications, image_url: imageUrl, is_sterile: isSterile, certifications }
          ]);
        }
        setEditorOpen(false);
        router.refresh();
      } else {
        alert(response.error || "Failed to save product details");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this product from the database?")) return;

    startTransition(async () => {
      const response = await deleteProduct(id);
      if (response.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        router.refresh();
      } else {
        alert(response.error || "Failed to delete product");
      }
    });
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {isSimulated && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl p-4 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Showing simulated records. Database updates are running in mock state.</span>
        </div>
      )}

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-150/60 dark:border-slate-700 shadow-sm">
        
        {/* Search */}
        <div className="relative max-w-sm flex-grow">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalog items..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 pl-10 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
        </div>

        {/* Add Product button */}
        <button
          onClick={openCreateEditor}
          className="inline-flex justify-center items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-primary/15 transition-all transform hover:scale-[1.01] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>

      </div>

      {/* Products table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-150/60 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700/60 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Sterility</th>
                <th className="p-4">Certifications</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60 text-sm">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    {/* Thumbnail + Name */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-12 relative bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden border border-gray-100 dark:border-slate-750 flex-shrink-0">
                          <Image
                            src={product.image_url || '/assets/favicon.png'}
                            alt={product.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-base">{product.name}</p>
                          <p className="text-[10px] text-gray-400 leading-none mt-1">Slug: {product.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 text-xs font-semibold text-gray-600 dark:text-gray-300">
                      {product.category}
                    </td>

                    {/* Sterility */}
                    <td className="p-4">
                      {product.is_sterile ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Sterile
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Non-Sterile</span>
                      )}
                    </td>

                    {/* Certifications */}
                    <td className="p-4 text-xs text-gray-450 dark:text-gray-400 font-semibold">
                      {product.certifications.join(', ')}
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditEditor(product)}
                          className="text-gray-400 hover:text-primary dark:hover:text-blue-400 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
                          aria-label="Edit details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-gray-400 hover:text-accent p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                          aria-label="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400">
                    No products matching search parameters found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Overlay Form Editor Modal */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-150/60 dark:border-slate-700 shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
            
            {/* Modal Header */}
            <div className="h-16 px-6 bg-slate-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700/60 flex justify-between items-center">
              <h3 className="font-heading font-extrabold text-base text-gray-900 dark:text-white">
                {editingId ? 'Edit Product Details' : 'Add New Dressing Product'}
              </h3>
              <button
                onClick={() => setEditorOpen(false)}
                className="text-gray-400 hover:text-primary dark:hover:text-blue-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scroll Workspace Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[75vh] space-y-5 text-sm">
              
              {/* Product name & category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Product Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={handleNameChange}
                    placeholder="e.g. Cotton Bandage Reel"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-250 dark:border-slate-750 px-4 py-2.5 rounded-xl text-xs text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-250 dark:border-slate-750 px-4 py-2.5 rounded-xl text-xs text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Bandages">Bandages</option>
                    <option value="Cotton Products">Cotton Products</option>
                    <option value="Gauze Products">Gauze Products</option>
                  </select>
                </div>
              </div>

              {/* Slug string */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">URL Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="e.g. cotton-bandage-reel"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-250 dark:border-slate-750 px-4 py-2.5 rounded-xl text-xs text-gray-850 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Insert core product parameters, dimensions options, and package listings..."
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-250 dark:border-slate-750 px-4 py-2.5 rounded-xl text-xs text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Image URL & Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Image Asset URL</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="e.g. /assets/cotton-bandage.png"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-250 dark:border-slate-750 px-4 py-2.5 rounded-xl text-xs text-gray-850 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                {imageUrl && (
                  <div className="border border-gray-100 dark:border-slate-750 rounded-xl p-2 bg-slate-50 dark:bg-slate-900/60 flex items-center gap-3">
                    <div className="w-14 h-12 relative rounded overflow-hidden bg-white dark:bg-slate-800 flex-shrink-0">
                      <img src={imageUrl} alt="Thumbnail preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <span className="text-[10px] text-gray-400">Preview Layout</span>
                  </div>
                )}
              </div>

              {/* Checklist flags (Sterile, Certs) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-gray-100 dark:border-slate-750">
                {/* Sterile Toggle */}
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Sterility Status</span>
                  <label className="inline-flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSterile}
                      onChange={(e) => setIsSterile(e.target.checked)}
                      className="rounded border-gray-300 dark:border-slate-600 text-primary focus:ring-primary w-4.5 h-4.5"
                    />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Device is Sterile EO Grade</span>
                  </label>
                </div>
                
                {/* Certifications checklist */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Active Certifications</span>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {['CE', 'ISO 13485', 'BP Standards'].map(cert => (
                      <label key={cert} className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={certifications.includes(cert)}
                          onChange={() => handleCertChange(cert)}
                          className="rounded border-gray-300 dark:border-slate-600 text-primary focus:ring-primary w-4 h-4"
                        />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{cert}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Specifications Sub-Table Section */}
              <div className="space-y-3.5 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-gray-150/80 dark:border-slate-750">
                <div className="flex justify-between items-center border-b border-gray-150/60 dark:border-slate-700 pb-2">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Specifications Matrix</span>
                  <button
                    type="button"
                    onClick={handleAddSpecRow}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-primary dark:text-blue-400 hover:underline"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Add Row
                  </button>
                </div>

                <div className="space-y-2">
                  {specifications.map((spec, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        required
                        value={spec.label}
                        onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                        placeholder="Label (e.g. Size)"
                        className="w-1/3 bg-white dark:bg-slate-800 border border-gray-250 dark:border-slate-700 px-3 py-1.5 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        required
                        value={spec.value}
                        onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                        placeholder="Value (e.g. 10cm x 4m)"
                        className="flex-grow bg-white dark:bg-slate-800 border border-gray-250 dark:border-slate-700 px-3 py-1.5 rounded-lg text-xs"
                      />
                      {specifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecRow(idx)}
                          className="text-gray-400 hover:text-accent p-1.5 transition-colors"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit panel */}
              <div className="pt-4 flex gap-3 border-t border-gray-100 dark:border-slate-700/60">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-3 bg-primary hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-primary/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  {isPending ? 'Saving details...' : 'Save Product'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-gray-700 dark:text-white rounded-xl font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
