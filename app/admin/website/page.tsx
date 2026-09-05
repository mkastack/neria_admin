'use client';

import React from 'react';
import Link from 'next/link';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { BunnyMascot } from '@/src/components/ui/BunnyMascot';
import {
  Sparkles, Eye, ArrowRight, ExternalLink, History, Globe,
} from 'lucide-react';

/**
 * Website overview — the entry point for the storefront CMS. The user
 * said the old per-page sub-consoles (Homepage Sections, Pages &
 * Content, Navigation, Theme, etc.) should be deleted; everything now
 * flows through the live visual editor at `/admin/website/editor`.
 *
 * This page is intentionally minimal: it shows the live version, links
 * to the editor and the live storefront, and surfaces the most recent
 * publish history. It does NOT link to any deleted sub-page.
 */
export default function WebsiteOverviewPage() {
  const { publishedConfig, publishHistory, restoreVersion } = useStorefrontCms();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Top Hero Overview Card */}
      <div className="rounded-3xl bg-gradient-to-r from-[#263550] to-[#1D2939] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF4FA3]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-md">
              <BunnyMascot size="sm" mood="celebration" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold bg-[#ECFDF3] text-[#027A48]">
                  <span className="w-2 h-2 rounded-full bg-[#12B76A] animate-ping" />
                  Storefront LIVE
                </span>
                <span className="text-xs text-white/60 font-mono">
                  Version {publishedConfig.version || 1}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans text-white">
                Edit the live storefront
              </h1>
              <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
                Open the visual editor to click any text on the live site and change it. Edits save automatically and ship to the storefront within seconds.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/preview"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all border border-white/20"
            >
              <Eye className="w-4 h-4" />
              <span>View Live Site</span>
              <ExternalLink className="w-3 h-3 text-white/70" />
            </Link>

            <Link
              href="/admin/website/editor"
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#FF4FA3] hover:bg-[#E63E90] text-white text-xs font-extrabold shadow-lg shadow-[#FF4FA3]/30 transition-all hover:scale-102"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Visual Editor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Two-card grid: editor + live preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/website/editor"
          className="group p-6 rounded-3xl bg-white border border-[#F2F3F5] hover:border-[#FF4FA3] hover:shadow-lg transition-all flex flex-col"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#FF4FA3]" />
            <h3 className="text-sm font-extrabold text-[#263550] group-hover:text-[#FF4FA3] transition-colors">
              Visual Editor
            </h3>
          </div>
          <p className="text-xs text-[#667085] leading-relaxed flex-1">
            Click any element on the live site to edit it. Singletons (announcement bar,
            popup, navigation, footer, theme) are always available; per-page text on the
            currently loaded route appears as a read-only list in the sidebar.
          </p>
          <div className="pt-3 mt-3 border-t border-[#F8F8FA] flex items-center justify-between text-xs font-bold text-[#FF4FA3]">
            <span>Open editor</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/preview"
          target="_blank"
          className="group p-6 rounded-3xl bg-white border border-[#F2F3F5] hover:border-[#FF4FA3] hover:shadow-lg transition-all flex flex-col"
        >
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-[#FF4FA3]" />
            <h3 className="text-sm font-extrabold text-[#263550] group-hover:text-[#FF4FA3] transition-colors">
              Live Storefront
            </h3>
          </div>
          <p className="text-xs text-[#667085] leading-relaxed flex-1">
            See the published version of the storefront in a new tab. This is what real
            visitors are seeing right now.
          </p>
          <div className="pt-3 mt-3 border-t border-[#F8F8FA] flex items-center justify-between text-xs font-bold text-[#FF4FA3]">
            <span>Open storefront</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>

      {/* 3. Recent Publishing Activity */}
      <div className="rounded-3xl bg-white p-6 border border-[#F2F3F5] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#FF4FA3]" />
          <h3 className="text-sm font-bold text-[#263550]">Recent Releases</h3>
        </div>

        {publishHistory.length === 0 ? (
          <p className="text-xs text-[#98A0AE]">No releases yet.</p>
        ) : (
          <div className="divide-y divide-[#F2F3F5]">
            {publishHistory.slice(0, 5).map((v) => (
              <div
                key={v.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-[#263550]">Version {v.versionNumber}</span>
                    <span className="text-xs text-[#98A0AE]">• {v.publishedAt}</span>
                    <span className="text-[11px] text-[#FF4FA3] font-semibold">by {v.publishedBy}</span>
                  </div>
                  <p className="text-xs text-[#667085] mt-1 line-clamp-1">
                    {v.changeSummary.join(' • ')}
                  </p>
                </div>

                <button
                  onClick={() => restoreVersion(v.id)}
                  className="px-3 py-1.5 rounded-xl bg-[#F8F8FA] hover:bg-[#FFF4F8] hover:text-[#FF4FA3] text-xs font-semibold text-[#263550] border border-[#F2F3F5] transition-colors"
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
