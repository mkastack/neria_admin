'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Modal } from '@/src/components/ui/Modal';
import {
  ChevronLeft, Printer, RotateCcw, XCircle, CheckCircle2,
  Package, Truck, User, MapPin, Phone, Mail, ShieldAlert,
  CreditCard, Tag, Plus, Send, AlertTriangle
} from 'lucide-react';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { orders, setOrders, fulfillOrder, addToast } = useAdmin();
  const router = useRouter();

  const order = orders.find(o => o.id === resolvedParams.id || o.orderNumber === resolvedParams.id) || orders[0];

  const [notes, setNotes] = useState<string>(order.notes || '');
  const [newNoteInput, setNewNoteInput] = useState<string>('');
  const [isRefundModalOpen, setIsRefundModalOpen] = useState<boolean>(false);
  const [refundReason, setRefundReason] = useState<string>('Wrong Size');
  const [refundAmount, setRefundAmount] = useState<number>(order.total);

  const handlePrint = () => {
    window.print();
  };

  const handleAddNote = () => {
    if (!newNoteInput.trim()) return;
    const updated = notes ? `${notes}\n• ${newNoteInput} (Admin Note - Just now)` : `• ${newNoteInput} (Admin Note - Just now)`;
    setNotes(updated);
    setNewNoteInput('');
    addToast({
      type: 'success',
      title: 'Note Saved',
      description: 'Internal staff note attached to order.'
    });
  };

  const handleConfirmRefund = () => {
    setOrders(prev => prev.map(o => {
      if (o.id === order.id) {
        return { ...o, paymentStatus: 'Refunded', fulfillmentStatus: 'Returned' };
      }
      return o;
    }));
    setIsRefundModalOpen(false);
    addToast({
      type: 'info',
      title: 'Refund Processed ♡',
      description: `GH₵ ${refundAmount} refunded for order ${order.orderNumber}.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 rounded-xl bg-white border border-[#DDE1E7] text-[#667085] hover:text-[#FF4FA3] hover:border-[#FFD8EA] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-[#263550]">{order.orderNumber}</h1>
              <StatusBadge status={order.paymentStatus} />
              <StatusBadge status={order.fulfillmentStatus} />
            </div>
            <p className="text-xs text-[#98A0AE] mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} via Web Checkout
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handlePrint}
            className="neria-btn-secondary px-3.5 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#667085]" />
            <span>Print Invoice</span>
          </button>

          {order.paymentStatus !== 'Refunded' && (
            <button
              onClick={() => setIsRefundModalOpen(true)}
              className="neria-btn-secondary px-3.5 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer text-[#B42318] hover:bg-[#FEF3F2] hover:border-[#FECDCA]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Refund</span>
            </button>
          )}

          {order.fulfillmentStatus !== 'Delivered' && (
            <button
              onClick={() => fulfillOrder(order.id)}
              className="neria-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark as Delivered ♡</span>
            </button>
          )}
        </div>
      </div>

      {/* 2-Column Responsive Layout: Left (70%) / Right (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Items, Timeline, Payment Details, Staff Notes) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Table Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs">
            <h3 className="text-base font-bold text-[#263550] mb-4">Items Ordered ({order.items.length})</h3>

            <div className="divide-y divide-[#F8F8FA]">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-[#F2F3F5] shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#263550] truncate">{item.name}</h4>
                      <p className="text-xs text-[#667085] mt-0.5">
                        Variant: <span className="font-semibold text-[#FF4FA3]">{item.variant}</span>
                      </p>
                      <p className="text-[11px] text-[#98A0AE]">{item.sku}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-[#263550]">GH₵ {item.price * item.quantity}</p>
                    <p className="text-xs text-[#98A0AE]">GH₵ {item.price} × {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Breakdown Totals */}
            <div className="mt-6 pt-5 border-t border-[#F2F3F5] space-y-2 text-xs">
              <div className="flex justify-between text-[#667085]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#263550]">GH₵ {order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#FF4FA3]">
                  <span>Discount ({order.discountCode || 'Promo'})</span>
                  <span className="font-semibold">- GH₵ {order.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-[#667085]">
                <span>Delivery & Handling ({order.deliveryMethod})</span>
                <span className="font-semibold text-[#263550]">GH₵ {order.shippingFee}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#263550] pt-3 border-t border-[#F2F3F5]">
                <span>Total Paid</span>
                <span className="text-[#FF4FA3]">GH₵ {order.total}</span>
              </div>
            </div>
          </div>

          {/* Interactive Order Timeline */}
          <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs">
            <h3 className="text-base font-bold text-[#263550] mb-5">Fulfillment Timeline</h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#FFD8EA]">
              {order.timeline.map((step) => (
                <div key={step.id} className="relative flex items-start gap-3">
                  <span
                    className={`absolute -left-6 top-1 w-3 h-3 rounded-full ring-4 ring-white ${
                      step.completed ? 'bg-[#FF4FA3]' : 'bg-[#DDE1E7]'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-bold ${step.completed ? 'text-[#263550]' : 'text-[#98A0AE]'}`}>
                        {step.title}
                      </h4>
                      <span className="text-[11px] text-[#98A0AE]">{step.date} • {step.time}</span>
                    </div>
                    {step.description && (
                      <p className="text-xs text-[#667085] mt-0.5">{step.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Staff Internal Notes */}
          <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs">
            <h3 className="text-base font-bold text-[#263550] mb-3">Internal Operational Notes</h3>
            {notes && (
              <div className="p-3.5 bg-[#FFF4F8] border border-[#FFD8EA] rounded-2xl text-xs text-[#263550] whitespace-pre-line mb-3">
                {notes}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newNoteInput}
                onChange={(e) => setNewNoteInput(e.target.value)}
                placeholder="Add private note (e.g. customer requested evening delivery)..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none focus:border-[#FFD8EA]"
              />
              <button
                onClick={handleAddNote}
                className="neria-btn-primary px-3.5 py-2 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Customer, Shipping Address, Payment Method, Fraud Risk) */}
        <div className="space-y-6">
          {/* Customer Profile Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#263550]">Customer Details</h3>

            <div className="flex items-center gap-3">
              <img
                src={order.customer.avatar}
                alt={order.customer.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#FFD8EA]"
              />
              <div>
                <h4 className="text-sm font-bold text-[#263550]">{order.customer.name}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF4F8] text-[#FF4FA3] border border-[#FFD8EA]">
                  VIP Neria Girl
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#667085] pt-2 border-t border-[#F2F3F5]">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#98A0AE]" />
                <span>{order.customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#98A0AE]" />
                <span>{order.customer.phone}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-3">
            <h3 className="text-base font-bold text-[#263550] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FF4FA3]" /> Delivery Destination
            </h3>
            <div className="p-3 bg-[#F8F8FA] rounded-2xl text-xs text-[#263550] space-y-1">
              <p className="font-semibold">{order.deliveryAddress.street}</p>
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.region}</p>
              <p>{order.deliveryAddress.country}</p>
            </div>
            <div className="text-xs text-[#667085]">
              <span className="font-semibold text-[#263550]">Method: </span>
              {order.deliveryMethod}
            </div>
          </div>

          {/* Payment & Security */}
          <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-3">
            <h3 className="text-base font-bold text-[#263550] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#027A48]" /> Payment Information
            </h3>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#667085]">Method:</span>
              <span className="font-semibold text-[#263550]">{order.paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#667085]">Risk Level:</span>
              <span className="inline-flex items-center gap-1 text-[#027A48] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Low Fraud Risk
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#98A0AE] mb-3 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Order Tags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {order.tags.map((tag, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#FFF4F8] text-[#FF4FA3] border border-[#FFD8EA]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      <Modal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        title={`Refund Order ${order.orderNumber}`}
        subtitle="Issue partial or full payment reversal to the original payment channel"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Refund Amount (GH₵)</label>
            <input
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Reason for Refund</label>
            <select
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] bg-white outline-none"
            >
              <option value="Wrong Size">Wrong Size / Exchange</option>
              <option value="Defective Item">Defective Item</option>
              <option value="Customer Changed Mind">Customer Changed Mind</option>
              <option value="Order Cancelled">Order Cancelled</option>
            </select>
          </div>

          <div className="p-3 bg-[#FEF3F2] border border-[#FECDCA] rounded-xl text-xs text-[#B42318] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>This will immediately credit the customer via {order.paymentMethod}.</span>
          </div>

          <div className="pt-4 border-t border-[#F2F3F5] flex items-center justify-end gap-2.5">
            <button
              onClick={() => setIsRefundModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#DDE1E7] text-xs font-semibold text-[#667085]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRefund}
              className="px-5 py-2 rounded-xl bg-[#B42318] hover:bg-[#912018] text-white text-xs font-semibold cursor-pointer"
            >
              Confirm Refund GH₵ {refundAmount}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
