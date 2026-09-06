'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Modal } from '@/src/components/ui/Modal';
import {
  Tag, Plus, Percent, DollarSign, Truck, Sparkles,
  Calendar, CheckCircle2, Copy, Scissors, Trash2, Power, Loader2
} from 'lucide-react';
import { Discount } from '@/src/lib/types';
import { upsertPromoCode, deletePromoCode } from '@/src/lib/firebase/promoCodes';

export default function DiscountsPage() {
  const { discounts, addToast } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [type, setType] = useState<'Percentage' | 'Fixed Amount' | 'Free Shipping'>('Percentage');
  const [value, setValue] = useState<number>(10);
  const [minSpend, setMinSpend] = useState<number>(200);
  const [usageLimit, setUsageLimit] = useState<number>(500);

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.toUpperCase().trim().replace(/[^A-Z0-9_-]/g, '');
    if (!cleanCode) return;

    setIsSubmitting(true);
    const newDisc: Discount = {
      id: cleanCode,
      code: cleanCode,
      type,
      value: Number(value),
      minSpend: Number(minSpend) || 0,
      usageCount: 0,
      usageLimit: Number(usageLimit) || undefined,
      status: 'Active',
      startDate: new Date().toISOString().split('T')[0],
      applicableTo: 'All Products'
    };

    try {
      await upsertPromoCode(newDisc);
      setIsModalOpen(false);
      setCode('');
      addToast({
        type: 'success',
        title: 'Discount Code Published ♡',
        description: `Promo code ${newDisc.code} is now live and usable at checkout on neria-commerce.vercel.app.`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Failed to Save',
        description: err instanceof Error ? err.message : 'Could not save promo code to Firestore.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (disc: Discount) => {
    const nextStatus = disc.status === 'Active' ? 'Expired' : 'Active';
    try {
      await upsertPromoCode({
        ...disc,
        status: nextStatus
      });
      addToast({
        type: 'info',
        title: `Code ${nextStatus}`,
        description: `${disc.code} is now ${nextStatus.toLowerCase()} in Firestore.`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        description: err instanceof Error ? err.message : 'Could not update status.'
      });
    }
  };

  const handleDeleteCode = async (discCode: string) => {
    if (!confirm(`Permanently delete discount code ${discCode}?`)) return;
    try {
      await deletePromoCode(discCode);
      addToast({
        type: 'info',
        title: 'Discount Removed',
        description: `Code ${discCode} was deleted from Firestore.`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        description: err instanceof Error ? err.message : 'Could not delete promo code.'
      });
    }
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
            Create seasonal promo codes and discounts connected directly to Firestore checkout validation.
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
        {discounts.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-[#F2F3F5] text-xs text-[#98A0AE]">
            No discount codes found. Click "Create Discount" to launch your first code.
          </div>
        ) : (
          discounts.map((disc) => (
            <div
              key={disc.id}
              className="bg-white rounded-3xl border border-[#F2F3F5] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="px-3 py-1 rounded-xl bg-[#FFF4F8] border border-[#FFD8EA] text-sm font-extrabold text-[#FF4FA3] tracking-wider font-mono">
                    {disc.code}
                  </div>
                  <button
                    onClick={() => handleToggleStatus(disc)}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    title="Click to toggle status"
                  >
                    <StatusBadge status={disc.status} />
                  </button>
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
                <span className="text-[11px] text-[#98A0AE]">Active since {disc.startDate || 'Recent'}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopyCode(disc.code)}
                    className="p-1.5 rounded-lg text-[#667085] hover:text-[#FF4FA3] hover:bg-[#FFF4F8] transition-colors inline-flex items-center gap-1 text-xs font-semibold cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => handleDeleteCode(disc.code)}
                    className="p-1.5 rounded-lg text-[#98A0AE] hover:text-[#B42318] hover:bg-[#FEF3F2] transition-colors cursor-pointer"
                    title="Delete discount"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Discount Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Discount Code"
          subtitle="Code is saved directly to Firestore and immediately active at checkout."
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-sm font-bold text-[#263550] uppercase outline-none font-mono"
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

            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Usage Limit (Redemptions)</label>
              <input
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] outline-none"
              />
            </div>

            {/* Live Preview Card */}
            <div className="p-4 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] text-center">
              <span className="text-[10px] font-bold text-[#98A0AE] uppercase tracking-wider">Preview Card</span>
              <h4 className="text-base font-extrabold text-[#263550] mt-1 font-mono">
                {code || 'YOURCODE'} — {type === 'Percentage' ? `${value}% OFF` : `$ ${value} OFF`}
              </h4>
              <p className="text-xs text-[#667085] mt-0.5">Applies to all eligible items above $ {minSpend}</p>
            </div>

            <div className="pt-4 border-t border-[#F2F3F5] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#DDE1E7] text-xs font-semibold text-[#667085] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !code.trim()}
                className="neria-btn-primary px-5 py-2 text-xs font-semibold cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Publish Code ♡</span>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
