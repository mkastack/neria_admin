"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  StorefrontConfig,
  DeviceMode,
  SectionConfig,
  PublishVersion,
  MediaAssetItem,
  BunnyAsset,
  JournalArticleItem,
  BrandSettingsConfig,
  ThemeColorsConfig,
  TypographyConfig,
  AnnouncementItem,
  PopupConfig,
  FooterConfig,
  SEOConfig,
  PageConfig,
  NavMenuItem,
  SectionType,
  PageTextConfig,
} from "../types";
import {
  defaultStorefrontConfig,
  initialBunnyAssets,
  initialMediaAssets,
  initialJournalArticles,
  initialPublishHistory,
} from "../cms-defaults";
import { useAdmin } from "./AdminContext";
import {
  appendPublishHistory,
  saveStorefrontConfig,
} from "@/src/lib/firebase/cms";
import {
  useStorefrontConfig as useFirestoreConfig,
} from "@/src/lib/firebase/cms";
import {
  uploadMedia as uploadMediaFile,
  deleteMedia as deleteMediaRecord,
} from "@/src/lib/firebase/media";
import { walkLeafDiff, summarize } from "@/src/lib/deepDiff";

interface StorefrontCmsContextType {
  // Config States
  config: StorefrontConfig;
  publishedConfig: StorefrontConfig;
  isDirty: boolean;
  autoSaveStatus: "saved" | "saving" | "unsaved";

  // Editor Viewport & Mode
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  activePageId: string;
  setActivePageId: (pageId: string) => void;
  activeSectionId: string | null;
  setActiveSectionId: (sectionId: string | null) => void;
  activeElementKey: string | null;
  setActiveElementKey: (key: string | null) => void;
  previewMode: boolean;
  setPreviewMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  quickEditMode: boolean;
  setQuickEditMode: (val: boolean | ((prev: boolean) => boolean)) => void;

  // History & Undo/Redo
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  publishHistory: PublishVersion[];
  restoreVersion: (versionId: string) => void;

  // Modals
  isPublishModalOpen: boolean;
  setIsPublishModalOpen: (val: boolean) => void;
  isEmojiPickerOpen: boolean;
  setIsEmojiPickerOpen: (val: boolean) => void;
  emojiPickerTarget: { onSelect: (emoji: string) => void } | null;
  openEmojiPicker: (onSelect: (emoji: string) => void) => void;
  isBunnyPickerOpen: boolean;
  setIsBunnyPickerOpen: (val: boolean) => void;
  bunnyPickerTarget: {
    onSelect: (bunnyMood: string, imageUrl: string) => void;
  } | null;
  openBunnyPicker: (
    onSelect: (bunnyMood: string, imageUrl: string) => void,
  ) => void;
  isMediaPickerOpen: boolean;
  setIsMediaPickerOpen: (val: boolean) => void;
  mediaPickerTarget: {
    onSelect: (url: string, alt?: string) => void;
  } | null;
  openMediaPicker: (onSelect: (url: string, alt?: string) => void) => void;

  // Media, Bunnies & Journal CMS assets
  mediaAssets: MediaAssetItem[];
  bunnyAssets: BunnyAsset[];
  journalArticles: JournalArticleItem[];
  addMediaAsset: (
    asset: Omit<
      MediaAssetItem,
      "id" | "createdAt" | "usedInCount" | "usedInLocations"
    > & { file?: File },
  ) => Promise<void>;
  deleteMediaAsset: (id: string) => Promise<boolean>;
  addJournalArticle: (article: Omit<JournalArticleItem, "id">) => void;
  updateJournalArticle: (
    id: string,
    updates: Partial<JournalArticleItem>,
  ) => void;
  deleteJournalArticle: (id: string) => void;

  // Mutation Operations
  updateConfig: (
    updater: (prev: StorefrontConfig) => StorefrontConfig,
    actionLabel?: string,
  ) => void;
  updateSectionContent: (sectionId: string, contentUpdates: any) => void;
  toggleSectionEnabled: (sectionId: string) => void;
  reorderSections: (newSections: SectionConfig[]) => void;
  moveSectionUp: (sectionId: string) => void;
  moveSectionDown: (sectionId: string) => void;
  duplicateSection: (sectionId: string) => void;
  deleteSection: (sectionId: string) => void;
  addSection: (type: SectionType, name: string) => void;
  resetSectionToDefault: (sectionId: string) => void;
  // Reset-to-published variants. These revert a working field back to
  // whatever value it had at the last successful publish (`publishedConfig`),
  // rather than the hardcoded seed defaults. Per the user, this matches
  // the "reset to the state the merchant saw it last" expectation.
  resetSectionToPublished: (sectionId: string) => void;
  resetThemeToPublished: () => void;
  resetNavigationToPublished: () => void;
  resetFooterToPublished: () => void;
  resetAnnouncementsToPublished: () => void;
  resetPopupToPublished: () => void;

  updateBrand: (updates: Partial<BrandSettingsConfig>) => void;
  updateThemeColors: (updates: Partial<ThemeColorsConfig>) => void;
  updateTypography: (updates: Partial<TypographyConfig>) => void;
  updateAnnouncements: (
    updater: (
      prev: StorefrontConfig["announcements"],
    ) => StorefrontConfig["announcements"],
  ) => void;
  updateNavigation: (
    updater: (
      prev: StorefrontConfig["navigation"],
    ) => StorefrontConfig["navigation"],
  ) => void;
  updatePopup: (updates: Partial<PopupConfig>) => void;
  updateFooter: (updates: Partial<FooterConfig>) => void;
  updateSEO: (updates: Partial<SEOConfig>) => void;
  updatePage: (pageId: string, updates: Partial<PageConfig>) => void;
  addCustomPage: (title: string, slug: string) => void;
  deleteCustomPage: (pageId: string) => void;

