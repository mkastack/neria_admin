'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { Film, Image as ImageIcon, UploadCloud, Search, Trash2, Copy, Plus } from 'lucide-react';

export default function MediaLibraryPage() {
  const { addToast } = useAdmin();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [mediaItems, setMediaItems] = useState([
    { id: 'm-1', name: 'pink-bunny-hoodie-front.webp', type: 'Product Media', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80', size: '1.2 MB', date: 'Aug 26, 2026' },
    { id: 'm-2', name: 'strawberry-sweetheart-dress.webp', type: 'Product Media', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80', size: '1.8 MB', date: 'Aug 25, 2026' },
    { id: 'm-3', name: 'soft-girl-cardigan-pastel.webp', type: 'Lookbook', url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80', size: '940 KB', date: 'Aug 24, 2026' },
    { id: 'm-4', name: 'bow-obsessed-hair-set.webp', type: 'Accessories', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80', size: '1.5 MB', date: 'Aug 23, 2026' },
    { id: 'm-5', name: 'cozy-bunny-pajamas.webp', type: 'Product Media', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80', size: '820 KB', date: 'Aug 22, 2026' }
  ]);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    addToast({
      type: 'info',
      title: 'Media URL Copied',
      description: 'Direct CDN link copied to clipboard.'
    });
  };

  const handleDelete = (id: string) => {
    setMediaItems(prev => prev.filter(m => m.id !== id));
    addToast({
      type: 'info',
      title: 'Media Deleted',
      description: 'Asset removed from library storage.'
    });
  };

  const handleUploadMock = () => {
    addToast({
      type: 'success',
      title: 'Asset Uploaded ♡',
      description: 'Compressing and syncing to CDN…',
      crucial: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Media Library & CDN Assets</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Store lookbook high-resolution photography, promotional banners, and campaign clips.
          </p>
        </div>

        <button
          onClick={handleUploadMock}
          className="neria-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Media</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#F2F3F5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'Product Media', 'Lookbook', 'Accessories'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === tab
                  ? 'bg-[#FF4FA3] text-white shadow-xs'
                  : 'bg-[#F8F8FA] text-[#667085] hover:bg-[#FFF4F8]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#98A0AE] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media files..."
            className="w-full pl-9.5 pr-4 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] text-xs text-[#263550] outline-none"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {mediaItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-[#F2F3F5] overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="relative aspect-square bg-[#F8F8FA] overflow-hidden">
              <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleCopyUrl(item.url)}
                  className="p-1.5 rounded-lg bg-white/90 text-[#263550] hover:text-[#FF4FA3] shadow-xs cursor-pointer"
                  title="Copy URL"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg bg-white/90 text-[#B42318] hover:bg-[#FEF3F2] shadow-xs cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3">
              <p className="text-xs font-bold text-[#263550] truncate">{item.name}</p>
              <div className="flex items-center justify-between text-[10px] text-[#98A0AE] mt-1">
                <span>{item.type}</span>
                <span>{item.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
