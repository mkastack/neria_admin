'use client';

import React from 'react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import {
  Palette, Type, Sliders, CheckCircle2, RotateCcw, Sparkles, ArrowRight
} from 'lucide-react';

export default function ThemeSettingsPage() {
  const { config, updateThemeColors, updateTypography } = useStorefrontCms();
  const { colors, typography } = config.theme;

  const colorFields: Array<{ key: keyof typeof colors; label: string; desc: string }> = [
    { key: 'primary', label: 'Primary Brand Pink', desc: 'Main CTA buttons, badges, highlights' },
    { key: 'secondary', label: 'Secondary Powder Blue', desc: 'Capsule backgrounds, announcement accents' },
    { key: 'background', label: 'Page Background', desc: 'Soft pastel ambient canvas' },
    { key: 'surface', label: 'Card Surface', desc: 'Product cards and modal backdrops' },
    { key: 'text', label: 'Primary Typography Navy', desc: 'Headings and high-contrast text' },
    { key: 'mutedText', label: 'Muted Secondary Text', desc: 'Subtitles, descriptions, captions' },
    { key: 'border', label: 'Border & Divider', desc: 'Subtle frame boundaries' },
    { key: 'sale', label: 'Promotional Sale Accent', desc: 'Discount tags and urgency badges' }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4F8] border border-[#FFD8EA] text-[#FF4FA3] text-xs font-bold uppercase tracking-wider mb-1.5">
          <Palette className="w-3.5 h-3.5" />
          <span>Design Tokens</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#263550] tracking-tight">
          Theme & Color System Architecture
        </h1>
        <p className="text-xs text-[#667085] mt-1">
          Customize design tokens, CSS variables, typography pairings, and button styles safely without editing stylesheets.
        </p>
      </div>

      {/* 1. Color Palette Tokens */}
      <div className="rounded-3xl bg-white border border-[#F2F3F5] shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#263550] uppercase tracking-wider">
              Brand Color Tokens
            </h3>
            <p className="text-xs text-[#98A0AE] mt-0.5">
              Live mapped to CSS custom variables (--neria-pink, --neria-powder-blue, --bg-page).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {colorFields.map(field => (
            <div
              key={field.key}
              className="p-4 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-2 hover:border-[#FFD8EA] transition-all"
            >
              <span className="font-bold text-xs text-[#263550] block truncate">{field.label}</span>
              <p className="text-[10px] text-[#98A0AE] line-clamp-1">{field.desc}</p>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="color"
                  value={colors[field.key]}
                  onChange={e => updateThemeColors({ [field.key]: e.target.value })}
                  className="w-9 h-9 rounded-xl cursor-pointer border border-[#DDE1E7] shrink-0"
                />
                <input
                  type="text"
                  value={colors[field.key]}
                  onChange={e => updateThemeColors({ [field.key]: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DDE1E7] font-mono text-xs font-bold text-[#263550]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Typography & Button Styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Typography */}
        <div className="rounded-3xl bg-white border border-[#F2F3F5] shadow-xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#263550] uppercase tracking-wider flex items-center gap-2">
            <Type className="w-4 h-4 text-[#FF4FA3]" />
            <span>Typography System</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#263550] mb-1">Display Heading Font</label>
            <select
              value={typography.headingFont}
              onChange={e => updateTypography({ headingFont: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7]"
            >
              <option value="Outfit, sans-serif">Outfit (Signature Neria Modern Luxury)</option>
              <option value="Inter, sans-serif">Inter (Clean Editorial Minimal)</option>
              <option value="Playfair Display, serif">Playfair Display (Romantic Atelier Serif)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#263550] mb-1">Body Text Font</label>
            <select
              value={typography.bodyFont}
              onChange={e => updateTypography({ bodyFont: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7]"
            >
              <option value="Inter, sans-serif">Inter (Highly Readable Neutral)</option>
              <option value="Roboto, sans-serif">Roboto</option>
            </select>
          </div>
        </div>

        {/* Button Presets */}
        <div className="rounded-3xl bg-white border border-[#F2F3F5] shadow-xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#263550] uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#FF4FA3]" />
            <span>Global Button Corner Radius</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { key: 'rounded', label: 'Rounded (Neria Signature)', radius: 'rounded-2xl' },
              { key: 'pill', label: 'Pill / Oval', radius: 'rounded-full' },
              { key: 'soft', label: 'Soft Subtle Curve', radius: 'rounded-lg' },
              { key: 'square', label: 'Square Fashion', radius: 'rounded-none' }
            ].map(preset => (
              <button
                key={preset.key}
                onClick={() => updateTypography({ buttonCornerRadius: preset.key as any })}
                className={`p-3 border-2 text-left transition-all ${
                  typography.buttonCornerRadius === preset.key
                    ? 'border-[#FF4FA3] bg-[#FFF4F8]'
                    : 'border-[#F2F3F5] bg-[#F8F8FA]'
                } rounded-xl`}
              >
                <div className={`w-full py-2 bg-[#FF4FA3] text-white text-[11px] font-bold text-center ${preset.radius} mb-2 shadow-2xs`}>
                  Button Style
                </div>
                <span className="text-xs font-bold text-[#263550] block">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
