'use client';

/**
 * EditorLeftSidebar
 *
 * Read-only sidebar for the visual editor. Renders three groups:
 *
 *   1. **Singletons** (always visible, on every page) — five global
 *      sections that the user can edit from anywhere: Theme & Colors,
 *      Announcement Bar, Promotional Popup, Header & Navigation,
 *      Storefront Footer.
 *
 *   2. **Page text** (dynamic, populated from the iframe) — a list of
 *      every `data-cms-key="pg-<page>-*"` element currently rendered
 *      on the loaded commerce route. The list comes from the
 *      `cms:ready` postMessage the EditModeOverlay emits on mount and
 *      on every DOM mutation. Clicking a row opens that single key in
 *      the right-side property panel.
 *
 *   3. **Assets & media** — the media library and bunny mascot picker
 *      still work for users who want to upload a new image and use it
 *      somewhere.
 *
 * Per the user's constraint, the sidebar is **strictly read-only**.
 * There are no add/remove/reorder controls. The list of editable
 * elements is whatever the live site currently exposes.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { BunnyMascot } from '../ui/BunnyMascot';
import {
  Layers, Palette, Film, Sparkles, ChevronRight, LayoutTemplate,
  Image as ImageIcon, Type, ChevronDown, Bell, Megaphone,
  Paintbrush, Mail, Component,
} from 'lucide-react';

type DiscoveredSection = {
  key: string;
  currentText: string;
  rect: { x: number; y: number; width: number; height: number; top: number; left: number; right: number; bottom: number };
};

const SINGLETON_DEFS = [
  {
    id: 'theme',
    label: 'Theme & Colors',
    icon: Paintbrush,
    dot: 'bg-[#263550]',
  },
  {
    id: 'announcements',
    label: 'Announcement Bar',
    icon: Bell,
    dot: 'bg-[#CBE7FA]',
    children: 'announcements' as const,
  },
  {
    id: 'popup',
    label: 'Promotional Popup',
    icon: Megaphone,
    dot: 'bg-[#FFD8EA]',
  },
  {
    id: 'navigation',
    label: 'Header & Navigation',
    icon: LayoutTemplate,
    dot: 'bg-[#FF4FA3]',
    children: 'navigation' as const,
  },
  {
    id: 'footer',
    label: 'Storefront Footer',
    icon: Layers,
    dot: 'bg-[#263550]',
    children: 'footer' as const,
  },
  {
    id: 'brand',
    label: 'Brand Identity',
    icon: Sparkles,
    dot: 'bg-[#FF4FA3]',
  },
] as const;

// Section ids that the live site shows in the "On this page" list
// but that we deliberately want to move out: their keys live under
// the Global dropdown instead. A key whose sectionId is in this set
// is filtered out of the per-page group.
const GLOBAL_SECTION_IDS = new Set(['announcements', 'navigation', 'footer']);

function prettyAnnLabel(item: { id: string; message?: string; emoji?: string }) {
  const msg = (item.message || '').replace(/\s+/g, ' ').trim();
  if (msg) return msg.length > 50 ? msg.slice(0, 47) + '…' : msg;
  return item.emoji ? `${item.emoji} ${item.id}` : item.id;
}

function prettyNavLabel(item: { id: string; label?: string }) {
  return item.label || item.id;
}

/**
 * Renders the inner-key rows for a Global dropdown. The keys are
 * stable strings that the live site's `EditModeOverlay` discovers
 * (e.g. `announcement.message`, `navigation.menuItems.nav-shop.label`,
 * `pg-footer-col-shop-title`). Clicking a row selects the matching
 * element in the iframe via the standard scroll-to event.
 */
