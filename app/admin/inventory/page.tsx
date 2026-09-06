'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatCard } from '@/src/components/ui/StatCard';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Modal } from '@/src/components/ui/Modal';
import { BunnyMascot } from '@/src/components/ui/BunnyMascot';
import {
  Boxes, AlertTriangle, CheckCircle2, XCircle, DollarSign,
  Search, SlidersHorizontal, RefreshCw, Plus, ArrowUpRight
} from 'lucide-react';
import { Product } from '@/src/lib/types';
import { updateProduct } from '@/src/lib/firebase/products';

export default function InventoryPage() {
  const { products, setProducts, addToast } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(10);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('Restock');
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  // Metrics
  const totalUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold);
  const outOfStockProducts = products.filter(p => p.stock === 0);
  const totalValuation = products.reduce((acc, p) => acc + (p.stock * p.price), 0);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAdjustModal = (prod: Product) => {
    setSelectedProduct(prod);
    setAdjustmentAmount(10);
    setIsAdjustModalOpen(true);
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const newStock = Math.max(0, selectedProduct.stock + adjustmentAmount);
    const updatedVariants = selectedProduct.variants.map(v => ({
      ...v,
      stock: Math.max(0, v.stock + Math.floor(adjustmentAmount / (selectedProduct.variants.length || 1)))
    }));

    try {
      await updateProduct(selectedProduct.id, {
        stock: newStock,
        variants: updatedVariants,
      });

      setIsAdjustModalOpen(false);
      addToast({
        type: 'success',
        title: 'Inventory Adjusted ♡',
        description: `Stock for ${selectedProduct.name} updated by ${adjustmentAmount > 0 ? `+${adjustmentAmount}` : adjustmentAmount} units in Firestore.`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Adjustment Failed',
        description: err instanceof Error ? err.message : 'Could not update stock in Firestore.'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Inventory & Stock Control</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Real-time warehouse units, stock alerts, safety thresholds and batch adjustments.
          </p>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Units on Hand"
          value={`${totalUnits} pcs`}
          change="+5.2%"
          isPositive={true}
          theme="pink"
          icon={<Boxes className="w-5 h-5" />}
        />
        <StatCard
          title="Low Stock Alerts"
          value={`${lowStockProducts.length} items`}
          change="Requires Restock"
          isPositive={false}
          theme="cream"
          icon={<AlertTriangle className="w-5 h-5" />}
        />
        <StatCard
          title="Out of Stock SKUs"
          value={`${outOfStockProducts.length} items`}
          change="Urgent Attention"
          isPositive={false}
          theme="white"
          icon={<XCircle className="w-5 h-5" />}
        />
        <StatCard
          title="Total Stock Valuation"
          value={`$ ${totalValuation.toLocaleString()}`}
          change="Retail Value"
          isPositive={true}
          theme="blue"
          icon={<DollarSign className="w-5 h-5" />}
        />
      </div>

      {/* Low Stock Center (Alert Cards) */}
      <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#B54708]" />
            <h3 className="text-base font-bold text-[#263550]">Low Stock Center</h3>
          </div>
          <span className="text-xs text-[#667085]">Threshold alerts automatically flagged</span>
        </div>

        {lowStockProducts.length === 0 && outOfStockProducts.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#ECFDF3] border border-[#ABEFC6] text-xs text-[#027A48]">
            <BunnyMascot size="sm" mood="celebrate" />
            <div>
              <p className="font-bold">Everything looks stocked ♡</p>
              <p className="text-[#027A48]/80">All items are above the safety threshold.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...outOfStockProducts, ...lowStockProducts].map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                  item.stock === 0
                    ? 'bg-[#FEF3F2] border-[#FECDCA]'
                    : 'bg-[#FFF6ED] border-[#FEDF89]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover border border-white shadow-2xs shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#263550] truncate">{item.name}</h4>
                    <p className="text-[11px] text-[#667085]">{item.sku}</p>
                    <span className={`text-[10px] font-extrabold ${item.stock === 0 ? 'text-[#B42318]' : 'text-[#B54708]'}`}>
                      {item.stock === 0 ? '0 Units (Out of Stock)' : `Only ${item.stock} Units Remaining`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openAdjustModal(item)}
                  className="neria-btn-primary px-3 py-1.5 text-xs font-bold shrink-0 cursor-pointer"
                >
                  Restock
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-[#F2F3F5] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#F2F3F5] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#98A0AE] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product inventory..."
              className="w-full pl-9.5 pr-4 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] text-xs text-[#263550] outline-none"
            />
          </div>
          <span className="text-xs text-[#98A0AE]">{filteredProducts.length} items listed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F8FA] border-b border-[#F2F3F5] text-[11px] font-bold text-[#667085] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-3">SKU</th>
                <th className="py-3.5 px-3">Available Units</th>
                <th className="py-3.5 px-3">Reserved</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Valuation</th>
                <th className="py-3.5 px-4 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F3F5] text-xs">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#FFF4F8]/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt={p.name} className="w-9 h-9 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-[#263550]">{p.name}</p>
                        <p className="text-[11px] text-[#98A0AE]">{p.variants.length} Variants</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-xs text-[#667085]">{p.sku}</td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-[#263550]">{p.stock} units</span>
                  </td>
                  <td className="py-3.5 px-3 text-[#98A0AE]">2 reserved</td>
                  <td className="py-3.5 px-3">
                    <StatusBadge
                      status={
                        p.stock === 0
                          ? 'Out of Stock'
                          : p.stock <= p.lowStockThreshold
                          ? 'Low Stock'
                          : 'In Stock'
                      }
                    />
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-[#263550]">
                    $ {(p.stock * p.price).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => openAdjustModal(p)}
                      className="px-3 py-1.5 rounded-xl border border-[#DDE1E7] hover:border-[#FFD8EA] hover:bg-[#FFF4F8] text-[#263550] text-xs font-semibold cursor-pointer transition-colors inline-flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3 text-[#FF4FA3]" />
                      <span>Adjust</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Adjustment Modal */}
      {selectedProduct && (
        <Modal
          isOpen={isAdjustModalOpen}
          onClose={() => setIsAdjustModalOpen(false)}
          title={`Adjust Stock — ${selectedProduct.name}`}
          subtitle={`Current Available Stock: ${selectedProduct.stock} units`}
        >
          <form onSubmit={handleSaveAdjustment} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Adjustment Quantity (+/-)</label>
              <input
                type="number"
                required
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-sm font-bold text-[#263550] outline-none"
              />
              <p className="text-[11px] text-[#98A0AE] mt-1">
                New resulting stock: <span className="font-bold text-[#FF4FA3]">{Math.max(0, selectedProduct.stock + adjustmentAmount)} units</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Reason for Adjustment</label>
              <select
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] bg-white outline-none"
              >
                <option value="Restock">Supplier Restock Shipment</option>
                <option value="Manual Correction">Physical Showroom Count Correction</option>
                <option value="Damage">Damaged / Defective Stock Removal</option>
                <option value="Return">Customer Return Restock</option>
                <option value="Other">Other Adjustment</option>
              </select>
            </div>

            <div className="pt-4 border-t border-[#F2F3F5] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsAdjustModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#DDE1E7] text-xs font-semibold text-[#667085]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="neria-btn-primary px-5 py-2 text-xs font-semibold cursor-pointer"
              >
                Save Adjustment ♡
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
