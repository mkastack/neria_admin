'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatCard } from '@/src/components/ui/StatCard';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Modal } from '@/src/components/ui/Modal';
import { RotateCcw, CheckCircle2, Clock, AlertTriangle, Search, Plus } from 'lucide-react';
import { Refund } from '@/src/lib/types';

export default function RefundsPage() {
  const { refunds, setRefunds, addToast } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');

  const totalRefunded = refunds.reduce((acc, r) => acc + r.amount, 0);
  const completedCount = refunds.filter(r => r.status === 'Completed').length;
  const pendingCount = refunds.filter(r => r.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Refunds & Reversals</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Process returns, exchanges, and automated payment channel reversals.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Refunded (30 Days)"
          value={`GH₵ ${totalRefunded.toLocaleString()}`}
          change="Reversals & exchanges"
          isPositive={false}
          theme="pink"
          icon={<RotateCcw className="w-5 h-5" />}
        />
        <StatCard
          title="Completed Refunds"
          value={`${completedCount} records`}
          change="Fully Settled"
          isPositive={true}
          theme="white"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <StatCard
          title="Pending Requests"
          value={`${pendingCount} requests`}
          change="Requires inspection"
          isPositive={true}
          theme="cream"
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-[#F2F3F5] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#F2F3F5] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#263550]">Refund Activity</h3>
          <span className="text-xs text-[#98A0AE]">{refunds.length} total entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F8FA] border-b border-[#F2F3F5] text-[11px] font-bold text-[#667085] uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Refund ID</th>
                <th className="py-4 px-3">Order</th>
                <th className="py-4 px-3">Customer</th>
                <th className="py-4 px-3">Reason</th>
                <th className="py-4 px-3">Amount</th>
                <th className="py-4 px-3">Restocked</th>
                <th className="py-4 px-3">Status</th>
                <th className="py-4 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F3F5] text-xs">
              {refunds.map((ref) => (
                <tr key={ref.id} className="hover:bg-[#FFF4F8]/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#263550]">{ref.refundNumber}</td>
                  <td className="py-3.5 px-3 font-semibold text-[#FF4FA3]">{ref.orderNumber}</td>
                  <td className="py-3.5 px-3 font-medium text-[#263550]">{ref.customerName}</td>
                  <td className="py-3.5 px-3 text-[#667085]">{ref.reason}</td>
                  <td className="py-3.5 px-3 font-bold text-[#B42318]">GH₵ {ref.amount}</td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ref.restocked ? 'bg-[#ECFDF3] text-[#027A48]' : 'bg-[#FEF3F2] text-[#B42318]'}`}>
                      {ref.restocked ? 'Yes, Restocked' : 'No'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={ref.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right text-[#98A0AE]">
                    {new Date(ref.date).toLocaleDateString()}
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
