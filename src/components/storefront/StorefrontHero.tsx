'use client';

import React from 'react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { HeroSectionContent } from '@/src/lib/types';
import { BunnyMascot } from '../ui/BunnyMascot';
import { ArrowRight, Sparkles } from 'lucide-react';

interface StorefrontHeroProps {
  content: HeroSectionContent;
  isEditorMode?: boolean;
}

export function StorefrontHero({ content, isEditorMode }: StorefrontHeroProps) {
  const { updateSectionContent, activeSectionId, setActiveElementKey } = useStorefrontCms();

  const handleInlineChange = (field: keyof HeroSectionContent, val: string) => {
    updateSectionContent('sec-hero', { [field]: val });
  };

  const textAlignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  }[content.textPosition || 'left'];

  const verticalAlignmentClasses = {
    top: 'justify-start pt-16',
    center: 'justify-center',
    bottom: 'justify-end pb-16'
  }[content.verticalPosition || 'center'];

  return (
    <section className="relative w-full min-h-[560px] lg:min-h-[680px] flex overflow-hidden select-none">
      {/* Background Imagery */}
      <div className="absolute inset-0 z-0">
        <img
          src={content.desktopImage || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=85'}
          alt="Neria Hero"
          className="w-full h-full object-cover hidden sm:block transition-all duration-500"
        />
        <img
          src={content.mobileImage || content.desktopImage}
          alt="Neria Hero Mobile"
          className="w-full h-full object-cover sm:hidden transition-all duration-500"
        />

        {/* Dynamic Dark / Color Overlay */}
        <div
          className="absolute inset-0 bg-black transition-opacity duration-300"
          style={{ opacity: (content.overlayOpacity ?? 25) / 100 }}
        />

        {/* Soft Pink Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Hero Content Container */}
      <div className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full flex flex-col ${verticalAlignmentClasses}`}>
        <div className={`max-w-2xl flex flex-col ${textAlignmentClasses} space-y-4`}>
          {/* Small Badge / Label */}
          {content.smallLabel && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold tracking-wider uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD8EA]" />
              {isEditorMode ? (
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => handleInlineChange('smallLabel', e.currentTarget.textContent || '')}
                  className="outline-none hover:bg-white/20 px-1 rounded transition-colors"
                >
                  {content.smallLabel}
                </span>
              ) : (
                <span>{content.smallLabel}</span>
              )}
            </div>
          )}

          {/* Main Heading */}
          <h1
            style={{ color: content.headingColor || '#FFFFFF' }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans leading-[1.08] drop-shadow-sm"
          >
            {isEditorMode ? (
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={e => handleInlineChange('mainHeading', e.currentTarget.textContent || '')}
                className="outline-none hover:bg-white/10 px-1 rounded transition-colors"
              >
                {content.mainHeading}
              </span>
            ) : (
              <span>{content.mainHeading}</span>
            )}
            {content.headingEmoji && <span className="ml-2 inline-block animate-pulse">{content.headingEmoji}</span>}
          </h1>

          {/* Description */}
          {content.description && (
            <p
              style={{ color: content.descriptionColor || '#F8F8FA' }}
              className="text-sm sm:text-base lg:text-lg font-medium leading-relaxed max-w-xl drop-shadow-xs"
            >
              {isEditorMode ? (
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => handleInlineChange('description', e.currentTarget.textContent || '')}
                  className="outline-none hover:bg-white/10 px-1 rounded transition-colors"
                >
                  {content.description}
                </span>
              ) : (
                <span>{content.description}</span>
              )}
            </p>
          )}

          {/* Call to Actions & Mascot */}
          <div className="pt-3 flex flex-wrap items-center gap-4">
            {/* Primary Button */}
            {content.primaryButtonText && (
              <button
                style={{
                  backgroundColor: content.buttonBgColor || '#FF4FA3',
                  color: content.buttonTextColor || '#FFFFFF'
                }}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm tracking-wide shadow-lg hover:brightness-110 active:scale-98 transition-all"
              >
                <span>{content.primaryButtonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {/* Secondary Button */}
            {content.secondaryButtonText && (
              <button className="px-6 py-3.5 rounded-full font-bold text-sm tracking-wide text-white bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 transition-all">
                {content.secondaryButtonText}
              </button>
            )}

            {/* Optional Signature Bunny Mascot */}
            {content.showBunny && (
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xs">
                <BunnyMascot size="sm" mood={content.bunnyMood || 'love'} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
