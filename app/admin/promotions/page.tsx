'use client';

import React from 'react';
import Link from 'next/link';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { Sparkles, Plus, Tag, Flame, Gift, Percent, ArrowRight } from 'lucide-react';
import { StatusBadge } from '@/src/components/ui/StatusBadge';

export default function PromotionsPage() {
  const { discounts, orders } = useAdmin();

  // Compute live promotion metrics from orders & promo codes
  const totalPromoRedemptions = discounts.reduce((acc, d) => acc + (d.usageCount || 0), 0);
  const activePromoCount = discounts.filter(d => d.status === 'Active').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Promotional Deals & Bundles</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Configure automated checkout deals, tiered incentives, and coupon incentives live in Firestore.
          </p>
        </div>

        <Link
          href="/admin/discounts"
          className="neria-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Manage Coupon Codes</span>
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#F2F3F5] shadow-xs">
          <span className="text-[11px] font-bold text-[#98A0AE] uppercase">Active Store Promotions</span>
          <p className="text-2xl font-extrabold text-[#263550] mt-1">{activePromoCount} Active</p>
          <p className="text-xs text-[#12B76A] mt-0.5 font-medium">Synced with neria-commerce checkout</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-[#F2F3F5] shadow-xs">
          <span className="text-[11px] font-bold text-[#98A0AE] uppercase">Total Code Redemptions</span>
          <p className="text-2xl font-extrabold text-[#FF4FA3] mt-1">{totalPromoRedemptions} Uses</p>
          <p className="text-xs text-[#667085] mt-0.5">Across all customer orders</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-[#F2F3F5] shadow-xs">
          <span className="text-[11px] font-bold text-[#98A0AE] uppercase">Standard Shipping Rule</span>
          <p className="text-2xl font-extrabold text-[#0284C7] mt-1">Free &gt; $500</p>
          <p className="text-xs text-[#667085] mt-0.5">Automatic threshold at cart</p>
        </div>
      </div>

      {/* Live Promos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {discounts.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-[#F2F3F5] text-xs text-[#98A0AE]">
            No promo codes found in Firestore. Create one in the discounts tab!
          </div>
        ) : (
          discounts.map((p) => (
            <div key={p.id} className="bg-white rounded-3xl border border-[#F2F3F5] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF4F8] text-[#FF4FA3] border border-[#FFD8EA] font-mono">
                  {p.code}
                </span>
                <StatusBadge status={p.status} />
              </div>

              <h3 className="text-base font-bold text-[#263550]">
                {p.type === 'Percentage' ? `${p.value}% Off Entire Store` : (p.type === 'Fixed Amount' ? `$ ${p.value} Off Purchases` : 'Free Shipping')}
              </h3>

              <div className="p-3 bg-[#F8F8FA] rounded-2xl text-xs space-y-1">
                <span className="text-[#98A0AE]">Redemption Count</span>
                <p className="font-bold text-[#FF4FA3]">{p.usageCount} times redeemed</p>
              </div>

              <div className="pt-2 border-t border-[#F2F3F5] flex items-center justify-between text-xs text-[#98A0AE]">
                <span>Min Spend: ${p.minSpend || 0}</span>
                <Link href="/admin/discounts" className="text-[#FF4FA3] font-bold hover:underline inline-flex items-center gap-0.5">
                  Edit <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
