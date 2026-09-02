'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
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
  SectionType
} from '../types';
import {
  defaultStorefrontConfig,
  initialBunnyAssets,
  initialMediaAssets,
  initialJournalArticles,
  initialPublishHistory
} from '../cms-defaults';
import { useAdmin } from './AdminContext';

interface StorefrontCmsContextType {
  // Config States
  config: StorefrontConfig;
  publishedConfig: StorefrontConfig;
  isDirty: boolean;
  autoSaveStatus: 'saved' | 'saving' | 'unsaved';

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
  bunnyPickerTarget: { onSelect: (bunnyMood: string, imageUrl: string) => void } | null;
  openBunnyPicker: (onSelect: (bunnyMood: string, imageUrl: string) => void) => void;
  isMediaPickerOpen: boolean;
  setIsMediaPickerOpen: (val: boolean) => void;
  mediaPickerTarget: { onSelect: (url: string, alt?: string) => void } | null;
  openMediaPicker: (onSelect: (url: string, alt?: string) => void) => void;

  // Media, Bunnies & Journal CMS assets
  mediaAssets: MediaAssetItem[];
  bunnyAssets: BunnyAsset[];
  journalArticles: JournalArticleItem[];
  addMediaAsset: (asset: Omit<MediaAssetItem, 'id' | 'createdAt' | 'usedInCount' | 'usedInLocations'>) => void;
  deleteMediaAsset: (id: string) => boolean;
  addJournalArticle: (article: Omit<JournalArticleItem, 'id'>) => void;
  updateJournalArticle: (id: string, updates: Partial<JournalArticleItem>) => void;
  deleteJournalArticle: (id: string) => void;

  // Mutation Operations
  updateConfig: (updater: (prev: StorefrontConfig) => StorefrontConfig, actionLabel?: string) => void;
  updateSectionContent: (sectionId: string, contentUpdates: any) => void;
  toggleSectionEnabled: (sectionId: string) => void;
  reorderSections: (newSections: SectionConfig[]) => void;
  moveSectionUp: (sectionId: string) => void;
  moveSectionDown: (sectionId: string) => void;
  duplicateSection: (sectionId: string) => void;
  deleteSection: (sectionId: string) => void;
  addSection: (type: SectionType, name: string) => void;
  resetSectionToDefault: (sectionId: string) => void;

  updateBrand: (updates: Partial<BrandSettingsConfig>) => void;
  updateThemeColors: (updates: Partial<ThemeColorsConfig>) => void;
  updateTypography: (updates: Partial<TypographyConfig>) => void;
  updateAnnouncements: (updater: (prev: StorefrontConfig['announcements']) => StorefrontConfig['announcements']) => void;
  updateNavigation: (updater: (prev: StorefrontConfig['navigation']) => StorefrontConfig['navigation']) => void;
  updatePopup: (updates: Partial<PopupConfig>) => void;
  updateFooter: (updates: Partial<FooterConfig>) => void;
  updateSEO: (updates: Partial<SEOConfig>) => void;
  updatePage: (pageId: string, updates: Partial<PageConfig>) => void;
  addCustomPage: (title: string, slug: string) => void;
  deleteCustomPage: (pageId: string) => void;

  // Actions
  saveDraft: () => void;
  publishChanges: (notes?: string) => void;
  getPendingChangesDiff: () => string[];
}

const StorefrontCmsContext = createContext<StorefrontCmsContextType | undefined>(undefined);

