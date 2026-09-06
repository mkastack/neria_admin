'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { Modal } from '@/src/components/ui/Modal';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Plus, Layers, Sparkles, Image as ImageIcon, ArrowRight, Edit, Trash2, UploadCloud, Loader2 } from 'lucide-react';
import { Collection } from '@/src/lib/types';
import { upsertCollection, deleteCollection } from '@/src/lib/firebase/collections';
import { uploadMedia } from '@/src/lib/firebase/media';

export default function CollectionsPage() {
  const { collections, addToast } = useAdmin();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Collection Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const asset = await uploadMedia({
        file,
        name: file.name,
        altText: name || file.name,
        folder: 'Collections',
        type: 'image'
      });
      if (asset?.url) {
        setCoverImage(asset.url);
        addToast({
          type: 'success',
          title: 'Cover Image Uploaded ♡',
          description: 'Image saved to cloud storage.'
        });
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Upload Failed',
        description: err instanceof Error ? err.message : 'Could not upload image.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const newCol: Collection = {
      id: `col-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
      description: description || 'Exclusive lookbook collection from Neria Collective.',
      coverImage: coverImage,
      bannerImage: coverImage,
      productsCount: 0,
      status: 'Active',
      sales: 0,
      revenue: 0,
      updatedAt: new Date().toISOString(),
      productIds: []
    };

    try {
      await upsertCollection(newCol);
      setIsCreateModalOpen(false);
      setName('');
      setDescription('');
      addToast({
        type: 'success',
        title: 'Collection Created ♡',
        description: `${name} has been published to live Firestore lookbooks.`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        description: err instanceof Error ? err.message : 'Could not save collection.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCollection = async (id: string, colName: string) => {
    if (!confirm(`Delete collection "${colName}"?`)) return;
    try {
      await deleteCollection(id);
      addToast({
        type: 'info',
        title: 'Collection Deleted',
        description: `${colName} was removed from Firestore.`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        description: err instanceof Error ? err.message : 'Could not delete collection.'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Collections & Lookbooks</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Curate aesthetic outfit drops and lookbooks synchronized live with Firestore.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="neria-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Collection</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-[#F2F3F5] text-xs text-[#98A0AE]">
            No collections found in Firestore. Click "Create Collection" to launch your first lookbook!
          </div>
        ) : (
          collections.map((col) => (
            <div
              key={col.id}
              className="bg-white rounded-3xl border border-[#F2F3F5] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-4/3 overflow-hidden bg-[#FFF4F8]">
                  <img
                    src={col.coverImage}
                    alt={col.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <StatusBadge status={col.status} />
                    <button
                      onClick={() => handleDeleteCollection(col.id, col.name)}
                      className="p-1.5 rounded-full bg-white/90 text-[#B42318] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs hover:bg-white"
                      title="Delete collection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-[#263550]">{col.name}</h3>
                  <p className="text-xs text-[#667085] line-clamp-2">{col.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-[#F2F3F5] flex items-center justify-between text-xs text-[#98A0AE]">
                  <span>{col.productsCount || 0} Lookbook pieces</span>
                  <Link
                    href={`/admin/products?collection=${encodeURIComponent(col.name)}`}
                    className="text-[#FF4FA3] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>View items</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Collection Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Lookbook Collection"
          subtitle="Group matching apparel for storefront merchandising and live lookbooks."
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Story & Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the romantic aesthetic and inspiration..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Cover Image</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Paste image URL..."
                  className="flex-1 px-3 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
                />
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="neria-btn-secondary px-3 py-2 text-xs font-semibold cursor-pointer inline-flex items-center gap-1"
                >
                  {isUploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <UploadCloud className="w-3.5 h-3.5" />
                  )}
                  <span>Upload File</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {coverImage && (
                <div className="h-28 rounded-xl overflow-hidden border border-[#F2F3F5]">
                  <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#F2F3F5] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#DDE1E7] text-xs font-semibold text-[#667085] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className="neria-btn-primary px-5 py-2 text-xs font-semibold cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Lookbook ♡</span>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
