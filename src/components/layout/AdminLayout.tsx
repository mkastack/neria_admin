'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminProvider, useAdmin } from '@/src/lib/context/AdminContext';
import { StorefrontCmsProvider } from '@/src/lib/context/StorefrontCmsContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { GlobalSearchModal } from '../ui/GlobalSearchModal';
import { NotificationPanel } from '../ui/NotificationPanel';
import { HelpDrawer } from '../ui/HelpDrawer';
import { ToastContainer } from '../ui/ToastContainer';
import { LogoLoader } from '../ui/LogoLoader';
import { useAuthUser, useIsAdmin } from '@/src/lib/firebase/auth';
import { Lock } from 'lucide-react';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isSidebarCollapsed, isLoading, loaderMessage, currentRole } = useAdmin();
  const { user, loading: authLoading } = useAuthUser();
  const { isAdmin, loading: claimLoading } = useIsAdmin();

  // Allow access if user holds admin custom claim OR has an admin/staff role in Firestore
  const isAuthorized = isAdmin || (!!currentRole && currentRole !== 'customer');

  // Auth & admin-claim guard for the entire /admin section.
  // - /admin/login and /admin/forgot-password are public.
  // - Everything else requires a signed-in user with admin or staff access.
  const isAuthPage =
    pathname === '/admin/login' || pathname === '/admin/forgot-password';
  const isImmersiveMode =
    pathname === '/admin/website/editor' || pathname?.startsWith('/preview');

  useEffect(() => {
    if (isAuthPage) return;
    if (authLoading || claimLoading) return;
    if (!user) {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname || '/admin')}`);
      return;
    }
  }, [isAuthPage, authLoading, claimLoading, user, isAuthorized, router, pathname]);

  if (!isAuthPage && (authLoading || (claimLoading && !isAuthorized))) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FFF4F8]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#FFD8EA] flex items-center justify-center shadow-sm">
            <Lock className="w-5 h-5 text-[#FF4FA3] animate-pulse" />
          </div>
          <p className="text-xs text-[#98A0AE] font-semibold tracking-wider uppercase">
            Verifying admin credentials…
          </p>
        </div>
        <ToastContainer />
      </main>
    );
  }

  if (!isAuthPage && user && !isAuthorized) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FFF4F8] p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#FFD8EA] shadow-xl space-y-5 text-center">
          <div className="p-4 bg-[#FFF4F8] rounded-full inline-block">
            <Lock className="w-7 h-7 text-[#FF4FA3]" />
          </div>
          <h1 className="text-xl font-extrabold text-[#263550]">
            Admin access required
          </h1>
          <p className="text-sm text-[#667085] leading-relaxed">
            You're signed in as <strong>{user.email}</strong>, but this
            account doesn't have the <code>admin</code> custom claim yet.
          </p>
          <p className="text-xs text-[#98A0AE]">
            Run the following from <code className="px-1 rounded bg-[#F2F3F5] font-mono">neria_commerce</code>:
          </p>
          <pre className="text-[11px] font-mono text-[#263550] bg-[#1A1F36] text-[#FFD8EA] rounded-lg p-3 overflow-x-auto text-left">
            npm run grant:admin -- {user.email}
          </pre>
          <p className="text-[11px] text-[#98A0AE]">
            Then refresh this page — your browser will re-fetch the
            updated claim automatically.
          </p>
        </div>
        <ToastContainer />
      </main>
    );
  }

  if (isAuthPage || isImmersiveMode) {
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
      <AdminSidebar />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-68'
        }`}
      >
        <AdminHeader />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>

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
      <StorefrontCmsProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </StorefrontCmsProvider>
    </AdminProvider>
  );
}
