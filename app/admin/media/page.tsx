'use client';

import React, { useState, useRef } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { ConfirmModal } from '@/src/components/ui/ConfirmModal';
import { useMediaAssets, uploadMedia, deleteMedia } from '@/src/lib/firebase/media';
import { Film, Image as ImageIcon, UploadCloud, Search, Trash2, Copy, Loader2, Sparkles } from 'lucide-react';

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function MediaLibraryPage() {
  const { addToast } = useAdmin();
  const { assets, loading } = useMediaAssets();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    addToast({
      type: 'info',
      title: 'Media URL Copied',
      description: 'Direct CDN link copied to clipboard.'
    });
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    const { id, url } = pendingDelete;
    try {
      await deleteMedia(id, url);
      addToast({
        type: 'info',
        title: 'Media Deleted',
        description: 'Asset removed from library storage.'
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        description: err.message || 'Could not delete media.'
      });
    } finally {
      setPendingDelete(null);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const isVideo = file.type.startsWith('video');
        await uploadMedia({
          file,
          name: file.name,
          altText: file.name.replace(/\.[^/.]+$/, ''),
          folder: activeTab === 'All' ? 'Uploads' : activeTab,
          type: isVideo ? 'video' : 'image',
        });
        successCount++;
      } catch (err: any) {
        addToast({
          type: 'error',
          title: `Upload Failed: ${file.name}`,
          description: err.message || 'Upload error'
        });
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (successCount > 0) {
      addToast({
        type: 'success',
        title: 'Asset Uploaded ♡',
        description: `Uploaded ${successCount} file(s) to cloud storage and media library.`,
        crucial: true
      });
    }
  };

  const filteredAssets = assets.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.altText && item.altText.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'All') return matchesSearch;
    if (activeTab === 'Images') return matchesSearch && item.type === 'image';
    if (activeTab === 'Videos') return matchesSearch && item.type === 'video';
    return matchesSearch && item.folder.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550] flex items-center gap-2">
            <span>Media Library & CDN Assets</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Storage
            </span>
          </h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Store lookbook high-resolution photography, promotional banners, product images, and campaign clips.
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="neria-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading…</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" />
              <span>Upload Media</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#F2F3F5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'Images', 'Videos', 'Uploads', 'Lookbook', 'Products'].map((tab) => (
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
      {loading ? (
        <div className="py-16 text-center text-xs text-[#98A0AE] flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#FF4FA3]" />
          <span>Loading assets from Firebase Storage & Firestore…</span>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#F2F3F5] shadow-xs">
          <ImageIcon className="w-10 h-10 text-[#FF4FA3]/40 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#263550]">No media assets found</h3>
          <p className="text-xs text-[#667085] mt-1 max-w-sm mx-auto">
            {searchQuery ? `No files matching "${searchQuery}".` : 'Upload product photos, campaign graphics, and lookbook images directly into cloud storage.'}
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 px-4 py-2 bg-[#FFF4F8] text-[#FF4FA3] hover:bg-[#FFE8F2] border border-[#FFD2E5] rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Your First Asset</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAssets.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-[#F2F3F5] overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="relative aspect-square bg-[#F8F8FA] overflow-hidden flex items-center justify-center">
                {item.type === 'video' ? (
                  <video src={item.url} className="w-full h-full object-cover" />
                ) : (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                )}
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopyUrl(item.url)}
                    className="p-1.5 rounded-lg bg-white/90 text-[#263550] hover:text-[#FF4FA3] shadow-xs cursor-pointer"
                    title="Copy URL"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPendingDelete({ id: item.id, url: item.url })}
                    className="p-1.5 rounded-lg bg-white/90 text-[#B42318] hover:bg-[#FEF3F2] shadow-xs cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {item.type === 'video' && (
                  <span className="absolute bottom-2 left-2 p-1 rounded-md bg-black/60 text-white">
                    <Film className="w-3 h-3" />
                  </span>
                )}
              </div>

              <div className="p-3">
                <p className="text-xs font-bold text-[#263550] truncate" title={item.name}>{item.name}</p>
                <div className="flex items-center justify-between text-[10px] text-[#98A0AE] mt-1">
                  <span className="capitalize">{item.folder || item.type}</span>
                  <span>{formatBytes(item.sizeBytes)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmModal
        isOpen={pendingDelete !== null}
        title="Delete media asset?"
        message="This asset will be removed from the media library and storage."
        confirmLabel="Delete Asset"
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
