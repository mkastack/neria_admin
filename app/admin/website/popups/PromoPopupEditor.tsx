'use client';

/**
 * Promotional Popup editor — sits at /admin/website/popups.
 *
 * Per the spec: the merchant controls the *colors* and *behavior*
 * (trigger, frequency, type) of the popup, but NOT the text content
 * (title / subtitle / description / button labels / promo code) —
 * that copy lives elsewhere (the per-page text system or hardcoded
 * storefront defaults).
 *
 * Layout: live preview card on the left (mirrors the live
 * <PromoPopup /> so the colors you pick land in the right place),
 * editor panel on the right with all the controls.
 */

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Megaphone,
  Eye,
  EyeOff,
  RotateCcw,
  Save,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { BunnyMascot } from '@/src/components/ui/BunnyMascot';

const TRIGGER_OPTIONS: { value: string; label: string; description: string }[] = [
  { value: 'instant', label: 'Instant', description: 'Show as soon as the page loads' },
  { value: 'delay_5s', label: 'After 5 seconds', description: 'Give visitors a moment to settle in' },
  { value: 'scroll_50', label: '50% scroll', description: 'Trigger when visitor scrolls halfway' },
  { value: 'exit_intent', label: 'Exit intent', description: 'Catch them before they leave' },
];

const FREQUENCY_OPTIONS: { value: string; label: string }[] = [
  { value: 'every_visit', label: 'Every visit' },
  { value: 'once_per_day', label: 'Once per day' },
  { value: 'once_per_week', label: 'Once per week' },
  { value: 'once_ever', label: 'Once ever' },
];

const TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'discount', label: 'Discount' },
  { value: 'sale', label: 'Sale' },
  { value: 'announcement', label: 'Announcement' },
  { value: 'free_shipping', label: 'Free shipping' },
];

