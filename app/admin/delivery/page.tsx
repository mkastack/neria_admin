'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import {
  MapPin, Navigation, Truck, Phone, CheckCircle2,
  Clock, Sparkles, User, ArrowRight
} from 'lucide-react';

export default function DeliveryDispatchPage() {
  const { deliveryRiders, addToast } = useAdmin();
  const [selectedRideId, setSelectedRideId] = useState<string>(deliveryRiders[0]?.id || '');

  const activeRide = deliveryRiders.find(r => r.id === selectedRideId) || deliveryRiders[0];

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
            Live courier tracking, US-wide dispatch assignments, and doorstep fulfillment telemetry.
          </p>
        </div>
      </div>

      {/* Main 2-Column: Left (Delivery Map Mockup) / Right (Active Riders & Queue) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Delivery Map Mockup (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#F2F3F5] shadow-xs p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#263550] flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#FF4FA3]" /> US Live Dispatch Map
              </h3>
              <p className="text-xs text-[#667085]">Real-time courier positioning and route density</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#ECFDF3] text-[#027A48] text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#12B76A] animate-ping" /> Live GPS Tracking
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
              {/* Soft Roads */}
              <path d="M 20 180 Q 200 120 450 220 T 800 150" fill="none" stroke="#FF4FA3" strokeWidth="3" />
              <path d="M 120 20 Q 300 240 600 280" fill="none" stroke="#0284C7" strokeWidth="2.5" strokeDasharray="4 4" />
            </svg>

            {/* Hub Central Pin (New York Showroom) */}
            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
              <div className="p-2 rounded-2xl bg-[#FF4FA3] text-white shadow-lg ring-4 ring-[#FFF4F8]">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="mt-1 px-2 py-0.5 rounded-md bg-white text-[10px] font-bold text-[#263550] shadow-xs border border-[#F2F3F5]">
                Neria Flagship Hub
              </span>
            </div>

            {/* Rider Pins */}
            {deliveryRiders.map((ride, idx) => (
              <div
                key={ride.id}
                onClick={() => setSelectedRideId(ride.id)}
                style={{ top: `${ride.coordinates.y}%`, left: `${ride.coordinates.x}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-all ${
                  selectedRideId === ride.id ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
              >
                <div className={`p-2 rounded-2xl shadow-xl flex items-center justify-center ${
                  ride.status === 'Delivered'
                    ? 'bg-[#12B76A] text-white'
                    : 'bg-[#263550] text-white ring-4 ring-[#FFD8EA]'
                }`}>
                  <Truck className="w-4 h-4" />
                </div>
                <div className="mt-1 px-2 py-0.5 rounded-md bg-white shadow-sm border border-[#F2F3F5] text-[10px] font-bold text-[#263550] whitespace-nowrap">
                  {ride.riderName} ({ride.orderNumber})
                </div>
              </div>
            ))}
          </div>

          {/* Active Route Telemetry Bar */}
          {activeRide && (
            <div className="p-4 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFF4F8] text-[#FF4FA3] flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#263550]">{activeRide.orderNumber} — {activeRide.customerName}</h4>
                  <p className="text-[#667085]">{activeRide.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={activeRide.status} />
                <button
                  onClick={() => handleCallRider(activeRide.riderPhone)}
                  className="neria-btn-primary px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call Rider</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Dispatch Queue */}
        <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#263550]">Active Couriers</h3>
            <span className="text-xs font-bold text-[#FF4FA3]">{deliveryRiders.length} On Duty</span>
          </div>

          <div className="space-y-3">
            {deliveryRiders.map((ride) => (
              <div
                key={ride.id}
                onClick={() => setSelectedRideId(ride.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedRideId === ride.id
                    ? 'bg-[#FFF4F8] border-[#FFD8EA] shadow-xs'
                    : 'bg-white border-[#F2F3F5] hover:bg-[#F8F8FA]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#263550]">{ride.riderName}</h4>
                  <StatusBadge status={ride.status} />
                </div>
                <p className="text-[11px] text-[#667085] mt-1">{ride.orderNumber} • ETA {ride.estimatedDelivery}</p>
                <p className="text-[11px] text-[#98A0AE] mt-0.5 truncate">{ride.address}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
