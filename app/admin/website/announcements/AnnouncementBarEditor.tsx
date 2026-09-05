'use client';

/**
 * Announcement Bar editor — sits at /admin/website/announcements.
 *
 * Per the spec: the merchant controls the *timing* and *colors* of
 * the announcement bar, but not the message text (that copy lives in
 * the per-page text system or the storefront's hardcoded defaults).
 * The page exposes a live crossfading preview at the top so changes
 * are visible immediately, then a list of items with color pickers,
 * enable toggles, and reordering controls. Global settings — bar
 * visibility, auto-rotate, rotation interval — live in a separate
 * section at the bottom.
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, Eye, EyeOff, Plus, RotateCcw, Trash2, ChevronUp, ChevronDown, Save, Sparkles } from 'lucide-react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { BunnyMascot } from '@/src/components/ui/BunnyMascot';

export function AnnouncementBarEditor() {
  const {
    config,
    updateAnnouncements,
    saveDraft,
    isDirty,
    autoSaveStatus,
    resetAnnouncementsToPublished,
    publishedConfig,
  } = useStorefrontCms();
  const { addToast } = useAdmin();

  const items = config.announcements.items;
  const liveItems = useMemo(
    () => items.filter((it: any) => it.active),
    [items],
  );

  // ── Live preview (crossfade between active items) ──
  const [previewIndex, setPreviewIndex] = useState(0);
  useEffect(() => {
    if (!config.announcements.autoRotate || liveItems.length <= 1) return;
    const id = setInterval(() => {
      setPreviewIndex((i) => (i + 1) % liveItems.length);
    }, (config.announcements.rotationInterval || 5) * 1000);
    return () => clearInterval(id);
  }, [config.announcements.autoRotate, config.announcements.rotationInterval, liveItems.length]);

  const currentPreview = liveItems[previewIndex] || liveItems[0] || items[0];
  const hasChanged = JSON.stringify(config.announcements) !== JSON.stringify(publishedConfig.announcements);

  const setItem = (id: string, patch: any) => {
    updateAnnouncements((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));
  };

  const removeItem = (id: string) => {
    updateAnnouncements((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== id),
    }));
    addToast({ type: 'info', title: 'Announcement removed', description: 'Item no longer rotates in the bar.' });
  };

  const addItem = () => {
    const newId = `ann-${Date.now()}`;
    updateAnnouncements((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: newId,
          message: 'New announcement — edit text on the storefront side',
          emoji: '✨',
          linkText: 'Learn more',
          linkUrl: '/shop',
          bgColor: '#263550',
          textColor: '#FFFFFF',
          active: true,
          priority: prev.items.length + 1,
        },
      ],
    }));
    addToast({ type: 'success', title: 'Announcement added', description: 'New item appended to the bar.' });
  };

  const moveItem = (id: string, dir: -1 | 1) => {
    updateAnnouncements((prev) => {
      const idx = prev.items.findIndex((it) => it.id === id);
      if (idx === -1) return prev;
      const target = idx + dir;
      if (target < 0 || target >= prev.items.length) return prev;
      const copy = [...prev.items];
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      return { ...prev, items: copy };
    });
  };

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
              <Bell className="w-4 h-4 text-[#FF4FA3]" />
              <h1 className="text-xl font-extrabold text-[#263550]">Announcement Bar</h1>
              {hasChanged && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF4F8] text-[#FF4FA3]">
                  unsaved
                </span>
              )}
            </div>
            <p className="text-xs text-[#667085] mt-1 max-w-xl">
              Control the rotation timing and colors of the announcement bar that sits at the very top of the storefront.
              Message text is managed separately and is not editable on this page.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetAnnouncementsToPublished}
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

      {/* Live preview bar — identical markup to the live site's
          AnnouncementBar so the colors you pick land in the right
          place. Crossfades between active items. */}
      <div className="rounded-3xl border border-[#F2F3F5] bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-[#F2F3F5] bg-[#F8F8FA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4FA3]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#98A0AE]">Live preview</span>
          </div>
          <div className="flex items-center gap-1">
            {liveItems.map((it: any, idx: number) => (
              <span
                key={it.id}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  idx === previewIndex ? 'bg-[#FF4FA3]' : 'bg-[#DDE1E7]'
                }`}
              />
            ))}
          </div>
        </div>
        <div
          className="relative h-14 flex items-center justify-center px-4 text-center"
          style={{ backgroundColor: currentPreview?.bgColor || '#263550' }}
        >
          {liveItems.map((it: any, idx: number) => (
            <div
              key={it.id}
              className="absolute inset-0 flex items-center justify-center px-8 transition-opacity duration-300 ease-in-out"
              style={{
                color: it.textColor || '#FFFFFF',
                opacity: idx === previewIndex ? 1 : 0,
              }}
            >
              <span className="text-xs sm:text-sm font-semibold tracking-wide truncate max-w-4xl">
                {it.emoji && <span className="mr-1.5" aria-hidden>{it.emoji}</span>}
                {it.message}
                {it.linkText && (
                  <span className="ml-2 underline">{it.linkText} →</span>
                )}
              </span>
            </div>
          ))}
          {liveItems.length === 0 && (
            <span className="text-[11px] text-white/80 italic">No active announcement items</span>
          )}
        </div>
      </div>

      {/* Item list — colors and enable toggles, no text editing. */}
      <div className="rounded-3xl border border-[#F2F3F5] bg-white p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#263550]">Announcement Items</h2>
          <button
            onClick={addItem}
            className="px-3 py-1.5 rounded-xl bg-[#FF4FA3] hover:bg-[#E63E90] text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add item
          </button>
        </div>
        {items.length === 0 ? (
          <p className="text-xs text-[#98A0AE] italic">No items yet. Add one to get started.</p>
        ) : (
          <div className="space-y-2">
            {items.map((it: any, idx: number) => (
              <div
                key={it.id}
                className="p-3 rounded-2xl border border-[#F2F3F5] bg-white flex flex-col gap-3"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="w-10 h-10 rounded-xl shrink-0 border border-[#F2F3F5] flex items-center justify-center text-base"
                    style={{ background: it.bgColor }}
                  >
                    <span style={{ color: it.textColor }}>{it.emoji || '·'}</span>
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#263550] truncate">
                        {it.message || `(empty — ${it.id})`}
                      </span>
                      <span className="text-[9px] font-mono text-[#98A0AE]">{it.id}</span>
                    </div>
                    <p className="text-[10px] text-[#98A0AE] mt-0.5">
                      Text content is read-only here — managed via the storefront's announcement text system.
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => moveItem(it.id, -1)}
                      disabled={idx === 0}
                      className="p-1 rounded-md text-[#98A0AE] hover:text-[#263550] disabled:opacity-30 transition-colors"
                      title="Move up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveItem(it.id, 1)}
                      disabled={idx === items.length - 1}
                      className="p-1 rounded-md text-[#98A0AE] hover:text-[#263550] disabled:opacity-30 transition-colors"
                      title="Move down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeItem(it.id)}
                      className="p-1 rounded-md text-[#98A0AE] hover:text-[#B42318] transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-[#98A0AE] mb-0.5 uppercase">Background</label>
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="color"
                        value={it.bgColor}
                        onChange={(e) => setItem(it.id, { bgColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-[#DDE1E7]"
                      />
                      <input
                        type="text"
                        value={it.bgColor}
                        onChange={(e) => setItem(it.id, { bgColor: e.target.value })}
                        className="flex-1 px-2 py-1 rounded-md bg-[#F8F8FA] border border-[#DDE1E7] font-mono text-[10px]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#98A0AE] mb-0.5 uppercase">Text</label>
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="color"
                        value={it.textColor}
                        onChange={(e) => setItem(it.id, { textColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-[#DDE1E7]"
                      />
                      <input
                        type="text"
                        value={it.textColor}
                        onChange={(e) => setItem(it.id, { textColor: e.target.value })}
                        className="flex-1 px-2 py-1 rounded-md bg-[#F8F8FA] border border-[#DDE1E7] font-mono text-[10px]"
                      />
                    </div>
                  </div>
                  <div className="flex items-end justify-end">
                    <label className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#475467] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={it.active}
                        onChange={(e) => setItem(it.id, { active: e.target.checked })}
                        className="w-4 h-4 accent-[#FF4FA3]"
                      />
                      <span className="inline-flex items-center gap-1">
                        {it.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {it.active ? 'Active' : 'Hidden'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Global settings — bar visibility, auto-rotate, interval. */}
      <div className="rounded-3xl border border-[#F2F3F5] bg-white p-5 space-y-4">
        <h2 className="text-sm font-extrabold text-[#263550]">Bar Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="flex items-center justify-between p-3 rounded-2xl border border-[#F2F3F5] bg-[#F8F8FA] cursor-pointer">
            <div>
              <span className="text-[11px] font-bold text-[#263550]">Bar visible</span>
              <p className="text-[10px] text-[#98A0AE] mt-0.5">Show on every page</p>
            </div>
            <input
              type="checkbox"
              checked={config.announcements.enabled}
              onChange={(e) => updateAnnouncements((p) => ({ ...p, enabled: e.target.checked }))}
              className="w-4 h-4 accent-[#FF4FA3]"
            />
          </label>
          <label className="flex items-center justify-between p-3 rounded-2xl border border-[#F2F3F5] bg-[#F8F8FA] cursor-pointer">
            <div>
              <span className="text-[11px] font-bold text-[#263550]">Auto-rotate</span>
              <p className="text-[10px] text-[#98A0AE] mt-0.5">Cycle through active items</p>
            </div>
            <input
              type="checkbox"
              checked={config.announcements.autoRotate}
              onChange={(e) => updateAnnouncements((p) => ({ ...p, autoRotate: e.target.checked }))}
              className="w-4 h-4 accent-[#FF4FA3]"
            />
          </label>
          <div className="p-3 rounded-2xl border border-[#F2F3F5] bg-[#F8F8FA]">
            <label className="block text-[11px] font-bold text-[#263550] mb-1">
              Rotation interval: <span className="font-mono text-[#FF4FA3]">{config.announcements.rotationInterval || 5}s</span>
            </label>
            <input
              type="range"
              min={2}
              max={30}
              value={config.announcements.rotationInterval || 5}
              onChange={(e) => updateAnnouncements((p) => ({ ...p, rotationInterval: Math.max(2, Number(e.target.value)) }))}
              className="w-full accent-[#FF4FA3]"
            />
            <p className="text-[10px] text-[#98A0AE] mt-1">Time each announcement stays visible before the crossfade to the next.</p>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-[#98A0AE] flex items-center gap-1.5 px-1">
        <BunnyMascot size="sm" mood="happy" />
        <span>Changes save automatically. Click <b>Save Draft</b> to commit, then <Link className="text-[#FF4FA3] hover:underline" href="/admin/website/editor">open the editor</Link> or <Link className="text-[#FF4FA3] hover:underline" href="/admin/website">publish</Link>.</span>
      </div>
    </div>
  );
}
