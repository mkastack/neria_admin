'use client';

import React, { useState } from 'react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { BunnyMascot } from '../ui/BunnyMascot';
import { BunnyMood } from '@/src/lib/types';
import { X, Check, Heart, Sparkles, Plus } from 'lucide-react';

export function BunnyPickerModal() {
  const { isBunnyPickerOpen, setIsBunnyPickerOpen, bunnyPickerTarget, bunnyAssets } = useStorefrontCms();
  const [selectedMood, setSelectedMood] = useState<BunnyMood>('default');

  if (!isBunnyPickerOpen) return null;

  const handleConfirm = () => {
    if (bunnyPickerTarget) {
      const asset = bunnyAssets.find(b => b.mood === selectedMood);
      bunnyPickerTarget.onSelect(selectedMood, asset ? asset.imageUrl : '');
    }
    setIsBunnyPickerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#101828]/50 backdrop-blur-xs animate-in fade-in"
        onClick={() => setIsBunnyPickerOpen(false)}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#F2F3F5] overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F2F3F5] bg-[#FFF4F8]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#FFD8EA] flex items-center justify-center shadow-xs">
              <BunnyMascot size="sm" mood="celebration" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#263550]">Neria Bunny Mascot Library</h3>
              <p className="text-xs text-[#98A0AE]">Select the perfect brand bunny variant for this storefront location</p>
            </div>
          </div>
          <button
            onClick={() => setIsBunnyPickerOpen(false)}
            className="p-1.5 rounded-lg text-[#98A0AE] hover:text-[#263550] hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bunny Grid */}
        <div className="p-6 max-h-[440px] overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {bunnyAssets.map(asset => {
              const isSelected = selectedMood === asset.mood;
              return (
                <div
                  key={asset.id}
                  onClick={() => setSelectedMood(asset.mood)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative group flex flex-col items-center text-center ${
                    isSelected
                      ? 'border-[#FF4FA3] bg-[#FFF4F8] shadow-sm'
                      : 'border-[#F2F3F5] bg-[#F8F8FA] hover:border-[#FFD8EA] hover:bg-white'
                  }`}
                >
                  {/* Active Radio Badge */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#FF4FA3] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3" />
                    </div>
                  )}

                  {/* Bunny Visual Illustration */}
                  <div className="w-16 h-16 rounded-2xl bg-white border border-[#FFD8EA] flex items-center justify-center mb-3 shadow-2xs group-hover:scale-110 transition-transform">
                    <BunnyMascot size="md" mood={asset.mood === 'empty_cart' || asset.mood === 'thank_you' ? 'happy' : (asset.mood as any)} />
                  </div>

                  <h4 className="text-xs font-bold text-[#263550] mb-0.5">{asset.name}</h4>
                  <span className="text-[10px] font-semibold text-[#FF4FA3] uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-[#FFD8EA] mb-2">
                    {asset.category}
                  </span>

                  <p className="text-[11px] text-[#98A0AE] line-clamp-1">
                    Used in: {asset.usedIn.join(', ')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8F8FA] border-t border-[#F2F3F5] flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs text-[#667085]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4FA3]" />
            <span>Selected mood: <strong className="text-[#263550] capitalize">{selectedMood.replace('_', ' ')}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBunnyPickerOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#667085] hover:bg-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2 text-xs font-bold text-white bg-[#FF4FA3] hover:bg-[#E63E90] rounded-xl shadow-xs transition-all hover:scale-102"
            >
              Apply Bunny Mascot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
