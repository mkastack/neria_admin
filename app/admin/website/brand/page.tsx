'use client';

import React from 'react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { BunnyMascot } from '@/src/components/ui/BunnyMascot';
import {
  Sparkles, Heart, Globe, Mail, Phone, MapPin, Share2,
  MessageCircle, UploadCloud, Check
} from 'lucide-react';

export default function BrandSettingsPage() {
  const { config, updateBrand, bunnyAssets } = useStorefrontCms();
  const { brand } = config;

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4F8] border border-[#FFD8EA] text-[#FF4FA3] text-xs font-bold uppercase tracking-wider mb-1.5">
          <BunnyMascot size="sm" mood="happy" />
          <span>Brand Identity</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#263550] tracking-tight">
          Brand Assets & Bunny Mascot Library
        </h1>
        <p className="text-xs text-[#667085] mt-1">
          Manage brand logos, taglines, social handles, and the official Neria Bunny mascot variants.
        </p>
      </div>

      {/* 1. Neria Bunny Mascot Library */}
      <div className="rounded-3xl bg-white border border-[#F2F3F5] shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#263550]">
              Official Neria Bunny Mascot Library ({bunnyAssets.length})
            </h3>
            <p className="text-xs text-[#98A0AE] mt-0.5">
              Curated mascots used across homepage hero, order confirmation, empty bags, and packaging.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {bunnyAssets.map(asset => (
            <div
              key={asset.id}
              className="p-4 rounded-3xl bg-[#F8F8FA] border border-[#F2F3F5] hover:border-[#FFD8EA] hover:bg-[#FFF4F8]/40 transition-all flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white border border-[#FFD8EA] flex items-center justify-center mb-3 shadow-2xs group-hover:scale-110 transition-transform">
                <BunnyMascot size="md" mood={asset.mood === 'empty_cart' || asset.mood === 'thank_you' ? 'happy' : (asset.mood as any)} />
              </div>

              <h4 className="text-xs font-bold text-[#263550]">{asset.name}</h4>
              <span className="text-[10px] font-extrabold text-[#FF4FA3] uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-[#FFD8EA] my-1.5">
                {asset.category}
              </span>

              <p className="text-[10px] text-[#98A0AE] line-clamp-1">
                {asset.usedIn.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Brand Identity & Tagline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-white border border-[#F2F3F5] shadow-xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#263550] uppercase tracking-wider">
            Brand Name & Tagline
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#263550] mb-1">Brand Name</label>
            <input
              type="text"
              value={brand.brandName}
              onChange={e => updateBrand({ brandName: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#263550] mb-1">Signature Tagline</label>
            <input
              type="text"
              value={brand.tagline}
              onChange={e => updateBrand({ tagline: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3]"
            />
          </div>
        </div>

        {/* Contact Concierge */}
        <div className="rounded-3xl bg-white border border-[#F2F3F5] shadow-xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#263550] uppercase tracking-wider">
            Customer Concierge Details
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#263550] mb-1">Support Email</label>
            <input
              type="email"
              value={brand.contactInfo.email}
              onChange={e => updateBrand({ contactInfo: { ...brand.contactInfo, email: e.target.value } })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#263550] mb-1">Phone</label>
              <input
                type="text"
                value={brand.contactInfo.phone}
                onChange={e => updateBrand({ contactInfo: { ...brand.contactInfo, phone: e.target.value } })}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#263550] mb-1">WhatsApp</label>
              <input
                type="text"
                value={brand.contactInfo.whatsapp}
                onChange={e => updateBrand({ contactInfo: { ...brand.contactInfo, whatsapp: e.target.value } })}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