export function StorefrontCmsProvider({ children }: { children: React.ReactNode }) {
  const { addToast } = useAdmin();

  // Primary State
  const [config, setConfig] = useState<StorefrontConfig>(defaultStorefrontConfig);
  const [publishedConfig, setPublishedConfig] = useState<StorefrontConfig>(defaultStorefrontConfig);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // History Stacks for Undo / Redo
  const [undoStack, setUndoStack] = useState<StorefrontConfig[]>([]);
  const [redoStack, setRedoStack] = useState<StorefrontConfig[]>([]);
  const [publishHistory, setPublishHistory] = useState<PublishVersion[]>(initialPublishHistory);

  // Viewport & Editor UI State
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [activePageId, setActivePageId] = useState<string>('homepage');
  const [activeSectionId, setActiveSectionId] = useState<string | null>('sec-hero');
  const [activeElementKey, setActiveElementKey] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [quickEditMode, setQuickEditMode] = useState<boolean>(false);

  // Modals & Pickers
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
  const [emojiPickerTarget, setEmojiPickerTarget] = useState<{ onSelect: (emoji: string) => void } | null>(null);

  const [isBunnyPickerOpen, setIsBunnyPickerOpen] = useState<boolean>(false);
  const [bunnyPickerTarget, setBunnyPickerTarget] = useState<{ onSelect: (bunnyMood: string, imageUrl: string) => void } | null>(null);

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState<boolean>(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<{ onSelect: (url: string, alt?: string) => void } | null>(null);

  // Assets
  const [mediaAssets, setMediaAssets] = useState<MediaAssetItem[]>(initialMediaAssets);
  const [bunnyAssets, setBunnyAssets] = useState<BunnyAsset[]>(initialBunnyAssets);
  const [journalArticles, setJournalArticles] = useState<JournalArticleItem[]>(initialJournalArticles);

  // Auto-Save Timer
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openEmojiPicker = (onSelect: (emoji: string) => void) => {
    setEmojiPickerTarget({ onSelect });
    setIsEmojiPickerOpen(true);
  };

  const openBunnyPicker = (onSelect: (bunnyMood: string, imageUrl: string) => void) => {
    setBunnyPickerTarget({ onSelect });
    setIsBunnyPickerOpen(true);
  };

  const openMediaPicker = (onSelect: (url: string, alt?: string) => void) => {
    setMediaPickerTarget({ onSelect });
    setIsMediaPickerOpen(true);
  };

  // Synchronize CSS variables with theme colors
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--neria-pink', config.theme.colors.primary);
      root.style.setProperty('--neria-powder-blue', config.theme.colors.secondary);
      root.style.setProperty('--neria-navy', config.theme.colors.text);
      root.style.setProperty('--bg-page', config.theme.colors.background);
      root.style.setProperty('--bg-card', config.theme.colors.surface);
    }
  }, [config.theme.colors]);

  // Core Mutation Engine with Undo Stacking & Auto-Save
  const updateConfig = useCallback((updater: (prev: StorefrontConfig) => StorefrontConfig, actionLabel?: string) => {
    setConfig(prev => {
      // Push previous state to undo stack (limit to 30 states)
      setUndoStack(uPrev => [...uPrev.slice(-29), prev]);
      setRedoStack([]); // Clear redo on new action
      setIsDirty(true);
      setAutoSaveStatus('saving');

      const next = updater(prev);

      // Trigger auto-save debounce
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        setAutoSaveStatus('saved');
      }, 1200);

      return next;
    });
  }, []);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, config]);
    setConfig(previous);
    addToast({ type: 'info', title: 'Action Undone', description: 'Reverted to previous edit state.' });
  }, [undoStack, config, addToast]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, config]);
    setConfig(next);
    addToast({ type: 'info', title: 'Action Redone', description: 'Re-applied edit step.' });
  }, [redoStack, config, addToast]);

  // Section Mutations
  const updateSectionContent = useCallback((sectionId: string, contentUpdates: any) => {
    updateConfig(prev => ({
      ...prev,
      homepageSections: prev.homepageSections.map(sec =>
        sec.id === sectionId ? { ...sec, content: { ...sec.content, ...contentUpdates } } : sec
      )
    }));
  }, [updateConfig]);

  const toggleSectionEnabled = useCallback((sectionId: string) => {
    updateConfig(prev => ({
      ...prev,
      homepageSections: prev.homepageSections.map(sec =>
        sec.id === sectionId ? { ...sec, enabled: !sec.enabled } : sec
      )
    }));
  }, [updateConfig]);

  const reorderSections = useCallback((newSections: SectionConfig[]) => {
    updateConfig(prev => ({
      ...prev,
      homepageSections: newSections.map((sec, idx) => ({ ...sec, position: idx + 1 }))
    }));
  }, [updateConfig]);

  const moveSectionUp = useCallback((sectionId: string) => {
    updateConfig(prev => {
      const idx = prev.homepageSections.findIndex(s => s.id === sectionId);
      if (idx <= 0) return prev;
      const copy = [...prev.homepageSections];
      const temp = copy[idx - 1];
      copy[idx - 1] = copy[idx];
      copy[idx] = temp;
      return {
        ...prev,
        homepageSections: copy.map((sec, i) => ({ ...sec, position: i + 1 }))
      };
    });
  }, [updateConfig]);

  const moveSectionDown = useCallback((sectionId: string) => {
    updateConfig(prev => {
      const idx = prev.homepageSections.findIndex(s => s.id === sectionId);
      if (idx === -1 || idx >= prev.homepageSections.length - 1) return prev;
      const copy = [...prev.homepageSections];
      const temp = copy[idx + 1];
      copy[idx + 1] = copy[idx];
      copy[idx] = temp;
      return {
        ...prev,
        homepageSections: copy.map((sec, i) => ({ ...sec, position: i + 1 }))
      };
    });
  }, [updateConfig]);

  const duplicateSection = useCallback((sectionId: string) => {
    updateConfig(prev => {
      const target = prev.homepageSections.find(s => s.id === sectionId);
      if (!target) return prev;
      const newId = `sec-${target.type}-${Date.now()}`;
      const duplicate: SectionConfig = {
        ...target,
        id: newId,
        name: `${target.name} (Copy)`,
        position: target.position + 1
      };
      const copy = [...prev.homepageSections];
      const targetIdx = copy.findIndex(s => s.id === sectionId);
      copy.splice(targetIdx + 1, 0, duplicate);
      return {
        ...prev,
        homepageSections: copy.map((sec, i) => ({ ...sec, position: i + 1 }))
      };
    });
    addToast({ type: 'success', title: 'Section Duplicated ♡', description: 'New copy inserted right below.' });
  }, [updateConfig, addToast]);

  const deleteSection = useCallback((sectionId: string) => {
    updateConfig(prev => ({
      ...prev,
      homepageSections: prev.homepageSections.filter(s => s.id !== sectionId)
    }));
    setActiveSectionId(null);
    addToast({ type: 'info', title: 'Section Removed', description: 'Section deleted from homepage.' });
  }, [updateConfig, addToast]);

  const addSection = useCallback((type: SectionType, name: string) => {
    const newId = `sec-${type}-${Date.now()}`;
    let defaultContent: any = {};

    if (type === 'custom_banner') {
      defaultContent = {
        heading: 'Special Announcement',
        text: 'Discover our limited capsule collection designed for unforgettable moments.',
        buttonText: 'Shop Now',
        buttonLink: '/shop',
        bgColor: '#FFF4F8',
        textColor: '#263550'
      };
    } else if (type === 'rich_text') {
      defaultContent = {
        title: 'Atelier Philosophy',
        subtitle: 'Crafted with intention',
        body: 'Every silhouette is designed to feel empowering and gentle against your skin.'
      };
    } else {
      const existing = defaultStorefrontConfig.homepageSections.find(s => s.type === type);
      defaultContent = existing ? existing.content : {};
    }

    const newSection: SectionConfig = {
      id: newId,
      name,
      type,
      enabled: true,
      position: 999,
      content: defaultContent
    };

    updateConfig(prev => ({
      ...prev,
      homepageSections: [...prev.homepageSections, newSection].map((sec, i) => ({ ...sec, position: i + 1 }))
    }));
    setActiveSectionId(newId);
    addToast({ type: 'success', title: 'New Section Added ✨', description: `${name} has been added to the page.` });
  }, [updateConfig, addToast]);

  const resetSectionToDefault = useCallback((sectionId: string) => {
    const defaultSec = defaultStorefrontConfig.homepageSections.find(s => s.id === sectionId);
    if (!defaultSec) return;
    updateConfig(prev => ({
      ...prev,
      homepageSections: prev.homepageSections.map(s => s.id === sectionId ? defaultSec : s)
    }));
    addToast({ type: 'info', title: 'Reset to Default', description: 'Section restored to default settings.' });
  }, [updateConfig, addToast]);

  // Brand & Theme Mutations
  const updateBrand = useCallback((updates: Partial<BrandSettingsConfig>) => {
    updateConfig(prev => ({
      ...prev,
      brand: { ...prev.brand, ...updates }
    }));
  }, [updateConfig]);

  const updateThemeColors = useCallback((updates: Partial<ThemeColorsConfig>) => {
    updateConfig(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        colors: { ...prev.theme.colors, ...updates }
      }
    }));
  }, [updateConfig]);

  const updateTypography = useCallback((updates: Partial<TypographyConfig>) => {
    updateConfig(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        typography: { ...prev.theme.typography, ...updates }
      }
    }));
  }, [updateConfig]);

  const updateAnnouncements = useCallback((updater: (prev: StorefrontConfig['announcements']) => StorefrontConfig['announcements']) => {
    updateConfig(prev => ({
      ...prev,
      announcements: updater(prev.announcements)
    }));
  }, [updateConfig]);

  const updateNavigation = useCallback((updater: (prev: StorefrontConfig['navigation']) => StorefrontConfig['navigation']) => {
    updateConfig(prev => ({
      ...prev,
      navigation: updater(prev.navigation)
    }));
  }, [updateConfig]);

  const updatePopup = useCallback((updates: Partial<PopupConfig>) => {
    updateConfig(prev => ({
      ...prev,
      popup: { ...prev.popup, ...updates }
    }));
  }, [updateConfig]);

  const updateFooter = useCallback((updates: Partial<FooterConfig>) => {
    updateConfig(prev => ({
      ...prev,
      footer: { ...prev.footer, ...updates }
    }));
  }, [updateConfig]);

  const updateSEO = useCallback((updates: Partial<SEOConfig>) => {
    updateConfig(prev => ({
      ...prev,
      seo: { ...prev.seo, ...updates }
    }));
  }, [updateConfig]);

  const updatePage = useCallback((pageId: string, updates: Partial<PageConfig>) => {
    updateConfig(prev => ({
      ...prev,
      pages: prev.pages.map(p => (p.id === pageId || p.slug === pageId ? { ...p, ...updates } : p))
    }));
  }, [updateConfig]);

  const addCustomPage = useCallback((title: string, slug: string) => {
    const newPage: PageConfig = {
      id: `page-${Date.now()}`,
      slug,
      title,
      description: `Custom page for ${title}`,
      status: 'Published',
      lastEdited: new Date().toISOString().split('T')[0],
      blocks: [
        { id: `blk-${Date.now()}-1`, type: 'heading', content: { title, subtitle: 'Neria Collective' } },
        { id: `blk-${Date.now()}-2`, type: 'text', content: { text: 'Add your custom content here using the block builder.' } }
      ]
    };
    updateConfig(prev => ({
      ...prev,
      pages: [...prev.pages, newPage]
    }));
    addToast({ type: 'success', title: 'Page Created', description: `${title} page has been created.` });
  }, [updateConfig, addToast]);

  const deleteCustomPage = useCallback((pageId: string) => {
    updateConfig(prev => ({
      ...prev,
      pages: prev.pages.filter(p => p.id !== pageId)
    }));
    addToast({ type: 'info', title: 'Page Deleted', description: 'Custom page was deleted.' });
  }, [updateConfig, addToast]);

  // Media & Journal CMS helpers
  const addMediaAsset = useCallback((asset: Omit<MediaAssetItem, 'id' | 'createdAt' | 'usedInCount' | 'usedInLocations'>) => {
    const newAsset: MediaAssetItem = {
      ...asset,
      id: `media-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      usedInCount: 0,
      usedInLocations: []
    };
    setMediaAssets(prev => [newAsset, ...prev]);
    addToast({ type: 'success', title: 'Media Uploaded', description: `${asset.name} added to Media Library.` });
  }, [addToast]);

  const deleteMediaAsset = useCallback((id: string) => {
    const item = mediaAssets.find(m => m.id === id);
    if (item && item.usedInCount > 0) {
      addToast({
        type: 'error',
        title: 'Cannot Delete Media',
        description: `This image is currently used in ${item.usedInCount} section(s). Replace it before deleting.`
      });
      return false;
    }
    setMediaAssets(prev => prev.filter(m => m.id !== id));
    addToast({ type: 'info', title: 'Media Deleted', description: 'Asset removed from library.' });
    return true;
  }, [mediaAssets, addToast]);

  const addJournalArticle = useCallback((article: Omit<JournalArticleItem, 'id'>) => {
    const newArt: JournalArticleItem = {
      ...article,
      id: `art-${Date.now()}`
    };
    setJournalArticles(prev => [newArt, ...prev]);
    addToast({ type: 'success', title: 'Article Created', description: `"${article.title}" added to Journal.` });
  }, [addToast]);

  const updateJournalArticle = useCallback((id: string, updates: Partial<JournalArticleItem>) => {
    setJournalArticles(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    addToast({ type: 'success', title: 'Article Updated', description: 'Journal article updated successfully.' });
  }, [addToast]);

  const deleteJournalArticle = useCallback((id: string) => {
    setJournalArticles(prev => prev.filter(a => a.id !== id));
    addToast({ type: 'info', title: 'Article Deleted', description: 'Article removed from Journal.' });
  }, [addToast]);

  // Diff Generator for Publishing Audit
  const getPendingChangesDiff = useCallback((): string[] => {
    const diffs: string[] = [];
    const heroPrev = publishedConfig.homepageSections.find(s => s.type === 'hero')?.content;
    const heroCurr = config.homepageSections.find(s => s.type === 'hero')?.content;
    if (heroPrev && heroCurr) {
      if (heroPrev.mainHeading !== heroCurr.mainHeading) {
        diffs.push(`Homepage Hero Heading updated: "${heroCurr.mainHeading}"`);
      }
      if (heroPrev.desktopImage !== heroCurr.desktopImage) {
        diffs.push('Homepage Hero Desktop Image replaced');
      }
      if (heroPrev.buttonBgColor !== heroCurr.buttonBgColor) {
        diffs.push('Hero CTA button color customized');
      }
    }

    if (config.announcements.items.length !== publishedConfig.announcements.items.length) {
      diffs.push(`Announcement items count changed (${config.announcements.items.length} items)`);
    }

    if (config.theme.colors.primary !== publishedConfig.theme.colors.primary) {
      diffs.push(`Primary Brand Accent color changed to ${config.theme.colors.primary}`);
    }

    if (config.popup.active !== publishedConfig.popup.active) {
      diffs.push(`Promotional Popup status: ${config.popup.active ? 'Active' : 'Disabled'}`);
    }

    if (config.homepageSections.length !== publishedConfig.homepageSections.length) {
      diffs.push(`Homepage sections count modified (${config.homepageSections.length} sections)`);
    }

    if (diffs.length === 0) {
      diffs.push('Storefront content, layout, and visual styling refined');
    }

    return diffs;
  }, [config, publishedConfig]);

  // Draft & Publish Actions
  const saveDraft = useCallback(() => {
    setAutoSaveStatus('saved');
    setIsDirty(true);
    addToast({
      type: 'info',
      title: 'Draft Saved ♡',
      description: 'Your changes are safely stored as an unpublished draft.'
    });
  }, [addToast]);

  const publishChanges = useCallback((notes?: string) => {
    const changeSummary = getPendingChangesDiff();
    const newVersionNumber = (publishedConfig.version || 28) + 1;
    const newVersion: PublishVersion = {
      id: `ver-${newVersionNumber}`,
      versionNumber: newVersionNumber,
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      publishedBy: 'Ama Osei (Super Admin)',
      changeSummary: notes ? [notes, ...changeSummary] : changeSummary,
      configSnapshot: { ...config, version: newVersionNumber, lastUpdated: new Date().toISOString() }
    };

    setPublishedConfig({ ...config, version: newVersionNumber, lastUpdated: new Date().toISOString() });
    setPublishHistory(prev => [newVersion, ...prev]);
    setIsDirty(false);
    setIsPublishModalOpen(false);

    addToast({
      type: 'success',
      crucial: true,
      title: '✓ Storefront Live & Published!',
      description: `Version ${newVersionNumber} is now live to all Neria Collective customers.`
    });
  }, [config, publishedConfig, getPendingChangesDiff, addToast]);

  const restoreVersion = useCallback((versionId: string) => {
    const target = publishHistory.find(v => v.id === versionId);
    if (!target) return;
    setConfig(target.configSnapshot);
    setPublishedConfig(target.configSnapshot);
    setIsDirty(false);
    addToast({
      type: 'success',
      crucial: true,
      title: 'Version Restored',
      description: `Website reverted to Version ${target.versionNumber} (${target.publishedAt}).`
    });
  }, [publishHistory, addToast]);

  return (
    <StorefrontCmsContext.Provider value={{
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
      saveDraft,
      publishChanges,
      getPendingChangesDiff
    }}>
      {children}
    </StorefrontCmsContext.Provider>
  );
}

export function useStorefrontCms() {
  const context = useContext(StorefrontCmsContext);
  if (!context) {
    throw new Error('useStorefrontCms must be used within a StorefrontCmsProvider');
  }
  return context;
}
