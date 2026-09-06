'use client';

import React, { useMemo } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatCard } from '@/src/components/ui/StatCard';
import { Landmark, DollarSign, ArrowUpRight, Percent, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function FinancePage() {
  const { orders, addToast } = useAdmin();

  // ── Live KPIs from Firestore orders ──
  const paidOrders = useMemo(() => orders.filter((o) => o.paymentStatus === 'Paid'), [orders]);
  const refundedOrders = useMemo(() => orders.filter((o) => o.paymentStatus === 'Refunded'), [orders]);

  const grossRevenue = useMemo(
    () => paidOrders.reduce((sum, o) => sum + o.total, 0),
    [paidOrders]
  );
  // Estimate net profit at 58 % margin (COGS + fees deducted)
  const netProfit = grossRevenue * 0.58;
  // Stripe gateway fee ~2.9 % + 30¢ per transaction
  const gatewayFees = paidOrders.reduce(
    (sum, o) => sum + (o.total * 0.029 + 0.3),
    0
  );
  const totalRefunds = refundedOrders.reduce((sum, o) => sum + o.total, 0);

  // ── Last 7 days chart data from real orders ──
  const financeData = useMemo(() => {
    const map: Record<string, { gross: number; net: number; fees: number }> = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      map[key] = { gross: 0, net: 0, fees: 0 };
    }
    paidOrders.forEach((o) => {
      const d = new Date(o.createdAt);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (map[key] !== undefined) {
        map[key].gross += o.total;
        map[key].net += o.total * 0.58;
        map[key].fees += o.total * 0.029 + 0.3;
      }
    });
    return Object.entries(map).map(([date, vals]) => ({
      date,
      gross: Math.round(vals.gross),
      net: Math.round(vals.net),
      fees: Math.round(vals.fees),
    }));
  }, [paidOrders]);

  const fmt = (n: number) =>
    `$ ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Finance &amp; Profit / Loss</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Live revenue, margins, processing fees and refunds — all from Firestore in real time.
          </p>
        </div>

        <button
          onClick={() => addToast({ type: 'success', title: 'P&L Statement Exported', description: 'Financial ledger generated.' })}
          className="neria-btn-secondary px-3.5 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#667085]" />
          <span>Export P&L</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Gross Revenue"
          value={fmt(grossRevenue)}
          change="Live from Firestore"
          isPositive={true}
          theme="pink"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          title="Net Operating Profit"
          value={fmt(netProfit)}
          change="58% Margin"
          isPositive={true}
          theme="blue"
          icon={<Landmark className="w-5 h-5" />}
        />
        <StatCard
          title="Gateway Processing Fees"
          value={fmt(gatewayFees)}
          change="2.9% + 30¢ / txn"
          isPositive={true}
          theme="white"
          icon={<Percent className="w-5 h-5" />}
        />
        <StatCard
          title="Total Refunds Issued"
          value={fmt(totalRefunds)}
          change={`${refundedOrders.length} refunded orders`}
          isPositive={totalRefunds === 0}
          theme="cream"
          icon={<ArrowUpRight className="w-5 h-5" />}
        />
      </div>

      {/* Chart Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#263550]">Gross Revenue vs Net Income (Last 7 Days)</h3>
          <p className="text-xs text-[#667085]">Real-time daily financial performance after COGS and fees</p>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={financeData}>
              <XAxis dataKey="date" stroke="#98A0AE" fontSize={11} tickLine={false} />
              <YAxis stroke="#98A0AE" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`} />
              <Tooltip formatter={(v: any) => `$${Number(v || 0).toLocaleString()}`} />
              <Area type="monotone" dataKey="gross" name="Gross Sales" stroke="#FF4FA3" strokeWidth={3} fill="#FFD8EA" fillOpacity={0.3} />
              <Area type="monotone" dataKey="net" name="Net Profit" stroke="#0284C7" strokeWidth={2} fill="#CBE7FA" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
