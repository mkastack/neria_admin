'use client';

import React from 'react';
import { Palette, Type, RotateCcw, Sparkles, Check, SlidersHorizontal } from 'lucide-react';
import type { ThemeColorsConfig, TypographyConfig } from '@/src/lib/types';

interface Props {
  theme: {
    colors: ThemeColorsConfig;
    typography: TypographyConfig;
  };
  updateThemeColors: (updates: Partial<ThemeColorsConfig>) => void;
  updateTypography: (updates: Partial<TypographyConfig>) => void;
  onReset: () => void;
}

const TEXT_COLOR_PRESETS = [
  { label: 'Deep Navy', value: '#263550' },
  { label: 'Slate Deep', value: '#6E8B9D' },
  { label: 'Charcoal', value: '#334155' },
  { label: 'Rich Black', value: '#111827' },
  { label: 'Rose Deep', value: '#B86E8E' },
  { label: 'Neutral Gray', value: '#475467' },
];

const MUTED_COLOR_PRESETS = [
  { label: 'Slate Mid', value: '#88A0AE' },
  { label: 'Neutral Gray', value: '#667085' },
  { label: 'Cool Gray', value: '#94A3B8' },
  { label: 'Muted Rose', value: '#D98CAE' },
];

const PRIMARY_COLOR_PRESETS = [
  { label: 'Signature Pink', value: '#FF4FA3' },
  { label: 'Soft Pink', value: '#FFB3D4' },
  { label: 'Hot Pink', value: '#E63E90' },
  { label: 'Coral Rose', value: '#FB7185' },
  { label: 'Berry', value: '#BE185D' },
  { label: 'Lavender', value: '#A855F7' },
];

const BG_COLOR_PRESETS = [
  { label: 'Blush Pink', value: '#FFF4F8' },
  { label: 'Pure White', value: '#FFFFFF' },
  { label: 'Soft Lavender', value: '#FFF0F5' },
  { label: 'Butter Cream', value: '#FEF1D0' },
  { label: 'Slate Tint', value: '#F8FAFC' },
];

const BUTTON_BG_PRESETS = [
  { label: 'Signature Pink', value: '#FF4FA3' },
  { label: 'Deep Navy', value: '#263550' },
  { label: 'Rose Deep', value: '#B86E8E' },
  { label: 'Pure Black', value: '#000000' },
  { label: 'Emerald', value: '#12B76A' },
];

const HEADING_FONTS = [
  { label: 'Outfit (Modern & Clean)', value: 'Outfit, sans-serif' },
  { label: 'Plus Jakarta Sans (Crisp Modern)', value: 'Plus Jakarta Sans, sans-serif' },
  { label: 'Inter (High Legibility)', value: 'Inter, sans-serif' },
  { label: 'Newsreader (Editorial Serif)', value: 'Newsreader, serif' },
  { label: 'Caveat (Playful Handwriting)', value: 'Caveat, cursive' },
  { label: 'Playfair Display (Luxury Serif)', value: 'Playfair Display, serif' },
];

const BODY_FONTS = [
  { label: 'Inter (Neutral & Clean)', value: 'Inter, sans-serif' },
  { label: 'Plus Jakarta Sans (Geometric)', value: 'Plus Jakarta Sans, sans-serif' },
  { label: 'Outfit (Friendly Modern)', value: 'Outfit, sans-serif' },
  { label: 'Roboto (Standard)', value: 'Roboto, sans-serif' },
];

