'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/src/lib/context/AdminContext';
import {
  ChevronLeft, UploadCloud, Plus, Trash2, Check,
  Sparkles, DollarSign, Boxes, Layers, Image as ImageIcon,
  Tag, Eye, Save
} from 'lucide-react';
import { Product, ProductVariant } from '@/src/lib/types';
import { createProduct } from '@/src/lib/firebase/products';

export default function AddProductPage() {
  const router = useRouter();
  const { addToast } = useAdmin();

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [category, setCategory] = useState<'Dresses' | 'Tops' | 'Sets' | 'Accessories' | 'Hoodies' | 'Other'>('Hoodies');
  const [collection, setCollection] = useState('Bunny Love');
  const [status, setStatus] = useState<'Active' | 'Draft' | 'Archived'>('Active');
  
  // Pricing
  const [price, setPrice] = useState<number>(420);
  const [comparePrice, setComparePrice] = useState<number>(480);
  const [cost, setCost] = useState<number>(190);

  // Profit calculation
  const profit = Math.max(0, price - cost);
  const margin = price > 0 ? ((profit / price) * 100).toFixed(1) : '0';

  // Inventory
  const [sku, setSku] = useState('NER-NEW-001');
  const [stock, setStock] = useState<number>(25);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(8);
  const [trackQuantity, setTrackQuantity] = useState<boolean>(true);
  const [allowBackorder, setAllowBackorder] = useState<boolean>(false);

  // Media
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
    'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Variants
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L']);
  const [selectedColors, setSelectedColors] = useState<string[]>(['Baby Pink', 'Cream']);

  const allSizes = ['XS', 'S', 'M', 'L', 'XL'];
  const allColors = ['Baby Pink', 'Cream', 'Powder Blue', 'Strawberry Blush', 'Midnight Navy'];

  const toggleSize = (s: string) => {
    setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const toggleColor = (c: string) => {
    setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  // Generate combinations
  const variantCombinations = selectedColors.flatMap(color =>
    selectedSizes.map(size => ({
      name: `${color} / ${size}`,
      sku: `${sku}-${color.substring(0, 3).toUpperCase()}-${size}`,
      price: price,
      stock: 10
    }))
  );

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImages(prev => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveProduct = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      addToast({
        type: 'error',
        title: 'Product Name Required',
        description: 'Please provide a title for your product.'
      });
      return;
    }

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');

    const newProd: Omit<Product, 'id'> = {
      name,
      slug,
      description: description || 'Beautiful piece from Neria Collective.',
      shortDescription: shortDescription || 'Signature Neria style apparel.',
      category,
      collection,
      price: Number(price) || 0,
      compareAtPrice: Number(comparePrice) || undefined,
      cost: Number(cost) || 0,
      sku: sku || `NER-${Date.now()}`,
      stock: Number(stock) || 0,
      lowStockThreshold: Number(lowStockThreshold) || 5,
      trackQuantity,
      allowBackorder,
      status,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80'],
      variants: variantCombinations.map((v, i) => ({
        id: `v-${Date.now()}-${i}`,
        size: v.name.split('/')[1]?.trim() || 'M',
        color: v.name.split('/')[0]?.trim() || 'Baby Pink',
        sku: v.sku,
        price: v.price,
        cost: Number(cost) || 0,
        stock: v.stock,
        status: v.stock > 0 ? 'In Stock' : 'Out of Stock'
      })),
      tags: ['New Arrival', collection],
      salesCount: 0,
      revenue: 0,
      rating: 5.0,
      reviewsCount: 0,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    try {
      await createProduct(newProd);
      addToast({
        type: 'success',
        title: 'Product Published ♡',
        description: `${name} has been added to your live store catalog.`
      });
      router.push('/admin/products');
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save failed',
        description: err instanceof Error ? err.message : 'Could not save to Firestore.',
      });
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl bg-white border border-[#DDE1E7] text-[#667085] hover:text-[#FF4FA3] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#263550]">Add New Product</h1>
            <p className="text-xs text-[#98A0AE]">Create a new lookbook piece with photos, pricing, and variants</p>
          </div>
        </div>

        {/* Desktop Save Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setStatus('Draft');
              handleSaveProduct();
            }}
            className="neria-btn-secondary px-4 py-2 text-xs font-semibold"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => {
              setStatus('Active');
              handleSaveProduct();
            }}
            className="neria-btn-primary px-5 py-2 text-xs font-semibold cursor-pointer"
          >
            Publish Product ♡
          </button>
        </div>
      </div>

      {/* Main Grid: Left 2 Cols (Details) / Right 1 Col (Settings & Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#263550]">Basic Information</h3>

            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pink Bunny Oversized Hoodie"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] focus:border-[#FFD8EA] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Short Description (Subtitle)</label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="e.g. Ultra-plush fleece with custom bunny ear embroidery."
                className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Detailed Description & Care Guide</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail fabric composition, silhouette notes, styling tips, and laundry guidelines..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
              />
            </div>
          </div>

          {/* Media Drag & Drop */}
          <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#263550]">Product Media & Lookbook Photos</h3>
              <span className="text-xs text-[#98A0AE]">{images.length} images added</span>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-[#F2F3F5] group">
                  <img src={img} alt="Product" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-[#B42318] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#FF4FA3] text-white text-[10px] font-bold">
                      Cover
                    </span>
                  )}
                </div>
              ))}

              {/* Add image URL tile */}
              <div className="aspect-square rounded-2xl border-2 border-dashed border-[#DDE1E7] hover:border-[#FFD8EA] flex flex-col items-center justify-center p-3 text-center transition-colors">
                <UploadCloud className="w-6 h-6 text-[#FF4FA3] mb-1" />
                <span className="text-[11px] font-semibold text-[#263550]">Add Media</span>
                <span className="text-[9px] text-[#98A0AE]">PNG, JPG, WebP</span>
              </div>
            </div>

            {/* Quick URL Input for test media */}
            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste image URL (e.g. Unsplash fashion photo)..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="neria-btn-secondary px-3 py-1.5 text-xs font-semibold"
              >
                Add Image
              </button>
            </div>
          </div>

          {/* Pricing & Profit Calculation */}
          <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#263550]">Pricing & Profit Margins</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#263550] mb-1">Selling Price ($) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-sm font-bold text-[#263550] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#667085] mb-1">Compare-at Price ($)</label>
                <input
                  type="number"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-sm text-[#667085] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#667085] mb-1">Cost per Item ($)</label>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-sm text-[#667085] outline-none"
                />
              </div>
            </div>

            {/* Profit Margin Auto-Calculation Card */}
            <div className="p-4 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[11px] text-[#98A0AE] font-medium">Profit per Unit</p>
                <p className="text-base font-extrabold text-[#263550]">$ {profit}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#98A0AE] font-medium">Gross Margin</p>
                <p className="text-base font-extrabold text-[#FF4FA3]">{margin}%</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[11px] text-[#98A0AE] font-medium">Discount Offer</p>
                <p className="text-base font-bold text-[#027A48]">
                  {comparePrice > price ? `Save $ ${comparePrice - price}` : 'Full Price'}
                </p>
              </div>
            </div>
          </div>

          {/* Variants Generator (Sizes & Colors) */}
          <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#263550]">Product Variants</h3>

            {/* Size Selector */}
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-2">Available Sizes</label>
              <div className="flex flex-wrap gap-2">
                {allSizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSize(s)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      selectedSizes.includes(s)
                        ? 'bg-[#FF4FA3] text-white shadow-xs'
                        : 'bg-[#F8F8FA] text-[#667085] border border-[#DDE1E7]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-2">Available Colors</label>
              <div className="flex flex-wrap gap-2">
                {allColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleColor(c)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      selectedColors.includes(c)
                        ? 'bg-[#263550] text-white shadow-xs'
                        : 'bg-[#F8F8FA] text-[#667085] border border-[#DDE1E7]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Variant Combination Table */}
            <div className="mt-4 pt-4 border-t border-[#F2F3F5]">
              <h4 className="text-xs font-bold text-[#667085] uppercase tracking-wider mb-2">
                Generated Combinations ({variantCombinations.length})
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#F2F3F5] text-[#98A0AE]">
                      <th className="py-2">Variant</th>
                      <th className="py-2">SKU</th>
                      <th className="py-2">Price</th>
                      <th className="py-2">Initial Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F8F8FA]">
                    {variantCombinations.map((v, idx) => (
                      <tr key={idx}>
                        <td className="py-2 font-bold text-[#263550]">{v.name}</td>
                        <td className="py-2 text-[#98A0AE]">{v.sku}</td>
                        <td className="py-2 font-semibold">$ {v.price}</td>
                        <td className="py-2 text-[#027A48] font-bold">{v.stock} units</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col (Status, Category, Inventory Controls) */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#263550]">Publishing Status</h3>
            <div className="space-y-2">
              {(['Active', 'Draft', 'Archived'] as const).map((st) => (
                <label
                  key={st}
                  className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-colors ${
                    status === st ? 'bg-[#FFF4F8] border-[#FFD8EA] text-[#FF4FA3] font-bold' : 'border-[#F2F3F5] text-[#667085]'
                  }`}
                >
                  <span className="text-xs">{st}</span>
                  <input
                    type="radio"
                    name="status"
                    checked={status === st}
                    onChange={() => setStatus(st)}
                    className="accent-[#FF4FA3]"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Category & Collection Assignment */}
          <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#263550]">Organization</h3>

            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Apparel Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] bg-white outline-none"
              >
                <option value="Hoodies">Hoodies</option>
                <option value="Dresses">Dresses</option>
                <option value="Tops">Tops</option>
                <option value="Accessories">Accessories</option>
                <option value="Sets">Sets & Loungewear</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Collection</label>
              <select
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] bg-white outline-none"
              >
                <option value="Bunny Love">Bunny Love</option>
                <option value="Strawberry Girl">Strawberry Girl</option>
                <option value="Soft Girl">Soft Girl</option>
                <option value="Bow Obsessed">Bow Obsessed</option>
                <option value="Cozy Bunny">Cozy Bunny</option>
              </select>
            </div>
          </div>

          {/* Inventory Controls */}
          <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#263550]">Inventory Tracking</h3>

            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Master SKU</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#263550] mb-1">Initial Units</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#263550] mb-1">Low Stock Alert</label>
                <input
                  type="number"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#F2F3F5] space-y-2">
              <label className="flex items-center justify-between text-xs text-[#344054] cursor-pointer">
                <span>Track Quantity Automatically</span>
                <input
                  type="checkbox"
                  checked={trackQuantity}
                  onChange={(e) => setTrackQuantity(e.target.checked)}
                  className="accent-[#FF4FA3]"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-[#344054] cursor-pointer">
                <span>Allow Customer Backorders</span>
                <input
                  type="checkbox"
                  checked={allowBackorder}
                  onChange={(e) => setAllowBackorder(e.target.checked)}
                  className="accent-[#FF4FA3]"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile / Floating Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-[#F2F3F5] p-4 lg:hidden flex items-center justify-between gap-3 shadow-lg">
        <button
          type="button"
          onClick={() => {
            setStatus('Draft');
            handleSaveProduct();
          }}
          className="flex-1 neria-btn-secondary py-2.5 text-xs font-bold"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={() => {
            setStatus('Active');
            handleSaveProduct();
          }}
          className="flex-1 neria-btn-primary py-2.5 text-xs font-bold cursor-pointer"
        >
          Publish Product ♡
        </button>
      </div>
    </div>
  );
}
