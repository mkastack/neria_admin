'use client';

import React from 'react';
import Link from 'next/link';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import {
  LayoutTemplate, Sparkles, ArrowUp, ArrowDown, Eye, EyeOff,
  Copy, Trash2, Edit3, Plus, ArrowRight, ExternalLink, Sliders
} from 'lucide-react';

export default function HomepageManagerPage() {
  const {
    config,
    toggleSectionEnabled,
    moveSectionUp,
    moveSectionDown,
    duplicateSection,
    deleteSection,
    addSection,
    setActiveSectionId
  } = useStorefrontCms();

  const sortedSections = [...config.homepageSections].sort((a, b) => a.position - b.position);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4F8] border border-[#FFD8EA] text-[#FF4FA3] text-xs font-bold uppercase tracking-wider mb-1.5">
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Storefront Architecture</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#263550] tracking-tight">
            Homepage Sections Management
          </h1>
          <p className="text-xs text-[#667085] mt-1">
            Reorder, enable/disable, and configure all content blocks appearing on the customer homepage.
          </p>
        </div>

        <Link
          href="/admin/website/editor"
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FF4FA3] hover:bg-[#E63E90] text-white text-xs font-bold shadow-md shadow-[#FF4FA3]/25 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Open in Visual Live Editor</span>
        </Link>
      </div>

      {/* Sections List Card */}
      <div className="rounded-3xl bg-white border border-[#F2F3F5] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#F2F3F5] bg-[#F8F8FA]/60 flex items-center justify-between">
          <span className="text-xs font-bold text-[#263550] uppercase tracking-wider">
            Active Layout Order ({sortedSections.length} Sections)
          </span>
          <span className="text-[11px] text-[#98A0AE]">
            Use arrows to reorder vertical presentation
          </span>
        </div>

        <div className="divide-y divide-[#F2F3F5]">
          {sortedSections.map((sec, idx) => (
            <div
              key={sec.id}
              className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors hover:bg-[#FFF4F8]/30 ${
                !sec.enabled ? 'opacity-50 bg-[#F8F8FA]/60' : ''
              }`}
            >
              {/* Left: Position Number & Title */}
              <div className="flex items-center gap-4 min-w-0">
                <span className="w-8 h-8 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] font-mono text-xs font-bold text-[#263550] flex items-center justify-center shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#263550] truncate">{sec.name}</h4>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#F8F8FA] text-[#667085] uppercase border border-[#DDE1E7]">
                      {sec.type.replace('_', ' ')}
                    </span>
                    {!sec.enabled && (
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#FEF3F2] text-[#B42318]">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#98A0AE] truncate mt-0.5">
                    {sec.content.heading || sec.content.collectionName || sec.content.smallLabel || 'Configurable component'}
                  </p>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Visual Editor Deep Link */}
                <Link
                  href={`/admin/website/editor?section=${sec.id}`}
                  onClick={() => setActiveSectionId(sec.id)}
                  title="Configure in Live Editor"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FFF4F8] hover:bg-[#FF4FA3] text-[#FF4FA3] hover:text-white text-xs font-bold border border-[#FFD8EA] transition-colors shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Edit Content</span>
                </Link>

                {/* Move Up */}
                <button
                  onClick={() => moveSectionUp(sec.id)}
                  disabled={idx === 0}
                  title="Move Up"
                  className="p-2 rounded-xl bg-[#F8F8FA] hover:bg-white text-[#263550] border border-[#F2F3F5] disabled:opacity-30 transition-colors"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                {/* Move Down */}
                <button
                  onClick={() => moveSectionDown(sec.id)}
                  disabled={idx === sortedSections.length - 1}
                  title="Move Down"
                  className="p-2 rounded-xl bg-[#F8F8FA] hover:bg-white text-[#263550] border border-[#F2F3F5] disabled:opacity-30 transition-colors"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                {/* Duplicate */}
                <button
                  onClick={() => duplicateSection(sec.id)}
                  title="Duplicate Section"
                  className="p-2 rounded-xl bg-[#F8F8FA] hover:bg-white text-[#263550] border border-[#F2F3F5] transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>

                {/* Show / Hide */}
                <button
                  onClick={() => toggleSectionEnabled(sec.id)}
                  title={sec.enabled ? 'Hide Section' : 'Show Section'}
                  className="p-2 rounded-xl bg-[#F8F8FA] hover:bg-white text-[#263550] border border-[#F2F3F5] transition-colors"
                >
                  {sec.enabled ? <Eye className="w-4 h-4 text-[#FF4FA3]" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteSection(sec.id)}
                  title="Delete Section"
                  className="p-2 rounded-xl bg-[#F8F8FA] hover:bg-[#FEF3F2] text-[#98A0AE] hover:text-[#B42318] border border-[#F2F3F5] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
