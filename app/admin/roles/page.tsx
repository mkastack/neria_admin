'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { ShieldCheck, ShieldAlert, Check, X, Plus } from 'lucide-react';

export default function RolesPage() {
  const { addToast } = useAdmin();

  const roles = [
    { name: 'Super Admin', desc: 'Full administrative access across all finance, staff and settings.', users: 1 },
    { name: 'Store Manager', desc: 'Can manage catalog, orders, discounts and customer service.', users: 2 },
    { name: 'Order & Logistics Manager', desc: 'Can fulfill orders, update tracking and manage couriers.', users: 1 },
    { name: 'Customer Support', desc: 'Can view orders, moderate reviews and respond to inquiries.', users: 3 }
  ];

  const modules = [
    { name: 'Overview Dashboard', view: true, create: false, edit: false, del: false },
    { name: 'Orders & Shipments', view: true, create: true, edit: true, del: false },
    { name: 'Products & Lookbooks', view: true, create: true, edit: true, del: true },
    { name: 'Inventory Warehouse', view: true, create: true, edit: true, del: false },
    { name: 'Customer Profiles', view: true, create: true, edit: true, del: false },
    { name: 'Discounts & Perks', view: true, create: true, edit: true, del: true },
    { name: 'Payments & Banking', view: true, create: false, edit: false, del: false },
    { name: 'Staff & Security', view: false, create: false, edit: false, del: false }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Roles & Access Permissions</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Configure role boundaries, permission matrices, and security policies.
          </p>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((r, idx) => (
          <div key={idx} className="bg-white p-5 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-[#FFF4F8] text-[#FF4FA3] flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold text-[#98A0AE]">{r.users} assigned</span>
            </div>
            <h3 className="text-sm font-bold text-[#263550]">{r.name}</h3>
            <p className="text-xs text-[#667085] leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-2xl border border-[#F2F3F5] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#F2F3F5]">
          <h3 className="text-sm font-bold text-[#263550]">Store Manager Permission Matrix</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#F8F8FA] border-b border-[#F2F3F5] text-[11px] font-bold text-[#667085] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">System Module</th>
                <th className="py-3.5 px-3 text-center">View Access</th>
                <th className="py-3.5 px-3 text-center">Create</th>
                <th className="py-3.5 px-3 text-center">Edit / Update</th>
                <th className="py-3.5 px-3 text-center">Delete Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F3F5]">
              {modules.map((m, idx) => (
                <tr key={idx} className="hover:bg-[#FFF4F8]/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#263550]">{m.name}</td>
                  <td className="py-3 px-3 text-center">
                    <input type="checkbox" defaultChecked={m.view} className="accent-[#FF4FA3] cursor-pointer" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input type="checkbox" defaultChecked={m.create} className="accent-[#FF4FA3] cursor-pointer" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input type="checkbox" defaultChecked={m.edit} className="accent-[#FF4FA3] cursor-pointer" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input type="checkbox" defaultChecked={m.del} className="accent-[#FF4FA3] cursor-pointer" />
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
