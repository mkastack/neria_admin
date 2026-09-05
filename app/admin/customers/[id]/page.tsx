'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import {
  ChevronLeft, Mail, Phone, MapPin, Heart, ShoppingBag,
  DollarSign, Calendar, Tag, Plus, Send, Clock
} from 'lucide-react';

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { customers, setCustomers, orders, addToast } = useAdmin();

  const customer = customers.find(c => c.id === resolvedParams.id) || customers[0];
  const customerOrders = orders.filter(o => o.customer.email === customer.email || o.customer.id === customer.id);

  const [notes, setNotes] = useState(customer.notes || []);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const noteItem = {
      id: `n-${Date.now()}`,
      text: newNote.trim(),
      author: 'Neria Admin',
      timestamp: new Date().toISOString()
    };

    setNotes([noteItem, ...notes]);
    setNewNote('');
    addToast({
      type: 'success',
      title: 'Customer Note Added',
      description: 'Note attached to client profile.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/customers"
          className="p-2 rounded-xl bg-white border border-[#DDE1E7] text-[#667085] hover:text-[#FF4FA3] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-[#263550]">{customer.name}</h1>
            <StatusBadge status={customer.segment} />
          </div>
          <p className="text-xs text-[#98A0AE] mt-0.5">
            Member since {new Date(customer.joinedDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={customer.avatar}
            alt={customer.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-[#FFD8EA]"
          />
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#263550]">{customer.name}</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#667085]">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#FF4FA3]" /> {customer.email}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#FF4FA3]" /> {customer.phone}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#FF4FA3]" /> {customer.address}, {customer.city}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center border-t md:border-t-0 md:border-l border-[#F2F3F5] pt-4 md:pt-0 md:pl-6">
          <div>
            <span className="text-[11px] text-[#98A0AE] font-semibold uppercase">Lifetime Spent</span>
            <p className="text-lg font-extrabold text-[#FF4FA3]">$ {customer.totalSpent.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-[11px] text-[#98A0AE] font-semibold uppercase">Completed Orders</span>
            <p className="text-lg font-bold text-[#263550]">{customer.ordersCount}</p>
          </div>
          <div>
            <span className="text-[11px] text-[#98A0AE] font-semibold uppercase">Wishlist Items</span>
            <p className="text-lg font-bold text-[#026AA2]">{customer.wishlistCount}</p>
          </div>
        </div>
      </div>

      {/* 2-Column Details: Left (Orders History) / Right (Staff Notes & Preferences) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders History */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#263550]">Customer Order History</h3>

          {customerOrders.length === 0 ? (
            <p className="text-xs text-[#98A0AE] py-6 text-center">No previous orders on record.</p>
          ) : (
            <div className="divide-y divide-[#F8F8FA]">
              {customerOrders.map((ord) => (
                <div key={ord.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div>
                    <Link
                      href={`/admin/orders/${ord.id}`}
                      className="text-sm font-bold text-[#263550] hover:text-[#FF4FA3] transition-colors"
                    >
                      {ord.orderNumber}
                    </Link>
                    <p className="text-xs text-[#98A0AE]">
                      {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} item{ord.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={ord.paymentStatus} />
                    <StatusBadge status={ord.fulfillmentStatus} />
                    <span className="text-sm font-bold text-[#263550]">$ {ord.total}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Staff Notes & Tags */}
        <div className="space-y-6">
          {/* Notes Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#263550]">Operational Staff Notes</h3>

            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={2}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add note (e.g. loves bows, prefers size M)..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
              />
              <button
                type="submit"
                className="w-full neria-btn-primary py-2 text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save Note</span>
              </button>
            </form>

            <div className="space-y-2.5 pt-2 border-t border-[#F2F3F5]">
              {notes.map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-[#FFF4F8] border border-[#FFD8EA] text-xs text-[#263550]">
                  <p className="leading-relaxed">{n.text}</p>
                  <span className="text-[10px] text-[#98A0AE] mt-1 block">
                    By {n.author} • {new Date(n.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
