'use client';

import React, { useState } from 'react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { SectionType } from '@/src/lib/types';
import { BunnyMascot } from '../ui/BunnyMascot';
import {
  Layers, Plus, Palette, Film, GripVertical, Eye, EyeOff, Trash2,
  Copy, ArrowUp, ArrowDown, Sparkles, ChevronRight, LayoutTemplate,
  Shirt, Star, HeartHandshake, BookOpen, Mail, Image as ImageIcon, Type
} from 'lucide-react';

export function EditorLeftSidebar() {
  const {
    config,
    activeSectionId,
    setActiveSectionId,
    toggleSectionEnabled,
    moveSectionUp,
    moveSectionDown,
    duplicateSection,
    deleteSection,
    addSection,
    openMediaPicker,
    openBunnyPicker
  } = useStorefrontCms();

  const [activeTab, setActiveTab] = useState<'sections' | 'add' | 'brand' | 'media'>('sections');

  const sortedSections = [...config.homepageSections].sort((a, b) => a.position - b.position);

  const availableBlocks: Array<{ type: SectionType; name: string; icon: any; desc: string }> = [
    { type: 'hero', name: 'Hero Banner', icon: LayoutTemplate, desc: 'Full-bleed luxury campaign banner with CTA buttons' },
    { type: 'categories', name: 'Shop Categories', icon: Shirt, desc: 'Visual fashion cards grid with item counts' },
    { type: 'new_arrivals', name: 'New Arrivals', icon: Sparkles, desc: 'Fresh atelier pieces with new arrival badges' },
    { type: 'featured_collection', name: 'Featured Collection', icon: ImageIcon, desc: 'Editorial split spotlight with secondary image' },
    { type: 'best_sellers', name: 'Best Sellers', icon: Star, desc: 'Automated highest-rated & most-purchased pieces' },
    { type: 'neria_girl', name: 'Seen On Neria Girls', icon: HeartHandshake, desc: 'UGC social snapshots with customer notes' },
    { type: 'journal', name: 'Neria Journal', icon: BookOpen, desc: 'Atelier stories, editorial musings and style guides' },
    { type: 'bunny_moment', name: 'Bunny Mascot Moment', icon: Sparkles, desc: 'Signature brand philosophy and keepsake packaging' },
    { type: 'newsletter', name: 'Newsletter Club', icon: Mail, desc: '15% off signup banner with sweet email input' },
    { type: 'custom_banner', name: 'Custom Banner', icon: ImageIcon, desc: 'Promo message with background color and link' },
    { type: 'rich_text', name: 'Atelier Rich Text', icon: Type, desc: 'Editorial typography statement section' }
  ];

  return (
    <aside className="w-80 bg-white border-r border-[#F2F3F5] flex flex-col h-full shrink-0 select-none overflow-hidden shadow-xs">
      {/* Tab Navigation */}
      <div className="grid grid-cols-4 p-1.5 border-b border-[#F2F3F5] bg-[#F8F8FA]">
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex flex-col items-center py-2 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === 'sections'
              ? 'bg-white text-[#263550] shadow-xs'
              : 'text-[#98A0AE] hover:text-[#263550]'
          }`}
        >
          <Layers className="w-4 h-4 mb-0.5 text-[#FF4FA3]" />
          <span>Sections</span>
        </button>

        <button
          onClick={() => setActiveTab('add')}
          className={`flex flex-col items-center py-2 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === 'add'
              ? 'bg-white text-[#263550] shadow-xs'
              : 'text-[#98A0AE] hover:text-[#263550]'
          }`}
        >
          <Plus className="w-4 h-4 mb-0.5 text-[#FF4FA3]" />
          <span>Add Block</span>
        </button>

        <button
          onClick={() => setActiveTab('brand')}
          className={`flex flex-col items-center py-2 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === 'brand'
              ? 'bg-white text-[#263550] shadow-xs'
              : 'text-[#98A0AE] hover:text-[#263550]'
          }`}
        >
          <Palette className="w-4 h-4 mb-0.5 text-[#FF4FA3]" />
          <span>Theme</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`flex flex-col items-center py-2 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === 'media'
              ? 'bg-white text-[#263550] shadow-xs'
              : 'text-[#98A0AE] hover:text-[#263550]'
          }`}
        >
          <Film className="w-4 h-4 mb-0.5 text-[#FF4FA3]" />
          <span>Assets</span>
        </button>
      </div>

      {/* Tab 1: Sections Hierarchy Tree */}
      {activeTab === 'sections' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#98A0AE]">
              Homepage Layout ({sortedSections.length})
            </span>
            <button
              onClick={() => setActiveTab('add')}
              className="text-xs font-bold text-[#FF4FA3] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          {/* Header Item */}
          <div
            onClick={() => setActiveSectionId('navigation')}
            className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
              activeSectionId === 'navigation'
                ? 'bg-[#FFF4F8] border-[#FFD8EA] shadow-xs font-bold text-[#FF4FA3]'
                : 'bg-white border-[#F2F3F5] text-[#263550] hover:bg-[#F8F8FA]'
            }`}
          >
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#FF4FA3]" />
              <span>Header & Navigation</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#98A0AE]" />
          </div>

          {/* Announcement Bar */}
          <div
            onClick={() => setActiveSectionId('announcements')}
            className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
              activeSectionId === 'announcements'
                ? 'bg-[#FFF4F8] border-[#FFD8EA] shadow-xs font-bold text-[#FF4FA3]'
                : 'bg-white border-[#F2F3F5] text-[#263550] hover:bg-[#F8F8FA]'
            }`}
          >
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#CBE7FA]" />
              <span>Announcement Bar</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#98A0AE]" />
          </div>

          {/* Body Sections List */}
          <div className="space-y-1.5 pt-2 border-t border-[#F2F3F5]">
            {sortedSections.map((sec, idx) => {
              const isSelected = activeSectionId === sec.id;
              return (
                <div
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`group p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#FFF4F8] border-[#FF4FA3] shadow-xs'
                      : 'bg-white border-[#F2F3F5] hover:border-[#FFD8EA] hover:bg-[#F8F8FA]'
                  } ${!sec.enabled ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-mono text-[#98A0AE] w-4">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-xs truncate ${isSelected ? 'font-bold text-[#263550]' : 'font-medium text-[#475467]'}`}>
                      {sec.name}
                    </span>
                  </div>

                  {/* Actions on hover */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSectionEnabled(sec.id);
                      }}
                      title={sec.enabled ? 'Hide Section' : 'Show Section'}
                      className="p-1 rounded-lg hover:bg-white text-[#98A0AE] hover:text-[#263550]"
                    >
                      {sec.enabled ? <Eye className="w-3.5 h-3.5 text-[#FF4FA3]" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSectionUp(sec.id);
                      }}
                      disabled={idx === 0}
                      title="Move Up"
                      className="p-1 rounded-lg hover:bg-white text-[#98A0AE] hover:text-[#263550] disabled:opacity-20"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSectionDown(sec.id);
                      }}
                      disabled={idx === sortedSections.length - 1}
                      title="Move Down"
                      className="p-1 rounded-lg hover:bg-white text-[#98A0AE] hover:text-[#263550] disabled:opacity-20"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Item */}
          <div
            onClick={() => setActiveSectionId('footer')}
            className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
              activeSectionId === 'footer'
                ? 'bg-[#FFF4F8] border-[#FFD8EA] shadow-xs font-bold text-[#FF4FA3]'
                : 'bg-white border-[#F2F3F5] text-[#263550] hover:bg-[#F8F8FA]'
            }`}
          >
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#263550]" />
              <span>Storefront Footer</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#98A0AE]" />
          </div>
        </div>
      )}

      {/* Tab 2: Add New Section Blocks */}
      {activeTab === 'add' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="px-1 mb-2">
            <h4 className="text-xs font-bold text-[#263550]">Add Pre-designed Section</h4>
            <p className="text-[11px] text-[#98A0AE]">Choose a coded, responsive Neria block</p>
          </div>

          <div className="space-y-2">
            {availableBlocks.map(block => {
              const Icon = block.icon;
              return (
                <div
                  key={block.type}
                  onClick={() => {
                    addSection(block.type, block.name);
                    setActiveTab('sections');
                  }}
                  className="p-3 rounded-2xl bg-white border border-[#F2F3F5] hover:border-[#FFD8EA] hover:shadow-md transition-all cursor-pointer group flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#FFF4F8] text-[#FF4FA3] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-[#263550] group-hover:text-[#FF4FA3] transition-colors">
                      {block.name}
                    </h5>
                    <p className="text-[11px] text-[#98A0AE] line-clamp-2 mt-0.5">
                      {block.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Brand & Theme Quick Access */}
      {activeTab === 'brand' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="p-3 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA]">
            <h5 className="text-xs font-bold text-[#263550]">Theme & Token Architecture</h5>
            <p className="text-[11px] text-[#667085] mt-0.5">
              Editing theme variables updates the entire storefront in real-time.
            </p>
          </div>

          <button
            onClick={() => setActiveSectionId('theme')}
            className="w-full py-2.5 rounded-xl bg-[#263550] hover:bg-[#FF4FA3] text-white text-xs font-bold transition-colors shadow-xs"
          >
            Open Theme & Color Inspector
          </button>
        </div>
      )}

      {/* Tab 4: Assets & Media */}
      {activeTab === 'media' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="p-4 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] flex items-center justify-center mb-2">
              <BunnyMascot size="sm" mood="celebration" />
            </div>
            <h5 className="text-xs font-bold text-[#263550]">Neria Brand Assets</h5>
            <p className="text-[11px] text-[#98A0AE] mt-1 mb-3">
              Browse your bunny mascots, campaign lookbooks, and high-res imagery.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => openMediaPicker(() => {})}
                className="w-full py-2 rounded-xl bg-white border border-[#DDE1E7] hover:border-[#FF4FA3] text-xs font-bold text-[#263550] transition-colors"
              >
                Browse Media Library
              </button>
              <button
                onClick={() => openBunnyPicker(() => {})}
                className="w-full py-2 rounded-xl bg-[#FF4FA3] hover:bg-[#E63E90] text-white text-xs font-bold transition-colors shadow-xs"
              >
                Browse Bunny Mascots
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
