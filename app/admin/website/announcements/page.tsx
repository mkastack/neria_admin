'use client';

import React, { useState } from 'react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { AnnouncementItem } from '@/src/lib/types';
import { EmojiPickerModal } from '@/src/components/editor/EmojiPickerModal';
import {
  Megaphone, Plus, Trash2, Edit3, Sparkles, Smile, ArrowRight,
  CheckCircle2, Clock, RotateCcw
} from 'lucide-react';

export default function AnnouncementsManagerPage() {
  const { config, updateAnnouncements, openEmojiPicker } = useStorefrontCms();
  const { announcements } = config;

  const [editingItem, setEditingItem] = useState<AnnouncementItem | null>(null);

  const handleUpdateItem = (id: string, updates: Partial<AnnouncementItem>) => {
    updateAnnouncements(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, ...updates } : item)
    }));
  };

  const handleAddAnnouncement = () => {
    const newItem: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      message: 'Exclusive weekend special ♡ Free packaging with every order',
      emoji: '♡',
      linkText: 'Shop Now',
      linkUrl: '/shop',
      bgColor: '#FF4FA3',
      textColor: '#FFFFFF',
      active: true,
      priority: announcements.items.length + 1
    };
    updateAnnouncements(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    setEditingItem(newItem);
  };

  const handleDeleteAnnouncement = (id: string) => {
    updateAnnouncements(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
    if (editingItem?.id === id) setEditingItem(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4F8] border border-[#FFD8EA] text-[#FF4FA3] text-xs font-bold uppercase tracking-wider mb-1.5">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Storefront Top Bar</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#263550] tracking-tight">
            Announcement Bar Manager
          </h1>
          <p className="text-xs text-[#667085] mt-1">
            Create scheduled promotional announcements, delivery notices, and discount tickers.
          </p>
        </div>

        <button
          onClick={handleAddAnnouncement}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FF4FA3] hover:bg-[#E63E90] text-white text-xs font-bold shadow-md shadow-[#FF4FA3]/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Global Rotation Controls */}
      <div className="p-5 rounded-3xl bg-white border border-[#F2F3F5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="enable-bar"
            checked={announcements.enabled}
            onChange={e => updateAnnouncements(prev => ({ ...prev, enabled: e.target.checked }))}
            className="w-4 h-4 accent-[#FF4FA3]"
          />
          <label htmlFor="enable-bar" className="text-xs font-bold text-[#263550] cursor-pointer">
            Enable Storefront Announcement Bar
          </label>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <label className="flex items-center gap-2 text-[#667085] cursor-pointer">
            <input
              type="checkbox"
              checked={announcements.autoRotate}
              onChange={e => updateAnnouncements(prev => ({ ...prev, autoRotate: e.target.checked }))}
              className="w-4 h-4 accent-[#FF4FA3]"
            />
            <span>Auto-rotate multiple messages</span>
          </label>

          <div className="flex items-center gap-1 text-[#667085]">
            <span>Interval:</span>
            <input
              type="number"
              min="2"
              max="15"
              value={announcements.rotationInterval || 5}
              onChange={e => updateAnnouncements(prev => ({ ...prev, rotationInterval: Number(e.target.value) }))}
              className="w-14 px-2 py-1 rounded-lg bg-[#F8F8FA] border border-[#DDE1E7] text-center font-bold text-[#263550]"
            />
            <span>sec</span>
          </div>
        </div>
      </div>

      {/* Announcements List & Edit Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* List Column */}
        <div className="lg:col-span-7 space-y-3">
          {announcements.items.map((item, idx) => {
            const isSelected = editingItem?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setEditingItem(item)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-white border-[#FF4FA3] shadow-md ring-2 ring-[#FFD8EA]'
                    : 'bg-white border-[#F2F3F5] hover:border-[#FFD8EA] shadow-xs'
                }`}
              >
                {/* Live Preview Bar Render */}
                <div
                  style={{ backgroundColor: item.bgColor, color: item.textColor }}
                  className="py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    {item.emoji && <span>{item.emoji}</span>}
                    <span className="truncate">{item.message}</span>
                  </div>
                  {item.linkText && (
                    <span className="underline ml-2 text-[11px] shrink-0 inline-flex items-center gap-0.5">
                      {item.linkText} <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-2 cursor-pointer text-[#667085] font-medium"
                  >
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={e => handleUpdateItem(item.id, { active: e.target.checked })}
                      className="w-3.5 h-3.5 accent-[#FF4FA3]"
                    />
                    <span>{item.active ? 'Active & Displaying' : 'Inactive / Paused'}</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingItem(item);
                      }}
                      className="text-xs font-bold text-[#FF4FA3] hover:underline"
                    >
                      Customize
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAnnouncement(item.id);
                      }}
                      className="text-xs text-[#98A0AE] hover:text-[#B42318] p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Edit Properties Column */}
        <div className="lg:col-span-5">
          {editingItem ? (
            <div className="rounded-3xl bg-white border border-[#F2F3F5] shadow-xs p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#263550] flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#FF4FA3]" />
                <span>Edit Announcement Banner</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-[#263550] mb-1">Message Copy</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingItem.message}
                    onChange={e => {
                      const val = e.target.value;
                      setEditingItem(prev => prev ? { ...prev, message: val } : null);
                      handleUpdateItem(editingItem.id, { message: val });
                    }}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3]"
                  />
                  <button
                    onClick={() => openEmojiPicker(emoji => {
                      setEditingItem(prev => prev ? { ...prev, emoji } : null);
                      handleUpdateItem(editingItem.id, { emoji });
                    })}
                    className="px-3 py-2 rounded-xl bg-[#FFF4F8] border border-[#FFD8EA] text-[#FF4FA3] font-bold text-sm"
                  >
                    {editingItem.emoji || '♡'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#263550] mb-1">Action Link Text</label>
                  <input
                    type="text"
                    value={editingItem.linkText || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setEditingItem(prev => prev ? { ...prev, linkText: val } : null);
                      handleUpdateItem(editingItem.id, { linkText: val });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#263550] mb-1">Destination URL</label>
                  <input
                    type="text"
                    value={editingItem.linkUrl || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setEditingItem(prev => prev ? { ...prev, linkUrl: val } : null);
                      handleUpdateItem(editingItem.id, { linkUrl: val });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7]"
                  />
                </div>
              </div>

              {/* Color Customization */}
              <div className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-3">
                <span className="text-[11px] font-bold text-[#263550] block uppercase tracking-wider">Banner Styling</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-[#667085] mb-1">Background Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={editingItem.bgColor}
                        onChange={e => {
                          const val = e.target.value;
                          setEditingItem(prev => prev ? { ...prev, bgColor: val } : null);
                          handleUpdateItem(editingItem.id, { bgColor: val });
                        }}
                        className="w-8 h-8 rounded-lg cursor-pointer border"
                      />
                      <input
                        type="text"
                        value={editingItem.bgColor}
                        onChange={e => {
                          const val = e.target.value;
                          setEditingItem(prev => prev ? { ...prev, bgColor: val } : null);
                          handleUpdateItem(editingItem.id, { bgColor: val });
                        }}
                        className="w-20 px-2 py-1 text-[11px] rounded-lg bg-white border font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#667085] mb-1">Text Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={editingItem.textColor}
                        onChange={e => {
                          const val = e.target.value;
                          setEditingItem(prev => prev ? { ...prev, textColor: val } : null);
                          handleUpdateItem(editingItem.id, { textColor: val });
                        }}
                        className="w-8 h-8 rounded-lg cursor-pointer border"
                      />
                      <input
                        type="text"
                        value={editingItem.textColor}
                        onChange={e => {
                          const val = e.target.value;
                          setEditingItem(prev => prev ? { ...prev, textColor: val } : null);
                          handleUpdateItem(editingItem.id, { textColor: val });
                        }}
                        className="w-20 px-2 py-1 text-[11px] rounded-lg bg-white border font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-[#F8F8FA] border border-[#F2F3F5] p-8 text-center text-[#98A0AE] text-xs">
              Select an announcement on the left to customize its message, emoji, and colors.
            </div>
          )}
        </div>
      </div>

      <EmojiPickerModal />
    </div>
  );
}
