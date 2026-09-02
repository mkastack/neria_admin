'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { BunnyMascot } from '../ui/BunnyMascot';
import {
  Search, ShoppingBag, Heart, ChevronDown, Sparkles, Menu, X, ArrowRight
} from 'lucide-react';

interface StorefrontHeaderProps {
  isEditorMode?: boolean;
}

export function StorefrontHeader({ isEditorMode }: StorefrontHeaderProps) {
  const { config, setActiveSectionId } = useStorefrontCms();
  const { announcements, navigation, brand, theme } = config;

  const [activeAnnounceIndex, setActiveAnnounceIndex] = useState(0);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeAnnouncements = announcements.items.filter(a => a.active);

  // Auto rotation
  useEffect(() => {
    if (!announcements.enabled || !announcements.autoRotate || activeAnnouncements.length <= 1) return;
    const interval = setInterval(() => {
      setActiveAnnounceIndex(prev => (prev + 1) % activeAnnouncements.length);
    }, (announcements.rotationInterval || 5) * 1000);
    return () => clearInterval(interval);
  }, [announcements, activeAnnouncements.length]);

  const currentAnnouncement = activeAnnouncements[activeAnnounceIndex] || activeAnnouncements[0];

  return (
    <header className="w-full select-none relative z-40 bg-white shadow-xs">
      {/* 1. Announcement Bar */}
      {announcements.enabled && currentAnnouncement && (
        <div
          style={{
            backgroundColor: currentAnnouncement.bgColor || '#263550',
            color: currentAnnouncement.textColor || '#FFFFFF'
          }}
          className="py-2 px-4 text-xs font-semibold tracking-wide transition-colors duration-300 relative"
          onClick={() => isEditorMode && setActiveSectionId('announcements')}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center">
            {currentAnnouncement.emoji && <span>{currentAnnouncement.emoji}</span>}
            <span>{currentAnnouncement.message}</span>
            {currentAnnouncement.linkText && (
              <span className="underline ml-1 cursor-pointer hover:opacity-80 inline-flex items-center gap-0.5">
                {currentAnnouncement.linkText} <ArrowRight className="w-3 h-3 inline" />
              </span>
            )}
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 lg:h-20">
          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="lg:hidden p-2 text-[#263550] hover:text-[#FF4FA3]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] flex items-center justify-center shadow-xs">
              <BunnyMascot size="sm" mood="happy" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-widest text-base sm:text-lg text-[#263550] uppercase font-sans">
                {brand.brandName || 'Neria Collective'}
              </span>
              <span className="text-[9px] font-bold text-[#FF4FA3] tracking-widest uppercase -mt-0.5">
                {brand.tagline || 'Soft looks. Loud presence.'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navigation.menuItems.map(item => (
              <div
                key={item.id}
                className="relative py-6"
                onMouseEnter={() => item.isMegaMenu && setActiveMegaMenu(item.id)}
                onMouseLeave={() => item.isMegaMenu && setActiveMegaMenu(null)}
              >
                <div
                  className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                    item.highlight
                      ? 'text-[#FF4FA3]'
                      : 'text-[#263550] hover:text-[#FF4FA3]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#FF4FA3] text-white">
                      {item.badge}
                    </span>
                  )}
                  {(item.dropdownItems || item.isMegaMenu) && (
                    <ChevronDown className="w-3.5 h-3.5 text-[#98A0AE]" />
                  )}
                </div>

                {/* Mega Menu Dropdown */}
                {item.isMegaMenu && activeMegaMenu === item.id && item.dropdownItems && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[640px] bg-white rounded-2xl shadow-xl border border-[#F2F3F5] p-6 grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    <div className="col-span-7 space-y-2.5">
                      <h5 className="text-[11px] font-bold text-[#98A0AE] uppercase tracking-wider">
                        Categories & Silhouettes
                      </h5>
                      <div className="grid grid-cols-2 gap-2">
                        {item.dropdownItems.map(drop => (
                          <div
                            key={drop.id}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FFF4F8] hover:text-[#FF4FA3] text-xs font-semibold text-[#263550] transition-colors cursor-pointer"
                          >
                            <span>{drop.label}</span>
                            {drop.badge && (
                              <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-[#FFD8EA] text-[#FF4FA3] font-bold">
                                {drop.badge}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Featured Image in Mega Menu */}
                    {item.featuredImage && (
                      <div className="col-span-5 rounded-xl overflow-hidden relative group bg-[#F8F8FA] border border-[#F2F3F5]">
                        <img
                          src={item.featuredImage}
                          alt="Mega Menu Feature"
                          className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-2.5 bg-white">
                          <h6 className="text-xs font-bold text-[#263550] truncate">{item.featuredTitle || 'New Season Drop'}</h6>
                          <p className="text-[10px] text-[#98A0AE] line-clamp-1 mt-0.5">{item.featuredSubtitle}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Standard Dropdown */}
                {!item.isMegaMenu && item.dropdownItems && (
                  <div className="hidden group-hover:block absolute top-full left-0 w-52 bg-white rounded-xl shadow-lg border border-[#F2F3F5] p-2 space-y-1">
                    {item.dropdownItems.map(drop => (
                      <div
                        key={drop.id}
                        className="px-3 py-2 text-xs font-medium text-[#263550] hover:bg-[#FFF4F8] hover:text-[#FF4FA3] rounded-lg transition-colors cursor-pointer flex justify-between items-center"
                      >
                        <span>{drop.label}</span>
                        {drop.badge && (
                          <span className="text-[9px] font-bold text-[#FF4FA3]">{drop.badge}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Action Icons: Search, Wishlist, Cart */}
          <div className="flex items-center gap-3.5">
            {/* Search Input Bar (Desktop) */}
            <div className="hidden md:flex items-center relative w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#98A0AE]" />
              <input
                type="text"
                readOnly
                placeholder={navigation.searchPlaceholder || 'Search Neria...'}
                className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-full bg-[#F8F8FA] border border-[#DDE1E7] text-[#667085] cursor-pointer"
              />
            </div>

            {/* Wishlist */}
            <button className="p-2 rounded-xl text-[#263550] hover:text-[#FF4FA3] hover:bg-[#FFF4F8] transition-colors relative">
              <Heart className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FF4FA3] text-white text-[9px] font-bold flex items-center justify-center">
                2
              </span>
            </button>

            {/* Bag / Cart */}
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#263550] text-white hover:bg-[#FF4FA3] transition-colors shadow-xs">
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">Bag (3)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#F2F3F5] bg-white p-4 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#98A0AE]" />
            <input
              type="text"
              placeholder="Search silhouettes..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7]"
            />
          </div>
          {navigation.menuItems.map(item => (
            <div key={item.id} className="py-1.5 border-b border-[#F8F8FA]">
              <div className="flex items-center justify-between text-xs font-bold text-[#263550] uppercase">
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] bg-[#FF4FA3] text-white">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
