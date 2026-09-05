'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatCard } from '@/src/components/ui/StatCard';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { BunnyMascot } from '@/src/components/ui/BunnyMascot';
import {
  DollarSign, ShoppingCart, Users, TrendingUp, CreditCard,
  Percent, ArrowRight, Download, Calendar, ExternalLink,
  Sparkles, CheckCircle2, Eye, PackageCheck
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { mockRevenueTrend, mockSalesByCategory, mockLiveFeed } from '@/src/lib/mock-data';

export default function AdminDashboardPage() {
  const { orders, products, fulfillOrder, addToast } = useAdmin();
  const [chartTimeframe, setChartTimeframe] = useState<'7D' | '30D' | '90D' | '1Y'>('7D');
  const [dateRange, setDateRange] = useState<string>('Aug 22 - Aug 28, 2026');

  const recentOrders = orders.slice(0, 5);

  const handleDownloadReport = () => {
    addToast({
      type: 'success',
      title: 'Report Downloaded ♡',
      description: 'Weekly sales & operations summary generated as CSV.'
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263550] tracking-tight">
              Good morning, Neria <span className="text-[#FF4FA3]">♡</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF4F8] text-[#FF4FA3] border border-[#FFD8EA] hidden sm:inline-block">
              Store Online & Live
            </span>
          </div>
          <p className="text-sm text-[#667085] mt-1">
            Here is what is happening with your New York flagship and digital storefront today.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] text-xs font-medium text-[#263550]">
            <Calendar className="w-4 h-4 text-[#FF4FA3]" />
            <span>{dateRange}</span>
          </div>

          <button
            onClick={handleDownloadReport}
            className="neria-btn-secondary px-3.5 py-2 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4 text-[#667085]" />
            <span>Export Report</span>
          </button>

          <a
            href="https://neriacollective.com"
            target="_blank"
            rel="noopener noreferrer"
            className="neria-btn-primary px-3.5 py-2 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Top KPI Grid (6 Metric Cards with distinct Neria palette themes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Revenue"
          value="$ 48,920"
          change="+12.8%"
          isPositive={true}
          theme="pink"
          icon={<DollarSign className="w-5 h-5" />}
          sparklineData={[30, 45, 60, 50, 70, 85, 78, 95]}
          delay={0}
        />
        <StatCard
          title="Total Orders"
          value="142"
          change="+8.4%"
          isPositive={true}
          theme="white"
          icon={<ShoppingCart className="w-5 h-5" />}
          sparklineData={[15, 20, 18, 28, 24, 32, 30, 36]}
          delay={60}
        />
        <StatCard
          title="Active Customers"
          value="1,280"
          change="+14.2%"
          isPositive={true}
          theme="blue"
          icon={<Users className="w-5 h-5" />}
          sparklineData={[110, 120, 125, 140, 155, 165, 175, 190]}
          delay={120}
        />
        <StatCard
          title="Conversion Rate"
          value="3.8%"
          change="+0.6%"
          isPositive={true}
          theme="white"
          icon={<TrendingUp className="w-5 h-5" />}
          sparklineData={[3.1, 3.2, 3.4, 3.3, 3.5, 3.6, 3.7, 3.8]}
          delay={180}
        />
        <StatCard
          title="Average Order"
          value="$ 445"
          change="+4.1%"
          isPositive={true}
          theme="cream"
          icon={<CreditCard className="w-5 h-5" />}
          sparklineData={[410, 420, 415, 430, 438, 435, 442, 445]}
          delay={240}
        />
        <StatCard
          title="Net Profit"
          value="$ 28,450"
          change="+11.5%"
          isPositive={true}
          theme="white"
          icon={<Percent className="w-5 h-5" />}
          sparklineData={[210, 230, 220, 248, 260, 255, 272, 285]}
          delay={300}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Overview Area Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#263550]">Revenue & Orders Trend</h3>
              <p className="text-xs text-[#667085]">Daily gross earnings vs fulfillment volume</p>
            </div>

            {/* Timeframe Filter Buttons */}
            <div className="inline-flex p-1 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] text-xs font-semibold">
              {(['7D', '30D', '90D', '1Y'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setChartTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    chartTimeframe === tf
                      ? 'bg-white text-[#FF4FA3] shadow-xs'
                      : 'text-[#667085] hover:text-[#263550]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockRevenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4FA3" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#FF4FA3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#98A0AE" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#98A0AE"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#263550] text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
                          <p className="font-semibold">{data.date}</p>
                          <p className="text-[#FFD8EA]">Revenue: $ {data.revenue.toLocaleString()}</p>
                          <p className="text-[#CBE7FA]">Orders: {data.orders} orders</p>
                          <p className="text-[#DDE1E7]">Avg Order: $ {data.aov}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FF4FA3"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#F2F3F5] text-center mt-4">
            <div>
              <p className="text-xs text-[#98A0AE]">Period Earnings</p>
              <p className="text-base font-bold text-[#263550]">$ 48,920</p>
            </div>
            <div>
              <p className="text-xs text-[#98A0AE]">Completed Orders</p>
              <p className="text-base font-bold text-[#263550]">142 Orders</p>
            </div>
            <div>
              <p className="text-xs text-[#98A0AE]">Average Order Value</p>
              <p className="text-base font-bold text-[#263550]">$ 445.00</p>
            </div>
          </div>
        </div>

        {/* Sales by Category Donut (1 Col) */}
        <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#263550]">Sales by Category</h3>
            <p className="text-xs text-[#667085]">Performance across apparel and lookbooks</p>
          </div>

          <div className="h-56 my-2 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockSalesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {mockSalesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-semibold text-[#98A0AE]">Top Seller</span>
              <span className="text-sm font-extrabold text-[#263550]">Hoodies</span>
              <span className="text-xs text-[#FF4FA3] font-bold">35%</span>
            </div>
          </div>

          {/* Category breakdown rows */}
          <div className="space-y-2 pt-2 border-t border-[#F2F3F5]">
            {mockSalesByCategory.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-[#263550]">{item.name}</span>
                </div>
                <div className="flex items-center gap-3 text-[#667085]">
                  <span>{item.value}%</span>
                  <span className="font-semibold text-[#263550]">$ {item.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Orders (Left) & Top Products + Live Feed (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-[#263550]">Recent Orders</h3>
              <p className="text-xs text-[#667085]">Latest customer checkouts and fulfillment requests</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#FF4FA3] hover:underline flex items-center gap-1"
            >
              View All Orders ({orders.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F2F3F5] text-[11px] font-bold text-[#98A0AE] uppercase tracking-wider">
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Fulfillment</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8F8FA] text-xs">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FFF4F8]/40 transition-colors group">
                    <td className="py-3.5 font-bold text-[#263550]">
                      <Link href={`/admin/orders/${order.id}`} className="hover:text-[#FF4FA3]">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={order.customer.avatar}
                          alt={order.customer.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-[#263550]">{order.customer.name}</p>
                          <p className="text-[11px] text-[#98A0AE]">{order.deliveryAddress.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-[#667085]">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </td>
                    <td className="py-3.5">
                      <StatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="py-3.5">
                      <StatusBadge status={order.fulfillmentStatus} />
                    </td>
                    <td className="py-3.5 font-bold text-[#263550]">
                      $ {order.total}
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {order.fulfillmentStatus !== 'Delivered' && (
                          <button
                            onClick={() => fulfillOrder(order.id)}
                            title="Mark Delivered"
                            className="p-1.5 rounded-lg bg-[#ECFDF3] text-[#027A48] hover:bg-[#027A48] hover:text-white transition-colors cursor-pointer"
                          >
                            <PackageCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <Link
                          href={`/admin/orders/${order.id}`}
                          title="View Details"
                          className="p-1.5 rounded-lg text-[#98A0AE] hover:text-[#263550] hover:bg-[#F2F3F5] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Top Selling Products + Live Activity Feed */}
        <div className="space-y-6">
          {/* Top Selling Products */}
          <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#263550]">Top Best Sellers</h3>
              <Link href="/admin/products" className="text-xs font-bold text-[#FF4FA3] hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3.5">
              {products.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-11 h-11 rounded-xl object-cover border border-[#F2F3F5] group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#263550] group-hover:text-[#FF4FA3] transition-colors line-clamp-1">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-[#98A0AE]">{p.salesCount} sold • $ {p.price}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#263550]">$ {p.revenue.toLocaleString()}</span>
                    <p className="text-[10px] text-[#12B76A] font-semibold">In Stock ({p.stock})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Activity Feed */}
          <div id="live-feed" className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4FA3] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF4FA3]"></span>
                </span>
                <h3 className="text-base font-bold text-[#263550]">Live Store Stream</h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#98A0AE] tracking-wider">Real-time</span>
            </div>

            <div className="space-y-3">
              {mockLiveFeed.map((item) => (
                <div key={item.id} className="flex items-start gap-2.5 text-xs p-2.5 rounded-xl bg-[#FFF4F8]/50 border border-[#FFD8EA]/40">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF4FA3] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[#344054] leading-tight font-medium">{item.text}</p>
                    <span className="text-[10px] text-[#98A0AE] mt-0.5 block">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
