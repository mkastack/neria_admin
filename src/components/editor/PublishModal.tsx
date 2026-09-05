'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { CheckCircle2, AlertTriangle, X, Sparkles, Globe, History, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { BunnyMascot } from '../ui/BunnyMascot';

export function PublishModal() {
  const { isPublishModalOpen, setIsPublishModalOpen, publishChanges, getPendingChangesDiff, config, publishedConfig } = useStorefrontCms();
  const [publishNotes, setPublishNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isPublishModalOpen) return null;

  const diffs = getPendingChangesDiff();
  const newVersion = (publishedConfig.version || 0) + 1;
  // Cache-buster so the merchant's browser always re-fetches the live
  // site after a publish — even if their other tab was already open.
  const commerceBase = (
    process.env.NEXT_COMMERCE_URL ||
    process.env.NEXT_PUBLIC_COMMERCE_URL ||
    'https://neria-commerce.vercel.app'
  ).replace(/\/$/, '');
  const viewLiveHref = commerceBase
    ? `${commerceBase}/?v=${newVersion}-${Date.now()}`
    : '/admin/website';

  // Validation audit checks
  const warnings: string[] = [];
  const heroContent = config.homepageSections.find(s => s.type === 'hero')?.content;
  if (heroContent && !heroContent.mainHeading) {
    warnings.push('Hero main heading is empty.');
  }
  if (!config.announcements.items.some(a => a.active)) {
    warnings.push('No announcement bar is currently marked active.');
  }

  const handlePublish = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      publishChanges(publishNotes);
      setIsSubmitting(false);
      setIsPublishModalOpen(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#101828]/50 backdrop-blur-xs animate-in fade-in"
        onClick={() => !isSubmitting && setIsPublishModalOpen(false)}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#F2F3F5] overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F2F3F5] bg-[#FFF4F8] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#FFD8EA] flex items-center justify-center shadow-xs">
              <BunnyMascot size="sm" mood="celebration" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#263550]">Publish Storefront Changes</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#263550] text-white">
                  v{newVersion}
                </span>
              </div>
              <p className="text-xs text-[#98A0AE]">Your changes will instantly go live to all Neria Collective visitors</p>
            </div>
          </div>
          <button
            onClick={() => setIsPublishModalOpen(false)}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-[#98A0AE] hover:text-[#263550] hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Validation Status */}
          {warnings.length > 0 ? (
            <div className="p-3.5 rounded-2xl bg-[#FFFAEB] border border-[#FEDF89] text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#B54708]">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Validation Checklist (Non-critical)</span>
              </div>
              <ul className="list-disc list-inside text-[#B54708]/90 pl-1 text-[11px] space-y-0.5">
                {warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-[#ECFDF3] border border-[#ABEFC6] text-xs flex items-center gap-2.5 text-[#027A48]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="font-semibold">All content validations passed. Ready for seamless publishing!</span>
            </div>
          )}

          {/* Change Summary Diff */}
          <div>
            <h4 className="text-xs font-bold text-[#263550] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF4FA3]" />
              Detected Changes ({diffs.length})
            </h4>
            <div className="p-3 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-2 max-h-40 overflow-y-auto">
              {diffs.map((diff, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#344054]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#027A48] mt-0.5 shrink-0" />
                  <span>{diff}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Release Notes */}
          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1.5">
              Publish Notes / Changelog (Optional)
            </label>
            <input
              type="text"
              value={publishNotes}
              onChange={e => setPublishNotes(e.target.value)}
              placeholder="e.g. Updated Autumn hero drop and new arrival badges"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3] focus:ring-1 focus:ring-[#FF4FA3]"
            />
          </div>

          {/* Global Safety Note */}
          <div className="p-3 rounded-2xl bg-[#F0F9FF] border border-[#B9E6FE] text-[11px] text-[#026AA2] flex items-center gap-2.5">
            <Globe className="w-4 h-4 shrink-0" />
            <span>Automatic version snapshot recorded in <strong>Publish History</strong> for one-click instant rollbacks anytime.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#F8F8FA] border-t border-[#F2F3F5] flex justify-between items-center gap-2">
          <div className="flex items-center gap-1 min-w-0">
            <button
              onClick={() => setIsPublishModalOpen(false)}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-[#667085] hover:bg-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            {commerceBase && (
              <a
                href={viewLiveHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[#475467] hover:text-[#FF4FA3] hover:bg-white rounded-xl transition-colors"
                title="Open the live storefront in a new tab (cache-busted)"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Preview live</span>
              </a>
            )}
          </div>

          <button
            onClick={handlePublish}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF4FA3] hover:bg-[#E63E90] text-white font-bold text-xs shadow-md shadow-[#FF4FA3]/25 transition-all hover:scale-102 active:scale-98"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Publishing Live...
              </>
            ) : (
              <>
                <span>Publish Storefront Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
