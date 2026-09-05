'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { Modal } from '@/src/components/ui/Modal';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Plus, Layers, Sparkles, Image as ImageIcon, ArrowRight, Edit, Trash2 } from 'lucide-react';
import { Collection } from '@/src/lib/types';

export default function CollectionsPage() {
  const { collections, setCollections, addToast } = useAdmin();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Collection Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80');

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCol: Collection = {
      id: `col-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/ /g, '-'),
      description: description || 'Exclusive lookbook collection.',
      coverImage: coverImage,
      bannerImage: coverImage,
      productsCount: 0,
      status: 'Active',
      sales: 0,
      revenue: 0,
      updatedAt: new Date().toISOString(),
      productIds: []
    };

    setCollections([newCol, ...collections]);
    setIsCreateModalOpen(false);
    setName('');
    setDescription('');
    addToast({
      type: 'success',
      title: 'Collection Created ♡',
      description: `${name} has been published to storefront lookbooks.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Collections & Lookbooks</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Organize outfits into curated drops, aesthetic aesthetics, and seasonal campaigns.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="neria-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="bg-white rounded-3xl border border-[#F2F3F5] overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              {/* Cover Image Banner */}
              <div className="relative h-48 w-full bg-[#F8F8FA] overflow-hidden">
                <img
                  src={col.coverImage}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <StatusBadge status={col.status} />
                </div>
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-white/90 backdrop-blur-md text-xs font-bold text-[#263550] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#FF4FA3]" />
                  <span>{col.productsCount} Products</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-2">
                <h3 className="text-lg font-bold text-[#263550] group-hover:text-[#FF4FA3] transition-colors">
                  {col.name}
                </h3>
                <p className="text-xs text-[#667085] line-clamp-2 leading-relaxed">
                  {col.description}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-3 mt-3 border-t border-[#F2F3F5] text-xs">
                  <div>
                    <span className="text-[#98A0AE]">Total Orders</span>
                    <p className="font-bold text-[#263550]">{col.sales} units sold</p>
                  </div>
                  <div>
                    <span className="text-[#98A0AE]">Revenue</span>
                    <p className="font-bold text-[#FF4FA3]">$ {col.revenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 px-5 border-t border-[#F2F3F5] bg-[#F8F8FA]/60 flex items-center justify-between">
              <span className="text-[11px] text-[#98A0AE]">
                Updated {new Date(col.updatedAt).toLocaleDateString()}
              </span>
              <Link
                href={`/admin/products`}
                className="text-xs font-bold text-[#FF4FA3] hover:underline inline-flex items-center gap-1"
              >
                Manage Items <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Create Collection Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Lookbook Collection"
        subtitle="Group matching apparel for storefront merchandising"
      >
        <form onSubmit={handleCreateCollection} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Collection Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Strawberry Sweetheart Drop"
              className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Story & Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the romantic aesthetic and inspiration..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Cover Image URL</label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#F2F3F5] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#DDE1E7] text-xs font-semibold text-[#667085]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="neria-btn-primary px-5 py-2 text-xs font-semibold cursor-pointer"
            >
              Create Lookbook ♡
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
