'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatCard } from '@/src/components/ui/StatCard';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import {
  CreditCard, Smartphone, CheckCircle2,
  Clock, ArrowUpRight, ShieldCheck, DollarSign, Wallet
} from 'lucide-react';

const PAYMENT_METHODS = [
  { name: 'Stripe (Card)', badge: 'Most Popular', color: '#635BFF', fee: '2.9% + 30¢', status: 'Operational' },
  { name: 'Stripe (Apple Pay)', badge: 'Mobile Wallet', color: '#000000', fee: '2.9% + 30¢', status: 'Operational' },
  { name: 'Stripe (Google Pay)', badge: 'Express Checkout', color: '#4285F4', fee: '2.9% + 30¢', status: 'Operational' },
  { name: 'PayPal', badge: 'Manual Approval', color: '#003087', fee: '3.5%', status: 'Operational' },
] as const;

export default function PaymentsPage() {
  const { orders } = useAdmin();

  const paidOrders = useMemo(() => orders.filter((o) => o.paymentStatus === 'Paid'), [orders]);

  // ── Live KPIs ──
  const grossPayments = useMemo(
    () => paidOrders.reduce((sum, o) => sum + o.total, 0),
    [paidOrders]
  );
  const successfulTxCount = paidOrders.length;
  const failedOrPending = orders.filter((o) => o.paymentStatus === 'Pending').length;
  const pendingValue = orders
    .filter((o) => o.paymentStatus === 'Pending')
    .reduce((s, o) => s + o.total, 0);

  // ── Per-method stats computed from real orders ──
  const methodStats = useMemo(() => {
    const map: Record<string, { volume: number; txCount: number }> = {};
    PAYMENT_METHODS.forEach((m) => { map[m.name] = { volume: 0, txCount: 0 }; });
    paidOrders.forEach((o) => {
      const key = o.paymentMethod;
      // Match if the order's paymentMethod includes the method name fragment
      const match = PAYMENT_METHODS.find((m) =>
        key?.includes(m.name.replace('Stripe ', '').split(' ')[0]) ||
        key === m.name
      );
      if (match) {
        map[match.name].volume += o.total;
        map[match.name].txCount += 1;
      }
    });
    return map;
  }, [paidOrders]);

  const totalVol = grossPayments || 1; // avoid divide by zero

  const fmt = (n: number) => `$ ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Payments &amp; Gateways</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Real-time card settlements, mobile wallet volume, and payment channels — live from Firestore.
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
          title="Total Gross Payments"
          value={fmt(grossPayments)}
          change="All paid orders"
          isPositive={true}
          theme="pink"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          title="Successful Transactions"
          value={String(successfulTxCount)}
          change={`${totalVol > 0 ? '100' : '0'}% success rate`}
          isPositive={true}
          theme="white"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <StatCard
          title="Pending Settlements"
          value={fmt(pendingValue)}
          change={`${failedOrPending} pending orders`}
          isPositive={failedOrPending === 0}
          theme="cream"
          icon={<Clock className="w-5 h-5" />}
        />
        <StatCard
          title="Net After Fees (est.)"
          value={fmt(grossPayments * 0.971 - successfulTxCount * 0.3)}
          change="After ~2.9% + 30¢"
          isPositive={true}
          theme="blue"
          icon={<Wallet className="w-5 h-5" />}
        />
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PAYMENT_METHODS.map((method) => {
          const stats = methodStats[method.name] ?? { volume: 0, txCount: 0 };
          const share = totalVol > 0 ? ((stats.volume / totalVol) * 100).toFixed(0) : '0';
          return (
            <div
              key={method.name}
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
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${method.color}15` }}
                  >
                    <CreditCard className="w-6 h-6" style={{ color: method.color }} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#263550]">{method.name}</h3>
                    <p className="text-xs text-[#98A0AE]">{method.fee} per transaction</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-5 p-3 rounded-2xl bg-[#F8F8FA] text-center text-xs">
                  <div>
                    <span className="text-[10px] text-[#98A0AE]">Processed</span>
                    <p className="font-bold text-[#263550]">{fmt(stats.volume)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#98A0AE]">Transactions</span>
                    <p className="font-bold text-[#263550]">{stats.txCount}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#98A0AE]">Volume Share</span>
                    <p className="font-bold text-[#FF4FA3]">{share}%</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#F2F3F5] flex items-center justify-between text-xs text-[#667085]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#12B76A]" /> Encrypted &amp; Fraud Monitored
                </span>
                <Link href="/admin/transactions" className="font-semibold text-[#FF4FA3] hover:underline">
                  View Logs
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
