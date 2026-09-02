'use client';

import React from 'react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { StorefrontHeader } from './StorefrontHeader';
import { StorefrontHero } from './StorefrontHero';
import { StorefrontCategories } from './StorefrontCategories';
import { StorefrontProductGrid } from './StorefrontProductGrid';
import { StorefrontFeaturedCollection } from './StorefrontFeaturedCollection';
import { StorefrontNeriaGirl } from './StorefrontNeriaGirl';
import { StorefrontJournal } from './StorefrontJournal';
import { StorefrontNewsletter } from './StorefrontNewsletter';
import { StorefrontFooter } from './StorefrontFooter';
import { StorefrontPopup } from './StorefrontPopup';
import { StorefrontPagesView } from './StorefrontPagesView';
import { BunnyMascot } from '../ui/BunnyMascot';
import {
  Edit3, ArrowUp, ArrowDown, Copy, EyeOff, Trash2, Sparkles, Plus, Eye
} from 'lucide-react';

interface StorefrontRendererProps {
  isEditorMode?: boolean;
}

export function StorefrontRenderer({ isEditorMode = false }: StorefrontRendererProps) {
  const {
    config,
    activePageId,
    activeSectionId,
    setActiveSectionId,
    moveSectionUp,
    moveSectionDown,
    duplicateSection,
    toggleSectionEnabled,
    deleteSection,
    previewMode
  } = useStorefrontCms();

  // If viewing standard page (About, FAQ, Shipping, Size Guide, etc.)
  const activeCustomPage = config.pages.find(p => p.slug === activePageId || p.id === activePageId);

  // Enabled and sorted homepage sections
  const sortedSections = [...config.homepageSections].sort((a, b) => a.position - b.position);

  return (
    <div className="w-full bg-[#FFF4F8] min-h-screen flex flex-col antialiased relative">
      {/* 1. Storefront Header */}
      <div
        className={`relative ${isEditorMode && !previewMode ? 'group/header hover:ring-2 hover:ring-[#FF4FA3]/50 cursor-pointer' : ''}`}
        onClick={() => isEditorMode && setActiveSectionId('navigation')}
      >
        <StorefrontHeader isEditorMode={isEditorMode && !previewMode} />
        {isEditorMode && !previewMode && (
          <div className="absolute top-2 right-4 hidden group-hover/header:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#263550] text-white text-[10px] font-bold shadow-md z-50 pointer-events-none">
            <Edit3 className="w-3 h-3 text-[#FF4FA3]" />
            <span>Edit Navigation Bar</span>
          </div>
        )}
      </div>

      {/* 2. Main Body Content (Homepage Sections or Specific Page) */}
      <main className="flex-1 w-full flex flex-col">
        {activePageId === 'homepage' ? (
          sortedSections.map((sec, idx) => {
            if (!sec.enabled && (!isEditorMode || previewMode)) return null;

            const isSelected = activeSectionId === sec.id && isEditorMode && !previewMode;

            return (
              <div
                key={sec.id}
                id={sec.id}
                onClick={() => {
                  if (isEditorMode && !previewMode) {
                    setActiveSectionId(sec.id);
                  }
                }}
                className={`relative group/sec transition-all duration-200 ${
                  isEditorMode && !previewMode
                    ? `cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-[#FF4FA3] shadow-lg z-20'
                          : 'hover:ring-1.5 hover:ring-[#FF4FA3]/60'
                      }`
                    : ''
                } ${!sec.enabled ? 'opacity-40 grayscale-40' : ''}`}
              >
                {/* Floating Section Toolbar in Editor Mode */}
                {isEditorMode && !previewMode && (
                  <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none z-30">
                    {/* Section Name Pill */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#263550] text-white text-[11px] font-bold shadow-lg pointer-events-auto">
                      <span className="w-2 h-2 rounded-full bg-[#FF4FA3]" />
                      <span>{sec.name}</span>
                      {!sec.enabled && <span className="text-[10px] text-[#FFD8EA]">(Hidden)</span>}
                    </div>

                    {/* Section Actions Bar */}
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-[#263550] text-white shadow-xl pointer-events-auto opacity-0 group-hover/sec:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSectionId(sec.id);
                        }}
                        title="Edit Section Settings"
                        className="p-1.5 rounded-lg hover:bg-white/20 text-[#FFD8EA] hover:text-white"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSectionUp(sec.id);
                        }}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1.5 rounded-lg hover:bg-white/20 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSectionDown(sec.id);
                        }}
                        disabled={idx === sortedSections.length - 1}
                        title="Move Down"
                        className="p-1.5 rounded-lg hover:bg-white/20 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateSection(sec.id);
                        }}
                        title="Duplicate Section"
                        className="p-1.5 rounded-lg hover:bg-white/20"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSectionEnabled(sec.id);
                        }}
                        title={sec.enabled ? 'Hide Section' : 'Show Section'}
                        className="p-1.5 rounded-lg hover:bg-white/20 text-[#FFD8EA]"
                      >
                        {sec.enabled ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(sec.id);
                        }}
                        title="Delete Section"
                        className="p-1.5 rounded-lg hover:bg-[#FF4FA3] text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Specific Section Rendering */}
                {sec.type === 'hero' && (
                  <StorefrontHero content={sec.content} isEditorMode={isEditorMode && !previewMode} />
                )}
                {sec.type === 'categories' && (
                  <StorefrontCategories content={sec.content} isEditorMode={isEditorMode && !previewMode} />
                )}
                {sec.type === 'new_arrivals' && (
                  <StorefrontProductGrid sectionId={sec.id} content={sec.content} isEditorMode={isEditorMode && !previewMode} />
                )}
                {sec.type === 'featured_collection' && (
                  <StorefrontFeaturedCollection content={sec.content} isEditorMode={isEditorMode && !previewMode} />
                )}
                {sec.type === 'best_sellers' && (
                  <StorefrontProductGrid sectionId={sec.id} content={sec.content} isEditorMode={isEditorMode && !previewMode} />
                )}
                {sec.type === 'neria_girl' && (
                  <StorefrontNeriaGirl content={sec.content} isEditorMode={isEditorMode && !previewMode} />
                )}
                {sec.type === 'journal' && (
                  <StorefrontJournal content={sec.content} isEditorMode={isEditorMode && !previewMode} />
                )}
                {sec.type === 'bunny_moment' && (
                  <section
                    style={{ backgroundColor: sec.content.bgColor || '#FFF4F8' }}
                    className="py-16 text-center select-none"
                  >
                    <div className="max-w-2xl mx-auto px-4 space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-3xl bg-white border border-[#FFD8EA] flex items-center justify-center shadow-sm">
                        <BunnyMascot size="md" mood={sec.content.bunnyMood || 'celebration'} />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-[#263550]">{sec.content.heading}</h3>
                      <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">{sec.content.message}</p>
                      <button className="px-6 py-3 rounded-full bg-[#FF4FA3] text-white font-bold text-xs shadow-md">
                        {sec.content.buttonText || 'Discover Story'}
                      </button>
                    </div>
                  </section>
                )}
                {sec.type === 'newsletter' && (
                  <StorefrontNewsletter content={sec.content} isEditorMode={isEditorMode && !previewMode} />
                )}
              </div>
            );
          })
        ) : activeCustomPage ? (
          <StorefrontPagesView page={activeCustomPage} isEditorMode={isEditorMode && !previewMode} />
        ) : (
          <div className="py-24 text-center">
            <h3 className="text-xl font-bold text-[#263550]">Page not found</h3>
          </div>
        )}
      </main>

      {/* 3. Storefront Footer */}
      <StorefrontFooter isEditorMode={isEditorMode && !previewMode} />

      {/* 4. Promotional Welcome Popup (Only on live customer view or preview mode) */}
      {(!isEditorMode || previewMode) && <StorefrontPopup forceShow={false} />}
    </div>
  );
}
