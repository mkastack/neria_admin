'use client';

import React from 'react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import {
  LayoutTemplate, Plus, Trash2, Edit3, ShieldCheck, Heart,
  CreditCard, Share2
} from 'lucide-react';

export default function FooterManagerPage() {
  const { config, updateFooter } = useStorefrontCms();
  const { footer } = config;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4F8] border border-[#FFD8EA] text-[#FF4FA3] text-xs font-bold uppercase tracking-wider mb-1.5">
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span>Storefront Layout</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#263550] tracking-tight">
          Footer & Social Links Editor
        </h1>
        <p className="text-xs text-[#667085] mt-1">
          Customize brand bio, navigation columns, payment provider badges, and copyright notices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brand Bio & Copyright */}
        <div className="rounded-3xl bg-white border border-[#F2F3F5] shadow-xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#263550] uppercase tracking-wider">
            Brand Bio & Legal
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#263550] mb-1">Brand Description</label>
            <textarea
              rows={3}
              value={footer.brandBio}
              onChange={e => updateFooter({ brandBio: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#263550] mb-1">Copyright Text</label>
            <input
              type="text"
              value={footer.copyrightText}
              onChange={e => updateFooter({ copyrightText: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7]"
            />
          </div>

          <div className="pt-2 border-t border-[#F2F3F5] space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-semibold text-[#263550]">Display Social Media Links</span>
              <input
                type="checkbox"
                checked={footer.showSocials}
                onChange={e => updateFooter({ showSocials: e.target.checked })}
                className="w-4 h-4 accent-[#FF4FA3]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-semibold text-[#263550]">Display Payment Provider Badges</span>
              <input
                type="checkbox"
                checked={footer.showPaymentMethods}
                onChange={e => updateFooter({ showPaymentMethods: e.target.checked })}
                className="w-4 h-4 accent-[#FF4FA3]"
              />
            </label>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="rounded-3xl bg-white border border-[#F2F3F5] shadow-xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#263550] uppercase tracking-wider">
            Navigation Columns ({footer.columns.length})
          </h3>

          <div className="space-y-3">
            {footer.columns.map((col, idx) => (
              <div key={col.id} className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#263550]">{col.title}</span>
                  <span className="text-[10px] text-[#98A0AE]">{col.links.length} Links</span>
                </div>
                <p className="text-[11px] text-[#667085] truncate">
                  {col.links.map(l => l.label).join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
