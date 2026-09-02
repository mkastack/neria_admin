'use client';

import React from 'react';
import { NeriaGirlSectionContent } from '@/src/lib/types';
import { BunnyMascot } from '../ui/BunnyMascot';
import { Heart, HeartHandshake, Sparkles, Tag } from 'lucide-react';

interface StorefrontNeriaGirlProps {
  content: NeriaGirlSectionContent;
  isEditorMode?: boolean;
}

export function StorefrontNeriaGirl({ content, isEditorMode }: StorefrontNeriaGirlProps) {
  return (
    <section className="py-16 sm:py-24 bg-[#FFF4F8] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#FFD8EA] text-[#FF4FA3] text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Community Looks</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#263550] tracking-tight">
            {content.heading || 'The Neria Girl Community ♡'}
          </h2>
          {content.subtitle && (
            <p className="text-xs sm:text-sm text-[#667085] mt-2">{content.subtitle}</p>
          )}
        </div>

        {/* UGC Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-3xl p-3 border border-[#F2F3F5] shadow-xs hover:shadow-xl hover:border-[#FFD8EA] transition-all duration-300 flex flex-col group relative"
            >
              {/* Image Frame */}
              <div className="aspect-4/5 rounded-2xl overflow-hidden bg-[#F8F8FA] relative mb-3">
                <img
                  src={item.imageUrl}
                  alt={item.customerName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Handwritten Note Sticker */}
                {item.handwrittenNote && (
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#FFF4F8] border border-[#FFD8EA] text-[#FF4FA3] text-[11px] font-bold shadow-sm rotate-3">
                    {item.handwrittenNote}
                  </span>
                )}
              </div>

              {/* Tagged Product & Caption */}
              <div className="px-1 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#263550]">{item.customerName}</span>
                    <span className="text-[11px] font-semibold text-[#FF4FA3]">{item.handle}</span>
                  </div>
                  <p className="text-xs text-[#667085] line-clamp-2 italic">
                    "{item.caption}"
                  </p>
                </div>

                {item.taggedProduct && (
                  <div className="mt-3 pt-2 border-t border-[#F8F8FA] flex items-center gap-1.5 text-[11px] text-[#263550] font-semibold">
                    <Tag className="w-3 h-3 text-[#FF4FA3]" />
                    <span className="truncate">{item.taggedProduct}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
