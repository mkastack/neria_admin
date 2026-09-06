'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Modal } from '@/src/components/ui/Modal';
import {
  MapPin, Navigation, Truck, Phone, CheckCircle2,
  Clock, Sparkles, User, ArrowRight, Package, Send
} from 'lucide-react';
import { updateOrderDelivery } from '@/src/lib/firebase/orders';

export default function DeliveryDispatchPage() {
  const { orders, addToast } = useAdmin();
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [dispatchModalOrder, setDispatchModalOrder] = useState<any | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [targetStatus, setTargetStatus] = useState<'Shipped' | 'Delivered'>('Shipped');
  const [isUpdating, setIsUpdating] = useState(false);

  // Map real Firestore orders to delivery entries
  const dispatchQueue = useMemo(() => {
    return orders.map((o, idx) => {
      const addr = o.deliveryAddress;
      const addrStr = addr ? [addr.street, addr.city, addr.region, addr.postalCode, addr.country].filter(Boolean).join(', ') : 'Customer pickup / Express delivery';
      
      // Calculate a pseudo-coordinate on the US map for visualization
      const x = 20 + ((idx * 23 + (o.orderNumber.length * 11)) % 65);
      const y = 25 + ((idx * 19 + (o.customer.name.length * 7)) % 55);

      return {
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customer.name,
        customerPhone: o.customer.phone || '+1 (212) 555-0199',
        address: addrStr,
        status: o.fulfillmentStatus || 'Unfulfilled',
        orderStatus: o.paymentStatus,
        total: o.total,
        trackingNumber: (o as any).trackingNumber || `TRK-NER-${o.orderNumber.replace(/[^0-9]/g, '') || o.id.slice(0, 6)}`,
        itemsCount: o.items?.length || 1,
        date: o.createdAt || new Date().toISOString(),
        coordinates: { x, y }
      };
    });
  }, [orders]);

  const activeEntry = useMemo(() => {
    return dispatchQueue.find(d => d.id === selectedOrderId) || dispatchQueue[0];
  }, [dispatchQueue, selectedOrderId]);

  const pendingCount = dispatchQueue.filter(d => d.status === 'Unfulfilled' || d.status === 'Packed').length;
  const inTransitCount = dispatchQueue.filter(d => d.status === 'Shipped').length;
  const deliveredCount = dispatchQueue.filter(d => d.status === 'Delivered').length;

  const handleOpenDispatchModal = (entry: any, status: 'Shipped' | 'Delivered') => {
    setDispatchModalOrder(entry);
    setTargetStatus(status);
    setTrackingNumberInput(entry.trackingNumber || `TRK-${Date.now().toString().slice(-8)}`);
  };

  const handleConfirmDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchModalOrder) return;

    setIsUpdating(true);
    try {
      await updateOrderDelivery(dispatchModalOrder.id, trackingNumberInput.trim(), targetStatus);
      addToast({
        type: 'success',
        title: `Order ${targetStatus === 'Delivered' ? 'Delivered' : 'Dispatched'} ♡`,
        description: `Order ${dispatchModalOrder.orderNumber} updated in Firestore. Customer tracking is now live.`
      });
      setDispatchModalOrder(null);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        description: err instanceof Error ? err.message : 'Could not update delivery status.'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCallRider = (phone?: string) => {
    addToast({
      type: 'info',
      title: 'Dialing Courier Dispatch',
      description: `Calling ${phone || '+1 (212) 555-0210'}...`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Courier & Delivery Dispatch</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Real-time fulfillment telemetry and courier assignments connected to live Firestore orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#FFF4F8] text-[#FF4FA3] border border-[#FFD8EA] text-xs font-bold">
            {pendingCount} Awaiting Dispatch
          </span>
          <span className="px-3 py-1 rounded-full bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5] text-xs font-bold">
            {inTransitCount} In Transit
          </span>
        </div>
      </div>

      {/* Main 2-Column: Left (Delivery Map Mockup) / Right (Active Riders & Queue) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Delivery Map Mockup (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#F2F3F5] shadow-xs p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#263550] flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#FF4FA3]" /> Live Orders Dispatch Map
              </h3>
              <p className="text-xs text-[#667085]">Real-time courier route visualization across customer destinations</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#ECFDF3] text-[#027A48] text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#12B76A] animate-ping" /> Live Tracking
            </span>
          </div>

          {/* Visual Vector Map Graphic with interactive pins */}
          <div className="relative w-full h-80 bg-[#FFF4F8] rounded-2xl border border-[#FFD8EA] overflow-hidden flex items-center justify-center">
            {/* Grid & Map Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-30 stroke-[#FF80BF]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mapGrid)" />
              <path d="M 20 180 Q 200 120 450 220 T 800 150" fill="none" stroke="#FF4FA3" strokeWidth="3" />
              <path d="M 120 20 Q 300 240 600 280" fill="none" stroke="#0284C7" strokeWidth="2.5" strokeDasharray="4 4" />
            </svg>

            {/* Hub Central Pin */}
            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
              <div className="p-2 rounded-2xl bg-[#FF4FA3] text-white shadow-lg ring-4 ring-[#FFF4F8]">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="mt-1 px-2 py-0.5 rounded-md bg-white text-[10px] font-bold text-[#263550] shadow-xs border border-[#F2F3F5]">
                Neria Logistics Hub
              </span>
            </div>

            {/* Order Destination Pins */}
            {dispatchQueue.slice(0, 10).map((ride) => (
              <div
                key={ride.id}
                onClick={() => setSelectedOrderId(ride.id)}
                style={{ top: `${ride.coordinates.y}%`, left: `${ride.coordinates.x}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-all ${
                  (selectedOrderId === ride.id || (!selectedOrderId && activeEntry?.id === ride.id)) ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
              >
                <div className={`p-2 rounded-2xl shadow-xl flex items-center justify-center ${
                  ride.status === 'Delivered'
                    ? 'bg-[#12B76A] text-white'
                    : (ride.status === 'Shipped' ? 'bg-[#FF4FA3] text-white ring-4 ring-[#FFD8EA]' : 'bg-[#263550] text-white ring-2 ring-white')
                }`}>
                  <Truck className="w-4 h-4" />
                </div>
                <div className="mt-1 px-2 py-0.5 rounded-md bg-white shadow-sm border border-[#F2F3F5] text-[10px] font-bold text-[#263550] whitespace-nowrap">
                  {ride.orderNumber}
                </div>
              </div>
            ))}
          </div>

          {/* Active Route Telemetry Bar */}
          {activeEntry && (
            <div className="p-4 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFF4F8] text-[#FF4FA3] flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#263550]">{activeEntry.orderNumber} — {activeEntry.customerName}</h4>
                  <p className="text-[#667085]">{activeEntry.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={activeEntry.status} />
                {activeEntry.status !== 'Delivered' && (
                  <button
                    onClick={() => handleOpenDispatchModal(activeEntry, activeEntry.status === 'Shipped' ? 'Delivered' : 'Shipped')}
                    className="neria-btn-primary px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>{activeEntry.status === 'Shipped' ? 'Mark Delivered' : 'Dispatch Order'}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Dispatch Queue */}
        <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#263550]">Fulfillment Queue</h3>
            <span className="text-xs font-bold text-[#FF4FA3]">{dispatchQueue.length} Orders Total</span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {dispatchQueue.length === 0 ? (
              <p className="text-xs text-[#98A0AE] text-center py-6">No orders in queue.</p>
            ) : (
              dispatchQueue.map((ride) => (
                <div
                  key={ride.id}
                  onClick={() => setSelectedOrderId(ride.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    (selectedOrderId === ride.id || (!selectedOrderId && activeEntry?.id === ride.id))
                      ? 'bg-[#FFF4F8] border-[#FFD8EA] shadow-xs'
                      : 'bg-white border-[#F2F3F5] hover:bg-[#F8F8FA]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#263550]">{ride.orderNumber}</h4>
                    <StatusBadge status={ride.status} />
                  </div>
                  <p className="text-[11px] text-[#667085] mt-1">{ride.customerName} • {ride.itemsCount} items</p>
                  <p className="text-[11px] text-[#98A0AE] mt-0.5 truncate">{ride.address}</p>

                  <div className="mt-2.5 pt-2 border-t border-[#F2F3F5] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#98A0AE]">{ride.trackingNumber}</span>
                    {ride.status !== 'Delivered' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDispatchModal(ride, ride.status === 'Shipped' ? 'Delivered' : 'Shipped');
                        }}
                        className="text-[11px] font-bold text-[#FF4FA3] hover:underline cursor-pointer"
                      >
                        {ride.status === 'Shipped' ? 'Mark Delivered' : 'Dispatch →'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Dispatch Modal */}
      {dispatchModalOrder && (
        <Modal
          isOpen={Boolean(dispatchModalOrder)}
          onClose={() => setDispatchModalOrder(null)}
          title={`Update Fulfillment: ${dispatchModalOrder.orderNumber}`}
          subtitle={`Assign tracking number and update live delivery status to ${targetStatus}.`}
        >
          <form onSubmit={handleConfirmDispatch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Customer & Address</label>
              <div className="p-3 bg-[#F8F8FA] rounded-xl text-xs space-y-1">
                <p className="font-bold text-[#263550]">{dispatchModalOrder.customerName}</p>
                <p className="text-[#667085]">{dispatchModalOrder.address}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Tracking Number *</label>
              <input
                type="text"
                value={trackingNumberInput}
                onChange={(e) => setTrackingNumberInput(e.target.value)}
                required
                placeholder="e.g. TRK-USPS-94001000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Target Fulfillment Status</label>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] bg-white outline-none"
              >
                <option value="Shipped">Shipped (In Transit)</option>
                <option value="Delivered">Delivered (Completed)</option>
              </select>
            </div>

            <div className="pt-3 border-t border-[#F2F3F5] flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDispatchModalOrder(null)}
                className="neria-btn-secondary px-4 py-2 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating || !trackingNumberInput.trim()}
                className="neria-btn-primary px-4 py-2 text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? 'Updating...' : `Mark as ${targetStatus}`}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
