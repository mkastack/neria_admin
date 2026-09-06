'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { useAuthUser } from '@/src/lib/firebase/auth';
import { useUserProfile } from '@/src/lib/firebase/users';
import { signOutUser } from '@/src/lib/firebase/auth';
import { ROLE_LABELS, type Role } from '@/src/lib/rbac';
import { QuickAddMenu } from '../ui/QuickAddMenu';
import {
  Menu, Search, Bell, HelpCircle, ExternalLink,
  ChevronRight, User, Settings, Shield, LogOut,
  PanelLeftClose, PanelLeft, Command, Sparkles, X
} from 'lucide-react';

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    isSidebarCollapsed,
    toggleSidebar,
    toggleMobileSidebar,
    setIsSearchOpen,
    setIsNotificationsOpen,
    setIsHelpOpen,
    notifications,
    addToast,
  } = useAdmin();

  const { user } = useAuthUser();
  const { profile } = useUserProfile(user?.uid ?? null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getPageMeta = () => {
    if (pathname === '/admin') return { title: 'Overview Dashboard', breadcrumb: ['Admin', 'Dashboard'] };
    const parts = pathname.split('/').filter(Boolean);
    const title = parts[parts.length - 1]
      ?.replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase()) || 'Dashboard';
    const breadcrumb = parts.map(p => p.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
    return { title, breadcrumb };
  };

  const { title, breadcrumb } = getPageMeta();

  const displayName = profile?.name || user?.displayName || user?.email?.split('@')[0] || 'Admin';
  const displayEmail = user?.email || '';
  const displayAvatar = profile?.photoURL || user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=FFD8EA&color=FF4FA3&size=160`;
  const displayRole: Role = profile?.role || 'super_admin';
  const roleLabel = ROLE_LABELS[displayRole] ?? 'Staff';

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setIsProfileOpen(false);
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

  return (
    <header
      className="sticky top-0 z-20 flex items-center gap-3 px-4 lg:px-6 border-b border-[#F2F3F5] transition-all"
      style={{
        height: '64px',
        background: 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      {/* ── Left: Hamburger / Collapse + Breadcrumb ── */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-[#263550] hover:bg-[#FFF4F8] transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={toggleSidebar}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-xl text-[#98A0AE] hover:text-[#FF4FA3] hover:bg-[#FFF4F8] transition-all cursor-pointer"
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isSidebarCollapsed
            ? <PanelLeft className="w-4.5 h-4.5" />
            : <PanelLeftClose className="w-4.5 h-4.5" />
          }
        </button>

        <div className="hidden sm:block w-px h-6 bg-[#F2F3F5] mx-1" />

        <div className="hidden sm:block">
          <div className="flex items-center gap-1 text-[10px] text-[#B0B8C5] mb-0.5 font-medium">
            {breadcrumb.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-2.5 h-2.5 text-[#DDE1E7]" />}
                <span className={idx === breadcrumb.length - 1 ? 'text-[#667085] font-semibold' : ''}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>
          <h1 className="text-[13px] font-extrabold text-[#263550] tracking-tight leading-none">{title}</h1>
        </div>
      </div>

      {/* ── Center: Premium Search Bar ── */}
      <div className="flex-1 min-w-0 mx-3 lg:mx-4 hidden md:block">
        <button
          onClick={() => setIsSearchOpen(true)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="group w-full flex items-center gap-3 cursor-pointer"
          style={{ outline: 'none' }}
        >
          <div
            className="relative w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300"
            style={{
              background: searchFocused
                ? 'rgba(255,79,163,0.05)'
                : 'rgba(248,248,250,0.9)',
              border: searchFocused
                ? '1.5px solid #FFD8EA'
                : '1.5px solid #EAEDF1',
              boxShadow: searchFocused
                ? '0 0 0 4px rgba(255,79,163,0.08), 0 4px 16px -4px rgba(255,79,163,0.12)'
                : '0 1px 4px rgba(38,53,80,0.05)',
            }}
          >
            <div
              className="flex items-center justify-center shrink-0 transition-all duration-300"
              style={{
                color: searchFocused ? '#FF4FA3' : '#B0B8C5',
              }}
            >
              <Search className="w-4 h-4" />
            </div>

            <div className="flex-1 flex items-center gap-2 min-w-0">
              <span
                className="text-sm transition-colors duration-300 truncate"
                style={{ color: searchFocused ? '#FF4FA3' : '#B0B8C5' }}
              >
                Search orders, products, customers
                <span
                  className="hidden lg:inline transition-opacity duration-300"
                  style={{ opacity: searchFocused ? 0 : 0.7 }}
                >
                  …
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div
                className="hidden lg:flex items-center gap-1 transition-opacity duration-200"
                style={{ opacity: searchFocused ? 0 : 1 }}
              >
                <Sparkles
                  className="w-3.5 h-3.5"
                  style={{ color: '#FF4FA3', opacity: 0.7 }}
                />
                <span className="text-[10px] text-[#C8D0DC] font-semibold">AI Search</span>
              </div>

              <div className="flex items-center gap-0.5">
                <kbd
                  className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-bold transition-all duration-300"
                  style={{
                    background: searchFocused ? 'rgba(255,79,163,0.1)' : '#F2F3F5',
                    color: searchFocused ? '#FF4FA3' : '#98A0AE',
                    border: searchFocused ? '1px solid #FFD8EA' : '1px solid #E4E7EC',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                  }}
                >
                  <Command className="w-2.5 h-2.5" />
                  K
                </kbd>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="md:hidden p-2 rounded-xl text-[#98A0AE] hover:text-[#FF4FA3] hover:bg-[#FFF4F8] transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        <a
          href="https://neria-commerce.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#667085] hover:text-[#FF4FA3] hover:bg-[#FFF4F8] border border-transparent hover:border-[#FFD8EA] transition-all"
        >
          <span>Live Store</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <QuickAddMenu />

        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative p-2 rounded-xl text-[#98A0AE] hover:text-[#FF4FA3] hover:bg-[#FFF4F8] transition-all cursor-pointer group"
          title="Notifications"
        >
          <Bell className="w-5 h-5 transition-transform group-hover:scale-110" />
          {unreadCount > 0 && (
            <>
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4FA3] opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF4FA3]" />
              </span>
              {unreadCount > 1 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#FF4FA3] text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 ring-2 ring-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </>
          )}
        </button>

        <button
          onClick={() => setIsHelpOpen(true)}
          className="p-2 rounded-xl text-[#98A0AE] hover:text-[#FF4FA3] hover:bg-[#FFF4F8] transition-all cursor-pointer group"
        >
          <HelpCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
        </button>

        <div className="w-px h-6 bg-[#F2F3F5] mx-0.5 hidden sm:block" />

        {/* Profile Avatar */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(prev => !prev)}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-2xl hover:bg-[#FFF4F8] border border-transparent hover:border-[#FFD8EA] transition-all cursor-pointer group"
          >
            <div
              className="w-8 h-8 rounded-xl overflow-hidden transition-all duration-300"
              style={{
                boxShadow: isProfileOpen
                  ? '0 0 0 2px #FF4FA3, 0 4px 12px rgba(255,79,163,0.2)'
                  : '0 0 0 2px #FFD8EA',
              }}
            >
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-[#263550] leading-tight">{displayName}</p>
              <p className="text-[10px] text-[#98A0AE] leading-tight">{roleLabel}</p>
            </div>
          </button>

          {isProfileOpen && (
            <div
              className="absolute right-0 mt-2 w-60 rounded-2xl py-2 z-50"
              style={{
                background: 'rgba(255,255,255,0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid #F2F3F5',
                boxShadow: '0 20px 60px -8px rgba(38,53,80,0.16), 0 0 0 1px rgba(255,216,234,0.5)',
                animation: 'profile-drop 0.2s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              <style>{`
                @keyframes profile-drop {
                  from { opacity:0; transform: scale(0.92) translateY(-6px); }
                  to   { opacity:1; transform: scale(1) translateY(0); }
                }
              `}</style>

              <div className="px-4 py-3 border-b border-[#F8F8FA]">
                <div className="flex items-center gap-3">
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#FFD8EA]"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#263550] truncate">{displayName}</p>
                    <p className="text-xs text-[#98A0AE] truncate">{displayEmail}</p>
                    <span className="inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.5 rounded-full bg-[#FFF4F8] text-[10px] font-bold text-[#FF4FA3]">
                      ✦ {roleLabel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-2 space-y-0.5">
                <Link
                  href="/admin/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#475467] hover:bg-[#FFF4F8] hover:text-[#FF4FA3] transition-colors"
                >
                  <User className="w-4 h-4" /> Account Profile
                </Link>
                <Link
                  href="/admin/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#475467] hover:bg-[#FFF4F8] hover:text-[#FF4FA3] transition-colors"
                >
                  <Settings className="w-4 h-4" /> Store Preferences
                </Link>
                {(displayRole === 'super_admin' || displayRole === 'store_manager') && (
                  <Link
                    href="/admin/roles"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#475467] hover:bg-[#FFF4F8] hover:text-[#FF4FA3] transition-colors"
                  >
                    <Shield className="w-4 h-4" /> Roles & Security
                  </Link>
                )}
              </div>

              <div className="p-2 pt-1 border-t border-[#F8F8FA]">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#B42318] hover:bg-[#FEF3F2] transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
