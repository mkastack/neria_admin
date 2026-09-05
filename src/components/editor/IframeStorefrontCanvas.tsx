'use client';

/**
 * IframeStorefrontCanvas
 *
 * The live preview in the visual editor. Loads the actual neria_commerce
 * site inside an iframe with `?edit=1`, which activates the
 * EditModeOverlay inside the commerce app.
 *
 * Flow:
 *   1. The iframe loads and the commerce app's EditModeOverlay fires a
 *      `cms:ready` postMessage.
 *   2. When the user clicks an annotated element in the iframe, the
 *      overlay posts `cms:select { key, currentText, rect }`.
 *   3. We look up `key` in `cmsKeyToSection` to figure out which admin
 *      section to activate, then call `setActiveSectionId(sectionId)`.
 *   4. The right-side property panel renders the matching fields and
 *      writes to Firestore on save.
 *   5. We watch the live config (debounced) and push any changed
 *      `data-cms-key` values into the iframe so the user sees their
 *      change in the live site immediately - no reload.
 *
 * If `NEXT_PUBLIC_COMMERCE_URL` is not set, we fall back to a friendly
 * placeholder so the editor still loads.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { resolveCmsKey, sectionToCmsKeys } from '@/src/lib/cmsKeyMap';
import { RefreshCw, ExternalLink, Globe, Wifi, WifiOff } from 'lucide-react';

type DiscoveredSection = {
  key: string;
  currentText: string;
  rect: { x: number; y: number; width: number; height: number; top: number; left: number; right: number; bottom: number };
};

type SelectMessage = {
  type: 'cms:select';
  key: string;
  currentText: string;
  rect: { x: number; y: number; width: number; height: number; top: number; left: number; right: number; bottom: number };
};

type ReadyMessage = { type: 'cms:ready'; sections: DiscoveredSection[] };
type AuthStateMessage = {
  type: 'cms:auth:state';
  user: { uid: string; email: string | null } | null;
};
type Message = SelectMessage | ReadyMessage | AuthStateMessage;

export type PreviewAuthUser = { uid: string; email: string | null };

interface Props {
  className?: string;
  initialPath?: string;
}

export function IframeStorefrontCanvas({ className = '', initialPath = '/' }: Props) {
  const { setActiveSectionId, setActiveElementKey, deviceMode, config, publishedConfig, activePageId } = useStorefrontCms();
  const [isReady, setIsReady] = useState(false);
  const [lastSelectedKey, setLastSelectedKey] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [discoveredSections, setDiscoveredSections] = useState<DiscoveredSection[]>([]);
  const [previewAuthUser, setPreviewAuthUser] = useState<PreviewAuthUser | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Broadcast the latest discovered sections to the sidebar so it can
  // render a dynamic, page-aware list of `data-cms-key` rows. We use a
  // window event so we don't have to lift state or rewire the prop tree.
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('neria:editor:discovered-sections', {
        detail: { sections: discoveredSections, path: currentPath },
      }),
    );
  }, [discoveredSections, currentPath]);

  // Broadcast the latest auth state (from inside the iframe) to the
  // top bar's Sign-in/Sign-out toggle. The iframe's EditModeOverlay
  // posts `cms:auth:state` every time onAuthStateChanged fires.
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('neria:editor:auth-state', {
        detail: { user: previewAuthUser },
      }),
    );
  }, [previewAuthUser]);

  // React to the top-bar page switcher.
  useEffect(() => {
    const onNav = (e: Event) => {
      const detail = (e as CustomEvent<{ path: string }>).detail;
      if (detail?.path) {
        setCurrentPath(detail.path);
        setIsReady(false);
        setLastSelectedKey(null);
      }
    };
    window.addEventListener('neria:editor:navigate', onNav as EventListener);
    return () => window.removeEventListener('neria:editor:navigate', onNav as EventListener);
  }, []);

  // React to the top-bar Sign-in/Sign-out toggle. The toggle writes a
  // localStorage flag in the iframe's context and (for sign-out)
  // reloads the iframe so the overlay's on-mount logic kicks in.
  const commerceUrl = (process.env.NEXT_PUBLIC_COMMERCE_URL || '').replace(/\/$/, '');

  useEffect(() => {
    const onSetAuth = (e: Event) => {
      const detail = (e as CustomEvent<{ state: 'in' | 'out' }>).detail;
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      const state = detail?.state === 'in' ? 'in' : 'out';
      win.postMessage({ type: 'cms:set-preview-auth', state }, commerceUrl || '*');
      if (state === 'out') {
        // Force a reload so the overlay's on-mount logic reads the
        // new flag and signs any lingering user out.
        setIsReady(false);
        setRefreshKey((k) => k + 1);
        setCurrentPath('/');
        setLastSelectedKey(null);
      }
    };
    window.addEventListener('neria:editor:set-preview-auth', onSetAuth as EventListener);
    return () => window.removeEventListener('neria:editor:set-preview-auth', onSetAuth as EventListener);
  }, [commerceUrl]);

  // React to a left-sidebar row click that wants the iframe to scroll
  // to the matching annotated element. We post `cms:focus` with the
  // key; the EditModeOverlay handles the scroll + flash highlight.
  useEffect(() => {
    const onScrollTo = (e: Event) => {
      const detail = (e as CustomEvent<{ key: string }>).detail;
      const key = detail?.key;
      if (!key) return;
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      win.postMessage({ type: 'cms:focus', key }, commerceUrl || '*');
    };
    window.addEventListener('neria:editor:scroll-to', onScrollTo as EventListener);
    return () => window.removeEventListener('neria:editor:scroll-to', onScrollTo as EventListener);
  }, [commerceUrl]);

  // React to a successful publish — reload the iframe so the admin's
  // preview matches the freshly-committed version on the live site.
  useEffect(() => {
    const onPublished = () => {
      setIsReady(false);
      setRefreshKey((k) => k + 1);
    };
    window.addEventListener('neria:editor:just-published', onPublished);
    return () => window.removeEventListener('neria:editor:just-published', onPublished);
  }, []);

  const iframeSrc = commerceUrl
    ? `${commerceUrl}${currentPath}?edit=1`
    : '';

  // The "live" config: prefer the in-memory draft (unsaved edits) so the
  // user sees their changes in the iframe before they hit Publish.
  const liveConfig = config || publishedConfig;

  // Listen for postMessage from the commerce site
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (commerceUrl) {
        try {
          const originUrl = new URL(event.origin);
          const commerceUrlParsed = new URL(commerceUrl);
          if (
            event.origin !== 'null' &&
            originUrl.hostname !== commerceUrlParsed.hostname
          ) {
            return;
          }
        } catch {
          return;
        }
      }

      const data = event.data as Message | undefined;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'cms:ready') {
        setIsReady(true);
        // `cms:ready` carries the full enumeration of `data-cms-key`
        // elements the EditModeOverlay just discovered. We hold onto
        // them so the left sidebar can render a dynamic list of
        // currently-visible keys. The overlay re-emits this payload
        // on every DOM mutation (debounced via rAF), so the list
        // stays in sync as the user navigates between routes.
        const sections = Array.isArray((data as ReadyMessage).sections)
          ? (data as ReadyMessage).sections
          : [];
        setDiscoveredSections(sections);
        return;
      }

      if (data.type === 'cms:select') {
        const { key } = data as SelectMessage;
        setLastSelectedKey(key);
        const sectionId = resolveCmsKey(key);
        if (sectionId) {
          setActiveSectionId(sectionId);
        }
        // Always set the active element key, even if `resolveCmsKey`
        // returned null — the left sidebar's per-page row uses
        // `activeElementKey === s.key` to highlight, and the per-page
        // text editor in the right panel needs the key to know which
        // (page, field) pair to edit.
        setActiveElementKey(key);
        return;
      }

      if (data.type === 'cms:auth:state') {
        setPreviewAuthUser((data as AuthStateMessage).user);
        return;
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [commerceUrl, setActiveSectionId]);

  // Build a flat map of { cmsKey: currentValue } from the live config.
  // This lets us push only the changed values into the iframe rather than
  // reloading on every keystroke.
  const cmsKeyToValue = useMemo(() => {
    const out: Record<string, string> = {};
    if (!liveConfig) return out;

    // Announcement bar (first item is the visible one)
    const ann = liveConfig.announcements?.items?.[0];
    if (ann) {
      out['announcement.message'] = ann.message || '';
      out['announcement.emoji'] = ann.emoji || '';
      out['announcement.linkText'] = ann.linkText || '';
    }

    // Footer
    if (liveConfig.footer) {
      out['footer.brandBio'] = liveConfig.footer.brandBio || '';
      out['footer.copyrightText'] = liveConfig.footer.copyrightText || '';
    }

    // Homepage sections - look up the matching `content` field for each key
    for (const sec of liveConfig.homepageSections || []) {
      const c: any = sec.content || {};
      const keys = sectionToCmsKeys(sec.id);
      for (const key of keys) {
        if (key.endsWith('.heading') && typeof c.heading === 'string') out[key] = c.heading;
        else if (key.endsWith('.subtitle') && typeof c.subtitle === 'string') out[key] = c.subtitle;
        else if (key.endsWith('.description') && typeof c.description === 'string') out[key] = c.description;
        else if (key.endsWith('.mainHeading') && typeof c.mainHeading === 'string') out[key] = c.mainHeading;
        else if (key.endsWith('.badge') && typeof c.smallLabel === 'string') out[key] = c.smallLabel;
        else if (key.endsWith('.primaryButton') && typeof c.primaryButtonText === 'string') out[key] = c.primaryButtonText;
        else if (key.endsWith('.secondaryButton') && typeof c.secondaryButtonText === 'string') out[key] = c.secondaryButtonText;
        else if (key.endsWith('.buttonText') && typeof c.buttonText === 'string') out[key] = c.buttonText;
        else if (key.endsWith('.ctaText') && typeof c.ctaText === 'string') out[key] = c.ctaText;
        else if (key.endsWith('.collectionName') && typeof c.collectionName === 'string') out[key] = c.collectionName;
        else if (key.endsWith('.name') && typeof c.name === 'string') out[key] = c.name;
        else if (key.endsWith('.message') && typeof c.message === 'string') out[key] = c.message;
        else if (key.endsWith('.tagline') && typeof c.tagline === 'string') out[key] = c.tagline;
      }
    }

    // Per-page text. Every `data-cms-key="pg-<page>-<field>"` attribute on
    // the live site reads from `config.pageText[page][field]`. We invert
    // the same split the commerce app uses so the editor pushes
    // value-edits into the iframe without a reload.
    const pageText = (liveConfig as any).pageText as
      | Record<string, Record<string, string>>
      | undefined;
    if (pageText) {
      for (const [page, fields] of Object.entries(pageText)) {
        if (!fields || typeof fields !== 'object') continue;
        for (const [field, value] of Object.entries(fields)) {
          if (typeof value !== 'string') continue;
          out[`pg-${page}-${field}`] = value;
        }
      }
    }

    return out;
  }, [liveConfig]);

  // Push the latest values into the iframe whenever the config changes.
  // Debounced so we don't spam during typing.
  useEffect(() => {
    if (!isReady || !iframeRef.current?.contentWindow) return;
    const win = iframeRef.current.contentWindow;
    const handle = setTimeout(() => {
      for (const [key, value] of Object.entries(cmsKeyToValue)) {
        win.postMessage({ type: 'cms:apply', key, value }, commerceUrl || '*');
      }
    }, 200);
    return () => clearTimeout(handle);
  }, [cmsKeyToValue, isReady, commerceUrl]);

  const handleRefresh = useCallback(() => {
    setIsReady(false);
    setRefreshKey((k) => k + 1);
  }, []);

  const handleOpenExternal = useCallback(() => {
    if (commerceUrl) {
      window.open(`${commerceUrl}${currentPath}`, '_blank', 'noopener,noreferrer');
    }
  }, [commerceUrl, currentPath]);

  if (!commerceUrl) {
    return (
      <div className={`flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-[#DDE1E7] p-12 text-center ${className}`}>
        <div className="w-14 h-14 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] flex items-center justify-center mb-4">
          <Globe className="w-7 h-7 text-[#FF4FA3]" />
        </div>
        <h3 className="text-sm font-bold text-[#263550] mb-1">Commerce URL not configured</h3>
        <p className="text-xs text-[#667085] max-w-sm mb-3">
          Add <code className="font-mono text-[11px] bg-[#F8F8FA] px-1.5 py-0.5 rounded">NEXT_PUBLIC_COMMERCE_URL</code> to your <code className="font-mono text-[11px] bg-[#F8F8FA] px-1.5 py-0.5 rounded">.env.local</code> to load the live storefront here.
        </p>
        <p className="text-[11px] text-[#98A0AE] max-w-sm">
          Example: <code className="font-mono">NEXT_PUBLIC_COMMERCE_URL=http://localhost:3000</code>
        </p>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col h-full overflow-hidden rounded-2xl ${className}`}>
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-[#1D2939] text-white text-[11px] border-b border-[#101828] shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2 h-2 rounded-full ${isReady ? 'bg-[#12B76A]' : 'bg-[#F79009]'} ${isReady ? 'animate-pulse' : ''}`} />
          {isReady ? (
            <Wifi className="w-3 h-3 text-[#12B76A]" />
          ) : (
            <WifiOff className="w-3 h-3 text-[#F79009]" />
          )}
          <span className="font-semibold truncate">
            {isReady ? 'Live storefront connected' : 'Connecting...'}
          </span>
          {lastSelectedKey && (
            <span className="text-white/60 truncate hidden sm:inline">- {lastSelectedKey}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-white/50 font-mono text-[10px] hidden md:inline mr-2">
            {deviceMode}
          </span>
          <button
            onClick={handleRefresh}
            title="Reload the live site"
            className="p-1 rounded-md hover:bg-white/10 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleOpenExternal}
            title="Open live site in a new tab"
            className="p-1 rounded-md hover:bg-white/10 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <iframe
        key={refreshKey}
        ref={iframeRef}
        src={iframeSrc}
        title="Live storefront"
        className="flex-1 w-full bg-white"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
