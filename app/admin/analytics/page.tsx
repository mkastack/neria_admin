'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatCard } from '@/src/components/ui/StatCard';
import {
  BarChart3, TrendingUp, DollarSign, ShoppingCart, Users,
  Calendar, Download, ArrowUpRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { mockRevenueTrend } from '@/src/lib/mock-data';

export default function AnalyticsPage() {
  const { addToast } = useAdmin();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Sales' | 'Products' | 'Customers'>('Overview');

  const customerGrowth = [
    { month: 'Apr', new: 120, returning: 80 },
    { month: 'May', new: 180, returning: 110 },
    { month: 'Jun', new: 240, returning: 160 },
    { month: 'Jul', new: 310, returning: 210 },
    { month: 'Aug', new: 420, returning: 290 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Business Analytics & Insights</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Deep dive into revenue trends, retention cohorts, marketing attribution and SKU margins.
          </p>
        </div>

        <button
          onClick={() => addToast({ type: 'success', title: 'Exported Analytics CSV', description: 'Monthly metrics compiled.' })}
          className="neria-btn-secondary px-3.5 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#667085]" />
          <span>Export Analytics</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-[#F2F3F5] shadow-xs flex items-center gap-1 overflow-x-auto">
        {(['Overview', 'Sales', 'Products', 'Customers'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-[#FF4FA3] text-white shadow-xs'
                : 'text-[#667085] hover:bg-[#FFF4F8] hover:text-[#FF4FA3]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Gross Sales"
          value="GH₵ 48,920"
          change="+18.2%"
          isPositive={true}
          theme="pink"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          title="Orders Completed"
          value="142"
          change="+12.4%"
          isPositive={true}
          theme="white"
          icon={<ShoppingCart className="w-5 h-5" />}
        />
        <StatCard
          title="Repeat Shopper Rate"
          value="48.2%"
          change="+4.1%"
          isPositive={true}
          theme="blue"
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="Cart-to-Order Conversion"
          value="3.8%"
          change="+0.6%"
          isPositive={true}
          theme="cream"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Area Chart */}
        <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#263550]">Revenue Velocity (Last 7 Days)</h3>
            <p className="text-xs text-[#667085]">Daily gross revenue in Ghanaian Cedis</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockRevenueTrend}>
                <XAxis dataKey="date" stroke="#98A0AE" fontSize={11} tickLine={false} />
                <YAxis stroke="#98A0AE" fontSize={11} tickLine={false} tickFormatter={(v) => `GH₵${v / 1000}k`} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#FF4FA3" strokeWidth={3} fill="#FFD8EA" fillOpacity={0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Cohort Growth Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#263550]">Customer Acquisition Cohorts</h3>
            <p className="text-xs text-[#667085]">New VIP signups vs returning buyer orders</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerGrowth}>
                <XAxis dataKey="month" stroke="#98A0AE" fontSize={11} tickLine={false} />
                <YAxis stroke="#98A0AE" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="new" name="New Customers" fill="#FF4FA3" radius={[6, 6, 0, 0]} />
                <Bar dataKey="returning" name="Returning" fill="#263550" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
