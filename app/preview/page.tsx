'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { IframeStorefrontCanvas } from '@/src/components/editor/IframeStorefrontCanvas';
import {
  Monitor, Tablet, Smartphone, ArrowLeft
} from 'lucide-react';

export default function StandaloneStorefrontPreviewPage() {
  const { publishedConfig } = useStorefrontCms();
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const containerClass = {
    desktop: 'w-full h-[calc(100vh-3rem)]',
    tablet: 'w-[768px] max-w-full h-[calc(100vh-3rem-3rem)] my-6 rounded-3xl shadow-2xl border-8 border-[#263550] overflow-hidden',
    mobile: 'w-[390px] max-w-full h-[calc(100vh-3rem-3rem)] my-6 rounded-[40px] shadow-2xl border-10 border-[#263550] overflow-hidden ring-4 ring-black/10'
  }[device];

  return (
    <div className="min-h-screen bg-[#1D2939] flex flex-col antialiased">
      {/* Top Preview Status Bar */}
      <div className="h-12 bg-[#263550] text-white px-4 flex items-center justify-between border-b border-[#101828] text-xs select-none sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/website/editor"
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 font-bold text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Visual Editor</span>
          </Link>

          <span className="hidden sm:inline text-white/60">•</span>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#12B76A] animate-pulse" />
            <span className="font-bold text-white">Neria Collective Live Storefront</span>
            <span className="text-white/60 font-mono text-[11px]">v{publishedConfig.version || 28}</span>
          </div>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded-lg ${device === 'desktop' ? 'bg-[#FF4FA3] text-white' : 'text-white/70 hover:text-white'}`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded-lg ${device === 'tablet' ? 'bg-[#FF4FA3] text-white' : 'text-white/70 hover:text-white'}`}
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded-lg ${device === 'mobile' ? 'bg-[#FF4FA3] text-white' : 'text-white/70 hover:text-white'}`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center Storefront Canvas — now the live site via iframe */}
      <div className="flex-1 flex flex-col items-center bg-[#F8F8FA] p-0 sm:p-4">
        <div className={`${containerClass} bg-white shadow-xl flex flex-col`}>
          <IframeStorefrontCanvas initialPath="/" />
        </div>
      </div>
    </div>
  );
}
