'use client';

import React, { useState } from 'react';
import { NewsletterSectionContent } from '@/src/lib/types';
import { BunnyMascot } from '../ui/BunnyMascot';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

interface StorefrontNewsletterProps {
  content: NewsletterSectionContent;
  isEditorMode?: boolean;
}

export function StorefrontNewsletter({ content, isEditorMode }: StorefrontNewsletterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FFF4F8] select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div
          style={{
            backgroundColor: content.bgColor || '#263550',
            color: content.textColor || '#FFFFFF'
          }}
          className="rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center transition-colors duration-300"
        >
          {/* Subtle Ambient Background circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF4FA3]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#CBE7FA]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Bunny Mascot Floating Top */}
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-md">
            <BunnyMascot size="sm" mood={content.bunnyMood || 'newsletter'} />
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-sans mb-3">
            {content.heading || 'Come into the Neria world. ♡'}
          </h2>

          {/* Description */}
          <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto mb-8 leading-relaxed">
            {content.description || 'Secret archive drops, private fashion previews, and early VIP access straight to your inbox.'}
          </p>

          {/* Signup Form */}
          {subscribed ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ECFDF3] text-[#027A48] text-xs font-bold shadow-md animate-in zoom-in-95">
              <CheckCircle2 className="w-4 h-4" />
              <span>{content.successMessage || 'Welcome to the club! 🩵'}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#98A0AE]" />
                <input
                  type="email"
                  required
                  placeholder={content.inputPlaceholder || 'Enter your sweetest email...'}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white text-[#263550] placeholder-[#98A0AE] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF4FA3] shadow-inner"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 rounded-full bg-[#FF4FA3] hover:bg-[#E63E90] text-white text-xs font-bold tracking-wide shadow-md transition-all hover:scale-102 flex items-center justify-center gap-2"
              >
                <span>{content.buttonText || 'Join the Club'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
