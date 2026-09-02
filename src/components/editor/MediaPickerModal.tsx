'use client';

import React, { useState } from 'react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { X, Search, UploadCloud, Check, Image as ImageIcon, Folder, Trash2 } from 'lucide-react';

export function MediaPickerModal() {
  const { isMediaPickerOpen, setIsMediaPickerOpen, mediaPickerTarget, mediaAssets, addMediaAsset } = useStorefrontCms();
  const [search, setSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [selectedAssetUrl, setSelectedAssetUrl] = useState<string>('');
  const [selectedAssetAlt, setSelectedAssetAlt] = useState<string>('');

  // Mock Upload state
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadName, setUploadName] = useState('');
  const [uploadFolder, setUploadFolder] = useState('Campaigns');
  const [showUploadForm, setShowUploadForm] = useState(false);

  if (!isMediaPickerOpen) return null;

  const folders = ['All', 'Campaigns', 'Categories', 'Marketing', 'Products'];

  const filteredAssets = mediaAssets.filter(asset => {
    const matchesFolder = selectedFolder === 'All' || asset.folder === selectedFolder;
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase()) || asset.altText.toLowerCase().includes(search.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleConfirm = () => {
    if (mediaPickerTarget && selectedAssetUrl) {
      mediaPickerTarget.onSelect(selectedAssetUrl, selectedAssetAlt);
    }
    setIsMediaPickerOpen(false);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl) return;
    addMediaAsset({
      name: uploadName || `media_upload_${Date.now()}.jpg`,
      url: uploadUrl,
      type: 'campaign',
      sizeBytes: 850000,
      width: 1400,
      height: 1000,
      folder: uploadFolder,
      altText: uploadName || 'Neria Media Asset'
    });
    setSelectedAssetUrl(uploadUrl);
    setSelectedAssetAlt(uploadName || 'Neria Media Asset');
    setUploadUrl('');
    setUploadName('');
    setShowUploadForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#101828]/50 backdrop-blur-xs animate-in fade-in"
        onClick={() => setIsMediaPickerOpen(false)}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#F2F3F5] overflow-hidden z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F2F3F5] bg-[#FFF4F8]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#FFD8EA] flex items-center justify-center text-[#FF4FA3] shadow-xs">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#263550]">Neria Media Library</h3>
              <p className="text-xs text-[#98A0AE]">Select high-resolution imagery for your website sections & banners</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUploadForm(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#FFD8EA] text-xs font-semibold text-[#FF4FA3] hover:bg-[#FFF4F8] transition-colors shadow-2xs"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              {showUploadForm ? 'Browse Library' : 'Upload Image'}
            </button>
            <button
              onClick={() => setIsMediaPickerOpen(false)}
              className="p-1.5 rounded-lg text-[#98A0AE] hover:text-[#263550] hover:bg-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Upload Form View */}
        {showUploadForm ? (
          <div className="p-6 overflow-y-auto">
            <form onSubmit={handleUploadSubmit} className="space-y-4 max-w-lg mx-auto">
              <div className="p-6 border-2 border-dashed border-[#FFD8EA] rounded-2xl bg-[#FFF4F8]/50 text-center">
                <UploadCloud className="w-10 h-10 mx-auto text-[#FF4FA3] mb-2" />
                <h4 className="text-sm font-bold text-[#263550]">Upload Website Asset</h4>
                <p className="text-xs text-[#98A0AE] mt-1 mb-4">Support PNG, WebP, JPG up to 10MB</p>

                <div className="space-y-3 text-left">
                  <div>
                    <label className="block text-xs font-semibold text-[#263550] mb-1">Image URL / Unsplash Link</label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={uploadUrl}
                      onChange={e => setUploadUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#263550] mb-1">Asset Title / Alt Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Summer Lookbook Model Sunset"
                      value={uploadName}
                      onChange={e => setUploadName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#263550] mb-1">Folder Category</label>
                    <select
                      value={uploadFolder}
                      onChange={e => setUploadFolder(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3]"
                    >
                      <option value="Campaigns">Campaigns</option>
                      <option value="Categories">Categories</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Products">Products</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-5 w-full py-2.5 rounded-xl bg-[#FF4FA3] text-white font-bold text-xs shadow-xs hover:bg-[#E63E90] transition-colors"
                >
                  Save & Insert into Section
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Toolbar: Search & Folder filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-[#F2F3F5] bg-[#F8F8FA]/60">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#98A0AE]" />
                <input
                  type="text"
                  placeholder="Filter media..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3]"
                />
              </div>

              {/* Folders */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {folders.map(f => (
                  <button
                    key={f}
                    onClick={() => setSelectedFolder(f)}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                      selectedFolder === f
                        ? 'bg-[#263550] text-white shadow-xs'
                        : 'bg-white text-[#667085] hover:bg-[#FFF4F8] hover:text-[#263550] border border-[#F2F3F5]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Media Asset Grid */}
            <div className="p-6 overflow-y-auto flex-1 max-h-[460px]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {filteredAssets.map(asset => {
                  const isSelected = selectedAssetUrl === asset.url;
                  return (
                    <div
                      key={asset.id}
                      onClick={() => {
                        setSelectedAssetUrl(asset.url);
                        setSelectedAssetAlt(asset.altText);
                      }}
                      className={`relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group bg-white ${
                        isSelected
                          ? 'border-[#FF4FA3] ring-2 ring-[#FFD8EA] shadow-md'
                          : 'border-[#F2F3F5] hover:border-[#FFD8EA] hover:shadow-xs'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="aspect-4/3 bg-[#F2F3F5] overflow-hidden relative">
                        <img
                          src={asset.url}
                          alt={asset.altText}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#FF4FA3]/20 flex items-center justify-center">
                            <div className="w-7 h-7 rounded-full bg-[#FF4FA3] text-white flex items-center justify-center shadow-md">
                              <Check className="w-4 h-4" />
                            </div>
                          </div>
                        )}
                        <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] font-semibold">
                          {asset.folder}
                        </span>
                      </div>

                      {/* Meta */}
                      <div className="p-2.5">
                        <h5 className="text-[11px] font-bold text-[#263550] truncate">{asset.name}</h5>
                        <div className="flex items-center justify-between mt-1 text-[10px] text-[#98A0AE]">
                          <span>{asset.width}×{asset.height}</span>
                          <span>Used on {asset.usedInCount}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="p-4 bg-[#F8F8FA] border-t border-[#F2F3F5] flex justify-between items-center">
          <span className="text-xs text-[#667085]">
            {selectedAssetUrl ? '1 asset selected' : 'Choose an image to apply'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMediaPickerOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#667085] hover:bg-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedAssetUrl}
              className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${
                selectedAssetUrl
                  ? 'bg-[#FF4FA3] text-white hover:bg-[#E63E90] shadow-xs'
                  : 'bg-[#DDE1E7] text-[#98A0AE] cursor-not-allowed'
              }`}
            >
              Use Selected Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
