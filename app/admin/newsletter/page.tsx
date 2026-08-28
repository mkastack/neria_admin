'use client';

import React from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatCard } from '@/src/components/ui/StatCard';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Mail, Users, Send, CheckCircle2, TrendingUp, Download } from 'lucide-react';

export default function NewsletterPage() {
  const { newsletterSubscribers, addToast } = useAdmin();

  const handleExport = () => {
    addToast({
      type: 'info',
      title: 'Subscribers Exported',
      description: `${newsletterSubscribers.length} VIP emails exported.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">VIP Newsletter Club</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Manage your audience subscriber list, campaign open rates, and early access lookbooks.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="neria-btn-secondary px-3.5 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#667085]" />
          <span>Export Audience</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Subscribers"
          value="3,420"
          change="+8.4% This Month"
          isPositive={true}
          theme="pink"
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="Average Open Rate"
          value="82.4%"
          change="High Engagement"
          isPositive={true}
          theme="blue"
          icon={<Mail className="w-5 h-5" />}
        />
        <StatCard
          title="Conversion to Orders"
          value="14.8%"
          change="From Early Access"
          isPositive={true}
          theme="white"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-2xl border border-[#F2F3F5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F8FA] border-b border-[#F2F3F5] text-[11px] font-bold text-[#667085] uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Email Address</th>
                <th className="py-4 px-3">Subscriber Name</th>
                <th className="py-4 px-3">Joined Date</th>
                <th className="py-4 px-3">Opt-in Channel</th>
                <th className="py-4 px-3">Campaigns Received</th>
                <th className="py-4 px-3">Open Rate</th>
                <th className="py-4 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F3F5] text-xs">
              {newsletterSubscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#FFF4F8]/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#263550]">{sub.email}</td>
                  <td className="py-3.5 px-3 text-[#263550]">{sub.name}</td>
                  <td className="py-3.5 px-3 text-[#98A0AE]">{sub.joinedDate}</td>
                  <td className="py-3.5 px-3 text-[#667085]">{sub.source}</td>
                  <td className="py-3.5 px-3 text-[#667085]">{sub.totalCampaignsReceived} sent</td>
                  <td className="py-3.5 px-3 font-bold text-[#027A48]">{sub.openRate}%</td>
                  <td className="py-3.5 px-4 text-right">
                    <StatusBadge status={sub.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
