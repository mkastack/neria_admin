'use client';

import React, { useState } from 'react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { BunnyMascot } from '@/src/components/ui/BunnyMascot';
import { BunnyPickerModal } from '@/src/components/editor/BunnyPickerModal';
import { MediaPickerModal } from '@/src/components/editor/MediaPickerModal';
import {
  Sparkles, Eye, Image as ImageIcon, Gift, Copy, Check, Sliders,
  Clock, ShieldCheck, ToggleLeft, ToggleRight
} from 'lucide-react';

export default function PopupsManagerPage() {
  const { config, updatePopup, openBunnyPicker, openMediaPicker } = useStorefrontCms();
  const { popup } = config;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4F8] border border-[#FFD8EA] text-[#FF4FA3] text-xs font-bold uppercase tracking-wider mb-1.5">
            <Gift className="w-3.5 h-3.5" />
            <span>Conversion & Marketing</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#263550] tracking-tight">
            Promotional & Newsletter Popup Manager
          </h1>
          <p className="text-xs text-[#667085] mt-1">
            Configure automated customer welcome modals, first-order discount codes, and exit-intent promos.
          </p>
        </div>

        {/* Global Active Switch */}
        <button
          onClick={() => updatePopup({ active: !popup.active })}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs shadow-md transition-all ${
            popup.active
              ? 'bg-[#027A48] text-white shadow-[#027A48]/20'
              : 'bg-[#667085] text-white'
          }`}
        >
          <span>{popup.active ? '✓ Popup is Active Live' : 'Popup is Disabled'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Properties & Trigger Settings */}
        <div className="lg:col-span-7 space-y-6">
          {/* General Content Card */}
          <div className="rounded-3xl bg-white border border-[#F2F3F5] shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#263550] uppercase tracking-wider">
              Popup Content & Copy
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#263550] mb-1">Badge Tag</label>
              <input
                type="text"
                value={popup.badgeText || ''}
                onChange={e => updatePopup({ badgeText: e.target.value })}
                placeholder="e.g. Exclusive Welcome Gift"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#263550] mb-1">Modal Title</label>
              <input
                type="text"
                value={popup.title}
                onChange={e => updatePopup({ title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#263550] mb-1">Description Body</label>
              <textarea
                rows={3}
                value={popup.description}
                onChange={e => updatePopup({ description: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#263550] mb-1">Promo Code</label>
                <input
                  type="text"
                  value={popup.promoCode || ''}
                  onChange={e => updatePopup({ promoCode: e.target.value.toUpperCase() })}
                  placeholder="e.g. SOFTGIRL15"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] font-mono font-bold text-[#FF4FA3]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#263550] mb-1">Button CTA Text</label>
                <input
                  type="text"
                  value={popup.primaryButtonText}
                  onChange={e => updatePopup({ primaryButtonText: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7]"
                />
              </div>
            </div>

            {/* Media & Bunny */}
            <div className="pt-3 border-t border-[#F2F3F5] grid grid-cols-2 gap-4">
              <div>
                <span className="block text-xs font-semibold text-[#263550] mb-1.5">Banner Image</span>
                <button
                  onClick={() => openMediaPicker(url => updatePopup({ image: url }))}
                  className="w-full py-2 rounded-xl bg-[#FFF4F8] border border-[#FFD8EA] text-xs font-bold text-[#FF4FA3]"
                >
                  Change Image
                </button>
              </div>

              <div>
                <span className="block text-xs font-semibold text-[#263550] mb-1.5">Bunny Mascot</span>
                <button
                  onClick={() => openBunnyPicker(mood => updatePopup({ bunnyMood: mood as any }))}
                  className="w-full py-2 rounded-xl bg-[#FFF4F8] border border-[#FFD8EA] text-xs font-bold text-[#FF4FA3] capitalize"
                >
                  {popup.bunnyMood} Bunny
                </button>
              </div>
            </div>
          </div>

          {/* Trigger & Frequency Rules */}
          <div className="rounded-3xl bg-white border border-[#F2F3F5] shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#263550] uppercase tracking-wider">
              Display Trigger & Rules
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#263550] mb-1">Display Trigger</label>
                <select
                  value={popup.trigger}
                  onChange={e => updatePopup({ trigger: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7]"
                >
                  <option value="delay_5s">After 5 Seconds on Site</option>
                  <option value="instant">Immediately on Page Load</option>
                  <option value="scroll_50">After 50% Page Scroll</option>
                  <option value="exit_intent">Desktop Exit Intent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#263550] mb-1">Frequency</label>
                <select
                  value={popup.frequency}
                  onChange={e => updatePopup({ frequency: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7]"
                >
                  <option value="once_per_day">Once Per Day Per Visitor</option>
                  <option value="every_visit">Every Page Visit</option>
                  <option value="once_per_week">Once Per Week</option>
                  <option value="once_ever">Once Per Customer Lifetime</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Popup Interactive Preview */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 space-y-3">
            <span className="text-xs font-bold text-[#263550] uppercase tracking-wider block">
              Customer Storefront Preview
            </span>

            {/* Popup Card */}
            <div className="rounded-3xl bg-white border-2 border-[#FFD8EA] shadow-2xl overflow-hidden">
              {/* Image banner */}
              <div className="aspect-16/9 bg-[#FFF4F8] relative">
                <img
                  src={popup.image || 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=85'}
                  alt="Popup"
                  className="w-full h-full object-cover"
                />
                {popup.badgeText && (
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white text-[#FF4FA3] shadow-xs">
                    {popup.badgeText}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-5 text-center space-y-3">
                <div className="w-10 h-10 mx-auto rounded-xl bg-[#FFF4F8] border border-[#FFD8EA] flex items-center justify-center">
                  <BunnyMascot size="sm" mood={popup.bunnyMood || 'shopping'} />
                </div>

                <h4 className="text-base font-extrabold text-[#263550]">
                  {popup.title} {popup.emoji}
                </h4>

                <p className="text-xs text-[#667085] leading-relaxed">
                  {popup.description}
                </p>

                {popup.promoCode && (
                  <div className="p-2.5 rounded-xl bg-[#FFF4F8] border border-dashed border-[#FF4FA3] font-mono font-bold text-xs text-[#FF4FA3]">
                    {popup.promoCode}
                  </div>
                )}

                <button className="w-full py-2.5 rounded-full bg-[#FF4FA3] text-white font-bold text-xs shadow-md">
                  {popup.primaryButtonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BunnyPickerModal />
      <MediaPickerModal />
    </div>
  );
}
