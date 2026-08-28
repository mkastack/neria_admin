'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { BunnyMascot } from '@/src/components/ui/BunnyMascot';
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { addToast } = useAdmin();

  const [email, setEmail] = useState('founder@neriacollective.com');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      addToast({
        type: 'success',
        title: 'Welcome back, Neria ♡',
        description: 'Successfully authenticated to Admin Console.'
      });
      router.push('/admin');
    }, 600);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column: Neria Brand Showcase (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FFF4F8] border-r border-[#FFD8EA] p-12 flex-col justify-between relative overflow-hidden">
        {/* Soft background decor circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#FFD8EA]/40 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#CBE7FA]/40 blur-3xl" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white border border-[#FFD8EA] flex items-center justify-center shadow-xs">
            <BunnyMascot size="sm" mood="happy" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-wider text-[#263550] uppercase font-sans">
              Neria <span className="text-[#FF4FA3]">Collective</span>
            </h2>
            <p className="text-[11px] font-bold text-[#98A0AE] tracking-widest uppercase">Admin Console</p>
          </div>
        </div>

        {/* Center Quote & Mascot Illustration */}
        <div className="relative z-10 max-w-md space-y-6 text-center mx-auto">
          <div className="p-6 rounded-full bg-white/70 backdrop-blur-md inline-block shadow-sm ring-8 ring-[#FFD8EA]/30">
            <BunnyMascot size="xl" mood="happy" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#263550] leading-tight">
            Curating sweet moments, dreamy silhouettes & modern fashion operations.
          </h1>
          <p className="text-xs text-[#667085] leading-relaxed">
            Welcome to the centralized internal commerce command center for Neria Collective Accra.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-[#98A0AE]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#12B76A]" /> Encrypted Operations Portal
          </span>
          <span>Neria Collective © 2026</span>
        </div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="flex-1 bg-white flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Brand Logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] flex items-center justify-center">
              <BunnyMascot size="sm" mood="happy" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#263550] uppercase">
                Neria <span className="text-[#FF4FA3]">Collective</span>
              </h2>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#263550] tracking-tight">
              Sign In to Admin ♡
            </h2>
            <p className="text-xs text-[#667085] mt-1.5">
              Enter your corporate credentials to manage your store.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1.5">Corporate Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#98A0AE] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@neriacollective.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] focus:border-[#FFD8EA] focus:ring-2 focus:ring-[#FFD8EA]/40 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#263550]">Password</label>
                <Link
                  href="/admin/forgot-password"
                  className="text-xs font-semibold text-[#FF4FA3] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#98A0AE] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] focus:border-[#FFD8EA] focus:ring-2 focus:ring-[#FFD8EA]/40 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-[#667085] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-[#FF4FA3] w-4 h-4 rounded"
                />
                <span>Remember this terminal</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full neria-btn-primary py-3.5 text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#FF4FA3]/25 hover:shadow-lg hover:shadow-[#FF4FA3]/35 transition-all"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="p-4 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] text-center">
            <p className="text-xs text-[#667085]">
              Demo Mode Active: Click <span className="font-bold text-[#FF4FA3]">Sign In</span> to enter directly with pre-loaded mock credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
