'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatCard } from '@/src/components/ui/StatCard';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Modal } from '@/src/components/ui/Modal';
import {
  Megaphone, Plus, Sparkles, DollarSign, MousePointerClick,
  TrendingUp, Calendar, ArrowRight, Eye
} from 'lucide-react';
import { Campaign } from '@/src/lib/types';

export default function CampaignsPage() {
  const { campaigns, setCampaigns, addToast } = useAdmin();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [type, setType] = useState<'Email' | 'Banner' | 'Homepage Collection' | 'Promo'>('Homepage Collection');
  const [message, setMessage] = useState('');
  const [ctaText, setCtaText] = useState('Shop Collection ♡');

  const totalAttributed = campaigns.reduce((acc, c) => acc + c.revenue, 0);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCamp: Campaign = {
      id: `cmp-${Date.now()}`,
      name,
      type,
      status: 'Active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-09-30',
      audience: 'All Store Visitors',
      revenue: 0,
      clicks: 0,
      conversionRate: 0,
      message: message || 'Exclusive seasonal apparel drop.',
      ctaText: ctaText || 'Shop Now',
      ctaLink: '/collections'
    };

    setCampaigns([newCamp, ...campaigns]);
    setIsCreateModalOpen(false);
    setName('');
    setMessage('');
    addToast({
      type: 'success',
      title: 'Campaign Launched ♡',
      description: `${name} is now active on storefront marketing channels.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Marketing Campaigns</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Launch aesthetic email newsletters, homepage collections, and flash sale drops.
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
          title="Attributed Revenue"
          value={`GH₵ ${totalAttributed.toLocaleString()}`}
          change="+24.5% vs Last Month"
          isPositive={true}
          theme="pink"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          title="Campaign Clicks"
          value="18,100"
          change="5.4% Avg CTR"
          isPositive={true}
          theme="blue"
          icon={<MousePointerClick className="w-5 h-5" />}
        />
        <StatCard
          title="Average Conversion"
          value="5.5%"
          change="Above Industry Avg"
          isPositive={true}
          theme="white"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="bg-white rounded-3xl border border-[#F2F3F5] p-6 shadow-xs space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFF4F8] text-[#FF4FA3] border border-[#FFD8EA]">
                  {camp.type}
                </span>
                <StatusBadge status={camp.status} />
              </div>

              <h3 className="text-lg font-bold text-[#263550] mt-3">{camp.name}</h3>
              <p className="text-xs text-[#667085] leading-relaxed mt-1">{camp.message}</p>

              <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-[#F8F8FA] rounded-2xl text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#98A0AE]">Attributed</span>
                  <p className="font-bold text-[#FF4FA3]">GH₵ {camp.revenue.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#98A0AE]">Clicks</span>
                  <p className="font-bold text-[#263550]">{camp.clicks.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#98A0AE]">Conv. Rate</span>
                  <p className="font-bold text-[#027A48]">{camp.conversionRate}%</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F2F3F5] flex items-center justify-between text-xs text-[#98A0AE]">
              <span>Runs: {camp.startDate} to {camp.endDate}</span>
              <span className="text-[#263550] font-bold">{camp.ctaText}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Campaign Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Launch Marketing Campaign"
        subtitle="Create an email announcement or promotional banner"
      >
        <form onSubmit={handleCreateCampaign} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Campaign Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Soft Girl Autumn Knitwear Drop"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Campaign Format</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] bg-white outline-none"
              >
                <option value="Homepage Collection">Homepage Collection Feature</option>
                <option value="Email">Email VIP Newsletter</option>
                <option value="Banner">Storefront Banner</option>
                <option value="Promo">Flash Sale Promo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Call to Action (CTA)</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Marketing Message</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Craft your captivating aesthetic copy..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#F2F3F5] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#DDE1E7] text-xs font-semibold text-[#667085]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="neria-btn-primary px-5 py-2 text-xs font-semibold cursor-pointer"
            >
              Launch Campaign ♡
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
