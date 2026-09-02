'use client';

import React from 'react';
import Link from 'next/link';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { BunnyMascot } from '@/src/components/ui/BunnyMascot';
import {
  Globe, LayoutTemplate, Sparkles, Film, Menu as MenuIcon, Megaphone,
  Palette, FileText, ArrowUpRight, History, CheckCircle2, ShieldCheck,
  Eye, Monitor, Tablet, Smartphone, ArrowRight, Sliders, ExternalLink
} from 'lucide-react';

export default function WebsiteOverviewPage() {
  const { publishedConfig, config, isDirty, publishHistory, restoreVersion } = useStorefrontCms();

  const sectionsCount = config.homepageSections.filter(s => s.enabled).length;
  const announcementsCount = config.announcements.items.filter(a => a.active).length;

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
                  Version {publishedConfig.version || 28}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans text-white">
                Storefront & No-Code Website CMS
              </h1>
              <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
                Manage hero campaigns, product sections, navigation, branding, popups, and typography without coding.
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
              <span>View Live Website</span>
              <ExternalLink className="w-3 h-3 text-white/70" />
            </Link>

            <Link
              href="/admin/website/editor"
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#FF4FA3] hover:bg-[#E63E90] text-white text-xs font-extrabold shadow-lg shadow-[#FF4FA3]/30 transition-all hover:scale-102"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Live Visual Editor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid inside Hero */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div>
            <span className="text-[11px] text-white/60 font-medium">Active Sections</span>
            <p className="text-lg font-bold text-white mt-0.5">{sectionsCount} on Homepage</p>
          </div>
          <div>
            <span className="text-[11px] text-white/60 font-medium">Announcements</span>
            <p className="text-lg font-bold text-[#FFD8EA] mt-0.5">{announcementsCount} Rotating</p>
          </div>
          <div>
            <span className="text-[11px] text-white/60 font-medium">Promotional Popup</span>
            <p className="text-lg font-bold text-[#ABEFC6] mt-0.5">{config.popup.active ? '15% Off Active' : 'Disabled'}</p>
          </div>
          <div>
            <span className="text-[11px] text-white/60 font-medium">Theme Color</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="w-4 h-4 rounded-full border border-white/30"
                style={{ backgroundColor: config.theme.colors.primary }}
              />
              <span className="text-sm font-bold font-mono">{config.theme.colors.primary}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Management Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#263550] uppercase tracking-wider">
            Storefront Management Modules
          </h3>
          <span className="text-xs text-[#98A0AE]">12 modular sub-consoles</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Visual Live Editor',
              desc: 'Click-to-edit real storefront with device previews and property inspector',
              href: '/admin/website/editor',
              icon: Sparkles,
              badge: 'Primary',
              color: 'text-[#FF4FA3] bg-[#FFF4F8]'
            },
            {
              title: 'Homepage Sections',
              desc: 'Reorder, enable/disable, and edit all 10 homepage sections',
              href: '/admin/website/homepage',
              icon: LayoutTemplate,
              badge: `${sectionsCount} Active`,
              color: 'text-[#263550] bg-[#F8F8FA]'
            },
            {
              title: 'Pages & Content',
              desc: 'Manage About, Contact, FAQ accordion, Shipping, and Size Guide',
              href: '/admin/website/pages',
              icon: FileText,
              badge: `${config.pages.length} Pages`,
              color: 'text-[#263550] bg-[#F8F8FA]'
            },
            {
              title: 'Navigation & Mega Menu',
              desc: 'Header links, collection dropdowns, and featured campaign cards',
              href: '/admin/website/navigation',
              icon: MenuIcon,
              badge: 'Menu Builder',
              color: 'text-[#263550] bg-[#F8F8FA]'
            },
            {
              title: 'Announcements Bar',
              desc: 'Top marquee messages, promo emojis, rotation, and schedule',
              href: '/admin/website/announcements',
              icon: Megaphone,
              badge: `${announcementsCount} Active`,
              color: 'text-[#263550] bg-[#F8F8FA]'
            },
            {
              title: 'Promotional Popups',
              desc: 'Newsletter welcome gifts, 15% discount modal, exit triggers',
              href: '/admin/website/popups',
              icon: Sparkles,
              badge: config.popup.active ? 'Active' : 'Off',
              color: 'text-[#263550] bg-[#F8F8FA]'
            },
            {
              title: 'Brand Assets & Bunnies',
              desc: 'Logos, favicon, and the full Neria Bunny Mascot library',
              href: '/admin/website/brand',
              icon: BunnyMascot,
              isCustomIcon: true,
              badge: 'Mascots',
              color: 'text-[#263550] bg-[#F8F8FA]'
            },
            {
              title: 'Theme & CSS Tokens',
              desc: 'Brand pink, powder blue, surface colors, typography, button styles',
              href: '/admin/website/theme',
              icon: Palette,
              badge: 'CSS Variables',
              color: 'text-[#263550] bg-[#F8F8FA]'
            },
            {
              title: 'Storefront Footer',
              desc: 'Multi-column links, social handles, concierge info, payment badges',
              href: '/admin/website/footer',
              icon: LayoutTemplate,
              badge: 'Footer CMS',
              color: 'text-[#263550] bg-[#F8F8FA]'
            },
            {
              title: 'SEO & Search Previews',
              desc: 'Google SERP simulation, meta descriptions, social OG tags, health audit',
              href: '/admin/website/seo',
              icon: Globe,
              badge: '98% Score',
              color: 'text-[#263550] bg-[#F8F8FA]'
            },
            {
              title: 'Media Library',
              desc: 'High-res lookbook assets, campaign uploads, file usage tracker',
              href: '/admin/website/media',
              icon: Film,
              badge: 'Cloud Storage',
              color: 'text-[#263550] bg-[#F8F8FA]'
            },
            {
              title: 'Publish History',
              desc: 'Audit changelogs, version snapshots, and one-click rollback',
              href: '/admin/website/history',
              icon: History,
              badge: `v${publishedConfig.version || 28}`,
              color: 'text-[#263550] bg-[#F8F8FA]'
            }
          ].map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <Link
                key={idx}
                href={mod.href}
                className="group p-5 rounded-3xl bg-white border border-[#F2F3F5] hover:border-[#FFD8EA] hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${mod.color} border border-[#FFD8EA]/40 shadow-2xs group-hover:scale-105 transition-transform`}>
                      {mod.isCustomIcon ? <BunnyMascot size="sm" mood="happy" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF4F8] text-[#FF4FA3] border border-[#FFD8EA]">
                      {mod.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#263550] group-hover:text-[#FF4FA3] transition-colors">
                    {mod.title}
                  </h4>
                  <p className="text-xs text-[#667085] mt-1 line-clamp-2 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-[#F8F8FA] flex items-center justify-between text-xs font-bold text-[#FF4FA3]">
                  <span>Manage</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. Recent Publishing Activity & Rollback Log */}
      <div className="rounded-3xl bg-white p-6 border border-[#F2F3F5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#FF4FA3]" />
            <h3 className="text-sm font-bold text-[#263550]">Recent Storefront Releases</h3>
          </div>
          <Link href="/admin/website/history" className="text-xs font-bold text-[#FF4FA3] hover:underline">
            View Full History →
          </Link>
        </div>

        <div className="divide-y divide-[#F2F3F5]">
          {publishHistory.slice(0, 3).map((v) => (
            <div key={v.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

              <div className="flex items-center gap-2">
                <button
                  onClick={() => restoreVersion(v.id)}
                  className="px-3 py-1.5 rounded-xl bg-[#F8F8FA] hover:bg-[#FFF4F8] hover:text-[#FF4FA3] text-xs font-semibold text-[#263550] border border-[#F2F3F5] transition-colors"
                >
                  Restore This Version
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
