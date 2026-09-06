'use client';

import React, { useState, useMemo } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Drawer } from '@/src/components/ui/Drawer';
import { Undo2, CheckCircle2, XCircle, Search, Eye, AlertCircle } from 'lucide-react';
import { ReturnRequest } from '@/src/lib/types';
import { updateOrderStatus } from '@/src/lib/firebase/orders';

export default function ReturnsPage() {
  const { orders, addToast } = useAdmin();
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Derive return records from real Firestore orders
  const returnRequests: ReturnRequest[] = useMemo(() => {
    // Look at orders with returned/refunded status or items
    return orders
      .filter(o => o.paymentStatus === 'Refunded' || o.fulfillmentStatus === 'Returned' || o.notes?.includes('Refund') || o.notes?.includes('Return'))
      .map((o) => ({
        id: `ret-${o.id}`,
        returnNumber: `RET-${o.orderNumber.replace(/[^0-9]/g, '') || o.id.slice(0, 6)}`,
        orderNumber: o.orderNumber,
        customerName: o.customer.name,
        customerEmail: o.customer.email || 'customer@neriacollective.com',
        items: o.items?.map(i => i.name || 'Neria Apparel Item') || ['Neria Apparel Item'],
        reason: o.notes?.replace('Refund reason: ', '') || 'Customer requested return & exchange',
        status: (o.paymentStatus === 'Refunded' ? 'Refunded' : 'Received') as ReturnRequest['status'],
        requestedAt: o.createdAt || new Date().toISOString(),
        refundAmount: o.total,
        adminNotes: o.notes
      }));
  }, [orders]);

  const filteredReturns = useMemo(() => {
    return returnRequests.filter(r => {
      if (activeTab !== 'All' && r.status !== activeTab) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.returnNumber.toLowerCase().includes(q) ||
          r.orderNumber.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [returnRequests, activeTab, searchQuery]);

  const handleApprove = async (ret: ReturnRequest) => {
    const orderId = ret.id.replace('ret-', '');
    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, 'Refunded', 'Return approved & refunded by admin');
      setSelectedReturn(null);
      addToast({
        type: 'success',
        title: 'Return Approved & Refunded ♡',
        description: `Order ${ret.orderNumber} updated in Firestore. Return label dispatched.`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Action Failed',
        description: err instanceof Error ? err.message : 'Could not update order status.'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async (ret: ReturnRequest) => {
    const orderId = ret.id.replace('ret-', '');
    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, 'Paid', 'Return rejected after staff inspection');
      setSelectedReturn(null);
      addToast({
        type: 'info',
        title: 'Return Rejected',
        description: `Order ${ret.orderNumber} marked non-compliant in Firestore.`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Action Failed',
        description: err instanceof Error ? err.message : 'Could not update order status.'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Returns & Exchanges</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Inspect item return requests and process returns connected to live Firestore orders.
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="bg-white p-2 rounded-2xl border border-[#F2F3F5] shadow-xs flex items-center gap-1.5 overflow-x-auto">
          {['All', 'Requested', 'Approved', 'Received', 'Refunded', 'Rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#FFF4F8] text-[#FF4FA3] border border-[#FFD8EA]'
                  : 'text-[#667085] hover:bg-[#F8F8FA]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#98A0AE] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter returns..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#DDE1E7] text-xs text-[#263550] outline-none"
          />
        </div>
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
              {filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[#98A0AE]">
                    {orders.length === 0 ? 'Loading live orders...' : 'No return requests recorded.'}
                  </td>
                </tr>
              ) : (
                filteredReturns.map((ret) => (
                  <tr key={ret.id} className="hover:bg-[#FFF4F8]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#263550]">{ret.returnNumber}</td>
                    <td className="py-3.5 px-3 font-semibold text-[#FF4FA3]">{ret.orderNumber}</td>
                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-[#263550]">{ret.customerName}</p>
                      <p className="text-[11px] text-[#98A0AE]">{ret.customerEmail}</p>
                    </td>
                    <td className="py-3.5 px-3 text-[#667085]">{ret.items.join(', ')}</td>
                    <td className="py-3.5 px-3 text-[#667085]">{ret.reason}</td>
                    <td className="py-3.5 px-3 font-bold text-[#263550]">$ {ret.refundAmount.toLocaleString()}</td>
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
                ))
              )}
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
                <span className="font-bold text-[#FF4FA3]">$ {selectedReturn.refundAmount.toLocaleString()}</span>
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
                disabled={isUpdating}
                onClick={() => handleReject(selectedReturn)}
                className="py-2.5 px-3 rounded-xl border border-[#FECDCA] bg-[#FEF3F2] text-[#B42318] text-xs font-bold hover:bg-[#FECDCA] transition-colors cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? 'Updating...' : 'Reject Request'}
              </button>
              <button
                disabled={isUpdating}
                onClick={() => handleApprove(selectedReturn)}
                className="py-2.5 px-3 neria-btn-primary text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? 'Processing...' : 'Approve & Settle ♡'}
              </button>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}
