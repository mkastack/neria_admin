'use client';

import React, { useState } from 'react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { Search, X, Sparkles, Heart, Shirt, PartyPopper, Trees, Star, ArrowRight, Smile, Cat, Hash } from 'lucide-react';

const EMOJI_CATEGORIES = [
  {
    name: 'Frequently Used',
    icon: Sparkles,
    emojis: ['♡', '♥', '✨', '🎀', '🐰', '🤍', '🩵', '🛍️', '⭐', '🌸', '💌', '☁️', '💎', '🥂', '🕊️']
  },
  {
    name: 'Hearts & Love',
    icon: Heart,
    emojis: ['♡', '♥', '🤍', '🩵', '💖', '💗', '💓', '💕', '💞', '💘', '💝', '❤️', '💌', '🫶', '❦']
  },
  {
    name: 'Fashion & Aesthetic',
    icon: Shirt,
    emojis: ['🎀', '🛍️', '👗', '👠', '👒', '💄', '💍', '👛', '👡', '💎', '💅', '✨', '🩰', '🪞', '👑']
  },
  {
    name: 'Bunnies & Animals',
    icon: Cat,
    emojis: ['🐰', '🐇', '🐾', '🕊️', '🦋', '🦢', '🦩', '🧸', '🐣', '🪶']
  },
  {
    name: 'Celebration & Drops',
    icon: PartyPopper,
    emojis: ['✨', '⭐', '🎉', '🥂', '🍾', '🎊', '🎈', '🪄', '💫', '🌟', '🎇', '🍰', '🎁', '💐']
  },
  {
    name: 'Nature & Petals',
    icon: Trees,
    emojis: ['🌸', '🌺', '🌷', '🌹', '🌻', '🌼', '🌿', '🍃', '☁️', '🌙', '🌊', '☀️', '🫧', '🪐']
  },
  {
    name: 'Arrows & Symbols',
    icon: ArrowRight,
    emojis: ['→', '⟶', '➜', '➔', '✦', '✧', '★', '☆', '◆', '◇', '■', '□', '●', '○', '✓', '✕']
  }
];

export function EmojiPickerModal() {
  const { isEmojiPickerOpen, setIsEmojiPickerOpen, emojiPickerTarget } = useStorefrontCms();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Frequently Used');

  if (!isEmojiPickerOpen) return null;

  const filteredCategories = EMOJI_CATEGORIES.map(cat => ({
    ...cat,
    emojis: search
      ? cat.emojis.filter(e => e.includes(search))
      : cat.emojis
  })).filter(cat => cat.emojis.length > 0);

  const handleSelect = (emoji: string) => {
    if (emojiPickerTarget) {
      emojiPickerTarget.onSelect(emoji);
    }
    setIsEmojiPickerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#101828]/50 backdrop-blur-xs animate-in fade-in"
        onClick={() => setIsEmojiPickerOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#F2F3F5] overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F2F3F5] bg-[#FFF4F8]">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-white border border-[#FFD8EA] flex items-center justify-center text-sm shadow-xs">
              🎀
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#263550]">Neria Emoji & Symbols Picker</h3>
              <p className="text-[11px] text-[#98A0AE]">Select symbols for headings, buttons, and highlights</p>
            </div>
          </div>
          <button
            onClick={() => setIsEmojiPickerOpen(false)}
            className="p-1.5 rounded-lg text-[#98A0AE] hover:text-[#263550] hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-[#F2F3F5]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#98A0AE]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search emojis & symbols..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:bg-white"
            />
          </div>
        </div>

        {/* Category Tabs */}
        {!search && (
          <div className="flex overflow-x-auto gap-1 p-2 border-b border-[#F2F3F5] scrollbar-none bg-[#F8F8FA]/50">
            {EMOJI_CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[#FF4FA3] text-white shadow-xs'
                      : 'text-[#667085] hover:bg-white hover:text-[#263550]'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Emoji Grid */}
        <div className="p-4 max-h-72 overflow-y-auto space-y-4">
          {filteredCategories.map(cat => {
            if (!search && cat.name !== activeCategory) return null;
            return (
              <div key={cat.name}>
                <h5 className="text-[11px] font-semibold text-[#98A0AE] uppercase tracking-wider mb-2">
                  {cat.name}
                </h5>
                <div className="grid grid-cols-7 gap-2">
                  {cat.emojis.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleSelect(emoji)}
                      className="h-10 rounded-xl bg-[#F8F8FA] hover:bg-[#FFF4F8] hover:border-[#FFD8EA] border border-transparent flex items-center justify-center text-lg transition-all hover:scale-115 active:scale-95 shadow-2xs"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F8F8FA] border-t border-[#F2F3F5] flex justify-between items-center text-[11px] text-[#667085]">
          <span>Click any symbol to insert instantly</span>
          <button
            onClick={() => handleSelect('')}
            className="text-[#FF4FA3] hover:underline font-semibold"
          >
            Clear / None
          </button>
        </div>
      </div>
    </div>
  );
}
