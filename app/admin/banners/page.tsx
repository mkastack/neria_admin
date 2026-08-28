'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Image as ImageIcon, Plus, Eye, CheckCircle2 } from 'lucide-react';

export default function BannersPage() {
  const { addToast } = useAdmin();
  const [topBannerText, setTopBannerText] = useState('FREE SAME-DAY ACCRA DELIVERY ON ORDERS OVER GH₵ 500 ♡');
  const [heroHeading, setHeroHeading] = useState('Dreamy Silhouettes & Soft Girl Aesthetics');

  const handleSave = () => {
    addToast({
      type: 'success',
      title: 'Banners Published ♡',
      description: 'Storefront announcement bar updated.'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Storefront Banners & Announcements</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Manage top announcement marquee bar, seasonal hero headers, and pop-up alerts.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="neria-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Header Marquee Editor */}
        <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#263550]">Top Announcement Marquee</h3>
            <StatusBadge status="Active" />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Marquee Message</label>
            <input
              type="text"
              value={topBannerText}
              onChange={(e) => setTopBannerText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
            />
          </div>

          {/* Preview */}
          <div className="pt-2">
            <span className="text-[10px] font-bold text-[#98A0AE] uppercase tracking-wider block mb-1">Live Storefront Preview</span>
            <div className="py-2.5 px-4 bg-[#FF4FA3] text-white text-xs font-bold text-center rounded-xl tracking-wider shadow-xs">
              {topBannerText}
            </div>
          </div>
        </div>

        {/* Hero Banner Editor */}
        <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#263550]">Main Homepage Hero Banner</h3>
            <StatusBadge status="Active" />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Headline</label>
            <input
              type="text"
              value={heroHeading}
              onChange={(e) => setHeroHeading(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
            />
          </div>

          {/* Preview */}
          <div className="pt-2">
            <span className="text-[10px] font-bold text-[#98A0AE] uppercase tracking-wider block mb-1">Hero Card Mockup</span>
            <div className="relative h-28 rounded-2xl overflow-hidden bg-cover bg-center flex items-center p-4" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80')" }}>
              <div className="absolute inset-0 bg-[#263550]/40 backdrop-blur-2xs" />
              <div className="relative z-10 text-white">
                <h4 className="text-sm font-extrabold">{heroHeading}</h4>
                <span className="text-[10px] font-bold text-[#FFD8EA] mt-1 inline-block">Shop Lookbook &gt;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
