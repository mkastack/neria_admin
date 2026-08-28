'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatCard } from '@/src/components/ui/StatCard';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Modal } from '@/src/components/ui/Modal';
import { Gift, Plus, Sparkles, DollarSign, Copy, CheckCircle2 } from 'lucide-react';
import { GiftCard } from '@/src/lib/types';

export default function GiftCardsPage() {
  const { giftCards, setGiftCards, addToast } = useAdmin();
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [initialValue, setInitialValue] = useState<number>(350);

  const totalIssued = giftCards.reduce((acc, g) => acc + g.initialValue, 0);
  const totalBalance = giftCards.reduce((acc, g) => acc + g.balance, 0);
  const totalRedeemed = totalIssued - totalBalance;

  const handleIssueGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    const newCard: GiftCard = {
      id: `gc-${Date.now()}`,
      code: `NER-GIFT-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      customerName: recipientName || 'VIP Neria Girl',
      customerEmail: recipientEmail,
      initialValue: Number(initialValue),
      balance: Number(initialValue),
      status: 'Active',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    };

    setGiftCards([newCard, ...giftCards]);
    setIsIssueModalOpen(false);
    setRecipientName('');
    setRecipientEmail('');
    addToast({
      type: 'success',
      title: 'Gift Card Issued ♡',
      description: `GH₵ ${initialValue} digital gift card created.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Gift Cards & Store Credits</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Issue and track digital gift cards, vouchers, and store credits.
          </p>
        </div>

        <button
          onClick={() => setIsIssueModalOpen(true)}
          className="neria-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Gift Card</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Gift Cards Issued"
          value={`GH₵ ${totalIssued.toLocaleString()}`}
          change="Lifetime Value"
          isPositive={true}
          theme="pink"
          icon={<Gift className="w-5 h-5" />}
        />
        <StatCard
          title="Redeemed Credits"
          value={`GH₵ ${totalRedeemed.toLocaleString()}`}
          change="Used in Checkout"
          isPositive={true}
          theme="white"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <StatCard
          title="Outstanding Balance"
          value={`GH₵ ${totalBalance.toLocaleString()}`}
          change="Available to Spend"
          isPositive={true}
          theme="blue"
          icon={<DollarSign className="w-5 h-5" />}
        />
      </div>

      {/* Gift Cards Table */}
      <div className="bg-white rounded-2xl border border-[#F2F3F5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F8FA] border-b border-[#F2F3F5] text-[11px] font-bold text-[#667085] uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Card Code</th>
                <th className="py-4 px-3">Recipient</th>
                <th className="py-4 px-3">Initial Value</th>
                <th className="py-4 px-3">Current Balance</th>
                <th className="py-4 px-3">Status</th>
                <th className="py-4 px-4 text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F3F5] text-xs">
              {giftCards.map((card) => (
                <tr key={card.id} className="hover:bg-[#FFF4F8]/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#263550]">
                    {card.code}
                  </td>
                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-[#263550]">{card.customerName || 'Anonymous'}</p>
                    <p className="text-[11px] text-[#98A0AE]">{card.customerEmail || 'Direct Code'}</p>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-[#667085]">
                    GH₵ {card.initialValue}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-[#FF4FA3]">
                    GH₵ {card.balance}
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={card.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right text-[#98A0AE]">
                    {new Date(card.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Gift Card Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Issue Digital Gift Card"
        subtitle="Generate a unique gift voucher code for customer or VIP gifting"
      >
        <form onSubmit={handleIssueGiftCard} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Card Value (GH₵) *</label>
            <input
              type="number"
              required
              value={initialValue}
              onChange={(e) => setInitialValue(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-sm font-bold text-[#263550] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Recipient Name</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. Ama Serwaa"
              className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Recipient Email</label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="ama@gmail.com"
              className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#F2F3F5] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsIssueModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#DDE1E7] text-xs font-semibold text-[#667085]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="neria-btn-primary px-5 py-2 text-xs font-semibold cursor-pointer"
            >
              Issue Card ♡
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
