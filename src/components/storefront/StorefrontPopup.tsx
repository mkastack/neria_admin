'use client';

import React, { useState } from 'react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { BunnyMascot } from '../ui/BunnyMascot';
import { X, Sparkles, Copy, Check, ArrowRight } from 'lucide-react';

interface StorefrontPopupProps {
  forceShow?: boolean;
}

export function StorefrontPopup({ forceShow = false }: StorefrontPopupProps) {
  const { config } = useStorefrontCms();
  const { popup } = config;
  const [isOpen, setIsOpen] = useState(forceShow || popup.active);
  const [copied, setCopied] = useState(false);

  if (!popup.active && !forceShow) return null;
  if (!isOpen) return null;

  const handleCopyCode = () => {
    if (popup.promoCode) {
      navigator.clipboard?.writeText(popup.promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#101828]/60 backdrop-blur-xs animate-in fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Dialog */}
      <div
        style={{
          backgroundColor: popup.bgColor || '#FFFFFF',
          color: popup.textColor || '#263550'
        }}
        className="relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 border border-[#FFD8EA]"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#263550] flex items-center justify-center shadow-md transition-transform hover:scale-105"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Banner Image */}
        <div className="aspect-16/9 bg-[#FFF4F8] relative overflow-hidden">
          <img
            src={popup.image || 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=85'}
            alt="Promotion"
            className="w-full h-full object-cover"
          />
          {popup.badgeText && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-white text-[#FF4FA3] shadow-md">
              {popup.badgeText}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] flex items-center justify-center shadow-xs">
            <BunnyMascot size="sm" mood={popup.bunnyMood || 'shopping'} />
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight font-sans">
            {popup.title} {popup.emoji}
          </h3>

          <p className="text-xs sm:text-sm opacity-85 leading-relaxed max-w-sm mx-auto">
            {popup.description}
          </p>

          {/* Promo Code Box */}
          {popup.promoCode && (
            <div className="p-3 rounded-2xl bg-[#FFF4F8] border-2 border-dashed border-[#FF4FA3] flex items-center justify-between max-w-xs mx-auto">
              <span className="font-mono font-extrabold text-sm text-[#FF4FA3] tracking-wider">
                {popup.promoCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#FFD8EA] text-xs font-bold text-[#FF4FA3] hover:bg-[#FF4FA3] hover:text-white transition-colors flex items-center gap-1 shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3.5 rounded-full bg-[#FF4FA3] hover:bg-[#E63E90] text-white font-bold text-xs tracking-wide shadow-md transition-transform hover:scale-102 flex items-center justify-center gap-2"
            >
              <span>{popup.primaryButtonText || 'Shop With 15% Off'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {popup.secondaryButtonText && (
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-[#98A0AE] hover:text-[#263550] font-medium"
              >
                {popup.secondaryButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
