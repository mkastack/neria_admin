'use client';

import React from 'react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { EditorTopBar } from '@/src/components/editor/EditorTopBar';
import { EditorLeftSidebar } from '@/src/components/editor/EditorLeftSidebar';
import { EditorPropertyPanel } from '@/src/components/editor/EditorPropertyPanel';
import { StorefrontRenderer } from '@/src/components/storefront/StorefrontRenderer';
import { EmojiPickerModal } from '@/src/components/editor/EmojiPickerModal';
import { BunnyPickerModal } from '@/src/components/editor/BunnyPickerModal';
import { MediaPickerModal } from '@/src/components/editor/MediaPickerModal';
import { PublishModal } from '@/src/components/editor/PublishModal';

export default function VisualEditorPage() {
  const { deviceMode, previewMode } = useStorefrontCms();

  const viewportWidthClass = {
    desktop: 'w-full max-w-[1440px]',
    tablet: 'w-[768px] max-w-full my-6 rounded-3xl shadow-2xl border-8 border-[#263550] overflow-hidden',
    mobile: 'w-[390px] max-w-full my-6 rounded-[40px] shadow-2xl border-10 border-[#263550] overflow-hidden ring-4 ring-black/10'
  }[deviceMode];

  return (
    <div className="fixed inset-0 z-40 bg-[#1D2939] flex flex-col overflow-hidden antialiased select-none">
      {/* 1. Sticky Top Navigation Bar */}
      <EditorTopBar />

      {/* 2. Main 3-Column Visual Canvas */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Toolbar / Section Hierarchy */}
        {!previewMode && <EditorLeftSidebar />}

        {/* Center Live Website Canvas */}
        <div className="flex-1 bg-[#101828]/30 overflow-y-auto flex flex-col items-center relative p-0 sm:p-4 transition-all">
          <div className={`${viewportWidthClass} bg-white shadow-xl transition-all duration-300 min-h-full flex flex-col`}>
            <StorefrontRenderer isEditorMode={true} />
          </div>
        </div>

        {/* Right Property Inspector Panel */}
        {!previewMode && <EditorPropertyPanel />}
      </div>

      {/* 3. Helper Modals */}
      <EmojiPickerModal />
      <BunnyPickerModal />
      <MediaPickerModal />
      <PublishModal />
    </div>
  );
}