function ColorRow({
  label,
  description,
  value,
  onChange,
  presets = [],
}: {
  label: string;
  description?: string;
  value: string;
  onChange: (color: string) => void;
  presets?: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="space-y-2 p-3.5 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5]">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-bold text-[#263550] block text-xs">{label}</span>
          {description && <span className="text-[10px] text-[#667085]">{description}</span>}
        </div>
        <div className="flex items-center gap-2">
          <label className="relative cursor-pointer">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            <div
              className="w-7 h-7 rounded-xl border border-black/10 shadow-xs transition-transform hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: value || '#ffffff' }}
              title="Click to open color picker"
            />
          </label>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className="w-20 px-2 py-1 rounded-lg bg-white border border-[#DDE1E7] text-[11px] font-mono text-[#263550] text-center focus:outline-none focus:border-[#FF4FA3]"
          />
        </div>
      </div>

      {presets.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {presets.map((preset) => {
            const active = (value || '').toLowerCase() === preset.value.toLowerCase();
            return (
              <button
                key={preset.value}
                onClick={() => onChange(preset.value)}
                title={`${preset.label} (${preset.value})`}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-medium border transition-all ${
                  active
                    ? 'bg-white border-[#FF4FA3] text-[#FF4FA3] font-bold shadow-xs'
                    : 'bg-white/80 border-[#DDE1E7] text-[#667085] hover:bg-white hover:border-[#FFD8EA]'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/10"
                  style={{ backgroundColor: preset.value }}
                />
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ThemeInspector({ theme, updateThemeColors, updateTypography, onReset }: Props) {
  const colors = theme?.colors || ({} as ThemeColorsConfig);
  const typography = theme?.typography || ({} as TypographyConfig);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-4 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] space-y-1.5">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#FF4FA3]" />
          <h4 className="font-extrabold text-xs text-[#263550]">Theme & Visual Styling</h4>
        </div>
        <p className="text-[11px] text-[#667085] leading-relaxed">
          Customize text colors, background tones, button styles, and typography. Every change previews instantly in the canvas and updates <code className="text-[#FF4FA3] font-mono">neria-commerce.vercel.app</code> in real time when published.
        </p>
      </div>

      {/* ── Section 1: Text Colors ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 px-1">
          <Type className="w-3.5 h-3.5 text-[#FF4FA3]" />
          <h5 className="font-extrabold text-xs text-[#263550] uppercase tracking-wider">
            Text & Typography Colors
          </h5>
        </div>

        <ColorRow
          label="Main Text Color"
          description="Primary body text, titles, headings, and card copy"
          value={colors.text || '#263550'}
          onChange={(color) => updateThemeColors({ text: color })}
          presets={TEXT_COLOR_PRESETS}
        />

        <ColorRow
          label="Muted Text Color"
          description="Subtitles, secondary labels, timestamps, and subtle hints"
          value={colors.mutedText || '#667085'}
          onChange={(color) => updateThemeColors({ mutedText: color })}
          presets={MUTED_COLOR_PRESETS}
        />
      </div>

      {/* ── Section 2: Brand & Background Colors ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 px-1">
          <Sparkles className="w-3.5 h-3.5 text-[#FF4FA3]" />
          <h5 className="font-extrabold text-xs text-[#263550] uppercase tracking-wider">
            Brand Accents & Backgrounds
          </h5>
        </div>

        <ColorRow
          label="Primary Accent (Brand Pink)"
          description="Hero highlights, badges, active tabs, and primary CTAs"
          value={colors.primary || '#FF4FA3'}
          onChange={(color) => updateThemeColors({ primary: color })}
          presets={PRIMARY_COLOR_PRESETS}
        />

        <ColorRow
          label="Secondary Tone"
          description="Subtle borders, secondary pill badges, and soft highlights"
          value={colors.secondary || '#CBE7FA'}
          onChange={(color) => updateThemeColors({ secondary: color })}
        />

        <ColorRow
          label="Page Background"
          description="Overall page background tone for the storefront"
          value={colors.background || '#FFF4F8'}
          onChange={(color) => updateThemeColors({ background: color })}
          presets={BG_COLOR_PRESETS}
        />

        <ColorRow
          label="Surface / Card Fill"
          description="Containers, product cards, dropdowns, and modal dialogs"
          value={colors.surface || '#FFFFFF'}
          onChange={(color) => updateThemeColors({ surface: color })}
        />

        <ColorRow
          label="Borders & Dividers"
          description="Card outlines, divider lines, and inputs"
          value={colors.border || '#F2F3F5'}
          onChange={(color) => updateThemeColors({ border: color })}
        />
      </div>

      {/* ── Section 3: Buttons ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 px-1">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF4FA3]" />
          <h5 className="font-extrabold text-xs text-[#263550] uppercase tracking-wider">
            Buttons & Interactive
          </h5>
        </div>

        <ColorRow
          label="Button Background"
          description="Add to Bag, Checkout, and primary action buttons"
          value={colors.buttonBg || '#FF4FA3'}
          onChange={(color) => updateThemeColors({ buttonBg: color })}
          presets={BUTTON_BG_PRESETS}
        />

        <ColorRow
          label="Button Text Color"
          description="Text inside primary buttons"
          value={colors.buttonText || '#FFFFFF'}
          onChange={(color) => updateThemeColors({ buttonText: color })}
          presets={[
            { label: 'White', value: '#FFFFFF' },
            { label: 'Deep Navy', value: '#263550' },
            { label: 'Black', value: '#000000' },
          ]}
        />

        {/* Button Corner Radius */}
        <div className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-2">
          <span className="font-bold text-[#263550] block text-xs">Button Corner Radius</span>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'pill', label: 'Pill' },
              { id: 'rounded', label: 'Rounded' },
              { id: 'soft', label: 'Soft' },
              { id: 'square', label: 'Square' },
            ].map((shape) => {
              const active = typography.buttonCornerRadius === shape.id;
              return (
                <button
                  key={shape.id}
                  onClick={() => updateTypography({ buttonCornerRadius: shape.id as any })}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-[#263550] text-white shadow-xs'
                      : 'bg-white text-[#667085] hover:bg-[#FFF4F8] hover:text-[#263550] border border-[#DDE1E7]'
                  }`}
                >
                  {shape.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Section 4: Font Families ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 px-1">
          <Type className="w-3.5 h-3.5 text-[#FF4FA3]" />
          <h5 className="font-extrabold text-xs text-[#263550] uppercase tracking-wider">
            Font Families
          </h5>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Heading Font</label>
            <select
              value={typography.headingFont || 'Outfit, sans-serif'}
              onChange={(e) => updateTypography({ headingFont: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDE1E7] text-xs font-medium text-[#263550] focus:outline-none focus:border-[#FF4FA3]"
            >
              {HEADING_FONTS.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Body Font</label>
            <select
              value={typography.bodyFont || 'Inter, sans-serif'}
              onChange={(e) => updateTypography({ bodyFont: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDE1E7] text-xs font-medium text-[#263550] focus:outline-none focus:border-[#FF4FA3]"
            >
              {BODY_FONTS.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#263550]">Base Font Size</label>
              <span className="text-xs font-mono text-[#667085]">{typography.baseFontSize || 16}px</span>
            </div>
            <input
              type="range"
              min="14"
              max="20"
              value={typography.baseFontSize || 16}
              onChange={(e) => updateTypography({ baseFontSize: Number(e.target.value) })}
              className="w-full accent-[#FF4FA3]"
            />
          </div>
        </div>
      </div>

      {/* ── Revert to published ── */}
      <div className="pt-2 border-t border-[#F2F3F5]">
        <button
          onClick={onReset}
          className="w-full py-2.5 rounded-xl bg-[#F8F8FA] hover:bg-[#FFF4F8] text-[#667085] hover:text-[#FF4FA3] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Revert Theme to Last Published</span>
        </button>
      </div>
    </div>
  );
}
