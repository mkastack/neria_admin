'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { Menu as MenuIcon, Plus, GripVertical, ExternalLink, Save } from 'lucide-react';

export default function NavigationPage() {
  const { addToast } = useAdmin();

  const [headerLinks, setHeaderLinks] = useState([
    { name: 'Shop All', url: '/shop' },
    { name: 'Bunny Love', url: '/collections/bunny-love' },
    { name: 'Strawberry Girl', url: '/collections/strawberry-girl' },
    { name: 'Soft Girl', url: '/collections/soft-girl' },
    { name: 'Bow Obsessed', url: '/collections/bow-obsessed' },
    { name: 'Neria Girls', url: '/community' }
  ]);

  const [footerLinks, setFooterLinks] = useState([
    { name: 'Our Story', url: '/about' },
    { name: 'Shipping & Delivery', url: '/shipping' },
    { name: 'Returns Policy', url: '/returns-policy' },
    { name: 'Size Chart', url: '/size-guide' },
    { name: 'Contact Care', url: '/contact' }
  ]);

  const handleSaveMenus = () => {
    addToast({
      type: 'success',
      title: 'Navigation Saved ♡',
      description: 'Storefront header & footer menus synchronized.'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Storefront Navigation Menus</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Configure header mega-menu categories, mobile navigation links, and footer columns.
          </p>
        </div>

        <button
          onClick={handleSaveMenus}
          className="neria-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Navigation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Header Menu */}
        <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#263550]">Main Header Navigation</h3>
            <span className="text-xs text-[#98A0AE]">{headerLinks.length} Links</span>
          </div>

          <div className="space-y-2">
            {headerLinks.map((link, idx) => (
              <div key={idx} className="p-3 bg-[#F8F8FA] rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <GripVertical className="w-4 h-4 text-[#98A0AE]" />
                  <span className="font-bold text-[#263550]">{link.name}</span>
                </div>
                <span className="font-mono text-[#FF4FA3]">{link.url}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#263550]">Footer Customer Care Links</h3>
            <span className="text-xs text-[#98A0AE]">{footerLinks.length} Links</span>
          </div>

          <div className="space-y-2">
            {footerLinks.map((link, idx) => (
              <div key={idx} className="p-3 bg-[#F8F8FA] rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <GripVertical className="w-4 h-4 text-[#98A0AE]" />
                  <span className="font-bold text-[#263550]">{link.name}</span>
                </div>
                <span className="font-mono text-[#FF4FA3]">{link.url}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
