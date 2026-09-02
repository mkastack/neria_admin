'use client';

import React from 'react';
import { CategoriesSectionContent } from '@/src/lib/types';
import { Sparkles, ArrowUpRight } from 'lucide-react';

interface StorefrontCategoriesProps {
  content: CategoriesSectionContent;
  isEditorMode?: boolean;
}

export function StorefrontCategories({ content, isEditorMode }: StorefrontCategoriesProps) {
  const visibleCategories = content.categories.filter(c => c.visible);

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4F8] border border-[#FFD8EA] text-[#FF4FA3] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Explore Wardrobe</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#263550] tracking-tight">
              {content.heading || 'Curated Categories'}
            </h2>
            {content.subtitle && (
              <p className="text-xs sm:text-sm text-[#667085] mt-1">{content.subtitle}</p>
            )}
          </div>

          <span className="text-xs font-bold text-[#FF4FA3] hover:underline cursor-pointer flex items-center gap-1">
            View All Categories <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {visibleCategories.map(cat => (
            <div
              key={cat.id}
              className="group relative rounded-3xl overflow-hidden bg-[#F8F8FA] border border-[#F2F3F5] transition-all hover:shadow-xl hover:border-[#FFD8EA] cursor-pointer flex flex-col"
            >
              {/* Image Container */}
              <div className="aspect-3/4 overflow-hidden relative bg-[#F2F3F5]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                />

                {/* Badge */}
                {cat.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/90 backdrop-blur-xs text-[#FF4FA3] shadow-xs">
                    {cat.badge}
                  </span>
                )}

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#263550]/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Text inside Image bottom */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="text-base font-bold tracking-tight drop-shadow-xs">{cat.name}</h4>
                  <p className="text-[11px] text-white/80 font-medium">{cat.itemCount} pieces</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
