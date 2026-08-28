'use client';

import React from 'react';
import { Sparkles, Plus, Tag, Flame, Gift, Percent } from 'lucide-react';
import { StatusBadge } from '@/src/components/ui/StatusBadge';

export default function PromotionsPage() {
  const promos = [
    {
      title: 'Free Shipping on Accra Orders over GH₵ 500',
      type: 'Shipping Promo',
      status: 'Active',
      impact: 'GH₵ 12,400 sales',
      date: 'Active all month'
    },
    {
      title: 'Buy 2 Hair Clips Get 1 Bow Free',
      type: 'Bundle Offer',
      status: 'Active',
      impact: '210 bundles sold',
      date: 'Ends Aug 31'
    },
    {
      title: 'First Time Shopper 10% Welcome Perk',
      type: 'New Customer',
      status: 'Active',
      impact: '148 redemptions',
      date: 'Ongoing'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Promotional Deals & Bundles</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Configure automated cart deals, tiered incentives, and checkout gifts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {promos.map((p, idx) => (
          <div key={idx} className="bg-white rounded-3xl border border-[#F2F3F5] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF4F8] text-[#FF4FA3] border border-[#FFD8EA]">
                {p.type}
              </span>
              <StatusBadge status={p.status} />
            </div>

            <h3 className="text-base font-bold text-[#263550]">{p.title}</h3>

            <div className="p-3 bg-[#F8F8FA] rounded-2xl text-xs space-y-1">
              <span className="text-[#98A0AE]">Performance Impact</span>
              <p className="font-bold text-[#FF4FA3]">{p.impact}</p>
            </div>

            <div className="pt-2 border-t border-[#F2F3F5] text-xs text-[#98A0AE]">
              {p.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
