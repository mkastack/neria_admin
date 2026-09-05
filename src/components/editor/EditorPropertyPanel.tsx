'use client';

import React from 'react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { BunnyMascot } from '../ui/BunnyMascot';
import {
  Sliders, Sparkles, Image as ImageIcon, Smile, Type, Palette,
  AlignLeft, AlignCenter, AlignRight, Layers, Eye, Plus, Trash2,
  ExternalLink, RotateCcw, X, Check, ArrowRight, Link2
} from 'lucide-react';

export function EditorPropertyPanel() {
  const {
    config,
    activeSectionId,
    setActiveSectionId,
    activeElementKey,
    setActiveElementKey,
    updateSectionContent,
    updatePageText,
    resetSectionToDefault,
    resetSectionToPublished,
    resetThemeToPublished,
    resetNavigationToPublished,
    resetFooterToPublished,
    resetAnnouncementsToPublished,
    resetPopupToPublished,
    updateThemeColors,
    updateTypography,
    updateBrand,
    updateAnnouncements,
    updateNavigation,
    updateFooter,
    updatePopup,
    openEmojiPicker,
    openBunnyPicker,
    openMediaPicker
  } = useStorefrontCms();

  const { products } = useAdmin();

  if (!activeSectionId) {
    return (
      <aside className="w-88 bg-white border-l border-[#F2F3F5] p-6 flex flex-col items-center justify-center text-center text-[#98A0AE] shrink-0 select-none">
        <div className="w-12 h-12 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] flex items-center justify-center mb-3">
          <Sliders className="w-6 h-6 text-[#98A0AE]" />
        </div>
        <h4 className="text-xs font-bold text-[#263550]">No Section Selected</h4>
        <p className="text-[11px] text-[#98A0AE] mt-1 max-w-xs">
          Click any section in the center live preview or left sidebar to customize its properties.
        </p>
      </aside>
    );
  }

  const selectedSection = config.homepageSections.find(s => s.id === activeSectionId);
  // For per-page section ids (`pg-*`), there's no structured schema — edits
  // happen via click-to-edit on the live site and the postMessage round-trip
  // updates the matching `cmsKeyToValue` entry.
  const isPerPageSection = activeSectionId?.startsWith('pg-');

  return (
    <aside className="w-88 bg-white border-l border-[#F2F3F5] flex flex-col h-full shrink-0 select-none overflow-hidden shadow-xs">
      {/* Property Header */}
      <div className="px-5 py-4 border-b border-[#F2F3F5] bg-[#FFF4F8] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-white border border-[#FFD8EA] flex items-center justify-center text-[#FF4FA3]">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#263550]">
              {selectedSection ? selectedSection.name : (
                activeSectionId === 'navigation' ? 'Header Navigation' :
                activeSectionId === 'announcements' ? 'Announcements' :
                activeSectionId === 'theme' ? 'Theme Tokens' :
                activeSectionId === 'footer' ? 'Storefront Footer' : 'Properties'
              )}
            </h3>
            <span className="text-[10px] text-[#98A0AE] uppercase tracking-wider">
              {selectedSection?.type || activeSectionId}
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveSectionId(null)}
          className="p-1 rounded-lg text-[#98A0AE] hover:text-[#263550] hover:bg-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Inspector Body Controls */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
        {/* Per-page text editor — every `data-cms-key="pg-<page>-<field>"`
            attribute on the live storefront is editable here. The user
            selects a single key from the left sidebar (or clicks the
            element directly in the iframe), the field resolves to a
            (page, field) pair via the same `pg-<page>-<field>` split
            the commerce app uses, and we edit the matching
            `config.pageText[page][field]` value. Edits round-trip back
            to the iframe via `cms:apply` so the user sees the change
            in real time without a reload. */}
        {isPerPageSection && (
          <PerPageTextEditor
            activeSectionId={activeSectionId}
            activeElementKey={activeElementKey}
            setActiveElementKey={setActiveElementKey}
            setActiveSectionId={setActiveSectionId}
            pageText={config.pageText}
            updatePageText={updatePageText}
          />
        )}

        {/* ======================================================== */}
        {/* HERO SECTION INSPECTOR */}
        {/* ======================================================== */}
        {selectedSection?.type === 'hero' && (
          <div className="space-y-4">
            {/* Small Label */}
            <div>
              <label className="block font-bold text-[#263550] mb-1">Badge / Small Tag</label>
              <input
                type="text"
                value={selectedSection.content.smallLabel || ''}
                onChange={e => updateSectionContent(selectedSection.id, { smallLabel: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white"
              />
            </div>

            {/* Main Heading & Emoji */}
            <div>
              <label className="block font-bold text-[#263550] mb-1">Main Heading</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={selectedSection.content.mainHeading || ''}
                  onChange={e => updateSectionContent(selectedSection.id, { mainHeading: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white"
                />
                <button
                  onClick={() => openEmojiPicker(emoji => updateSectionContent(selectedSection.id, { headingEmoji: emoji }))}
                  title="Pick Emoji"
                  className="px-3 py-2 rounded-xl bg-[#FFF4F8] border border-[#FFD8EA] text-[#FF4FA3] font-bold text-sm hover:bg-[#FF4FA3] hover:text-white transition-colors"
                >
                  {selectedSection.content.headingEmoji || '🎀'}
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-bold text-[#263550] mb-1">Description</label>
              <textarea
                rows={3}
                value={selectedSection.content.description || ''}
                onChange={e => updateSectionContent(selectedSection.id, { description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white leading-relaxed"
              />
            </div>

            {/* Buttons */}
            <div className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-3">
              <h5 className="font-bold text-[#263550] uppercase tracking-wider text-[11px]">Primary Button</h5>
              <div>
                <label className="block text-[11px] text-[#667085] mb-1">Button Text</label>
                <input
                  type="text"
                  value={selectedSection.content.primaryButtonText || ''}
                  onChange={e => updateSectionContent(selectedSection.id, { primaryButtonText: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DDE1E7]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#667085] mb-1">Destination URL / Route</label>
                <input
                  type="text"
                  value={selectedSection.content.primaryButtonLink || ''}
                  onChange={e => updateSectionContent(selectedSection.id, { primaryButtonLink: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DDE1E7]"
                />
              </div>
            </div>

            {/* Media: Desktop & Mobile Imagery */}
            <div className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-3">
              <h5 className="font-bold text-[#263550] uppercase tracking-wider text-[11px]">Hero Media</h5>

              <div>
                <label className="block text-[11px] text-[#667085] mb-1">Desktop Campaign Image</label>
                <div className="flex gap-2 items-center">
                  <div className="w-12 h-10 rounded-lg overflow-hidden bg-[#DDE1E7] shrink-0 border border-[#C2C8D2]">
                    <img
                      src={selectedSection.content.desktopImage}
                      alt="Desktop Hero"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => openMediaPicker((url) => updateSectionContent(selectedSection.id, { desktopImage: url }))}
                    className="flex-1 py-1.5 rounded-lg bg-white border border-[#DDE1E7] hover:border-[#FF4FA3] text-xs font-semibold text-[#263550] transition-colors"
                  >
                    Change Image
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#667085] mb-1">Dark Overlay Opacity ({selectedSection.content.overlayOpacity}%)</label>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={selectedSection.content.overlayOpacity ?? 25}
                  onChange={e => updateSectionContent(selectedSection.id, { overlayOpacity: Number(e.target.value) })}
                  className="w-full accent-[#FF4FA3]"
                />
              </div>
            </div>

            {/* Layout Positioning */}
            <div className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-3">
              <h5 className="font-bold text-[#263550] uppercase tracking-wider text-[11px]">Text Alignment</h5>
              <div className="grid grid-cols-3 gap-1.5">
                {(['left', 'center', 'right'] as const).map(pos => (
                  <button
                    key={pos}
                    onClick={() => updateSectionContent(selectedSection.id, { textPosition: pos })}
                    className={`py-1.5 rounded-lg font-bold capitalize transition-colors ${
                      selectedSection.content.textPosition === pos
                        ? 'bg-[#263550] text-white shadow-xs'
                        : 'bg-white text-[#667085] hover:bg-[#FFF4F8]'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            {/* Bunny Mascot Option */}
            <div className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-[#263550] uppercase tracking-wider text-[11px]">Bunny Mascot</h5>
                <input
                  type="checkbox"
                  checked={selectedSection.content.showBunny}
                  onChange={e => updateSectionContent(selectedSection.id, { showBunny: e.target.checked })}
                  className="w-4 h-4 accent-[#FF4FA3]"
                />
              </div>

              {selectedSection.content.showBunny && (
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#FFD8EA] flex items-center justify-center">
                      <BunnyMascot size="sm" mood={selectedSection.content.bunnyMood || 'love'} />
                    </div>
                    <span className="font-bold capitalize text-[#263550]">
                      {selectedSection.content.bunnyMood || 'love'} Bunny
                    </span>
                  </div>
                  <button
                    onClick={() => openBunnyPicker((mood) => updateSectionContent(selectedSection.id, { bunnyMood: mood }))}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#DDE1E7] text-xs font-semibold text-[#FF4FA3]"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* NEW ARRIVALS & BEST SELLERS INSPECTOR */}
        {/* ======================================================== */}
        {(selectedSection?.type === 'new_arrivals' || selectedSection?.type === 'best_sellers') && (
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-[#263550] mb-1">Section Heading</label>
              <input
                type="text"
                value={selectedSection.content.heading || ''}
                onChange={e => updateSectionContent(selectedSection.id, { heading: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-[#263550] mb-1">Subtitle</label>
              <input
                type="text"
                value={selectedSection.content.subtitle || ''}
                onChange={e => updateSectionContent(selectedSection.id, { subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white"
              />
            </div>

            {/* Product Source Rules */}
            <div className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-3">
              <h5 className="font-bold text-[#263550] uppercase tracking-wider text-[11px]">Product Source</h5>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateSectionContent(selectedSection.id, { sourceType: 'automatic' })}
                  className={`py-1.5 rounded-lg font-bold text-xs transition-colors ${
                    selectedSection.content.sourceType === 'automatic'
                      ? 'bg-[#263550] text-white shadow-xs'
                      : 'bg-white text-[#667085] border border-[#DDE1E7]'
                  }`}
                >
                  Automatic Rule
                </button>
                <button
                  onClick={() => updateSectionContent(selectedSection.id, { sourceType: 'manual' })}
                  className={`py-1.5 rounded-lg font-bold text-xs transition-colors ${
                    selectedSection.content.sourceType === 'manual'
                      ? 'bg-[#263550] text-white shadow-xs'
                      : 'bg-white text-[#667085] border border-[#DDE1E7]'
                  }`}
                >
                  Manual Selection
                </button>
              </div>

              {selectedSection.content.sourceType === 'automatic' ? (
                <div>
                  <label className="block text-[11px] text-[#667085] mb-1">Rule</label>
                  <select
                    value={selectedSection.content.automaticRule || 'newest'}
                    onChange={e => updateSectionContent(selectedSection.id, { automaticRule: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DDE1E7]"
                  >
                    <option value="newest">Newest Added Products</option>
                    <option value="bestsellers">Most Purchased Best Sellers</option>
                    <option value="highest_rated">Highest Customer Rating</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  <span className="text-[11px] text-[#98A0AE] block">Select products to display:</span>
                  {products.slice(0, 8).map(prod => {
                    const isChecked = selectedSection.content.selectedProductIds?.includes(prod.id);
                    return (
                      <label
                        key={prod.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#F2F3F5] cursor-pointer hover:border-[#FFD8EA]"
                      >
                        <span className="truncate pr-2 font-medium text-[#263550]">{prod.name}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => {
                            const prev = selectedSection.content.selectedProductIds || [];
                            const next = e.target.checked
                              ? [...prev, prod.id]
                              : prev.filter((id: string) => id !== prod.id);
                            updateSectionContent(selectedSection.id, { selectedProductIds: next });
                          }}
                          className="w-4 h-4 accent-[#FF4FA3]"
                        />
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Display Toggles */}
            <div className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-2">
              <h5 className="font-bold text-[#263550] uppercase tracking-wider text-[11px]">Card Elements</h5>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Show Price</span>
                <input
                  type="checkbox"
                  checked={selectedSection.content.showPrice}
                  onChange={e => updateSectionContent(selectedSection.id, { showPrice: e.target.checked })}
                  className="w-4 h-4 accent-[#FF4FA3]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Show Quick Add Button</span>
                <input
                  type="checkbox"
                  checked={selectedSection.content.showQuickAdd}
                  onChange={e => updateSectionContent(selectedSection.id, { showQuickAdd: e.target.checked })}
                  className="w-4 h-4 accent-[#FF4FA3]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Show Wishlist Heart</span>
                <input
                  type="checkbox"
                  checked={selectedSection.content.showWishlist}
                  onChange={e => updateSectionContent(selectedSection.id, { showWishlist: e.target.checked })}
                  className="w-4 h-4 accent-[#FF4FA3]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Show New In Badge</span>
                <input
                  type="checkbox"
                  checked={selectedSection.content.showNewBadge}
                  onChange={e => updateSectionContent(selectedSection.id, { showNewBadge: e.target.checked })}
                  className="w-4 h-4 accent-[#FF4FA3]"
                />
              </label>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* FEATURED COLLECTION INSPECTOR */}
        {/* ======================================================== */}
        {selectedSection?.type === 'featured_collection' && (
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-[#263550] mb-1">Collection Name</label>
              <input
                type="text"
                value={selectedSection.content.collectionName || ''}
                onChange={e => updateSectionContent(selectedSection.id, { collectionName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-[#263550] mb-1">Description</label>
              <textarea
                rows={3}
                value={selectedSection.content.description || ''}
                onChange={e => updateSectionContent(selectedSection.id, { description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-3">
              <h5 className="font-bold text-[#263550] uppercase tracking-wider text-[11px]">Primary Image</h5>
              <div className="flex gap-2 items-center">
                <div className="w-12 h-10 rounded-lg overflow-hidden bg-[#DDE1E7] shrink-0">
                  <img
                    src={selectedSection.content.primaryImage}
                    alt="Capsule"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => openMediaPicker((url) => updateSectionContent(selectedSection.id, { primaryImage: url }))}
                  className="flex-1 py-1.5 rounded-lg bg-white border border-[#DDE1E7] text-xs font-semibold"
                >
                  Replace Image
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-3">
              <h5 className="font-bold text-[#263550] uppercase tracking-wider text-[11px]">Layout</h5>
              <div className="grid grid-cols-2 gap-2">
                {(['image_left', 'image_right', 'editorial_split'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => updateSectionContent(selectedSection.id, { layout: l })}
                    className={`py-1.5 rounded-lg font-bold text-xs capitalize transition-colors ${
                      selectedSection.content.layout === l
                        ? 'bg-[#263550] text-white'
                        : 'bg-white text-[#667085] border border-[#DDE1E7]'
                    }`}
                  >
                    {l.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* CATEGORIES SECTION INSPECTOR */}
        {/* ======================================================== */}
        {selectedSection?.type === 'categories' && (
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-[#263550] mb-1">Section Heading</label>
              <input
                type="text"
                value={selectedSection.content.heading || ''}
                onChange={e => updateSectionContent(selectedSection.id, { heading: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-[#263550] mb-1">Subtitle</label>
              <textarea
                rows={2}
                value={selectedSection.content.subtitle || ''}
                onChange={e => updateSectionContent(selectedSection.id, { subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white leading-relaxed"
              />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-2">
              <h5 className="font-bold text-[#263550] uppercase tracking-wider text-[11px]">Display</h5>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Show Item Counts</span>
                <input
                  type="checkbox"
                  checked={selectedSection.content.showCounts ?? true}
                  onChange={e => updateSectionContent(selectedSection.id, { showCounts: e.target.checked })}
                  className="w-4 h-4 accent-[#FF4FA3]"
                />
              </label>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* NERIA GIRL (UGC) SECTION INSPECTOR */}
        {/* ======================================================== */}
        {selectedSection?.type === 'neria_girl' && (
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-[#263550] mb-1">Section Heading</label>
              <input
                type="text"
                value={selectedSection.content.heading || ''}
                onChange={e => updateSectionContent(selectedSection.id, { heading: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-[#263550] mb-1">Subtitle</label>
              <textarea
                rows={2}
                value={selectedSection.content.subtitle || ''}
                onChange={e => updateSectionContent(selectedSection.id, { subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white leading-relaxed"
              />
            </div>
            <div>
              <label className="block font-bold text-[#263550] mb-1">Tagline</label>
              <input
                type="text"
                value={selectedSection.content.tagline || ''}
                onChange={e => updateSectionContent(selectedSection.id, { tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white"
              />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* JOURNAL SECTION INSPECTOR */}
        {/* ======================================================== */}
        {selectedSection?.type === 'journal' && (
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-[#263550] mb-1">Section Heading</label>
              <input
                type="text"
                value={selectedSection.content.heading || ''}
                onChange={e => updateSectionContent(selectedSection.id, { heading: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-[#263550] mb-1">Subtitle</label>
              <textarea
                rows={2}
                value={selectedSection.content.subtitle || ''}
                onChange={e => updateSectionContent(selectedSection.id, { subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white leading-relaxed"
              />
            </div>
            <div>
              <label className="block font-bold text-[#263550] mb-1">Article Count</label>
              <input
                type="number"
                min={1}
                max={12}
                value={selectedSection.content.articleCount ?? 3}
                onChange={e => updateSectionContent(selectedSection.id, { articleCount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white"
              />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BUNNY MOMENT SECTION INSPECTOR */}
        {/* ======================================================== */}
        {selectedSection?.type === 'bunny_moment' && (
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-[#263550] mb-1">Section Heading</label>
              <input
                type="text"
                value={selectedSection.content.heading || ''}
                onChange={e => updateSectionContent(selectedSection.id, { heading: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-[#263550] mb-1">Main Message</label>
              <textarea
                rows={3}
                value={selectedSection.content.message || ''}
                onChange={e => updateSectionContent(selectedSection.id, { message: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white leading-relaxed"
              />
            </div>
            <div>
              <label className="block font-bold text-[#263550] mb-1">Submessage</label>
              <textarea
                rows={2}
                value={selectedSection.content.submessage || ''}
                onChange={e => updateSectionContent(selectedSection.id, { submessage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white leading-relaxed"
              />
            </div>
            <div>
              <label className="block font-bold text-[#263550] mb-1">Button Text</label>
              <input
                type="text"
                value={selectedSection.content.buttonText || ''}
                onChange={e => updateSectionContent(selectedSection.id, { buttonText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-[#263550] mb-1">Button Link</label>
              <input
                type="text"
                value={selectedSection.content.buttonLink || ''}
                onChange={e => updateSectionContent(selectedSection.id, { buttonLink: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white"
              />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* NEWSLETTER SECTION INSPECTOR */}
        {/* ======================================================== */}
        {selectedSection?.type === 'newsletter' && (
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-[#263550] mb-1">Heading</label>
              <input
                type="text"
                value={selectedSection.content.heading || ''}
                onChange={e => updateSectionContent(selectedSection.id, { heading: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-[#263550] mb-1">Description</label>
              <textarea
                rows={3}
                value={selectedSection.content.description || ''}
                onChange={e => updateSectionContent(selectedSection.id, { description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white leading-relaxed"
              />
            </div>
            <div>
              <label className="block font-bold text-[#263550] mb-1">Input Placeholder</label>
              <input
                type="text"
                value={selectedSection.content.placeholder || ''}
                onChange={e => updateSectionContent(selectedSection.id, { placeholder: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-[#263550] mb-1">Button Text</label>
              <input
                type="text"
                value={selectedSection.content.buttonText || ''}
                onChange={e => updateSectionContent(selectedSection.id, { buttonText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-[#263550] mb-1">Success Message</label>
              <input
                type="text"
                value={selectedSection.content.successMessage || ''}
                onChange={e => updateSectionContent(selectedSection.id, { successMessage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white"
              />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* CUSTOM BANNER / TRUST STRIP INSPECTOR */}
        {/* ======================================================== */}
        {selectedSection?.type === 'custom_banner' && (
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-[#263550] mb-1">Heading</label>
              <input
                type="text"
                value={selectedSection.content.heading || ''}
                onChange={e => updateSectionContent(selectedSection.id, { heading: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-[#263550] mb-1">Body / Message</label>
              <textarea
                rows={2}
                value={selectedSection.content.message || ''}
                onChange={e => updateSectionContent(selectedSection.id, { message: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white leading-relaxed"
              />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-3">
              <h5 className="font-bold text-[#263550] uppercase tracking-wider text-[11px]">Card Items</h5>
              {(selectedSection.content.items || []).map((item: any, idx: number) => (
                <div key={item.id ?? idx} className="space-y-1.5 p-2 rounded-lg bg-white border border-[#F2F3F5]">
                  <input
                    type="text"
                    placeholder="Icon (Heart, Sparkles, Check…)"
                    value={item.icon || ''}
                    onChange={e => {
                      const next = [...(selectedSection.content.items || [])];
                      next[idx] = { ...next[idx], icon: e.target.value };
                      updateSectionContent(selectedSection.id, { items: next });
                    }}
                    className="w-full px-2 py-1 rounded-md border border-[#DDE1E7] text-[11px]"
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    value={item.title || ''}
                    onChange={e => {
                      const next = [...(selectedSection.content.items || [])];
                      next[idx] = { ...next[idx], title: e.target.value };
                      updateSectionContent(selectedSection.id, { items: next });
                    }}
                    className="w-full px-2 py-1 rounded-md border border-[#DDE1E7] text-[11px]"
                  />
                  <input
                    type="text"
                    placeholder="Subtitle"
                    value={item.subtitle || ''}
                    onChange={e => {
                      const next = [...(selectedSection.content.items || [])];
                      next[idx] = { ...next[idx], subtitle: e.target.value };
                      updateSectionContent(selectedSection.id, { items: next });
                    }}
                    className="w-full px-2 py-1 rounded-md border border-[#DDE1E7] text-[11px]"
                  />
                </div>
              ))}
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-3">
              <h5 className="font-bold text-[#263550] uppercase tracking-wider text-[11px]">Colors</h5>
              <div>
                <label className="block text-[11px] text-[#667085] mb-1">Background</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={selectedSection.content.bgColor || '#FFF4F8'}
                    onChange={e => updateSectionContent(selectedSection.id, { bgColor: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-[#DDE1E7]"
                  />
                  <input
                    type="text"
                    value={selectedSection.content.bgColor || ''}
                    onChange={e => updateSectionContent(selectedSection.id, { bgColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#DDE1E7] font-mono text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-[#667085] mb-1">Text</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={selectedSection.content.textColor || '#263550'}
                    onChange={e => updateSectionContent(selectedSection.id, { textColor: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-[#DDE1E7]"
                  />
                  <input
                    type="text"
                    value={selectedSection.content.textColor || ''}
                    onChange={e => updateSectionContent(selectedSection.id, { textColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#DDE1E7] font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* RICH TEXT SECTION INSPECTOR */}
        {/* ======================================================== */}
        {selectedSection?.type === 'rich_text' && (
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-[#263550] mb-1">Heading</label>
              <input
                type="text"
                value={selectedSection.content.heading || ''}
                onChange={e => updateSectionContent(selectedSection.id, { heading: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-[#263550] mb-1">Body (multi-line)</label>
              <textarea
                rows={6}
                value={selectedSection.content.body || ''}
                onChange={e => updateSectionContent(selectedSection.id, { body: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white leading-relaxed"
              />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-3">
              <h5 className="font-bold text-[#263550] uppercase tracking-wider text-[11px]">Colors</h5>
              <div>
                <label className="block text-[11px] text-[#667085] mb-1">Background</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={selectedSection.content.bgColor || '#FFF4F8'}
                    onChange={e => updateSectionContent(selectedSection.id, { bgColor: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-[#DDE1E7]"
                  />
                  <input
                    type="text"
                    value={selectedSection.content.bgColor || ''}
                    onChange={e => updateSectionContent(selectedSection.id, { bgColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#DDE1E7] font-mono text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-[#667085] mb-1">Text</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={selectedSection.content.textColor || '#263550'}
                    onChange={e => updateSectionContent(selectedSection.id, { textColor: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-[#DDE1E7]"
                  />
                  <input
                    type="text"
                    value={selectedSection.content.textColor || ''}
                    onChange={e => updateSectionContent(selectedSection.id, { textColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#DDE1E7] font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* THEME & BRAND TOKENS INSPECTOR */}
        {/* ======================================================== */}
        {activeSectionId === 'theme' && (
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA]">
              <h5 className="font-bold text-[#263550]">Design Tokens</h5>
              <p className="text-[11px] text-[#667085] mt-0.5">Colors are wired to live CSS custom variables.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-[#263550] mb-1">Primary Accent Pink / Blue</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={config.theme.colors.primary}
                    onChange={e => updateThemeColors({ primary: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-[#DDE1E7]"
                  />
                  <input
                    type="text"
                    value={config.theme.colors.primary}
                    onChange={e => updateThemeColors({ primary: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#263550] mb-1">Secondary Pastel Blue</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={config.theme.colors.secondary}
                    onChange={e => updateThemeColors({ secondary: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-[#DDE1E7]"
                  />
                  <input
                    type="text"
                    value={config.theme.colors.secondary}
                    onChange={e => updateThemeColors({ secondary: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#263550] mb-1">Background Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={config.theme.colors.background}
                    onChange={e => updateThemeColors({ background: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-[#DDE1E7]"
                  />
                  <input
                    type="text"
                    value={config.theme.colors.background}
                    onChange={e => updateThemeColors({ background: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reset Section to Last Published */}
        {selectedSection && (
          <div className="pt-4 border-t border-[#F2F3F5] space-y-2">
            <button
              onClick={() => resetSectionToPublished(selectedSection.id)}
              className="w-full py-2.5 rounded-xl bg-[#F8F8FA] hover:bg-[#FFF4F8] hover:text-[#FF4FA3] text-[#667085] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Revert to Last Published
            </button>
            <button
              onClick={() => resetSectionToDefault(selectedSection.id)}
              className="w-full py-2 rounded-xl text-[10px] font-medium text-[#98A0AE] hover:text-[#B42318] transition-colors"
            >
              Restore original template
            </button>
          </div>
        )}

        {/* Singleton editor panels — one per global section. The
            dedicated pages under /admin/website/announcements and
            /admin/website/popups are richer; these inline panels cover
            the global dropdown selections in the left sidebar. */}
        {activeSectionId === 'navigation' && (
          <SingletonEditor
            title="Header & Navigation"
            description="Logo text, menu items, and search placeholder. Open the global dropdown in the left sidebar to edit a specific item, or use the dedicated Website → Header page for the full editor."
            onReset={resetNavigationToPublished}
            advancedHref="/admin/website/editor"
          />
        )}
        {activeSectionId === 'footer' && (
          <SingletonEditor
            title="Storefront Footer"
            description="Brand bio, footer columns, social links, and copyright text. Use this to do a quick revert to the published version."
            onReset={resetFooterToPublished}
            advancedHref="/admin/website/editor"
          />
        )}
        {activeSectionId === 'announcements' && (
          <SingletonEditor
            title="Announcement Bar"
            description="Rotation interval and per-item colors. For a richer editor with a live preview, open Website → Announcements."
            onReset={resetAnnouncementsToPublished}
            advancedHref="/admin/website/announcements"
          >
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-[#263550] mb-1">Rotation Interval (seconds)</label>
                <input
                  type="number"
                  min={2}
                  max={60}
                  value={config.announcements.rotationInterval || 5}
                  onChange={e => updateAnnouncements(prev => ({ ...prev, rotationInterval: Math.max(2, Number(e.target.value) || 5) }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7]"
                />
              </div>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-bold text-[#263550]">Auto-rotate items</span>
                <input
                  type="checkbox"
                  checked={config.announcements.autoRotate}
                  onChange={e => updateAnnouncements(prev => ({ ...prev, autoRotate: e.target.checked }))}
                  className="w-4 h-4 accent-[#FF4FA3]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-bold text-[#263550]">Bar visible</span>
                <input
                  type="checkbox"
                  checked={config.announcements.enabled}
                  onChange={e => updateAnnouncements(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="w-4 h-4 accent-[#FF4FA3]"
                />
              </label>
            </div>
          </SingletonEditor>
        )}
        {activeSectionId === 'popup' && (
          <SingletonEditor
            title="Promotional Popup"
            description="Trigger, frequency, and colors. For a richer editor with a live preview, open Website → Promotional Popups."
            onReset={resetPopupToPublished}
            advancedHref="/admin/website/popups"
          >
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-bold text-[#263550]">Popup enabled</span>
                <input
                  type="checkbox"
                  checked={config.popup.active}
                  onChange={e => updatePopup({ active: e.target.checked })}
                  className="w-4 h-4 accent-[#FF4FA3]"
                />
              </label>
              <div>
                <label className="block font-bold text-[#263550] mb-1">Background</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={config.popup.bgColor}
                    onChange={e => updatePopup({ bgColor: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-[#DDE1E7]"
                  />
                  <input
                    type="text"
                    value={config.popup.bgColor}
                    onChange={e => updatePopup({ bgColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] font-mono text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-[#263550] mb-1">Text Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={config.popup.textColor}
                    onChange={e => updatePopup({ textColor: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-[#DDE1E7]"
                  />
                  <input
                    type="text"
                    value={config.popup.textColor}
                    onChange={e => updatePopup({ textColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] font-mono text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-[#263550] mb-1">Trigger</label>
                <select
                  value={config.popup.trigger}
                  onChange={e => updatePopup({ trigger: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7]"
                >
                  <option value="instant">Show immediately</option>
                  <option value="delay_5s">Show after 5s delay</option>
                  <option value="scroll_50">Show on 50% scroll</option>
                  <option value="exit_intent">Show on exit intent</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#263550] mb-1">Show Frequency</label>
                <select
                  value={config.popup.frequency}
                  onChange={e => updatePopup({ frequency: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7]"
                >
                  <option value="every_visit">Every visit</option>
                  <option value="once_per_day">Once per day</option>
                  <option value="once_per_week">Once per week</option>
                  <option value="once_ever">Only ever once</option>
                </select>
              </div>
            </div>
          </SingletonEditor>
        )}
      </div>
    </aside>
  );
}

/**
 * PerPageTextEditor
 *
 * The right-side editor for any selected `pg-<page>-<field>` element on
 * the live storefront. Shows the live current value (from the iframe's
 * most recent `cms:ready` payload), a `<textarea>` bound to the value
 * in `config.pageText[page][field]`, and a "Revert to default" link
 * that clears the override so the live site falls back to its
 * hardcoded string.
 *
 * Every keystroke:
 *   1. Pushes a `cms:apply` postMessage to the iframe so the live site
 *      shows the new text without reloading.
 *   2. Calls `updatePageText(page, field, value)` which writes through
 *      to Firestore (debounced via the auto-save loop).
 *
 * If the user has selected the page itself (e.g. `pg-shop`) but no
 * specific element, we render a small explainer so the panel isn't
 * blank.
 */
function PerPageTextEditor({
  activeSectionId,
  activeElementKey,
  setActiveElementKey,
  setActiveSectionId,
  pageText,
  updatePageText,
}: {
  activeSectionId: string;
  activeElementKey: string | null;
  setActiveElementKey: (k: string | null) => void;
  setActiveSectionId: (id: string | null) => void;
  pageText: any;
  updatePageText: (page: string, field: string, value: string) => void;
}) {
  // Resolve the active element into a (page, field) pair.
  // `pg-shop` alone → no field; `pg-shop-cat-all` → page=shop, field=cat-all
  const split = activeElementKey
    ? (() => {
        const m = activeElementKey.match(/^pg-([^-]+)-(.+)$/);
        if (!m) return null;
        return { page: m[1], field: m[2] };
      })()
    : null;

  const currentValue = split
    ? pageText?.[split.page]?.[split.field] ?? ''
    : '';

  // Push a `cms:apply` message to the iframe when the value changes so
  // the live site shows the new text without a reload. We debounce via
  // a short timeout (200ms is the same as the existing IframeStorefrontCanvas
  // push) to avoid spamming the iframe during fast typing.
  const lastPushedRef = React.useRef<string>('');
  React.useEffect(() => {
    if (!activeElementKey || !split) return;
    const iframe = document.querySelector<HTMLIFrameElement>(
      'iframe[title="Live storefront"]',
    );
    if (!iframe?.contentWindow) return;
    if (lastPushedRef.current === currentValue) return;
    const handle = setTimeout(() => {
      iframe.contentWindow?.postMessage(
        { type: 'cms:apply', key: activeElementKey, value: currentValue },
        '*',
      );
      lastPushedRef.current = currentValue;
    }, 200);
    return () => clearTimeout(handle);
  }, [activeElementKey, split, currentValue]);

  if (!activeElementKey || !split) {
    return (
      <div className="space-y-3">
        <div className="p-3 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA]">
          <h5 className="font-bold text-[#263550]">Per-page Text</h5>
          <p className="text-[11px] text-[#667085] mt-1 leading-relaxed">
            Select a single text element in the left sidebar or click one
            on the live preview to edit it. Every editable key on the
            current page is listed there.
          </p>
        </div>
        <div className="p-3 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#98A0AE] block">
            Page
          </span>
          <code className="text-[11px] text-[#263550] font-mono break-all">
            {activeSectionId}
          </code>
        </div>
      </div>
    );
  }

  const prettyPage = split.page.charAt(0).toUpperCase() + split.page.slice(1);
  const prettyField = split.field
    .split('-')
    .map((w, i) => (i === 0 ? w[0]?.toUpperCase() + w.slice(1) : w))
    .join(' ');

  return (
    <div className="space-y-3">
      <div className="p-3 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA]">
        <div className="flex items-center gap-1.5 mb-1">
          <Type className="w-3.5 h-3.5 text-[#FF4FA3]" />
          <h5 className="font-bold text-[#263550]">{prettyField}</h5>
        </div>
        <p className="text-[11px] text-[#667085] leading-relaxed">
          On the <span className="font-semibold text-[#263550]">{prettyPage}</span> page.
          Type to update the live site — saves automatically.
        </p>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#98A0AE]">
            Text
          </span>
          <button
            onClick={() => {
              updatePageText(split.page, split.field, '');
              setActiveElementKey(null);
            }}
            className="text-[10px] font-bold text-[#FF4FA3] hover:underline inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Revert to last published value
          </button>
        </div>
        <textarea
          value={currentValue}
          onChange={(e) =>
            updatePageText(split.page, split.field, e.target.value)
          }
          placeholder={`(using the hardcoded default from the live site)`}
          rows={4}
          className="w-full px-3 py-2 rounded-xl border border-[#F2F3F5] focus:border-[#FF4FA3] focus:ring-2 focus:ring-[#FF4FA3]/20 outline-none text-xs text-[#263550] resize-y min-h-[80px] transition-colors"
        />
      </div>

      <div className="p-3 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#98A0AE] block">
          CMS key
        </span>
        <code className="text-[11px] text-[#263550] font-mono break-all">
          {activeElementKey}
        </code>
      </div>

      <button
        onClick={() => {
          setActiveElementKey(null);
          setActiveSectionId(null);
        }}
        className="w-full py-2 rounded-xl bg-[#F8F8FA] hover:bg-[#FFF4F8] text-[#667085] hover:text-[#263550] text-[11px] font-semibold transition-colors"
      >
        Done editing
      </button>
    </div>
  );
}

/**
 * Inline right-side panel for the singleton sections that have
 * dedicated pages (Announcements, Promotional Popups, Header,
 * Footer). The dedicated page is always richer, so this panel
 * only exposes the controls the merchant can use without leaving
 * the editor — and links to the dedicated page for everything else.
 */
function SingletonEditor({
  title,
  description,
  onReset,
  advancedHref,
  children,
}: {
  title: string;
  description: string;
  onReset: () => void;
  advancedHref: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="p-3 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA]">
        <h5 className="font-bold text-[#263550]">{title}</h5>
        <p className="text-[11px] text-[#667085] mt-1 leading-relaxed">{description}</p>
      </div>
      {children}
      <div className="pt-3 border-t border-[#F2F3F5] space-y-2">
        <button
          onClick={onReset}
          className="w-full py-2.5 rounded-xl bg-[#F8F8FA] hover:bg-[#FFF4F8] hover:text-[#FF4FA3] text-[#667085] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Revert to Last Published
        </button>
        <a
          href={advancedHref}
          className="w-full py-2 rounded-xl text-[10px] font-medium text-[#98A0AE] hover:text-[#263550] transition-colors flex items-center justify-center gap-1.5"
        >
          <Link2 className="w-3 h-3" />
          Open the full editor
        </a>
      </div>
    </div>
  );
}
