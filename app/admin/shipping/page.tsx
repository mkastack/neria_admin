'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatCard } from '@/src/components/ui/StatCard';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Modal } from '@/src/components/ui/Modal';
import { Truck, MapPin, Plus, Clock, DollarSign, Edit, CheckCircle2 } from 'lucide-react';
import { ShippingZone } from '@/src/lib/types';

import { createShippingZoneInDB, deleteShippingZoneInDB } from '@/src/lib/firebase/shipping';

export default function ShippingPage() {
  const { shippingZones, addToast } = useAdmin();
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zoneName, setZoneName] = useState('');
  const [stdRate, setStdRate] = useState(30);
  const [expRate, setExpRate] = useState(50);
  const [regions, setRegions] = useState('');

  const shippingMethods = [
    {
      title: 'Standard Dispatch',
      desc: 'Standard ground delivery anywhere in the continental United States.',
      rate: 'From $ 25',
      time: '24 - 48 Hours',
      badge: 'Default Method'
    },
    {
      title: 'VIP Express Courier',
      desc: 'Priority immediate motorcycle dispatch with direct doorstep handover.',
      rate: 'From $ 40',
      time: '2 - 4 Hours',
      badge: 'Fastest'
    },
    {
      title: 'Showroom Boutique Pickup',
      desc: 'Pick up orders directly from the Neria flagship showroom in New York.',
      rate: 'Free',
      time: 'Ready in 1 Hour',
      badge: 'Free'
    }
  ];

  const handleAddZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneName.trim()) return;

    setIsSubmitting(true);
    const newZone: ShippingZone = {
      id: `zone-${Date.now()}`,
      name: zoneName.trim(),
      regions: regions.split(',').map(r => r.trim()).filter(Boolean),
      standardRate: Number(stdRate) || 0,
      expressRate: Number(expRate) || 0,
      estimatedDelivery: '1 - 2 Business Days',
      status: 'Active'
    };

    try {
      await createShippingZoneInDB(newZone);
      setIsZoneModalOpen(false);
      setZoneName('');
      setRegions('');
      addToast({
        type: 'success',
        title: 'Shipping Zone Saved ♡',
        description: `${zoneName} configured in Firestore for neria-commerce checkout.`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Could not save zone',
        description: err instanceof Error ? err.message : 'Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteZone = async (id: string, name: string) => {
    if (!confirm(`Delete shipping zone "${name}"?`)) return;
    try {
      await deleteShippingZoneInDB(id);
      addToast({
        type: 'info',
        title: 'Zone Removed',
        description: `${name} deleted from Firestore.`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete failed',
        description: err instanceof Error ? err.message : 'Please try again.'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Shipping Methods & Zones</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Configure delivery fees, express tiers, regional zones and courier integrations.
          </p>
        </div>

        <button
          onClick={() => setIsZoneModalOpen(true)}
          className="neria-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Shipping Zone</span>
        </button>
      </div>

      {/* Methods Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {shippingMethods.map((m, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFF4F8] text-[#FF4FA3] border border-[#FFD8EA]">
                {m.badge}
              </span>
              <span className="text-xs font-bold text-[#027A48]">{m.rate}</span>
            </div>

            <div className="flex items-center gap-3 mt-1">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF4F8] text-[#FF4FA3] flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#263550]">{m.title}</h3>
                <p className="text-[11px] text-[#98A0AE]">{m.time}</p>
              </div>
            </div>

            <p className="text-xs text-[#667085] leading-relaxed pt-2 border-t border-[#F2F3F5]">
              {m.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Shipping Zones Table */}
      <div className="bg-white rounded-2xl border border-[#F2F3F5] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#F2F3F5] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#263550]">Configured Regional Delivery Zones</h3>
          <span className="text-xs text-[#98A0AE]">{shippingZones.length} active zones</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F8FA] border-b border-[#F2F3F5] text-[11px] font-bold text-[#667085] uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Zone Name</th>
                <th className="py-4 px-3">Covered Towns & Regions</th>
                <th className="py-4 px-3">Standard Fee</th>
                <th className="py-4 px-3">Express Fee</th>
                <th className="py-4 px-3">Estimated Time</th>
                <th className="py-4 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F3F5] text-xs">
              {shippingZones.map((zone) => (
                <tr key={zone.id} className="hover:bg-[#FFF4F8]/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#263550]">{zone.name}</td>
                  <td className="py-3.5 px-3">
                    <div className="flex flex-wrap gap-1">
                      {zone.regions.map((r, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#F8F8FA] text-[#667085] text-[10px]">
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-[#263550]">$ {zone.standardRate}</td>
                  <td className="py-3.5 px-3 font-bold text-[#FF4FA3]">$ {zone.expressRate}</td>
                  <td className="py-3.5 px-3 text-[#667085]">{zone.estimatedDelivery}</td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={zone.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Zone Modal */}
      <Modal
        isOpen={isZoneModalOpen}
        onClose={() => setIsZoneModalOpen(false)}
        title="Add Regional Shipping Zone"
        subtitle="Define location boundaries and delivery pricing"
      >
        <form onSubmit={handleAddZone} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Zone Name *</label>
            <input
              type="text"
              required
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              placeholder="e.g. West Coast (California)"
              className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Regions / Neighborhoods (comma-separated)</label>
            <input
              type="text"
              value={regions}
              onChange={(e) => setRegions(e.target.value)}
              placeholder="e.g. Downtown LA, Santa Monica, Venice Beach"
              className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Standard Rate ($)</label>
              <input
                type="number"
                value={stdRate}
                onChange={(e) => setStdRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Express Rate ($)</label>
              <input
                type="number"
                value={expRate}
                onChange={(e) => setExpRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#F2F3F5] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsZoneModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#DDE1E7] text-xs font-semibold text-[#667085]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="neria-btn-primary px-5 py-2 text-xs font-semibold cursor-pointer"
            >
              Save Zone ♡
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
