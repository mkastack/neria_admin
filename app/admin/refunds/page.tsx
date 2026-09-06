'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatCard } from '@/src/components/ui/StatCard';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Modal } from '@/src/components/ui/Modal';
import { RotateCcw, CheckCircle2, Clock, AlertTriangle, Search, Plus, DollarSign, Package } from 'lucide-react';
import { updateOrderStatus } from '@/src/lib/firebase/orders';

export default function RefundsPage() {
  const { orders, addToast } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [refundReason, setRefundReason] = useState<'Customer Changed Mind' | 'Defective Item' | 'Wrong Size' | 'Order Cancelled'>('Customer Changed Mind');
  const [isProcessing, setIsProcessing] = useState(false);

  // Derive refunded orders from live Firestore orders
  const refundedOrders = useMemo(() => {
    return orders.filter(o => o.paymentStatus === 'Refunded' || o.fulfillmentStatus === 'Returned');
  }, [orders]);

  // Orders eligible to be refunded
  const refundableOrders = useMemo(() => {
    return orders.filter(o => o.paymentStatus === 'Paid');
  }, [orders]);

  const totalRefunded = useMemo(() => {
    return refundedOrders.reduce((acc, o) => acc + (o.total || 0), 0);
  }, [refundedOrders]);

  const pendingCount = useMemo(() => {
    return orders.filter(o => o.paymentStatus === 'Pending').length;
  }, [orders]);

  const filteredRefunds = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return refundedOrders;
    return refundedOrders.filter(o =>
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer?.name?.toLowerCase().includes(q) ||
      o.customer?.email?.toLowerCase().includes(q)
    );
  }, [refundedOrders, searchQuery]);

  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) {
      addToast({
        type: 'error',
        title: 'Order Required',
        description: 'Please select an order to refund.'
      });
      return;
    }

    const targetOrder = orders.find(o => o.id === selectedOrderId);
    if (!targetOrder) return;

    setIsProcessing(true);
    try {
      await updateOrderStatus(selectedOrderId, 'Refunded', `Refund reason: ${refundReason}`);
      addToast({
        type: 'success',
        title: 'Refund Processed ♡',
        description: `Order ${targetOrder.orderNumber} has been refunded in Firestore ($${targetOrder.total.toLocaleString()}).`
      });
      setIsRefundModalOpen(false);
      setSelectedOrderId('');
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Refund Failed',
        description: err instanceof Error ? err.message : 'Could not update order status.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Refunds & Reversals</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Process returns, exchanges, and payment reversals connected to live Firestore orders.
          </p>
        </div>

        <button
          onClick={() => setIsRefundModalOpen(true)}
          className="neria-btn-primary px-3.5 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Refund</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Refunded Volume"
          value={`$ ${totalRefunded.toLocaleString()}`}
          change="Real-time Firestore sum"
          isPositive={false}
          theme="pink"
          icon={<RotateCcw className="w-5 h-5" />}
        />
        <StatCard
          title="Settled Refund Records"
          value={`${refundedOrders.length} orders`}
          change="Fully Reversed"
          isPositive={true}
          theme="white"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <StatCard
          title="Pending Unpaid Orders"
          value={`${pendingCount} orders`}
          change="Requires inspection"
          isPositive={true}
          theme="cream"
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-[#F2F3F5] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#F2F3F5] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#98A0AE] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order or customer..."
              className="w-full pl-9.5 pr-4 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] text-xs text-[#263550] outline-none"
            />
          </div>
          <span className="text-xs text-[#98A0AE]">{filteredRefunds.length} total refund records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F8FA] border-b border-[#F2F3F5] text-[11px] font-bold text-[#667085] uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Order Number</th>
                <th className="py-4 px-3">Customer</th>
                <th className="py-4 px-3">Items</th>
                <th className="py-4 px-3">Amount</th>
                <th className="py-4 px-3">Channel</th>
                <th className="py-4 px-3">Status</th>
                <th className="py-4 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F3F5] text-xs">
              {filteredRefunds.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#98A0AE]">
                    {orders.length === 0 ? 'Loading live orders...' : 'No refunded orders recorded yet.'}
                  </td>
                </tr>
              ) : (
                filteredRefunds.map((ref) => (
                  <tr key={ref.id} className="hover:bg-[#FFF4F8]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#FF4FA3]">
                      <Link href={`/admin/orders`} className="hover:underline">
                        {ref.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-[#263550]">
                      <div>{ref.customer?.name || 'Customer'}</div>
                      <div className="text-[11px] text-[#98A0AE]">{ref.customer?.email}</div>
                    </td>
                    <td className="py-3.5 px-3 text-[#667085]">
                      {ref.items?.length || 1} item{ref.items?.length !== 1 ? 's' : ''}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#B42318]">$ {ref.total.toLocaleString()}</td>
                    <td className="py-3.5 px-3 text-[#667085]">{ref.paymentMethod || 'Paystack'}</td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status="Refunded" />
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#98A0AE]">
                      {ref.createdAt ? new Date(ref.createdAt).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Refund Modal */}
      {isRefundModalOpen && (
        <Modal
          isOpen={isRefundModalOpen}
          onClose={() => setIsRefundModalOpen(false)}
          title="Process Customer Refund"
          subtitle="Issue a payment reversal directly to customer's source account."
        >
          <form onSubmit={handleProcessRefund} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Select Order to Refund *</label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] bg-white outline-none"
              >
                <option value="">-- Choose an eligible order --</option>
                {refundableOrders.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.orderNumber} — {o.customer.name} (${o.total.toLocaleString()}) [{o.paymentStatus}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Reason for Refund</label>
              <select
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] bg-white outline-none"
              >
                <option value="Customer Changed Mind">Customer Changed Mind</option>
                <option value="Defective Item">Defective Item</option>
                <option value="Wrong Size">Wrong Size</option>
                <option value="Order Cancelled">Order Cancelled</option>
              </select>
            </div>

            <div className="p-3 bg-[#FEF3F2] rounded-xl text-xs text-[#B42318] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Processing this refund will update the order status in Firestore and recalculate all store revenue in real time.
              </span>
            </div>

            <div className="pt-3 border-t border-[#F2F3F5] flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsRefundModalOpen(false)}
                className="neria-btn-secondary px-4 py-2 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing || !selectedOrderId}
                className="neria-btn-primary px-4 py-2 text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Confirm Refund'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
