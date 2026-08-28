'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminProvider, useAdmin } from '@/src/lib/context/AdminContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { GlobalSearchModal } from '../ui/GlobalSearchModal';
import { NotificationPanel } from '../ui/NotificationPanel';
import { HelpDrawer } from '../ui/HelpDrawer';
import { ToastContainer } from '../ui/ToastContainer';
import { LogoLoader } from '../ui/LogoLoader';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isSidebarCollapsed, isLoading, loaderMessage } = useAdmin();

  // If on login or forgot-password page, do not render sidebar/header
  const isAuthPage = pathname === '/admin/login' || pathname === '/admin/forgot-password';

  if (isAuthPage) {
    return (
      <main className="min-h-screen bg-[#FFF4F8]">
        {children}
        <ToastContainer />
        <LogoLoader isVisible={isLoading} message={loaderMessage} />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF4F8] flex flex-col antialiased">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main App Container */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-68'
        }`}
      >
        {/* Top Header */}
        <AdminHeader />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <GlobalSearchModal />
      <NotificationPanel />
      <HelpDrawer />
      <ToastContainer />
      <LogoLoader isVisible={isLoading} message={loaderMessage} />
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminProvider>
  );
}
