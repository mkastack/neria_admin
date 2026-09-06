'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { StatCard } from '@/src/components/ui/StatCard';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Modal } from '@/src/components/ui/Modal';
import {
  Megaphone, Plus, Sparkles, DollarSign, MousePointerClick,
  TrendingUp, Calendar, ArrowRight, Eye, CheckCircle2, Loader2
} from 'lucide-react';
import { Campaign } from '@/src/lib/types';

export default function CampaignsPage() {
  const { campaigns, setCampaigns, orders, addToast } = useAdmin();
  const { updatePopup, updateAnnouncements, publishChanges } = useStorefrontCms();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [type, setType] = useState<'Email' | 'Banner' | 'Homepage Collection' | 'Promo'>('Promo');
  const [message, setMessage] = useState('');
  const [ctaText, setCtaText] = useState('Shop Collection ♡');
  const [promoCode, setPromoCode] = useState('NERIA10');

  // Compute live attributed revenue from paid orders
  const totalAttributed = orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((acc, o) => acc + (o.total || 0), 0);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsPublishing(true);
    const newCamp: Campaign = {
      id: `cmp-${Date.now()}`,
      name,
      type,
      status: 'Active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-10-31',
      audience: 'All Store Visitors',
      revenue: Math.round(totalAttributed * 0.4),
      clicks: 120,
      conversionRate: 4.8,
      message: message || 'Exclusive seasonal apparel drop from Neria Collective.',
      ctaText: ctaText || 'Shop Now',
      ctaLink: '/shop'
    };

    try {
      if (type === 'Promo') {
        updatePopup({
          active: true,
          title: name,
          subtitle: message || 'Get special perks and limited seasonal lookbooks.',
          promoCode: promoCode || 'NERIA10',
          primaryButtonText: ctaText || 'Claim Perk ♡',
        });
      } else if (type === 'Banner') {
        updateAnnouncements((prev) => ({
          ...prev,
          enabled: true,
          items: [
            {
              id: `ann-${Date.now()}`,
              message: `${name.toUpperCase()} — ${message || 'SHOP NOW ♡'}`,
              emoji: '♡',
              linkUrl: '/shop',
              bgColor: '#FF4FA3',
              textColor: '#FFFFFF',
              active: true,
              priority: 1
            },
            ...(prev?.items || [])
          ]
        }));
      }

      await publishChanges(`Launched marketing campaign: ${name}`);

      setCampaigns([newCamp, ...campaigns]);
      setIsCreateModalOpen(false);
      setName('');
      setMessage('');

      addToast({
        type: 'success',
        title: 'Campaign Published Live ♡',
        description: `${name} is now actively broadcasting to customers on neria-commerce.vercel.app.`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Launch Failed',
        description: err instanceof Error ? err.message : 'Could not publish campaign.'
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Marketing Campaigns</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Launch aesthetic promo popups, marquee banners, and seasonal drops synced live to the storefront.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="neria-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Attributed Store Revenue"
          value={`$ ${totalAttributed.toLocaleString()}`}
          change="Derived from live paid orders"
          isPositive={true}
          theme="pink"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          title="Live Marketing Channels"
          value="4 Active"
          change="Storefront Popup, Marquee, Email"
          isPositive={true}
          theme="white"
          icon={<Megaphone className="w-5 h-5" />}
        />
        <StatCard
          title="Average Conversion Rate"
          value="4.8 %"
          change="+1.2% over target"
          isPositive={true}
          theme="cream"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="bg-white rounded-3xl border border-[#F2F3F5] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF4F8] text-[#FF4FA3] border border-[#FFD8EA]">
                  {camp.type}
                </span>
                <StatusBadge status={camp.status} />
              </div>

              <h3 className="text-base font-bold text-[#263550] mt-3">{camp.name}</h3>
              <p className="text-xs text-[#667085] mt-1 line-clamp-2">{camp.message}</p>

              <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-[#F8F8FA] rounded-2xl text-xs">
                <div>
                  <span className="text-[#98A0AE] block text-[10px]">Audience</span>
                  <span className="font-bold text-[#263550]">{camp.audience}</span>
                </div>
                <div>
                  <span className="text-[#98A0AE] block text-[10px]">Attributed</span>
                  <span className="font-bold text-[#FF4FA3]">$ {camp.revenue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F2F3F5] flex items-center justify-between text-xs text-[#98A0AE]">
              <span>Active {camp.startDate}</span>
              <span className="font-bold text-[#027A48] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Broadcasted
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Campaign Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Launch Marketing Campaign"
          subtitle="Campaign broadcast will immediately update banners and popups on the live storefront."
        >
          <form onSubmit={handleCreateCampaign} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Campaign Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Autumn Soft Girl Drop"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#263550] mb-1">Channel Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] bg-white outline-none"
                >
                  <option value="Promo">Promo Pop-up Modal</option>
                  <option value="Banner">Top Marquee Announcement</option>
                  <option value="Homepage Collection">Homepage Drop Collection</option>
                  <option value="Email">Email Broadcast</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#263550] mb-1">Promo Code (Optional)</label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SOFTGIRL"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] font-mono outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Customer Message / Hook</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your special drop or limited perk..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">CTA Button Text</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
              />
            </div>

            <div className="pt-4 border-t border-[#F2F3F5] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#DDE1E7] text-xs font-semibold text-[#667085] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPublishing || !name.trim()}
                className="neria-btn-primary px-5 py-2 text-xs font-semibold cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Broadcasting Live...</span>
                  </>
                ) : (
                  <span>Launch Campaign Live ♡</span>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
