'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/src/lib/context/AdminContext';
import {
  ChevronLeft, UploadCloud, Trash2,
  Image as ImageIcon, Eye, Save, Loader2, Plus, ArrowLeft
} from 'lucide-react';
import { Product } from '@/src/lib/types';
import { getProduct, updateProduct } from '@/src/lib/firebase/products';
import { uploadMedia } from '@/src/lib/firebase/media';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/lib/firebase/client';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToast } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [category, setCategory] = useState<'Dresses' | 'Tops' | 'Sets' | 'Accessories' | 'Hoodies' | 'Other'>('Hoodies');
  const [collection, setCollection] = useState('Core Lookbook');
  const [status, setStatus] = useState<'Active' | 'Draft' | 'Archived'>('Active');

  // Pricing
  const [price, setPrice] = useState<number | ''>('');
  const [comparePrice, setComparePrice] = useState<number | ''>('');
  const [cost, setCost] = useState<number | ''>('');

  // Inventory
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState<number | ''>(0);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  const [trackQuantity, setTrackQuantity] = useState<boolean>(true);
  const [allowBackorder, setAllowBackorder] = useState<boolean>(false);

  // Media
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Variants
  const [variants, setVariants] = useState<Product['variants']>([]);

  // Real-time listener for this specific product
  useEffect(() => {
    if (!resolvedParams.id) return;
    setIsLoading(true);

    const unsub = onSnapshot(
      doc(db, 'products', resolvedParams.id),
      (snap) => {
        if (!snap.exists()) {
          addToast({
            type: 'error',
            title: 'Product not found',
            description: 'This product does not exist in Firestore.',
          });
          setIsLoading(false);
          return;
        }

        const data = snap.data();
        const pPrice = typeof data.price === 'number' ? data.price : (typeof data.priceCents === 'number' ? data.priceCents / 100 : 0);
        const pCompare = typeof data.compareAtPrice === 'number' ? data.compareAtPrice : (typeof data.compareAtPriceCents === 'number' ? data.compareAtPriceCents / 100 : '');

        setName(data.name || '');
        setSlug(data.slug || '');
        setDescription(data.description || '');
        setShortDescription(data.shortDescription || '');
        setCategory(data.category || 'Hoodies');
        setCollection(data.collection || 'Core Lookbook');
        setStatus(data.status || 'Active');
        setPrice(pPrice);
        setComparePrice(pCompare);
        setCost(typeof data.cost === 'number' ? data.cost : '');
        setSku(data.sku || '');
        setStock(typeof data.stock === 'number' ? data.stock : 0);
        setLowStockThreshold(typeof data.lowStockThreshold === 'number' ? data.lowStockThreshold : 5);
        setTrackQuantity(data.trackQuantity !== false);
        setAllowBackorder(!!data.allowBackorder);
        setImages(Array.isArray(data.images) ? data.images : []);
        setVariants(Array.isArray(data.variants) ? data.variants : []);
        setIsLoading(false);
      },
      (err) => {
        console.warn('[product edit] Listener error:', err);
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, [resolvedParams.id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    let uploadedCount = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        const asset = await uploadMedia({
          file,
          name: file.name,
          altText: name || file.name,
          folder: 'Products',
          type: 'image',
        });

        if (asset?.url) {
          setImages((prev) => [...prev, asset.url]);
          uploadedCount++;
        }
      }

      if (uploadedCount > 0) {
        addToast({
          type: 'success',
          title: 'Photo Uploaded ♡',
          description: `${uploadedCount} image${uploadedCount > 1 ? 's' : ''} added to product gallery.`,
        });
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Upload Failed',
        description: err instanceof Error ? err.message : 'Could not upload image.',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      addToast({
        type: 'error',
        title: 'Product Title Required',
        description: 'Please specify a title for this piece.',
      });
      return;
    }

    setIsSaving(true);
    try {
      await updateProduct(resolvedParams.id, {
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
        description: description.trim(),
        shortDescription: shortDescription.trim(),
        category,
        collection,
        status,
        price: Number(price) || 0,
        compareAtPrice: Number(comparePrice) || undefined,
        cost: Number(cost) || 0,
        sku: sku.trim(),
        stock: Number(stock) || 0,
        lowStockThreshold: Number(lowStockThreshold) || 5,
        trackQuantity,
        allowBackorder,
        images,
        variants,
      });

      addToast({
        type: 'success',
        title: 'Product Updated ♡',
        description: `Changes to "${name}" are now live on neria-commerce.vercel.app.`,
      });
      router.push('/admin/products');
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        description: err instanceof Error ? err.message : 'Could not update product in Firestore.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 text-[#FF4FA3] animate-spin" />
          <p className="text-xs text-[#98A0AE] font-semibold">Loading product details…</p>
        </div>
      </div>
    );
  }

  const liveStoreUrl = `https://neria-commerce.vercel.app/product/${slug || resolvedParams.id}`;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl bg-white border border-[#DDE1E7] text-[#667085] hover:text-[#FF4FA3] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#263550]">{name || 'Edit Product'}</h1>
            <p className="text-xs text-[#98A0AE]">Manage details, photos, and stock on the live storefront</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href={liveStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="neria-btn-secondary px-3.5 py-2 text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live</span>
          </a>

          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className="neria-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Basic Info & Media */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
          <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#263550]">Product Information</h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#263550]">Title / Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Silk Blossom Maxi Dress"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-sm focus:outline-none focus:border-[#FF4FA3]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#263550]">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="silk-blossom-maxi-dress"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-sm focus:outline-none focus:border-[#FF4FA3]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#263550]">SKU (Stock Keeping Unit)</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="NER-SLK-001"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-sm focus:outline-none focus:border-[#FF4FA3]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#263550]">Short Subheading</label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief one-line summary for product cards"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-sm focus:outline-none focus:border-[#FF4FA3]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#263550]">Full Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write detailed product details, fabric composition, and sizing advice..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-sm focus:outline-none focus:border-[#FF4FA3] resize-y"
              />
            </div>
          </div>

          {/* Media Gallery */}
          <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#263550]">Product Photos</h2>
                <p className="text-xs text-[#98A0AE]">Upload genuine product images or paste photo URLs</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="neria-btn-secondary px-3.5 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                <span>Upload Photos</span>
              </button>
            </div>

            {/* Images Grid */}
            {images.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#FFD8EA] rounded-2xl p-8 text-center bg-[#FFF4F8]/40 hover:bg-[#FFF4F8] transition-colors cursor-pointer"
              >
                <ImageIcon className="w-8 h-8 text-[#FF4FA3] mx-auto mb-2" />
                <p className="text-xs font-bold text-[#263550]">No photos uploaded yet</p>
                <p className="text-[11px] text-[#98A0AE] mt-0.5">Click here to select and upload photos from your computer</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-[#F2F3F5] bg-[#F8F8FA]">
                    <img src={img} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1.5 rounded-lg bg-white/90 text-[#B42318] hover:bg-white transition-colors"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {idx === 0 && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/60 text-white backdrop-blur-xs">
                        Main Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* External URL Input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Or paste an image URL..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs focus:outline-none focus:border-[#FF4FA3]"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="neria-btn-secondary px-3.5 py-2 text-xs font-semibold"
              >
                Add URL
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Pricing, Inventory & Organization */}
        <div className="space-y-6">
          {/* Status & Category */}
          <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#263550]">Organization</h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#263550]">Catalog Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-xs font-medium focus:outline-none focus:border-[#FF4FA3]"
              >
                <option value="Active">Active (Live in Store)</option>
                <option value="Draft">Draft (Hidden)</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#263550]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-xs font-medium focus:outline-none focus:border-[#FF4FA3]"
              >
                <option value="Hoodies">Hoodies</option>
                <option value="Dresses">Dresses</option>
                <option value="Tops">Tops</option>
                <option value="Sets">Sets</option>
                <option value="Accessories">Accessories</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#263550]">Collection</label>
              <input
                type="text"
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                placeholder="e.g. Summer Lookbook"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-xs focus:outline-none focus:border-[#FF4FA3]"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#263550]">Pricing (USD)</h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#263550]">Retail Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0.00"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-sm font-semibold focus:outline-none focus:border-[#FF4FA3]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#263550]">Compare At / Original Price ($)</label>
              <input
                type="number"
                value={comparePrice}
                onChange={(e) => setComparePrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Optional strike-through price"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-sm focus:outline-none focus:border-[#FF4FA3]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#263550]">Unit Cost ($)</label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Cost of production"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-sm focus:outline-none focus:border-[#FF4FA3]"
              />
            </div>
          </div>

          {/* Stock & Warehouse */}
          <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#263550]">Inventory Units</h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#263550]">Total Stock Count</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-sm font-semibold focus:outline-none focus:border-[#FF4FA3]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#263550]">Low Stock Warning Threshold</label>
              <input
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                placeholder="5"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-sm focus:outline-none focus:border-[#FF4FA3]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
