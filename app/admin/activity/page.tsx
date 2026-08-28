'use client';

import React from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { History, Shield, Search, Download } from 'lucide-react';

export default function ActivityLogsPage() {
  const { activityLogs, addToast } = useAdmin();

  const handleExport = () => {
    addToast({
      type: 'info',
      title: 'Audit Log Exported',
      description: 'System activity records compiled as CSV.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Staff Activity Audit Logs</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Real-time security log of all actions, data modifications, order updates and logins.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="neria-btn-secondary px-3.5 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#667085]" />
          <span>Export Audit Trail</span>
        </button>
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-2xl border border-[#F2F3F5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#F8F8FA] border-b border-[#F2F3F5] text-[11px] font-bold text-[#667085] uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Staff Member</th>
                <th className="py-4 px-3">Action Type</th>
                <th className="py-4 px-3">Module</th>
                <th className="py-4 px-3">Description</th>
                <th className="py-4 px-3">IP Address</th>
                <th className="py-4 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F3F5]">
              {activityLogs.map((act) => (
                <tr key={act.id} className="hover:bg-[#FFF4F8]/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img src={act.staffAvatar} alt={act.staffName} className="w-7 h-7 rounded-full object-cover ring-2 ring-[#FFD8EA]" />
                      <span className="font-bold text-[#263550]">{act.staffName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-[#FFF4F8] text-[#FF4FA3] border border-[#FFD8EA]">
                      {act.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-[#263550]">{act.resource}</td>
                  <td className="py-3.5 px-3 text-[#667085] max-w-md">{act.description}</td>
                  <td className="py-3.5 px-3 font-mono text-[11px] text-[#98A0AE]">{act.ipAddress}</td>
                  <td className="py-3.5 px-4 text-right text-[#98A0AE] whitespace-nowrap">{act.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
