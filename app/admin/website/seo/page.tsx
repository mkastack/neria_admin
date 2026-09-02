'use client';

import React from 'react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import {
  Globe, Search, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles,
  Share2, Image as ImageIcon
} from 'lucide-react';

export default function SeoManagerPage() {
  const { config, updateSEO, openMediaPicker } = useStorefrontCms();
  const { seo } = config;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4F8] border border-[#FFD8EA] text-[#FF4FA3] text-xs font-bold uppercase tracking-wider mb-1.5">
          <Globe className="w-3.5 h-3.5" />
          <span>Search Engine Optimization</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#263550] tracking-tight">
          SEO & Social Metadata Manager
        </h1>
        <p className="text-xs text-[#667085] mt-1">
          Configure how Neria Collective appears on Google Search, Instagram shares, and iMessage previews.
        </p>
      </div>

      {/* SEO Health Score Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#ECFDF3] to-[#F0FDF4] border border-[#ABEFC6] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#027A48] text-white flex items-center justify-center font-extrabold text-base shadow-sm">
            98%
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#027A48]">Live SEO Health: Excellent</h3>
            <p className="text-xs text-[#027A48]/80 mt-0.5">
              Metadata, canonical links, responsive viewport tags, and Open Graph tags are fully optimized.
            </p>
          </div>
        </div>

        <span className="px-3.5 py-1.5 rounded-xl bg-white text-[#027A48] font-bold text-xs border border-[#ABEFC6] shadow-2xs">
          ✓ All Checks Passed
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-white border border-[#F2F3F5] shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#263550] uppercase tracking-wider">
              Search Metadata Settings
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#263550] mb-1">
                Website Meta Title ({seo.siteTitle.length} / 60 chars)
              </label>
              <input
                type="text"
                value={seo.siteTitle}
                onChange={e => updateSEO({ siteTitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#263550] mb-1">
                Meta Description ({seo.defaultDescription.length} / 160 chars)
              </label>
              <textarea
                rows={3}
                value={seo.defaultDescription}
                onChange={e => updateSEO({ defaultDescription: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#263550] mb-1">
                Social Share (Open Graph) Cover Image
              </label>
              <div className="flex gap-2 items-center">
                <div className="w-14 h-10 rounded-lg overflow-hidden bg-[#DDE1E7] shrink-0 border">
                  <img src={seo.ogImage} alt="OG" className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={() => openMediaPicker((url) => updateSEO({ ogImage: url }))}
                  className="flex-1 py-1.5 rounded-lg bg-[#F8F8FA] border border-[#DDE1E7] hover:border-[#FF4FA3] text-xs font-semibold text-[#263550]"
                >
                  Choose Social Share Image
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Search Engine Simulation Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Google Preview */}
          <div className="rounded-3xl bg-white border border-[#F2F3F5] shadow-xs p-6 space-y-3">
            <h4 className="text-xs font-bold text-[#263550] uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[#FF4FA3]" />
              <span>Google Search Simulation</span>
            </h4>

            <div className="p-4 rounded-2xl bg-[#F8F8FA] border border-[#DDE1E7] space-y-1 font-sans">
              <div className="flex items-center gap-2 text-[11px] text-[#202124]">
                <div className="w-4 h-4 rounded-full bg-[#FF4FA3] text-white flex items-center justify-center text-[8px] font-bold">
                  N
                </div>
                <span className="text-[#202124] font-medium">neriacollective.com</span>
              </div>
              <h5 className="text-sm font-bold text-[#1a0dab] hover:underline cursor-pointer line-clamp-1">
                {seo.siteTitle}
              </h5>
              <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                {seo.defaultDescription}
              </p>
            </div>
          </div>

          {/* Social Share Preview Card */}
          <div className="rounded-3xl bg-white border border-[#F2F3F5] shadow-xs p-6 space-y-3">
            <h4 className="text-xs font-bold text-[#263550] uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-[#FF4FA3]" />
              <span>Social Media Share Preview</span>
            </h4>

            <div className="rounded-2xl overflow-hidden border border-[#DDE1E7] shadow-sm bg-white">
              <div className="aspect-16/9 bg-[#DDE1E7] overflow-hidden">
                <img src={seo.ogImage} alt="Social Preview" className="w-full h-full object-cover" />
              </div>
              <div className="p-3 bg-[#F8F8FA]">
                <span className="text-[10px] text-[#98A0AE] uppercase font-bold">neriacollective.com</span>
                <h6 className="text-xs font-bold text-[#263550] line-clamp-1">{seo.siteTitle}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
