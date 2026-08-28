'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Bell, CheckCheck, ShoppingBag, AlertTriangle, Star, DollarSign, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, setNotifications, markNotificationAsRead, markAllNotificationsRead, addToast } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = selectedCategory === 'All'
    ? notifications
    : notifications.filter(n => n.category === selectedCategory);

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    addToast({
      type: 'info',
      title: 'Notification Removed',
      description: 'Notification dismissed.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Notification Center</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            System broadcasts, inventory threshold warnings, and real-time checkout alerts.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="neria-btn-secondary px-3.5 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <CheckCheck className="w-4 h-4 text-[#FF4FA3]" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-[#F2F3F5] shadow-xs flex items-center gap-2 overflow-x-auto">
        {['All', 'Orders', 'Inventory', 'Reviews', 'Payments'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#FF4FA3] text-white shadow-xs'
                : 'text-[#667085] hover:bg-[#F8F8FA]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((n) => (
          <div
            key={n.id}
            onClick={() => markNotificationAsRead(n.id)}
            className={`p-4 bg-white rounded-2xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${
              n.read ? 'border-[#F2F3F5]' : 'border-[#FFD8EA] bg-[#FFF4F8]/40 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#FFF4F8] text-[#FF4FA3] flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#263550] truncate">{n.title}</h4>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-[#FF4FA3]" />
                  )}
                </div>
                <p className="text-xs text-[#667085] mt-0.5">{n.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-[#98A0AE]">{n.timestamp}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(n.id);
                }}
                className="p-1.5 rounded-lg text-[#98A0AE] hover:text-[#B42318] hover:bg-[#FEF3F2] transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
