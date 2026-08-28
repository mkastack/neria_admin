'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BunnyMascot } from '@/src/components/ui/BunnyMascot';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF4F8] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#FFD8EA] shadow-xl space-y-6">
        <div className="text-center space-y-3">
          <div className="p-4 bg-[#FFF4F8] rounded-full inline-block">
            <BunnyMascot size="lg" mood={isSubmitted ? 'celebrate' : 'thinking'} />
          </div>
          <h1 className="text-2xl font-extrabold text-[#263550]">Reset Password</h1>
          <p className="text-xs text-[#667085]">
            {isSubmitted
              ? `A reset link has been dispatched to ${email}.`
              : 'Enter your administrative email to receive recovery instructions.'}
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#98A0AE] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@neriacollective.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full neria-btn-primary py-3 text-xs font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Recovery Link ♡</span>
            </button>
          </form>
        ) : (
          <div className="p-4 bg-[#ECFDF3] border border-[#ABEFC6] rounded-2xl text-xs text-[#027A48] text-center space-y-1">
            <CheckCircle2 className="w-5 h-5 mx-auto mb-1" />
            <p className="font-bold">Check your inbox</p>
            <p>Please click the link inside to verify your account.</p>
          </div>
        )}

        <div className="pt-2 text-center">
          <Link
            href="/admin/login"
            className="text-xs font-semibold text-[#667085] hover:text-[#FF4FA3] inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
