'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Modal } from '@/src/components/ui/Modal';
import {
  Tag, Plus, Percent, DollarSign, Truck, Sparkles,
  Calendar, CheckCircle2, Copy, Scissors
} from 'lucide-react';
import { Discount } from '@/src/lib/types';

export default function DiscountsPage() {
  const { discounts, setDiscounts, addToast } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [type, setType] = useState<'Percentage' | 'Fixed Amount' | 'Free Shipping'>('Percentage');
  const [value, setValue] = useState<number>(10);
  const [minSpend, setMinSpend] = useState<number>(200);
  const [usageLimit, setUsageLimit] = useState<number>(500);

  const handleCreateDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newDisc: Discount = {
      id: `disc-${Date.now()}`,
      code: code.toUpperCase().trim(),
      type,
      value: Number(value),
      minSpend: Number(minSpend) || 0,
      usageCount: 0,
      usageLimit: Number(usageLimit) || undefined,
      status: 'Active',
      startDate: new Date().toISOString().split('T')[0],
      applicableTo: 'All Products'
    };

    setDiscounts([newDisc, ...discounts]);
    setIsModalOpen(false);
    setCode('');
    addToast({
      type: 'success',
      title: 'Discount Created ♡',
      description: `Promo code ${newDisc.code} is now active.`
    });
  };

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    addToast({
      type: 'info',
      title: 'Code Copied',
      description: `${codeText} copied to clipboard.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Discounts & Coupon Codes</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Create seasonal coupon codes, VIP perks, and automated free shipping rules.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="neria-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Discount</span>
        </button>
      </div>

      {/* Discount Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {discounts.map((disc) => (
          <div
            key={disc.id}
            className="bg-white rounded-3xl border border-[#F2F3F5] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="px-3 py-1 rounded-xl bg-[#FFF4F8] border border-[#FFD8EA] text-sm font-extrabold text-[#FF4FA3] tracking-wider font-mono">
                  {disc.code}
                </div>
                <StatusBadge status={disc.status} />
              </div>

              <h3 className="text-base font-bold text-[#263550] mt-3">
                {disc.type === 'Percentage'
                  ? `${disc.value}% Off Entire Store`
                  : disc.type === 'Fixed Amount'
                  ? `$ ${disc.value} Off Purchases`
                  : 'Free Shipping Promo'}
              </h3>

              <div className="space-y-1.5 text-xs text-[#667085] mt-2">
                {disc.minSpend ? <p>• Minimum spend: $ {disc.minSpend}</p> : <p>• No minimum spend</p>}
                <p>• Applies to {disc.applicableTo}</p>
                <p>• {disc.usageCount} times redeemed {disc.usageLimit ? `/ ${disc.usageLimit} max` : ''}</p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#F2F3F5] flex items-center justify-between">
              <span className="text-[11px] text-[#98A0AE]">Active since {disc.startDate}</span>
              <button
                onClick={() => handleCopyCode(disc.code)}
                className="p-1.5 rounded-lg text-[#667085] hover:text-[#FF4FA3] hover:bg-[#FFF4F8] transition-colors inline-flex items-center gap-1 text-xs font-semibold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Discount Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Discount Code"
        subtitle="Configure discount type, minimum cart values, and limits"
      >
        <form onSubmit={handleCreateDiscount} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Coupon Code *</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. BUNNYLOVE20"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-sm font-bold text-[#263550] uppercase outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['Percentage', 'Fixed Amount', 'Free Shipping'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  type === t ? 'bg-[#FF4FA3] text-white shadow-xs' : 'bg-[#F8F8FA] text-[#667085] border border-[#DDE1E7]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">
                {type === 'Percentage' ? 'Discount Percentage (%)' : 'Amount ($)'}
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Min Spend ($)</label>
              <input
                type="number"
                value={minSpend}
                onChange={(e) => setMinSpend(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] outline-none"
              />
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="p-4 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] text-center">
            <span className="text-[10px] font-bold text-[#98A0AE] uppercase tracking-wider">Preview Card</span>
            <h4 className="text-base font-extrabold text-[#263550] mt-1">
              {code || 'YOURCODE'} — {type === 'Percentage' ? `${value}% OFF` : `$ ${value} OFF`}
            </h4>
            <p className="text-xs text-[#667085] mt-0.5">Applies to all eligible items above $ {minSpend}</p>
          </div>

          <div className="pt-4 border-t border-[#F2F3F5] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#DDE1E7] text-xs font-semibold text-[#667085]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="neria-btn-primary px-5 py-2 text-xs font-semibold cursor-pointer"
            >
              Publish Code ♡
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
