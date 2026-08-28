'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatCard } from '@/src/components/ui/StatCard';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Modal } from '@/src/components/ui/Modal';
import {
  Users, UserCheck, Heart, DollarSign, Search,
  Plus, Mail, Phone, ArrowRight, Eye, Tag
} from 'lucide-react';
import { Customer } from '@/src/lib/types';

export default function CustomersPage() {
  const { customers, setCustomers, addToast } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Customer Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Accra');

  const segments = ['All', 'VIP', 'Returning', 'New', 'At Risk'];

  const filteredCustomers = customers.filter((c) => {
    if (selectedSegment !== 'All' && c.segment !== selectedSegment) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchEmail = c.email.toLowerCase().includes(q);
      const matchPhone = c.phone.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone) return false;
    }
    return true;
  });

  const vipCount = customers.filter(c => c.segment === 'VIP').length;
  const newCount = customers.filter(c => c.segment === 'New').length;
  const returningCount = customers.filter(c => c.segment === 'Returning').length;
  const avgSpend = Math.round(customers.reduce((acc, c) => acc + c.totalSpent, 0) / (customers.length || 1));

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name,
      email: email || 'customer@neriacollective.com',
      phone: phone || '+233 24 000 0000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      ordersCount: 0,
      totalSpent: 0,
      lastOrderDate: new Date().toISOString(),
      segment: 'New',
      address: 'East Legon',
      city,
      region: 'Greater Accra',
      notes: [],
      tags: ['New Customer'],
      joinedDate: new Date().toISOString(),
      wishlistCount: 0
    };

    setCustomers([newCust, ...customers]);
    setIsAddModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    addToast({
      type: 'success',
      title: 'Customer Added ♡',
      description: `${name} has been enrolled into Neria VIP records.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Customer Profiles</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Manage your fashion community, VIP clients, purchase history and loyalty segments.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="neria-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value="1,280"
          change="+14.2%"
          isPositive={true}
          theme="pink"
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="VIP Neria Girls"
          value={`${vipCount} VIPs`}
          change="Top Spenders"
          isPositive={true}
          theme="cream"
          icon={<Heart className="w-5 h-5" />}
        />
        <StatCard
          title="Returning Shoppers"
          value={`${returningCount} Active`}
          change="48% Retention"
          isPositive={true}
          theme="blue"
          icon={<UserCheck className="w-5 h-5" />}
        />
        <StatCard
          title="Average Lifetime Value"
          value={`GH₵ ${avgSpend.toLocaleString()}`}
          change="+8.4% AOV"
          isPositive={true}
          theme="white"
          icon={<DollarSign className="w-5 h-5" />}
        />
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#F2F3F5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#98A0AE] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-9.5 pr-4 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] text-xs text-[#263550] outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {segments.map((seg) => (
            <button
              key={seg}
              onClick={() => setSelectedSegment(seg)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                selectedSegment === seg
                  ? 'bg-[#FF4FA3] text-white shadow-xs'
                  : 'bg-[#F8F8FA] text-[#667085] hover:bg-[#FFF4F8] hover:text-[#FF4FA3]'
              }`}
            >
              {seg}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl border border-[#F2F3F5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F8FA] border-b border-[#F2F3F5] text-[11px] font-bold text-[#667085] uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Customer Name</th>
                <th className="py-4 px-3">Contact</th>
                <th className="py-4 px-3">Location</th>
                <th className="py-4 px-3">Segment</th>
                <th className="py-4 px-3">Total Orders</th>
                <th className="py-4 px-3">Lifetime Spent</th>
                <th className="py-4 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F3F5] text-xs">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-[#FFF4F8]/40 transition-colors group">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={cust.avatar}
                        alt={cust.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-[#FFD8EA] shrink-0"
                      />
                      <div>
                        <Link
                          href={`/admin/customers/${cust.id}`}
                          className="font-bold text-[#263550] group-hover:text-[#FF4FA3] transition-colors"
                        >
                          {cust.name}
                        </Link>
                        <p className="text-[11px] text-[#98A0AE]">Member since {new Date(cust.joinedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-[#667085]">
                    <p className="text-xs text-[#263550] font-medium">{cust.email}</p>
                    <p className="text-[11px] text-[#98A0AE]">{cust.phone}</p>
                  </td>
                  <td className="py-3.5 px-3 text-[#667085]">{cust.city}, {cust.region}</td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={cust.segment} />
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-[#263550]">
                    {cust.ordersCount} orders
                  </td>
                  <td className="py-3.5 px-3 font-bold text-[#FF4FA3]">
                    GH₵ {cust.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/customers/${cust.id}`}
                      className="p-2 rounded-xl text-[#98A0AE] hover:text-[#FF4FA3] hover:bg-[#FFF4F8] transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Customer Profile"
        subtitle="Manually register a customer into Neria operations"
      >
        <form onSubmit={handleAddCustomer} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Customer Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Afia Boateng"
              className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="afia@gmail.com"
                className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+233 24..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">City / Region</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Accra, Greater Accra"
              className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#F2F3F5] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#DDE1E7] text-xs font-semibold text-[#667085]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="neria-btn-primary px-5 py-2 text-xs font-semibold cursor-pointer"
            >
              Add Customer ♡
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
