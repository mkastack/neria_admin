'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { Modal } from '@/src/components/ui/Modal';
import {
  LayoutTemplate, GripVertical, Eye, EyeOff, Edit,
  Save, Sparkles, Plus, Image as ImageIcon, ArrowUp, ArrowDown
} from 'lucide-react';

interface HomepageBlock {
  id: string;
  name: string;
  type: string;
  heading: string;
  subtitle: string;
  visible: boolean;
  theme: string;
}

export default function HomepageContentPage() {
  const { addToast } = useAdmin();

  const [blocks, setBlocks] = useState<HomepageBlock[]>([
    { id: 'b-1', name: 'Hero Carousel', type: 'Hero Banner', heading: 'Soft Girl & Romantic Silhouettes', subtitle: 'Handcrafted luxury apparel designed in New York', visible: true, theme: 'Blush Pink' },
    { id: 'b-2', name: 'Shop Your Pretty (Categories)', type: 'Category Grid', heading: 'Shop by Lookbook', subtitle: 'Curated by aesthetic styles', visible: true, theme: 'White' },
    { id: 'b-3', name: 'New Arrivals Drop', type: 'Product Slider', heading: 'Fresh off the Runway', subtitle: 'Limited edition weekly pieces', visible: true, theme: 'Blush' },
    { id: 'b-4', name: "Bunny's Picks", type: 'Curated Collection', heading: "Bunny's Favorite Soft Knits", subtitle: 'Signature fleece and plush ear hoodies', visible: true, theme: 'Pink Ribbon' },
    { id: 'b-5', name: 'Bow Obsessed Feature', type: 'Editorial Lookbook', heading: 'Bow Obsessed Collection', subtitle: 'Silk satin hair clips and ribbons', visible: true, theme: 'Powder Blue' },
    { id: 'b-6', name: 'Strawberry Girl Jacquards', type: 'Promo Showcase', heading: 'Strawberry Jacquard Sweets', subtitle: 'Sweetheart organza tiered dresses', visible: true, theme: 'Strawberry Cream' },
    { id: 'b-7', name: 'Neria Girls (#UGC Community)', type: 'Social Grid', heading: 'Styled by Our Neria Girls', subtitle: 'Tag @neriacollective to be featured', visible: true, theme: 'White' },
    { id: 'b-8', name: 'VIP Newsletter Signup', type: 'Footer CTA', heading: 'Join the Neria VIP Club', subtitle: 'Get 10% off your first lookbook order', visible: true, theme: 'Soft Pink' }
  ]);

  const [editingBlock, setEditingBlock] = useState<HomepageBlock | null>(null);

  const toggleVisibility = (id: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, visible: !b.visible } : b));
    addToast({
      type: 'info',
      title: 'Section Visibility Updated',
      description: 'Storefront layout updated in real time.'
    });
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[newIndex];
    newBlocks[newIndex] = temp;
    setBlocks(newBlocks);
    addToast({
      type: 'success',
      title: 'Layout Order Saved ♡',
      description: 'Homepage section order re-arranged.'
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlock) return;
    setBlocks(prev => prev.map(b => b.id === editingBlock.id ? editingBlock : b));
    setEditingBlock(null);
    addToast({
      type: 'success',
      title: 'Section Updated ♡',
      description: `${editingBlock.name} content saved.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Homepage Content Layout Manager</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Visually arrange, toggle visibility, and customize headline copy for storefront homepage sections.
          </p>
        </div>

        <button
          onClick={() => addToast({ type: 'success', title: 'Published to Storefront ♡', description: 'Pushing layout changes to live CDN…', crucial: true })}
          className="neria-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Publish Layout Live</span>
        </button>
      </div>

      {/* Reorderable Section Blocks */}
      <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-[#263550] mb-2">Homepage Stack Sequence ({blocks.length} Sections)</h3>

        <div className="space-y-2.5">
          {blocks.map((block, idx) => (
            <div
              key={block.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                block.visible ? 'bg-white border-[#F2F3F5] shadow-2xs hover:border-[#FFD8EA]' : 'bg-[#F8F8FA] border-[#DDE1E7] opacity-60'
              }`}
            >
              {/* Left Grip & Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex flex-col items-center gap-1 text-[#98A0AE]">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveBlock(idx, 'up')}
                    className="p-1 rounded hover:bg-[#FFF4F8] hover:text-[#FF4FA3] disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === blocks.length - 1}
                    onClick={() => moveBlock(idx, 'down')}
                    className="p-1 rounded hover:bg-[#FFF4F8] hover:text-[#FF4FA3] disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="w-6 h-6 rounded-full bg-[#FFF4F8] text-[#FF4FA3] text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#263550] truncate">{block.name}</h4>
                    <span className="px-2 py-0.2 rounded-md bg-[#F8F8FA] text-[#667085] text-[10px] font-semibold border border-[#DDE1E7]">
                      {block.type}
                    </span>
                  </div>
                  <p className="text-xs text-[#667085] mt-0.5 truncate">
                    &quot;{block.heading}&quot; — {block.subtitle}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleVisibility(block.id)}
                  className={`p-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                    block.visible ? 'border-[#ABEFC6] bg-[#ECFDF3] text-[#027A48]' : 'border-[#DDE1E7] bg-[#F8F8FA] text-[#667085]'
                  }`}
                  title={block.visible ? 'Visible on Store' : 'Hidden'}
                >
                  {block.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{block.visible ? 'Visible' : 'Hidden'}</span>
                </button>

                <button
                  onClick={() => setEditingBlock({ ...block })}
                  className="p-2 rounded-xl border border-[#DDE1E7] hover:border-[#FFD8EA] hover:bg-[#FFF4F8] text-[#263550] text-xs font-semibold cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Section Modal */}
      {editingBlock && (
        <Modal
          isOpen={Boolean(editingBlock)}
          onClose={() => setEditingBlock(null)}
          title={`Edit Section: ${editingBlock.name}`}
          subtitle="Customize copy, theme and merchandising focus"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Headline Heading *</label>
              <input
                type="text"
                required
                value={editingBlock.heading}
                onChange={(e) => setEditingBlock({ ...editingBlock, heading: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Subtext / Description</label>
              <input
                type="text"
                value={editingBlock.subtitle}
                onChange={(e) => setEditingBlock({ ...editingBlock, subtitle: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Visual Tone</label>
              <select
                value={editingBlock.theme}
                onChange={(e) => setEditingBlock({ ...editingBlock, theme: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] bg-white outline-none"
              >
                <option value="Blush Pink">Blush Pink Glow</option>
                <option value="White">Clean White Porcelain</option>
                <option value="Powder Blue">Powder Blue Accent</option>
                <option value="Strawberry Cream">Strawberry Cream Velvet</option>
              </select>
            </div>

            <div className="pt-4 border-t border-[#F2F3F5] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingBlock(null)}
                className="px-4 py-2 rounded-xl border border-[#DDE1E7] text-xs font-semibold text-[#667085]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="neria-btn-primary px-5 py-2 text-xs font-semibold cursor-pointer"
              >
                Save Section ♡
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
