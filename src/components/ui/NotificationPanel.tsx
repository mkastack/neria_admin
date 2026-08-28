'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { Drawer } from './Drawer';
import { ShoppingBag, AlertTriangle, Star, DollarSign, RefreshCw, CheckCheck } from 'lucide-react';
import Link from 'next/link';

export function NotificationPanel() {
  const { isNotificationsOpen, setIsNotificationsOpen, notifications, markNotificationAsRead, markAllNotificationsRead } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Orders', 'Inventory', 'Reviews', 'Payments'];

  const filteredNotifications = selectedCategory === 'All'
    ? notifications
    : notifications.filter(n => n.category === selectedCategory);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Orders':
        return <ShoppingBag className="w-4 h-4 text-[#027A48]" />;
      case 'Inventory':
        return <AlertTriangle className="w-4 h-4 text-[#B54708]" />;
      case 'Reviews':
        return <Star className="w-4 h-4 text-[#FF4FA3]" />;
      case 'Payments':
        return <DollarSign className="w-4 h-4 text-[#5925DC]" />;
      default:
        return <RefreshCw className="w-4 h-4 text-[#026AA2]" />;
    }
  };

  return (
    <Drawer
      isOpen={isNotificationsOpen}
      onClose={() => setIsNotificationsOpen(false)}
      title="Notifications Center"
      subtitle={`${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`}
      width="md"
      footer={
        <div className="flex items-center justify-between">
          <button
            onClick={markAllNotificationsRead}
            className="text-xs font-semibold text-[#FF4FA3] hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
          <Link
            href="/admin/notifications"
            onClick={() => setIsNotificationsOpen(false)}
            className="text-xs font-semibold text-[#263550] hover:text-[#FF4FA3] transition-colors"
          >
            View All Notifications →
          </Link>
        </div>
      }
    >
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 border-b border-[#F2F3F5]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 text-xs rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#FF4FA3] text-white shadow-xs'
                : 'bg-[#F8F8FA] text-[#667085] hover:bg-[#FFF4F8] hover:text-[#FF4FA3]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-10 text-[#98A0AE] text-sm">
            No notifications in this category.
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                n.read
                  ? 'bg-white border-[#F2F3F5] opacity-75 hover:opacity-100'
                  : 'bg-[#FFF4F8]/60 border-[#FFD8EA] shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white shadow-xs shrink-0">
                  {getCategoryIcon(n.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-semibold ${n.read ? 'text-[#263550]' : 'text-[#FF4FA3]'}`}>
                      {n.title}
                    </h4>
                    <span className="text-[11px] text-[#98A0AE]">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#667085] mt-1 leading-relaxed">{n.description}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Drawer>
  );
}
