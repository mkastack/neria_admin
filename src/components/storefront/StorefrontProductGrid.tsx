'use client';

import React from 'react';
import { ProductSectionContent } from '@/src/lib/types';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { Heart, ShoppingBag, Star, Sparkles, Plus } from 'lucide-react';

interface StorefrontProductGridProps {
  sectionId: string;
  content: ProductSectionContent;
  isEditorMode?: boolean;
}

export function StorefrontProductGrid({ sectionId, content, isEditorMode }: StorefrontProductGridProps) {
  const { products } = useAdmin();

  // Filter products according to rules or manual selection
  let displayProducts = products;
  if (content.sourceType === 'manual' && content.selectedProductIds?.length > 0) {
    const selected = content.selectedProductIds
      .map(id => products.find(p => p.id === id))
      .filter(Boolean) as typeof products;
    if (selected.length > 0) {
      displayProducts = selected;
    }
  } else if (content.automaticRule === 'bestsellers') {
    displayProducts = [...products].sort((a, b) => b.salesCount - a.salesCount);
  } else if (content.automaticRule === 'highest_rated') {
    displayProducts = [...products].sort((a, b) => b.rating - a.rating);
  } else {
    // Newest
    displayProducts = [...products];
  }

  const limitedProducts = displayProducts.slice(0, content.limit || 4);

  return (
    <section className="py-16 sm:py-20 bg-[#FFF4F8]/40 border-y border-[#F2F3F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#FFD8EA] text-[#FF4FA3] text-[11px] font-bold uppercase tracking-wider mb-2 shadow-2xs">
            <Sparkles className="w-3 h-3" />
            <span>Curated Silhouettes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#263550] tracking-tight">
            {content.heading}
          </h2>
          {content.subtitle && (
            <p className="text-xs sm:text-sm text-[#667085] mt-1.5">{content.subtitle}</p>
          )}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {limitedProducts.map(prod => (
            <div
              key={prod.id}
              className="group bg-white rounded-3xl p-3 border border-[#F2F3F5] hover:border-[#FFD8EA] hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Image Container */}
              <div className="aspect-3/4 rounded-2xl overflow-hidden bg-[#F8F8FA] relative mb-3">
                <img
                  src={prod.images[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80'}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                />

                {/* Badge */}
                {content.showNewBadge && (
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-[#FF4FA3] text-white shadow-xs">
                    New In
                  </span>
                )}

                {/* Wishlist Button */}
                {content.showWishlist && (
                  <button className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-[#263550] hover:text-[#FF4FA3] hover:scale-110 flex items-center justify-center shadow-xs transition-all">
                    <Heart className="w-4 h-4" />
                  </button>
                )}

                {/* Quick Add Overlay Button */}
                {content.showQuickAdd && (
                  <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <button className="w-full py-2.5 rounded-xl bg-[#263550] hover:bg-[#FF4FA3] text-white text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 shadow-md">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Quick Add
                    </button>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between px-1">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#98A0AE] mb-1">
                    <span>{prod.category}</span>
                    <div className="flex items-center gap-0.5 text-[#FF4FA3]">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-semibold text-xs">{prod.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#263550] line-clamp-1 group-hover:text-[#FF4FA3] transition-colors">
                    {prod.name}
                  </h4>
                </div>

                {content.showPrice && (
                  <div className="mt-2.5 pt-2 border-t border-[#F8F8FA] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-extrabold text-[#263550]">
                        GH₵ {prod.price.toFixed(2)}
                      </span>
                      {prod.compareAtPrice && (
                        <span className="text-[11px] text-[#98A0AE] line-through">
                          GH₵ {prod.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {content.showColor && (
                      <span className="text-[10px] font-semibold text-[#FF4FA3] bg-[#FFF4F8] px-2 py-0.5 rounded-full border border-[#FFD8EA]">
                        {prod.variants.length} Sizes
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Optional Section CTA link */}
        {content.ctaText && (
          <div className="text-center mt-10">
            <button className="px-6 py-3 rounded-full bg-white hover:bg-[#FFF4F8] border border-[#FFD8EA] text-xs font-bold text-[#FF4FA3] shadow-xs transition-colors">
              {content.ctaText}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