  // Per-page text mutator — every `data-cms-key="pg-<page>-<field>"`
  // attribute on the live storefront reads from `config.pageText[page][field]`.
  // `page` is the same key the commerce app passes to `usePageText(page)`
  // (e.g. "shop", "cart", "orderTrack"), and `field` is the trailing
  // segment of the data-cms-key (e.g. "header-title", "cat-all",
  // "empty-cta").
  updatePageText: (
    page: keyof PageTextConfig,
    field: string,
    value: string,
  ) => void;

  // Actions
  saveDraft: () => void;
  publishChanges: (notes?: string) => void;
  getPendingChangesDiff: () => string[];
}

const StorefrontCmsContext = createContext<
  StorefrontCmsContextType | undefined
>(undefined);

/**
 * StorefrontCmsContext
 *
 * In the previous (pre-Firebase) version of the admin, this context
 * held the entire CMS state in memory. Now it stays the *editor's*
 * in-memory working copy, but the canonical source of truth lives in
 * Firestore at `cms/config/main` and `cms/publishHistory/list`.
 *
 *   - On mount we subscribe to the Firestore `cms/config/main` doc.
 *     The remote value is the *published* config (we treat it as
 *     such for the diff and "Live vs Draft" comparison).
 *   - Every mutation through `updateConfig` and friends updates the
 *     local working copy AND writes back to Firestore (debounced
 *     via the auto-save timer so we don't thrash the write quota).
 *   - `publishChanges()` snapshots the working copy, appends a new
 *     `PublishVersion` to the history doc, and bumps
 *     `cms/config/main.version` + `publishedAt` so the storefront
 *     picks it up on its next render.
 */
