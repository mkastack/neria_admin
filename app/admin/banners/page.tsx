'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Image as ImageIcon, Plus, Eye, CheckCircle2, Megaphone, Sparkles, Loader2 } from 'lucide-react';

export default function BannersPage() {
  const { addToast } = useAdmin();
  const { config, updateConfig, publishChanges } = useStorefrontCms();

  const [topBannerText, setTopBannerText] = useState('FREE US SHIPPING ON ORDERS OVER $500 ♡');
  const [heroHeading, setHeroHeading] = useState('Dreamy Silhouettes & Soft Girl Aesthetics');
  const [heroSubtitle, setHeroSubtitle] = useState('Explore our latest dreamy collection.');
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);
  const [bgColor, setBgColor] = useState('#FF4FA3');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [isSaving, setIsSaving] = useState(false);

  // Sync state from live Firestore CMS config
  useEffect(() => {
    if (config) {
      if (config.announcements) {
        const firstItem = config.announcements.items?.[0];
        if (firstItem?.message) setTopBannerText(firstItem.message);
        if (typeof config.announcements.enabled === 'boolean') {
          setAnnouncementEnabled(config.announcements.enabled);
        }
        if (firstItem?.bgColor) setBgColor(firstItem.bgColor);
        if (firstItem?.textColor) setTextColor(firstItem.textColor);
      }

      const heroSection = config.homepageSections?.find(s => s.type === 'hero');
      if (heroSection?.content) {
        if (heroSection.content.mainHeading) setHeroHeading(heroSection.content.mainHeading);
        if (heroSection.content.description) setHeroSubtitle(heroSection.content.description);
      }
    }
  }, [config]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      updateConfig((prev) => {
        // Update announcement items
        const existingItems = prev.announcements?.items || [];
        const updatedItems = existingItems.length > 0
          ? existingItems.map((item, idx) => idx === 0 ? {
              ...item,
              message: topBannerText,
              bgColor: bgColor,
              textColor: textColor,
            } : item)
          : [{
              id: 'ann-1',
              message: topBannerText,
              emoji: '♡',
              linkUrl: '/shop',
              bgColor: bgColor,
              textColor: textColor,
              active: true,
              priority: 1
            }];

        // Update hero section
        const updatedSections = (prev.homepageSections || []).map((sec) => {
          if (sec.type === 'hero') {
            return {
              ...sec,
              content: {
                ...sec.content,
                mainHeading: heroHeading,
                description: heroSubtitle,
              }
            };
          }
          return sec;
        });

        return {
          ...prev,
          announcements: {
            ...prev.announcements,
            enabled: announcementEnabled,
            items: updatedItems,
          },
          homepageSections: updatedSections,
        };
      });

      // Commit and publish to Firestore & neria-commerce.vercel.app
      await publishChanges('Updated announcement marquee banner and hero headers');

      addToast({
        type: 'success',
        title: 'Banners Published Live ♡',
        description: 'New banners are now active on neria-commerce.vercel.app in real time.',
        crucial: true
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        description: err instanceof Error ? err.message : 'Could not save banner changes.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Storefront Banners & Announcements</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Manage top announcement marquee bar, seasonal hero headers, and pop-up alerts with instant live sync.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="neria-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Publish Live</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Header Marquee Editor */}
        <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#263550] flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#FF4FA3]" /> Top Announcement Marquee
            </h3>
            <label className="flex items-center gap-2 text-xs font-bold text-[#263550] cursor-pointer">
              <span>{announcementEnabled ? 'Enabled' : 'Disabled'}</span>
              <input
                type="checkbox"
                checked={announcementEnabled}
                onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#FF4FA3] rounded"
              />
            </label>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-[#DDE1E7] cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#DDE1E7] text-xs font-mono text-[#263550]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-[#DDE1E7] cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#DDE1E7] text-xs font-mono text-[#263550]"
                />
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="pt-2">
            <span className="text-[10px] font-bold text-[#98A0AE] uppercase tracking-wider block mb-1">Live Storefront Preview</span>
            <div
              style={{ backgroundColor: bgColor, color: textColor }}
              className="py-2.5 px-4 text-xs font-bold text-center rounded-xl tracking-wider shadow-xs transition-colors"
            >
              {topBannerText}
            </div>
          </div>
        </div>

        {/* Hero Banner Editor */}
        <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#263550] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF4FA3]" /> Main Homepage Hero Banner
            </h3>
            <StatusBadge status="Active" />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Hero Title</label>
            <input
              type="text"
              value={heroHeading}
              onChange={(e) => setHeroHeading(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Hero Subtitle</label>
            <input
              type="text"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
            />
          </div>

          {/* Live Preview */}
          <div className="pt-2">
            <span className="text-[10px] font-bold text-[#98A0AE] uppercase tracking-wider block mb-1">Hero Card Mockup</span>
            <div className="relative h-28 rounded-2xl overflow-hidden bg-cover bg-center flex items-center p-4" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80')" }}>
              <div className="absolute inset-0 bg-[#263550]/40 backdrop-blur-2xs" />
              <div className="relative z-10 text-white">
                <h4 className="text-sm font-extrabold">{heroHeading}</h4>
                <p className="text-[11px] text-white/80 line-clamp-1">{heroSubtitle}</p>
                <span className="text-[10px] font-bold text-[#FFD8EA] mt-1 inline-block">Shop Lookbook &gt;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
