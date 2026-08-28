'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Modal } from '@/src/components/ui/Modal';
import { EmptyState } from '@/src/components/ui/EmptyState';
import {
  Search, Filter, Plus, Download, Printer, CheckCheck,
  Eye, PackageCheck, ArrowUpDown, ChevronLeft, ChevronRight,
  SlidersHorizontal, X, DollarSign, Calendar
} from 'lucide-react';
import { FulfillmentStatus, Order } from '@/src/lib/types';

export default function OrdersPage() {
  const { orders, setOrders, fulfillOrder, addToast } = useAdmin();
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Filter state for manual modal
  const [newOrderCustomer, setNewOrderCustomer] = useState('');
  const [newOrderEmail, setNewOrderEmail] = useState('');
  const [newOrderPhone, setNewOrderPhone] = useState('');
  const [newOrderCity, setNewOrderCity] = useState('Accra');
  const [newOrderTotal, setNewOrderTotal] = useState('420');

  const tabs = [
    { id: 'All', label: 'All Orders', count: orders.length },
    { id: 'Unfulfilled', label: 'Unfulfilled', count: orders.filter(o => o.fulfillmentStatus === 'Unfulfilled').length },
    { id: 'Processing', label: 'Processing', count: orders.filter(o => o.fulfillmentStatus === 'Processing').length },
    { id: 'Shipped', label: 'Shipped', count: orders.filter(o => o.fulfillmentStatus === 'Shipped').length },
    { id: 'Delivered', label: 'Delivered', count: orders.filter(o => o.fulfillmentStatus === 'Delivered').length },
    { id: 'Returned', label: 'Returned', count: orders.filter(o => o.fulfillmentStatus === 'Returned').length }
  ];

  // Filtering
  const filteredOrders = orders.filter((order) => {
    if (activeTab !== 'All' && order.fulfillmentStatus !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.orderNumber.toLowerCase().includes(q);
      const matchCust = order.customer.name.toLowerCase().includes(q);
      const matchEmail = order.customer.email.toLowerCase().includes(q);
      const matchPhone = order.customer.phone.toLowerCase().includes(q);
      if (!matchId && !matchCust && !matchEmail && !matchPhone) return false;
    }
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map(o => o.id));
    }
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkFulfill = () => {
    selectedOrderIds.forEach(id => fulfillOrder(id));
    setSelectedOrderIds([]);
  };

  const handleExportCSV = () => {
    addToast({
      type: 'info',
      title: 'Orders Exported',
      description: `${filteredOrders.length} orders exported as CSV format.`
    });
  };

  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderCustomer) return;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `NER-${Math.floor(2000 + Math.random() * 900)}`,
      customer: {
        id: `cust-${Date.now()}`,
        name: newOrderCustomer,
        email: newOrderEmail || 'customer@neriacollective.com',
        phone: newOrderPhone || '+233 24 000 0000',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80'
      },
      createdAt: new Date().toISOString(),
      items: [
        {
          id: `item-${Date.now()}`,
          productId: 'prod-1',
          name: 'Pink Bunny Oversized Hoodie',
          variant: 'Baby Pink / M',
          size: 'M',
          color: 'Baby Pink',
          sku: 'NER-HOD-001-M',
          price: parseFloat(newOrderTotal) || 420,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200&q=80',
          total: parseFloat(newOrderTotal) || 420
        }
      ],
      paymentStatus: 'Paid',
      fulfillmentStatus: 'Processing',
      paymentMethod: 'MTN Mobile Money',
      deliveryMethod: 'Standard Delivery',
      deliveryAddress: {
        street: 'East Legon Showroom Pickup',
        city: newOrderCity,
        region: 'Greater Accra',
        country: 'Ghana'
      },
      subtotal: parseFloat(newOrderTotal) || 420,
      discount: 0,
      shippingFee: 25,
      tax: 0,
      total: (parseFloat(newOrderTotal) || 420) + 25,
      fraudRisk: 'Low',
      tags: ['Manual Order', 'Showroom'],
      timeline: [
        { id: `t-${Date.now()}`, title: 'Manual Order Created', time: 'Just now', date: 'Today', completed: true }
      ]
    };

    setOrders([newOrder, ...orders]);
    setIsCreateModalOpen(false);
    setNewOrderCustomer('');
    addToast({
      type: 'success',
      title: 'Order Created ♡',
      description: `Manual order #${newOrder.orderNumber} placed for ${newOrderCustomer}.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Orders Management</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Track and fulfill customer purchases across Ghana and worldwide.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="neria-btn-secondary px-3.5 py-2 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#667085]" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="neria-btn-primary px-3.5 py-2 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Order</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#F2F3F5] shadow-xs space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#F2F3F5]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[#FFF4F8] text-[#FF4FA3] border border-[#FFD8EA] shadow-2xs'
                  : 'text-[#667085] hover:bg-[#F8F8FA] hover:text-[#263550]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab.id ? 'bg-[#FF4FA3] text-white' : 'bg-[#F2F3F5] text-[#667085]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#98A0AE] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, name, email, phone..."
              className="w-full pl-9.5 pr-4 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] text-xs text-[#263550] placeholder-[#98A0AE] focus:bg-white focus:border-[#FFD8EA] outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#FF4FA3] font-semibold hover:underline"
              >
                Clear Search
              </button>
            )}
            <span className="text-xs text-[#98A0AE]">
              Showing {filteredOrders.length} of {orders.length} orders
            </span>
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedOrderIds.length > 0 && (
        <div className="sticky top-20 z-10 p-3.5 bg-[#263550] text-white rounded-2xl shadow-xl flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded-full bg-[#FF4FA3] text-white font-bold text-xs">
              {selectedOrderIds.length}
            </span>
            <span className="text-xs font-semibold">orders selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkFulfill}
              className="px-3 py-1.5 rounded-xl bg-[#12B76A] hover:bg-[#027A48] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark Fulfilled</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setSelectedOrderIds([])}
              className="p-1.5 rounded-lg text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Orders Data Table */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          title="No Orders Found"
          description="When customers make purchases on your Neria storefront, their order details will appear right here."
          actionText="Create Manual Order"
          onAction={() => setIsCreateModalOpen(true)}
          bunnyMood="thinking"
        />
      ) : (
        <div className="bg-white rounded-2xl border border-[#F2F3F5] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8F8FA] border-b border-[#F2F3F5] text-[11px] font-bold text-[#667085] uppercase tracking-wider">
                <tr>
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded accent-[#FF4FA3] cursor-pointer"
                    />
                  </th>
                  <th className="py-4 px-3">Order ID</th>
                  <th className="py-4 px-3">Customer</th>
                  <th className="py-4 px-3">Date</th>
                  <th className="py-4 px-3">Items</th>
                  <th className="py-4 px-3">Payment</th>
                  <th className="py-4 px-3">Fulfillment</th>
                  <th className="py-4 px-3">Delivery Zone</th>
                  <th className="py-4 px-3">Total</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F3F5] text-xs">
                {filteredOrders.map((order) => {
                  const isSelected = selectedOrderIds.includes(order.id);
                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-[#FFF4F8]/40 transition-colors ${isSelected ? 'bg-[#FFF4F8]/60' : ''}`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOrder(order.id)}
                          className="rounded accent-[#FF4FA3] cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-3 font-bold text-[#263550]">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="hover:text-[#FF4FA3] transition-colors"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={order.customer.avatar}
                            alt={order.customer.name}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-[#263550] truncate">{order.customer.name}</p>
                            <p className="text-[11px] text-[#98A0AE] truncate">{order.customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-[#667085] whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="py-3.5 px-3 text-[#667085]">
                        <span className="font-medium">{order.items.length}</span> item{order.items.length > 1 ? 's' : ''}
                      </td>
                      <td className="py-3.5 px-3">
                        <StatusBadge status={order.paymentStatus} />
                      </td>
                      <td className="py-3.5 px-3">
                        <StatusBadge status={order.fulfillmentStatus} />
                      </td>
                      <td className="py-3.5 px-3 text-[#667085]">
                        <span className="truncate block max-w-[120px]">{order.deliveryAddress.city}</span>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-[#263550]">
                        GH₵ {order.total}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {order.fulfillmentStatus !== 'Delivered' && (
                            <button
                              onClick={() => fulfillOrder(order.id)}
                              title="Mark Fulfilled"
                              className="p-1.5 rounded-lg bg-[#ECFDF3] text-[#027A48] hover:bg-[#027A48] hover:text-white transition-colors cursor-pointer"
                            >
                              <PackageCheck className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="p-1.5 rounded-lg text-[#98A0AE] hover:text-[#263550] hover:bg-[#F2F3F5] transition-colors"
                            title="View Order Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Order Creation Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Manual Order"
        subtitle="Place an order on behalf of a customer or showroom walk-in"
      >
        <form onSubmit={handleCreateManualOrder} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#263550] mb-1">Customer Full Name *</label>
            <input
              type="text"
              required
              value={newOrderCustomer}
              onChange={(e) => setNewOrderCustomer(e.target.value)}
              placeholder="e.g. Nana Akua Mensah"
              className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] focus:border-[#FFD8EA] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Email Address</label>
              <input
                type="email"
                value={newOrderEmail}
                onChange={(e) => setNewOrderEmail(e.target.value)}
                placeholder="customer@gmail.com"
                className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Phone (MoMo / WhatsApp)</label>
              <input
                type="tel"
                value={newOrderPhone}
                onChange={(e) => setNewOrderPhone(e.target.value)}
                placeholder="+233 24..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">City / Region</label>
              <select
                value={newOrderCity}
                onChange={(e) => setNewOrderCity(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] bg-white outline-none"
              >
                <option value="Accra">Accra Central</option>
                <option value="East Legon">East Legon / Airport</option>
                <option value="Kumasi">Kumasi (Ashanti)</option>
                <option value="Takoradi">Takoradi</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Order Amount (GH₵)</label>
              <input
                type="number"
                value={newOrderTotal}
                onChange={(e) => setNewOrderTotal(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#F2F3F5] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#DDE1E7] text-xs font-semibold text-[#667085] hover:bg-[#F8F8FA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="neria-btn-primary px-5 py-2 text-xs font-semibold cursor-pointer"
            >
              Create Order ♡
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
