'use client';

import React, { useState } from 'react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { NavMenuItem } from '@/src/lib/types';
import {
  Menu as MenuIcon, Plus, Trash2, Edit3, ChevronDown, Sparkles,
  ArrowUp, ArrowDown, Image as ImageIcon, Check, ExternalLink
} from 'lucide-react';

export default function NavigationManagerPage() {
  const { config, updateNavigation, openMediaPicker } = useStorefrontCms();
  const { navigation } = config;

  const [editingItem, setEditingItem] = useState<NavMenuItem | null>(null);

  const handleUpdateItem = (id: string, updates: Partial<NavMenuItem>) => {
    updateNavigation(prev => ({
      ...prev,
      menuItems: prev.menuItems.map(item => item.id === id ? { ...item, ...updates } : item)
    }));
  };

  const handleAddItem = () => {
    const newItem: NavMenuItem = {
      id: `nav-${Date.now()}`,
      label: 'New Link',
      url: '/shop',
      isMegaMenu: false
    };
    updateNavigation(prev => ({
      ...prev,
      menuItems: [...prev.menuItems, newItem]
    }));
    setEditingItem(newItem);
  };

  const handleDeleteItem = (id: string) => {
    updateNavigation(prev => ({
      ...prev,
      menuItems: prev.menuItems.filter(item => item.id !== id)
    }));
  };

  const handleMoveUp = (idx: number) => {
    if (idx <= 0) return;
    updateNavigation(prev => {
      const copy = [...prev.menuItems];
      const temp = copy[idx - 1];
      copy[idx - 1] = copy[idx];
      copy[idx] = temp;
      return { ...prev, menuItems: copy };
    });
  };

  const handleMoveDown = (idx: number) => {
    if (idx >= navigation.menuItems.length - 1) return;
    updateNavigation(prev => {
      const copy = [...prev.menuItems];
      const temp = copy[idx + 1];
      copy[idx + 1] = copy[idx];
      copy[idx] = temp;
      return { ...prev, menuItems: copy };
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4F8] border border-[#FFD8EA] text-[#FF4FA3] text-xs font-bold uppercase tracking-wider mb-1.5">
            <MenuIcon className="w-3.5 h-3.5" />
            <span>Storefront Header</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#263550] tracking-tight">
            Navigation & Mega Menu Manager
          </h1>
          <p className="text-xs text-[#667085] mt-1">
            Configure header links, multi-column mega menu dropdowns, badge highlights, and campaign spotlight cards.
          </p>
        </div>

        <button
          onClick={handleAddItem}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FF4FA3] hover:bg-[#E63E90] text-white text-xs font-bold shadow-md shadow-[#FF4FA3]/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Navigation List Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Menu Items List */}
        <div className="lg:col-span-7 rounded-3xl bg-white border border-[#F2F3F5] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#F2F3F5] bg-[#F8F8FA]/60 flex items-center justify-between">
            <span className="text-xs font-bold text-[#263550] uppercase tracking-wider">
              Header Menu Links ({navigation.menuItems.length})
            </span>
          </div>

          <div className="divide-y divide-[#F2F3F5]">
            {navigation.menuItems.map((item, idx) => {
              const isSelected = editingItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setEditingItem(item)}
                  className={`p-4 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#FFF4F8] border-l-4 border-l-[#FF4FA3]' : 'hover:bg-[#F8F8FA]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#263550]">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-[#FF4FA3] text-white">
                          {item.badge}
                        </span>
                      )}
                      {item.isMegaMenu && (
                        <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-[#263550] text-white">
                          Mega Menu
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#98A0AE] font-mono">{item.url}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveUp(idx);
                      }}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg text-[#98A0AE] hover:text-[#263550] disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveDown(idx);
                      }}
                      disabled={idx === navigation.menuItems.length - 1}
                      className="p-1.5 rounded-lg text-[#98A0AE] hover:text-[#263550] disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      className="p-1.5 rounded-lg text-[#98A0AE] hover:text-[#B42318]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Edit Selected Menu Item */}
        <div className="lg:col-span-5">
          {editingItem ? (
            <div className="rounded-3xl bg-white border border-[#F2F3F5] shadow-xs p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#263550] flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#FF4FA3]" />
                <span>Configure "{editingItem.label}"</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-[#263550] mb-1">Link Label</label>
                <input
                  type="text"
                  value={editingItem.label}
                  onChange={e => {
                    const val = e.target.value;
                    setEditingItem(prev => prev ? { ...prev, label: val } : null);
                    handleUpdateItem(editingItem.id, { label: val });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#263550] mb-1">Destination URL</label>
                <input
                  type="text"
                  value={editingItem.url}
                  onChange={e => {
                    const val = e.target.value;
                    setEditingItem(prev => prev ? { ...prev, url: val } : null);
                    handleUpdateItem(editingItem.id, { url: val });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#263550] mb-1">Highlight Badge Text (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Drop 04, Hot, New"
                  value={editingItem.badge || ''}
                  onChange={e => {
                    const val = e.target.value;
                    setEditingItem(prev => prev ? { ...prev, badge: val } : null);
                    handleUpdateItem(editingItem.id, { badge: val });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3]"
                />
              </div>

              {/* Mega Menu Toggle */}
              <div className="pt-2 border-t border-[#F2F3F5] space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-[#263550]">Enable Mega Menu Dropdown</span>
                  <input
                    type="checkbox"
                    checked={editingItem.isMegaMenu || false}
                    onChange={e => {
                      const val = e.target.checked;
                      setEditingItem(prev => prev ? { ...prev, isMegaMenu: val } : null);
                      handleUpdateItem(editingItem.id, { isMegaMenu: val });
                    }}
                    className="w-4 h-4 accent-[#FF4FA3]"
                  />
                </label>

                {editingItem.isMegaMenu && (
                  <div className="p-3 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] space-y-3">
                    <span className="text-[11px] font-bold text-[#FF4FA3] block">Mega Menu Featured Banner</span>

                    <div className="flex gap-2 items-center">
                      <div className="w-12 h-10 rounded-lg overflow-hidden bg-white shrink-0 border border-[#FFD8EA]">
                        {editingItem.featuredImage && (
                          <img src={editingItem.featuredImage} alt="Banner" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <button
                        onClick={() => openMediaPicker((url) => {
                          setEditingItem(prev => prev ? { ...prev, featuredImage: url } : null);
                          handleUpdateItem(editingItem.id, { featuredImage: url });
                        })}
                        className="flex-1 py-1.5 rounded-lg bg-white border border-[#FFD8EA] text-xs font-semibold text-[#FF4FA3]"
                      >
                        Choose Banner Image
                      </button>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Banner Title (e.g. Summer Capsule Drop)"
                        value={editingItem.featuredTitle || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setEditingItem(prev => prev ? { ...prev, featuredTitle: val } : null);
                          handleUpdateItem(editingItem.id, { featuredTitle: val });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white border border-[#FFD8EA]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-[#F8F8FA] border border-[#F2F3F5] p-8 text-center text-[#98A0AE] text-xs">
              Select a menu item on the left to edit its details and mega menu settings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
