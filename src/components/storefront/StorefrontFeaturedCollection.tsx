'use client';

import React from 'react';
import { FeaturedCollectionSectionContent } from '@/src/lib/types';
import { BunnyMascot } from '../ui/BunnyMascot';
import { Sparkles, ArrowRight } from 'lucide-react';

interface StorefrontFeaturedCollectionProps {
  content: FeaturedCollectionSectionContent;
  isEditorMode?: boolean;
}

export function StorefrontFeaturedCollection({ content, isEditorMode }: StorefrontFeaturedCollectionProps) {
  const isImageRight = content.layout === 'image_right';
  const isEditorial = content.layout === 'editorial_split';

  return (
    <section
      style={{
        backgroundColor: content.bgColor || '#EBF4FC',
        color: content.textColor || '#263550'
      }}
      className="py-16 sm:py-24 overflow-hidden select-none transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${isImageRight ? 'lg:flex-row-reverse' : ''}`}>
          {/* Images Column */}
          <div className={`lg:col-span-6 relative ${isImageRight ? 'lg:order-2' : 'lg:order-1'}`}>
            <div className="relative">
              {/* Primary Large Image */}
              <div className="aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={content.primaryImage || 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=85'}
                  alt={content.collectionName}
                  className="w-full h-full object-cover hover:scale-104 transition-transform duration-500"
                />
              </div>

              {/* Secondary Floating Editorial Image */}
              {isEditorial && content.secondaryImage && (
                <div className="hidden sm:block absolute -bottom-6 -right-6 w-48 h-60 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                  <img
                    src={content.secondaryImage}
                    alt="Capsule Detail"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Floating Bunny Accent */}
              {content.showBunny && (
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-white shadow-lg border border-[#FFD8EA] flex items-center justify-center">
                  <BunnyMascot size="sm" mood={content.bunnyMood || 'happy'} />
                </div>
              )}
            </div>
          </div>

          {/* Text Content Column */}
          <div className={`lg:col-span-6 space-y-6 ${isImageRight ? 'lg:order-1' : 'lg:order-2'}`}>
            {content.collectionLabel && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white text-[#FF4FA3] border border-[#FFD8EA] text-xs font-bold uppercase tracking-wider shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{content.collectionLabel}</span>
              </div>
            )}

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-sans leading-tight">
              {content.collectionName}
            </h2>

            <p className="text-sm sm:text-base leading-relaxed opacity-90 max-w-lg">
              {content.description}
            </p>

            <div className="pt-2">
              <button className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#FF4FA3] hover:bg-[#E63E90] text-white font-bold text-sm shadow-md transition-all hover:scale-102">
                <span>{content.buttonText || 'Discover Capsule'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
