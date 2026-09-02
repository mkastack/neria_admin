'use client';

import React from 'react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { BunnyMascot } from '../ui/BunnyMascot';
import {
  Sliders, Sparkles, Image as ImageIcon, Smile, Type, Palette,
  AlignLeft, AlignCenter, AlignRight, Layers, Eye, Plus, Trash2,
  ExternalLink, RotateCcw, X, Check, ArrowRight
} from 'lucide-react';

export function EditorPropertyPanel() {
  const {
    config,
    activeSectionId,
    setActiveSectionId,
    updateSectionContent,
    resetSectionToDefault,
    updateThemeColors,
    updateTypography,
    updateBrand,
    updateAnnouncements,
    updateNavigation,
    updateFooter,
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

        {/* Reset Section to Default */}
        {selectedSection && (
          <div className="pt-4 border-t border-[#F2F3F5]">
            <button
              onClick={() => resetSectionToDefault(selectedSection.id)}
              className="w-full py-2.5 rounded-xl bg-[#F8F8FA] hover:bg-[#FEF3F2] hover:text-[#B42318] text-[#667085] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Section to Default
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
