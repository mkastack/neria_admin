'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { EmptyState } from '@/src/components/ui/EmptyState';
import {
  Search, Plus, Download, LayoutGrid, Table, Eye,
  Edit, Trash2, Tag, Layers, CheckCircle2, Boxes
} from 'lucide-react';
import { Product } from '@/src/lib/types';
import { deleteProduct } from '@/src/lib/firebase/products';

export default function ProductsPage() {
  const { products, addToast } = useAdmin();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Hoodies', 'Dresses', 'Tops', 'Accessories', 'Sets'];

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'Active' && p.status !== 'Active') return false;
    if (activeTab === 'Draft' && p.status !== 'Draft') return false;
    if (activeTab === 'Archived' && p.status !== 'Archived') return false;
    if (activeTab === 'Out of Stock' && p.stock > 0) return false;
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      if (!matchName && !matchSku) return false;
    }
    return true;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id);
      addToast({
        type: 'info',
        title: 'Product Deleted',
        description: `${name} has been removed from inventory.`,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete failed',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    }
  };

  const handleExport = () => {
    addToast({
      type: 'info',
      title: 'Catalog Exported',
      description: 'Product catalog exported to CSV successfully.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Products Catalog</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Manage your fashion apparel, accessories, variants, pricing, and live inventory.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExport}
            className="neria-btn-secondary px-3.5 py-2 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#667085]" />
            <span>Export CSV</span>
          </button>

          <Link
            href="/admin/products/new"
            className="neria-btn-primary px-3.5 py-2 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#F2F3F5] shadow-xs space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2 border-b border-[#F2F3F5]">
          <div className="flex items-center gap-2">
            {['All', 'Active', 'Draft', 'Archived', 'Out of Stock'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#FFF4F8] text-[#FF4FA3] border border-[#FFD8EA] shadow-2xs'
                    : 'text-[#667085] hover:bg-[#F8F8FA] hover:text-[#263550]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table / Grid Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-[#FF4FA3] shadow-xs' : 'text-[#98A0AE]'
              }`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-[#FF4FA3] shadow-xs' : 'text-[#98A0AE]'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Category Pills */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#98A0AE] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, SKU..."
              className="w-full pl-9.5 pr-4 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] text-xs text-[#263550] placeholder-[#98A0AE] focus:bg-white focus:border-[#FFD8EA] outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#263550] text-white'
                    : 'bg-[#F8F8FA] text-[#667085] hover:bg-[#FFF4F8] hover:text-[#FF4FA3]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Rendering (Table vs Grid) */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          title="No Products Found"
          description="Try changing your search terms, category filters, or add a brand new piece to the Neria collection."
          actionText="Add New Product"
          onAction={() => window.location.href = '/admin/products/new'}
          bunnyMood="thinking"
        />
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white rounded-2xl border border-[#F2F3F5] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8F8FA] border-b border-[#F2F3F5] text-[11px] font-bold text-[#667085] uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-4">Product</th>
                  <th className="py-4 px-3">Status</th>
                  <th className="py-4 px-3">Stock Units</th>
                  <th className="py-4 px-3">Category</th>
                  <th className="py-4 px-3">Collection</th>
                  <th className="py-4 px-3">Price</th>
                  <th className="py-4 px-3">Sales</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F3F5] text-xs">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#FFF4F8]/40 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 rounded-xl object-cover border border-[#F2F3F5] shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-[#263550] group-hover:text-[#FF4FA3] transition-colors truncate">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-[#98A0AE]">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`font-semibold ${
                          product.stock === 0
                            ? 'text-[#B42318]'
                            : product.stock <= product.lowStockThreshold
                            ? 'text-[#B54708]'
                            : 'text-[#027A48]'
                        }`}
                      >
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[#667085]">{product.category}</td>
                    <td className="py-3.5 px-3 text-[#667085]">
                      <span className="px-2 py-0.5 rounded-md bg-[#FFF4F8] text-[#FF4FA3] text-[11px] font-medium">
                        {product.collection}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#263550]">
                      $ {product.price}
                    </td>
                    <td className="py-3.5 px-3 text-[#667085]">
                      {product.salesCount} sold
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/products/new`}
                          className="p-1.5 rounded-lg text-[#98A0AE] hover:text-[#FF4FA3] hover:bg-[#FFF4F8] transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-1.5 rounded-lg text-[#98A0AE] hover:text-[#B42318] hover:bg-[#FEF3F2] transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-[#F2F3F5] overflow-hidden shadow-xs hover:shadow-md transition-all group"
            >
              <div className="relative h-48 w-full bg-[#F8F8FA] overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <StatusBadge status={product.status} />
                </div>
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-[11px] font-bold text-[#FF4FA3]">
                  {product.collection}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="text-sm font-bold text-[#263550] group-hover:text-[#FF4FA3] transition-colors line-clamp-1">
                  {product.name}
                </h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-base font-extrabold text-[#263550]">$ {product.price}</span>
                  <span className={`font-semibold text-xs ${product.stock <= product.lowStockThreshold ? 'text-[#B54708]' : 'text-[#027A48]'}`}>
                    {product.stock} in stock
                  </span>
                </div>
                <p className="text-[11px] text-[#98A0AE]">{product.salesCount} total orders</p>

                <div className="pt-3 border-t border-[#F2F3F5] flex items-center justify-between">
                  <span className="text-[11px] text-[#667085]">{product.category}</span>
                  <div className="flex items-center gap-1">
                    <Link
                      href="/admin/products/new"
                      className="p-1.5 rounded-lg text-[#98A0AE] hover:text-[#FF4FA3] hover:bg-[#FFF4F8]"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="p-1.5 rounded-lg text-[#98A0AE] hover:text-[#B42318] hover:bg-[#FEF3F2]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
