'use client';

import React, { useState } from 'react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import {
  Film, Search, UploadCloud, Trash2, Image as ImageIcon, Check,
  Folder, Plus, AlertCircle, Copy
} from 'lucide-react';

export default function MediaLibraryPage() {
  const { mediaAssets, addMediaAsset, deleteMediaAsset } = useStorefrontCms();
  const [search, setSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadName, setUploadName] = useState('');
  const [uploadFolder, setUploadFolder] = useState('Campaigns');

  const folders = ['All', 'Campaigns', 'Categories', 'Marketing', 'Products'];

  const filteredAssets = mediaAssets.filter(asset => {
    const matchesFolder = selectedFolder === 'All' || asset.folder === selectedFolder;
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase()) || asset.altText.toLowerCase().includes(search.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl) return;
    addMediaAsset({
      name: uploadName || `asset_${Date.now()}.jpg`,
      url: uploadUrl,
      type: 'campaign',
      sizeBytes: 920000,
      width: 1600,
      height: 1200,
      folder: uploadFolder,
      altText: uploadName || 'Neria Media'
    });
    setUploadUrl('');
    setUploadName('');
    setIsUploadOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4F8] border border-[#FFD8EA] text-[#FF4FA3] text-xs font-bold uppercase tracking-wider mb-1.5">
            <Film className="w-3.5 h-3.5" />
            <span>Digital Asset Management</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#263550] tracking-tight">
            Media Library & Storefront Assets
          </h1>
          <p className="text-xs text-[#667085] mt-1">
            Central repository for campaign imagery, lookbook photography, category banners, and promo graphics.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FF4FA3] hover:bg-[#E63E90] text-white text-xs font-bold shadow-md shadow-[#FF4FA3]/25 transition-all"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Image</span>
        </button>
      </div>

      {/* Toolbar & Folders */}
      <div className="p-4 rounded-3xl bg-white border border-[#F2F3F5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#98A0AE]" />
          <input
            type="text"
            placeholder="Search media assets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {folders.map(f => (
            <button
              key={f}
              onClick={() => setSelectedFolder(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedFolder === f
                  ? 'bg-[#263550] text-white shadow-xs'
                  : 'bg-[#F8F8FA] text-[#667085] hover:bg-[#FFF4F8] hover:text-[#263550]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {filteredAssets.map(asset => (
          <div
            key={asset.id}
            className="group rounded-3xl overflow-hidden bg-white border border-[#F2F3F5] hover:border-[#FFD8EA] hover:shadow-lg transition-all duration-300 flex flex-col"
          >
            {/* Image Thumbnail */}
            <div className="aspect-4/3 overflow-hidden relative bg-[#F8F8FA]">
              <img
                src={asset.url}
                alt={asset.altText}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/90 backdrop-blur-xs text-[#263550]">
                {asset.folder}
              </span>
            </div>

            {/* Meta */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h4 className="text-xs font-bold text-[#263550] truncate">{asset.name}</h4>
                <div className="flex items-center justify-between text-[10px] text-[#98A0AE] mt-1">
                  <span>{asset.width}×{asset.height} px</span>
                  <span>{(asset.sizeBytes / 1024 / 1024).toFixed(1)} MB</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F8F8FA] flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[#FF4FA3] bg-[#FFF4F8] px-2 py-0.5 rounded-full border border-[#FFD8EA]">
                  Used on {asset.usedInCount}
                </span>

                <button
                  onClick={() => deleteMediaAsset(asset.id)}
                  title="Delete Image"
                  className="p-1 rounded-lg text-[#98A0AE] hover:text-[#B42318] hover:bg-[#FEF3F2] transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#101828]/50 backdrop-blur-xs" onClick={() => setIsUploadOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 space-y-4 border border-[#F2F3F5]">
            <h3 className="text-base font-bold text-[#263550]">Upload Website Media Asset</h3>
            <form onSubmit={handleUploadSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#263550] mb-1">Image URL / CDN Link</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={uploadUrl}
                  onChange={e => setUploadUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#263550] mb-1">Asset Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Capsule Lookbook 01"
                  value={uploadName}
                  onChange={e => setUploadName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#263550] mb-1">Folder</label>
                <select
                  value={uploadFolder}
                  onChange={e => setUploadFolder(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7]"
                >
                  <option value="Campaigns">Campaigns</option>
                  <option value="Categories">Categories</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Products">Products</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#667085] hover:bg-[#F8F8FA] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#FF4FA3] hover:bg-[#E63E90] rounded-xl shadow-xs"
                >
                  Add to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
