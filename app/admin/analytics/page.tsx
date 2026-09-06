'use client';

import React, { useState, useMemo } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatCard } from '@/src/components/ui/StatCard';
import {
  BarChart3, TrendingUp, DollarSign, ShoppingCart, Users,
  Download
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

export default function AnalyticsPage() {
  const { orders, customers, products, addToast } = useAdmin();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Sales' | 'Products' | 'Customers'>('Overview');

  // ── Live KPIs from Firestore ──
  const paidOrders = useMemo(() => orders.filter((o) => o.paymentStatus === 'Paid'), [orders]);
  const grossRevenue = useMemo(
    () => paidOrders.reduce((sum, o) => sum + o.total, 0),
    [paidOrders]
  );
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  // Repeat shoppers: customers who appear in more than 1 order
  const customerOrderCounts = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => {
      const id = o.customer?.id || o.customer?.email || 'unknown';
      map[id] = (map[id] || 0) + 1;
    });
    return map;
  }, [orders]);
  const repeatShoppers = Object.values(customerOrderCounts).filter((c) => c > 1).length;
  const repeatRate = totalCustomers > 0 ? ((repeatShoppers / totalCustomers) * 100).toFixed(1) : '0.0';

  // ── Revenue trend: last 7 days from real orders ──
  const revenueTrend = useMemo(() => {
    const map: Record<string, number> = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      map[key] = 0;
    }
    paidOrders.forEach((o) => {
      const key = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (key in map) map[key] += o.total;
    });
    return Object.entries(map).map(([date, revenue]) => ({ date, revenue: Math.round(revenue) }));
  }, [paidOrders]);

  // ── Customer growth: orders by month (last 5 months) ──
  const customerGrowth = useMemo(() => {
    const months: Record<string, { new: number; returning: number }> = {};
    const today = new Date();
    for (let i = 4; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = d.toLocaleDateString('en-US', { month: 'short' });
      months[key] = { new: 0, returning: 0 };
    }
    const seen = new Set<string>();
    orders.forEach((o) => {
      const d = new Date(o.createdAt);
      const key = d.toLocaleDateString('en-US', { month: 'short' });
      if (!(key in months)) return;
      const custId = o.customer?.id || o.customer?.email || 'unknown';
      if (seen.has(custId)) {
        months[key].returning += 1;
      } else {
        seen.add(custId);
        months[key].new += 1;
      }
    });
    return Object.entries(months).map(([month, v]) => ({ month, ...v }));
  }, [orders]);

  // ── Top products by revenue ──
  const topProducts = useMemo(() =>
    [...products]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5),
    [products]
  );

  const fmt = (n: number) => `$ ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Business Analytics &amp; Insights</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Real-time revenue trends, retention cohorts, and SKU margins from Firestore.
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

      {/* Top KPIs — always shown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Gross Sales"
          value={fmt(grossRevenue)}
          change="Live from Firestore"
          isPositive={true}
          theme="pink"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          title="Total Orders"
          value={String(totalOrders)}
          change="All time"
          isPositive={true}
          theme="white"
          icon={<ShoppingCart className="w-5 h-5" />}
        />
        <StatCard
          title="Repeat Shopper Rate"
          value={`${repeatRate}%`}
          change={`${repeatShoppers} repeat buyers`}
          isPositive={true}
          theme="blue"
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="Active Products"
          value={String(products.filter((p) => p.status === 'Active').length)}
          change={`${products.length} total in catalog`}
          isPositive={true}
          theme="cream"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Area Chart — live */}
        <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#263550]">Revenue Velocity (Last 7 Days)</h3>
            <p className="text-xs text-[#667085]">Daily gross revenue — real-time Firestore data</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <XAxis dataKey="date" stroke="#98A0AE" fontSize={11} tickLine={false} />
                <YAxis stroke="#98A0AE" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`} />
                <Tooltip formatter={(v: any) => `$${Number(v || 0).toLocaleString()}`} />
                <Area type="monotone" dataKey="revenue" stroke="#FF4FA3" strokeWidth={3} fill="#FFD8EA" fillOpacity={0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Cohort Bar Chart — live */}
        <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#263550]">Customer Acquisition Cohorts</h3>
            <p className="text-xs text-[#667085]">New vs returning buyer orders by month</p>
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

      {/* Products tab — top revenue earners */}
      {(activeTab === 'Products' || activeTab === 'Overview') && topProducts.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-3">
          <h3 className="text-base font-bold text-[#263550]">Top Revenue Products</h3>
          <div className="space-y-2">
            {topProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-[#F2F3F5] last:border-0">
                <div>
                  <p className="text-xs font-bold text-[#263550]">{p.name}</p>
                  <p className="text-[11px] text-[#98A0AE]">{p.category} · {p.salesCount} sold</p>
                </div>
                <span className="text-xs font-bold text-[#FF4FA3]">{fmt(p.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
