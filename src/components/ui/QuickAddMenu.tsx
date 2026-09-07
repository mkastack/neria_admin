'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Plus, ShoppingBag, Tag, Megaphone, UserPlus, Image as ImageIcon } from 'lucide-react';

export function QuickAddMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const items = [
    { label: 'Add Product', icon: ShoppingBag, href: '/admin/products/new', desc: 'Create a new fashion SKU or apparel' },
    { label: 'Create Discount', icon: Tag, href: '/admin/discounts', desc: 'Set up coupon codes or sales' },
    { label: 'Create Campaign', icon: Megaphone, href: '/admin/campaigns', desc: 'Launch email or promo banners' },
    { label: 'Add Staff Member', icon: UserPlus, href: '/admin/staff', desc: 'Invite manager or team' },
    { label: 'Add Store Banner', icon: ImageIcon, href: '/admin/banners', desc: 'Update storefront header announcements' }
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="neria-btn-primary px-3.5 py-2 text-xs sm:text-sm inline-flex items-center gap-1.5 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span className="font-medium hidden sm:inline">Add New</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#F2F3F5] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3.5 py-2 border-b border-[#F2F3F5]">
            <p className="text-xs font-bold text-[#667085] uppercase tracking-wider">Quick Actions</p>
          </div>

          <div className="p-1.5 flex flex-col gap-0.5">
            {items.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#FFF4F8] transition-colors group"
              >
                <div className="p-2 rounded-lg bg-[#FFF4F8] text-[#FF4FA3] group-hover:bg-[#FF4FA3] group-hover:text-white transition-colors">
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#263550] group-hover:text-[#FF4FA3] transition-colors">
                    {item.label}
                  </h4>
                  <p className="text-xs text-[#98A0AE]">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