export function PromoPopupEditor() {
  const {
    config,
    updatePopup,
    saveDraft,
    isDirty,
    autoSaveStatus,
    resetPopupToPublished,
    publishedConfig,
  } = useStorefrontCms();
  const { addToast } = useAdmin();

  const popup = config.popup;
  const hasChanged = JSON.stringify(config.popup) !== JSON.stringify(publishedConfig.popup);

  // ── helpers ──
  const set = (patch: any) => updatePopup(patch);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link
            href="/admin/website"
            className="mt-1 p-2 rounded-xl bg-white border border-[#F2F3F5] hover:border-[#FF4FA3] text-[#263550] transition-colors"
            title="Back to Website overview"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#FF4FA3]" />
              <h1 className="text-xl font-extrabold text-[#263550]">Promotional Popup</h1>
              {hasChanged && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF4F8] text-[#FF4FA3]">
                  unsaved
                </span>
              )}
            </div>
            <p className="text-xs text-[#667085] mt-1 max-w-xl">
              Tune the colors and behavior of the storefront's promotional popup. Text content (title, body,
              buttons, promo code) is managed separately and is not editable on this page.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetPopupToPublished}
            className="px-3 py-2 rounded-xl bg-white border border-[#F2F3F5] hover:border-[#FF4FA3] text-xs font-semibold text-[#475467] hover:text-[#FF4FA3] transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Revert
          </button>
          <button
            onClick={saveDraft}
            disabled={!isDirty}
            className="px-4 py-2 rounded-xl bg-[#FF4FA3] hover:bg-[#E63E90] text-white text-xs font-extrabold shadow-md shadow-[#FF4FA3]/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            Save Draft
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* ── Live preview card (left) ── */}
        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-3xl border border-[#F2F3F5] bg-white overflow-hidden">
            <div className="px-5 py-3 border-b border-[#F2F3F5] bg-[#F8F8FA] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4FA3]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#98A0AE]">Live preview</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  popup.active ? 'bg-[#ECFDF3] text-[#027A48]' : 'bg-[#F2F4F7] text-[#667085]'
                }`}
              >
                {popup.active ? 'ACTIVE' : 'HIDDEN'}
              </span>
            </div>
            <div className="p-5 bg-[#F8F8FA] flex items-center justify-center min-h-[420px]">
              {/* Mirror of storefront PromoPopup — same color/typography logic */}
              <div
                className="relative w-full max-w-sm rounded-3xl shadow-2xl border border-black/5 overflow-hidden"
                style={{ backgroundColor: popup.bgColor, color: popup.textColor }}
              >
                {popup.image && (
                  <div className="relative h-40 w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={popup.image}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                    />
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-[10px] font-bold text-[#263550]">
                      {popup.emoji && <span aria-hidden>{popup.emoji}</span>}
                      <span>{popup.badgeText}</span>
                    </div>
                  </div>
                )}
                {!popup.image && (
                  <div
                    className="h-32 w-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                  >
                    <div className="flex flex-col items-center gap-1 text-[10px] uppercase tracking-wider opacity-60">
                      <ImageIcon className="w-5 h-5" />
                      <span>No image</span>
                    </div>
                  </div>
                )}
                <div className="p-5 space-y-3">
                  <h3 className="text-base font-extrabold leading-tight">{popup.title}</h3>
                  {popup.subtitle && (
                    <p className="text-[11px] font-semibold opacity-80">{popup.subtitle}</p>
                  )}
                  {popup.description && (
                    <p className="text-[11px] opacity-80 leading-relaxed">{popup.description}</p>
                  )}
                  {popup.promoCode && (
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-[11px] font-extrabold border"
                      style={{ borderColor: popup.textColor, color: popup.textColor }}
                    >
                      <span>CODE:</span>
                      <span className="tracking-widest">{popup.promoCode}</span>
                    </div>
                  )}
                  <div className="pt-2 space-y-1.5">
                    <button
                      type="button"
                      className="w-full px-3 py-2 rounded-xl text-[11px] font-extrabold shadow-md transition-all"
                      style={{ backgroundColor: '#FF4FA3', color: '#FFFFFF' }}
                    >
                      {popup.primaryButtonText}
                    </button>
                    <button
                      type="button"
                      className="w-full px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all"
                      style={{ borderColor: popup.textColor, color: popup.textColor }}
                    >
                      {popup.secondaryButtonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#F2F3F5] bg-white p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#263550]">
              <BunnyMascot size="sm" mood="happy" />
              <span>How it appears</span>
            </div>
            <p className="text-[10px] text-[#98A0AE] leading-relaxed">
              Trigger: <b className="text-[#263550]">{popup.trigger}</b> · Frequency:{' '}
              <b className="text-[#263550]">{popup.frequency}</b> · Type:{' '}
              <b className="text-[#263550]">{popup.type}</b>
            </p>
          </div>
        </div>

        {/* ── Editor panel (right) ── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Visibility */}
          <div className="rounded-3xl border border-[#F2F3F5] bg-white p-5">
            <h2 className="text-sm font-extrabold text-[#263550] mb-3">Visibility</h2>
            <label className="flex items-center justify-between p-3 rounded-2xl border border-[#F2F3F5] bg-[#F8F8FA] cursor-pointer">
              <div>
                <span className="text-[11px] font-bold text-[#263550] flex items-center gap-1.5">
                  {popup.active ? (
                    <Eye className="w-3.5 h-3.5 text-[#027A48]" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-[#98A0AE]" />
                  )}
                  Popup enabled
                </span>
                <p className="text-[10px] text-[#98A0AE] mt-0.5">
                  When off, the popup will not appear for any visitor regardless of trigger.
                </p>
              </div>
              <input
                type="checkbox"
                checked={popup.active}
                onChange={(e) => set({ active: e.target.checked })}
                className="w-4 h-4 accent-[#FF4FA3]"
              />
            </label>
          </div>

          {/* Colors */}
          <div className="rounded-3xl border border-[#F2F3F5] bg-white p-5 space-y-3">
            <h2 className="text-sm font-extrabold text-[#263550]">Colors</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ColorField
                label="Background"
                value={popup.bgColor}
                onChange={(v) => set({ bgColor: v })}
              />
              <ColorField
                label="Text"
                value={popup.textColor}
                onChange={(v) => set({ textColor: v })}
              />
            </div>
          </div>

          {/* Behavior */}
          <div className="rounded-3xl border border-[#F2F3F5] bg-white p-5 space-y-4">
            <h2 className="text-sm font-extrabold text-[#263550]">Behavior</h2>

            <div>
              <label className="block text-[10px] font-bold text-[#98A0AE] mb-1.5 uppercase">
                Trigger
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TRIGGER_OPTIONS.map((opt) => {
                  const active = popup.trigger === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => set({ trigger: opt.value })}
                      className={`text-left p-2.5 rounded-xl border transition-all ${
                        active
                          ? 'border-[#FF4FA3] bg-[#FFF4F8]'
                          : 'border-[#F2F3F5] bg-white hover:border-[#DDE1E7]'
                      }`}
                    >
                      <div
                        className={`text-[11px] font-bold ${
                          active ? 'text-[#FF4FA3]' : 'text-[#263550]'
                        }`}
                      >
                        {opt.label}
                      </div>
                      <div className="text-[10px] text-[#98A0AE] mt-0.5">{opt.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#98A0AE] mb-1.5 uppercase">
                Frequency
              </label>
              <select
                value={popup.frequency}
                onChange={(e) => set({ frequency: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] text-xs font-semibold text-[#263550] focus:outline-none focus:border-[#FF4FA3] focus:ring-1 focus:ring-[#FF4FA3]"
              >
                {FREQUENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-[#98A0AE] mt-1">
                How often the same visitor should see the popup during their sessions.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#98A0AE] mb-1.5 uppercase">
                Type
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TYPE_OPTIONS.map((opt) => {
                  const active = popup.type === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => set({ type: opt.value })}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-colors ${
                        active
                          ? 'bg-[#263550] text-white border-[#263550]'
                          : 'bg-white text-[#475467] border-[#DDE1E7] hover:border-[#263550]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Read-only text notice */}
          <div className="rounded-2xl border border-[#F2F3F5] bg-[#F8F8FA] p-4">
            <div className="text-[10px] font-bold text-[#98A0AE] uppercase mb-1.5">
              Read-only here
            </div>
            <p className="text-[11px] text-[#475467] leading-relaxed">
              The popup's title, subtitle, description, button labels, image, and promo code are managed
              through the storefront's announcement text system. Open the visual editor to update them.
            </p>
            <Link
              href="/admin/website/editor"
              className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-[#FF4FA3] hover:underline"
            >
              Open visual editor →
            </Link>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-[#98A0AE] flex items-center gap-1.5 px-1">
        <BunnyMascot size="sm" mood="happy" />
        <span>
          Changes save automatically. Click <b>Save Draft</b> to commit, then{' '}
          <Link className="text-[#FF4FA3] hover:underline" href="/admin/website/editor">
            open the editor
          </Link>{' '}
          or{' '}
          <Link className="text-[#FF4FA3] hover:underline" href="/admin/website">
            publish
          </Link>
          .
        </span>
      </div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-[#98A0AE] mb-1 uppercase">{label}</label>
      <div className="flex gap-1.5 items-center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border border-[#DDE1E7]"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-2 rounded-lg bg-[#F8F8FA] border border-[#DDE1E7] font-mono text-[11px] focus:outline-none focus:border-[#FF4FA3] focus:ring-1 focus:ring-[#FF4FA3]"
        />
      </div>
    </div>
  );
}
