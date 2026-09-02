'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import {
  FileText, Plus, Edit3, Eye, Trash2, Globe, Sparkles, CheckCircle2,
  ExternalLink, Search
} from 'lucide-react';

export default function PagesManagerPage() {
  const { config, addCustomPage, deleteCustomPage, setActivePageId } = useStorefrontCms();
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');

  const filteredPages = config.pages.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSlug) return;
    addCustomPage(newTitle, newSlug.toLowerCase().replace(/\s+/g, '-'));
    setNewTitle('');
    setNewSlug('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4F8] border border-[#FFD8EA] text-[#FF4FA3] text-xs font-bold uppercase tracking-wider mb-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Content Management</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#263550] tracking-tight">
            Store Pages & Informational Content
          </h1>
          <p className="text-xs text-[#667085] mt-1">
            Manage your brand story, contact concierge, FAQ accordions, shipping guides, and custom landing pages.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FF4FA3] hover:bg-[#E63E90] text-white text-xs font-bold shadow-md shadow-[#FF4FA3]/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Page</span>
        </button>
      </div>

      {/* Pages Table Card */}
      <div className="rounded-3xl bg-white border border-[#F2F3F5] shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-[#F2F3F5] bg-[#F8F8FA]/60 flex items-center justify-between gap-4">
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#98A0AE]" />
            <input
              type="text"
              placeholder="Search pages..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3]"
            />
          </div>
          <span className="text-xs text-[#98A0AE] font-semibold">
            {filteredPages.length} Pages Configured
          </span>
        </div>

        {/* Table List */}
        <div className="divide-y divide-[#F2F3F5]">
          {filteredPages.map(page => (
            <div
              key={page.id}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#FFF4F8]/30 transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] flex items-center justify-center text-[#FF4FA3] shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h4 className="text-sm font-bold text-[#263550] truncate">{page.title}</h4>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#ECFDF3] text-[#027A48] border border-[#ABEFC6]">
                      {page.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#98A0AE] mt-0.5">
                    <span className="font-mono text-[11px] text-[#667085]">/{page.slug}</span>
                    <span>•</span>
                    <span>{page.blocks.length} Content Blocks</span>
                    <span>•</span>
                    <span>Edited {page.lastEdited}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/website/editor?page=${page.slug}`}
                  onClick={() => setActivePageId(page.slug)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFF4F8] hover:bg-[#FF4FA3] text-[#FF4FA3] hover:text-white text-xs font-bold border border-[#FFD8EA] transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit in Live Editor</span>
                </Link>

                <Link
                  href={`/preview?page=${page.slug}`}
                  target="_blank"
                  title="View Storefront Preview"
                  className="p-2 rounded-xl bg-[#F8F8FA] hover:bg-white text-[#263550] border border-[#F2F3F5] transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </Link>

                {page.id.startsWith('page-') && !['about', 'contact', 'faq', 'shipping-returns', 'size-guide'].includes(page.slug) && (
                  <button
                    onClick={() => deleteCustomPage(page.id)}
                    title="Delete Custom Page"
                    className="p-2 rounded-xl bg-[#F8F8FA] hover:bg-[#FEF3F2] text-[#98A0AE] hover:text-[#B42318] border border-[#F2F3F5] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#101828]/50 backdrop-blur-xs" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 space-y-4 border border-[#F2F3F5]">
            <h3 className="text-base font-bold text-[#263550]">Create New Storefront Page</h3>
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#263550] mb-1">Page Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Atelier Sustainability"
                  value={newTitle}
                  onChange={e => {
                    setNewTitle(e.target.value);
                    if (!newSlug) {
                      setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] focus:outline-none focus:border-[#FF4FA3]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#263550] mb-1">URL Slug</label>
                <div className="flex items-center rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] px-3">
                  <span className="text-xs text-[#98A0AE] font-mono">neriacollective.com/</span>
                  <input
                    type="text"
                    required
                    placeholder="sustainability"
                    value={newSlug}
                    onChange={e => setNewSlug(e.target.value)}
                    className="w-full py-2 pl-1 text-xs bg-transparent focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#667085] hover:bg-[#F8F8FA] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#FF4FA3] hover:bg-[#E63E90] rounded-xl shadow-xs"
                >
                  Create Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
