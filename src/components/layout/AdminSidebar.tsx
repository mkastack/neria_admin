'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { useAuthUser } from '@/src/lib/firebase/auth';
import { useUserProfile } from '@/src/lib/firebase/users';
import { signOutUser } from '@/src/lib/firebase/auth';
import { can, type Action, NAV_PERMISSIONS } from '@/src/lib/rbac';
import { BunnyMascot } from '../ui/BunnyMascot';
import {
  LayoutDashboard, ShoppingBag, ShoppingCart, Layers, Boxes, Users,
  Tag, Gift, CreditCard, ArrowLeftRight, RotateCcw, Truck, MapPin,
  Undo2, Megaphone, Sparkles, Image as ImageIcon, Star, HeartHandshake,
  Mail, LayoutTemplate, Film, FileText, Menu as MenuIcon, BarChart3,
  FileSpreadsheet, Landmark, ShieldCheck, ShieldAlert, History, Bell,
  Settings, ChevronLeft, ChevronRight, X, LogOut
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  action?: Action;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    isSidebarCollapsed,
    toggleSidebar,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    orders,
    notifications,
    products,
    addToast,
  } = useAdmin();

  const { user } = useAuthUser();
  const { profile } = useUserProfile(user?.uid ?? null);
  const role = profile?.role ?? null;

  const unfulfilledOrders = orders.filter(o => o.fulfillmentStatus === 'Unfulfilled' || o.fulfillmentStatus === 'Processing').length;
  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Admin';
  const displayAvatar =
    profile?.photoURL ||
    user?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=FFD8EA&color=FF4FA3&size=160`;

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setIsMobileSidebarOpen(false);
      router.push('/admin/login');
      addToast({
        type: 'info',
        title: 'Signed out',
        description: 'You have been signed out of the admin console.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Sign-out failed',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    }
  };

  // Each nav item is gated by an RBAC action. Items the role can't
  // perform are *hidden* (not greyed out) so the sidebar stays focused
  // on what the user can actually do.
  const navGroups: NavGroup[] = [
    {
      label: 'Overview',
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, action: 'dashboard:read' },
      ],
    },
    {
      label: 'Website & Storefront',
      items: [
        { name: 'Overview', href: '/admin/website', icon: Sparkles, action: 'cms:read' },
        { name: 'Live Visual Editor', href: '/admin/website/editor', icon: Sparkles, action: 'cms:publish', badge: 'Editor' },
        { name: 'Announcement Bar', href: '/admin/website/announcements', icon: Bell, action: 'cms:publish' },
        { name: 'Promotional Popup', href: '/admin/website/popups', icon: Megaphone, action: 'cms:publish' },
      ],
    },
    {
      label: 'Commerce',
      items: [
        { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, badge: unfulfilledOrders > 0 ? unfulfilledOrders : undefined, action: 'orders:read' },
        { name: 'Products', href: '/admin/products', icon: ShoppingBag, action: 'products:read' },
        { name: 'Collections', href: '/admin/collections', icon: Layers, action: 'collections:read' },
        { name: 'Inventory', href: '/admin/inventory', icon: Boxes, badge: lowStockCount > 0 ? lowStockCount : undefined, action: 'products:read' },
        { name: 'Customers', href: '/admin/customers', icon: Users, action: 'customers:read' },
        { name: 'Discounts', href: '/admin/discounts', icon: Tag, action: 'discounts:read' },
        { name: 'Gift Cards', href: '/admin/gift-cards', icon: Gift, action: 'discounts:read' },
      ],
    },
    {
      label: 'Operations',
      items: [
        { name: 'Payments', href: '/admin/payments', icon: CreditCard, action: 'finance:read' },
        { name: 'Transactions', href: '/admin/transactions', icon: ArrowLeftRight, action: 'finance:read' },
        { name: 'Refunds', href: '/admin/refunds', icon: RotateCcw, action: 'orders:write' },
        { name: 'Shipping', href: '/admin/shipping', icon: Truck, action: 'shipping:write' },
        { name: 'Delivery Dispatch', href: '/admin/delivery', icon: MapPin, action: 'orders:read' },
        { name: 'Returns', href: '/admin/returns', icon: Undo2, action: 'orders:write' },
      ],
    },
    {
      label: 'Marketing & Community',
      items: [
        { name: 'Campaigns', href: '/admin/campaigns', icon: Megaphone, action: 'campaigns:write' },
        { name: 'Promotions', href: '/admin/promotions', icon: Sparkles, action: 'campaigns:write' },
        { name: 'Store Banners', href: '/admin/banners', icon: ImageIcon, action: 'cms:publish' },
        { name: 'Customer Reviews', href: '/admin/reviews', icon: Star, action: 'reviews:moderate' },
        { name: 'Neria Girls (UGC)', href: '/admin/community', icon: HeartHandshake, action: 'reviews:moderate' },
        { name: 'Newsletter Club', href: '/admin/newsletter', icon: Mail, action: 'newsletter:write' },
      ],
    },
    {
      label: 'Business Intelligence',
      items: [
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, action: 'analytics:read' },
        { name: 'Reports & Exports', href: '/admin/reports', icon: FileSpreadsheet, action: 'reports:read' },
        { name: 'Finance & P&L', href: '/admin/finance', icon: Landmark, action: 'finance:read' },
      ],
    },
    {
      label: 'Administration',
      items: [
        { name: 'Staff Management', href: '/admin/staff', icon: ShieldCheck, action: 'staff:read' },
        { name: 'Roles & Permissions', href: '/admin/roles', icon: ShieldAlert, action: 'roles:write' },
        { name: 'Activity Audit Logs', href: '/admin/activity', icon: History, action: 'activity:read' },
        { name: 'Notifications', href: '/admin/notifications', icon: Bell, badge: unreadNotifs > 0 ? unreadNotifs : undefined, action: 'dashboard:read' },
        { name: 'Store Settings', href: '/admin/settings', icon: Settings, action: 'settings:write' },
      ],
    },
  ];

  // Filter each group: drop items the current role can't access. If
  // *every* item in a group is hidden, drop the group entirely so the
  // sidebar doesn't render an empty section header.
  const visibleGroups = navGroups
    .map((g) => ({
      ...g,
      items: g.items.filter(
        (i) => !i.action || can(role, i.action),
      ),
    }))
    .filter((g) => g.items.length > 0);

  // Belt-and-braces: if a user navigates directly to a page they
  // can't access, send them back to the dashboard.
  React.useEffect(() => {
    if (!role) return;
    const required = NAV_PERMISSIONS[pathname];
    if (required && !can(role, required)) {
      addToast({
        type: 'warning',
        title: "You don't have access to that page",
        description: 'Your role does not include this section.',
      });
      router.replace('/admin');
    }
  }, [pathname, role, router, addToast]);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Brand Header */}
      <div className={`flex items-center justify-between p-4 border-b border-[#F2F3F5] h-18 ${isSidebarCollapsed ? 'px-3 justify-center' : 'px-5'}`}>
        <Link href="/admin" className="flex items-center gap-2.5 overflow-hidden group">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <BunnyMascot size="sm" mood="happy" />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col leading-tight overflow-hidden">
              <span className="font-extrabold tracking-wider text-sm text-[#263550] uppercase font-sans">
                Neria <span className="text-[#FF4FA3]">Collective</span>
              </span>
              <span className="text-[10px] font-semibold text-[#98A0AE] tracking-widest uppercase">
                Admin Console
              </span>
            </div>
          )}
        </Link>

        {!isSidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            title="Collapse Sidebar"
            className="hidden lg:flex p-1.5 rounded-xl text-[#98A0AE] hover:text-[#263550] hover:bg-[#FFF4F8] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {visibleGroups.map((group, gIdx) => (
          <div key={gIdx}>
            {!isSidebarCollapsed && (
              <h4 className="px-3 mb-1.5 text-[11px] font-bold tracking-wider text-[#98A0AE] uppercase">
                {group.label}
              </h4>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <div key={item.href} className="relative group/nav">
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 relative ${
                        isActive
                          ? 'bg-[#FFF4F8] text-[#263550] font-semibold shadow-xs'
                          : 'text-[#475467] hover:bg-[#FFF4F8]/60 hover:text-[#263550]'
                      } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#FF4FA3] rounded-r-full" />
                      )}

                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-[#FF4FA3]' : 'text-[#667085] group-hover/nav:text-[#FF4FA3]'
                        }`}
                      />

                      {!isSidebarCollapsed && (
                        <span className="flex-1 truncate">{item.name}</span>
                      )}

                      {!isSidebarCollapsed && item.badge !== undefined && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#FF4FA3] text-white shadow-xs">
                          {item.badge}
                        </span>
                      )}
                    </Link>

                    {isSidebarCollapsed && (
                      <div className="fixed left-20 ml-2 hidden group-hover/nav:flex items-center px-2.5 py-1.5 bg-[#263550] text-white text-xs font-medium rounded-lg shadow-xl z-50 whitespace-nowrap animate-in fade-in">
                        {item.name}
                        {item.badge !== undefined && (
                          <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#FF4FA3] text-white">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer with Admin Profile & Expand Toggle */}
      <div className="p-3 border-t border-[#F2F3F5] bg-[#F8F8FA]/60">
        {isSidebarCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={toggleSidebar}
              title="Expand Sidebar"
              className="p-2 rounded-xl text-[#98A0AE] hover:text-[#FF4FA3] hover:bg-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full ring-2 ring-[#FFD8EA] overflow-hidden">
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-2 rounded-2xl bg-white border border-[#F2F3F5] shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full ring-2 ring-[#FFD8EA] overflow-hidden shrink-0">
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-[#263550] truncate">{displayName}</h5>
                <p className="text-[10px] text-[#98A0AE] font-medium truncate">
                  {role ? role.replace('_', ' ') : 'staff'}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1.5 rounded-lg text-[#98A0AE] hover:text-[#FF4FA3] hover:bg-[#FFF4F8] transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed inset-y-0 left-0 z-30 border-r border-[#F2F3F5] bg-white transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-20' : 'w-68'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Navigation */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-[#101828]/50 backdrop-blur-sm animate-in fade-in"
          />

          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-300">
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute top-4 right-3 p-2 rounded-xl text-[#98A0AE] hover:text-[#263550] bg-[#F8F8FA]"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
