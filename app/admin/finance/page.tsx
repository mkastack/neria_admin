'use client';

import React from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatCard } from '@/src/components/ui/StatCard';
import { Landmark, DollarSign, ArrowUpRight, TrendingUp, Percent, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function FinancePage() {
  const { addToast } = useAdmin();

  const financeData = [
    { date: 'Aug 22', gross: 4800, net: 4200, fees: 80 },
    { date: 'Aug 23', gross: 6200, net: 5400, fees: 110 },
    { date: 'Aug 24', gross: 5100, net: 4400, fees: 90 },
    { date: 'Aug 25', gross: 8400, net: 7300, fees: 150 },
    { date: 'Aug 26', gross: 7300, net: 6400, fees: 130 },
    { date: 'Aug 27', gross: 9800, net: 8600, fees: 180 },
    { date: 'Aug 28', gross: 7320, net: 6450, fees: 120 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Finance & Profit / Loss</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Monitor gross margins, processing withholdings, statutory deductions and payout schedules.
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
          value="GH₵ 48,920"
          change="+14.2%"
          isPositive={true}
          theme="pink"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          title="Net Operating Profit"
          value="GH₵ 28,450"
          change="58.1% Margin"
          isPositive={true}
          theme="blue"
          icon={<Landmark className="w-5 h-5" />}
        />
        <StatCard
          title="Gateway Processing Fees"
          value="GH₵ 720"
          change="1.47% Avg Fee"
          isPositive={true}
          theme="white"
          icon={<Percent className="w-5 h-5" />}
        />
        <StatCard
          title="Total Refunds Issued"
          value="GH₵ 445"
          change="<1% of Gross Sales"
          isPositive={true}
          theme="cream"
          icon={<ArrowUpRight className="w-5 h-5" />}
        />
      </div>

      {/* Chart Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#263550]">Gross Revenue vs Net Income</h3>
          <p className="text-xs text-[#667085]">Daily financial performance after COGS and fees</p>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={financeData}>
              <XAxis dataKey="date" stroke="#98A0AE" fontSize={11} tickLine={false} />
              <YAxis stroke="#98A0AE" fontSize={11} tickLine={false} tickFormatter={(v) => `GH₵${v / 1000}k`} />
              <Tooltip />
              <Area type="monotone" dataKey="gross" name="Gross Sales" stroke="#FF4FA3" strokeWidth={3} fill="#FFD8EA" fillOpacity={0.3} />
              <Area type="monotone" dataKey="net" name="Net Profit" stroke="#0284C7" strokeWidth={2} fill="#CBE7FA" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
