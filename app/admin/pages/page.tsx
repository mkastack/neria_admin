'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Modal } from '@/src/components/ui/Modal';
import { FileText, Plus, Edit, Eye } from 'lucide-react';

export default function StorePagesPage() {
  const { addToast } = useAdmin();

  const [pages, setPages] = useState([
    { id: 'p-1', title: 'About Neria Collective', slug: '/about', status: 'Active', updated: 'Aug 20, 2026', author: 'Founder' },
    { id: 'p-2', title: 'Customer Care & FAQ', slug: '/faq', status: 'Active', updated: 'Aug 22, 2026', author: 'Support' },
    { id: 'p-3', title: 'Shipping & Regional Delivery', slug: '/shipping', status: 'Active', updated: 'Aug 25, 2026', author: 'Operations' },
    { id: 'p-4', title: 'Returns & Exchange Policy', slug: '/returns-policy', status: 'Active', updated: 'Aug 18, 2026', author: 'Legal' },
    { id: 'p-5', title: 'Size Guide & Measurement Chart', slug: '/size-guide', status: 'Active', updated: 'Aug 15, 2026', author: 'Design Team' },
    { id: 'p-6', title: 'Privacy & Terms of Service', slug: '/privacy-terms', status: 'Active', updated: 'Aug 01, 2026', author: 'Legal' }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Storefront Content Pages</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Manage static informational pages, FAQ accordions, and policy documents.
          </p>
        </div>

        <button
          onClick={() => addToast({ type: 'info', title: 'Page Editor', description: 'Page creator opened.' })}
          className="neria-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Page</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#F2F3F5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F8FA] border-b border-[#F2F3F5] text-[11px] font-bold text-[#667085] uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Page Title</th>
                <th className="py-4 px-3">URL Slug</th>
                <th className="py-4 px-3">Status</th>
                <th className="py-4 px-3">Last Updated</th>
                <th className="py-4 px-3">Author</th>
                <th className="py-4 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F3F5] text-xs">
              {pages.map((p) => (
                <tr key={p.id} className="hover:bg-[#FFF4F8]/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#263550]">{p.title}</td>
                  <td className="py-3.5 px-3 font-mono text-xs text-[#FF4FA3]">{p.slug}</td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="py-3.5 px-3 text-[#667085]">{p.updated}</td>
                  <td className="py-3.5 px-3 text-[#667085]">{p.author}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => addToast({ type: 'info', title: 'Opening Editor', description: `Editing ${p.title}.` })}
                      className="p-1.5 rounded-lg text-[#667085] hover:text-[#FF4FA3] hover:bg-[#FFF4F8] transition-colors inline-flex items-center gap-1 text-xs font-semibold cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