function renderGlobalChildren(
  which: 'announcements' | 'navigation' | 'footer',
  config: any,
  activeElementKey: string | null,
  onSelect: (key: string) => void,
) {
  if (which === 'announcements') {
    const items = config?.announcements?.items ?? [];
    if (items.length === 0) {
      return (
        <p className="text-[10px] text-[#98A0AE] italic px-2 py-1.5">No announcement items yet</p>
      );
    }
    return items.map((it: any) => {
      const key = `announcement.message.${it.id}`;
      return (
        <button
          key={it.id}
          onClick={() => onSelect(key)}
          className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] truncate flex items-center gap-1.5 transition-colors ${
            activeElementKey === key
              ? 'bg-[#FF4FA3] text-white'
              : 'hover:bg-white text-[#475467]'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: it.bgColor || '#263550' }} />
          <span className="truncate">{prettyAnnLabel(it)}</span>
        </button>
      );
    });
  }
  if (which === 'navigation') {
    const items = config?.navigation?.menuItems ?? [];
    if (items.length === 0) {
      return <p className="text-[10px] text-[#98A0AE] italic px-2 py-1.5">No menu items</p>;
    }
    return items.map((it: any) => {
      const key = `navigation.menuItems.${it.id}.label`;
      return (
        <button
          key={it.id}
          onClick={() => onSelect(key)}
          className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] truncate transition-colors ${
            activeElementKey === key
              ? 'bg-[#FF4FA3] text-white'
              : 'hover:bg-white text-[#475467]'
          }`}
        >
          {prettyNavLabel(it)}
        </button>
      );
    });
  }
  // footer — derive from columns defined in the default config
  const columns = config?.footer?.columns ?? [];
  if (columns.length === 0) {
    return <p className="text-[10px] text-[#98A0AE] italic px-2 py-1.5">No footer columns</p>;
  }
  const rows: { key: string; label: string }[] = [];
  for (const col of columns) {
    rows.push({ key: `pg-footer-col-${col.id.replace(/^col-/, '')}-title`, label: `${col.title || col.id} — column title` });
    for (let i = 0; i < (col.links ?? []).length; i++) {
      const link = col.links[i];
      const linkIdx = i + 1;
      rows.push({
        key: `pg-footer-col-${col.id.replace(/^col-/, '')}-link-${linkIdx}`,
        label: link.label || `${col.title || col.id} link ${linkIdx}`,
      });
    }
  }
  return rows.map((r) => (
    <button
      key={r.key}
      onClick={() => onSelect(r.key)}
      className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] truncate transition-colors ${
        activeElementKey === r.key
          ? 'bg-[#FF4FA3] text-white'
          : 'hover:bg-white text-[#475467]'
      }`}
    >
      {r.label}
    </button>
  ));
}

function prettyLabel(key: string): string {
  // Convert `pg-shop-cat-all` → `Cat all`, `pg-product-add-to-bag` →
  // `Add to bag`, `pg-home-hero-title-line-1` → `Hero title line 1`.
  // Strips the leading `pg-<page>-` segment.
  const m = key.match(/^pg-[^-]+-(.+)$/);
  const tail = m ? m[1] : key;
  return tail
    .split('-')
    .map((w) => (w.length <= 2 && /^[a-z]+$/.test(w) ? w.toUpperCase() : w))
    .map((w, i) => (i === 0 ? w[0]?.toUpperCase() + w.slice(1) : w))
    .join(' ');
}

function pageKeyFor(section: DiscoveredSection, currentPath: string): string | null {
  // The `pg-<page>-<field>` key encodes the page. We use it to group
  // rows and to filter by the active page.
  const m = section.key.match(/^pg-([^-]+)-/);
  if (!m) return null;
  return m[1];
}

