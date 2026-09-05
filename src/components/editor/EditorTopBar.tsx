'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { BunnyMascot } from '../ui/BunnyMascot';
import {
  Monitor, Tablet, Smartphone, Undo2, Redo2, Eye, Save, Globe,
  CheckCircle2, Loader2, ArrowLeft, Sparkles, ChevronDown, Layers,
  LogIn, LogOut
} from 'lucide-react';

type PreviewAuthUser = { uid: string; email: string | null };

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

  // Track the auth state of the iframe's live storefront. The
  // IframeStorefrontCanvas listens for `cms:auth:state` postMessages
  // from the commerce site and re-broadcasts the user (or null) here.
  // The toggle reads this to decide between "Sign in to preview" and
  // "Sign out".
  const [previewUser, setPreviewUser] = useState<PreviewAuthUser | null>(null);
  useEffect(() => {
    const onAuthState = (e: Event) => {
      const detail = (e as CustomEvent<{ user: PreviewAuthUser | null }>).detail;
      setPreviewUser(detail?.user ?? null);
    };
    window.addEventListener('neria:editor:auth-state', onAuthState as EventListener);
    return () => window.removeEventListener('neria:editor:auth-state', onAuthState as EventListener);
  }, []);

  const handleAuthToggle = () => {
    if (previewUser) {
      // Sign the iframe out: write 'out' to localStorage and reload.
      window.dispatchEvent(
        new CustomEvent('neria:editor:set-preview-auth', { detail: { state: 'out' } }),
      );
    } else {
      // Sign the iframe in: write 'in' to localStorage and navigate
      // the iframe to the storefront's own /auth page.
      window.dispatchEvent(
        new CustomEvent('neria:editor:set-preview-auth', { detail: { state: 'in' } }),
      );
      window.dispatchEvent(
        new CustomEvent('neria:editor:navigate', { detail: { path: '/auth?edit=1' } }),
      );
    }
  };

  // The dropdown lists the real neria_commerce routes. Every page the
  // user can land on is here, with at least one representative
  // dynamic route (e.g. an example product slug, an example order id)
  // so the iframe renders something meaningful.
  const pagesList = [
    { id: 'homepage', label: 'Homepage', path: '/' },
    { id: 'shop', label: 'Shop', path: '/shop' },
    { id: 'trending', label: 'Trending', path: '/trending' },
    { id: 'product', label: 'Product', path: '/product/dollhouse-bunny-tote' },
    { id: 'cart', label: 'Cart', path: '/cart' },
    { id: 'checkout', label: 'Checkout', path: '/checkout' },
    { id: 'auth', label: 'Sign In / Sign Up', path: '/auth' },
    { id: 'account', label: 'Account', path: '/account' },
    { id: 'orders', label: 'Orders', path: '/orders' },
    { id: 'order', label: 'Order Detail', path: '/order/example-order' },
    { id: 'orderTrack', label: 'Order Tracking', path: '/order/track/example' },
    { id: 'cart-empty', label: 'Cart (Empty)', path: '/cart?empty=1' },
    { id: 'orders-empty', label: 'Orders (Empty)', path: '/orders?empty=1' },
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
            onChange={e => {
              const next = e.target.value;
              setActivePageId(next);
              const path = pagesList.find(p => p.id === next)?.path ?? '/';
              // Bump the iframe to the new route. We round-trip through a
              // window-level event so the canvas (and the left sidebar)
              // can react.
              window.dispatchEvent(new CustomEvent('neria:editor:navigate', { detail: { path } }));
            }}
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

        {/* Auth preview toggle — flips the iframe between
            unauthenticated (default) and the admin's own auth state.
            The localStorage flag lives in the iframe's origin, so the
            main commerce site is unaffected. */}
        <button
          onClick={handleAuthToggle}
          title={
            previewUser
              ? `Signed in as ${previewUser.email ?? previewUser.uid} — click to sign out of the preview`
              : 'Open the sign-in page in the live preview'
          }
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            previewUser
              ? 'bg-[#12B76A] hover:bg-[#039855] text-white shadow-sm'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
        >
          {previewUser ? (
            <>
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </>
          ) : (
            <>
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign in to preview</span>
            </>
          )}
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
