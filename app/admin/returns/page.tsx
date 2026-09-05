'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Drawer } from '@/src/components/ui/Drawer';
import { Undo2, CheckCircle2, XCircle, Search, Eye, AlertCircle } from 'lucide-react';
import { ReturnRequest } from '@/src/lib/types';

export default function ReturnsPage() {
  const { returnRequests, setReturnRequests, addToast } = useAdmin();
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [activeTab, setActiveTab] = useState('All');

  const filteredReturns = returnRequests.filter(r =>
    activeTab === 'All' ? true : r.status === activeTab
  );

  const handleApprove = (id: string) => {
    setReturnRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    setSelectedReturn(null);
    addToast({
      type: 'success',
      title: 'Return Approved',
      description: 'Return label dispatched to customer.'
    });
  };

  const handleReject = (id: string) => {
    setReturnRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
    setSelectedReturn(null);
    addToast({
      type: 'info',
      title: 'Return Rejected',
      description: 'Customer notified of non-compliance.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Returns & Exchanges</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Inspect item return requests, approve labels, and process warehouse restocks.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-[#F2F3F5] shadow-xs flex items-center gap-2 overflow-x-auto">
        {['All', 'Requested', 'Approved', 'Received', 'Refunded', 'Rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-[#FFF4F8] text-[#FF4FA3] border border-[#FFD8EA]'
                : 'text-[#667085] hover:bg-[#F8F8FA]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#F2F3F5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F8FA] border-b border-[#F2F3F5] text-[11px] font-bold text-[#667085] uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Return ID</th>
                <th className="py-4 px-3">Order Number</th>
                <th className="py-4 px-3">Customer</th>
                <th className="py-4 px-3">Items</th>
                <th className="py-4 px-3">Reason</th>
                <th className="py-4 px-3">Amount</th>
                <th className="py-4 px-3">Status</th>
                <th className="py-4 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F3F5] text-xs">
              {filteredReturns.map((ret) => (
                <tr key={ret.id} className="hover:bg-[#FFF4F8]/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#263550]">{ret.returnNumber}</td>
                  <td className="py-3.5 px-3 font-semibold text-[#FF4FA3]">{ret.orderNumber}</td>
                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-[#263550]">{ret.customerName}</p>
                    <p className="text-[11px] text-[#98A0AE]">{ret.customerEmail}</p>
                  </td>
                  <td className="py-3.5 px-3 text-[#667085]">{ret.items.join(', ')}</td>
                  <td className="py-3.5 px-3 text-[#667085]">{ret.reason}</td>
                  <td className="py-3.5 px-3 font-bold text-[#263550]">$ {ret.refundAmount}</td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={ret.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedReturn(ret)}
                      className="p-1.5 rounded-xl border border-[#DDE1E7] hover:border-[#FFD8EA] hover:bg-[#FFF4F8] text-[#263550] text-xs font-semibold cursor-pointer transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Return Inspection Drawer */}
      {selectedReturn && (
        <Drawer
          isOpen={Boolean(selectedReturn)}
          onClose={() => setSelectedReturn(null)}
          title={`Return Inspection — ${selectedReturn.returnNumber}`}
          subtitle={`For order ${selectedReturn.orderNumber}`}
        >
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA]">
              <span className="text-[11px] font-bold text-[#98A0AE] uppercase">Customer Reason</span>
              <p className="text-sm font-semibold text-[#263550] mt-1">{selectedReturn.reason}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#F2F3F5]">
                <span className="text-[#667085]">Customer</span>
                <span className="font-bold text-[#263550]">{selectedReturn.customerName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F2F3F5]">
                <span className="text-[#667085]">Items</span>
                <span className="font-bold text-[#263550]">{selectedReturn.items.join(', ')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F2F3F5]">
                <span className="text-[#667085]">Refund Value</span>
                <span className="font-bold text-[#FF4FA3]">$ {selectedReturn.refundAmount}</span>
              </div>
              {selectedReturn.adminNotes && (
                <div className="py-2 border-b border-[#F2F3F5]">
                  <span className="text-[#667085] block mb-1">Staff Note</span>
                  <span className="text-[#263550] bg-[#F8F8FA] p-2.5 rounded-xl block">{selectedReturn.adminNotes}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#F2F3F5]">
              <button
                onClick={() => handleReject(selectedReturn.id)}
                className="py-2.5 px-3 rounded-xl border border-[#FECDCA] bg-[#FEF3F2] text-[#B42318] text-xs font-bold hover:bg-[#FECDCA] transition-colors cursor-pointer"
              >
                Reject Request
              </button>
              <button
                onClick={() => handleApprove(selectedReturn.id)}
                className="py-2.5 px-3 neria-btn-primary text-xs font-bold cursor-pointer"
              >
                Approve Return ♡
              </button>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}