export function EditorLeftSidebar() {
  const {
    activeSectionId,
    setActiveSectionId,
    activeElementKey,
    setActiveElementKey,
    setActivePageId,
    openMediaPicker,
    openBunnyPicker,
    config,
  } = useStorefrontCms();

  const [activeTab, setActiveTab] = useState<'content' | 'brand' | 'media'>('content');
  const [discoveredSections, setDiscoveredSections] = useState<DiscoveredSection[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('/');
  // Track which Global dropdowns are expanded. Default: only the one
  // currently active.
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(() => {
    const s = new Set<string>();
    if (activeSectionId && SINGLETON_DEFS.some(d => d.id === activeSectionId)) {
      s.add(activeSectionId);
    }
    return s;
  });
  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Listen for the discovered-sections broadcast from the
  // IframeStorefrontCanvas (which receives the `cms:ready` postMessage
  // from the live site's EditModeOverlay).
  useEffect(() => {
    const onDiscovered = (e: Event) => {
      const detail = (e as CustomEvent<{ sections: DiscoveredSection[]; path: string }>).detail;
      if (!detail) return;
      setDiscoveredSections(Array.isArray(detail.sections) ? detail.sections : []);
      if (typeof detail.path === 'string') setCurrentPath(detail.path);
    };
    window.addEventListener('neria:editor:discovered-sections', onDiscovered as EventListener);
    return () => window.removeEventListener('neria:editor:discovered-sections', onDiscovered as EventListener);
  }, []);

  // Group discovered sections by their page segment (e.g. `pg-home-*`,
  // `pg-shop-*`). We render one group per page, ordered by frequency so
  // the page that currently has the most keys floats to the top.
  // We filter out any key whose section id is one of the Global
  // sections (announcements / navigation / footer) — those are surfaced
  // under the Global dropdown instead of the per-page list.
  const grouped = useMemo(() => {
    const groups = new Map<string, DiscoveredSection[]>();
    for (const s of discoveredSections) {
      const page = pageKeyFor(s, currentPath);
      if (!page) continue;
      if (GLOBAL_SECTION_IDS.has(page)) continue;
      const list = groups.get(page) ?? [];
      list.push(s);
      groups.set(page, list);
    }
    return Array.from(groups.entries())
      .map(([page, rows]) => ({ page, rows }))
      .sort((a, b) => b.rows.length - a.rows.length);
  }, [discoveredSections, currentPath]);

  // Count of discovered Global keys, shown as a badge on the parent row.
  const globalKeyCounts = useMemo(() => {
    const counts: Record<string, number> = { announcements: 0, navigation: 0, footer: 0 };
    for (const s of discoveredSections) {
      const page = pageKeyFor(s, currentPath);
      if (page && GLOBAL_SECTION_IDS.has(page)) {
        counts[page] = (counts[page] ?? 0) + 1;
      }
    }
    return counts;
  }, [discoveredSections, currentPath]);

  // Total per-page rows after Global filtering, for the "On this page"
  // badge in the sidebar header.
  const perPageRowCount = useMemo(
    () => grouped.reduce((acc, g) => acc + g.rows.length, 0),
    [grouped],
  );

  // Resolve the page label for the dropdown (commerce site routes).
  const pageLabel = useMemo(() => {
    const map: Record<string, string> = {
      '/': 'Homepage',
      '/shop': 'Shop',
      '/trending': 'Trending',
      '/cart': 'Cart',
      '/checkout': 'Checkout',
      '/account': 'Account',
      '/orders': 'Orders',
      '/auth': 'Auth',
      '/order/track/example-order': 'Order Track',
    };
    return map[currentPath] ?? currentPath;
  }, [currentPath]);

  return (
    <aside className="w-80 bg-white border-r border-[#F2F3F5] flex flex-col h-full shrink-0 select-none overflow-hidden shadow-xs">
      {/* Tab Navigation */}
      <div className="grid grid-cols-3 p-1.5 border-b border-[#F2F3F5] bg-[#F8F8FA]">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex flex-col items-center py-2 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === 'content'
              ? 'bg-white text-[#263550] shadow-xs'
              : 'text-[#98A0AE] hover:text-[#263550]'
          }`}
        >
          <Layers className="w-4 h-4 mb-0.5 text-[#FF4FA3]" />
          <span>Content</span>
        </button>

        <button
          onClick={() => setActiveTab('brand')}
          className={`flex flex-col items-center py-2 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === 'brand'
              ? 'bg-white text-[#263550] shadow-xs'
              : 'text-[#98A0AE] hover:text-[#263550]'
          }`}
        >
          <Palette className="w-4 h-4 mb-0.5 text-[#FF4FA3]" />
          <span>Theme</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`flex flex-col items-center py-2 rounded-xl text-[10px] font-bold transition-all ${
            activeTab === 'media'
              ? 'bg-white text-[#263550] shadow-xs'
              : 'text-[#98A0AE] hover:text-[#263550]'
          }`}
        >
          <Film className="w-4 h-4 mb-0.5 text-[#FF4FA3]" />
          <span>Assets</span>
        </button>
      </div>

      {/* Tab 1: Singletons + per-page text */}
      {activeTab === 'content' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Current page banner */}
          <div className="rounded-xl bg-gradient-to-br from-[#FFF4F8] to-[#FFD8EA] border border-[#FFD8EA] p-2.5">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#FF4FA3]">
              <Component className="w-3 h-3" />
              <span>Editing in iframe</span>
            </div>
            <div className="mt-1 text-sm font-bold text-[#263550] truncate">
              {pageLabel}
            </div>
            <div className="mt-0.5 text-[10px] text-[#667085] font-mono truncate">
              {currentPath}
            </div>
          </div>

          {/* Singletons — Global section with collapsible dropdowns.
              The parent button opens the section's right-side editor
              (colors / trigger / etc.). If the section has children
              (announcements, navigation, footer), the chevron expands
              a list of its inner keys. Clicking a child selects that
              individual element in the iframe. */}
          <div>
            <div className="px-1 mb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#98A0AE]">
                Global
              </span>
            </div>
            <div className="space-y-1.5">
              {SINGLETON_DEFS.map((s) => {
                const Icon = s.icon;
                const isSelected = activeSectionId === s.id && !activeElementKey;
                const hasChildren = 'children' in s;
                const isOpen = openDropdowns.has(s.id);
                const childCount = hasChildren
                  ? (globalKeyCounts[(s as any).children] ?? 0)
                  : 0;
                return (
                  <div key={s.id} className="rounded-xl border border-[#F2F3F5] bg-white overflow-hidden">
                    <div className="flex items-stretch">
                      <button
                        onClick={() => {
                          setActiveElementKey(null);
                          setActiveSectionId(s.id);
                        }}
                        className={`flex-1 text-left p-2.5 flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-[#FFF4F8]'
                            : 'hover:bg-[#F8F8FA]'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-xs">
                          <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                          <Icon className="w-3.5 h-3.5 text-[#263550]" aria-hidden="true" />
                          <span className={isSelected ? 'font-bold text-[#263550]' : 'font-medium text-[#475467]'}>
                            {s.label}
                          </span>
                          {hasChildren && childCount > 0 && (
                            <span className="text-[9px] font-mono text-[#98A0AE]">
                              ({childCount})
                            </span>
                          )}
                        </div>
                      </button>
                      {hasChildren && (
                        <button
                          onClick={() => toggleDropdown(s.id)}
                          aria-label={isOpen ? 'Collapse' : 'Expand'}
                          className="px-2.5 text-[#98A0AE] hover:text-[#263550] hover:bg-[#F8F8FA] transition-colors border-l border-[#F2F3F5]"
                        >
                          {isOpen ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                    {hasChildren && isOpen && (
                      <div className="border-t border-[#F2F3F5] bg-[#F8F8FA] p-1.5 space-y-1">
                        {renderGlobalChildren(
                          (s as any).children as 'announcements' | 'navigation' | 'footer',
                          config,
                          activeElementKey,
                          (key) => {
                            setActiveElementKey(key);
                            setActiveSectionId(s.id);
                            window.dispatchEvent(
                              new CustomEvent('neria:editor:scroll-to', { detail: { key } }),
                            );
                          },
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Per-page text — only shown when the iframe has reported at
              least one editable key. Each row is one element on the
              live page; clicking it loads the textarea editor on the
              right. */}
          <div>
            <div className="px-1 mb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#98A0AE]">
                On this page
              </span>
              <span className="text-[10px] font-bold text-[#98A0AE]">
                {perPageRowCount}
              </span>
            </div>

            {perPageRowCount === 0 ? (
              <div className="p-4 rounded-2xl border border-dashed border-[#DDE1E7] text-center">
                <Sparkles className="w-5 h-5 text-[#FF4FA3] mx-auto mb-1" />
                <p className="text-[11px] text-[#98A0AE] leading-snug">
                  Loading live site… editable text on this page will appear here once it loads.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {grouped.map(({ page, rows }) => (
                  <div key={page}>
                    <div className="px-1 mb-1 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#98A0AE]">
                        {page}
                      </span>
                      <span className="text-[9px] font-mono text-[#98A0AE]">
                        ({rows.length})
                      </span>
                    </div>
                    <div className="space-y-1">
                      {rows.map((s) => {
                        const isActive = activeElementKey === s.key;
                        const preview = (s.currentText || '').replace(/\s+/g, ' ').trim().slice(0, 60);
                        return (
                          <button
                            key={s.key}
                            onClick={() => {
                              setActiveElementKey(s.key);
                              // Also keep the section id in sync so the
                              // property panel knows which page-group
                              // we're in.
                              setActiveSectionId(`pg-${page}`);
                              // Ask the iframe canvas to scroll the
                              // matching element into view and flash
                              // its active state. The IframeStorefrontCanvas
                              // listens for this and posts `cms:focus`
                              // to the live site.
                              window.dispatchEvent(
                                new CustomEvent('neria:editor:scroll-to', {
                                  detail: { key: s.key },
                                }),
                              );
                            }}
                            className={`w-full text-left p-2 rounded-lg border flex flex-col gap-0.5 transition-all ${
                              isActive
                                ? 'bg-[#FFF4F8] border-[#FF4FA3] shadow-xs'
                                : 'bg-white border-[#F2F3F5] hover:border-[#FFD8EA] hover:bg-[#F8F8FA]'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <Type className="w-3 h-3 text-[#FF4FA3] shrink-0" aria-hidden="true" />
                              <span className={`text-[11px] truncate ${isActive ? 'font-bold text-[#263550]' : 'font-semibold text-[#475467]'}`}>
                                {prettyLabel(s.key)}
                              </span>
                            </div>
                            <div className="text-[10px] text-[#98A0AE] truncate pl-4">
                              {preview || <span className="italic text-[#DDE1E7]">empty</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Theme & Brand quick access */}
      {activeTab === 'brand' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="p-3 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA]">
            <h5 className="text-xs font-bold text-[#263550]">Theme & Token Architecture</h5>
            <p className="text-[11px] text-[#667085] mt-0.5">
              Editing theme variables updates the entire storefront in real-time.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveElementKey(null);
              setActiveSectionId('theme');
              setActiveTab('content');
            }}
            className="w-full py-2.5 rounded-xl bg-[#263550] hover:bg-[#FF4FA3] text-white text-xs font-bold transition-colors shadow-xs"
          >
            Open Theme & Color Inspector
          </button>
        </div>
      )}

      {/* Tab 3: Assets & Media */}
      {activeTab === 'media' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="p-4 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] flex items-center justify-center mb-2">
              <BunnyMascot size="sm" mood="celebration" />
            </div>
            <h5 className="text-xs font-bold text-[#263550]">Neria Brand Assets</h5>
            <p className="text-[11px] text-[#98A0AE] mt-1 mb-3">
              Browse your bunny mascots, campaign lookbooks, and high-res imagery.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => openMediaPicker(() => {})}
                className="w-full py-2 rounded-xl bg-white border border-[#DDE1E7] hover:border-[#FF4FA3] text-xs font-bold text-[#263550] transition-colors"
              >
                Browse Media Library
              </button>
              <button
                onClick={() => openBunnyPicker(() => {})}
                className="w-full py-2 rounded-xl bg-[#FF4FA3] hover:bg-[#E63E90] text-white text-xs font-bold transition-colors shadow-xs"
              >
                Browse Bunny Mascots
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