export function StorefrontCmsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { addToast, currentUserName } = useAdmin();

  // Remote state (canonical source of truth) — what the storefront sees.
  const { config: remoteConfig, loading: remoteLoading } =
    useFirestoreConfig();

  // Local state — what the editor is showing right now.
  const [config, setConfig] = useState<StorefrontConfig>(
    defaultStorefrontConfig,
  );
  const [publishedConfig, setPublishedConfig] =
    useState<StorefrontConfig>(defaultStorefrontConfig);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "saved" | "saving" | "unsaved"
  >("saved");

  // Undo/redo stacks
  const [undoStack, setUndoStack] = useState<StorefrontConfig[]>([]);
  const [redoStack, setRedoStack] = useState<StorefrontConfig[]>([]);
  const [publishHistory, setPublishHistory] =
    useState<PublishVersion[]>(initialPublishHistory);

  // Viewport & editor UI state
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [activePageId, setActivePageId] = useState<string>("homepage");
  // The right-side property panel starts empty so the editor doesn't
  // display content (e.g. the hero) that the user hasn't asked to edit
  // yet. The first click in the iframe or left sidebar sets a value.
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeElementKey, setActiveElementKey] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [quickEditMode, setQuickEditMode] = useState<boolean>(false);

  // Modals
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
  const [emojiPickerTarget, setEmojiPickerTarget] = useState<{
    onSelect: (emoji: string) => void;
  } | null>(null);

  const [isBunnyPickerOpen, setIsBunnyPickerOpen] = useState<boolean>(false);
  const [bunnyPickerTarget, setBunnyPickerTarget] = useState<{
    onSelect: (bunnyMood: string, imageUrl: string) => void;
  } | null>(null);

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState<boolean>(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<{
    onSelect: (url: string, alt?: string) => void;
  } | null>(null);

  // Local asset stores (still in-memory; we'll wire to Firestore in the
  // media-library phase). The editor only needs to read these when
  // picking an image, and uploads already write through to Firestore
  // via `uploadMediaFile`.
  const [mediaAssets, setMediaAssets] =
    useState<MediaAssetItem[]>(initialMediaAssets);
  const [bunnyAssets, setBunnyAssets] =
    useState<BunnyAsset[]>(initialBunnyAssets);
  const [journalArticles, setJournalArticles] = useState<JournalArticleItem[]>(
    initialJournalArticles,
  );

  // Auto-save state. We use refs (not effect deps) for the timer and
  // the latest config so the auto-save loop runs ONCE on mount and
  // reacts to a "save bumps" counter that updateConfig increments.
  // This avoids the bug where the effect's [config] dep causes the
  // cleanup to clear the pending timer on every keystroke, leaving
  // the indicator stuck on "saving" forever.
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const configRef = useRef<StorefrontConfig>(config);
  const isDirtyRef = useRef<boolean>(isDirty);
  // Counter the auto-save effect listens to. `updateConfig` and
  // `saveDraft` increment it to trigger a (debounced or immediate)
  // Firestore write. Putting the trigger on a ref-backed counter means
  // the effect itself never needs `config` in its deps, so it doesn't
  // re-fire on every keystroke.
  const [saveBumps, setSaveBumps] = useState<number>(0);

  // Mirror the live config + dirty flag into refs so the auto-save
  // loop (which runs on `saveBumps`, not on `config`) always sees the
  // freshest values.
  useEffect(() => {
    configRef.current = config;
  }, [config]);
  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  // ── Hydrate from Firestore on first snapshot, but never clobber an
  //    in-flight local edit. ──
  useEffect(() => {
    if (remoteLoading) return;
    if (!remoteConfig) return;
    // Only copy remote into local when the editor has no unsaved
    // changes. This preserves the user's draft while a snapshot
    // fires in response to a write we just made, and avoids the
    // cycle where the local write → snapshot → re-hydrate → re-write
    // → ... leaves autoSaveStatus stuck on "saving".
    if (isDirtyRef.current) {
      // Still update publishedConfig so the "live vs draft" diff
      // (and version label) reflect the latest server state, but
      // don't touch the working copy.
      setPublishedConfig(remoteConfig);
      return;
    }
    // First sync: copy into both working and published copies.
    setPublishedConfig(remoteConfig);
    setConfig(remoteConfig);
    configRef.current = remoteConfig;
  }, [remoteLoading, remoteConfig]);

  // ── Persist local working copy to Firestore on every save-bump. ──
  // The effect runs once on mount and only re-runs when `saveBumps`
  // changes. It schedules a debounced write; `flushSave` (called by
  // `saveDraft`) cancels the timer and writes immediately.
  useEffect(() => {
    // Skip the very first bump — that's the post-hydration bump the
    // mount call sets up so we have a stable effect to react to.
    if (saveBumps === 0) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    setAutoSaveStatus("saving");
    autoSaveTimerRef.current = setTimeout(() => {
      void flushSaveRef.current?.();
    }, 1200);
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [saveBumps]);

  // Refs for the imperative save/flush functions so the effect above
  // can call them without putting them in its deps.
  const flushSaveRef = useRef<(() => Promise<void>) | null>(null);
  useEffect(() => {
    flushSaveRef.current = async () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
      try {
        await saveStorefrontConfig(configRef.current);
        setAutoSaveStatus("saved");
        // The local copy is now in sync with the published copy, so
        // the next snapshot listener pass is allowed to overwrite the
        // working copy if it differs (rare, but keeps the diff honest).
        setIsDirty(false);
        isDirtyRef.current = false;
      } catch (err) {
        setAutoSaveStatus("unsaved");
        addToast({
          type: "error",
          title: "Auto-save failed",
          description:
            err instanceof Error ? err.message : "Couldn't save your draft.",
        });
      }
    };
  }, [addToast]);

  // Push the working config's theme colors to CSS variables so the
  // editor's color picker has visible effect immediately.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.style.setProperty("--neria-pink", config.theme.colors.primary);
    root.style.setProperty("--neria-powder-blue", config.theme.colors.secondary);
    root.style.setProperty("--neria-navy", config.theme.colors.text);
    root.style.setProperty("--bg-page", config.theme.colors.background);
    root.style.setProperty("--bg-card", config.theme.colors.surface);
  }, [config.theme.colors]);

  // ── Modals & pickers (unchanged) ──
  const openEmojiPicker = (onSelect: (emoji: string) => void) => {
    setEmojiPickerTarget({ onSelect });
    setIsEmojiPickerOpen(true);
  };
  const openBunnyPicker = (
    onSelect: (bunnyMood: string, imageUrl: string) => void,
  ) => {
    setBunnyPickerTarget({ onSelect });
    setIsBunnyPickerOpen(true);
  };
  const openMediaPicker = (onSelect: (url: string, alt?: string) => void) => {
    setMediaPickerTarget({ onSelect });
    setIsMediaPickerOpen(true);
  };

  // ── Core mutation engine ──
  const updateConfig = useCallback(
    (updater: (prev: StorefrontConfig) => StorefrontConfig) => {
      setConfig((prev) => {
        setUndoStack((u) => [...u.slice(-29), prev]);
        setRedoStack([]);
        setIsDirty(true);
        return updater(prev);
      });
      // Bump the save counter so the auto-save effect re-runs and
      // schedules a debounced Firestore write. The counter is the
      // only thing the effect depends on, so it doesn't fire on
      // every keystroke.
      setSaveBumps((b) => b + 1);
    },
    [],
  );

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((p) => p.slice(0, -1));
    setRedoStack((p) => [...p, config]);
    setConfig(previous);
    setIsDirty(true);
    setSaveBumps((b) => b + 1);
    addToast({
      type: "info",
      title: "Action Undone",
      description: "Reverted to previous edit state.",
    });
  }, [undoStack, config, addToast]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((p) => p.slice(0, -1));
    setUndoStack((p) => [...p, config]);
    setConfig(next);
    setIsDirty(true);
    setSaveBumps((b) => b + 1);
    addToast({
      type: "info",
      title: "Action Redone",
      description: "Re-applied edit step.",
    });
  }, [redoStack, config, addToast]);

  // ── Section mutations ──
  const updateSectionContent = useCallback(
    (sectionId: string, contentUpdates: any) => {
      updateConfig((prev) => ({
        ...prev,
        homepageSections: prev.homepageSections.map((sec) =>
          sec.id === sectionId
            ? { ...sec, content: { ...sec.content, ...contentUpdates } }
            : sec,
        ),
      }));
    },
    [updateConfig],
  );

  const toggleSectionEnabled = useCallback(
    (sectionId: string) => {
      updateConfig((prev) => ({
        ...prev,
        homepageSections: prev.homepageSections.map((sec) =>
          sec.id === sectionId ? { ...sec, enabled: !sec.enabled } : sec,
        ),
      }));
    },
    [updateConfig],
  );

  const reorderSections = useCallback(
    (newSections: SectionConfig[]) => {
      updateConfig((prev) => ({
        ...prev,
        homepageSections: newSections.map((sec, idx) => ({
          ...sec,
          position: idx + 1,
        })),
      }));
    },
    [updateConfig],
  );

  const moveSectionUp = useCallback(
    (sectionId: string) => {
      updateConfig((prev) => {
        const idx = prev.homepageSections.findIndex((s) => s.id === sectionId);
        if (idx <= 0) return prev;
        const copy = [...prev.homepageSections];
        [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
        return {
          ...prev,
          homepageSections: copy.map((sec, i) => ({ ...sec, position: i + 1 })),
        };
      });
    },
    [updateConfig],
  );

  const moveSectionDown = useCallback(
    (sectionId: string) => {
      updateConfig((prev) => {
        const idx = prev.homepageSections.findIndex((s) => s.id === sectionId);
        if (idx === -1 || idx >= prev.homepageSections.length - 1) return prev;
        const copy = [...prev.homepageSections];
        [copy[idx + 1], copy[idx]] = [copy[idx], copy[idx + 1]];
        return {
          ...prev,
          homepageSections: copy.map((sec, i) => ({ ...sec, position: i + 1 })),
        };
      });
    },
    [updateConfig],
  );

  const duplicateSection = useCallback(
    (sectionId: string) => {
      updateConfig((prev) => {
        const target = prev.homepageSections.find((s) => s.id === sectionId);
        if (!target) return prev;
        const newId = `sec-${target.type}-${Date.now()}`;
        const duplicate: SectionConfig = {
          ...target,
          id: newId,
          name: `${target.name} (Copy)`,
          position: target.position + 1,
        };
        const copy = [...prev.homepageSections];
        const idx = copy.findIndex((s) => s.id === sectionId);
        copy.splice(idx + 1, 0, duplicate);
        return {
          ...prev,
          homepageSections: copy.map((sec, i) => ({ ...sec, position: i + 1 })),
        };
      });
      addToast({
        type: "success",
        title: "Section Duplicated ♡",
        description: "New copy inserted right below.",
      });
    },
    [updateConfig, addToast],
  );

  const deleteSection = useCallback(
    (sectionId: string) => {
      updateConfig((prev) => ({
        ...prev,
        homepageSections: prev.homepageSections.filter(
          (s) => s.id !== sectionId,
        ),
      }));
      setActiveSectionId(null);
      addToast({
        type: "info",
        title: "Section Removed",
        description: "Section deleted from homepage.",
      });
    },
    [updateConfig, addToast],
  );

  const addSection = useCallback(
    (type: SectionType, name: string) => {
      const newId = `sec-${type}-${Date.now()}`;
      let defaultContent: any = {};
      if (type === "custom_banner") {
        defaultContent = {
          heading: "Special Announcement",
          text: "Discover our limited capsule collection designed for unforgettable moments.",
          buttonText: "Shop Now",
          buttonLink: "/shop",
          bgColor: "#FFF4F8",
          textColor: "#263550",
        };
      } else if (type === "rich_text") {
        defaultContent = {
          title: "Atelier Philosophy",
          subtitle: "Crafted with intention",
          body: "Every silhouette is designed to feel empowering and gentle against your skin.",
        };
      } else {
        const existing = defaultStorefrontConfig.homepageSections.find(
          (s) => s.type === type,
        );
        defaultContent = existing ? existing.content : {};
      }
      const newSection: SectionConfig = {
        id: newId,
        name,
        type,
        enabled: true,
        position: 999,
        content: defaultContent,
      };
      updateConfig((prev) => ({
        ...prev,
        homepageSections: [...prev.homepageSections, newSection].map(
          (sec, i) => ({ ...sec, position: i + 1 }),
        ),
      }));
      setActiveSectionId(newId);
      addToast({
        type: "success",
        title: "New Section Added ✨",
        description: `${name} has been added to the page.`,
      });
    },
    [updateConfig, addToast],
  );

  const resetSectionToDefault = useCallback(
    (sectionId: string) => {
      const def = defaultStorefrontConfig.homepageSections.find(
        (s) => s.id === sectionId,
      );
      if (!def) return;
      updateConfig((prev) => ({
        ...prev,
        homepageSections: prev.homepageSections.map((s) =>
          s.id === sectionId ? def : s,
        ),
      }));
      addToast({
        type: "info",
        title: "Reset to Default",
        description: "Section restored to default settings.",
      });
    },
    [updateConfig, addToast],
  );

  // Revert a single homepage section to whatever its `content` was at
  // the last successful publish (`publishedConfig`). If no published
  // snapshot exists yet (first-time use), we fall back to the hardcoded
  // defaults so the user is never stuck.
  const resetSectionToPublished = useCallback(
    (sectionId: string) => {
      const pub = publishedConfig.homepageSections.find(
        (s) => s.id === sectionId,
      );
      if (!pub) {
        resetSectionToDefault(sectionId);
        return;
      }
      updateConfig((prev) => ({
        ...prev,
        homepageSections: prev.homepageSections.map((s) =>
          s.id === sectionId
            ? { ...s, content: pub.content, enabled: pub.enabled }
            : s,
        ),
      }));
      addToast({
        type: "info",
        title: "Reverted to last published",
        description: "Section restored to the version your visitors are seeing.",
      });
    },
    [publishedConfig, updateConfig, resetSectionToDefault, addToast],
  );

  const resetThemeToPublished = useCallback(() => {
    updateConfig((prev) => ({
      ...prev,
      theme: publishedConfig.theme,
    }));
    addToast({
      type: "info",
      title: "Theme reverted",
      description: "Colors & typography restored to the live version.",
    });
  }, [publishedConfig, updateConfig, addToast]);

  const resetNavigationToPublished = useCallback(() => {
    updateConfig((prev) => ({
      ...prev,
      navigation: publishedConfig.navigation,
    }));
    addToast({
      type: "info",
      title: "Header reverted",
      description: "Header & navigation restored to the live version.",
    });
  }, [publishedConfig, updateConfig, addToast]);

  const resetFooterToPublished = useCallback(() => {
    updateConfig((prev) => ({
      ...prev,
      footer: publishedConfig.footer,
    }));
    addToast({
      type: "info",
      title: "Footer reverted",
      description: "Footer restored to the live version.",
    });
  }, [publishedConfig, updateConfig, addToast]);

  const resetAnnouncementsToPublished = useCallback(() => {
    updateConfig((prev) => ({
      ...prev,
      announcements: publishedConfig.announcements,
    }));
    addToast({
      type: "info",
      title: "Announcements reverted",
      description: "Announcement bar restored to the live version.",
    });
  }, [publishedConfig, updateConfig, addToast]);

  const resetPopupToPublished = useCallback(() => {
    updateConfig((prev) => ({
      ...prev,
      popup: publishedConfig.popup,
    }));
    addToast({
      type: "info",
      title: "Popup reverted",
      description: "Promotional popup restored to the live version.",
    });
  }, [publishedConfig, updateConfig, addToast]);

  // ── Brand / theme mutations ──
  const updateBrand = useCallback(
    (updates: Partial<BrandSettingsConfig>) => {
      updateConfig((prev) => ({ ...prev, brand: { ...prev.brand, ...updates } }));
    },
    [updateConfig],
  );

  const updateThemeColors = useCallback(
    (updates: Partial<ThemeColorsConfig>) => {
      updateConfig((prev) => ({
        ...prev,
        theme: { ...prev.theme, colors: { ...prev.theme.colors, ...updates } },
      }));
    },
    [updateConfig],
  );

  const updateTypography = useCallback(
    (updates: Partial<TypographyConfig>) => {
      updateConfig((prev) => ({
        ...prev,
        theme: {
          ...prev.theme,
          typography: { ...prev.theme.typography, ...updates },
        },
      }));
    },
    [updateConfig],
  );

  const updateAnnouncements = useCallback(
    (
      updater: (
        prev: StorefrontConfig["announcements"],
      ) => StorefrontConfig["announcements"],
    ) => {
      updateConfig((prev) => ({
        ...prev,
        announcements: updater(prev.announcements),
      }));
    },
    [updateConfig],
  );

  const updateNavigation = useCallback(
    (
      updater: (
        prev: StorefrontConfig["navigation"],
      ) => StorefrontConfig["navigation"],
    ) => {
      updateConfig((prev) => ({
        ...prev,
        navigation: updater(prev.navigation),
      }));
    },
    [updateConfig],
  );

  const updatePopup = useCallback(
    (updates: Partial<PopupConfig>) => {
      updateConfig((prev) => ({ ...prev, popup: { ...prev.popup, ...updates } }));
    },
    [updateConfig],
  );

  const updateFooter = useCallback(
    (updates: Partial<FooterConfig>) => {
      updateConfig((prev) => ({
        ...prev,
        footer: { ...prev.footer, ...updates },
      }));
    },
    [updateConfig],
  );

  const updateSEO = useCallback(
    (updates: Partial<SEOConfig>) => {
      updateConfig((prev) => ({ ...prev, seo: { ...prev.seo, ...updates } }));
    },
    [updateConfig],
  );

  const updatePage = useCallback(
    (pageId: string, updates: Partial<PageConfig>) => {
      updateConfig((prev) => ({
        ...prev,
        pages: prev.pages.map((p) =>
          p.id === pageId || p.slug === pageId ? { ...p, ...updates } : p,
        ),
      }));
    },
    [updateConfig],
  );

  const addCustomPage = useCallback(
    (title: string, slug: string) => {
      const newPage: PageConfig = {
        id: `page-${Date.now()}`,
        slug,
        title,
        description: `Custom page for ${title}`,
        status: "Published",
        lastEdited: new Date().toISOString().split("T")[0],
        blocks: [
          {
            id: `blk-${Date.now()}-1`,
            type: "heading",
            content: { title, subtitle: "Neria Collective" },
          },
          {
            id: `blk-${Date.now()}-2`,
            type: "text",
            content: { text: "Add your custom content here using the block builder." },
          },
        ],
      };
      updateConfig((prev) => ({ ...prev, pages: [...prev.pages, newPage] }));
      addToast({
        type: "success",
        title: "Page Created",
        description: `${title} page has been created.`,
      });
    },
    [updateConfig, addToast],
  );

  const deleteCustomPage = useCallback(
    (pageId: string) => {
      updateConfig((prev) => ({
        ...prev,
        pages: prev.pages.filter((p) => p.id !== pageId),
      }));
      addToast({
        type: "info",
        title: "Page Deleted",
        description: "Custom page was deleted.",
      });
    },
    [updateConfig, addToast],
  );

  // Per-page text mutator: every `data-cms-key="pg-<page>-<field>"`
  // attribute on the live storefront reads from
  // `config.pageText?.[page]?.[field]` (often camelCase in JSX, e.g. `brandItalic`).
  // We automatically compute and write BOTH camelCase and kebab-case keys into
  // the pageText dictionary so any consumer resolves instantly in real time.
  const updatePageText = useCallback(
    (page: keyof PageTextConfig, field: string, value: string) => {
      const camelField = field.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
      const kebabField = field.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

      updateConfig((prev) => {
        const prevPage = prev.pageText?.[page] ?? {};
        const nextPage = {
          ...prevPage,
          [field]: value,
          [camelField]: value,
          [kebabField]: value,
        };
        // If value is empty, drop all key variants so the live site
        // falls back to its hardcoded string.
        if (value === "") {
          delete (nextPage as Record<string, string>)[field];
          delete (nextPage as Record<string, string>)[camelField];
          delete (nextPage as Record<string, string>)[kebabField];
        }
        return {
          ...prev,
          pageText: {
            ...(prev.pageText ?? {}),
            [page]: nextPage,
          },
        };
      });
    },
    [updateConfig],
  );

  // ── Media & journal CMS helpers ──
  // `addMediaAsset` now uploads the file to Storage and writes the
  // meta doc to Firestore (in addition to keeping the local copy in
  // sync so the picker dropdowns update immediately).
  const addMediaAsset = useCallback(
    async (
      asset: Omit<
        MediaAssetItem,
        "id" | "createdAt" | "usedInCount" | "usedInLocations"
      > & { file?: File },
    ) => {
      try {
        if ((asset as any).file) {
          const uploaded = await uploadMediaFile({
            file: (asset as any).file,
            name: asset.name,
            altText: asset.altText ?? "",
            folder: asset.folder ?? "Uploads",
            type: asset.type,
          });
          setMediaAssets((prev) => [uploaded, ...prev]);
        } else {
          // Inline URL — just add it to the local list.
          const stub: MediaAssetItem = {
            id: `media-${Date.now()}`,
            createdAt: new Date().toISOString().split("T")[0],
            usedInCount: 0,
            usedInLocations: [],
            ...asset,
          };
          setMediaAssets((prev) => [stub, ...prev]);
        }
        addToast({
          type: "success",
          title: "Media Uploaded",
          description: `${asset.name} added to Media Library.`,
        });
      } catch (err) {
        addToast({
          type: "error",
          title: "Upload Failed",
          description:
            err instanceof Error ? err.message : "Couldn't upload the file.",
        });
      }
    },
    [addToast],
  );

  const deleteMediaAsset = useCallback(
    async (id: string) => {
      const item = mediaAssets.find((m) => m.id === id);
      if (item && item.usedInCount > 0) {
        addToast({
          type: "error",
          title: "Cannot Delete Media",
          description: `This image is currently used in ${item.usedInCount} section(s). Replace it before deleting.`,
        });
        return false;
      }
      try {
        await deleteMediaRecord(id, item?.url ?? "");
        setMediaAssets((prev) => prev.filter((m) => m.id !== id));
        addToast({
          type: "info",
          title: "Media Deleted",
          description: "Asset removed from library.",
        });
        return true;
      } catch (err) {
        addToast({
          type: "error",
          title: "Delete Failed",
          description:
            err instanceof Error ? err.message : "Couldn't delete the asset.",
        });
        return false;
      }
    },
    [mediaAssets, addToast],
  );

  const addJournalArticle = useCallback(
    (article: Omit<JournalArticleItem, "id">) => {
      setJournalArticles((prev) => [
        { ...article, id: `art-${Date.now()}` },
        ...prev,
      ]);
      addToast({
        type: "success",
        title: "Article Created",
        description: `"${article.title}" added to Journal.`,
      });
    },
    [addToast],
  );

  const updateJournalArticle = useCallback(
    (id: string, updates: Partial<JournalArticleItem>) => {
      setJournalArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updates } : a)),
      );
      addToast({
        type: "success",
        title: "Article Updated",
        description: "Journal article updated successfully.",
      });
    },
    [addToast],
  );

  const deleteJournalArticle = useCallback(
    (id: string) => {
      setJournalArticles((prev) => prev.filter((a) => a.id !== id));
      addToast({
        type: "info",
        title: "Article Deleted",
        description: "Article removed from Journal.",
      });
    },
    [addToast],
  );

  // ── Diff generator ──
  // Walks every leaf of the working config against the published
  // snapshot and groups changes by section so the publish modal can
  // show the merchant exactly what they're about to ship. The old
  // version only checked ~5 hand-picked fields, so most edits were
  // invisible in the diff and the user thought publishing did nothing.
  const getPendingChangesDiff = useCallback((): string[] => {
    const diffs: string[] = [];

    // Theme
    walkLeafDiff(
      config.theme,
      publishedConfig.theme,
      ['theme'],
      diffs,
      (path, _prev, curr) => {
        if (path.endsWith('.colors.primary')) return `Theme primary accent → ${curr}`;
        if (path.endsWith('.colors.secondary')) return `Theme secondary → ${curr}`;
        if (path.endsWith('.colors.background')) return `Theme background → ${curr}`;
        if (path.endsWith('.colors.text')) return `Theme text color → ${curr}`;
        if (path.endsWith('.typography.headingFont')) return `Heading font → ${curr}`;
        if (path.endsWith('.typography.bodyFont')) return `Body font → ${curr}`;
        return `Theme ${path} → ${summarize(curr)}`;
      },
    );

    // Brand
    walkLeafDiff(
      config.brand,
      publishedConfig.brand,
      ['brand'],
      diffs,
      (path, _prev, curr) => `Brand ${path} → ${summarize(curr)}`,
    );

    // SEO
    walkLeafDiff(
      config.seo,
      publishedConfig.seo,
      ['seo'],
      diffs,
      (path, _prev, curr) => `SEO ${path} → ${summarize(curr)}`,
    );

    // Announcements
    if (config.announcements.enabled !== publishedConfig.announcements.enabled) {
      diffs.push(
        `Announcement bar: ${config.announcements.enabled ? 'enabled' : 'disabled'}`,
      );
    }
    if (config.announcements.autoRotate !== publishedConfig.announcements.autoRotate) {
      diffs.push(
        `Announcement auto-rotate: ${config.announcements.autoRotate ? 'on' : 'off'}`,
      );
    }
    if (config.announcements.rotationInterval !== publishedConfig.announcements.rotationInterval) {
      diffs.push(
        `Announcement rotation interval → ${config.announcements.rotationInterval}s`,
      );
    }
    if (config.announcements.items.length !== publishedConfig.announcements.items.length) {
      diffs.push(
        `Announcement items count: ${publishedConfig.announcements.items.length} → ${config.announcements.items.length}`,
      );
    }
    for (const item of config.announcements.items) {
      const prev = publishedConfig.announcements.items.find((p) => p.id === item.id);
      if (!prev) {
        diffs.push(`Announcement item added: "${summarize(item.message)}"`);
        continue;
      }
      if (prev.message !== item.message) continue; // text isn't editable here
      if (prev.bgColor !== item.bgColor) {
        diffs.push(`Announcement "${summarize(item.message)}" background → ${item.bgColor}`);
      }
      if (prev.textColor !== item.textColor) {
        diffs.push(`Announcement "${summarize(item.message)}" text color → ${item.textColor}`);
      }
      if (prev.active !== item.active) {
        diffs.push(
          `Announcement "${summarize(item.message)}" ${item.active ? 'enabled' : 'disabled'}`,
        );
      }
    }

    // Popup
    if (config.popup.active !== publishedConfig.popup.active) {
      diffs.push(`Promotional popup: ${config.popup.active ? 'enabled' : 'disabled'}`);
    }
    if (config.popup.bgColor !== publishedConfig.popup.bgColor) {
      diffs.push(`Promotional popup background → ${config.popup.bgColor}`);
    }
    if (config.popup.textColor !== publishedConfig.popup.textColor) {
      diffs.push(`Promotional popup text color → ${config.popup.textColor}`);
    }
    if (config.popup.trigger !== publishedConfig.popup.trigger) {
      diffs.push(`Promotional popup trigger → ${config.popup.trigger}`);
    }
    if (config.popup.frequency !== publishedConfig.popup.frequency) {
      diffs.push(`Promotional popup frequency → ${config.popup.frequency}`);
    }
    if (config.popup.type !== publishedConfig.popup.type) {
      diffs.push(`Promotional popup type → ${config.popup.type}`);
    }

    // Navigation
    walkLeafDiff(
      config.navigation,
      publishedConfig.navigation,
      ['navigation'],
      diffs,
      (path, _prev, curr) => `Header ${path} → ${summarize(curr)}`,
    );

    // Footer
    walkLeafDiff(
      config.footer,
      publishedConfig.footer,
      ['footer'],
      diffs,
      (path, _prev, curr) => `Footer ${path} → ${summarize(curr)}`,
    );

    // Homepage sections — diff each section's `content` and `enabled` flag.
    for (const sec of config.homepageSections) {
      const pub = publishedConfig.homepageSections.find((s) => s.id === sec.id);
      if (!pub) {
        diffs.push(`New homepage section: ${sec.name}`);
        continue;
      }
      if (sec.enabled !== pub.enabled) {
        diffs.push(`${sec.name}: ${sec.enabled ? 'enabled' : 'hidden'}`);
      }
      walkLeafDiff(
        sec.content,
        pub.content,
        [sec.name],
        diffs,
        (path, _prev, curr) => `${path} → ${summarize(curr)}`,
      );
    }

    // Per-page text edits. Walk the full pageText tree.
    walkLeafDiff(
      config.pageText || {},
      publishedConfig.pageText || {},
      ['per-page text'],
      diffs,
      (path, _prev, curr) => `${path} → ${summarize(curr)}`,
    );

    if (diffs.length === 0) {
      diffs.push('No changes detected since last publish.');
    }
    return diffs;
  }, [config, publishedConfig]);

  // ── Draft & publish ──
  // The "Save Draft" button should actually persist — it cancels the
  // pending debounce (if any) and writes to Firestore immediately so
  // the indicator transitions `saving → saved` within milliseconds.
  const saveDraft = useCallback(() => {
    setIsDirty(true);
    setAutoSaveStatus("saving");
    void flushSaveRef.current?.().then(() => {
      addToast({
        type: "info",
        title: "Draft Saved ♡",
        description: "Your changes are safely stored as an unpublished draft.",
      });
    });
  }, [addToast]);

  const publishChanges = useCallback(
    async (notes?: string) => {
      const changeSummary = getPendingChangesDiff();
      const newVersionNumber = (publishedConfig.version || 0) + 1;
      const newVersion: PublishVersion = {
        id: `ver-${newVersionNumber}`,
        versionNumber: newVersionNumber,
        publishedAt:
          new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }) +
          " at " +
          new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        publishedBy: currentUserName || "Admin",
        changeSummary: notes ? [notes, ...changeSummary] : changeSummary,
        configSnapshot: {
          ...config,
          version: newVersionNumber,
          lastUpdated: new Date().toISOString(),
        },
      };
      try {
        // Deep clone and normalize all pageText entries with both camelCase and kebab-case
        const configToSave: StorefrontConfig = JSON.parse(JSON.stringify(config));
        configToSave.version = newVersionNumber;
        configToSave.lastUpdated = new Date().toISOString();

        if (configToSave.pageText) {
          const pageRecord = configToSave.pageText as Record<string, Record<string, string> | undefined>;
          for (const page of Object.keys(pageRecord)) {
            const pageObj = pageRecord[page];
            if (pageObj && typeof pageObj === "object") {
              const entries = Object.entries(pageObj);
              for (const [k, v] of entries) {
                if (typeof v === "string") {
                  const camel = k.replace(/-([a-z0-9])/g, (_: string, c: string) => c.toUpperCase());
                  const kebab = k.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
                  pageObj[camel] = v;
                  pageObj[kebab] = v;
                }
              }
            }
          }
        }

        await saveStorefrontConfig(configToSave);
        await appendPublishHistory(newVersion);
        setPublishedConfig(configToSave);
        setConfig(configToSave);
        setPublishHistory((prev) => [newVersion, ...prev]);
        setIsDirty(false);
        setIsPublishModalOpen(false);
        addToast({
          type: "success",
          crucial: true,
          title: "✓ Storefront Live & Published!",
          description: `Version ${newVersionNumber} is now live to all Neria Collective customers.`,
        });
        // Tell the iframe canvas to reload so the admin's preview
        // matches the freshly-committed version on the live site.
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("neria:editor:just-published", {
              detail: { version: newVersionNumber },
            }),
          );
        }
      } catch (err) {
        addToast({
          type: "error",
          title: "Publish Failed",
          description:
            err instanceof Error ? err.message : "Couldn't write to Firestore.",
        });
      }
    },
    [config, publishedConfig, getPendingChangesDiff, addToast, currentUserName],
  );

  const restoreVersion = useCallback(
    (versionId: string) => {
      const target = publishHistory.find((v) => v.id === versionId);
      if (!target) return;
      setConfig(target.configSnapshot);
      setPublishedConfig(target.configSnapshot);
      setIsDirty(false);
      void saveStorefrontConfig(target.configSnapshot);
      addToast({
        type: "success",
        crucial: true,
        title: "Version Restored",
        description: `Website reverted to Version ${target.versionNumber} (${target.publishedAt}).`,
      });
    },
    [publishHistory, addToast],
  );

  return (
    <StorefrontCmsContext.Provider
      value={{
        config,
        publishedConfig,
        isDirty,
        autoSaveStatus,
        deviceMode,
        setDeviceMode,
        activePageId,
        setActivePageId,
        activeSectionId,
        setActiveSectionId,
        activeElementKey,
        setActiveElementKey,
        previewMode,
        setPreviewMode,
        quickEditMode,
        setQuickEditMode,
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0,
        undo,
        redo,
        publishHistory,
        restoreVersion,
        isPublishModalOpen,
        setIsPublishModalOpen,
        isEmojiPickerOpen,
        setIsEmojiPickerOpen,
        emojiPickerTarget,
        openEmojiPicker,
        isBunnyPickerOpen,
        setIsBunnyPickerOpen,
        bunnyPickerTarget,
        openBunnyPicker,
        isMediaPickerOpen,
        setIsMediaPickerOpen,
        mediaPickerTarget,
        openMediaPicker,
        mediaAssets,
        bunnyAssets,
        journalArticles,
        addMediaAsset,
        deleteMediaAsset,
        addJournalArticle,
        updateJournalArticle,
        deleteJournalArticle,
        updateConfig,
        updateSectionContent,
        toggleSectionEnabled,
        reorderSections,
        moveSectionUp,
        moveSectionDown,
        duplicateSection,
        deleteSection,
        addSection,
        resetSectionToDefault,
        resetSectionToPublished,
        resetThemeToPublished,
        resetNavigationToPublished,
        resetFooterToPublished,
        resetAnnouncementsToPublished,
        resetPopupToPublished,
        updateBrand,
        updateThemeColors,
        updateTypography,
        updateAnnouncements,
        updateNavigation,
        updatePopup,
        updateFooter,
        updateSEO,
        updatePage,
        addCustomPage,
        deleteCustomPage,
        updatePageText,
        saveDraft,
        publishChanges,
        getPendingChangesDiff,
      }}
    >
      {children}
    </StorefrontCmsContext.Provider>
  );
}

export function useStorefrontCms() {
  const ctx = useContext(StorefrontCmsContext);
  if (!ctx) throw new Error("useStorefrontCms must be used within a StorefrontCmsProvider");
  return ctx;
}
