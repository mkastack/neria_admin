'use client';

import React from 'react';
import Link from 'next/link';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { BunnyMascot } from '../ui/BunnyMascot';
import {
  Monitor, Tablet, Smartphone, Undo2, Redo2, Eye, Save, Globe,
  CheckCircle2, Loader2, ArrowLeft, Sparkles, ChevronDown, Layers
} from 'lucide-react';

export function EditorTopBar() {
  const {
    deviceMode,
    setDeviceMode,
    activePageId,
    setActivePageId,
    canUndo,
    canRedo,
    undo,
    redo,
    autoSaveStatus,
    previewMode,
    setPreviewMode,
    saveDraft,
    setIsPublishModalOpen,
    isDirty,
    config
  } = useStorefrontCms();

  const pagesList = [
    { id: 'homepage', label: 'Homepage' },
    { id: 'about', label: 'About Us & Atelier' },
    { id: 'contact', label: 'Contact & Concierge' },
    { id: 'faq', label: 'Frequently Asked Questions' },
    { id: 'shipping-returns', label: 'Shipping & Exchanges' },
    { id: 'size-guide', label: 'Official Size Guide' }
  ];

  return (
    <header className="h-16 bg-[#263550] text-white px-4 flex items-center justify-between border-b border-[#1D2939] shrink-0 select-none z-40">
      {/* Left: Brand & Page Selector & Exit */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/website"
          title="Exit to Admin Overview"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Exit Editor</span>
        </Link>

        <div className="h-5 w-px bg-white/15 hidden sm:block" />

        {/* Brand Mascot */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#FFF4F8] border border-[#FFD8EA] flex items-center justify-center">
            <BunnyMascot size="sm" mood="happy" />
          </div>
          <span className="font-extrabold text-xs uppercase tracking-wider hidden md:inline text-white">
            Live Website Editor
          </span>
        </div>

        {/* Page Switcher Dropdown */}
        <div className="relative">
          <select
            value={activePageId}
            onChange={e => setActivePageId(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-[#FF4FA3] cursor-pointer"
          >
            {pagesList.map(p => (
              <option key={p.id} value={p.id} className="text-[#263550] bg-white">
                {p.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
        </div>
      </div>

      {/* Center: Device Mode Breakpoint Switcher */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/10 border border-white/10">
        <button
          onClick={() => setDeviceMode('desktop')}
          title="Desktop View (100% width)"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
            deviceMode === 'desktop'
              ? 'bg-[#FF4FA3] text-white shadow-xs'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Desktop</span>
        </button>

        <button
          onClick={() => setDeviceMode('tablet')}
          title="Tablet View (768px)"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
            deviceMode === 'tablet'
              ? 'bg-[#FF4FA3] text-white shadow-xs'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <Tablet className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Tablet</span>
        </button>

        <button
          onClick={() => setDeviceMode('mobile')}
          title="Mobile View (390px)"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
            deviceMode === 'mobile'
              ? 'bg-[#FF4FA3] text-white shadow-xs'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Mobile</span>
        </button>
      </div>

      {/* Right: Undo/Redo, Auto-save status, Preview, Publish */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Undo / Redo */}
        <div className="hidden lg:flex items-center gap-0.5">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Auto-save Status Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-white/70">
          {autoSaveStatus === 'saving' ? (
            <>
              <Loader2 className="w-3.5 h-3.5 text-[#FFD8EA] animate-spin" />
              <span>Saving draft...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#ABEFC6]" />
              <span>Draft auto-saved</span>
            </>
          )}
        </div>

        {/* Preview Mode Toggle */}
        <button
          onClick={() => setPreviewMode(prev => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            previewMode
              ? 'bg-white text-[#263550] shadow-sm'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{previewMode ? 'Exit Preview' : 'Preview'}</span>
        </button>

        {/* Save Draft */}
        <button
          onClick={saveDraft}
          title="Save Draft Changes"
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold text-white transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Draft</span>
        </button>

        {/* Publish Live Button */}
        <button
          onClick={() => setIsPublishModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#FF4FA3] hover:bg-[#E63E90] text-white text-xs font-extrabold shadow-md shadow-[#FF4FA3]/30 transition-all hover:scale-102 active:scale-98"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Publish</span>
        </button>
      </div>
    </header>
  );
}
