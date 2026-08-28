'use client';

import React from 'react';
import Link from 'next/link';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatCard } from '@/src/components/ui/StatCard';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import {
  CreditCard, Smartphone, Landmark, CheckCircle2,
  Clock, ArrowUpRight, ShieldCheck, DollarSign, Wallet
} from 'lucide-react';

export default function PaymentsPage() {
  const { transactions } = useAdmin();

  const paymentMethods = [
    {
      name: 'MTN Mobile Money',
      badge: 'Most Popular',
      volume: 'GH₵ 34,200',
      transactions: 92,
      share: '70%',
      color: '#FFCC00',
      fee: '1.0% fee',
      status: 'Operational'
    },
    {
      name: 'Credit / Debit Card (Visa & Mastercard)',
      badge: 'International',
      volume: 'GH₵ 9,800',
      transactions: 24,
      share: '20%',
      color: '#00579F',
      fee: '2.5% fee',
      status: 'Operational'
    },
    {
      name: 'Telecel Cash',
      badge: 'Mobile Wallet',
      volume: 'GH₵ 3,920',
      transactions: 18,
      share: '8%',
      color: '#E60000',
      fee: '1.0% fee',
      status: 'Operational'
    },
    {
      name: 'Bank Direct Transfer',
      badge: 'Manual Approval',
      volume: 'GH₵ 1,000',
      transactions: 8,
      share: '2%',
      color: '#263550',
      fee: '0% fee',
      status: 'Operational'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Payments & Gateways</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Monitor mobile money settlements, card processor volume, and payment channels.
          </p>
        </div>

        <Link
          href="/admin/transactions"
          className="neria-btn-secondary px-3.5 py-2 text-xs font-semibold inline-flex items-center gap-1.5"
        >
          <span>View All Transactions</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Gross Payments Today"
          value="GH₵ 48,920"
          change="+12.8%"
          isPositive={true}
          theme="pink"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          title="Successful Transactions"
          value="142"
          change="98.6% Success Rate"
          isPositive={true}
          theme="white"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <StatCard
          title="Pending Settlements"
          value="GH₵ 4,200"
          change="Releasing 6 PM"
          isPositive={true}
          theme="cream"
          icon={<Clock className="w-5 h-5" />}
        />
        <StatCard
          title="Merchant Balance"
          value="GH₵ 18,450"
          change="Stanbic Bank linked"
          isPositive={true}
          theme="blue"
          icon={<Wallet className="w-5 h-5" />}
        />
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {paymentMethods.map((method, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-[#F2F3F5] p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFF4F8] text-[#FF4FA3] border border-[#FFD8EA]">
                  {method.badge}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-[#027A48] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#12B76A]" /> {method.status}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] flex items-center justify-center text-[#263550]">
                  <Smartphone className="w-6 h-6 text-[#FF4FA3]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#263550]">{method.name}</h3>
                  <p className="text-xs text-[#98A0AE]">{method.fee} • Instant Verification</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-5 p-3 rounded-2xl bg-[#F8F8FA] text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#98A0AE]">Processed</span>
                  <p className="font-bold text-[#263550]">{method.volume}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#98A0AE]">Transactions</span>
                  <p className="font-bold text-[#263550]">{method.transactions}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#98A0AE]">Volume Share</span>
                  <p className="font-bold text-[#FF4FA3]">{method.share}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#F2F3F5] flex items-center justify-between text-xs text-[#667085]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#12B76A]" /> Encrypted & Fraud Monitored
              </span>
              <Link href="/admin/transactions" className="font-semibold text-[#FF4FA3] hover:underline">
                View Logs
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
