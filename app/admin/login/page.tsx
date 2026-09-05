'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { BunnyMascot } from '@/src/components/ui/BunnyMascot';
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  signInWithEmail,
  signInWithGoogle,
  friendlyAuthError,
  useAuthUser,
  useIsAdmin,
} from '@/src/lib/firebase/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const { addToast } = useAdmin();
  const { user, loading: authLoading } = useAuthUser();
  const { isAdmin, loading: claimLoading } = useIsAdmin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  // If already signed in and admin, bounce to the dashboard.
  useEffect(() => {
    if (authLoading || claimLoading) return;
    if (user && isAdmin) {
      router.replace('/admin');
    }
  }, [user, isAdmin, authLoading, claimLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmail(email, password);
      // Sign-in succeeded. The useEffect above will redirect once
      // `useIsAdmin` resolves the freshly-issued custom-claim token.
      addToast({
        type: 'success',
        title: 'Welcome back ♡',
        description: 'Verifying your admin credentials…',
      });
    } catch (err: any) {
      const code = typeof err?.code === 'string' ? err.code : 'unknown';
      setError(friendlyAuthError(code));
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      const code = typeof err?.code === 'string' ? err.code : 'unknown';
      setError(friendlyAuthError(code));
      setGoogleLoading(false);
    }
  };

  // After signing in, if we get an auth user but no admin claim, we
  // show a "not authorized" state with the exact command the user
  // needs to run to be promoted.
  const showNotAuthorized = !!user && !isAdmin && !authLoading && !claimLoading;

  return (
    <div className="min-h-screen flex">
      {/* Left Column: Neria Brand Showcase (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FFF4F8] border-r border-[#FFD8EA] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#FFD8EA]/40 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#CBE7FA]/40 blur-3xl" />

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

        <div className="relative z-10 max-w-md space-y-6 text-center mx-auto">
          <div className="p-6 rounded-full bg-white/70 backdrop-blur-md inline-block shadow-sm ring-8 ring-[#FFD8EA]/30">
            <BunnyMascot size="xl" mood="happy" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#263550] leading-tight">
            Curating sweet moments, dreamy silhouettes & modern fashion operations.
          </h1>
          <p className="text-xs text-[#667085] leading-relaxed">
            Welcome to the centralized internal commerce command center for Neria Collective.
          </p>
        </div>

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

          {showNotAuthorized ? (
            // ── Not authorized state ──
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-[#FFF7ED] border border-[#FED7AA] space-y-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#C2410C] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-[#9A3412]">
                      You're signed in, but not an admin yet.
                    </p>
                    <p className="text-xs text-[#7C2D12] mt-1 leading-relaxed">
                      Hi <strong>{user?.email}</strong> — your account
                      doesn't have the <code>admin</code> custom claim yet.
                      The site owner needs to grant you access from a
                      terminal:
                    </p>
                  </div>
                </div>
              </div>
              <pre className="p-4 rounded-xl bg-[#1A1F36] text-[#FFD8EA] text-[11px] font-mono leading-relaxed overflow-x-auto">
                cd neria_commerce{"\n"}
                npm run grant:admin -- {user?.email}
              </pre>
              <p className="text-[11px] text-[#667085]">
                Then refresh this page (your browser will re-fetch the
                updated claim automatically).
              </p>
              <Link
                href="/admin/login"
                className="text-xs font-semibold text-[#FF4FA3] hover:underline"
              >
                ← Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#263550] tracking-tight">
                  Sign In to Admin ♡
                </h2>
                <p className="text-xs text-[#667085] mt-1.5">
                  Enter your corporate credentials to manage your store.
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] flex items-start gap-2.5 text-xs text-[#B42318]">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

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
                      placeholder="you@neriacollective.com"
                      autoComplete="email"
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
                      autoComplete="current-password"
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
                  disabled={isLoading || googleLoading}
                  className="w-full neria-btn-primary py-3.5 text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#FF4FA3]/25 hover:shadow-lg hover:shadow-[#FF4FA3]/35 transition-all disabled:opacity-60"
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

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden>
                  <div className="w-full border-t border-[#F2F3F5]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-[11px] font-semibold text-[#98A0AE] uppercase tracking-wider">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={isLoading || googleLoading}
                className="w-full inline-flex items-center justify-center gap-2.5 py-3 rounded-xl border border-[#DDE1E7] hover:border-[#FFD8EA] hover:bg-[#FFF4F8] text-sm font-semibold text-[#263550] transition-all disabled:opacity-60"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    fill="#FFC107"
                    d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
                  />
                  <path
                    fill="#FF3D00"
                    d="m6.3 14.7 6.6 4.8C14.7 16.1 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4c-7.6 0-14.2 4.3-17.7 10.7z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.1 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8L6 32.5C9.6 39.1 16.3 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.6l6.2 5.2C41.7 35 44 30 44 24c0-1.3-.1-2.4-.4-3.5z"
                  />
                </svg>
                <span>{googleLoading ? 'Opening…' : 'Continue with Google'}</span>
              </button>

              <div className="p-4 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] space-y-1.5">
                <p className="text-[11px] font-bold text-[#263550] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF4FA3]" />
                  First time here?
                </p>
                <p className="text-[11px] text-[#667085] leading-relaxed">
                  The first admin must be promoted from a terminal in
                  <code className="px-1.5 py-0.5 mx-1 rounded bg-white border border-[#FFD8EA] text-[10px] text-[#263550] font-mono">
                    neria_commerce
                  </code>
                  :
                </p>
                <pre className="text-[10px] font-mono text-[#263550] bg-white border border-[#FFD8EA] rounded-lg p-2 mt-1 overflow-x-auto">
                  npm run grant:admin -- you@example.com
                </pre>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
